export function replaceCssClasses(
  content: string,
  classMap: Map<string, string>
): string {
  return content.replace(/\.([a-zA-Z0-9\-_]+)\b/g, (match, cls) => {
    const newClass = classMap.get(cls);
    return newClass ? `.${newClass}` : match;
  });
}
