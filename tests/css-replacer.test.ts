import { describe, it, expect } from "vitest";
import { replaceClasses } from "../packages/core/replacer";

describe("CSS Class Replacement", () => {
  it("handles simple CSS classes", () => {
    const input = {
      content: `.foo { color: red; } .foo-bar { background: blue; } .foo_bar{background: green;}`,
      extension: ".css",
      classMap: new Map([
        ["foo", "a"],
        ["foo-bar", "b"],
        ["foo_bar", "c"],
      ]),
    };
    const output = `.a { color: red; } .b { background: blue; } .c{background: green;}`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("replaces classes in multiple CSS rules with pseudo-selectors", () => {
    const input = {
      content: `
            .foo { color: red; }
            .bar::after { background: blue; }
            .foo_bar:hover { color: green; }
          `,
      extension: ".css",
      classMap: new Map([
        ["foo", "a"],
        ["bar", "b"],
        ["foo_bar", "c"],
      ]),
    };
    const output = `
            .a { color: red; }
            .b::after { background: blue; }
            .c:hover { color: green; }
          `;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toEqual(output);
  });

  it("replaces nested and complex CSS selectors", () => {
    const input = {
      content: `
          .foo { color: red; }
          .foo .bar { background: blue; }
          .foo .baz:hover { color: green; }
          .o4l4d-cl5ass::after, .second-Class > .text nav { color: red; }
        `,
      extension: ".css",
      classMap: new Map([
        ["foo", "a"],
        ["bar", "b"],
        ["baz", "c"],
        ["o4l4d-cl5ass", "d"],
        ["second-Class", "e"],
        ["text", "f"],
      ]),
    };
    const output = `
          .a { color: red; }
          .a .b { background: blue; }
          .a .c:hover { color: green; }
          .d::after, .e > .f nav { color: red; }
        `;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toEqual(output);
  });

  it("handles TailwindCSS classes with special characters", () => {
    const input = {
      content: `.w-1\/2 { width: 50%; } .[color\:black] { color: black; }`,
      extension: ".css",
      classMap: new Map([
        ["w-1/2", "a"],
        ["[color:black]", "b"],
      ]),
    };
    const output = `.a { width: 50%; } .b { color: black; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("replaces TailwindCSS responsive classes with escaped characters", () => {
    const input = {
      content: `.sm\:lg\:text-red-500 { color: red; }`,
      extension: ".css",
      classMap: new Map([["sm:lg:text-red-500", "a"]]),
    };
    const output = `.a { color: red; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles @utility directives", () => {
    const input = {
      content: `@utility flex { display: flex; } @utility items-center { align-items: center; } @utility justify-between { justify-content: space-between; }`,
      extension: ".css",
      classMap: new Map([
        ["flex", "a"],
        ["items-center", "b"],
        ["justify-between", "c"],
      ]),
    };
    const output = `@utility a { display: flex; } @utility b { align-items: center; } @utility c { justify-content: space-between; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles @component directives", () => {
    const input = {
      content: `@component btn { background: blue; color: white; } @component card { padding: 16px; }`,
      extension: ".css",
      classMap: new Map([
        ["btn", "a"],
        ["card", "b"],
      ]),
    };
    const output = `@component a { background: blue; color: white; } @component b { padding: 16px; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles TailwindCSS arbitrary values and properties", () => {
    const input = {
      content: `@utility bg-[black] { background-color: black; } @utility [color:white] { color: white; } @component card { @apply p-4 shadow-lg; }`,
      extension: ".css",
      classMap: new Map([
        ["bg-[black]", "a"],
        ["[color:white]", "b"],
        ["card", "c"],
      ]),
    };
    const output = `@utility a { background-color: black; } @utility b { color: white; } @component c { @apply p-4 shadow-lg; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles complex TailwindCSS modifiers with arbitrary values", () => {
    const input = {
      content: `@utility hover\:\[padding\:10px_50px\] { padding: 10px 50px; } @utility focus\:text-\[red\] { color: red; } .sm\:lg\:text-red-500 { color: red; }`,
      extension: ".css",
      classMap: new Map([
        ["hover:[padding:10px_50px]", "a"],
        ["focus:text-[red]", "b"],
        ["sm:lg:text-red-500", "c"],
      ]),
    };
    const output = `@utility a { padding: 10px 50px; } @utility b { color: red; } .c { color: red; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("preserves classes not in classMap", () => {
    const input = {
      content: `.foo { color: red; } .bar { background: blue; }`,
      extension: ".css",
      classMap: new Map([["old-class", "a"]]),
    };
    const output = `.foo { color: red; } .bar { background: blue; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles empty classMap gracefully", () => {
    const input = {
      content: `.foo { color: red; } .bar { background: blue; }`,
      extension: ".css",
      classMap: new Map(),
    };
    const output = `.foo { color: red; } .bar { background: blue; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles classes that appear multiple times", () => {
    const input = {
      content: `.btn { color: red; } .btn:hover { color: blue; } .card .btn { margin: 5px; }`,
      extension: ".css",
      classMap: new Map([
        ["btn", "a"],
        ["card", "b"],
      ]),
    };
    const output = `.a { color: red; } .a:hover { color: blue; } .b .a { margin: 5px; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("avoids partial replacements by processing longer classes first", () => {
    const input = {
      content: `.btn { color: red; } .btn-primary { background: blue; } .btn-primary-large { padding: 20px; }`,
      extension: ".css",
      classMap: new Map([
        ["btn", "a"],
        ["btn-primary", "b"],
        ["btn-primary-large", "c"],
      ]),
    };
    const output = `.a { color: red; } .b { background: blue; } .c { padding: 20px; }`;

    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });
});
