export class Random {
  private state: number;

  constructor(seed = Date.now()) {
    this.state = seed >>> 0;
  }

  next(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  int(minInclusive: number, maxInclusive: number): number {
    return Math.floor(this.next() * (maxInclusive - minInclusive + 1)) + minInclusive;
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error("Cannot pick from an empty array.");
    }

    return items[this.int(0, items.length - 1)];
  }

  sample<T>(items: readonly T[], count: number): T[] {
    return this.shuffle([...items]).slice(0, Math.min(count, items.length));
  }

  shuffle<T>(items: T[]): T[] {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = this.int(0, index);
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }

    return items;
  }
}
