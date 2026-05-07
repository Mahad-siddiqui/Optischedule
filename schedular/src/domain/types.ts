export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export type SessionType = "THEORY" | "LAB";

export interface Period {
  id: string;
  index: number;
  label: string;
  start: string;
  end: string;
  isBreak: boolean;
}

export interface TimeSlot {
  id: string;
  day: Day;
  periodId: string;
  label: string;
  isBreak: boolean;
}

export interface Department {
  id: string;
  code: string;
  name: string;
}

export interface Batch {
  id: string;
  departmentId: string;
  batchCode: string;
  admissionYear: number;
  currentAcademicYear: number;
  semester: number;
  degreeYears: number;
  totalSemesters: number;
  label: string;
}

export interface Section {
  id: string;
  departmentId: string;
  batchId: string;
  name: string;
  label: string;
  studentCount: number;
}

export interface Room {
  id: string;
  name: string;
  isLab: boolean;
  capacity: number;
}

export interface Teacher {
  id: string;
  departmentId: string;
  title: string;
  name: string;
  maxClassesPerWeek: number;
}

export interface CreditHours {
  theory: 2 | 3;
  lab: 0 | 1;
}

export interface Course {
  id: string;
  departmentId: string;
  teacherId: string;
  semester: number;
  code: string;
  name: string;
  creditHours: CreditHours;
}

export interface SessionRequirement {
  id: string;
  departmentId: string;
  batchId: string;
  sectionId: string;
  courseId: string;
  teacherId: string;
  sessionType: SessionType;
  durationPeriods: number;
  sequence: number;
  displayName: string;
}

export interface UniversityData {
  academic: {
    currentYear: number;
    degreeName: string;
    degreeYears: number;
    totalSemesters: number;
    activeBatchCodes: string[];
  };
  periods: Period[];
  timeslots: TimeSlot[];
  departments: Department[];
  batches: Batch[];
  sections: Section[];
  rooms: Room[];
  teachers: Teacher[];
  courses: Course[];
  requirements: SessionRequirement[];
}

export interface GeneSnapshot {
  requirementId: string;
  departmentId: string;
  batchId: string;
  sectionId: string;
  courseId: string;
  teacherId: string;
  sessionType: SessionType;
  durationPeriods: number;
  day: Day;
  startPeriodId: string;
  roomId: string;
}

export interface OccupiedSlot {
  day: Day;
  periodId: string;
  periodIndex: number;
}

export interface ConstraintBreakdown {
  roomClashes: number;
  teacherClashes: number;
  studentClashes: number;
  roomTypeMismatches: number;
  capacityViolations: number;
  breakViolations: number;
  durationViolations: number;
}

export interface FitnessReport {
  score: number;
  hardViolations: number;
  hardPenalty: number;
  softPenalty: number;
  softBreakdown: {
    studentGaps: number;
    teacherFragmentation: number;
    teacherOverload: number;
    earlyFinish: number;
    studentActiveDays: number;
    campusSpan: number;
  };
  hardBreakdown: ConstraintBreakdown;
}
