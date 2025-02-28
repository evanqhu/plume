<script setup lang="ts">
import sparkline from "./sparkline.js";
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

<template>
  <svg
    ref="sparkline-ref"
    class="sparkline"
    width="100"
    height="30"
    stroke-width="2"
    stroke="blue"
    fill="rgba(0, 0, 255, .2)"
  ></svg>
</template>
