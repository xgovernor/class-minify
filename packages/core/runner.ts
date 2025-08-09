import FastGlob from "fast-glob";
import { extractClasses } from "./extractor";
import { ClassNameGenerator } from "./generator";
import fs from "fs/promises";
import { replaceClasses } from "./replacer";
import defineConfig, { ClassMinifyConfigOptions } from "./config";
import path from "path";

export async function runClassMinify(
  options: Partial<ClassMinifyConfigOptions>
) {
  const {
    include,
    exclude,
    reserved: reservedKeywords,
    dryRun,
    generateMap,
    outputMapPath,
    strategy,
    // minLength,
    prefix,
  } = defineConfig(options);
  const allClasses = new Set<string>();
  const classMap = new Map<string, string>();
  const generator = new ClassNameGenerator(prefix, strategy);

  if (!include || include.length === 0) {
    throw new Error("No files specified in 'include' option.");
  }

  if (dryRun) {
    console.log("⚠️  Dry run mode enabled. No files will be modified.");
  }

  // Reading files and extracting classes
  const files = await FastGlob(include, { ignore: exclude });
  if (files.length === 0) {
    console.warn("⚠️  No files matched the include patterns.");
    return;
  }

  for (const file of files) {
    const ext = path.extname(file);
    const content = await fs.readFile(file, { encoding: "utf-8" });
    const extracted = extractClasses(content, ext);

    for (const cls of extracted) {
      if (
        cls &&
        cls.trim() &&
        !reservedKeywords.has(cls) &&
        !classMap.has(cls)
      ) {
        const minified = generator.next();
        classMap.set(cls, minified);
      }
    }
  }

  // Replace classes in all matched files
  for (const file of files) {
    const ext = path.extname(file);
    const content = await fs.readFile(file, "utf-8");
    const updated = replaceClasses(content, ext, classMap);

    if (dryRun) {
      if (updated !== content) {
        console.log(`🔍 Dry run: ${file}`);
        console.log("Preview of changes:\n", updated);
      }
    } else {
      if (updated !== content) {
        await fs.writeFile(file, updated, "utf-8");
        console.log(`✅ Updated: ${file}`);
      }
    }
  }

  // Output class mapping
  if (generateMap) {
    const outputMap = Object.fromEntries(classMap.entries());
    await fs.writeFile(
      outputMapPath,
      JSON.stringify(outputMap, null, 2),
      "utf-8"
    );
    console.log(`📦 Class map saved to: ${outputMapPath}`);
  }
}
