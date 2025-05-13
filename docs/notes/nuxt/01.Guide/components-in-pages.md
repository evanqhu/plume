---
title: 组织 components
createTime: 2025/05/13 15:50:57
permalink: /nuxt/91zpri71/
---

默认情况下，在 Nuxt 中，所有的非路由组件都是放在外层的 `components` 目录下。但是有时候我们希望根据页面来组织组件，希望能够将非路由组件放在离使用它的路由组件尽可能近的地方，比如直接在 `pages` 目录下创建一个 `components` 目录。可以使用以下配置：

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  components: [
    "~/components",
    {
      path: "~/pages",
      pattern: "**/components/**", // 自动导入成组件
      pathPrefix: false,
    },
  ],
  pages: {
    // 所有的 .vue 文件都会被识别为路由页面，除非它位于 components 目录下
    pattern: ["**/*.vue", "!**/components/**"],
  },
});
```

:::
