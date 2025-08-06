#!/user/bin/env node

import path from "path";
import { runClassMinify } from "../packages/core/runner";

// Simple CLI arg parsing
const args = process.argv.slice(2);
let configPath = "classminify.config.ts";

for (let i = 0; i < args.length; i++) {
  if ((args[i] === "--config" || args[i] === "-c") && args[i + 1]) {
    configPath = args[i + 1];
  }
}

// Load config dynamically
async function loadConfig(pathStr: string): Promise<any> {
  const fullPath = path.resolve(process.cwd(), pathStr);

  if (!fullPath.endsWith(".ts") && !fullPath.endsWith(".js")) {
    throw new Error(`Invalid config file type: ${fullPath}`);
  }

  try {
    const config = await import(fullPath);
    return config.default || config;
  } catch (error) {
    console.error(`Error loading config from ${fullPath}:`);
    console.error(error);
    process.exit(1);
  }
}

(async () => {
  const config = await loadConfig(configPath);
  await runClassMinify(config);
})();
