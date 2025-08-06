import FastGlob from "fast-glob";
import { extractAllClasses } from "./extractor";
import { ClassNameGenerator } from "./generator";
import fs from "fs/promises";
import { replaceClassesInFile } from "./replacer";

export interface RunnerOptions {
  include: string[];
  exclude?: string[];
  dryRun?: boolean; // If true, don't overwrite files
  generateMap?: boolean; // If true, generate a class map file
  outputMapPath?: string; // Path to save the class map file
  reserved?: string[]; // Classes that should not be replaced
}

export async function runClassMinify(options: RunnerOptions) {
  const {
    include,
    exclude = [],
    dryRun = false,
    generateMap = false,
    outputMapPath = "classmap.json",
    reserved = [],
  } = options;

  const generator = new ClassNameGenerator();

  const allClasses = await extractAllClasses(include, exclude);
  const filteredClasses = Array.from(allClasses).filter(
    (c) => !reserved.includes(c)
  );

  const classMap = new Map<string, string>();
  for (const cls of filteredClasses) {
    const short = generator.next();
    classMap.set(cls, short);
  }

  // Add reserved classes 1-to-1 mapping
  for (const cls of reserved) {
    if (!classMap.has(cls)) {
      classMap.set(cls, cls);
    }
  }

  // Replace classes in all matched files
  const files = await FastGlob(include, { ignore: exclude });

  for (const file of files) {
    const content = await fs.readFile(file, { encoding: "utf-8" });
    const updated = replaceClassesInFile(content, file, classMap);

    if (!dryRun && updated !== content) {
      await fs.writeFile(file, updated, { encoding: "utf-8" });
      console.log(`Updated: ${file}`);
    }
  }

  // Save class map
  if (generateMap) {
    const obj = Object.fromEntries(classMap);
    await fs.writeFile(outputMapPath, JSON.stringify(obj, null, 2), {
      encoding: "utf-8",
    });
    console.log(`Class map saved to: ${outputMapPath}`);
  }
}
