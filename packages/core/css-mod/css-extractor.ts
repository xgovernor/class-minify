import { RESERVED_PSEUDO_CLASSES, RESERVED_PSEUDO_ELEMENTS } from "./constant";

export function extractCssClasses(content: string): Set<string> {
  const classSet = new Set<string>();

  content = normalizeContent(content);

  // Extract class names
  const regex = /(?=\.)(?<selector>[^{]+?)(?=\s*\{)/g;

  const matches = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    matches.push(match[0].trim());
  }

  matches.forEach((match) => {
    if (!match) return;

    // Split by comma or whitespace
    const parts = match.split(/[\s,]+/g).filter((w) => w.startsWith("."));
    for (const cls of parts) {
      if (cls.startsWith(".") && !cls.includes("}")) {
        classSet.add(cls.slice(1)); // Remove the leading dot
      }
    }
  });

  return classSet;
}

const normalizeContent = (content: string): string => {
  // Normalize utility and component directives
  content = content.replace(/@utility\s+/g, ".").replace(/@component\s+/g, ".");

  // Remove CSS comments (/* */) and inline comments (//)
  content = content.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

  // Remove pseudo-class variants
  for (const pseudo of RESERVED_PSEUDO_CLASSES) {
    const fullRegexString = `:${pseudo}`;
    // Match :hover, :focus, etc., but NOT escaped Tailwind variants like hover\:
    const re = new RegExp(fullRegexString, "g");
    content = content.replace(re, "");
  }

  // Remove reserved pseudo-elements
  for (const pseudo of RESERVED_PSEUDO_ELEMENTS) {
    // Match ::before, ::after, etc., but avoid escaped variants
    const re = new RegExp(`::${pseudo}`, "g");
    content = content.replace(re, "");
  }

  return content;
};
