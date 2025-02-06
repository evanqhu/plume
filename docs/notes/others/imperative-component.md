---
title: 命令式组件
createTime: 2025/02/06 13:41:27
permalink: /others/o51ybv9h/
---

以封装一个消息提示组件 Message 为例。

首先需要准备一个用于展示的消息提示组件 `Message.vue`，该组件中定义相应的结构和样式，定义命令式函数 `showMessage`，同时通过 `defineExpose` 将函数暴露给外部使用。

其次准备一个 `useMessage` 的 hook，用于调用 `Message.vue` 组件中的命令式函数 `showMessage` 函数；在 hook 中需要区分服务端和客户端，需要使用 `createVNode` 创建虚拟节点，使用 `render` 函数将虚拟节点渲染到 DOM 中。最后对外暴露 `showMessage` 函数以供开发者使用。

::: code-tabs
@tab Message.vue

```vue :collapsed-lines
<script setup lang="ts">
import { reactive } from "vue";

interface Message {
  id: number;
  text: string;
}

const messages = reactive<Message[]>([]);
let idCounter = 0;

// 显示消息的方法
const showMessage = (text: string, duration = 3000) => {
  const id = idCounter++;
  messages.push({ id, text });

  setTimeout(() => {
    removeMessage(id);
  }, duration);
};

// 移除消息
const removeMessage = (id: number) => {
  const index = messages.findIndex((msg) => msg.id === id);
  if (index !== -1) messages.splice(index, 1);
};

// 暴露方法给外部使用
defineExpose({ showMessage });
</script>

<template>
  <div v-if="messages.length > 0" class="message-container">
    <transition-group name="fade">
      <div v-for="msg in messages" :key="msg.id" class="message">
        {{ msg.text }}
      </div>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.message-container {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2001;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 10px 16px;
  color: #000;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
```

@tab useMessage.ts

```ts
import { createVNode, render, shallowRef } from "vue";

import MessageComponent from "@/components/TheMessage.vue";

type MessageInstance = { showMessage: (text: string, duration?: number) => void } | null;

// 定义一个全局的 Message 实例
const instance = shallowRef<MessageInstance>(null);

export const useMessage = () => {
  // 服务端
  if (import.meta.env.SSR) {
    return () => {
      console.warn("useMessage() 只能在客户端使用");
    };
  }

  // 客户端
  const showMsg = (text: string, duration?: number) => {
    // 如果实例已经存在，直接调用 showMessage 方法
    if (instance.value) return instance.value.showMessage(text, duration);

    // 创建虚拟节点
    const vNode = createVNode(MessageComponent); // 这里也可以通过传 props 的方式来传递数据
    // 渲染虚拟节点并挂在到 body 上
    render(vNode, document.body);

    instance.value = (vNode.component?.exposed as MessageInstance) || null;
    return instance.value?.showMessage(text, duration) || (() => {});
  };

  return showMsg;
};
```

@tab home.vue

```vue
<script setup lang="ts">
import { useMessage } from "@/hooks/useMessage";

const showMessage = useMessage();

const handleClick = () => {
  showMessage("Hello, World!");
};
</script>

<template>
  <div>
    <button @click="handleClick">显示消息</button>
  </div>
</template>
```

:::
