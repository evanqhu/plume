---
title: 工具函数 utils
createTime: 2025/01/10 13:27:22
permalink: /nuxt/5l5urydf/
---

::: note
<https://nuxt.com/docs/api/utils/dollarfetch>
:::

## defineNuxtRouteMiddleware

定义**路由中间件**，接收当前路由和下一个路由作为参数的导航守卫；在 `/middleware` 中使用

::: code-tabs
@tab middleware/auth.ts

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useState("auth");

  if (!auth.value.isAuthenticated) {
    return navigateTo("/login");
  }

  if (to.path !== "/dashboard") {
    return navigateTo("/dashboard");
  }
});
```

:::

## definePageMeta

定义**路由组件元信息**，可以使用它为位于 pages 目录中的页面组件设置元数据；在 `/pages` 中使用

::: code-tabs
@tab pages/some-page.vue

```vue :collapsed-lines
<script setup lang="ts">
definePageMeta({
  name: 'SomePage', // 路由名称
  path: '/:channel(channel[1-9]\\d?)', // 页面路径，可以用自定义正则表达式
  layout: "default", // 页面布局
  validate: () => true,
  middleware: "auth", // 路由中间件
  ...
});
</script>
```

:::

## defineNuxtPlugin

定义**插件**，扩展 Nuxt 功能，在 `/plugins` 中使用

::: code-tabs
@tab plugins/load-config.server.ts

```ts
/**
 * 服务端插件
 * 将 nuxtApp 上下文中的网站配置注入到 Pinia Store 中
 */
import type { Pinia } from "pinia";

// 将 nuxtApp 上下文中的网站配置注入到 Pinia Store 中
export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia;
  // 获取 Pinia Store 实例
  const appStore = useAppStore(pinia); // NOTE 下次遇到数据共享和不共享的例子时再做记录

  // 从服务端上下文中注入配置到 Pinia
  appStore.webConfig = nuxtApp.ssrContext?.event.context.config || {};
});
```

:::

## defineEventHandler

定义服务端接口，在 `/server` 中使用

::: code-tabs
@tab server/api/hello.ts

```ts
export default defineEventHandler((event) => {
  return {
    hello: "world",
  };
});
```

:::
访问 `localhost:3000/api/hello` 时即可接收到返回的数据

## resolveComponent

解析组件

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
import { SomeComponent } from "#components";

const MyButton = resolveComponent("MyButton");
</script>

<template>
  <component :is="clickable ? MyButton : 'div'" />
  <component :is="SomeComponent" />
</template>
```

:::
