<script setup lang="ts">
import Carousel3D from "./Carousel3D/Carousel3D.vue";
import CarouselSlide from "./Carousel3D/CarouselSlide.vue";

const slides: any = [];

for (let i = 1; i <= 10; i++) {
  slides.push({
    title: `Slide ${i}`,
    desc: "Lorem ipsum dolor sit amet",
    src: "https://placehold.it/360x270",
  });
}
</script>

<template>
  <Carousel3D display="5" startIndex="4" :width="150" :height="200" :perspective="0">
    <CarouselSlide
      v-for="(slide, i) in slides"
      :index="i"
      :key="i"
      #default="{ index, isCurrent, leftIndex, rightIndex }"
    >
      <h1>{{ slide.title }}</h1>
      <p>{{ index }}</p>
      <p>{{ isCurrent }}</p>
      <p>{{ leftIndex }}</p>
      <p>{{ rightIndex }}</p>
    </CarouselSlide>
  </Carousel3D>
</template>

<style scoped>
.carousel-3d-container {
  height: 240px !important;
  padding: 20px;
}
.current {
  box-shadow: 0px 0px 20px 5px #ffdf5e;
}
</style>
