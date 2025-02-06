---
title: createApp 和 createVNode
createTime: 2025/02/06 16:27:36
permalink: /others/yiwkzj79/
---

`createApp` 和 `createVNode` 都是 Vue 3 提供的 API，但它们的用途和返回值完全不同：

## createApp（创建应用实例）

### 作用

`createApp` 用于创建 Vue 应用的根实例，通常用于初始化 Vue 组件树，并挂载到 DOM。

### 用法

```ts
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.mount("#app");
```

### 返回值

返回一个 应用实例 (App 对象)，该实例可以用来：

- 注册全局组件 (`app.component()`)
- 注册全局指令 (`app.directive()`)
- 使用插件 (`app.use()`)
- 挂载应用 (`app.mount()`)

## createVNode（创建虚拟节点）

### 作用

`createVNode`（或 h 函数）用于创建一个 VNode（虚拟节点），通常用于渲染函数或自定义渲染逻辑。

### 用法

```ts
import { createVNode, render } from "vue";

const vnode = createVNode("div", { class: "box" }, "Hello World");
render(vnode, document.getElementById("app")!);
```

### 返回值

返回一个 VNode（虚拟 DOM 节点），用于描述组件或元素的结构，不会直接渲染到 DOM，需要搭配 render 使用。

## 主要区别

| 特性       | createApp         | createVNode       |
| ---------- | ----------------- | ----------------- |
| 作用       | 创建 Vue 应用     | 创建虚拟节点      |
| 返回值     | App 实例          | VNode             |
| 主要用途   | 初始化 Vue 组件树 | 生成 VNode 供渲染 |
| 是否会渲染 | 需要 .mount()     | 需要 render()     |

### 总结

createApp 用于初始化整个 Vue 应用。
createVNode 用于创建虚拟 DOM 节点，通常用于渲染函数或手动渲染。
