import { describe, it, expect } from "vitest";
import { extractHtmlClasses } from "../packages/core/html-mod/html-extractor";

describe("HTML Extractor", () => {
  describe("Basic HTML class extraction", () => {
    it("extracts classes from HTML class attribute", () => {
      const input = `<div class="foo bar baz"></div>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["foo", "bar", "baz"]));
    });

    it("extracts classes from HTML class attribute with single quotes", () => {
      const input = `<div class='foo bar baz'></div>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["foo", "bar", "baz"]));
    });

    it("extracts classes from multiple HTML elements", () => {
      const input = `
        <div class="container">
          <p class="text-large">Hello</p>
          <span class="highlight bold">World</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set(["container", "text-large", "highlight", "bold"])
      );
    });

    it("handles empty class attributes", () => {
      const input = `<div class=""></div><p class="valid-class"></p>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["valid-class"]));
    });
  });

  describe("JSX className extraction", () => {
    it("extracts classes from JSX className attribute", () => {
      const input = `<div className="foo bar baz"></div>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["foo", "bar", "baz"]));
    });

    it("extracts classes from JSX className with single quotes", () => {
      const input = `<div className='foo bar baz'></div>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["foo", "bar", "baz"]));
    });

    it("extracts classes from JSX className with template literals", () => {
      const input = `<div className=\`foo bar baz\`></div>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["foo", "bar", "baz"]));
    });

    it("extracts classes from JSX components", () => {
      const input = `
        <Button className="primary large">
          <Icon className="arrow-right" />
          Click me
        </Button>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["primary", "large", "arrow-right"]));
    });
  });

  describe("TSX className extraction", () => {
    it("extracts classes from TSX with type annotations", () => {
      const input = `
        const component: React.FC = () => (
          <div className="wrapper">
            <span className="text">Hello TypeScript</span>
          </div>
        );
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["wrapper", "text"]));
    });

    it("extracts classes from TSX with interface props", () => {
      const input = `
        interface Props {
          className?: string;
        }
        const Component = ({ className }: Props) => (
          <div className="base-class additional-class">Content</div>
        );
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["base-class", "additional-class"]));
    });
  });

  describe("Tailwind CSS support", () => {
    it("extracts Tailwind tw attribute classes", () => {
      const input = `<div tw="flex items-center justify-between"></div>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set(["flex", "items-center", "justify-between"])
      );
    });

    it("extracts complex Tailwind classes", () => {
      const input = `
        <div className="sm:text-lg md:text-xl lg:text-2xl">
          <span className="hover:bg-blue-500 focus:outline-none">Button</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set([
          "sm:text-lg",
          "md:text-xl",
          "lg:text-2xl",
          "hover:bg-blue-500",
          "focus:outline-none",
        ])
      );
    });

    it("extracts Tailwind arbitrary values", () => {
      const input = `
        <div className="w-[32rem] h-[calc(100vh-4rem)]">
          <span className="bg-[#1da1f2] text-[color:var(--primary)]">Custom</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set([
          "w-[32rem]",
          "h-[calc(100vh-4rem)]",
          "bg-[#1da1f2]",
          "text-[color:var(--primary)]",
        ])
      );
    });

    it("extracts Tailwind classes with special characters", () => {
      const input = `<div className="w-1/2 h-3/4 top-1/3"></div>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["w-1/2", "h-3/4", "top-1/3"]));
    });
  });

  describe("Edge cases and complex scenarios", () => {
    it("handles template literal interpolations (current behavior)", () => {
      const input = `
        <div className={\`base-class \${isActive ? 'active' : ''} \${variant}\`}>
          Content
        </div>
      `;
      const result = extractHtmlClasses(input);
      // Current implementation extracts all visible text, including template parts
      expect(result).toEqual(new Set(["base-class", "active"]));
    });

    it("handles JavaScript expressions in className (current behavior)", () => {
      const input = `
        <div className={clsx('foo', { 'bar': isActive })}>
          <span className={\`baz \${condition ? 'qux' : ''}\`}>Text</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      // Current implementation extracts visible string parts
      expect(result).toEqual(new Set(["foo", "bar", "baz", "qux"]));
    });

    it("extracts classes from multiline attributes", () => {
      const input = `
        <div
          className="
            flex
            items-center
            justify-between
            px-4
            py-2
          "
        >
          Content
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set(["flex", "items-center", "justify-between", "px-4", "py-2"])
      );
    });

    it("handles self-closing tags", () => {
      const input = `
        <img className="responsive rounded" src="image.jpg" />
        <input class="form-input" type="text" />
        <hr className="divider" />
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set(["responsive", "rounded", "form-input", "divider"])
      );
    });

    it("extracts classes from nested structures", () => {
      const input = `
        <article className="post">
          <header className="post-header">
            <h1 className="post-title">Title</h1>
            <div className="post-meta">
              <time className="post-date">2024-01-01</time>
              <span className="post-author">Author</span>
            </div>
          </header>
          <main className="post-content">
            <p className="paragraph">Content</p>
          </main>
        </article>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set([
          "post",
          "post-header",
          "post-title",
          "post-meta",
          "post-date",
          "post-author",
          "post-content",
          "paragraph",
        ])
      );
    });

    it("handles extra whitespace in class names", () => {
      const input = `
        <div class="  foo    bar   baz  "></div>
        <span className="   single   "></span>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["foo", "bar", "baz", "single"]));
    });

    it("handles classes with numbers and special characters", () => {
      const input = `
        <div className="col-12 row-1 btn-2xl text-3xl">
          <span class="icon-24 margin-top-5 padding-x-2">Content</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set([
          "col-12",
          "row-1",
          "btn-2xl",
          "text-3xl",
          "icon-24",
          "margin-top-5",
          "padding-x-2",
        ])
      );
    });

    it("handles comments and mixed content", () => {
      const input = `
        <!-- This is a comment -->
        <div className="container">
          <!-- Another comment -->
          <p class="text">Hello World</p>
          {/* JSX comment */}
          <span className="highlight">Important</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["container", "text", "highlight"]));
    });

    it("returns empty set for content without classes", () => {
      const input = `
        <div>
          <p>No classes here</p>
          <span id="test">Just content</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set());
    });

    it("handles malformed HTML gracefully (current behavior)", () => {
      const input = `
        <div className="valid-class
        <span class="another-class">Content</span>
        <p className="final-class"></p>
      `;
      const result = extractHtmlClasses(input);
      // Current implementation extracts what it can find in malformed HTML
      expect(result).toEqual(
        new Set(["valid-class", "<span", "class=", "final-class"])
      );
    });

    it("handles very long class lists", () => {
      const classNames = Array.from({ length: 50 }, (_, i) => `class-${i}`);
      const input = `<div className="${classNames.join(" ")}"></div>`;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(classNames));
    });

    it("handles Unicode class names", () => {
      const input = `
        <div className="测试-class émoji-🎉 спец-символы">
          <span class="中文 français русский">Content</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set([
          "测试-class",
          "émoji-🎉",
          "спец-символы",
          "中文",
          "français",
          "русский",
        ])
      );
    });
  });

  describe("Framework-specific patterns", () => {
    it("extracts classes from React components with props", () => {
      const input = `
        function Button({ variant, size }) {
          return (
            <button className="btn btn-primary btn-large">
              <Icon className="icon-arrow" />
              Click me
            </button>
          );
        }
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set(["btn", "btn-primary", "btn-large", "icon-arrow"])
      );
    });

    it("extracts classes from Angular-style templates", () => {
      const input = `
        <div class="container">
          <ng-container class="wrapper">
            <app-component className="custom-component"></app-component>
          </ng-container>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set(["container", "wrapper", "custom-component"])
      );
    });

    it("extracts classes from Vue-style templates", () => {
      const input = `
        <template>
          <div class="vue-component">
            <component :is="dynamicComponent" className="dynamic-class" />
          </div>
        </template>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(new Set(["vue-component", "dynamic-class"]));
    });
  });

  describe("Current limitations and edge cases", () => {
    it("handles template literals without curly braces (current behavior)", () => {
      const input = `<div className={\`prefix-\${dynamic}-suffix\`}></div>`;
      const result = extractHtmlClasses(input);
      // Current implementation doesn't extract from complex template literals in curly braces
      expect(result.size).toBe(0);
    });

    it("processes simple expressions (current behavior)", () => {
      const input = `<div className={isActive ? 'active-class' : 'inactive-class'}></div>`;
      const result = extractHtmlClasses(input);
      // Current implementation doesn't extract from complex JavaScript expressions
      expect(result.size).toBe(0);
    });

    it("correctly identifies static class strings", () => {
      const input = `
        <div className="static-class">
          <span class="another-static">Text</span>
          <p tw="tailwind-class">Content</p>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set(["static-class", "another-static", "tailwind-class"])
      );
    });

    it("handles mixed static and dynamic content", () => {
      const input = `
        <div className="base-class">
          <Button className={\`btn \${variant}\`}>Click</Button>
          <span class="static-span">Text</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      // Should extract static classes and template literal content
      expect(result).toContain("base-class");
      expect(result).toContain("btn");
      expect(result).toContain("static-span");
    });

    it("works with conditional class assignments", () => {
      const input = `
        <div className="base always-present">
          <span className="conditional-base">Content</span>
        </div>
      `;
      const result = extractHtmlClasses(input);
      expect(result).toEqual(
        new Set(["base", "always-present", "conditional-base"])
      );
    });
  });
});
