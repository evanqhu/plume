---
title: 迷你图
createTime: 2024/12/23 10:38:24
permalink: /examples/7iu7vf95/
---

以 [@fnando/sparkline](https://github.com/fnando/sparkline) 为例

## 示例

::: demo-wrapper

<script setup lang="ts">
import sparkline from "@source/components/sparkline.js";
import { onMounted, useTemplateRef } from "vue";

const sparklineRef = useTemplateRef("sparkline-ref");

const sparklineData = [
  { name: "Ethereum", date: "2017-01-01", value: 8.3 },
  { name: "Ethereum", date: "2017-02-01", value: 10.57 },
  { name: "Ethereum", date: "2017-03-01", value: 15.73 },
  { name: "Ethereum", date: "2017-04-01", value: 49.51 },
  { name: "Ethereum", date: "2017-05-01", value: 85.69 },
  { name: "Ethereum", date: "2017-06-01", value: 226.51 },
  { name: "Ethereum", date: "2017-07-01", value: 246.65 },
  { name: "Ethereum", date: "2017-08-01", value: 213.87 },
  { name: "Ethereum", date: "2017-09-01", value: 386.61 },
  { name: "Ethereum", date: "2017-10-01", value: 303.56 },
  { name: "Ethereum", date: "2017-11-01", value: 298.21 },
];

onMounted(() => {
  if (!sparklineRef.value) return;
  sparkline(sparklineRef.value, sparklineData, {
    onmousemove: (event, datapoint) => {
      // console.log(datapoint)
    },
  });
});
</script>

<svg ref="sparkline-ref" class="sparkline" width="100" height="30" stroke-width="2" stroke="blue" fill="rgba(0, 0, 255, .2)"></svg>
:::

## 安装

```sh
pnpm install @fnando/sparkline
```

### 使用

```html
<!-- width, height and stroke-width attributes must be defined on the target SVG -->
<svg class="sparkline" width="100" height="30" stroke-width="3"></svg>

<script>
  sparkline(document.querySelector(".sparkline"), [1, 5, 2, 4, 8, 3, 7]);
</script>
```

修改样式

```css
/* just the line */
.sparkline {
  stroke: red;
  fill: none;
}

/* line with highlight area */
.sparkline {
  stroke: red;
  fill: rgba(255, 0, 0, 0.3);
}

/* change the spot color */
.sparkline--spot {
  stroke: blue;
  fill: blue;
}

/* change the cursor color */
.sparkline--cursor {
  stroke: orange;
}

/* style fill area and line colors using specific class name */
.sparkline--fill {
  fill: rgba(255, 0, 0, 0.3);
}

.sparkline--line {
  stroke: red;
}
```

### 在 Vue 中使用

```vue
<template>
  <svg ref="sparkline-ref" class="sparkline" width="100" height="30" stroke-width="3"></svg>
</template>

<script setup lang="ts">
import { sparkline } from "@fnando/sparkline";
import { onMounted, useTemplateRef } from "vue";

const sparklineRef = useTemplateRef("sparkline-ref");

const sparklineData = [
  { name: "Ethereum", date: "2017-01-01", value: 8.3 },
  { name: "Ethereum", date: "2017-02-01", value: 10.57 },
  { name: "Ethereum", date: "2017-03-01", value: 15.73 },
  { name: "Ethereum", date: "2017-04-01", value: 49.51 },
  { name: "Ethereum", date: "2017-05-01", value: 85.69 },
  { name: "Ethereum", date: "2017-06-01", value: 226.51 },
  { name: "Ethereum", date: "2017-07-01", value: 246.65 },
  { name: "Ethereum", date: "2017-08-01", value: 213.87 },
  { name: "Ethereum", date: "2017-09-01", value: 386.61 },
  { name: "Ethereum", date: "2017-10-01", value: 303.56 },
  { name: "Ethereum", date: "2017-11-01", value: 298.21 },
];

onMounted(() => {
  if (!sparklineRef.value) return;
  sparkline(sparklineRef.value, sparklineData, {
    onmousemove: (event, datapoint) => {
      // console.log(datapoint)
    },
  });
});
</script>
```
