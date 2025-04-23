---
title: Element Plus
createTime: 2025/03/12 17:04:23
permalink: /style/a0k0tqbf/
---

::: note
官网: <https://element-plus.org/zh-CN/>
:::

## 使用 SCSS 覆盖默认样式

需要将 element.scss 文件通过 Vite 的 `scss` 配置项引入。

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/element.scss" as *;',
        },
      },
    },
  },
});
```

@tab element.scss

```scss
// 覆盖 element 样式

@forward "element-plus/theme-chalk/src/common/var.scss" with (
  $colors: (
    "primary": (
      "base": #3d00b7,
    ),
  )
);

:root {
  .el-button--primary {
    font-family: "Bakbak One";
    border-radius: 2rem;
    padding: 0.5rem 1.5rem;
    height: auto;
    font-size: 1rem;

    &.el-button--large {
      font-size: 1.5rem;
      padding: 1rem 2rem;

      @media screen and (max-width: 768px) {
        font-size: 1.25rem;
        padding: 0.75rem 1.5rem;
      }
    }
  }
}
```

:::
