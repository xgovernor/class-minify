import { extractAllClasses } from "../src/extractor";
import path from "path";
import fs from "fs/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("extractAllClasses", () => {
  const exampleDir = path.resolve(__dirname, "../example");
  const htmlFile = path.join(exampleDir, "sample.html");
  const cssFile = path.join(exampleDir, "sample.css");
  const tsxFile = path.join(exampleDir, "sample.tsx");

  beforeAll(async () => {
    await fs.writeFile(
      htmlFile,
      `<div class="foo bar-baz qux"></div>\n<span class='alpha beta'></span>`
    );
    await fs.writeFile(
      cssFile,
      `.foo { color: red; }\n.bar-baz { color: blue; }\n.qux {}`
    );
    await fs.writeFile(
      tsxFile,
      `export default function Demo() {\n  return <div className=\"tsclass anotherClass\"></div>;\n}`
    );
  });

  afterAll(async () => {
    await fs.unlink(htmlFile);
    await fs.unlink(cssFile);
    await fs.unlink(tsxFile);
  });

  it("extracts classes from HTML, CSS, and TSX files", async () => {
    const globs = [
      path.join(exampleDir, "*.html"),
      path.join(exampleDir, "*.css"),
      path.join(exampleDir, "*.tsx"),
    ];
    const result = await extractAllClasses(globs);
    expect(result).toEqual(
      new Set([
        "foo",
        "bar-baz",
        "qux",
        "alpha",
        "beta",
        "tsclass",
        "anotherClass",
      ])
    );
  });

  it("respects exclude patterns", async () => {
    const globs = [path.join(exampleDir, "*.*")];
    const exclude = ["**/*.css"];
    const result = await extractAllClasses(globs, exclude);

    expect(result.has("foo")).toBe(true);
    expect(result.has("bar-baz")).toBe(true);
    expect(result.has("tsclass")).toBe(true);
    expect(result.has("anotherClass")).toBe(true);
    expect(result.has("alpha")).toBe(true);
    expect(result.has("beta")).toBe(true);
    expect(result.has("qux")).toBe(true);
    // CSS classes should not be present
    expect(result.has("foo")).toBe(true); // from HTML
    // But if only in CSS, would be missing
  });
});
