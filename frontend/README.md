# OptiSchedule Frontend

OptiSchedule Frontend is a React + TypeScript dashboard for generating, inspecting, analyzing, and exporting optimized university timetables. It connects to the OptiSchedule backend through `/api` endpoints and visualizes the Genetic Algorithm workflow in real time.

The UI is built for the DUET Department of Computer Science & Engineering scheduling workflow: configure EA parameters, stream generation progress, inspect timetable quality, filter the final schedule, review university resources, and download PDF, Excel, or Word exports.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Backend API Contract](#backend-api-contract)
- [Routes](#routes)
- [Core Frontend Modules](#core-frontend-modules)
- [Build and Preview](#build-and-preview)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Features

- Real-time Evolutionary Algorithm generation dashboard.
- Server-Sent Events style streaming from `POST /api/generate`.
- Live fitness charts, constraint pressure charts, generation logs, and chromosome snapshots.
- Adjustable EA controls:
  - population size
  - generations
  - crossover rate
  - mutation rate
  - elite count
  - tournament size
  - simulation steps
  - spawn rate
  - theory rooms
  - lab rooms
  - teachers
- Master timetable view with filters for semester, section, teacher, and room.
- Schedule analytics for teaching hours, gap hours, room usage, daily load, and efficiency.
- University resource explorer for teachers, rooms, batches, periods, courses, and academic metadata.
- Methodology page explaining the Genetic Algorithm, chromosome encoding, constraints, crossover, mutation, and fitness scoring.
- Export links for generated PDF, Excel, and Word timetables.
- Dark/light theme toggle persisted in `localStorage`.
- Vercel SPA rewrites for browser routing.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React
- React Hot Toast

## Project Structure

```text
frontend/
|-- public/
|   `-- exports/                  # Static fallback/export files
|-- src/
|   |-- components/
|   |   |-- analytics/             # Schedule analytics charts/components
|   |   |-- layout/                # Sidebar and dashboard shell
|   |   |-- timetable/             # Timetable grid, filters, class cards
|   |   |-- DownloadExports.tsx    # PDF, Excel, Word download links
|   |   `-- Skeleton.tsx           # Loading states
|   |-- data/
|   |   `-- mockSchedule.ts        # Days and time-slot constants
|   |-- hooks/
|   |   `-- useTheme.tsx           # Dark/light theme provider
|   |-- pages/
|   |   |-- AboutEAPage.tsx        # EA methodology documentation page
|   |   |-- GenerationDashboard.tsx# Live generation dashboard
|   |   |-- ResourcesPage.tsx      # University resources page
|   |   `-- TimetablePage.tsx      # Timetable and analytics page
|   |-- services/
|   |   `-- api.ts                 # Backend API functions
|   |-- types/
|   |   `-- schedule.ts            # Shared frontend schedule types
|   |-- utils/
|   |   `-- scheduleAnalytics.ts   # Analytics calculations
|   |-- App.tsx                    # Route definitions
|   |-- index.css                  # Global Tailwind/theme styles
|   `-- main.tsx                   # React entry point
|-- index.html
|-- package.json
|-- tailwind.config.ts
|-- tsconfig.json
|-- vercel.json
`-- vite.config.ts
```

## Prerequisites

Install the following before running the app:

- Node.js 18 or newer
- npm
- OptiSchedule backend dependencies installed in `../schedular`

The frontend expects the backend API to run on port `3001` during local development. Vite proxies `/api` requests to `http://localhost:3001`.

## Getting Started

From the repository root:

```bash
cd schedular
npm install
npm run server
```

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL:

```text
http://localhost:5173
```

The frontend development server is configured with:

```ts
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true
    }
  }
}
```

## Available Scripts

Run these inside `frontend/`.

```bash
npm run dev
```

Starts the Vite development server on port `5173` and exposes it on `0.0.0.0`.

```bash
npm run build
```

Runs TypeScript project build checks and creates a production bundle in `dist/`.

```bash
npm run preview
```

Serves the built `dist/` output locally for production preview.

## Backend API Contract

The frontend uses the API helpers in `src/services/api.ts`.

| Method | Endpoint | Used By | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/generate` | `GenerationDashboard` | Starts EA generation and streams progress events. |
| `GET` | `/api/schedule` | `GenerationDashboard`, `TimetablePage` | Fetches the latest generated schedule. |
| `GET` | `/api/status` | API service helper | Checks whether generation is running and whether a schedule exists. |
| `GET` | `/api/exports/:fileName` | `DownloadExports` | Downloads generated timetable exports. |
| `GET` | `/api/data` | `ResourcesPage` | Fetches academic, teacher, room, batch, course, and period data. |

### Generation Stream Events

`POST /api/generate` returns generation progress as stream chunks with event names:

- `init`
- `generation`
- `complete`
- `error`

The `generation` event is typed as `SSEGenerationEvent` in `src/types/schedule.ts` and includes:

- current generation number
- max generation count
- best fitness score
- hard violation breakdown
- soft penalty breakdown
- average fitness
- chromosome snapshot
- crossover details
- mutation details
- log message

## Routes

Routes are defined in `src/App.tsx`.

| Route | Page | Description |
| --- | --- | --- |
| `/` | `GenerationDashboard` | Configure and run the Evolutionary Algorithm. |
| `/timetable` | `TimetablePage` | View, filter, analyze, and export the generated timetable. |
| `/resources` | `ResourcesPage` | Inspect university resources used by the scheduler. |
| `/about-ea` | `AboutEAPage` | Read the EA methodology and scheduling constraints. |

All routes render inside `DashboardLayout`, which provides the sidebar, theme toggle, and main dashboard shell.

## Core Frontend Modules

### `src/services/api.ts`

Centralizes backend access:

- starts generation
- parses streamed EA events
- fetches the latest schedule
- checks backend status
- builds export URLs
- fetches university data

### `src/types/schedule.ts`

Defines the main data contract used across the app:

- `EAParams`
- `ScheduleGene`
- `ScheduleMetrics`
- `SchedulePayload`
- `TimetableFilters`
- `SSEGenerationEvent`
- `FitnessDataPoint`
- `LogEntry`

### `src/pages/GenerationDashboard.tsx`

The main control room for the scheduler. It lets users adjust EA parameters, start/stop generation, watch fitness progress, monitor constraints, inspect chromosome snapshots, and download generated exports.

### `src/pages/TimetablePage.tsx`

Fetches the latest schedule and provides timetable filtering, analytics summaries, chart views, and export actions.

### `src/pages/ResourcesPage.tsx`

Displays the backend's academic dataset: faculty, rooms, labs, batches, courses, periods, and scheduling rules.

### `src/utils/scheduleAnalytics.ts`

Computes derived timetable metrics for the analytics page:

- total teaching hours
- total gap hours
- average active days
- average days off
- daily class load
- section efficiency
- theory/lab split
- room usage

### `src/hooks/useTheme.tsx`

Provides app-wide dark/light theme state and stores the user preference under:

```text
opti-theme
```

## Build and Preview

Create a production build:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

The production files are written to:

```text
frontend/dist/
```

## Deployment

This frontend includes `vercel.json` with SPA rewrites. Browser routes such as `/timetable`, `/resources`, and `/about-ea` are rewritten to `index.html` so direct refreshes work on Vercel.

For a production deployment, make sure API requests to `/api/*` are handled by the deployed backend or by platform rewrites/proxy rules. The Vite development proxy only applies during `npm run dev`.

## Troubleshooting

### The dashboard says the backend failed or no stream is available

Start the backend server first:

```bash
cd ../schedular
npm run server
```

Then restart the frontend:

```bash
cd ../frontend
npm run dev
```

### Timetable page shows "No schedule generated yet"

Generate a schedule from the Evolution Lab page first. The timetable page loads the latest schedule from:

```text
GET /api/schedule
```

### Export downloads fail

Make sure the backend has generated export files and is serving:

```text
GET /api/exports/best-timetable.pdf
GET /api/exports/best-timetable.xlsx
GET /api/exports/best-timetable.docx
```

### API calls work in development but fail after deployment

The development proxy in `vite.config.ts` does not run in production. Configure production hosting so `/api/*` reaches the backend server.

### TypeScript build fails

Run:

```bash
npm install
npm run build
```

Then inspect the reported file and line. Most app-level types are defined in `src/types/schedule.ts`.

## Recommended Development Flow

1. Start the backend with `npm run server` inside `schedular/`.
2. Start the frontend with `npm run dev` inside `frontend/`.
3. Use the Evolution Lab page to generate a schedule.
4. Open the Timetable page to inspect filters and analytics.
5. Use the Resources and About EA pages to verify scheduling data and methodology.
6. Run `npm run build` before committing frontend changes.
