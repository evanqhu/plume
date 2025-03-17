---
title: 路由
createTime: 2025/03/14 10:18:43
permalink: /nuxt/z27xzk0o/
---

::: note
<https://nuxt.com/docs/getting-started/routing>
:::

## 基于文件的路由系统

Nuxt 的文件系统路由为 `pages/` 目录中的每个文件创建一个路由。

Nuxt 的一个核心特性是文件系统路由。在 `pages/` 目录中的每个 Vue 文件都会创建一个相应的 URL（或路由），以显示该文件的内容。通过对每个页面使用动态导入，Nuxt 利用代码分割来以最小的 JavaScript 量为请求的路由提供服务。

### 路由页面

Nuxt 路由基于 `vue-router`，并根据文件名从 `pages/` 目录 中创建的每个组件生成路由。

::: code-tabs
@tab 目录结构

```sh
-| pages/
---| about.vue
---| index.vue
---| posts/
-----| [id].vue

```

@tab 生成的路由文件

```json
{
  "routes": [
    {
      "path": "/about",
      "component": "pages/about.vue"
    },
    {
      "path": "/",
      "component": "pages/index.vue"
    },
    {
      "path": "/posts/:id",
      "component": "pages/posts/[id].vue"
    }
  ]
}
```

:::

### 路由导航

`<NuxtLink>` 组件用于在页面之间链接。它呈现一个 `<a>` 标签，其 `href` 属性设置为页面的路由。应用程序被水合后，页面过渡将在 JavaScript 中通过更新浏览器 URL 来执行。这防止了全页面刷新，并允许动画过渡。类似 `router-link`

`NuxtPage` 组件用于在页面组件中渲染当前页面。它通常用于在布局组件中渲染页面内容。如果组件有子路由，它将渲染匹配的子路由组件。类似 `router-view`

`navigateTo()` 函数是一个以编程方式导航用户的辅助函数。类似 `router.push()`

### 路由中间件

1️⃣ 命名路由中间件

放置在 `middleware/` 目录中，使用时将通过异步导入自动加载。（注意：路由中间件名称将规范化为 `kebab-case`，因此 `someMiddleware` 变为 `some-middleware`。）

::: code-tabs
@tab middleware/auth.ts

```ts :collapsed-lines
// 全局路由中间件，在路由变化时执行
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { smartNavigate } = useCustomRouting();
  const token = useCookie(TOKEN_KEY);
  const userStore = useUserStore();

  // 有 token
  if (token.value) {
    if (to.name === "login") {
      return smartNavigate("/");
    } else {
      // 判断是否获取用户信息
      if (userStore.userInfo) {
        return;
      } else {
        // 获取用户信息
        try {
          await userStore.getUserInfo();
          return;
        } catch (error) {
          // 移除 token 并跳转到登录页重新登录
          console.error("获取用户信息失败", error);
          token.value = null;
          ElMessage({
            message: "Get user info failed, please login again.",
            type: "error",
          });
          return smartNavigate("/login");
        }
      }
    }
  }
  // 无 token
  else {
    // 如果页面不需要登录，则直接跳转
    if (!to.meta.requireAuth) return;
    // 否则跳转到登录页
    else return smartNavigate("/login");
  }
});
```

@tab pages/dashboard.vue

```vue :collapsed-lines
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <h1>欢迎来到你的仪表盘</h1>
</template>
```

:::

2️⃣ 全局路由中间件

放置在 `middleware/` 目录（带有 `.global` 后缀），在每次路由更改时自动运行。

3️⃣ 内联路由中间件

在页面组件中定义中间件，在组件的 `definePageMeta()` 中使用 `middleware` 选项。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      // 自定义内联中间件
    },
    "auth",
  ],
});
</script>
```

:::

### 路由验证

Nuxt 提供了通过 `definePageMeta()` 中的 `validate` 属性对每个希望验证的页面进行路由验证。

::: code-tabs
@tab pages/posts/[id].vue

```vue
<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    // 检查 id 是否由数字组成
    return typeof route.params.id === "string" && /^\d+$/.test(route.params.id);
  },
});
</script>
```

:::

### SEO 与元数据

集成 [unHead](https://unhead.unjs.io/) 进行处理

## 自定义路由

### 增删路由

在 Nuxt 的约定式路由中，`pages` 文件夹下的组件都会生成对应的路由，但有时候我们希望将某些路由组件和独属于它的非路由组件放在一起，就可以使用下面的方法自定义路由，阻止这些非路由组件生成路由。

如下，假如我们不希望 `modules` 文件夹内的组件生成路由，有以下解决方案：

::: file-tree

- pages
  - home
    - index.vue
    - modules
      - desktop.vue
      - mobile.vue
  - detail/

:::

#### 1️⃣ definePageMeta

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

#### 2️⃣ nuxtignore（最简单）

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

#### 3️⃣  修改路由

1. 使用 `pages hook` 自定义路由 [docs](https://nuxt.com/docs/guide/recipes/custom-routing#pages-hook)

在 `nuxt.config.ts` 文件中使用钩子来自定义路由，从扫描的路由中添加、更改或删除页面

::: code-tabs
@tab nuxt.config.ts

```ts :collapsed-lines
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

2. 使用 `router.options.ts` 自定义路由 [docs](https://nuxt.com/docs/guide/recipes/custom-routing#router-options)

在 `app` 文件夹下新建 `router.options.ts` 文件，并配置路由，该文件会覆盖默认路由 (官方推荐方法)

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

#### 4️⃣ 配置 nitro 规则

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

### 分渠道路由

希望在不同渠道下，使用不同的路由，如： `/channelX/login` 和 `/login` 是同一个页面，其中 `X` 取值 1 ～ 99，`channelX` 为渠道编号，可选

可通过以下方法实现：

#### 1️⃣ definePageMeta

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

#### 2️⃣ 配置路由

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

#### 3️⃣ 路由跳转

可对原生的 `navigateTo()` 进行一定的封装，跳转时可自动携带 `channel` 参数和 `query` 参数：

::: code-tabs
@tab composables/useCustomRouting.ts

```ts :collapsed-lines
/**
 * 自定义路由跳转方法，用于在路由跳转时保留当前 channel 参数和查询参数
 */
// 定义路由参数类型
import type { RouteLocationRaw } from "vue-router";

export const useCustomRouting = () => {
  const router = useRouter();
  const { params, query } = router.currentRoute.value;
  const { channel } = params;
  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  const fullChannel = channel ? `/${channel}` : ""; // /channel12
  const fullQueryString = queryString ? `?${queryString}` : ""; // ?db=1

  /** 路由跳转时携带 channel params 和 query 参数 */
  const smartNavigate = (to: RouteLocationRaw, options?: Record<string, any>) => {
    // 如果是字符串，则直接跳转
    if (typeof to === "string") {
      const fullPath = `${fullChannel}${to}`;
      return navigateTo(
        {
          path: fullPath,
          query,
        },
        options
      );
    }
    // 如果是对象
    else {
      if ("name" in to) {
        return navigateTo(
          {
            ...to,
            params,
            query: {
              ...to?.query,
              ...query,
            },
          },
          options
        );
      } else {
        const fullPath = `${fullChannel}${to?.path}`;
        return navigateTo(
          {
            ...to,
            path: fullPath,
            query: {
              ...to?.query,
              ...query,
            },
          },
          options
        );
      }
    }
  };

  /** 获取包含 channel params 和 query 参数的跳转链接 */
  const getHref = (path: string) => {
    return `${fullChannel}${path}${fullQueryString}`;
  };

  return { smartNavigate, getHref };
};
```

:::
