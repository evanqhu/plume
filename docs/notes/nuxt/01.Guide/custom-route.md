---
title: 自定义路由
createTime: 2025/01/07 11:34:14
permalink: /nuxt/uw0m6na6/
---

在 Nuxt 的约定式路由中，`pages` 文件夹下的组件都会生成对应的路由，但有时候我们希望将某些路由组件和独属于它的非路由组件放在一起，就可以使用下面的方法自定义路由，阻止这些非路由组件生成路由

## 目录结构

如下，假如我们不希望 `modules` 文件夹内的组件生成路由

::: file-tree

- pages
  - home
    - index.vue
    - modules
      - desktop.vue
      - mobile.vue
  - detail/

:::

## 解决方案

### 1️⃣ definePageMeta

#### 阻止生成路由

在 `desktop.vue` 和 `mobile.vue` 组件中通过 `definePageMeta` 来阻止生成路由

::: code-tabs
@tab desktop.vue

```vue
<script setup lang="ts">
definePageMeta({
  // 阻止生成路由
  validate: () => false,
});
</script>

<template>
  <div class="home">
    <h1>This is the home mobile page</h1>
  </div>
</template>
```

:::

::: note
在 `definePageMeta` 中可以通过 `path` 配置项来自定义路由路径
:::

#### 分渠道路由

::: code-tabs
@tab pages/index.vue

```vue
<script setup lang="ts">
definePageMeta({
  path: "/:channel(channel[1-9]\\d?)?", // 实现分渠道路由
});
</script>
```

:::

### 2️⃣ nuxtignore（最简单）

新建 `.nuxtignore` 文件

::: code-tabs
@tab .nuxtignore

```sh
# 告诉 Nuxt 在构建阶段忽略哪些文件

# 指定 pages 文件夹下的 这些文件夹不生成路由
/pages/**/modules/**
/pages/**/components/**
/pages/**/configs/**
/pages/**/utils/**
```

:::

### 3️⃣  自定义路由

#### 使用 `pages hook` 自定义路由 [docs](https://nuxt.com/docs/guide/recipes/custom-routing#pages-hook)

在 `nuxt.config.ts` 文件中使用钩子来自定义路由，从扫描的路由中添加、更改或删除页面

::: code-tabs
@tab nuxt.config.ts

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from "@nuxt/schema";

export default defineNuxtConfig({
  /** 钩子 */
  hooks: {
    "pages:extend"(pages) {
      // 自定义添加路由
      // pages.push({
      //   name: 'profile',
      //   path: '/profile',
      //   file: '~/extra-pages/profile.vue',
      // })

      // 添加路由
      pages.push({
        name: "HomeChannel",
        path: "/:channel(channel[1-9]\\d?)",
        file: "~/pages/index.vue",
      });

      // 自定义移除路由
      function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove: NuxtPage[] = [];
        for (const page of pages) {
          if (page.file && pattern.test(page.file)) {
            pagesToRemove.push(page);
          } else {
            removePagesMatching(pattern, page.children);
          }
        }
        for (const page of pagesToRemove) {
          pages.splice(pages.indexOf(page), 1);
        }
      }
      // 移除 /modules、/components、/configs、/utils 路由
      removePagesMatching(/\/(modules|components|configs|utils)\//, pages);
    },
  },
});
```

:::

#### 使用 `router.options.ts` 自定义路由 [docs](https://nuxt.com/docs/guide/recipes/custom-routing#router-options)

在 app 文件夹下新建 `router.options.ts` 文件，并配置路由，该文件会覆盖默认路由 (官方推荐方法)

::: code-tabs
@tab app/router.options.ts

```ts
import type { RouterConfig } from "@nuxt/schema";

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: (_routes) => [
    {
      name: "home",
      path: "/",
      component: () => import("~/pages/home.vue"),
    },
  ],
} satisfies RouterConfig;
```

:::

#### 分渠道路由

::: code-tabs
@tab app/router.options.ts

```ts
import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  routes: (_routes) => {
    const routes = [..._routes];

    // 为所有路由添加可选的 channel 前缀
    routes.forEach((route) => {
      // 检查路径中是否已经包含 channel 参数
      if (!route.path.includes(":channel(channel[1-9]")) {
        route.path = `/:channel(channel[1-9]\\d?)?${route.path}`;
      }
    });

    return routes;
  },
};
```

:::

### 4️⃣ 配置 nitro 规则

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      ignore: [
        (route) => {
          const regex = /.*\/(components|configs|modules|utils)(\/|$)/;
          return regex.test(route);
        },
      ],
    },
  },
});
```

:::
