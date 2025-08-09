export function replaceCssClasses(
  content: string,
  classMap: Map<string, string>
): string {
  return content.replace(
    /\.([a-zA-Z0-9\-_]+)(?![a-zA-Z0-9\-_])/g,
    (match, cls) => {
      const newClass = classMap.get(cls);
      return newClass ? `.${newClass}` : match;
    }
  );
}
