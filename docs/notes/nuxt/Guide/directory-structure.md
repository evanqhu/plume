---
title: 目录结构
createTime: 2025/01/07 11:51:57
permalink: /nuxt/plpp872j/
---

::: file-tree

- .nuxt/
- .output/
- assets/ 静态资源
- components/ 公共组件
- composables/ 组合式函数
- content/
- layouts/ 布局
- middleware/ 路由中间件
- modules/
- pages/ 路由组件 页面
- plugins/ 插件 扩展 Vue 功能
- public/
- server/ Nitro 服务器
- utils/ 工具函数
- .env
- .gitignore
- .nuxtignore
- app.vue 入口文件 根组件
- app.config.ts 网站参数配置
- error.vue
- nuxt.config.ts Nuxt 配置
- package.json
- tsconfig.json

:::

## ⚙️ .nuxt

Nuxt 在开发过程中使用 `.nuxt/` 目录来生成您的 Vue 应用程序。

## ⚙️ .output

Nuxt 在为您的应用程序构建时会创建 `.output/` 目录。

里面的子目录 `/public` 是静态资源文件；`/server` 是 Nitro 服务器文件

## ⚙️ assets

静态资源文件，如图片、字体等。一般可包含 `/icons` `/images` `/styles` 等目录

## ⚙️ components

`/components` 目录是您放置所有非路由组件的位置。Nuxt 会自动导入此目录中的任何组件 (包含嵌套目录)。

目录结构如下，对应的组件名称为 `<BaseFooButton />`

```sh
-| components/
---| base/
-----| foo/
-------| Button.vue
```

### 动态组件

如果您想要使用 Vue `<component :is="someComputedComponent">` 语法，则需要使用 `resolveComponent` 由 Vue 提供或直接从 `#components` 导入组件并将其传递给 `is` 属性。

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

### 动态导入

要动态导入组件（也称为懒加载组件），您只需在组件名称前添加 Lazy 前缀。这对于只有在需要时才希望使用组件的情况特别有用。

通过使用 Lazy 前缀，您可以延迟加载组件代码直到正确的时刻，这对于优化您的 JavaScript 包大小非常有帮助。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const show = ref(false);
</script>

<template>
  <div>
    <h1>山脉</h1>
    <LazyMountainsList v-if="show" />
    <button v-if="!show" @click="show = true">显示列表</button>
  </div>
</template>
```

:::

### 自定义目录

默认情况下，仅扫描 `~/components` 目录。如果您想添加其他目录，或者更改此目录子文件夹内组件的扫描方式，您可以在配置中添加其他目录

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  components: [
    // ~/calendar-module/components/event/Update.vue => <EventUpdate />
    { path: "~/calendar-module/components" },

    // ~/user-module/components/account/UserDeleteDialog.vue => <UserDeleteDialog />
    { path: "~/user-module/components", pathPrefix: false },

    // ~/components/special-components/Btn.vue => <SpecialBtn />
    { path: "~/components/special-components", prefix: "Special" },

    // 如果您的配置中有任何覆盖您希望应用于 `~/components` 子目录的覆盖，则非常重要，
    // 它需要在最后添加。
    //
    // ~/components/Btn.vue => <Btn />
    // ~/components/base/Btn.vue => <BaseBtn />
    "~/components",
  ],
});
```

:::

### 客户端组件

如果组件是仅在**客户端**渲染的，则可以在组件上添加 `.client` 后缀。

## ⚙️ composables

`/composables` 目录用于创建组合式函数。仅顶层目录中的文件会被导出，不包含嵌套目录。

### 用法

::: code-tabs
@tab 具名导出 composables/useFoo.ts

```ts
export const useFoo = () => {
  return useState("foo", () => "bar");
};
```

@tab 默认导出 composables/useFoo.ts

```ts
// 它将以 useFoo()（文件名不带扩展名的驼峰命名）形式可用
export default function () {
  return useState("foo", () => "bar");
}
```

@tab 使用 pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const foo = useFoo();
</script>

<template>
  <div>
    {{ foo }}
  </div>
</template>
```

:::

### 文件扫描模式

仅顶层目录中的文件会被导出，不包含嵌套目录。要让嵌套模块的自动导入工作，您可以选择重新导出它们（推荐）或配置扫描器以包含嵌套目录

::: code-tabs
@tab 重新导出 composables/index.ts

```ts
// 使这个导出可以自动导入
export { utils } from "./nested/utils.ts";
```

@tab 配置扫描器 nuxt.config.ts

```ts
export default defineNuxtConfig({
  imports: {
    dirs: [
      // 扫描顶级模块
      "composables",
      // ...扫描具有特定名称和文件扩展名的一级深度的扫描模块
      "composables/*/index.{ts,js,mjs,mts}",
      // ...扫描给定目录中的所有模块
      "composables/**",
    ],
  },
});
```

:::

### 访问插件注入

可以从 Composables 访问 插件注入：

::: code-tabs
@tab composables/useFoo.ts

```ts
export const useHello = () => {
  const nuxtApp = useNuxtApp();
  return nuxtApp.$hello;
};
```

@tab plugins/hello.ts

```ts
// 插件注入
export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`,
    },
  };
});
```

:::

## ⚙️ content

使用 `/content` 目录为你的应用程序创建一个基于文件的内容管理系统 CMS。

1️⃣ 安装模块 `@nuxt/content`

```sh
npx nuxi module add content
```

2️⃣ 创建内容

::: code-tabs
@tab content/index.md

```md
# 你好，内容
```

:::

3️⃣ 渲染内容
在组件中使用 `<ContentDoc>` 组件渲染内容

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<template>
  <main>
    <!-- ContentDoc 默认返回与 `$route.path` 对应的内容，或者你可以传递一个 `path` 属性 -->
    <ContentDoc />
  </main>
</template>
```

:::

## ⚙️ layouts

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

1️⃣ 在页面中使用 `definePageMeta()` 定义布局

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
2. 布局名称为 `kebab-case` 标准
3. 布局组件必须有一个根元素

:::

### 嵌套布局

如果您在嵌套目录中有布局，则布局的名称将基于其自己的路径目录和文件名，并删除重复的段

## ⚙️ middleware

Nuxt 提供**路由中间件**，用于在导航到特定路由之前运行代码。

::: note

1. 中间件名称会被标准化为 `kebab-case`
2. `navigateTo` - 重定向到给定的路由
3. `abortNavigation` - 终止当前导航，可选地附带错误信息。
4. 没有第三个参数 `next()`，而是通过返回值来控制导航，返回值有以下类型：
   - 无 - 不阻止导航，并将移动到下一个中间件函数或完成路由导航
   - `return navigateTo('/')` - 重定向到给定路径
   - `return abortNavigation()` - 停止当前导航
   - `return abortNavigation(error)` - 以错误拒绝当前导航

:::

### 命名路由中间件

放置在 `/middleware` 目录下，并在页面上使用时通过异步导入自动加载

::: code-tabs
@tab middleware/my-middleware.ts

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.id === "1") {
    return abortNavigation();
  }
  // 在实际应用中，你可能不会将每个路由都重定向到 `/`
  // 但是，在重定向之前检查 `to.path` 是非常重要的
  // 否则你可能会遇到无限重定向循环
  if (to.path !== "/") {
    return navigateTo("/");
  }
});
```

@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
definePageMeta({
  middleware: "my-middleware", // 或 ["my-middleware"]
});
</script>
```

:::

### 全局路由中间件

放置在 `/middleware` 目录下，文件名带有 `.global` 后缀，并在每次路由改变时运行，无需在组件中声明使用。

### 内联路由中间件

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

### 中间件执行顺序

优先执行全局中间件，之后按页面中定义的中间件数组顺序执行。可以在全局中间件命名前加上 `01.`、`02.` 等前缀来控制顺序。

如 `01.setup.global.ts`

### 中间件运行时机

在服务端渲染时，中间件在服务端和客户端都会运行，可以在代码中通过 `import.meta` 控制中间件的执行。

::: code-tabs
@tab middleware/example.ts

```ts
export default defineNuxtRouteMiddleware((to) => {
  // 在服务器上跳过中间件
  if (import.meta.server) return;
  // 完全在客户端跳过中间件
  if (import.meta.client) return;
  // 或仅在客户端初始加载时跳过中间件
  const nuxtApp = useNuxtApp();
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return;
});
```

:::

## ⚙️ pages

Nuxt 提供了基于文件的路由功能，可以在你的 web 应用中创建路由。

### 使用

Nuxt 将自动为你的 `~/pages/` 目录中的每个页面创建一个路由。`pages/index.vue` 文件将被映射到你的应用程序的 `/` 路由。

页面必须有一个根元素，以允许路由过渡。HTML 注释也被认为是元素。

### 动态路由

如果在你放置任何内容在**方括号**中，它将变成一个**动态路由**参数。

如果你希望一个参数是**可选的**，你必须将它用**双方括号**括起来，例如 `~/pages/[[slug]]/index.vue` 或 `~/pages/[[slug]].vue` 将会匹配 `/` 和 `/test`。

可以通过 `$route.params.slug` 访问动态路由参数。

### 捕获所有路由

如果你需要一个捕获所有路由，你通过创建一个名为 `[...slug].vue` 的文件。这将匹配**所有**该路径下的路由。

### 嵌套路由

可以使用 `<NuxtPage>` 在 `<NuxtPage>` 组件内部显示嵌套路由。

::: file-tree

- pages
  - parent
    - index.vue
    - child.vue
  - parent.vue

:::

::: code-tabs
@tab pages/parent.vue

```vue :collapsed-lines
<template>
  <div>
    <!-- 访问以 /parent 开头的路由时展示 -->
    <h1>我是父视图</h1>
    <NuxtPage :foobar="123" />
  </div>
</template>
```

@tab pages/parent/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const props = defineProps(["foobar"]);
</script>

<template>
  <div>
    <!-- 访问 /parent 路由时展示 -->
    <h2>我是父视图的 index 子视图</h2>
  </div>
</template>
```

@tab pages/parent/index.vue

```vue :collapsed-lines
<template>
  <div>
    <!-- 访问 /parent/child 路由时展示 -->
    <h2>我是父视图的 child 子视图</h2>
  </div>
</template>
```

:::

::: note
可以使用**路由组**将嵌套路由分组在一起。
:::

### 路由组

在某些情况下，您可能希望以不影响基于文件的路由的方式将一组路由分组在一起。为此，您可以将文件放入用括号包装的文件夹中。

::: file-tree

- pages
  - index.vue
  - (policies)
    - privicy-policy.vue
    - terms-of-service.vue

:::

### 页面元数据

可以通过 `definePageMeta()` 函数为页面添加元数据。

<https://nuxt.com/docs/api/utils/define-page-meta>

### 程序化导航

使用 `navigateTo()` 进行程序化导航。它接受与 `useRouter().push()` 相同的参数。

### 仅客户端或服务端页面

通过使用 `.client.vue` 或 `.server.vue` 文件扩展名，你可以创建仅在客户端或服务端渲染的页面。

## ⚙️ plugins

<https://nuxt.com/docs/guide/directory-structure/plugins>

Nuxt 提供了一个插件系统，以便在创建 Vue 应用程序时使用 Vue 插件等。

- 目录内的所有插件都会自动注册，你无需在 `nuxt.config` 中单独添加它们。
- 可以在文件名中使用 `.server` 或 `.client` 后缀，以仅在服务器端或客户端加载插件。
- 只有目录顶层的文件（或任何子目录中的索引文件）才会被自动注册为插件。

要在子目录中添加插件，你可以在 `nuxt.config.ts` 中使用 `plugins` 选项：

::: code-tabs
@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  plugins: ["~/plugins/bar/baz", "~/plugins/bar/foz"],
});
```

:::

### 创建插件

传递给插件的唯一参数是 `nuxtApp`。

::: code-tabs
@tab plugins/foo.ts

```ts
export default defineNuxtPlugin((nuxtApp) => {
  // 使用 nuxtApp 进行某些操作
});
```

:::

也可以使用**对象语法**创建插件，具体参考文档。

### 提供辅助函数

如果你想在 NuxtApp 实例上提供一个辅助函数，可以在插件中返回它并在 `provide` 键下。在组件中，你可以使用 `useNuxtApp()` 获取 NuxtApp 实例，从中获取你的函数。

::: code-tabs
@tab plugins/foo.ts

```ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`,
    },
  };
});
```

@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
// 你也可以在这里使用它
const { $hello } = useNuxtApp();
</script>

<template>
  <div>
    {{ $hello("world") }}
  </div>
</template>
```

:::

::: note
请注意，我们强烈建议使用 **组合式函数** 而不是提供辅助函数，以避免污染全局命名空间并保持主捆绑包条目小巧。
:::

### Vue 插件

您可以使用 `defineNuxtPlugin()` 创建 Vue 插件。

::: code-tabs
@tab plugins/foo.ts

```ts
import VueGtag, { trackRouter } from "vue-gtag-next";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: "GA_MEASUREMENT_ID",
    },
  });
  trackRouter(useRouter());
});
```

:::

### Vue 指令

同样，您可以在插件中注册一个自定义的 Vue 指令。

::: code-tabs
@tab plugins/foo.ts

```ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("focus", {
    mounted(el) {
      el.focus();
    },
    getSSRProps(binding, vnode) {
      // you can provide SSR-specific props here
      return {};
    },
  });
});
```

:::

### 全局组件

可以在插件中注册全局组件。

::: code-tabs
@tab plugins/foo.ts

```ts
import "virtual:svg-icons-register";
import SvgIcon from "~/components/SvgIcon.vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("svg-icon", SvgIcon);
});
```

:::

## ⚙️ server

Nuxt 提供了一个内置服务器，`/server` 目录用于注册应用程序的 API 和服务器处理程序。

::: file-tree

- server
  - api 服务端路由
    - hello.ts
  - routes 服务端路由
    - bonjour.ts
  - middleware 中间件
    - log.ts
  - plugins 插件
    - extend-html.ts

:::

### 服务器路由

可以在 `/server/api` 或 `/server/routes` 目录中创建服务器路由。

::: code-tabs
@tab server/api/hello.ts

```ts
export default defineEventHandler((event) => {
  return {
    hello: "world",
  };
});
```

@tab server/routes/bonjour.ts

```ts
export default defineEventHandler(() => "Bonjour!");
```

:::

`/server/api` 目录中的文件会自动在其路由前加上 `/api` 前缀。

要将服务器路由添加到没有 `/api` 前缀，请将它们放入 `~/server/routes` 目录。

可以在页面中调用这些 API 接口

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { data } = await useFetch("/api/hello");
const { data } = await useFetch("/bonjour");
</script>

<template>
  <pre>{{ data }}</pre>
</template>
```

:::

### 服务器中间件
