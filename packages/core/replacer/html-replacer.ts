export function replaceHtmlClasses(
  content: string,
  classMap: Map<string, string>
): string {
  const classRegexes = [
    // Standard class and className attributes (HTML, JSX, TSX)
    /(?<prefix>class(?:Name)?=)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>\k<quote>)/g,

    // Tailwind tw shorthand
    /(?<prefix>tw=)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>\k<quote>)/g,

    // Template literals with class patterns (JS/TS)
    /(?<prefix>classList\.add\s*\(\s*)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>\k<quote>)/g,
    /(?<prefix>classList\.toggle\s*\(\s*)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>\k<quote>)/g,
    /(?<prefix>classList\.remove\s*\(\s*)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>\k<quote>)/g,

    // Vue class binding patterns
    /(?<prefix>:class=)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>\k<quote>)/g,
    /(?<prefix>v-bind:class=)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>\k<quote>)/g,

    // Svelte class binding patterns
    // Regular class attribute with template expressions: class="foo {bar ? 'baz' : ''}"
    /(?<prefix>class=)(?<quote>["'`])(?<value>(?:[^"'`{]+|\{[^}]*\})+)(?<quoteEnd>\k<quote>)/g,

    // Conditional class binding: class:foo={condition} or class:foo="" or class:foo (shorthand)
    /(?<prefix>class:)(?<identifier>[a-zA-Z][a-zA-Z0-9_-]*)(?<rest>=\{[^}]*\}|="[^"]*"|='[^']*'|=`[^`]*`|(?=\s|>))/g,
    /(?<prefix>\.(?:className|class)\s*`)(?<value>[^`]+)(?<quoteEnd>`)/g,

    // String concatenation patterns
    /(?<prefix>["'`])(?<value>(?:[a-zA-Z][a-zA-Z0-9_-]*\s*)+)(?<quoteEnd>["'`])/g,
  ];

  // Handle template strings with class names separately for better control
  let processedContent = content;

  // Replace class names inside template literals and string interpolations
  processedContent = processedContent.replace(
    /(['"`])[^'"`]*?\b([a-zA-Z][a-zA-Z0-9_-]+)\b[^'"`]*?\1/g,
    (match, quote, className) => {
      const replacement = classMap.get(className) || className;
      return match.replace(new RegExp(`\\b${className}\\b`, "g"), replacement);
    }
  );

  return classRegexes.reduce((updatedContent, regex) => {
    return updatedContent.replace(regex, (match, ...args) => {
      const groups = args[args.length - 1];
      if (!groups || typeof groups !== "object") return match;

      // Handle different regex patterns
      if (groups.identifier) {
        // Svelte conditional class binding: class:foo={condition}, class:foo="", or class:foo
        const classToReplace = groups.identifier;
        const replacedClass = classMap.get(classToReplace) || classToReplace;

        return `${groups.prefix}${replacedClass}${groups.rest || ""}`;
      } else if (groups.value) {
        // Standard class replacement - handle Svelte template expressions
        let replaced = groups.value;

        // First replace class names inside template expressions like '{condition ? "class-name" : ""}'
        replaced = replaced.replace(
          /(['"`])([a-zA-Z][a-zA-Z0-9_-]*)\1/g,
          (match: string, quote: string, className: string) => {
            const replacedClass = classMap.get(className) || className;
            return `${quote}${replacedClass}${quote}`;
          }
        );

        // Then replace regular class names (not inside {})
        replaced = replaced.replace(
          /(?<!\{[^}]*)\b([a-zA-Z][a-zA-Z0-9_-]*)\b(?![^{]*\})/g,
          (match: string, className: string) => {
            return classMap.get(className) || className;
          }
        );

        return (
          groups.prefix +
          (groups.quote || "") +
          replaced +
          (groups.quoteEnd || groups.quote || "")
        );
      }

      return match;
    });
  }, processedContent);
}
