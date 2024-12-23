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
