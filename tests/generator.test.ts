import { ClassNameGenerator } from "../src/generator";
import { expect, it } from "vitest";

const generator = new ClassNameGenerator();

it("should generate class names", () => {
  expect(generator.next()).toBe("a");
  expect(generator.next()).toBe("b");
  expect(generator.next()).toBe("c");
  expect(generator.next()).toBe("d");
  expect(generator.next()).toBe("e");

  generator.reset(); // Reset the generator
  expect(generator.next()).toBe("a"); // After reset, should start again from "a"
});
