import { describe, it, expect, vi } from "vitest";
import { replaceClasses } from "../packages/core/replacer/index";

describe("replaceClasses", () => {
  it("replaces CSS classes for style extensions", () => {
    const input = {
      content: `.old-class { color: red; }`,
      extension: ".css",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `.a { color: red; }`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  // Need to add other JS and TS cases
  it("replaces JavaScript classes for script extensions", () => {
    const input = {
      content: `const element = document.querySelector('.old-class'); element.classList.add('another-class');`,
      extension: ".js",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `document.querySelector('.a').classList.add('.b');`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("replaces TypeScript classes for script extensions", () => {
    const input = {
      content: `const element: HTMLElement = document.createElement('div'); element.className = 'old-class another-class';`,
      extension: ".ts",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `const element: HTMLElement = document.createElement('div'); element.className = 'a b';`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("replaces JSX classes for script extensions", () => {
    const input = {
      content: `<div className='old-class another-class'></div>`,
      extension: ".jsx",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `<div className='a b'></div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("replaces TSX classes for script extensions", () => {
    const input = {
      content: `<div className='old-class another-class'></div>`,
      extension: ".tsx",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `<div className='a b'></div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });
});
