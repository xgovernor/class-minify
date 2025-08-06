import { PluginCreator, Rule } from "postcss";

interface PostcssMinifyPluginOptions {
  classMap?: Record<string, string>;
}

const postcssMinifyClassNames: PluginCreator<PostcssMinifyPluginOptions> = (
  opts = { classMap: {} }
) => {
  const classMap = opts.classMap || {};

  return {
    postcssPlugin: "postcss-minify-class-names",
    Rule(rule) {
      rule.selectors = rule.selectors.map((selector) => {
        return selector.replace(/\.(\w[\w-]*)/g, (_, className) => {
          const minified = classMap[className];
          return minified ? `.${minified}` : `.${className}`;
        });
      });
    },
    AtRule: {
      keyframes(atRule) {
        const original = atRule.params;
        if (classMap[original]) {
          atRule.params = classMap[original];
        }
      },
    },
    Declaration(decl) {
      if (
        (decl.prop === "animation" || decl.prop === "animation-name") &&
        classMap[decl.value]
      ) {
        decl.value = classMap[decl.value];
      }
    },
  };
};

postcssMinifyClassNames.postcss = true;

export default postcssMinifyClassNames;
