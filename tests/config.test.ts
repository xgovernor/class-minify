import { describe, it, expect } from "vitest";
import defineConfig from "../packages/core/config/index";

describe("defineConfig", () => {
  it("returns default config when no user config is provided", () => {
    const config = defineConfig({});
    expect(config.include).toEqual([
      "src/**/*.{js,ts,tsx,jsx,vue,html,svelte}",
    ]);
    expect(config.exclude).toEqual([]);
    expect(config.reserved).toEqual(new Set());
    expect(config.dryRun).toBe(false);
    expect(config.generateMap).toBe(false);
    expect(config.outputMapPath).toBe("classminify.map.json");
    expect(config.strategy).toBe("deterministic");
    expect(config.prefix).toBe("");
  });

  it("overrides default config with user config", () => {
    const config = defineConfig({
      include: ["custom/**/*.js"],
      dryRun: true,
      outputMapPath: "custom.map.json",
      strategy: "deterministic",
      prefix: "x-",
    });
    expect(config.include).toEqual(["custom/**/*.js"]);
    expect(config.dryRun).toBe(true);
    expect(config.outputMapPath).toBe("custom.map.json");
    expect(config.strategy).toBe("deterministic");
    expect(config.prefix).toBe("x-");
  });

  it("converts reserved array to Set", () => {
    const config = defineConfig({ reserved: ["foo", "bar"] });
    expect(config.reserved).toEqual(new Set(["foo", "bar"]));
  });

  it("handles empty reserved array", () => {
    const config = defineConfig({ reserved: [] });
    expect(config.reserved).toEqual(new Set());
  });
});
