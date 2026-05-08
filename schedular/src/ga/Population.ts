import type { FitnessReport, UniversityData } from "../domain/types";
import { Random } from "../utils/random";
import { Chromosome } from "./Chromosome";
import { FitnessEvaluator } from "./FitnessEvaluator";

export interface GeneticAlgorithmConfig {
  populationSize: number;
  tournamentSize: number;
  mutationRate: number;
  crossoverRate: number;
  eliteCount: number;
}

export class Population {
  private readonly evaluator: FitnessEvaluator;

  private constructor(
    private chromosomes: Chromosome[],
    private readonly data: UniversityData,
    private readonly config: GeneticAlgorithmConfig,
    private readonly random: Random
  ) {
    this.evaluator = new FitnessEvaluator(data);
  }

  static initialize(
    data: UniversityData,
    config: GeneticAlgorithmConfig,
    random: Random
  ): Population {
    const chromosomes = Array.from({ length: config.populationSize }, () =>
      Chromosome.random(data, random)
    );

    return new Population(chromosomes, data, config, random);
  }

  best(): { chromosome: Chromosome; report: FitnessReport } {
    const chromosome = this.sortedByFitness()[0];
    return {
      chromosome,
      report: chromosome.evaluate(this.evaluator)
    };
  }

  averageScore(): number {
    const totalScore = this.chromosomes.reduce(
      (total, chromosome) => total + chromosome.evaluate(this.evaluator).score,
      0
    );

    return totalScore / this.chromosomes.length;
  }

  evolve(): void {
    const sorted = this.sortedByFitness();
    const nextGeneration = sorted
      .slice(0, this.config.eliteCount)
      .map((chromosome) => chromosome.clone());

    while (nextGeneration.length < this.config.populationSize) {
      const parentA = this.tournamentSelection();
      const parentB = this.tournamentSelection();
      const child = this.random.chance(this.config.crossoverRate)
        ? parentA.crossover(parentB, this.data, this.random)
        : parentA.clone();
      child.mutate(this.data, this.random, this.config.mutationRate);
      nextGeneration.push(child);
    }

    this.chromosomes = nextGeneration;
  }

  private tournamentSelection(): Chromosome {
    const competitors = this.random.sample(this.chromosomes, this.config.tournamentSize);

    return competitors.sort((left, right) => this.compareChromosomes(left, right))[0];
  }

  private sortedByFitness(): Chromosome[] {
    return [...this.chromosomes].sort((left, right) => this.compareChromosomes(left, right));
  }

  private compareChromosomes(left: Chromosome, right: Chromosome): number {
    const leftReport = left.evaluate(this.evaluator);
    const rightReport = right.evaluate(this.evaluator);

    if (leftReport.hardViolations !== rightReport.hardViolations) {
      return leftReport.hardViolations - rightReport.hardViolations;
    }

    return rightReport.score - leftReport.score;
  }
}
