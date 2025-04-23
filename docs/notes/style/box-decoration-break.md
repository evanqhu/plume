---
title: 行盒截断样式
createTime: 2025/04/23 09:32:25
permalink: /style/4qppc3du/
---

:::demo

```html
<div class="container">
  <p>
    lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur
    <span class="highlight"
      >adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit.</span
    >
    Quisquam, quos.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.lorem ipsum dolor sit amet
    consectetur adipisicing elit. Quisquam, quos.lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
    quos.
  </p>
</div>
```

```css
.highlight {
  background-color: lightgray;
  border-radius: 4px;
  border: 1px solid #000;
  padding: 0 4px;
  box-decoration-break: clone;
}
```

:::

## `box-decoration-break`

- `slice` ： 截断行盒的样式 （默认）
- `clone` ： 克隆行盒的样式
