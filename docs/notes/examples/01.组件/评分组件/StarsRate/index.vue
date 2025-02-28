<!-- 评分组件 -->
<script setup lang="ts">
import { computed } from "vue";

const { value = 0 } = defineProps<{
  value?: number;
}>();

const style = computed(() => ({
  "clip-path": `inset(0 ${(10 - value) * 10}% 0 0)`,
}));
</script>

<template>
  <div class="container">
    <img src="./stars.webp" class="background-image" />
    <img src="./stars-filled.webp" class="foreground-image" :style="style" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100px;
  position: relative;
  aspect-ratio: 11 / 2; // 宽高比
  filter: hue-rotate(320deg); // 调整元素的色相（hue）

  .background-image,
  .foreground-image {
    position: absolute;
    inset: 0; // 等价于 top: 0; right: 0; bottom: 0; left: 0;
  }
}

// plume 主题修改了此处样式，在这里恢复默认样式
.container {
  img + img {
    margin-left: 0 !important;
  }
}
</style>
