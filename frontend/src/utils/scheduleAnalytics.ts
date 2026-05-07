import { DAYS, TIME_SLOTS } from "../data/mockSchedule";
import type { Day, ScheduleGene } from "../types/schedule";

export interface DailyLoadPoint {
  day: Day;
  classHours: number;
  gapHours: number;
  campusSpan: number;
}

export interface SectionEfficiencyPoint {
  section: string;
  teachingHours: number;
  gapHours: number;
  activeDays: number;
  daysOff: number;
  efficiency: number;
}

export interface TypeSplitPoint {
  name: string;
  value: number;
}

export interface RoomUsagePoint {
  room: string;
  hours: number;
}

export interface ScheduleAnalyticsSummary {
  totalTeachingHours: number;
  totalGapHours: number;
  averageDaysOff: number;
  averageActiveDays: number;
  averageEfficiency: number;
  earliestStart: string;
  latestFinish: string;
}

export interface ScheduleAnalyticsResult {
  summary: ScheduleAnalyticsSummary;
  dailyLoad: DailyLoadPoint[];
  sectionEfficiency: SectionEfficiencyPoint[];
  typeSplit: TypeSplitPoint[];
  roomUsage: RoomUsagePoint[];
}

export function analyzeSchedule(genes: ScheduleGene[]): ScheduleAnalyticsResult {
  const sectionDayPeriods = new Map<string, Map<Day, Set<number>>>();
  const dayPeriods = new Map<Day, number>();
  const typeSplit = new Map<string, number>();
  const roomUsage = new Map<string, number>();

  for (const gene of genes) {
    typeSplit.set(gene.type, (typeSplit.get(gene.type) ?? 0) + gene.duration);
    roomUsage.set(gene.roomName, (roomUsage.get(gene.roomName) ?? 0) + gene.duration);
    dayPeriods.set(gene.day, (dayPeriods.get(gene.day) ?? 0) + gene.duration);

    const sectionDays =
      sectionDayPeriods.get(gene.sectionLabel) ?? new Map<Day, Set<number>>();
    const periods = sectionDays.get(gene.day) ?? new Set<number>();

    for (const periodIndex of getOccupiedPeriodIndexes(gene)) {
      periods.add(periodIndex);
    }

    sectionDays.set(gene.day, periods);
    sectionDayPeriods.set(gene.sectionLabel, sectionDays);
  }

  const dailyLoad = DAYS.map((day) => {
    const allPeriodsForDay = [...sectionDayPeriods.values()].flatMap((sectionDays) => [
      ...(sectionDays.get(day) ?? new Set<number>())
    ]);
    const classHours = dayPeriods.get(day) ?? 0;
    const gapHours = calculateAggregateGapHours(sectionDayPeriods, day);

    return {
      day,
      classHours,
      gapHours,
      campusSpan: allPeriodsForDay.length > 0 ? Math.max(...allPeriodsForDay) - Math.min(...allPeriodsForDay) + 1 : 0
    };
  });

  const sectionEfficiency = [...sectionDayPeriods.entries()]
    .map(([section, days]) => {
      let teachingHours = 0;
      let gapHours = 0;
      let campusSpan = 0;

      for (const periods of days.values()) {
        const dayStats = calculateDayStats(periods);
        teachingHours += dayStats.teachingHours;
        gapHours += dayStats.gapHours;
        campusSpan += dayStats.campusSpan;
      }

      const activeDays = days.size;
      const daysOff = DAYS.length - activeDays;
      const efficiency = campusSpan === 0 ? 100 : Math.round((teachingHours / campusSpan) * 100);

      return {
        section,
        teachingHours,
        gapHours,
        activeDays,
        daysOff,
        efficiency
      };
    })
    .sort((left, right) => left.section.localeCompare(right.section));

  const totalTeachingHours = sectionEfficiency.reduce(
    (total, section) => total + section.teachingHours,
    0
  );
  const totalGapHours = sectionEfficiency.reduce((total, section) => total + section.gapHours, 0);
  const averageDaysOff =
    sectionEfficiency.length === 0
      ? 0
      : sectionEfficiency.reduce((total, section) => total + section.daysOff, 0) /
        sectionEfficiency.length;
  const averageActiveDays =
    sectionEfficiency.length === 0
      ? 0
      : sectionEfficiency.reduce((total, section) => total + section.activeDays, 0) /
        sectionEfficiency.length;
  const averageEfficiency =
    sectionEfficiency.length === 0
      ? 0
      : sectionEfficiency.reduce((total, section) => total + section.efficiency, 0) /
        sectionEfficiency.length;

  return {
    summary: {
      totalTeachingHours,
      totalGapHours,
      averageDaysOff,
      averageActiveDays,
      averageEfficiency,
      earliestStart: getBoundaryTime(genes, "start"),
      latestFinish: getBoundaryTime(genes, "finish")
    },
    dailyLoad,
    sectionEfficiency,
    typeSplit: [...typeSplit.entries()].map(([name, value]) => ({ name, value })),
    roomUsage: [...roomUsage.entries()]
      .map(([room, hours]) => ({ room, hours }))
      .sort((left, right) => right.hours - left.hours)
      .slice(0, 7)
  };
}

function getOccupiedPeriodIndexes(gene: ScheduleGene): number[] {
  const startIndex = TIME_SLOTS.findIndex((slot) => slot.startTime === gene.startTime);
  if (startIndex < 0) {
    return [];
  }

  return Array.from({ length: gene.duration }, (_, offset) => startIndex + offset).filter(
    (index) => !TIME_SLOTS[index]?.isBreak
  );
}

function calculateAggregateGapHours(
  sectionDayPeriods: Map<string, Map<Day, Set<number>>>,
  day: Day
): number {
  let gapHours = 0;

  for (const sectionDays of sectionDayPeriods.values()) {
    gapHours += calculateDayStats(sectionDays.get(day) ?? new Set<number>()).gapHours;
  }

  return gapHours;
}

function calculateDayStats(periods: Set<number>): {
  teachingHours: number;
  campusSpan: number;
  gapHours: number;
} {
  if (periods.size === 0) {
    return {
      teachingHours: 0,
      campusSpan: 0,
      gapHours: 0
    };
  }

  const sorted = [...periods].sort((left, right) => left - right);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const breakCount = TIME_SLOTS.filter(
    (slot, index) => slot.isBreak && index >= first && index <= last
  ).length;
  const campusSpan = last - first + 1 - breakCount;
  const teachingHours = periods.size;

  return {
    teachingHours,
    campusSpan,
    gapHours: Math.max(0, campusSpan - teachingHours)
  };
}

function getBoundaryTime(genes: ScheduleGene[], boundary: "start" | "finish"): string {
  if (genes.length === 0) {
    return "--";
  }

  const values = genes.map((gene) => (boundary === "start" ? gene.startTime : gene.endTime)).sort();
  return boundary === "start" ? values[0] : values[values.length - 1];
}
