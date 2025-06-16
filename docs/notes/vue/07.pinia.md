---
title: Pinia
createTime: 2025/05/30 15:52:36
permalink: /vue/l3yw8m9l/
---

::: note
官网：<https://pinia.vuejs.org/>
:::

## 介绍

状态管理器 (插件)

## 搭建 Pinia 环境

1️⃣ 安装 Pinia

```sh
pnpm install pinia
```

2️⃣ 注册并使用插件

::: code-group

```typescript [src/main.js]
import { createApp } from "vue";
import App from "./App.vue";

// 引入 createPinia 函数，用于创建 pinia
import { createPinia } from "pinia";

// 创建 pinia
const pinia = createPinia();
const app = createApp(App);

// 使用插件
app.use(pinia);
app.mount("#app");
```

:::

此时开发者工具中已经有了 `Pinia` 选项

## 存储+读取数据

`store` 是一个保存：**状态**、**业务逻辑** 的实体，每个组件都可以**读取**、**写入**它

它有三个概念：`state` `getter` 和 `action`，相当于组件中的： `data` `computed` 和 `methods`

- `state` 被定义为一个返回初始状态的函数
- `getter` 完全等同于 store 的 state 的计算值
- `action` 相当于组件中的 method

- 一个状态管理器可以包含多个 `store`

### 创建 Store

::: code-group

```typescript [src/stores/count.ts]
// 引入 defineStore 用于创建 store
import { defineStore } from "pinia";

// 定义并暴露一个 store
export const useCountStore = defineStore("count", {
  // 状态
  state: () => ({
    count: 0,
  }),
  // 计算属性
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  // 动作，方法
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

```typescript [src/stores/talk.ts]
import { defineStore } from "pinia";

export const useTalkStore = defineStore("talk", {
  state: () => ({
    talkList: [
      { id: "abcd01", content: "你今天有点怪，哪里怪？怪好看的！" },
      { id: "abcd02", content: "草莓、蓝莓、蔓越莓，你想我了没？" },
      { id: "abcd03", content: "心里给你留了一块地，我的死心塌地" },
    ],
  }),
  getters: {},
  actions: {},
});
```

:::

### 组件中使用 store

```vue
<template>
  <h2>当前求和为：{{ sumStore.sum }}</h2>
</template>

<script setup lang="ts" name="Count">
// 1. 引入对应的 useXxxStore
import { useCountStore } from "@/store/count";

// 2. 调用 useXxxStore 得到对应的 store
// 之后 state getters 和 actions 中的变量和方法都会出现在 store身上
const countStore = useCountStore();
countStore.count;
countStore.doubleCount;
countStore.increment();
</script>
```

## 修改数据

1️⃣ 直接修改

```js
countStore.sum = 666;
```

2️⃣ 批量修改 `$patch`

```js
countStore.$patch({
  sum: 999,
  school: "atguigu",
});
```

3️⃣ 借助 `action` 修改（ `action` 中可以编写一些业务逻辑）

```js
import { defineStore } from "pinia";

export const useCountStore = defineStore("count", {
  actions: {
    // 加
    increment(value: number) {
      if (this.sum < 10) {
        // 操作 countStore 中的 sum
        this.sum += value;
      }
    },
    // 减
    decrement(value: number) {
      if (this.sum > 1) {
        this.sum -= value;
      }
    },
  },
});
```

组件中调用 `action` 即可

```js
// 使用 countStore
const countStore = useCountStore();

// 调用对应 action
countStore.incrementOdd(n.value);
```

## storeToRefs

- 借助 `storeToRefs` 将 `store` 中的数据转为 `ref` 对象，方便在模板中使用
- 注意：`pinia` 提供的 `storeToRefs` 只会将 `state` 和 `getters` 中的数据做转换，变成 ref 的响应式数据；而 `Vue` 的 `toRefs` 会转换 `store` 中所有数据和方法，连函数也会被转换，这个是不希望看到的

```vue
<template>
  <div class="count">
    <h2>当前求和为：{{ sum }}</h2>
  </div>
</template>

<script setup lang="ts" name="Count">
// 引入 storeToRefs
import { storeToRefs } from "pinia";
import { useCountStore } from "@/store/count";

// 得到 countStore
const countStore = useCountStore();
// 使用 storeToRefs 转换 countStore，随后解构
const { sum } = storeToRefs(countStore);
</script>
```

## getters

当 `state` 中的数据，需要经过处理后再使用时，可以使用 `getters` 配置

```js
import { defineStore } from "pinia";

export const useCountStore = defineStore("count", {
  state: () => ({
    sum: 1,
    school: "atguigu",
  }),
  getters: {
    bigSum: (state) => state.sum * 10,
    upperSchool() {
      return this.school.toUpperCase();
    },
  },
});
```

组件中读取数据：

```js
const { increment, decrement } = countStore;
const { sum, school, bigSum, upperSchool } = storeToRefs(countStore);
```

## $subscribe

通过 store 的 `$subscribe()` 方法侦听 `state` 及其变化 (类似 `watch`)

```js
// mutate 表示本次 state 变化的信息， state 表示变化后的 state 值
talkStore.$subscribe((mutate, state) => {
  console.log("LoveTalk", mutate, state);
  localStorage.setItem("talk", JSON.stringify(talkList.value));
});
```

## store 组合式写法

```js
import { defineStore } from "pinia";
import axios from "axios";
import { nanoid } from "nanoid";
import { reactive } from "vue";

// 相当于 setup 函数
export const useTalkStore = defineStore("talk", () => {
  // talkList 就是 state
  const talkList = reactive(JSON.parse(localStorage.getItem("talkList") as string) || []);

  // getATalk 函数相当于 action
  async function getATalk() {
    // 发请求，下面这行的写法是：连续解构赋值+重命名
    const { data } = await axios.get("https://api.uomg.com/api/rand.qinghua?format=json");
    const { content: title } = data;
    // 把请求回来的字符串，包装成一个对象
    const obj = { id: nanoid(), title };
    // 放到数组中
    talkList.unshift(obj);
  }

  return { talkList, getATalk };
});
```
