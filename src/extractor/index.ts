import FastGlob from "fast-glob";
import path from "path";
import fs from "fs/promises";
import { extractHtmlClasses } from "./html-extractor";
import { extractCssClasses } from "./css-extractor";

export async function extractAllClasses(
  globs: string[],
  exclude: string[] = []
): Promise<Set<string>> {
  const files = await FastGlob(globs, { ignore: exclude });
  const allClasses = new Set<string>();

  for (const file of files) {
    const ext = path.extname(file);
    const content = await fs.readFile(file, "utf-8");

    let found: Set<string>;

    if (
      [
        ".html",
        ".js",
        ".ts",
        ".js",
        ".tsx",
        ".jsx",
        ".vue",
        ".svelte",
      ].includes(ext)
    ) {
      found = extractHtmlClasses(content);
    } else if ([".css", ".scss", ".less"].includes(ext)) {
      found = extractCssClasses(content);
    } else {
      continue; // Skip unsupported file types
    }

    found?.forEach((cls) => allClasses.add(cls));
  }

  return allClasses;
}
