import { describe, expect, it } from "vitest";
import { extractCssClasses } from "../packages/core/css-mod/index";

describe("CSS Class Extraction", () => {
  it("extracts classes from CSS content", () => {
    const input = `.foo { color: red; } .foo-bar { background: blue; } .foo_bar{background: green;}`;
    const output = new Set(["foo", "foo-bar", "foo_bar"]);

    const result = extractCssClasses(input);

    expect(result).toEqual(output);
  });

  it("extracts classes from multiple CSS rules", () => {
    const input = `
          .foo { color: red; }
          .bar::after { background: blue; }
          .foo_bar:hover { color: green; }
        `;
    const output = new Set(["foo", "bar", "foo_bar"]);

    const result = extractCssClasses(input);

    expect(result).toEqual(output);
  });

  it("extracts nested classes", () => {
    const input = `
          .foo { color: red; }
          .foo .bar { background: blue; }
          .foo .baz:hover { color: green; }
          .o4l4d-cl5ass::after, .second-Class > .text nav { color: red; }
        `;
    const output = new Set([
      "foo",
      "bar",
      "baz",
      "o4l4d-cl5ass",
      "second-Class",
      "text",
    ]);

    const result = extractCssClasses(input);

    expect(result).toEqual(output);
  });

  // Tailwind classes
  it("extracts TailwindCSS basic classes", () => {
    const input = `.w-1\/2 { color: green; }`;
    const output = new Set(["w-1/2"]);

    const result = extractCssClasses(input);

    expect(result).toEqual(output);
  });

  it("extracts TailwindCSS responsive classes", () => {
    const input = `.sm\:lg\:text-red-500 { color: red; };  // Handles sm:lg:text-red-500`;
    const output = new Set(["sm:lg:text-red-500"]);

    const result = extractCssClasses(input);

    expect(result).toEqual(output);
  });

  it("extracts TailwindCSS utility classes", () => {
    const input = `@utility flex { display: flex; } .hidden { display: none; }`;
    const output = new Set(["flex", "hidden"]);

    const result = extractCssClasses(input);

    expect(result).toEqual(output);
  });

  it("extracts TailwindCSS component classes", () => {
    const input = `@component card { @apply flex; }`;
    const output = new Set(["card"]);

    const result = extractCssClasses(input);

    expect(result).toEqual(output);
  });

  // Extra
  it("extracts classes from extended selectors", () => {
    const input = `.class3 { color: blue; }
.btn-primary::after { color: red; }
.another-class-sdf:hover { color: blue; }
.test_class { color: blue; }

.o4l4d-cl5ass, .second-Class .text nav { color: red; }
.o4l4d-cl5ass, .second-Class > .text nav { color: red; }

.w-1\/2 { color: green; }  // Handles w-1/2
.sm\:lg\:text-red-500 { color: red; };  // Handles sm:lg:text-red-500
.bg-\[url(/sdf.png)\] {background: url(/sdf.png)} // Handles bg-[url(/sdf.png)]
.\[color\:\#000c19\] { color: red; } // Handles [color:#000c19]
.sm\:max-lg\:[&_a]:text-red-500 { color: red; }; // Handles sm:max-lg:[&_a]:text-red-500

@utility flex { display: flex};
@utility items-center { align-items: center; };
@utility justify-between { justify-content: space-between; };
@component btn { @apply bg-blue-500 text-white; };
@component card { @apply p-4 shadow-lg; };
@utility bg-[black] { background-color: black; };
@utility [color:white] { color: white; };
@component card { @apply p-4 shadow-lg; };
@utility hover\:\[padding\:10px_50px\] { padding: 10px 50px; };
@utility focus\:text-\[red\] { color: red; };`;
    const output = new Set([
      "class3",
      "btn-primary",
      "another-class-sdf",
      "test_class",
      "o4l4d-cl5ass",
      "second-Class",
      "text",
      "w-1/2",
      "sm:lg:text-red-500",
      "bg-[url(/sdf.png)]",
      "[color:#000c19]",
      "sm:max-lg:[&_a]:text-red-500",
      "flex",
      "items-center",
      "justify-between",
      "btn",
      "card",
      "bg-[black]",
      "[color:white]",
      "hover:[padding:10px_50px]",
      "focus:text-[red]",
    ]);

    const result = extractCssClasses(input);

    expect(result).toEqual(output);
  });
});
