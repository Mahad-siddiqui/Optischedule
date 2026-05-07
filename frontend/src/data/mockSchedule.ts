import type { Day, ScheduleGene, SchedulePayload, TimeSlot } from "../types/schedule";

export const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const TIME_SLOTS: TimeSlot[] = [
  { id: "09", label: "9:00 AM", startTime: "09:00", isBreak: false },
  { id: "10", label: "10:00 AM", startTime: "10:00", isBreak: false },
  { id: "11", label: "11:00 AM", startTime: "11:00", isBreak: false },
  { id: "12", label: "12:00 PM", startTime: "12:00", isBreak: false },
  { id: "13", label: "1:00 PM", startTime: "13:00", isBreak: true },
  { id: "14", label: "2:00 PM", startTime: "14:00", isBreak: false },
  { id: "15", label: "3:00 PM", startTime: "15:00", isBreak: false },
  { id: "16", label: "4:00 PM", startTime: "16:00", isBreak: false }
];

interface CoursePlan {
  code: string;
  name: string;
  teacher: string;
  lectureRoom: string;
  hasLab: boolean;
  labRoom?: string;
}

interface SemesterPlan {
  semester: 2 | 4 | 6 | 8;
  batch: string;
  courses: CoursePlan[];
}

interface SlotPlan {
  day: Day;
  startTime: string;
}

const semesterPlans: SemesterPlan[] = [
  {
    semester: 2,
    batch: "25F",
    courses: [
      {
        code: "CSC-121",
        name: "Object Oriented Programming",
        teacher: "Mr. Kamran Ali",
        lectureRoom: "CS Lecture Room 101",
        hasLab: true,
        labRoom: "Computer Lab Ground Floor"
      },
      {
        code: "CSC-122",
        name: "Digital Logic Design",
        teacher: "Engr. Saad Qureshi",
        lectureRoom: "CS Lecture Room 102",
        hasLab: true,
        labRoom: "Computer Lab 1st Floor"
      },
      {
        code: "MTH-124",
        name: "Linear Algebra",
        teacher: "Ms. Nida Memon",
        lectureRoom: "CS Lecture Room 201",
        hasLab: false
      },
      {
        code: "HUM-102",
        name: "Islamic Studies",
        teacher: "Ms. Mahnoor Raza",
        lectureRoom: "CS Seminar Room 301",
        hasLab: false
      },
      {
        code: "CSC-123",
        name: "Discrete Structures",
        teacher: "Ms. Hira Siddiqui",
        lectureRoom: "CS Smart Classroom 325",
        hasLab: false
      }
    ]
  },
  {
    semester: 4,
    batch: "24F",
    courses: [
      {
        code: "CSC-241",
        name: "Database Systems",
        teacher: "Engr. Farhan Ahmed",
        lectureRoom: "CS Lecture Room 201",
        hasLab: true,
        labRoom: "Software Engineering Lab"
      },
      {
        code: "CSC-242",
        name: "Operating Systems",
        teacher: "Engr. Zain Siddiqui",
        lectureRoom: "CS Lecture Room 202",
        hasLab: true,
        labRoom: "AI and Data Science Lab"
      },
      {
        code: "CSC-243",
        name: "Theory of Automata",
        teacher: "Dr. Asma Sanam Larik",
        lectureRoom: "CS Smart Classroom 326",
        hasLab: false
      },
      {
        code: "CSC-244",
        name: "Software Engineering",
        teacher: "Mr. Bilal Khan",
        lectureRoom: "CS Seminar Room 301",
        hasLab: false
      },
      {
        code: "MTH-242",
        name: "Numerical Computing",
        teacher: "Ms. Nida Memon",
        lectureRoom: "CS Final Year Discussion Room",
        hasLab: false
      }
    ]
  },
  {
    semester: 6,
    batch: "23F",
    courses: [
      {
        code: "CSC-361",
        name: "Artificial Intelligence",
        teacher: "Dr. Ayesha Noor",
        lectureRoom: "CS Lecture Room 101",
        hasLab: true,
        labRoom: "AI and Data Science Lab"
      },
      {
        code: "CSC-362",
        name: "Mobile Application Development",
        teacher: "Engr. Zain Siddiqui",
        lectureRoom: "CS Lecture Room 102",
        hasLab: true,
        labRoom: "Computer Lab 1st Floor"
      },
      {
        code: "CSC-363",
        name: "Information Security",
        teacher: "Dr. Sanaullah Shaikh",
        lectureRoom: "CS Lecture Room 202",
        hasLab: false
      },
      {
        code: "CSC-364",
        name: "Parallel and Distributed Computing",
        teacher: "Engr. Farhan Ahmed",
        lectureRoom: "CS Smart Classroom 325",
        hasLab: false
      },
      {
        code: "MGT-361",
        name: "Entrepreneurship",
        teacher: "Ms. Mahnoor Raza",
        lectureRoom: "CS Seminar Room 301",
        hasLab: false
      }
    ]
  },
  {
    semester: 8,
    batch: "22F",
    courses: [
      {
        code: "CSC-481",
        name: "Machine Learning",
        teacher: "Dr. Ayesha Noor",
        lectureRoom: "CS Smart Classroom 326",
        hasLab: true,
        labRoom: "AI and Data Science Lab"
      },
      {
        code: "CSC-482",
        name: "Computer Vision",
        teacher: "Dr. Sadia Akhtar",
        lectureRoom: "CS Lecture Room 102",
        hasLab: true,
        labRoom: "Cyber Security Lab"
      },
      {
        code: "CSC-483",
        name: "Evolutionary Computing",
        teacher: "Dr. Asma Sanam Larik",
        lectureRoom: "CS Lecture Room 202",
        hasLab: false
      },
      {
        code: "CSC-484",
        name: "Software Project Management",
        teacher: "Mr. Bilal Khan",
        lectureRoom: "CS Final Year Discussion Room",
        hasLab: false
      },
      {
        code: "HUM-481",
        name: "Professional Ethics",
        teacher: "Ms. Mahnoor Raza",
        lectureRoom: "CS Seminar Room 301",
        hasLab: false
      }
    ]
  }
];

const sectionATheorySlots: SlotPlan[] = [
  { day: "Monday", startTime: "12:00" },
  { day: "Monday", startTime: "14:00" },
  { day: "Monday", startTime: "15:00" },
  { day: "Monday", startTime: "16:00" },
  { day: "Tuesday", startTime: "12:00" },
  { day: "Tuesday", startTime: "14:00" },
  { day: "Tuesday", startTime: "15:00" },
  { day: "Tuesday", startTime: "16:00" },
  { day: "Wednesday", startTime: "09:00" },
  { day: "Wednesday", startTime: "10:00" },
  { day: "Wednesday", startTime: "11:00" },
  { day: "Wednesday", startTime: "12:00" },
  { day: "Wednesday", startTime: "14:00" },
  { day: "Wednesday", startTime: "15:00" },
  { day: "Wednesday", startTime: "16:00" }
];

const sectionBTheorySlots: SlotPlan[] = [
  { day: "Wednesday", startTime: "12:00" },
  { day: "Wednesday", startTime: "14:00" },
  { day: "Wednesday", startTime: "15:00" },
  { day: "Wednesday", startTime: "16:00" },
  { day: "Thursday", startTime: "12:00" },
  { day: "Thursday", startTime: "14:00" },
  { day: "Thursday", startTime: "15:00" },
  { day: "Thursday", startTime: "16:00" },
  { day: "Friday", startTime: "09:00" },
  { day: "Friday", startTime: "10:00" },
  { day: "Friday", startTime: "11:00" },
  { day: "Friday", startTime: "12:00" },
  { day: "Friday", startTime: "14:00" },
  { day: "Friday", startTime: "15:00" },
  { day: "Friday", startTime: "16:00" }
];

const sectionALabSlots: SlotPlan[] = [
  { day: "Monday", startTime: "09:00" },
  { day: "Tuesday", startTime: "09:00" }
];

const sectionBLabSlots: SlotPlan[] = [
  { day: "Wednesday", startTime: "09:00" },
  { day: "Thursday", startTime: "09:00" }
];

export const mockSchedule: SchedulePayload = buildMockSchedule();

function buildMockSchedule(): SchedulePayload {
  const genes: ScheduleGene[] = [];

  for (const plan of semesterPlans) {
    for (const section of ["A", "B"] as const) {
      const theorySlots = section === "A" ? sectionATheorySlots : sectionBTheorySlots;
      const labSlots = section === "A" ? sectionALabSlots : sectionBLabSlots;
      const sectionLabel = `CS-${formatSemester(plan.semester)} Sem Sec ${section}`;

      plan.courses.forEach((course, courseIndex) => {
        for (let theoryIndex = 0; theoryIndex < 3; theoryIndex += 1) {
          const slot = theorySlots[courseIndex * 3 + theoryIndex];
          genes.push({
            id: `${plan.batch}-${plan.semester}-${section}-${course.code}-TH-${theoryIndex + 1}`,
            courseCode: course.code,
            courseName: course.name,
            teacherName: course.teacher,
            roomName: course.lectureRoom,
            batch: plan.batch,
            semester: plan.semester,
            section,
            sectionLabel,
            day: slot.day,
            startTime: slot.startTime,
            endTime: addHours(slot.startTime, 1),
            duration: 1,
            type: "THEORY"
          });
        }

        if (course.hasLab && course.labRoom) {
          const labSlot = labSlots[genes.filter((gene) => gene.sectionLabel === sectionLabel && gene.type === "LAB").length];
          genes.push({
            id: `${plan.batch}-${plan.semester}-${section}-${course.code}-LAB`,
            courseCode: course.code,
            courseName: `${course.name} Lab`,
            teacherName: course.teacher,
            roomName: course.labRoom,
            batch: plan.batch,
            semester: plan.semester,
            section,
            sectionLabel,
            day: labSlot.day,
            startTime: labSlot.startTime,
            endTime: addHours(labSlot.startTime, 3),
            duration: 3,
            type: "LAB"
          });
        }
      });
    }
  }

  const roomNames = new Set(genes.map((gene) => gene.roomName));
  const teacherNames = new Set(genes.map((gene) => gene.teacherName));

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      fitnessScore: 1000,
      hardConflicts: 0,
      softPenalty: 118,
      roomClashes: 0,
      teacherClashes: 0,
      studentClashes: 0,
      totalClasses: genes.length,
      totalRooms: roomNames.size,
      totalLabs: 5,
      totalTeachers: teacherNames.size
    },
    genes
  };
}

function addHours(time: string, hours: number): string {
  const [rawHour, minute] = time.split(":");
  const hour = Number(rawHour) + hours;
  return `${hour.toString().padStart(2, "0")}:${minute}`;
}

function formatSemester(semester: 2 | 4 | 6 | 8): string {
  if (semester === 2) {
    return "2nd";
  }

  return `${semester}th`;
}
