import type { Day, Period } from "./types";

export const DAYS: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
];

export const PERIODS: Period[] = [
  {
    id: "P1",
    index: 0,
    label: "9:00-9:55",
    start: "09:00",
    end: "09:55",
    isBreak: false
  },
  {
    id: "P2",
    index: 1,
    label: "10:00-10:55",
    start: "10:00",
    end: "10:55",
    isBreak: false
  },
  {
    id: "P3",
    index: 2,
    label: "11:00-11:55",
    start: "11:00",
    end: "11:55",
    isBreak: false
  },
  {
    id: "P4",
    index: 3,
    label: "12:00-12:55",
    start: "12:00",
    end: "12:55",
    isBreak: false
  },
  {
    id: "P5",
    index: 4,
    label: "1:00-1:55",
    start: "13:00",
    end: "13:55",
    isBreak: true
  },
  {
    id: "P6",
    index: 5,
    label: "2:00-2:55",
    start: "14:00",
    end: "14:55",
    isBreak: false
  },
  {
    id: "P7",
    index: 6,
    label: "3:00-3:55",
    start: "15:00",
    end: "15:55",
    isBreak: false
  },
  {
    id: "P8",
    index: 7,
    label: "4:00-4:55",
    start: "16:00",
    end: "16:55",
    isBreak: false
  }
];
