import { supportedScriptExtensions, supportedStyleExtensions } from "..";
import { replaceCssClasses } from "./css-replacer";
import { replaceHtmlClasses } from "./html-replacer";

export function replaceClasses(
  content: string,
  ext: string,
  classMap: Map<string, string>
): string {
  const normalizedExt = ext.toLowerCase();

  if (supportedScriptExtensions.has(normalizedExt)) {
    return replaceHtmlClasses(content, classMap);
  }

  if (supportedStyleExtensions.has(normalizedExt)) {
    return replaceCssClasses(content, classMap);
  }

  console.warn(`ClassMinify: Skipped file with unsupported extension '${ext}'`);
  return content;
}
