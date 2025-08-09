import { describe, it, expect } from "vitest";
import { replaceClasses } from "../../packages/core/replacer";

describe("replaceClasses", () => {
  it("handles single class", () => {
    const input = {
      content: `.old-class { color: red; } .another-class { color: blue; }`,
      extension: ".css",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `.a { color: red; } .b { color: blue; }`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles multiple classes", () => {
    const input = {
      content: `.class1 { color: red; } .class2 { color: green; } .class3 { color: blue; }`,
      extension: ".css",
      classMap: new Map([
        ["class1", "a"],
        ["class2", "b"],
        ["class3", "c"],
      ]),
    };
    const output = `.a { color: red; } .b { color: green; } .c { color: blue; }`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles classes with special characters", () => {
    const input = {
      content: `.btn-primary { color: red; } .test_class { color: blue; }`,
      extension: ".css",
      classMap: new Map([
        ["btn-primary", "a"],
        ["test_class", "b"],
      ]),
    };
    const output = `.a { color: red; } .b { color: blue; }`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles TailwindCSS utility classes", () => {
    const input = {
      content: `@utility flex { display: flex}; @utility items-center { align-items: center; }; @utility justify-between { justify-content: space-between; };`,
      extension: ".css",
      classMap: new Map([
        ["flex", "a"],
        ["items-center", "b"],
        ["justify-between", "c"],
      ]),
    };
    const output = `@utility a { display: flex}; @utility b { align-items: center; }; @utility c { justify-content: space-between; };`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles TailwindCSS component classes", () => {
    const input = {
      content: `@component btn { @apply bg-blue-500 text-white; }; @component card { @apply p-4 shadow-lg; };`,
      extension: ".css",
      classMap: new Map([
        ["btn", "a"],
        ["card", "b"],
      ]),
    };
    const output = `.a { @apply bg-blue-500 text-white; }; .b { @apply p-4 shadow-lg; };`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles TailwindCSS arbitrary values & properties", () => {
    const input = {
      content: `@utility bg-[black] { background-color: black; }; @utility [color:white] { color: white; }; @component card { @apply p-4 shadow-lg; };`,
      extension: ".css",
      classMap: new Map([
        ["bg-[black]", "a"],
        ["[color:white]", "b"],
        ["card", "c"],
      ]),
    };
    const output = `@utility a { background-color: black; }; @utility b { color: white; }; @component c { @apply p-4 shadow-lg; };`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles TailwindCSS modifiers", () => {
    const input = {
      content: `@utility hover\:\[padding\:10px_50px\] { padding: 10px 50px; }; @utility focus\:text-\[red\] { color: red; }; .sm\:lg\:text-red-500 { color: red; };`,
      extension: ".css",
      classMap: new Map([
        ["hover:[padding:10px_50px]", "a"],
        ["focus:text-[red]", "b"],
        ["sm:lg:text-red-500", "c"],
      ]),
    };
    const output = `export default function Hello() {
        return <div className="a b c">content</div>;
      }`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("", () => {});

  it("preserves classes not in classMap", () => {
    const input = {
      content: `export default function Hello() {
        return <div className="existing-class">content</div>;
      }`,
      extension: ".css",
      classMap: new Map([["old-class", "a"]]),
    };
    const output = `export default function Hello() {
        return <div className="existing-class">content</div>;
      }`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles empty class attributes", () => {
    const input = {
      content: `<div className="">content</div>`,
      extension: ".css",
      classMap: new Map([["old-class", "a"]]),
    };
    const output = `<div className="">content</div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles elements without class attributes", () => {
    const input = {
      content: `<div id="test">content</div>`,
      extension: ".css",
      classMap: new Map([["old-class", "a"]]),
    };
    const output = `<div id="test">content</div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles single quotes in class attributes", () => {
    const input = {
      content: `<div className='old-class another-class'>content</div>`,
      extension: ".css",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `<div className='a b'>content</div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles backticks in class attributes", () => {
    const input = {
      content: "<div className=`old-class another-class`>content</div>",
      extension: ".css",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `<div className='a b'>content</div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles nested elements with classes", () => {
    const input = {
      content: `<div className="outer"><span className="inner">text</span></div>`,
      extension: ".css",
      classMap: new Map([
        ["outer", "a"],
        ["inner", "b"],
      ]),
    };
    const output = `<div className="a"><span className="b">text</span></div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles self-closing tags with classes", () => {
    const input = {
      content: `<img className="image-class" src="test.jpg" />`,
      extension: ".css",
      classMap: new Map([["image-class", "a"]]),
    };
    const output = `<img className="a" src="test.jpg" />`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles extra whitespace in class attributes", () => {
    const input = {
      content: `<div className="  class1   class2  ">content</div>`,
      extension: ".css",
      classMap: new Map([
        ["class1", "a"],
        ["class2", "b"],
      ]),
    };
    const output = `<div className="a b">content</div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  // TODO
  // This method should be removed in future versions.
  it("handles duplicate class names", () => {
    const input = {
      content: `<div className="duplicate duplicate other">content</div>`,
      extension: ".css",
      classMap: new Map([
        ["duplicate", "a"],
        ["other", "b"],
      ]),
    };
    const output = `<div className="a a b">content</div>`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });
});
