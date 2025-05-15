---
title: 自动生成路由
createTime: 2025/05/15 09:36:01
permalink: /engineering/2gn3wazq/
---

在 Vite 中实现根据文件夹自动生成路由。（约定大于配置）

**原路由写法**

::: code-tabs
@tab src/router/index.ts

```ts
const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/index.vue"),
    meta: {
      title: "首页",
      menuOrder: 1,
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/about/index.vue"),
    meta: {
      title: "关于",
      menuOrder: 2,
    },
  },
];
```

:::

## 实现思路

### 约定

1. 在每个路由组件旁边新增 `page.js` 用于存储路由的 `meta` 信息
2. 所有的路由组件都命名为 `index.vue`，通过文件夹的层级来决定路由的层级

### 实现

1. 使用 `import.meta.glob` 导入所有所有的 `page.js` 文件
2. 遍历 `page.js` 文件，将路由信息添加到路由配置中
3. 使用 `import.meta.glob` 导入所有所有的 `index.vue` 文件
4. 设置路由信息中的组件 component

::: code-tabs

@tab src/views/about/page.js

```js
export default {
  title: "关于",
  menuOrder: 2,
};
```

@tab src/router/index.ts

```ts
import { createRouter, createWebHistory } from "vue-router";

/**
 * 参数 1：路由文件路径模式匹配
 * 参数 2：配置
 * 设置 eager: true 表示同步加载，返回的结果是一个对象，key 是文件路径，value 是导入的模块
 * 如果没有设置 eager: true，则返回的对象的 value 是一个函数，调用这个函数，返回的才是导入的模块
 * 设置 import: "default" 表示导入的模块的默认导出
 */
const pages = import.meta.glob("@/views/**/page.js", { eager: true, import: "default" });
// {
//   "/src/views/about/page.js": {
//     title: "关于",
//     menuOrder: 2,
//   },
//   "/src/views/home/page.js": {
//     title: "首页",
//     menuOrder: 1,
//   },
// }

// 导入组件
const components = import.meta.glob("@/views/**/index.vue");

// 遍历 pages 对象，将路由信息添加到路由配置中
const routes = Object.entries(pages).map(([path, meta]) => {
  //
  const componentPath = path.replace("page.js", "index.vue");
  path = path.replace("/src/views", "").replace("/page.js", "") || "/";
  name = path.split("/").filter(Boolean).join("-") || "index";

  return {
    path,
    name,
    component: components[componentPath],
    meta,
  };
});

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

:::
