export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type SessionType = "THEORY" | "LAB";

export type SemesterFilterValue = "all" | "2" | "4" | "6" | "8";

export type SectionFilterValue = "all" | "A" | "B";

export interface ScheduleGene {
  id: string;
  courseCode: string;
  courseName: string;
  teacherName: string;
  roomName: string;
  batch: string;
  semester: 2 | 4 | 6 | 8;
  section: "A" | "B";
  sectionLabel: string;
  day: Day;
  startTime: string;
  endTime: string;
  duration: number;
  type: SessionType;
}

export interface ScheduleMetrics {
  fitnessScore: number;
  hardConflicts: number;
  softPenalty: number;
  roomClashes: number;
  teacherClashes: number;
  studentClashes: number;
  totalClasses: number;
  totalRooms: number;
  totalLabs: number;
  totalTeachers: number;
}

export interface SchedulePayload {
  generatedAt: string;
  metrics: ScheduleMetrics;
  genes: ScheduleGene[];
}

export interface GenerationResponse {
  message: string;
  schedule: SchedulePayload;
}

export interface TimetableFilters {
  semester: SemesterFilterValue;
  section: SectionFilterValue;
  teacher: string;
  room: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  isBreak: boolean;
}
