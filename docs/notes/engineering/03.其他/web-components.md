---
title: Web 组件
createTime: 2025/03/26 16:19:59
permalink: /engineering/g4qjdfy6/
---

::: note
<https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/>
:::

## 概念和使用

Web Components 由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。

- **Custom element（自定义元素）**：一组 JavaScript API，允许你定义 custom elements 及其行为，然后可以在你的用户界面中按照需要使用它们。
- **Shadow DOM（影子 DOM）**：一组 JavaScript API，用于将封装的“影子”DOM 树附加到元素（与主文档 DOM 分开呈现）并控制其关联的功能。通过这种方式，你可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
- **HTML template（HTML 模板）**： `<template>` 和 `<slot>` 元素使你可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

实现 web component 的基本方法通常如下所示：

- 创建一个类或函数来指定 web 组件的功能。
- 使用 `CustomElementRegistry.define()` 方法注册你的新自定义元素，并向其传递要定义的元素名称、指定元素功能的类、以及可选的其所继承自的元素。
- 如果需要的话，使用 `Element.attachShadow()` 方法将一个 shadow DOM 附加到自定义元素上。使用通常的 DOM 方法向 shadow DOM 中添加子元素、事件监听器等等。
- 如果需要的话，使用 `<template>` 和 `<slot>` 定义一个 HTML 模板。再次使用常规 DOM 方法克隆模板并将其附加到你的 shadow DOM 中。
- 在页面任何你喜欢的位置使用自定义元素，就像使用常规 HTML 元素那样。

## 示例

:::demo

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Web Components</title>
  </head>
  <body>
    <!-- 使用自定义按钮元素 -->
    <custom-button></custom-button>

    <!-- 定义自定义按钮的模板 -->
    <template id="custom-button">
      <!-- 按钮的内容 -->
      <button>自定义按钮</button>
      <!-- 按钮的样式 -->
      <style>
        button {
          display: inline-block; /* 使按钮为行内块元素 */
          line-height: 1; /* 行高设置为1 */
          white-space: nowrap; /* 不换行 */
          cursor: pointer; /* 鼠标悬停时显示为指针 */
          text-align: center; /* 文本居中对齐 */
          box-sizing: border-box; /* 包含内边距和边框在内的宽高计算 */
          outline: none; /* 去掉默认的轮廓 */
          margin: 0; /* 去掉外边距 */
          transition: 0.1s; /* 添加过渡效果 */
          font-weight: 500; /* 字体加粗 */
          padding: 12px 20px; /* 内边距 */
          font-size: 14px; /* 字体大小 */
          border-radius: 4px; /* 圆角边框 */
          color: #fff; /* 字体颜色 */
          background-color: #409eff; /* 按钮背景颜色 */
          border-color: #409eff; /* 边框颜色 */
          border: 0; /* 去掉边框 */
        }

        button:active {
          background: #3a8ee6; /* 按钮被点击时的背景颜色 */
          border-color: #3a8ee6; /* 按钮被点击时的边框颜色 */
          color: #fff; /* 按钮被点击时的字体颜色 */
        }
      </style>
    </template>

    <script>
      // 定义自定义元素类
      class CustomButton extends HTMLElement {
        constructor() {
          super(); // 必须首先调用 super 方法；调用父类构造函数

          // 按钮的功能
          // 获取模板内容
          const templateContent = document.getElementById("custom-button").content;
          // 将一个 shadow DOM 附加到自定义元素上
          const shadowRoot = this.attachShadow({ mode: "open" });

          shadowRoot.appendChild(templateContent.cloneNode(true)); // 克隆模板并添加到影子 DOM 中

          // 为按钮添加点击事件
          shadowRoot.querySelector("button").onclick = () => {
            alert("Hello World!"); // 点击按钮时弹出提示框
          };
        }

        // 当自定义元素第一次被连接到文档 DOM 时被调用
        connectedCallback() {
          console.log("web components connected"); // 在控制台输出连接信息
        }
      }

      // 注册自定义元素
      customElements.define("custom-button", CustomButton);
    </script>
  </body>
</html>
```

:::
