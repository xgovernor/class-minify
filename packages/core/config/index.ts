interface ConfigOptions {
  /**
   * Globe patterns to include files for processing.
   */
  include: string[];

  /**
   * Globe patterns to exclude files from processing.
   */
  exclude: string[];

  /**
   * Class names to preserve from being shortened.
   * Useful for keeping certain classes intact.
   */
  reserved: Set<string>;

  /**
   * Whether to simulate changes without actually writing to files.
   */
  dryRun: boolean;

  /**
   * Whether to generate a mapping file of original -> minified versions.
   */
  generateMap: boolean;

  /**
   * Output path of generated class mapping file.
   * Only used if generateMap is true.
   */
  outputMapPath: string;

  /**
   * Strategy for generating class names. E.g., "deterministic" or "random".
   */
  strategy: "deterministic";

  /**
   * Optional prefix for generated class names.
   * Useful for namespacing or avoiding conflicts.
   */
  prefix: string;
}

interface ClassMinifyConfigOptions
  extends Partial<Omit<ConfigOptions, "reserved">> {
  reserved?: string[]; // Allow reserved to be passed as an array
}

export default function defineConfig(
  config: ClassMinifyConfigOptions
): ConfigOptions {
  return {
    include: config.include ?? ["src/**/*.{js,ts,tsx,jsx,vue,html,svelte}"],
    exclude: config.exclude ?? [],
    reserved: new Set(config.reserved ?? []), // Convert array to Set
    dryRun: config.dryRun ?? false,
    generateMap: config.generateMap ?? false,
    outputMapPath: config.outputMapPath ?? "classminify.map.json",
    strategy: config.strategy ?? "deterministic",
    prefix: config.prefix ?? "",
  };
}

export { defineConfig, ClassMinifyConfigOptions };
