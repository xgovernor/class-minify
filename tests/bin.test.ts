import { describe, it, expect, vi } from "vitest";
import path from "path";
import fs from "fs/promises";

// We'll mock runClassMinify and dynamic import
vi.mock("../src/runner", () => ({
  runClassMinify: vi.fn().mockResolvedValue(undefined),
}));

const binPath = path.resolve(__dirname, "../bin/index.ts");

// Helper to run the CLI script with node --require ts-node/register
async function runBin(
  args: string[] = [],
  env: NodeJS.ProcessEnv = process.env
) {
  const { execa } = await import("execa");
  return execa("node", ["--require", "ts-node/register", binPath, ...args], {
    env,
  });
}

describe("bin/index.ts CLI", () => {
  it("loads config and runs without error", async () => {
    // Create a temp config file
    const configPath = path.resolve(__dirname, "../example/cli-config.ts");
    await fs.writeFile(configPath, "export default { include: ['foo'] }");
    // Run the CLI
    const result = await runBin(["--config", configPath]);
    expect(result.exitCode).toBe(0);
    await fs.unlink(configPath);
  });

  it("exits with error on invalid config file type", async () => {
    const result = await runBin(["--config", "bad.txt"]).catch((e) => e);
    expect(result.stderr).toMatch(/Invalid config file type/);
  });

  it("exits with error if config import fails", async () => {
    const badPath = path.resolve(__dirname, "../example/bad-config.ts");
    await fs.writeFile(badPath, "throw new Error('fail')");
    const result = await runBin(["--config", badPath]).catch((e) => e);
    expect(result.stderr).toMatch(/Error loading config/);
    await fs.unlink(badPath);
  });
});
