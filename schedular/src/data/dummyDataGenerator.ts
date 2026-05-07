import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DAYS, PERIODS } from "../domain/constants";
import type {
  Batch,
  Course,
  Department,
  Room,
  Section,
  SessionRequirement,
  Teacher,
  TimeSlot,
  UniversityData
} from "../domain/types";

interface CourseSeed {
  code: string;
  name: string;
  semester: number;
  theory: 2 | 3;
  lab: 0 | 1;
  teacherKey: string;
}

interface BatchSeed {
  batchCode: string;
  admissionYear: number;
  currentSemester: number;
  sectionStudentCounts: number[];
}

const academic = {
  currentYear: 2026,
  degreeName: "BS Computer Science",
  degreeYears: 4,
  totalSemesters: 8,
  activeBatchCodes: ["22F", "23F", "24F", "25F"]
};

const departmentSeeds: Department[] = [
  {
    id: "dept-cse",
    code: "CSE",
    name: "Computer Science & Engineering"
  }
];

const batchSeeds: BatchSeed[] = [
  {
    batchCode: "22F",
    admissionYear: 2022,
    currentSemester: 8,
    sectionStudentCounts: [38]
  },
  {
    batchCode: "23F",
    admissionYear: 2023,
    currentSemester: 6,
    sectionStudentCounts: [36, 34]
  },
  {
    batchCode: "24F",
    admissionYear: 2024,
    currentSemester: 4,
    sectionStudentCounts: [39, 38]
  },
  {
    batchCode: "25F",
    admissionYear: 2025,
    currentSemester: 2,
    sectionStudentCounts: [40, 39]
  }
];

const teacherSeeds: Array<Omit<Teacher, "id" | "departmentId"> & { key: string }> = [
  { key: "asma", title: "Dr.", name: "Asma Sanam Larik", maxClassesPerWeek: 16 },
  { key: "farhan", title: "Engr.", name: "Farhan Ahmed", maxClassesPerWeek: 16 },
  { key: "hira", title: "Ms.", name: "Hira Siddiqui", maxClassesPerWeek: 15 },
  { key: "kamran", title: "Mr.", name: "Kamran Ali", maxClassesPerWeek: 15 },
  { key: "sanaullah", title: "Dr.", name: "Sanaullah Shaikh", maxClassesPerWeek: 16 },
  { key: "nida", title: "Ms.", name: "Nida Memon", maxClassesPerWeek: 14 },
  { key: "saad", title: "Engr.", name: "Saad Qureshi", maxClassesPerWeek: 15 },
  { key: "ayesha", title: "Dr.", name: "Ayesha Noor", maxClassesPerWeek: 16 },
  { key: "bilal", title: "Mr.", name: "Bilal Khan", maxClassesPerWeek: 14 },
  { key: "mahnoor", title: "Ms.", name: "Mahnoor Raza", maxClassesPerWeek: 14 },
  { key: "zain", title: "Engr.", name: "Zain Siddiqui", maxClassesPerWeek: 15 },
  { key: "sadia", title: "Dr.", name: "Sadia Akhtar", maxClassesPerWeek: 15 }
];

const courseSeeds: CourseSeed[] = [
  { code: "CSC-101", name: "Introduction to ICT", semester: 1, theory: 3, lab: 1, teacherKey: "farhan" },
  { code: "CSC-102", name: "Programming Fundamentals", semester: 1, theory: 3, lab: 1, teacherKey: "kamran" },
  { code: "MTH-101", name: "Calculus and Analytical Geometry", semester: 1, theory: 3, lab: 0, teacherKey: "nida" },
  { code: "ENG-101", name: "Functional English", semester: 1, theory: 2, lab: 0, teacherKey: "mahnoor" },
  { code: "PHY-101", name: "Applied Physics", semester: 1, theory: 3, lab: 0, teacherKey: "saad" },

  { code: "CSC-121", name: "Object Oriented Programming", semester: 2, theory: 3, lab: 1, teacherKey: "kamran" },
  { code: "CSC-122", name: "Digital Logic Design", semester: 2, theory: 3, lab: 1, teacherKey: "saad" },
  { code: "MTH-124", name: "Linear Algebra", semester: 2, theory: 3, lab: 0, teacherKey: "nida" },
  { code: "HUM-102", name: "Islamic Studies", semester: 2, theory: 2, lab: 0, teacherKey: "mahnoor" },
  { code: "CSC-123", name: "Discrete Structures", semester: 2, theory: 3, lab: 0, teacherKey: "hira" },

  { code: "CSC-231", name: "Data Structures and Algorithms", semester: 3, theory: 3, lab: 1, teacherKey: "hira" },
  { code: "CSC-232", name: "Computer Organization", semester: 3, theory: 3, lab: 1, teacherKey: "zain" },
  { code: "MTH-231", name: "Probability and Statistics", semester: 3, theory: 3, lab: 0, teacherKey: "nida" },
  { code: "ENG-231", name: "Technical Writing", semester: 3, theory: 2, lab: 0, teacherKey: "mahnoor" },
  { code: "CSC-233", name: "Database Fundamentals", semester: 3, theory: 3, lab: 0, teacherKey: "farhan" },

  { code: "CSC-241", name: "Database Systems", semester: 4, theory: 3, lab: 1, teacherKey: "farhan" },
  { code: "CSC-242", name: "Operating Systems", semester: 4, theory: 3, lab: 1, teacherKey: "zain" },
  { code: "CSC-243", name: "Theory of Automata", semester: 4, theory: 3, lab: 0, teacherKey: "asma" },
  { code: "CSC-244", name: "Software Engineering", semester: 4, theory: 3, lab: 0, teacherKey: "bilal" },
  { code: "MTH-242", name: "Numerical Computing", semester: 4, theory: 2, lab: 0, teacherKey: "nida" },

  { code: "CSC-351", name: "Computer Networks", semester: 5, theory: 3, lab: 1, teacherKey: "sanaullah" },
  { code: "CSC-352", name: "Web Engineering", semester: 5, theory: 3, lab: 1, teacherKey: "kamran" },
  { code: "CSC-353", name: "Design and Analysis of Algorithms", semester: 5, theory: 3, lab: 0, teacherKey: "hira" },
  { code: "CSC-354", name: "Compiler Construction", semester: 5, theory: 3, lab: 0, teacherKey: "ayesha" },
  { code: "HUM-351", name: "Professional Practices", semester: 5, theory: 2, lab: 0, teacherKey: "bilal" },

  { code: "CSC-361", name: "Artificial Intelligence", semester: 6, theory: 3, lab: 1, teacherKey: "ayesha" },
  { code: "CSC-362", name: "Mobile Application Development", semester: 6, theory: 3, lab: 1, teacherKey: "zain" },
  { code: "CSC-363", name: "Information Security", semester: 6, theory: 3, lab: 0, teacherKey: "sanaullah" },
  { code: "CSC-364", name: "Parallel and Distributed Computing", semester: 6, theory: 3, lab: 0, teacherKey: "farhan" },
  { code: "MGT-361", name: "Entrepreneurship", semester: 6, theory: 2, lab: 0, teacherKey: "mahnoor" },

  { code: "CSC-471", name: "Cloud Computing", semester: 7, theory: 3, lab: 1, teacherKey: "sanaullah" },
  { code: "CSC-472", name: "Data Mining", semester: 7, theory: 3, lab: 1, teacherKey: "ayesha" },
  { code: "CSC-473", name: "Human Computer Interaction", semester: 7, theory: 3, lab: 0, teacherKey: "bilal" },
  { code: "CSC-474", name: "Final Year Project I", semester: 7, theory: 2, lab: 0, teacherKey: "asma" },
  { code: "CSC-475", name: "Advanced Web Technologies", semester: 7, theory: 3, lab: 0, teacherKey: "kamran" },

  { code: "CSC-481", name: "Machine Learning", semester: 8, theory: 3, lab: 1, teacherKey: "ayesha" },
  { code: "CSC-482", name: "Computer Vision", semester: 8, theory: 3, lab: 1, teacherKey: "sadia" },
  { code: "CSC-483", name: "Evolutionary Computing", semester: 8, theory: 3, lab: 0, teacherKey: "asma" },
  { code: "CSC-484", name: "Software Project Management", semester: 8, theory: 3, lab: 0, teacherKey: "bilal" },
  { code: "HUM-481", name: "Professional Ethics", semester: 8, theory: 2, lab: 0, teacherKey: "mahnoor" }
];

export function generateDummyData(): UniversityData {
  const departments = departmentSeeds;
  const rooms = buildRooms();
  const timeslots = buildTimeslots();
  const teachers = buildTeachers(departments[0]);
  const { batches, sections } = buildBatchesAndSections(departments[0]);
  const courses = buildCourses(departments[0], teachers);
  const requirements = buildSessionRequirements(courses, batches, sections);

  return {
    academic,
    periods: PERIODS,
    timeslots,
    departments,
    batches,
    sections,
    rooms,
    teachers,
    courses,
    requirements
  };
}

export function writeDummyData(data: UniversityData, outputDir = "generated-data"): void {
  mkdirSync(outputDir, { recursive: true });

  const writeJson = (fileName: string, value: unknown): void => {
    writeFileSync(join(outputDir, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
  };

  writeJson("university-data.json", data);
  writeJson("academic.json", data.academic);
  writeJson("periods.json", data.periods);
  writeJson("timeslots.json", data.timeslots);
  writeJson("rooms.json", data.rooms);
  writeJson("departments.json", data.departments);
  writeJson("batches.json", data.batches);
  writeJson("sections.json", data.sections);
  writeJson("teachers.json", data.teachers);
  writeJson("courses.json", data.courses);
  writeJson("session-requirements.json", data.requirements);
}

function buildTimeslots(): TimeSlot[] {
  return DAYS.flatMap((day) =>
    PERIODS.map((period) => ({
      id: `${day.slice(0, 3).toUpperCase()}-${period.id}`,
      day,
      periodId: period.id,
      label: `${day} ${period.label}`,
      isBreak: period.isBreak
    }))
  );
}

function buildRooms(): Room[] {
  const lectureRoomNames = [
    "CS Lecture Room 101",
    "CS Lecture Room 102",
    "CS Lecture Room 201",
    "CS Lecture Room 202",
    "CS Seminar Room 301",
    "CS Smart Classroom 325",
    "CS Smart Classroom 326",
    "CS Final Year Discussion Room"
  ];

  const labRoomNames = [
    "Computer Lab Ground Floor",
    "Computer Lab 1st Floor",
    "Software Engineering Lab",
    "AI and Data Science Lab",
    "Cyber Security Lab"
  ];

  return [
    ...lectureRoomNames.map<Room>((name, index) => ({
      id: `room-cs-lecture-${index + 1}`,
      name,
      isLab: false,
      capacity: 60
    })),
    ...labRoomNames.map<Room>((name, index) => ({
      id: `room-cs-lab-${index + 1}`,
      name,
      isLab: true,
      capacity: 40
    }))
  ];
}

function buildTeachers(department: Department): Teacher[] {
  return teacherSeeds.map((seed, index) => ({
    id: `teacher-cse-${index + 1}`,
    departmentId: department.id,
    title: seed.title,
    name: seed.name,
    maxClassesPerWeek: seed.maxClassesPerWeek
  }));
}

function buildBatchesAndSections(department: Department): {
  batches: Batch[];
  sections: Section[];
} {
  const batches: Batch[] = [];
  const sections: Section[] = [];

  for (const batchSeed of batchSeeds) {
    const batch: Batch = {
      id: `batch-cse-${batchSeed.batchCode.toLowerCase()}`,
      departmentId: department.id,
      batchCode: batchSeed.batchCode,
      admissionYear: batchSeed.admissionYear,
      currentAcademicYear: academic.currentYear,
      semester: batchSeed.currentSemester,
      degreeYears: academic.degreeYears,
      totalSemesters: academic.totalSemesters,
      label: `${department.code} Batch ${batchSeed.batchCode} - ${formatSemester(batchSeed.currentSemester)} Semester`
    };

    batches.push(batch);

    batchSeed.sectionStudentCounts.forEach((studentCount, index) => {
      const sectionName = `Section ${String.fromCharCode(65 + index)}`;
      sections.push({
        id: `section-cse-${batchSeed.batchCode.toLowerCase()}-${sectionName.at(-1)?.toLowerCase()}`,
        departmentId: department.id,
        batchId: batch.id,
        name: sectionName,
        label: `${batch.batchCode} ${formatSemester(batch.semester)} Semester ${sectionName}`,
        studentCount
      });
    });
  }

  return { batches, sections };
}

function buildCourses(department: Department, teachers: Teacher[]): Course[] {
  const teacherKeyToTeacher = new Map(
    teacherSeeds.map((seed, index) => [seed.key, teachers[index]])
  );

  return courseSeeds.map((seed) => {
    const teacher = teacherKeyToTeacher.get(seed.teacherKey);
    if (!teacher) {
      throw new Error(`Missing teacher for key ${seed.teacherKey}`);
    }

    return {
      id: `course-cse-${seed.code.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      departmentId: department.id,
      teacherId: teacher.id,
      semester: seed.semester,
      code: seed.code,
      name: seed.name,
      creditHours: {
        theory: seed.theory,
        lab: seed.lab
      }
    };
  });
}

function buildSessionRequirements(
  courses: Course[],
  batches: Batch[],
  sections: Section[]
): SessionRequirement[] {
  const requirements: SessionRequirement[] = [];

  for (const section of sections) {
    const batch = batches.find((candidate) => candidate.id === section.batchId);
    if (!batch) {
      throw new Error(`Missing batch for section ${section.id}`);
    }

    const sectionCourses = courses.filter(
      (course) =>
        course.departmentId === section.departmentId && course.semester === batch.semester
    );

    for (const course of sectionCourses) {
      for (let sequence = 1; sequence <= course.creditHours.theory; sequence += 1) {
        requirements.push({
          id: `req-${section.id}-${course.code.toLowerCase()}-th-${sequence}`.replace(
            /[^a-z0-9-]/g,
            "-"
          ),
          departmentId: course.departmentId,
          batchId: section.batchId,
          sectionId: section.id,
          courseId: course.id,
          teacherId: course.teacherId,
          sessionType: "THEORY",
          durationPeriods: 1,
          sequence,
          displayName: course.name
        });
      }

      if (course.creditHours.lab === 1) {
        requirements.push({
          id: `req-${section.id}-${course.code.toLowerCase()}-pr-1`.replace(/[^a-z0-9-]/g, "-"),
          departmentId: course.departmentId,
          batchId: section.batchId,
          sectionId: section.id,
          courseId: course.id,
          teacherId: course.teacherId,
          sessionType: "LAB",
          durationPeriods: 3,
          sequence: 1,
          displayName: `${course.name} PR`
        });
      }
    }
  }

  return requirements;
}

function formatSemester(semester: number): string {
  if (semester === 1) {
    return "1st";
  }

  if (semester === 2) {
    return "2nd";
  }

  if (semester === 3) {
    return "3rd";
  }

  return `${semester}th`;
}
