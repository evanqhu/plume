---
title: Sass
createTime: 2025/04/10 09:08:13
permalink: /styles/93o7lc8n/
---

# Sass 高级用法笔记

Sass（Syntactically Awesome Stylesheets）是对 CSS 的扩展，提供了许多更高级、更结构化的功能，使样式编写更高效、可维护。

---

## 1. 变量（Variables）

使用变量存储颜色、字体、尺寸等，提高样式复用性：

```scss
$primary-color: #3498db;
$padding: 16px;

.button {
  background-color: $primary-color;
  padding: $padding;
}
```

---

## 2. 嵌套规则（Nesting）

通过嵌套写法简化层级结构：

```scss
.nav {
  ul {
    list-style: none;
  }

  li {
    display: inline-block;
  }

  a {
    color: blue;
    &:hover {
      color: red;
    }
  }
}
```

---

## 3. Mixin（混合宏）

封装一组样式，支持参数，提升复用性：

```scss
@mixin flex-center($justify: center, $align: center) {
  display: flex;
  justify-content: $justify;
  align-items: $align;
}

.container {
  @include flex-center(space-between);
}
```

### @content 的使用

`@content` 用于在 mixin 内部插入自定义样式内容，相当于“插槽”机制：

```scss
@mixin card {
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @content;
}

.card {
  @include card {
    color: #333;
    font-weight: bold;
  }
}
```

---

## 4. 继承（@extend）

通过继承已有样式类，减少重复：

```scss
.message {
  padding: 10px;
  border: 1px solid #ccc;
}

.success {
  @extend .message;
  border-color: green;
}
```

---

## 5. 函数（Functions）

Sass 提供内置函数，也支持自定义函数，处理颜色、计算等：

```scss
.box {
  width: 100% * 0.5; // 50%
  color: lighten(#000, 20%);
}
```

---

## 6. 条件语句（@if / @else）

根据条件动态生成样式：

```scss
$theme: dark;

body {
  @if $theme == light {
    background: #fff;
  } @else {
    background: #333;
  }
}
```

---

## 7. 循环语句（@for / @each / @while）

使用循环批量生成样式：

```scss
@for $i from 1 through 5 {
  .mt-#{$i} {
    margin-top: #{$i * 10}px;
  }
}
```

---

## 8. 模块化导入（@use / @forward）

相比旧的 `@import`，`@use` 更现代，支持命名空间与作用域控制：

```scss
// _variables.scss
$main-color: red !default;

// styles.scss
@use "variables" as v;

.title {
  color: v.$main-color;
}
```

---

## 总结

Sass 提供的高级功能让样式结构更清晰，逻辑更强大，特别适合中大型项目的样式管理和组件化开发。

## 示例

### 简化媒体查询

```scss
$breakPoints: (
  "mobile": (
    320px,
    480px,
  ),
  "tablet": (
    481px,
    768px,
  ),
  "smallLaptop": (
    769px,
    1024px,
  ),
  "laptop": (
    1025px,
    1200px,
  ),
  "desktop": 1201px,
);

@mixin responseTo($device) {
  $config: map-get($breakPoints, $device);

  @if type-of($config) == "list" {
    @media (min-width: nth($config, 1)) and (max-width: nth($config, 2)) {
      @content;
    }
  } @else {
    @media (min-width: $config) {
      @content;
    }
  }
}
```
