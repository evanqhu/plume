---
title: 代理 Proxy
createTime: 2025/02/17 12:00:21
permalink: /nuxt/7jeoctlr/
---

::: note
<https://www.youtube.com/watch?v=J4E5uYz5AY8&t=703s&ab_channel=AlexanderLichter>
:::

在使用 Nuxt 开发前后端分离的项目时，涉及到后端服务器接口发送请求，由于服务端渲染的存在，请求可以从服务端或客户端发出，同时考虑到开发、测试、生产环境，因此需要代理服务器，以实现请求转发，以及在不同的运行时使用不同的接口地址。使用代理服务器，要实现以下功能：

1. 可以代理客户端和服务端的请求
2. 可以在开发、测试、生产环境使用不同的接口地址

::: note

- 在使用 `$fetch` `useFetch` 等发送请求时，如果**没有设置 baseURL 为绝对路径**，则所有的请求都是发到当前前端项目运行地址所在的相对路径，这些请求可以被代理；如果 baseURL 设置为 **绝对路径**，则这些请求不会被代理，而是直接发送到对应的地址。

:::

## Vite 代理服务器

- 使用 Vite 的代理服务器，可以代理开发环境下客户端的请求
- 无法代理服务端请求
- 无法在不同运行时使用不同的接口地址

::: code-tabs
@tab app.vue

```vue :collapsed-lines
<script setup lang="ts">
// https://jsonplaceholder.typicode.com/users
const { data } = await useFetch("/api/users", { server: false });
// server 为 true 时，开发环境下服务端请求发送失败，因为在服务端接口请求的地址为 http://localhost:3000/api/users，没有响应结果
// 客户端请求成功，因为 Vite 服务器会代理请求，通过 Vite 服务器将请求发送到 https://jsonplaceholder.typicode.com/users 地址，请求成功
</script>

<template>
  <div v-if="data">Data: {{ data }}</div>
</template>
```

@tab nuxt.config.ts

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "https://jsonplaceholder.typicode.com/",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  },
});
```

:::

## Nitro 代理服务器

- 使用 Nitro 的代理服务器，可以代理开发环境下客户端的请求
- 无法代理服务端请求
- 无法在不同运行时使用不同的接口地址

::: code-tabs
@tab app.vue

```vue :collapsed-lines
<script setup lang="ts">
// https://jsonplaceholder.typicode.com/users
const { data } = await useFetch("/api/users", { server: false });
// server 为 true 时，开发环境下服务端请求发送失败，因为在服务端接口请求的地址为 http://localhost:3000/api/users，没有响应结果
// 客户端请求成功，因为 Nitro 服务器会代理请求，通过 Vite 服务器将请求发送到 https://jsonplaceholder.typicode.com/users 地址，请求成功
</script>

<template>
  <div v-if="data">Data: {{ data }}</div>
</template>
```

@tab nuxt.config.ts

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    devProxy: {
      "/api": {
        target: "https://jsonplaceholder.typicode.com/",
        changeOrigin: true,
      },
    },
  },
});
```

:::

## routeRules 实现代理

## 使用 Nitro 手动代理

当请求相对路径的 URL 时，可以通过 server 文件夹配置 Nitro 进行手动代理。这种代理方法，无论是服务端还是客户端，只要请求的是相对路径，就都会通过 Nitro 代理发送请求。

以 `/api` 开头的请求就在 `/server/api/[...].ts` 文件中进行代理。如果以其它字符串作为开头，比如 `/proxy`，则在 `/server/route/proxy/[...].ts` 文件中进行代理。

::: code-tabs
@tab page/index.vue

```vue :collapsed-lines
<script setup lang="ts">
const { data } = await useFetch("/api/users", { server: false });
</script>
```

@tab server/api/[...].ts

```ts
import { joinURL } from "ufo";

export default defineEventHandler(async (event) => {
  // 1. 获取代理地址
  const proxyUrl = "https://jsonplaceholder.typicode.com/";

  // 2. 检查代理路径
  const path = event.path.replace(/^\/api/, "");
  const target = joinURL(proxyUrl, path);

  // 3. 使用 proxyRequest 进行代理请求
  return proxyRequest(event, target);
});
```

:::

## 最佳实践

### 1️⃣ 环境变量

::: code-tabs
@tab .env.development

```sh
NUXT_PUBLIC_API_BASE = '/api'

# 本地开发环境接口代理地址
DEV_PROXY_URL = 'http://test.ptc-jupiter.ptc.sg2.api'
```

@tab .env.stage

```sh
NUXT_PUBLIC_API_BASE = 'https://test-api.pixelcookai.com'
```

@tab .env.production

```sh
NUXT_PUBLIC_API_BASE = 'https://api.pixelcookai.com'
```

:::

### 2️⃣ 封装请求方法

- 开发环境下使用 `/api` 作为 baseURL，这样服务端和客户端的所有请求都会被 Nitro 代理，走 `server/api/[...].ts` 里面的逻辑
- 服务端代理请求时，Nitro 不会携带客户端这边的 cookie，需要使用 `useRequestHeaders` 手动添加
- 部署到测试或正式环境后，baseURL 为绝对路径，不会走 Nitro 代理，而是直接发送请求

::: code-tabs
@tab utils/request.ts

```ts
const customFetch = $fetch.create({
  onRequest({ options }) {
    // 设置请求根路径
    const runtimeConfig = useRuntimeConfig();
    options.baseURL = runtimeConfig.public.apiBase;

    // 在服务端请求时，携带客户端的 cookie
    const userAuth = useCookie(TOKEN_KEY); // 服务端可以读取到客户端的 cookie
    if (userAuth.value) {
      options.headers.set("cookie", `${TOKEN_KEY}=${userAuth.value}`);
    }
  },
});
```

:::

### 3️⃣ Nitro 代理配置

::: code-tabs
@tab server/api/[...].ts

```ts
import { joinURL } from "ufo";

export default defineEventHandler(async (event) => {
  // 1. 获取代理地址 这里只需要写开发环境的代理地址即可
  const proxyUrl = process.env.DEV_PROXY_URL || ''

  // 2. 检查代理路径
  const path = event.path.replace(/^\/api/, "");
  const target = joinURL(proxyUrl, path);

  // 3. 使用 proxyRequest 进行代理请求
  return proxyRequest(event, target);
});
```

:::
