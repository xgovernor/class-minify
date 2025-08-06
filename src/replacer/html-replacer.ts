export function replaceHtmlClasses(
  content: string,
  classMap: Map<string, string>
): string {
  const classRegexes = [
    /(?<prefix>class(Name)?=)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>[\"'`])/g,
    /(?<prefix>tw=)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>[\"'`])/g,
  ];

  return classRegexes.reduce((updatedContent, regex) => {
    return updatedContent.replace(
      regex,
      (
        match,
        prefix,
        _name,
        quote,
        value,
        quoteEnd,
        _offset,
        _string,
        groups
      ) => {
        const original = groups?.value ?? "";
        const replaced = original
          .split(/\s+/)
          .map((cls) => classMap.get(cls) || cls)
          .join(" ");

        return `${prefix}${quote}${replaced}${quoteEnd}`;
      }
    );
  }, content);
}
