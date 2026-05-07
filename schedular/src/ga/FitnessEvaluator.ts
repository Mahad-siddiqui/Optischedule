import type {
  ConstraintBreakdown,
  FitnessReport,
  OccupiedSlot,
  UniversityData
} from "../domain/types";
import { Gene } from "./Gene";
import { ScheduleContext } from "./ScheduleContext";

const HARD_PENALTIES: Record<keyof ConstraintBreakdown, number> = {
  roomClashes: 1000,
  teacherClashes: 1200,
  studentClashes: 1500,
  roomTypeMismatches: 1000,
  capacityViolations: 1000,
  breakViolations: 2000,
  durationViolations: 2000
};

export class FitnessEvaluator {
  private readonly context: ScheduleContext;

  constructor(private readonly data: UniversityData) {
    this.context = new ScheduleContext(data);
  }

  evaluate(genes: Gene[]): FitnessReport {
    const hardBreakdown: ConstraintBreakdown = {
      roomClashes: 0,
      teacherClashes: 0,
      studentClashes: 0,
      roomTypeMismatches: 0,
      capacityViolations: 0,
      breakViolations: 0,
      durationViolations: 0
    };

    const roomOccupancy = new Map<string, Gene[]>();
    const teacherOccupancy = new Map<string, Gene[]>();
    const studentOccupancy = new Map<string, Gene[]>();
    const sectionDayPeriods = new Map<string, Set<number>>();
    const teacherDayPeriods = new Map<string, Set<number>>();
    const teacherWeeklyLoad = new Map<string, number>();

    for (const gene of genes) {
      const room = this.context.roomOrThrow(gene.roomId);
      const section = this.context.sectionOrThrow(gene.sectionId);
      const occupiedSlots = gene.occupiedSlots(this.data);

      if (gene.sessionType === "LAB" && !room.isLab) {
        hardBreakdown.roomTypeMismatches += 1;
      }

      if (gene.sessionType === "THEORY" && room.isLab) {
        hardBreakdown.roomTypeMismatches += 1;
      }

      if (section.studentCount > room.capacity) {
        hardBreakdown.capacityViolations += 1;
      }

      if (this.hasBreakViolation(occupiedSlots)) {
        hardBreakdown.breakViolations += 1;
      }

      if (gene.sessionType === "THEORY" && gene.durationPeriods > 2) {
        hardBreakdown.durationViolations += 1;
      }

      if (gene.sessionType === "LAB" && gene.durationPeriods !== 3) {
        hardBreakdown.durationViolations += 1;
      }

      teacherWeeklyLoad.set(
        gene.teacherId,
        (teacherWeeklyLoad.get(gene.teacherId) ?? 0) + occupiedSlots.length
      );

      for (const occupiedSlot of occupiedSlots) {
        const timeKey = `${occupiedSlot.day}:${occupiedSlot.periodId}`;
        pushMap(roomOccupancy, `${gene.roomId}:${timeKey}`, gene);
        pushMap(teacherOccupancy, `${gene.teacherId}:${timeKey}`, gene);
        pushMap(studentOccupancy, `${gene.sectionId}:${timeKey}`, gene);

        const period = this.context.periodOrThrow(occupiedSlot.periodId);
        if (!period.isBreak) {
          addPeriod(sectionDayPeriods, `${gene.sectionId}:${occupiedSlot.day}`, occupiedSlot.periodIndex);
          addPeriod(teacherDayPeriods, `${gene.teacherId}:${occupiedSlot.day}`, occupiedSlot.periodIndex);
        }
      }
    }

    hardBreakdown.roomClashes = countClashes(roomOccupancy);
    hardBreakdown.teacherClashes = countClashes(teacherOccupancy);
    hardBreakdown.studentClashes = countClashes(studentOccupancy);

    const studentGaps = calculateStudentGapPenalty(sectionDayPeriods, this.data);
    const teacherFragmentation = calculateTeacherFragmentationPenalty(teacherDayPeriods, this.data);
    const teacherOverload = calculateTeacherOverloadPenalty(teacherWeeklyLoad, this.context);
    const earlyFinish = calculateEarlyFinishPenalty(sectionDayPeriods, this.data);
    const studentActiveDays = calculateStudentActiveDayPenalty(sectionDayPeriods, this.data);
    const campusSpan = calculateCampusSpanPenalty(sectionDayPeriods, this.data);
    const softPenalty =
      studentGaps +
      teacherFragmentation +
      teacherOverload +
      earlyFinish +
      studentActiveDays +
      campusSpan;
    const hardPenalty = Object.entries(hardBreakdown).reduce((total, [key, count]) => {
      const penaltyKey = key as keyof ConstraintBreakdown;
      return total + count * HARD_PENALTIES[penaltyKey];
    }, 0);
    const hardViolations = Object.values(hardBreakdown).reduce((total, count) => total + count, 0);

    return {
      score: 1000 - hardPenalty - softPenalty,
      hardViolations,
      hardPenalty,
      softPenalty,
      softBreakdown: {
        studentGaps,
        teacherFragmentation,
        teacherOverload,
        earlyFinish,
        studentActiveDays,
        campusSpan
      },
      hardBreakdown
    };
  }

  private hasBreakViolation(occupiedSlots: OccupiedSlot[]): boolean {
    return occupiedSlots.some((slot) => this.context.periodOrThrow(slot.periodId).isBreak);
  }
}

function pushMap<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const values = map.get(key) ?? [];
  values.push(value);
  map.set(key, values);
}

function addPeriod(map: Map<string, Set<number>>, key: string, periodIndex: number): void {
  const periods = map.get(key) ?? new Set<number>();
  periods.add(periodIndex);
  map.set(key, periods);
}

function countClashes(map: Map<string, Gene[]>): number {
  let clashes = 0;

  for (const genes of map.values()) {
    if (genes.length > 1) {
      clashes += genes.length - 1;
    }
  }

  return clashes;
}

function calculateStudentGapPenalty(
  sectionDayPeriods: Map<string, Set<number>>,
  data: UniversityData
): number {
  let penalty = 0;

  for (const periods of sectionDayPeriods.values()) {
    const sortedPeriods = [...periods].sort((left, right) => left - right);

    for (let index = 1; index < sortedPeriods.length; index += 1) {
      const previous = sortedPeriods[index - 1];
      const current = sortedPeriods[index];
      const breakPeriodsBetween = data.periods.filter(
        (period) => period.isBreak && period.index > previous && period.index < current
      ).length;
      const emptyPeriodsBetween = current - previous - 1 - breakPeriodsBetween;

      if (emptyPeriodsBetween > 0) {
        penalty += emptyPeriodsBetween * 35;
      }

      if (emptyPeriodsBetween > 1) {
        penalty += (emptyPeriodsBetween - 1) * 30;
      }
    }
  }

  return penalty;
}

function calculateEarlyFinishPenalty(
  sectionDayPeriods: Map<string, Set<number>>,
  data: UniversityData
): number {
  let penalty = 0;

  for (const periods of sectionDayPeriods.values()) {
    if (periods.size === 0) {
      continue;
    }

    const latestPeriodIndex = Math.max(...periods);
    const latestPeriod = data.periods.find((period) => period.index === latestPeriodIndex);
    if (!latestPeriod || latestPeriod.isBreak) {
      continue;
    }

    // Later finishes hurt more. P6/P7/P8 classes are allowed, but selected only when needed.
    penalty += Math.max(0, latestPeriodIndex - 2) * 8;
  }

  return penalty;
}

function calculateStudentActiveDayPenalty(
  sectionDayPeriods: Map<string, Set<number>>,
  data: UniversityData
): number {
  const sectionDays = groupSectionDays(sectionDayPeriods);
  const availablePeriodsPerDay = data.periods.filter((period) => !period.isBreak).length;
  let penalty = 0;

  for (const days of sectionDays.values()) {
    const activeDays = days.size;
    const totalTeachingPeriods = [...days.values()].reduce(
      (total, periods) => total + periods.size,
      0
    );
    const idealActiveDays = Math.max(1, Math.ceil(totalTeachingPeriods / availablePeriodsPerDay));
    const extraCampusDays = Math.max(0, activeDays - idealActiveDays);

    penalty += extraCampusDays * 90;
  }

  return penalty;
}

function calculateCampusSpanPenalty(
  sectionDayPeriods: Map<string, Set<number>>,
  data: UniversityData
): number {
  const sectionDays = groupSectionDays(sectionDayPeriods);
  let penalty = 0;

  for (const days of sectionDays.values()) {
    for (const periods of days.values()) {
      const sortedPeriods = [...periods].sort((left, right) => left - right);
      if (sortedPeriods.length === 0) {
        continue;
      }

      const first = sortedPeriods[0];
      const last = sortedPeriods[sortedPeriods.length - 1];
      const breaksInsideSpan = data.periods.filter(
        (period) => period.isBreak && period.index >= first && period.index <= last
      ).length;
      const campusSpan = last - first + 1 - breaksInsideSpan;
      const wastedPeriods = Math.max(0, campusSpan - sortedPeriods.length);

      penalty += wastedPeriods * 24;
    }
  }

  return penalty;
}

function groupSectionDays(
  sectionDayPeriods: Map<string, Set<number>>
): Map<string, Map<string, Set<number>>> {
  const sectionDays = new Map<string, Map<string, Set<number>>>();

  for (const [key, periods] of sectionDayPeriods.entries()) {
    const [sectionId, day] = key.split(":");
    const days = sectionDays.get(sectionId) ?? new Map<string, Set<number>>();
    days.set(day, periods);
    sectionDays.set(sectionId, days);
  }

  return sectionDays;
}

function calculateTeacherFragmentationPenalty(
  teacherDayPeriods: Map<string, Set<number>>,
  data: UniversityData
): number {
  let penalty = 0;

  for (const periods of teacherDayPeriods.values()) {
    const sortedPeriods = [...periods].sort((left, right) => left - right);
    if (sortedPeriods.length <= 1) {
      continue;
    }

    const first = sortedPeriods[0];
    const last = sortedPeriods[sortedPeriods.length - 1];
    const breakPeriodsWithinSpan = data.periods.filter(
      (period) => period.isBreak && period.index >= first && period.index <= last
    ).length;
    const teachingSpan = last - first + 1 - breakPeriodsWithinSpan;
    const idlePeriods = teachingSpan - sortedPeriods.length;

    if (idlePeriods > 1) {
      penalty += idlePeriods * 3;
    }
  }

  return penalty;
}

function calculateTeacherOverloadPenalty(
  teacherWeeklyLoad: Map<string, number>,
  context: ScheduleContext
): number {
  let penalty = 0;

  for (const [teacherId, weeklyLoad] of teacherWeeklyLoad.entries()) {
    const teacher = context.teacherOrThrow(teacherId);
    if (weeklyLoad > teacher.maxClassesPerWeek) {
      penalty += (weeklyLoad - teacher.maxClassesPerWeek) * 6;
    }
  }

  return penalty;
}
