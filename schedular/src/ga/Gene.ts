import { DAYS } from "../domain/constants";
import type {
  Day,
  GeneSnapshot,
  OccupiedSlot,
  Room,
  SessionRequirement,
  UniversityData
} from "../domain/types";
import { Random } from "../utils/random";

export class Gene {
  requirementId: string;
  departmentId: string;
  batchId: string;
  sectionId: string;
  courseId: string;
  teacherId: string;
  sessionType: "THEORY" | "LAB";
  durationPeriods: number;
  day: Day;
  startPeriodId: string;
  roomId: string;

  constructor(snapshot: GeneSnapshot) {
    this.requirementId = snapshot.requirementId;
    this.departmentId = snapshot.departmentId;
    this.batchId = snapshot.batchId;
    this.sectionId = snapshot.sectionId;
    this.courseId = snapshot.courseId;
    this.teacherId = snapshot.teacherId;
    this.sessionType = snapshot.sessionType;
    this.durationPeriods = snapshot.durationPeriods;
    this.day = snapshot.day;
    this.startPeriodId = snapshot.startPeriodId;
    this.roomId = snapshot.roomId;
  }

  static random(requirement: SessionRequirement, data: UniversityData, random: Random): Gene {
    const room = pickRoom(requirement, data.rooms, random);
    const startPeriodId = random.pick(getValidStartPeriodIds(data, requirement.durationPeriods));

    return new Gene({
      requirementId: requirement.id,
      departmentId: requirement.departmentId,
      batchId: requirement.batchId,
      sectionId: requirement.sectionId,
      courseId: requirement.courseId,
      teacherId: requirement.teacherId,
      sessionType: requirement.sessionType,
      durationPeriods: requirement.durationPeriods,
      day: pickStudentFriendlyDay(data, requirement.sectionId, random),
      startPeriodId,
      roomId: room.id
    });
  }

  clone(): Gene {
    return new Gene(this.toSnapshot());
  }

  toSnapshot(): GeneSnapshot {
    return {
      requirementId: this.requirementId,
      departmentId: this.departmentId,
      batchId: this.batchId,
      sectionId: this.sectionId,
      courseId: this.courseId,
      teacherId: this.teacherId,
      sessionType: this.sessionType,
      durationPeriods: this.durationPeriods,
      day: this.day,
      startPeriodId: this.startPeriodId,
      roomId: this.roomId
    };
  }

  occupiedSlots(data: UniversityData): OccupiedSlot[] {
    const startPeriod = data.periods.find((period) => period.id === this.startPeriodId);
    if (!startPeriod) {
      return [];
    }

    const occupied: OccupiedSlot[] = [];
    for (let offset = 0; offset < this.durationPeriods; offset += 1) {
      const period = data.periods.find((candidate) => candidate.index === startPeriod.index + offset);
      if (!period) {
        continue;
      }

      occupied.push({
        day: this.day,
        periodId: period.id,
        periodIndex: period.index
      });
    }

    return occupied;
  }

  mutate(data: UniversityData, random: Random): void {
    const mutationKind = random.pick(["ROOM", "TIME", "ROOM_AND_TIME"] as const);

    if (mutationKind === "ROOM" || mutationKind === "ROOM_AND_TIME") {
      this.roomId = pickRoom(this, data.rooms, random).id;
    }

    if (mutationKind === "TIME" || mutationKind === "ROOM_AND_TIME") {
      this.day = pickStudentFriendlyDay(data, this.sectionId, random);
      this.startPeriodId = random.pick(getValidStartPeriodIds(data, this.durationPeriods));
    }
  }
}

export function getValidStartPeriodIds(data: UniversityData, durationPeriods: number): string[] {
  return data.periods
    .filter((period) => {
      const block = data.periods.filter(
        (candidate) =>
          candidate.index >= period.index && candidate.index < period.index + durationPeriods
      );

      return block.length === durationPeriods && block.every((candidate) => !candidate.isBreak);
    })
    .map((period) => period.id);
}

function pickRoom(
  requirement: Pick<SessionRequirement, "sessionType">,
  rooms: Room[],
  random: Random
): Room {
  const matchingRooms = rooms.filter((room) =>
    requirement.sessionType === "LAB" ? room.isLab : !room.isLab
  );

  if (matchingRooms.length === 0) {
    return random.pick(rooms);
  }

  return random.pick(matchingRooms);
}

function pickStudentFriendlyDay(data: UniversityData, sectionId: string, random: Random): Day {
  const section = data.sections.find((candidate) => candidate.id === sectionId);

  if (!section || random.chance(0.12)) {
    return random.pick(DAYS);
  }

  if (section.name.endsWith("A")) {
    return random.pick(["Monday", "Tuesday", "Wednesday"] as const);
  }

  if (section.name.endsWith("B")) {
    return random.pick(["Wednesday", "Thursday", "Friday"] as const);
  }

  return random.pick(DAYS);
}
