export { ClassNameGenerator } from "./generator";
export { defineConfig, ClassMinifyConfigOptions } from "./config";

export const supportedScriptExtensions = new Set([
  ".html",
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".vue",
  ".svelte",
]);

export const supportedStyleExtensions = new Set([".css", ".scss", ".less"]);
