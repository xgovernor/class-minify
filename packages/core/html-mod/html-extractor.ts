import { regex } from "./constant";

export function extractHtmlClasses(content: string): Set<string> {
  const classRegex = regex.htmlJsxTsx;
  const classSet = new Set<string>();

  for (const regex of classRegex) {
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const rawValue = match?.groups?.value.trim();

      if (!rawValue) continue;

      const classList = rawValue.trim().split(/\s+/);

      for (const cls of classList) {
        // Skip template literals and string interpolations
        if (/[${}]/.test(cls)) continue;

        if (cls.trim()) {
          classSet.add(cls.trim());
        }
      }
    }
  }

  return classSet;
}
