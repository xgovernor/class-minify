export const regex = {
  /**
   * Extract `class` & `className` assignments
   */
  htmlJsxTsx: [
    /(?<prefix>class(?:Name)?\s*=\s*)\{?(?<quote>["'`])(?<value>[\s\S]*?)(?<quoteEnd>\k<quote>)\}?/g, // Match className assignments
    /(?<prefix>tw=)(?<quote>["'`])(?<value>[^"'`]+)(?<quoteEnd>\k<quote>)/g,
  ],
  cssClasses: [/(?:\.|@utility\s+|@component\s+)(?<selector>[^{]+?)(?=\s*\{)/g],
  jsTs: [],
  vue: [],
  svelte: [],
};
