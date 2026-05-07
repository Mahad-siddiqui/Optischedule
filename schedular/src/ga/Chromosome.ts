import { DAYS } from "../domain/constants";
import type { FitnessReport, UniversityData } from "../domain/types";
import { Random } from "../utils/random";
import { FitnessEvaluator } from "./FitnessEvaluator";
import { Gene } from "./Gene";

type CrossoverStrategy = "DAY_BLOCK" | "DEPARTMENT_BLOCK" | "TWO_POINT";

export class Chromosome {
  private cachedFitness?: FitnessReport;

  constructor(readonly genes: Gene[]) {}

  static random(data: UniversityData, random: Random): Chromosome {
    return new Chromosome(
      data.requirements.map((requirement) => Gene.random(requirement, data, random))
    );
  }

  clone(): Chromosome {
    return new Chromosome(this.genes.map((gene) => gene.clone()));
  }

  evaluate(evaluator: FitnessEvaluator): FitnessReport {
    this.cachedFitness ??= evaluator.evaluate(this.genes);
    return this.cachedFitness;
  }

  crossover(other: Chromosome, data: UniversityData, random: Random): Chromosome {
    const strategy = random.pick<CrossoverStrategy>([
      "DAY_BLOCK",
      "DEPARTMENT_BLOCK",
      "TWO_POINT"
    ]);
    const childGenes = this.genes.map((gene) => gene.clone());

    if (strategy === "DAY_BLOCK") {
      const selectedDays = new Set(random.sample(DAYS, random.int(1, 2)));
      for (let index = 0; index < childGenes.length; index += 1) {
        if (selectedDays.has(other.genes[index].day)) {
          childGenes[index] = other.genes[index].clone();
        }
      }
    }

    if (strategy === "DEPARTMENT_BLOCK") {
      const departmentIds = data.departments.map((department) => department.id);
      const selectedDepartments = new Set(random.sample(departmentIds, random.int(1, 2)));
      for (let index = 0; index < childGenes.length; index += 1) {
        if (selectedDepartments.has(other.genes[index].departmentId)) {
          childGenes[index] = other.genes[index].clone();
        }
      }
    }

    if (strategy === "TWO_POINT") {
      const pointA = random.int(0, childGenes.length - 2);
      const pointB = random.int(pointA + 1, childGenes.length - 1);
      for (let index = pointA; index <= pointB; index += 1) {
        childGenes[index] = other.genes[index].clone();
      }
    }

    return new Chromosome(childGenes);
  }

  mutate(data: UniversityData, random: Random, mutationRate: number): void {
    for (const gene of this.genes) {
      if (random.chance(mutationRate)) {
        gene.mutate(data, random);
        this.cachedFitness = undefined;
      }
    }
  }
}
