### Example 1

```html
<!-- Input -->
<!-- Basic HTML -->
<div class="old-class">content</div>
<!-- CSS -->
<style>
  .old-class {
    color: red;
  }
</style>

<!-- Class Minified Output -->
<div class="a">content</div>
<!-- CSS Minified Output -->
<style>
  .a {
    color: red;
  }
</style>
```

### Example 2

```html
<!-- Input -->
<!-- HTML with multiple classes -->
<div class="class1 class2 class3">content</div>
<!-- CSS -->
<style>
  .class1 {
    color: blue;
  }
  .class2 {
    font-size: 16px;
  }
  .class3 {
    font-weight: bold;
  }
</style>

<!-- Class Minified Output -->
<div class="a b c">content</div>
<!-- CSS Minified Output -->
<style>
  .a {
    color: blue;
  }
  .b {
    font-size: 16px;
  }
  .c {
    font-weight: bold;
  }
</style>
```

### Example 3

```html
<!-- Input -->
<!-- HTML with nested elements -->
<div class="outer">
  <div class="inner">content</div>
</div>
<!-- CSS -->
<style>
  .outer {
    background-color: yellow;
  }
  .inner {
    padding: 10px;
    border: 1px solid black;
  }
</style>

<!-- Class Minified Output -->
<div class="a">
  <div class="b">content</div>
</div>
<!-- CSS Minified Output -->
<style>
  .a {
    background-color: yellow;
  }
  .b {
    padding: 10px;
    border: 1px solid black;
  }
</style>
```

### Example 4

```html
<!-- Input -->
```
