import { generateDummyData, writeDummyData } from "./data/dummyDataGenerator";
import { Population, type GeneticAlgorithmConfig } from "./ga/Population";
import { writeScheduleOutputs } from "./output/scheduleFormatter";
import { Random } from "./utils/random";

const seed = getNumberFromEnv("OPTISCHEDULE_SEED", 20260504);
const maxGenerations = getNumberFromEnv("OPTISCHEDULE_MAX_GENERATIONS", 1000);
const softOptimizationGenerations = getNumberFromEnv(
  "OPTISCHEDULE_SOFT_OPTIMIZATION_GENERATIONS",
  50
);
const logEveryGenerations = getNumberFromEnv("OPTISCHEDULE_LOG_EVERY", 10);
const config: GeneticAlgorithmConfig = {
  populationSize: getNumberFromEnv("OPTISCHEDULE_POPULATION_SIZE", 100),
  tournamentSize: getNumberFromEnv("OPTISCHEDULE_TOURNAMENT_SIZE", 5),
  mutationRate: getNumberFromEnv("OPTISCHEDULE_MUTATION_RATE", 0.05),
  crossoverRate: getNumberFromEnv("OPTISCHEDULE_CROSSOVER_RATE", 0.85),
  eliteCount: getNumberFromEnv("OPTISCHEDULE_ELITE_COUNT", 4)
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const data = generateDummyData();
  writeDummyData(data);

  const random = new Random(seed);
  const population = Population.initialize(data, config, random);

  console.log("OptiSchedule Genetic Algorithm");
  console.log(`Seed: ${seed}`);
  console.log(
    `Scope: ${data.academic.degreeName}, year ${data.academic.currentYear}, batches ${data.academic.activeBatchCodes.join(", ")}`
  );
  console.log(
    `Rooms: ${data.rooms.length} total, ${data.rooms.filter((room) => room.isLab).length} labs, ${data.teachers.length} teachers`
  );
  console.log(`Session requirements: ${data.requirements.length}`);
  console.log(
    `Population: ${config.populationSize}, Tournament: ${config.tournamentSize}, Mutation: ${config.mutationRate}, Elites: ${config.eliteCount}`
  );

  let best = population.best();
  let solvedAtGeneration: number | undefined;
  let bestHardViolations = Number.POSITIVE_INFINITY;

  for (let generation = 0; generation <= maxGenerations; generation += 1) {
    best = population.best();
    const averageScore = population.averageScore();
    const { report } = best;

    const isNewHardBest = report.hardViolations < bestHardViolations;
    bestHardViolations = Math.min(bestHardViolations, report.hardViolations);

    if (
      generation === 0 ||
      isNewHardBest ||
      generation % logEveryGenerations === 0
    ) {
      console.log(
        [
          `Generation ${generation.toString().padStart(4, "0")}`,
          `score=${report.score.toFixed(2)}`,
          `avg=${averageScore.toFixed(2)}`,
          `hard=${report.hardViolations}`,
          `soft=${report.softPenalty}`,
          `room=${report.hardBreakdown.roomClashes}`,
          `teacher=${report.hardBreakdown.teacherClashes}`,
          `student=${report.hardBreakdown.studentClashes}`,
          `type=${report.hardBreakdown.roomTypeMismatches}`,
          `capacity=${report.hardBreakdown.capacityViolations}`,
        `break=${report.hardBreakdown.breakViolations}`,
        `duration=${report.hardBreakdown.durationViolations}`,
        `early=${report.softBreakdown.earlyFinish}`,
        `days=${report.softBreakdown.studentActiveDays}`,
        `span=${report.softBreakdown.campusSpan}`
      ].join(" | ")
    );
    }

    if (report.hardViolations === 0) {
      solvedAtGeneration ??= generation;

      if (generation - solvedAtGeneration >= softOptimizationGenerations) {
        break;
      }
    }

    if (generation < maxGenerations) {
      population.evolve();
    }
  }

  await writeScheduleOutputs(data, best.chromosome, best.report);

  if (solvedAtGeneration !== undefined) {
    console.log(`Solved with 0 hard constraint violations at generation ${solvedAtGeneration}.`);
  } else {
    console.log(
      `Reached ${maxGenerations} generations. Best hard constraint violations: ${best.report.hardViolations}.`
    );
  }

  console.log("Dummy data written to generated-data/.");
  console.log(
    "Best timetable written to output/ as JSON, CSV, PDF, Excel, and Word files."
  );
}

function getNumberFromEnv(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${key} must be a number.`);
  }

  return parsed;
}
