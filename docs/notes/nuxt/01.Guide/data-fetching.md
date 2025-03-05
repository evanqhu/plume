---
title: 数据获取
createTime: 2025/02/28 13:37:06
permalink: /nuxt/29hwts7l/
---

::: note
<https://nuxt.com/docs/getting-started/data-fetching>
:::

Nuxt 附带了两个组合式 API 和一个内置库来在浏览器或服务器环境中执行数据获取：`useFetch`、`useAsyncData` 和 `$fetch`。

- `$fetch` 是最简单的网络请求方式。
- `useFetch` 是 `$fetch` 的封装，只在 通用渲染 中获取数据一次。
- `useAsyncData` 类似于 `useFetch`，但提供了更细致的控制。

## `useFetch` 和 `useAsyncData` 的必要性

Nuxt 是一个可以在服务器和客户端环境中运行同构（或通用）代码的框架。如果在 Vue 组件的 `setup` 函数中使用 `$fetch` 函数 来执行数据获取，可能会导致数据被两次获取，一次在服务器（以渲染 HTML），另一次在客户端（当 HTML 被水合时）。

`useFetch` 和 `useAsyncData` 组合式 API 解决了这个问题，确保如果在服务器上进行 API 调用，数据会被转发到客户端的负载中。 (`$fetch 没有这样的机制`，更适合在请求仅在浏览器中发出时使用。)

负载是一个通过 `useNuxtApp().payload` 访问的 JavaScript 对象。它在客户端使用，以避免在浏览器中执行代码时重新获取相同的数据。

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

- `useFetch(url)` 几乎等同于 `useAsyncData(url, () => event.$fetch(url))`。
- 使用 `useAsyncData` 或 `useLazyAsyncData` 时，请求会先通过服务端发出，然后通过有效负载携带到客户端，客户端不再发送请求。这意味着必须等待服务端请求完成后，服务端的页面才算渲染完成，才会发送 HTML 到客户端，然后客户端再渲染页面。因此当服务端请求数据较长时，客户端需要等待较久才能收到服务端返回的 HTML 文件。
- 如何想要服务端以最快的速度返回 HTML 页面，可以设置 `server: false`，这样在服务端将不会发出请求，而是在客户端发出请求。
- 在 `useFetch` 和 `useAsyncData` 前面加上 `await` 时，他们会被阻塞，依次执行；如果没有明确的先后关系，可以去掉 `await`，这样多个请求就会同步发出。

:::

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { data } = useFetch("/api/data");
// 不加 await，服务端打印出来是 null，客户端有值
console.log("🚀🚀🚀 data: ", data.value); // null

const { data } = await useFetch("/api/data");
// 加 await，服务端客户端打印出来都有值
console.log("🚀🚀🚀 data: ", data.value); // { ... }
</script>
```

:::

## `$fetch`

Nuxt 包含了 `ofetch` 库，并在你的应用程序中全局自动导入作为 `$fetch` 别名。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
async function addTodo() {
  const todo = await $fetch("/api/todos", {
    method: "POST",
    body: {
      // 我的待办事项数据
    },
  });
}
</script>
```

:::

### 传递头部和 Cookies

当我们在浏览器中调用 `$fetch` 时，用户的头部信息如 cookie 将直接发送到 API。

然而，在服务器端渲染期间，由于 服务器端请求伪造 (SSRF) 或 身份验证滥用 等安全风险，`$fetch` 不会包含用户的浏览器 cookies，也不会传递 fetch 响应中的 cookies。如果您需要在服务器上转发头信息和 Cookies，您必须手动传递它们：

在服务器上使用**相对 URL** 调用 `useFetch` 时，Nuxt 将使用 `useRequestFetch` 来代理头信息和 cookie（不包括那些不应被转发的头信息，比如 host）。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
// 1. 在服务端渲染时请求不会携带用户的请求头和 Cookies
const { data } = await useAsyncData(() => $fetch("/api/cookies"));

// 2. 在服务端渲染时请求会携带用户的请求头和 Cookies，内部使用 useRequestFetch 代理了
const { data } = await useFetch("/api/cookies");

// 3. 这将把用户的请求头和 Cookies 转发到 /api/cookies
const requestFetch = useRequestFetch();
const { data } = await useAsyncData(() => requestFetch("/api/cookies"));

// 4. 使用 useRequestHeaders 可以读取客户端的头部信息
const headers = useRequestHeaders(["cookie"]);

async function getCurrentUser() {
  return await $fetch("/api/me", { headers });
}
</script>
```

:::

## `useFetch`

`useFetch` 组合式 API 在底层使用 `$fetch` 进行 SSR 安全的网络调用。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { data: count } = await useFetch("/api/count");
</script>

<template>
  <p>页面访问量: {{ count }}</p>
</template>
```

:::

## `useAsyncData`

在某些情况下，使用 `useFetch` 组合式 API 不是合适的，例如，当 CMS 或第三方提供其自己的查询层时。在这种情况下，您可以使用 `useAsyncData` 来封装您的调用，并仍然保留组合式 API 提供的好处。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { data, error } = await useAsyncData("users", () => myGetFunction("users"));

// 这也是可以的：
const { data, error } = await useAsyncData(() => myGetFunction("users"));
</script>
```

:::

### 返回值

`useFetch` 和 `useAsyncData` 的返回值相同，如下所示。

- `data`: 传入的异步函数的结果。
- `refresh/execute`: 一个可以用来刷新返回的 handler 函数的数据显示的函数。
- `clear`: 一个可以用来将 data 设置为 undefined，将 error 设置为 null，将 status 设置为 idle，并标记任何当前待处理的请求为已取消的函数。
- `error`: 如果数据获取失败，则为错误对象。
- `status`: 指示数据请求状态的字符串（"idle"、"pending"、"success"、"error"）。

::: note
`data`、`error` 和 `status` 是带有 `.value` 的 Vue refs，在 `<script setup>` 中可以访问。

`refresh/execute` 和 `clear` 是普通函数。
:::

### 配置项

1️⃣ 懒加载 lazy
默认情况下，`useAsyncData` 会阻止导航，直到其异步处理程序得到解析。可以使用 `lazy` 配置项来禁用此行为。

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

2️⃣ 修改返回结果 transform

使用 `transform` 函数来更改查询的结果

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

3️⃣ 观察 watch

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

4️⃣ 仅客户端获取 server

默认情况下，数据获取组合式 API 会在客户端和服务器环境中执行其异步函数。将 server 选项设置为 false 仅在客户端执行调用。在初始加载时，在水合完成之前不会获取数据，因此您需要处理待处理状态，但在随后的客户端导航中，将在加载页面之前等待数据。

::: code-tabs
@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
/* 这个调用在水合之前执行 */
const articles = await useFetch("/api/article");

/* 这个调用仅在客户端执行 */
const { status, data: comments } = useFetch("/api/comments", {
  lazy: true,
  server: false,
});
</script>
```

:::

- `pick`: 一个数组，包含要提取的响应数据的键。 `pick: ['title', 'description']`
- `query`: 一个对象，包含要传递给请求的查询参数。 `query: { limit: 10 }`
- `immediate`: 默认为 true，表示在调用时立即执行异步函数。

## 项目最佳实践

### 封装 1️⃣ （推荐使用）

- 在 `utils/request.ts` 中封装自定义的请求方法，可设置 baseURL 和响应拦截器等
- 在 `api/modules/xxx.ts` 中定义各模块各接口的请求方法
- 在 `api/index.ts` 中汇总导出所有模块的请求方法并导出
- 在 `nuxt.config.ts` 中配置自动导入
- 在组件中使用封装的请求方法

#### 缺点

1. 服务端请求时无法利用到 useFetch 的自动携带 header 的优势，需要自行处理，携带 cookie
2. 不方便传递 `$fetch` 的其他参数

::: code-tabs
@tab utils/request.ts

```ts
// API 接口请求 (如果有其他后端接口地址，封装其他的组合式函数)
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

export type RequestParams = NitroFetchOptions<
  NitroFetchRequest,
  "options" | "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "trace"
>;

/** 自定义封装 $fetch 方法 */
export const customFetch = $fetch.create({
  // 设置超时时间为 20 秒
  timeout: 1000 * 20,
  credentials: "include", // 携带 cookie
  // 请求拦截器
  onRequest({ options }) {
    // 设置请求根路径
    const runtimeConfig = useRuntimeConfig();
    options.baseURL = runtimeConfig.public.apiBase;

    // 在服务端请求时，携带客户端的 cookie
    const userAuth = useCookie(TOKEN_KEY); // 服务端可以读取到客户端的 cookie
    if (userAuth.value) {
      options.headers.set("cookie", `${TOKEN_KEY}=${userAuth.value}`);
      // Add Authorization header
      // options.headers.set('Authorization', `Bearer ${userAuth.value}`)
    }

    // 也可使用 useRequestHeaders() 将客户端的 cookie 添加到服务端的请求头中
    // const headers = useRequestHeaders(['cookie'])
    // Object.entries(headers).forEach(([key, value]) => {
    //   options.headers.set(key, value)
    // })
  },
  // 响应拦截器
  onResponse({ response }) {
    // console.log('🚀🚀🚀 response: ', response._data)
    if (!response.ok) {
      console.error("请求失败", response._data);
      return Promise.reject(new Error(`请求失败：${JSON.stringify(response._data)}`));
    }
    // 与后端约定的数据响应格式
    const { data, code, msg, success } = response._data;

    if (!success) {
      console.error("接口错误：", msg);
      return Promise.reject(new Error(msg || "接口错误"));
    }

    // 通过修改 response._data 来修改响应数据
    response._data = data;

    // 直接返回 data 不生效
    // return data
    // response._data = new myBusinessResponse(response._data)
  },
  // 响应错误拦截器
  onResponseError({ response }) {
    if (response.status === 401) {
      navigateTo("/login");
    }
  },
});

/** 自动导出方法 */
export const request = {
  get<T>(url: string, params?: RequestParams) {
    return customFetch<T>(url, { method: "get", ...params });
  },
  post<T>(url: string, data?: Record<string, unknown>, params?: RequestParams) {
    return customFetch<T>(url, { method: "post", body: data, ...params });
  },
};
```

@tab api/modules/user.ts

```ts
// 登录模块接口
/** 登录 */
export const login = (data: { ggToken: string }) => {
  return request.post<UserResponse>("/user/login", data);
};

/** 退出登录 */
export const logout = async () => {
  return request.get("/user/logout");
};
```

@tab api/index.ts

```ts
// 汇总各模块请求函数，统一导出
import * as defaultApi from "./modules/default";
import * as userApi from "./modules/user";

export const api = {
  defaultApi,
  userApi,
};
```

@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  imports: {
    dirs: ["api"], // api 文件夹顶层路径中的资源会被自动导入
  },
});
```

@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
/** 获取推荐列表 */
const { data: recommendationListData } = useLazyAsyncData(
  "recommendationList",
  () => api.defaultApi.fetchRecommendationList(),
  {
    transform: (data) => data.list || [],
  }
);
</script>
```

:::

### 封装 2️⃣

参考官网示例

::: code-tabs

@tab plugins/customFetch.ts

```ts
export default defineNuxtPlugin((nuxtApp) => {
  const userAuth = useCookie("token");
  const config = useRuntimeConfig();

  const $customFetch = $fetch.create({
    baseURL: config.baseUrl ?? "https://api.nuxt.com",
    onRequest({ request, options, error }) {
      if (userAuth.value) {
        // Add Authorization header
        options.headers.set("Authorization", `Bearer ${userAuth.value}`);
      }
    },
    onResponse({ response }) {
      // response._data = new myBusinessResponse(response._data)
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        return nuxtApp.runWithContext(() => navigateTo("/login"));
      }
    },
  });
  // Expose to useNuxtApp().$customFetch
  return {
    provide: {
      customFetch: $customFetch,
    },
  };
});
```

@tab composables/useCustomFetch.ts

```ts
import type { UseFetchOptions } from "nuxt/app";

export function useCustomFetch<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$customFetch,
  });
}
```

@tab pages/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { data } = await useCustomFetch("/contributors");
</script>
```

:::
