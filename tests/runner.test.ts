import { runClassMinify } from "../src/runner";
import fs from "fs/promises";
import path from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("runClassMinify", () => {
  const exampleDir = path.resolve(__dirname, "../example");
  const htmlFile = path.join(exampleDir, "runner-sample.html");
  const cssFile = path.join(exampleDir, "runner-sample.css");
  const mapFile = path.join(exampleDir, "classmap.json");

  beforeAll(async () => {
    await fs.writeFile(
      htmlFile,
      `<div class=\"foo bar-baz qux\"></div>\n<span class='alpha beta'></span>`
    );
    await fs.writeFile(
      cssFile,
      `.foo { color: red; }\n.bar-baz { color: blue; }\n.qux {}`
    );
  });

  afterAll(async () => {
    await fs.unlink(htmlFile);
    await fs.unlink(cssFile);
    try {
      await fs.unlink(mapFile);
    } catch {}
  });

  it("minifies classes and writes class map", async () => {
    await runClassMinify({
      include: [htmlFile, cssFile],
      outputMapPath: mapFile,
      generateMap: true,
      reserved: ["qux"],
    });
    const html = await fs.readFile(htmlFile, "utf-8");
    const css = await fs.readFile(cssFile, "utf-8");
    const map = JSON.parse(await fs.readFile(mapFile, "utf-8"));
    // Check that reserved class is not minified
    expect(html).toContain("qux");
    expect(css).toContain("qux");
    // Check that other classes are minified (single char)
    expect(html).toMatch(/class=\". . qux\"/);
    expect(css).toMatch(/\.. \{/);
    // Check map file
    expect(map["qux"]).toBe("qux");
    expect(
      Object.values(map).filter((v) => (v as string).length === 1).length
    ).toBeGreaterThan(0);
  });

  it("does not write files in dryRun mode", async () => {
    const htmlBefore = await fs.readFile(htmlFile, "utf-8");
    await runClassMinify({
      include: [htmlFile],
      dryRun: true,
    });
    const htmlAfter = await fs.readFile(htmlFile, "utf-8");
    expect(htmlAfter).toBe(htmlBefore);
  });
});
