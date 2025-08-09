import { OTHER_CHARS, START_CHARS } from "./utils";

export class ClassNameGenerator {
  private index: number = 0;
  private generated = new Set<string>();

  constructor(
    private prefix: string = "",
    private strategy: "deterministic",
    private suffix: string = "" // private minLength: number = 1
  ) {}

  next(): string {
    while (this.index <= Number.MAX_SAFE_INTEGER) {
      if (this.strategy === "deterministic") {
        const name = this.generateName(this.index++);

        if (!this.generated.has(name)) {
          this.generated.add(name);
          return `${this.prefix}${name}${this.suffix}`;
        }
      }
    }

    throw new Error("ClassNameGenerator: Exceeded maximum index limit.");
  }

  private generateName(index: number): string {
    let name = "";
    const base = OTHER_CHARS.length;
    let current = index;

    //   Always start with a a valid character
    const startChar = START_CHARS[current % START_CHARS.length];
    current = Math.floor(current / START_CHARS.length);

    name = startChar;

    while (current > 0) {
      name += OTHER_CHARS[current % base];
      current = Math.floor(current / base);
    }
    return name;
  }

  reset(): void {
    this.index = 0;
    this.generated.clear();
  }
}
