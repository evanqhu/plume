---
title: 评分组件
createTime: 2024/12/22 14:06:11
permalink: /examples/5jcj5yze/
---

::: demo-wrapper

<script setup lang="ts">
import StarsRate from "@source/components/StarsRate/index.vue";
</script>

<StarsRate :value="7" />
:::

::: code-tabs
@tab App.vue

```vue
<script setup lang="ts">
import StarsRate from "./StarsRate.vue";
</script>

<template>
  <StarsRate :value="7" />
</template>
```

@tab StarsRate.vue

```vue :collapsed-lines
<!-- @include: @/components/StarsRate/index.vue -->
```

:::
