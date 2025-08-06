export function extractHtmlClasses(content: string): Set<string> {
  const classRegex = [
    /class(Name)?=["'`]([^"'`]+)["'`]/g,
    /tw["'`"]([^"'`"]+)["'`"]/g,
  ];

  const classSet = new Set<string>();

  for (const regex of classRegex) {
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const classList = match[2].split(/\s+/);
      for (const cls of classList) {
        if (cls.trim()) {
          classSet.add(cls.trim());
        }
      }
    }
  }

  return classSet;
}
