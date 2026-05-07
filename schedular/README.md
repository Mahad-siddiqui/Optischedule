# OptiSchedule Backend

OptiSchedule is a TypeScript backend for generating CS department timetables with a Genetic Algorithm.

Current demo scope:

- Degree: BS Computer Science
- Academic year: 2026
- Active batches: `22F`, `23F`, `24F`, `25F`
- Active semesters: 8th, 6th, 4th, and 2nd semester
- Sections: larger batches are split into Section A / Section B
- Class day: Monday to Friday, 9:00 AM to 5:00 PM
- Break: 1:00 PM to 1:55 PM is locked for Lunch / Namaz
- Theory: 3 CH means three one-hour classes per week
- Lab: one continuous three-hour practical block per week

## Run

```bash
npm install
npm start
```

## Scripts

- `npm run generate:data` writes interconnected dummy JSON data into `generated-data/`.
- `npm start` generates data, runs the GA, and writes the best timetable to `output/`.
- `npm run build` type-checks and compiles the TypeScript code into `dist/`.

Useful environment variables:

- `OPTISCHEDULE_MAX_GENERATIONS`
- `OPTISCHEDULE_SOFT_OPTIMIZATION_GENERATIONS`
- `OPTISCHEDULE_LOG_EVERY`
- `OPTISCHEDULE_POPULATION_SIZE`
- `OPTISCHEDULE_MUTATION_RATE`

## Output Files

Each successful run writes:

- `output/best-schedule.json`
- `output/best-schedule.csv`
- `output/best-timetable.xlsx`
- `output/best-timetable.pdf`
- `output/best-timetable.docx`

The Excel workbook includes a summary sheet, an all-sessions sheet, and one formatted timetable sheet per section. The PDF and Word files are section-wise printable timetable reports.

## GA Defaults

- Population size: `100`
- Tournament size: `5`
- Mutation rate: `0.05`
- Elite chromosomes: `4`
- Max generations: `1000`

Environment variables can override defaults:

```bash
OPTISCHEDULE_MAX_GENERATIONS=1500 npm start
OPTISCHEDULE_MUTATION_RATE=0.08 npm start
```

On PowerShell:

```powershell
$env:OPTISCHEDULE_MAX_GENERATIONS=1500; npm start
```
