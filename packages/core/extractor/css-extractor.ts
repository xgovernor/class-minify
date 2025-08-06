export function extractCssClasses(content: string): Set<string> {
  const classRegex = /\.([a-zA-Z0-9\-_]+)\b/g;

  const classSet = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = classRegex.exec(content)) !== null) {
    const className = match[1];
    if (className.trim()) {
      classSet.add(className.trim());
    }
  }

  return classSet;
}
