import { RunnerOptions } from "../src/runner";

const config: RunnerOptions = {
  include: ["example/**/*.{tsx,js,html,css}"],
  exclude: ["node_modules"],
  generateMap: true,
  outputMapPath: "example/classmap.json",
  reserved: ["qux"],
};

export default config;
