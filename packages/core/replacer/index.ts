import path from "path";
import { replaceHtmlClasses } from "./html-replacer";
import { replaceCssClasses } from "./css-replacer";

export function replaceClassesInFile(
  content: string,
  filepath: string,
  classMap: Map<string, string>
): string {
  const ext = path.extname(filepath);

  if (
    [".html", ".js", ".ts", ".js", ".tsx", ".jsx", ".vue", ".svelte"].includes(
      ext
    )
  ) {
    return replaceHtmlClasses(content, classMap);
  } else if ([".css", ".scss", ".less"].includes(ext)) {
    return replaceCssClasses(content, classMap);
  }

  return content; // Return unchanged for unsupported file types
}
