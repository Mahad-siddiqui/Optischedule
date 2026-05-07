import type {
  Batch,
  Course,
  Department,
  Period,
  Room,
  Section,
  SessionRequirement,
  Teacher,
  UniversityData
} from "../domain/types";

export class ScheduleContext {
  readonly periodsById: ReadonlyMap<string, Period>;
  readonly roomsById: ReadonlyMap<string, Room>;
  readonly departmentsById: ReadonlyMap<string, Department>;
  readonly batchesById: ReadonlyMap<string, Batch>;
  readonly sectionsById: ReadonlyMap<string, Section>;
  readonly teachersById: ReadonlyMap<string, Teacher>;
  readonly coursesById: ReadonlyMap<string, Course>;
  readonly requirementsById: ReadonlyMap<string, SessionRequirement>;

  constructor(readonly data: UniversityData) {
    this.periodsById = createMap(data.periods);
    this.roomsById = createMap(data.rooms);
    this.departmentsById = createMap(data.departments);
    this.batchesById = createMap(data.batches);
    this.sectionsById = createMap(data.sections);
    this.teachersById = createMap(data.teachers);
    this.coursesById = createMap(data.courses);
    this.requirementsById = createMap(data.requirements);
  }

  periodOrThrow(periodId: string): Period {
    return getOrThrow(this.periodsById, periodId, "period");
  }

  roomOrThrow(roomId: string): Room {
    return getOrThrow(this.roomsById, roomId, "room");
  }

  sectionOrThrow(sectionId: string): Section {
    return getOrThrow(this.sectionsById, sectionId, "section");
  }

  teacherOrThrow(teacherId: string): Teacher {
    return getOrThrow(this.teachersById, teacherId, "teacher");
  }

  courseOrThrow(courseId: string): Course {
    return getOrThrow(this.coursesById, courseId, "course");
  }
}

function createMap<T extends { id: string }>(items: T[]): ReadonlyMap<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

function getOrThrow<T>(
  map: ReadonlyMap<string, T>,
  id: string,
  label: string
): T {
  const value = map.get(id);
  if (!value) {
    throw new Error(`Unknown ${label} id: ${id}`);
  }

  return value;
}
