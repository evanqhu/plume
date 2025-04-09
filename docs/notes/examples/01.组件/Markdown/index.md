---
title: Markdown
createTime: 2025/04/09 11:43:01
permalink: /examples/shmnzhu1/
---

::: note
<https://www.npmjs.com/package/marked>
:::

`marked` 是一个非常流行的 JavaScript Markdown 解析器，可以将 Markdown 语法转换为 HTML，适用于前端和 Node.js 环境。它性能高、体积小、支持扩展，常用于博客系统、文档系统、Markdown 编辑器等项目中。

---

## 🏷️ Demo
@[demo vue](./index.vue)

## 🌟 基本介绍

- **官网**：[https://marked.js.org/](https://marked.js.org/)
- **GitHub**：[https://github.com/markedjs/marked](https://github.com/markedjs/marked)
- **安装方式**：
  ```bash
  npm install marked
  # 或者
  pnpm add marked
  ```

---

## 📌 基本用法

```js
import { marked } from "marked";

const markdownString = "# Hello\n\nThis is **Markdown** text!";
const html = marked(markdownString);

console.log(html);
// 输出：<h1>Hello</h1><p>This is <strong>Markdown</strong> text!</p>
```

---

## ⚙️ 配置项（options）

`marked` 提供了很多配置选项用于自定义 Markdown 的解析行为：

```js
marked.setOptions({
  gfm: true, // 支持 GitHub Flavored Markdown
  breaks: true, // 支持换行
  smartypants: true, // 更漂亮的引号等排版
  headerIds: false, // 是否为标题生成 id
});
```

---

## 🧩 自定义渲染器（Renderer）

你可以使用 `Renderer` 来定制不同 Markdown 语法生成的 HTML，比如想修改 link 的打开方式：

```js
const renderer = {
  link(href, title, text) {
    return `<a href="${href}" target="_blank">${text}</a>`;
  },
};

marked.use({ renderer });
```

---

## 🧪 支持语法高亮

`marked` 本身不带语法高亮功能，但你可以结合 [highlight.js](https://highlightjs.org/) 一起用：

```js
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

marked.setOptions({
  highlight: (code, lang) => {
    return hljs.highlightAuto(code).value;
  },
});
```

---

## ✅ 优点

- 支持 CommonMark 和 GFM（GitHub Flavored Markdown）
- 性能强劲（比很多解析器都快）
- 可扩展性强（可自定义渲染器）
- 兼容性好，可用于浏览器和 Node.js

---

## 🚫 注意事项

- `marked` 只负责解析，不负责 DOM 渲染。
- 解析后的 HTML 若直接插入页面，要注意 XSS 安全问题，可以配合 `DOMPurify` 进行 HTML 消毒。

```js
import DOMPurify from "dompurify";

const safeHtml = DOMPurify.sanitize(marked(mdText));
```

---

如果你有具体使用场景（比如 Nuxt / Vue / React），我也可以给你配合方案 😄
