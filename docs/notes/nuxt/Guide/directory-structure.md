---
title: 目录结构
createTime: 2025/01/07 11:51:57
permalink: /nuxt/plpp872j/
---

::: file-tree

- .nuxt/
- .output/
- assets/
- components/
- composables/
- content/
- layouts/ 布局
- middleware/
- modules/
- pages/
- plugins/
- public/
- server/
- utils/
- .env
- .gitignore
- .nuxtignore
- app.vue
- app.config.ts
- error.vue
- nuxt.config.ts
- package.json
- tsconfig.json

:::

## layout 布局

Nuxt 提供了一个布局框架，用于将常见的 UI 模式提取到可重用的布局中。

通过将 `<NuxtLayout>` 添加到您的 `app.vue` 来启用布局。

::: code-tabs
@tab app.vue

```vue :collapsed-lines
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

:::

### 使用布局

1️⃣ 在页面中使用 definePageMeta 定义布局

```vue
<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
```

2️⃣ 设置 `<NuxtLayout>` 的 `name` 属性

```vue
<template>
  <NuxtLayout name="custom">
    <NuxtPage />
  </NuxtLayout>
</template>
```

::: note

1. 如果没有指定布局，则使用默认布局 `layouts/default.vue`
2. 布局名称为 kebab-case 标准
3. 布局组件必须有一个根元素

:::

### 嵌套布局

如果您在嵌套目录中有布局，则布局的名称将基于其自己的路径目录和文件名，并删除重复的段


## server 服务器

Nuxt 提供了一个内置服务器。