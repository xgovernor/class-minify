export function replaceCssClasses(
  content: string,
  classMap: Map<string, string>
): string {
  if (!classMap || classMap.size === 0) {
    return content;
  }

  try {
    // Sort classes by length (longest first) to avoid partial replacements
    const sortedClasses = Array.from(classMap.keys()).sort(
      (a, b) => b.length - a.length
    );

    let processedContent = content;

    for (const originalClass of sortedClasses) {
      const newClass = classMap.get(originalClass);
      if (!newClass) continue;

      // Replace class in different CSS contexts
      processedContent = replaceClassInAllContexts(
        processedContent,
        originalClass,
        newClass
      );
    }

    return processedContent;
  } catch (error) {
    console.warn("Error during CSS class replacement:", error);
    return content; // Return original content on error
  }
}

/**
 * Escapes special regex characters in class names
 */
function escapeRegexSpecialChars(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Creates both escaped and CSS-escaped versions of a class name for matching
 */
function createClassVariants(className: string): string[] {
  const variants = [className];

  // Add CSS-escaped version (e.g., sm:lg:text -> sm\:lg\:text)
  const cssEscaped = className.replace(/[:\[\]]/g, "\\$&");
  if (cssEscaped !== className) {
    variants.push(cssEscaped);
  }

  return variants;
}

/**
 * Replaces a class in all possible CSS contexts
 */
function replaceClassInAllContexts(
  content: string,
  originalClass: string,
  newClass: string
): string {
  let result = content;
  const classVariants = createClassVariants(originalClass);

  for (const variant of classVariants) {
    const escapedVariant = escapeRegexSpecialChars(variant);

    // Context 1: Regular CSS selectors (.class-name)
    // Match .class but not when preceded by word chars or followed by word chars (except hyphens)
    const selectorRegex = new RegExp(
      `(^|[^\\w-])\\.${escapedVariant}(?![\\w-])`,
      "g"
    );
    result = result.replace(selectorRegex, `$1.${newClass}`);

    // Context 2: @utility directives (@utility class-name)
    const utilityRegex = new RegExp(
      `(@utility\\s+)${escapedVariant}(?![\\w-])`,
      "g"
    );
    result = result.replace(utilityRegex, `$1${newClass}`);

    // Context 3: @component directives (@component class-name)
    const componentRegex = new RegExp(
      `(@component\\s+)${escapedVariant}(?![\\w-])`,
      "g"
    );
    result = result.replace(componentRegex, `$1${newClass}`);

    // Context 4: @apply directives (handles classes within @apply statements)
    const applyRegex = new RegExp(
      `(@apply[^;{]*\\s+)${escapedVariant}(?![\\w-])`,
      "g"
    );
    result = result.replace(applyRegex, `$1${newClass}`);
  }

  return result;
}
