---
title: 交叉观察器
createTime: 2024/12/23 11:50:57
permalink: /others/ivodofjy/
---

使用场景：图片懒加载，无限滚动，加载更多

```typescript
/** 加载更多元素 */
const moreRef = ref<HTMLDivElement>();

/** 创建一个交叉观察器 */
const intersectionOb = new IntersectionObserver((entries) => {
  // 如果目标元素进入视口，则获取数据
  if (entries[0].isIntersecting) {
    fetchData();
  }
});

onBeforeMount(async () => {
  // 请求数据
  await fetchData();
  // 观察瀑布流底部的「加载更多」元素
  intersectionOb.observe(moreRef.value!);
});

onBeforeUnmount(() => {
  // 销毁交叉观察器
  intersectionOb.disconnect();
});
```

## Nuxt 示例

::: code-tabs
@tab index.vue

```vue :collapsed-lines
<!-- 用户图片列表 -->
<script setup lang="ts">
const pageSize = 40;
const pageNum = ref(2);
const isLoading = ref(false);
const hasMore = ref(false);
const moreRef = useTemplateRef("more-ref");

/** 初始化服务端获取用户图片列表 */
const { data: userPhotoList } = await useLazyAsyncData("userPhotoList", () => api.defaultApi.requestUserPhotos(), {
  transform: (data) => {
    hasMore.value = data.hasNext;
    return data.urlList;
  },
});

// 获取数据函数
const fetchData = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  const { urlList, hasNext } = await api.defaultApi.requestUserPhotos({
    pageSize,
    pageNum: pageNum.value,
  });

  if (urlList?.length) {
    userPhotoList.value?.push(...urlList);
    pageNum.value++;
    hasMore.value = hasNext;
  }

  isLoading.value = false;
};

// 创建交叉观察器
let intersectionOb: IntersectionObserver;

onMounted(() => {
  intersectionOb = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchData();
    }
  });

  if (moreRef.value) {
    intersectionOb.observe(moreRef.value);
  }
});

onBeforeUnmount(() => {
  if (intersectionOb && moreRef.value) {
    intersectionOb.unobserve(moreRef.value);
  }
});
</script>

<template>
  <div class="my-images app-content-wrapper">
    <div class="my-images-content app-content">
      <div class="content-wrapper">
        <div v-if="userPhotoList?.length" class="images-wrapper">
          <div
            v-for="(item, index) in userPhotoList || []"
            :key="index"
            class="image-item"
            @click="smartNavigate(`/my-images/${item.id}`)"
          >
            <NuxtImg :src="item.src" loading="lazy" />
          </div>
        </div>
        <div v-if="userPhotoList?.length" ref="more-ref" v-loading="isLoading" class="no-more">No more</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
```

:::
