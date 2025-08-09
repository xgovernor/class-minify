import { extractHtmlClasses } from "./html-extractor";
import { extractCssClasses } from "./css-extractor";
import { supportedScriptExtensions, supportedStyleExtensions } from "..";

export function extractClasses(content: string, ext: string): Set<string> {
  const normalizedExt = ext.toLowerCase();

  if (supportedScriptExtensions.has(normalizedExt)) {
    return extractHtmlClasses(content);
  }

  if (supportedStyleExtensions.has(normalizedExt)) {
    return extractCssClasses(content);
  }

  console.warn(`ClassMinify: Skipped file with unsupported extension '${ext}'`);
  return new Set();
}
