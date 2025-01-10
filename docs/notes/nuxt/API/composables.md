---
title: 组合式函数 composables
createTime: 2025/01/10 14:00:19
permalink: /nuxt/nr9b0iuv/
---

## useState

`useState` 可以创建响应式且 SSR 友好的共享状态

`useState` 中的数据将被序列化为 `JSON`，它的值在服务端渲染后保留，并使用唯一密钥在所有组件中共享

::: code-tabs
@tab index.vue

```vue :collapsed-lines
<script setup lang="ts">
const counter = useState("counter", () => Math.round(Math.random() * 1000));
const counter2 = Math.round(Math.random() * 1000);
</script>

<template>
  <div>Counter: {{ counter }} Counter2: {{ counter2 }}</div>
</template>
```

:::

::: note
counter 的值在服务端渲染后会水合到客户端，客户端不再重新生成

counter2 的值会在服务端和客户端分别渲染，会导致水合失败
:::
