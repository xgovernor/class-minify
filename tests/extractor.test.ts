import { describe, it, expect, vi } from "vitest";
import { extractClasses } from "../packages/core/extractor/index";

describe("extractClasses", () => {
  it("extracts HTML classes for script extensions", () => {
    const input = {
      content: `<div className='foo bar'></div>`,
      extension: ".html",
    };
    const output = new Set(["foo", "bar"]);

    const result = extractClasses(input.content, input.extension);

    expect(result).toEqual(output);
  });

  it("extracts CSS classes for style extensions", () => {
    const input = {
      content: `body {background: red;} .foo { color: red; } .foo:hover > a { color: red; } .foo:hover > .bar { color: red; }`,
      extension: ".css",
    };
    const output = new Set(["foo", "bar"]);

    const result = extractClasses(input.content, input.extension);

    expect(result).toEqual(output);
  });

  it("extracts classes from JavaScript files", () => {
    const input = {
      content: `const element = document.createElement('div'); element.className = 'foo bar';`,
      extension: ".js",
    };
    const output = new Set(["foo", "bar"]);

    const result = extractClasses(input.content, input.extension);

    expect(result).toEqual(output);
  });

  it("extracts classes from TypeScript files", () => {
    const input = {
      content: `const element: HTMLElement = document.createElement('div'); element.className = 'foo bar';`,
      extension: ".ts",
    };
    const output = new Set(["foo", "bar"]);

    const result = extractClasses(input.content, input.extension);

    expect(result).toEqual(output);
  });

  it("returns classes from JSX files", () => {
    const input = {
      content: `<div className='foo bar'></div>`,
      extension: ".jsx",
    };
    const output = new Set(["foo", "bar"]);

    const result = extractClasses(input.content, input.extension);

    expect(result).toEqual(output);
  });

  it("returns classes from TSX files", () => {
    const input = {
      content: `<div className='foo bar'></div>`,
      extension: ".tsx",
    };
    const output = new Set(["foo", "bar"]);

    const result = extractClasses(input.content, input.extension);

    expect(result).toEqual(output);
  });

  it("returns classes from Vue files", () => {
    const input = {
      content: `<template><div class='foo bar'></div></template>`,
      extension: ".vue",
    };
    const output = new Set(["foo", "bar"]);

    const result = extractClasses(input.content, input.extension);

    expect(result).toEqual(output);
  });

  it("returns classes from Svelte files", () => {
    const input = {
      content: `<div class='foo bar'></div>`,
      extension: ".svelte",
    };
    const output = new Set(["foo", "bar"]);

    const result = extractClasses(input.content, input.extension);

    expect(result).toEqual(output);
  });

  it("returns empty set and warns for unsupported extensions", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = extractClasses("foo", ".txt");

    expect(result).toEqual(new Set());
    expect(warnSpy).toHaveBeenCalledWith(
      "ClassMinify: Skipped file with unsupported extension '.txt'"
    );
    warnSpy.mockRestore();
  });
});
