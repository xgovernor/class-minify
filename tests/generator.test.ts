import { describe, it, expect, vi } from "vitest";
import { ClassNameGenerator } from "../packages/core/generator/index";

// Mock the utils
vi.mock("../packages/core/generator/utils", () => ({
  START_CHARS: ["a", "b", "c"],
  OTHER_CHARS: ["0", "1", "2", "3", "4", "5"],
}));

describe("ClassNameGenerator", () => {
  it("generates deterministic class names", () => {
    const generator = new ClassNameGenerator("", "deterministic");
    const first = generator.next();
    const second = generator.next();

    expect(first).toBe("a");
    expect(second).toBe("b");
    expect(first).not.toBe(second);
  });

  it("applies prefix and suffix", () => {
    const generator = new ClassNameGenerator("pre-", "deterministic", "-suf");
    const name = generator.next();

    expect(name).toMatch(/^pre-.*-suf$/);
    expect(name).toBe("pre-a-suf");
  });

  it("generates 100000 unique class names for conflicting cases", () => {
    const generator = new ClassNameGenerator("", "deterministic");
    const names = new Set();

    for (let i = 0; i < 100000; i++) {
      const name = generator.next();
      expect(names.has(name)).toBe(false);
      names.add(name);
    }
  });

  it("generates names with multiple characters for higher indices", () => {
    const generator = new ClassNameGenerator("", "deterministic");

    // Skip first few simple names
    for (let i = 0; i < 4; i++) {
      generator.next();
    }

    const name = generator.next();
    expect(name.length).toBeGreaterThan(1);
  });

  it("resets generator state", () => {
    const generator = new ClassNameGenerator("", "deterministic");
    const first = generator.next();
    generator.next();

    generator.reset();
    const afterReset = generator.next();

    expect(afterReset).toBe(first);
  });

  it("throws error when exceeding maximum index", () => {
    const generator = new ClassNameGenerator("", "deterministic");
    // Mock index to be at max safe integer
    (generator as any).index = Number.MAX_SAFE_INTEGER;

    expect(() => generator.next()).toThrow(
      "ClassNameGenerator: Exceeded maximum index limit."
    );
  });
});
