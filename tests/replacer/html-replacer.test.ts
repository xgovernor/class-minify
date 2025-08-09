import { describe, it, expect } from "vitest";
import { replaceClasses } from "../../packages/core/replacer";

describe("replaceClasses", () => {
  it("handles single class in single element", () => {
    const input = {
      content: `export default function Hello() {
        return <div className="old-class">content</div>;
      }`,
      extension: ".jsx",
      classMap: new Map([
        ["old-class", "a"],
        ["another-class", "b"],
      ]),
    };
    const output = `export default function Hello() {
        return <div className="a">content</div>;
      }`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles multiple classes in single element", () => {
    const input = {
      content: `export default function Hello() {
        return <div className="class1 class2 class3">content</div>;
      }`,
      extension: ".jsx",
      classMap: new Map([
        ["class1", "a"],
        ["class2", "b"],
        ["class3", "c"],
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

  it("handles classes with special characters", () => {
    const input = {
      content: `export default function Hello() {
        return <div className="btn-primary test_class">content</div>;
      }`,
      extension: ".jsx",
      classMap: new Map([
        ["btn-primary", "a"],
        ["test_class", "b"],
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

  it("handles TailwindCSS arbitrary values & properties", () => {
    const input = {
      content: `export default function Hello() {
        return <div className="bg-[black] [color:white]">content</div>;
      }`,
      extension: ".jsx",
      classMap: new Map([
        ["bg-[black]", "a"],
        ["[color:white]", "b"],
      ]),
    };
    const output = `export default function Hello() {
        return <div className="a b">content</div>;
      }`;
    const result = replaceClasses(
      input.content,
      input.extension,
      input.classMap
    );

    expect(result).toBe(output);
  });

  it("handles TailwindCSS modifiers", () => {
    const input = {
      content: `export default function Hello() {
        return <div className="hover:[padding:10px_50px] focus:text-[red] sm:lg:text-red-500">content</div>;
      }`,
      extension: ".jsx",
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
      extension: ".jsx",
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
      extension: ".jsx",
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
      extension: ".jsx",
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
      extension: ".jsx",
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
      extension: ".jsx",
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
      extension: ".jsx",
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
      extension: ".jsx",
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
      extension: ".jsx",
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
      extension: ".jsx",
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
