import { describe, expect, it } from "vitest";
import { replaceClassesInFile } from "../src/replacer";
import path from "path";

describe("replaceClassesInFile", () => {
  const classMap = new Map([
    ["foo", "a"],
    ["bar-baz", "b"],
    ["qux", "c"],
    ["alpha", "d"],
    ["beta", "e"],
    ["tsclass", "f"],
    ["anotherClass", "g"],
  ]);

  it("replaces classes in HTML files", () => {
    const html = `<div class=\"foo bar-baz qux\"></div>\n<span class='alpha beta'></span>`;
    const result = replaceClassesInFile(html, "sample.html", classMap);
    expect(result).toContain('class="a b c"');
    expect(result).toContain("class='d e'");
  });

  it("replaces classes in CSS files", () => {
    const css = `.foo { color: red; }\n.bar-baz { color: blue; }\n.qux {}`;
    const result = replaceClassesInFile(css, "sample.css", classMap);
    expect(result).toContain(".a {");
    expect(result).toContain(".b {");
    expect(result).toContain(".c {");
  });

  it("replaces classes in TSX files", () => {
    const tsx = `export default function Demo() {\n  return <div className=\"tsclass anotherClass\"></div>;\n}`;
    const result = replaceClassesInFile(tsx, "sample.tsx", classMap);
    expect(result).toContain('className="f g"');
  });

  it("returns content unchanged for unsupported file types", () => {
    const txt = "Just some text.";
    const result = replaceClassesInFile(txt, "sample.txt", classMap);
    expect(result).toBe(txt);
  });
});
