export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type SessionType = "THEORY" | "LAB";

export type SemesterFilterValue = "all" | "2" | "4" | "6" | "8";

export type SectionFilterValue = "all" | "A" | "B";

export interface EAParams {
  populationSize: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  eliteCount: number;
  tournamentSize: number;
  simSteps: number;
  spawnRate: number;
  theoryRooms: number;
  labRooms: number;
  totalTeachers: number;
}

export const DEFAULT_EA_PARAMS: EAParams = {
  populationSize: 120,
  generations: 500,
  crossoverRate: 0.85,
  mutationRate: 0.05,
  eliteCount: 4,
  tournamentSize: 5,
  simSteps: 50,
  spawnRate: 0.12,
  theoryRooms: 8,
  labRooms: 5,
  totalTeachers: 12,
};

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

// SSE Event types
export interface SSEGenerationEvent {
  type: "generation";
  generation: number;
  maxGenerations: number;
  best: {
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
    hardBreakdown: {
      roomClashes: number;
      teacherClashes: number;
      studentClashes: number;
      roomTypeMismatches: number;
      capacityViolations: number;
      breakViolations: number;
      durationViolations: number;
    };
  };
  average: number;
  geneSnapshot: Array<{
    requirementId: string;
    courseName: string;
    day: string;
    startPeriod: string;
    room: string;
    teacher: string;
    sessionType: string;
  }>;
  crossoverInfo: {
    strategy: string;
    parentAFitness: number;
    parentBFitness: number;
    childFitness: number;
  } | null;
  mutationInfo: {
    genesAffected: number;
    totalGenes: number;
  } | null;
  log: string;
}

export interface FitnessDataPoint {
  generation: number;
  fitness: number;
  average: number;
  hardViolations: number;
  softPenalty: number;
}

export interface LogEntry {
  id: number;
  generation: number;
  message: string;
  type: "info" | "success" | "warning" | "mutation" | "crossover";
  timestamp: number;
}
