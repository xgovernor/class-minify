import { runClassMinify, RunnerOptions } from "../core/runner";

export interface ClassMinifyVitePluginOptions extends RunnerOptions {}

export default function classMinifyPlugin(
  options: ClassMinifyVitePluginOptions
) {
  return {
    name: "vite:class-minify",
    apply: "build",
    enforce: "post",

    async generateBundle() {
      // Transformation logic goes here
      await runClassMinify(options);
    },
  };
}
