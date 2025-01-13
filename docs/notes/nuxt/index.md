---
title: Nuxt
createTime: 2025/01/07 11:31:17
permalink: /nuxt/
---

::: note
Nuxt: <https://nuxt.com/docs/getting-started/introduction>

Nitro: <https://nitro.build/guide>
:::

Nuxt 是一个免费的开源框架，以直观且可扩展的方式使用 Vue.js 创建类型安全、高性能和生产级的全栈 Web 应用程序和网站。

## 安装

使用 Nuxt 的脚手架工具 [nuxi](https://nuxt.com/docs/api/commands/init) 初始化项目

::: code-tabs
@tab pnpm

```sh
pnpm dlx nuxi@latest init <project-name>
```

:::

## 配置

### 环境覆盖

可以在 `nuxt.config` 中配置完全类型化的环境覆盖。

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  $production: {
    routeRules: {
      "/**": { isr: true },
    },
  },
  $development: {
    //
  },
  $env: {
    staging: {
      //
    },
  },
});
```

:::

要在运行 `Nuxt CLI` 命令时选择环境，只需将名称传递给 `--envName` 标志

如： `nuxi build --envName staging`

### 环境变量

`runtimeConfig` API 向您应用程序的其余部分暴露环境变量等值。 默认情况下，这些键仅在服务器端可用。 `runtimeConfig.public` 中的键在客户端也可用。

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 仅在服务器端可用的私有键
    apiSecret: "123",
    // public 中的键也在客户端暴露
    public: {
      apiBase: "/api",
    },
  },
});
```

@tab .env

```sh
# 这将覆盖 apiSecret 的值
NUXT_API_SECRET=api_secret_token
```

:::

这些变量利用 `useRuntimeConfig()` 可组合函数暴露给您应用程序的其余部分。

### 应用程序变量

app.config.ts 文件位于源目录中（默认是项目的根目录），用于暴露可以在构建时确定的公共变量。 与 runtimeConfig 选项相反，这些变量不能通过环境变量覆盖。

::: code-tabs
@tab app.config.ts

```ts
export default defineAppConfig({
  title: "Hello Nuxt",
  theme: {
    dark: true,
    colors: {
      primary: "#ff0000",
    },
  },
});
```

:::

这些变量利用 useAppConfig 可组合函数暴露给您应用程序的其余部分。

## 视图 Views

Nuxt 提供多个组件层来实现应用程序的用户界面。

### 入口点 app.vue

默认情况下，Nuxt 将把这个文件视为 入口点，并在应用程序的每个路由中渲染其内容。

::: code-tabs
@tab app.vue

```vue :collapsed-lines
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

:::

### 组件 components

大多数组件是可重用的用户界面部分，例如按钮和菜单。在 Nuxt 中，您可以在 components/ 目录中创建这些组件，它们将自动在您的应用程序中可用，而无需显式导入它们。

### 页面 pages

页面表示每个特定路由模式的视图。 pages/ 目录中的每个文件表示一个不同的路由，显示其内容。

要使用页面，创建 pages/index.vue 文件，并将 `<NuxtPage />` 组件添加到 app.vue（或删除 app.vue 以使用默认入口）。您现在可以通过在 pages/ 目录中添加新文件来创建更多页面及其相应的路由。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<template>
  <div>
    <h1>欢迎来到首页</h1>
    <AppAlert> 这是一个自动导入的组件 </AppAlert>
  </div>
</template>
```

@tab pages/about.vue

```vue :collapsed-lines
<template>
  <section>
    <p>此页面将在 /about 路由中显示。</p>
  </section>
</template>
```

:::

### 布局 layouts

布局是页面的包装，其中包含多个页面的通用用户界面，例如标题和页脚显示。布局是使用 `<slot />` 组件显示 页面 内容的 Vue 文件。 layouts/default.vue 文件将作为默认文件使用。自定义布局可以作为您页面元数据的一部分进行设置。

::: code-tabs
@tab app.vue

```vue :collapsed-lines
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

@tab layouts/default.vue

```vue :collapsed-lines
<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
```

@tab pages/index.vue

```vue :collapsed-lines
<template>
  <div>
    <h1>欢迎来到首页</h1>
    <AppAlert> 这是一个自动导入的组件 </AppAlert>
  </div>
</template>
```

@tab pages/about.vue

```vue :collapsed-lines
<template>
  <section>
    <p>此页面将在 /about 路由中显示。</p>
  </section>
</template>
```

:::

### 高级扩展

可以通过添加一个 Nitro 插件 (服务器插件) 来实现对 HTML 模板的完全控制，该插件注册了一个钩子。 render:html 钩子的回调函数允许您在将 HTML 发送给客户端之前进行修改。

::: code-tabs
@tab server/plugins/extend-html.ts

```ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html, { event }) => {
    // 这将是 html 模板的对象表示。
    console.log(html);
    html.head.push(`<meta name="description" content="我的自定义描述" />`);
  });
  // 您也可以在这里拦截响应。
  nitroApp.hooks.hook("render:response", (response, { event }) => {
    console.log(response);
  });
});
```

:::

## 资源

Nuxt 提供了两种处理资源的选项。

- public/ 目录中的内容会原样提供在服务器根目录下。
- assets/ 目录按惯例包含所有希望构建工具（Vite 或 webpack）处理的资源。

## 样式

### 本地样式表

将 CSS 文件放在 assets/ 目录中，并在 Vue 组件中导入它们。也可使用 sass 等预处理器。样式表会内联在 Nuxt 渲染的 HTML 中。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script>
// 使用静态导入以兼容服务端
import "~/assets/css/first.css";

// 注意：动态导入在服务端不兼容
import("~/assets/css/first.css");
</script>

<style>
@import url("~/assets/css/second.css");
</style>
```

:::

### 全局样式表

在 Nuxt 配置中使用 css 属性。 样式表的自然位置是 assets/ 目录。然后您可以引用其路径，Nuxt 会将其包含在您的应用程序的所有页面中。

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
});
```

:::

### 处理全局样式变量

如果您需要在预处理文件中注入代码，例如带有颜色变量的 sass partial，您可以通过 vite preprocessors options 来做到。

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/_colors.scss" as *;',
        },
      },
    },
  },
});
```

:::

## 路由

Nuxt 的文件系统路由为 pages/ 目录中的每个文件创建一个路由。

Nuxt 的一个核心特性是文件系统路由。在 pages/ 目录中的每个 Vue 文件都会创建一个相应的 URL（或路由），以显示该文件的内容。通过对每个页面使用动态导入，Nuxt 利用代码分割来以最小的 JavaScript 量为请求的路由提供服务。

### 页面

Nuxt 路由基于 vue-router，并根据文件名从 pages/ 目录 中创建的每个组件生成路由。

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

### 导航

`<NuxtLink>` 组件用于在页面之间链接。它呈现一个 `<a>` 标签，其 href 属性设置为页面的路由。应用程序被水合后，页面过渡将在 JavaScript 中通过更新浏览器 URL 来执行。这防止了全页面刷新，并允许动画过渡。类似 router-link

`NuxtPage` 组件用于在页面组件中渲染当前页面。它通常用于在布局组件中渲染页面内容。如果组件有子路由，它将渲染匹配的子路由组件。类似 router-view

`navigateTo()` navigateTo 是一个以编程方式导航用户的辅助函数。类似 router.push()

### 路由中间件

1️⃣ 命名路由中间件

放置在 middleware/ 目录中，使用时将通过异步导入自动加载。（注意：路由中间件名称将规范化为 kebab-case，因此 someMiddleware 变为 some-middleware。）

::: code-tabs
@tab middleware/auth.ts

```ts
function isAuthenticated(): boolean {
  return false;
}
// ---cut---
export default defineNuxtRouteMiddleware((to, from) => {
  // isAuthenticated() 是一个示例方法，用于验证用户是否经过身份验证
  if (isAuthenticated() === false) {
    return navigateTo("/login");
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

放置在 middleware/ 目录（带有 .global 后缀），在每次路由更改时自动运行。

3️⃣ 路由守卫

在组件在使用 onBeforeRouteLeave 和 onBeforeRouteUpdate 守卫来处理路由更改。

### 路由验证

Nuxt 提供了通过 definePageMeta() 中的 validate 属性对每个希望验证的页面进行路由验证。

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

## 数据获取

<https://nuxt.com/docs/getting-started/data-fetching>

Nuxt 附带了两个组合式 API 和一个内置库来在浏览器或服务器环境中执行数据获取：useFetch、useAsyncData 和 $fetch。

- $fetch 是最简单的网络请求方式。
- useFetch 是 $fetch 的封装，只在 通用渲染 中获取数据一次。
- useAsyncData 类似于 useFetch，但提供了更细致的控制。

Nuxt 是一个可以在服务器和客户端环境中运行同构（或通用）代码的框架。如果在 Vue 组件的 setup 函数中使用 $fetch 函数 来执行数据获取，可能会导致数据被两次获取，一次在服务器（以渲染 HTML），另一次在客户端（当 HTML 被水合时）。

useFetch 和 useAsyncData 组合式 API 解决了这个问题，确保如果在服务器上进行 API 调用，数据会被转发到客户端的负载中。

负载是一个通过 useNuxtApp().payload 访问的 JavaScript 对象。它在客户端使用，以避免在浏览器中执行代码时重新获取相同的数据。

useFetch 将确保请求将在服务器上进行，并正确转发到浏览器。$fetch 没有这样的机制，更适合在请求仅在浏览器中发出时使用。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { data } = await useFetch("/api/data");
const { data, error } = await useAsyncData("users", () => myGetFunction("users"));

async function handleFormSubmit() {
  const res = await $fetch("/api/submit", {
    method: "POST",
    body: {
      // 我的表单数据
    },
  });
}
</script>
```

:::

::: note
useFetch(url) 几乎等同于 useAsyncData(url, () => event.$fetch(url))。
:::

### 返回值

useFetch 和 useAsyncData 的返回值相同，如下所示。

- data: 传入的异步函数的结果。
- refresh/execute: 一个可以用来刷新返回的 handler 函数的数据显示的函数。
- clear: 一个可以用来将 data 设置为 undefined，将 error 设置为 null，将 status 设置为 idle，并标记任何当前待处理的请求为已取消的函数。
- error: 如果数据获取失败，则为错误对象。
- status: 指示数据请求状态的字符串（"idle"、"pending"、"success"、"error"）。

::: note
data、error 和 status 是带有 .value 的 Vue refs，在 `<script setup>` 中可以访问。

refresh/execute 和 clear 是普通函数。
:::

### 配置项

1️⃣ 懒加载
默认情况下，useAsyncData 会阻止导航，直到其异步处理程序得到解析。可以使用 lazy 配置项来禁用此行为。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { status, data: posts } = useFetch("/api/posts", {
  lazy: true,
});

// 也可使用 useLazyAsyncData()
const { status, data: posts } = useLazyAsyncData("posts", () => $fetch("/api/posts"), {
  lazy: true,
});
</script>

<template>
  <!-- 您需要处理加载状态 -->
  <div v-loading="status === 'pending'">
    <div v-for="post in posts">
      <!-- 做一些操作 -->
    </div>
  </div>
</template>
```

:::

2️⃣ 修改返回结果

使用 transform 函数来更改查询的结果

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { data: mountains } = await useFetch("/api/mountains", {
  transform: (mountains) => {
    return mountains.map((mountain) => ({ title: mountain.title, description: mountain.description }));
  },
});
</script>
```

:::

3️⃣ 观察

要在应用程序中的其他响应值每次发生更改时重新运行您的获取函数，请使用 watch 选项。您可以用于一个或多个可观察元素。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const id = ref(1);

const { data, error, refresh } = await useFetch("/api/users", {
  /* 更改 id 将会触发重新获取 */
  watch: [id],
});
</script>
```

:::

::: note
观察一个响应值不会改变获取的 URL，因为 URL 在调用函数时构建。
:::

## 状态管理

<https://nuxt.com/docs/getting-started/state-management>

Nuxt 提供了 useState 组合函数，用于在组件之间创建一个响应式和支持 SSR 的共享状态。

useState 是一个支持 SSR 的 ref 替代品。它的值将在服务器端渲染后（在客户端水合时）保持，并通过一个唯一的键在所有组件之间共享。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const counter = useState("counter", () => Math.round(Math.random() * 1000));
</script>

<template>
  <div>
    计数器: {{ counter }}
    <button @click="counter++">+</button>
    <button @click="counter--">-</button>
  </div>
</template>
```

:::

## 服务器

<https://nuxt.com/docs/getting-started/server>
Nuxt 使用 Nitro 创建服务器。
