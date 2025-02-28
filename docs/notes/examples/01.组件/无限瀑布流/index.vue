<script setup lang="ts">
import VueMasonary from "./VueMasonary/index.vue";

/** 随机高度函数 */
const randomHeight = () => {
  return Math.floor(Math.random() * (400 - 200 + 1)) + 200;
};

const defaultFetchImages = async () => {
  return Promise.resolve(
    new Array(30).fill(null).map((item, index) => ({
      src: `https://picsum.photos/200/${randomHeight()}?r=${index}`,
    }))
  );
};
</script>

<template>
  <VueMasonary :fetch-images="defaultFetchImages">
    <template #default="{ image, index }">
      <div v-if="index === 2" class="ad">广告</div>
      <div v-else :class="image.loaded ? 'item-container' : 'placeholder'" style="width: 100%; height: 100%">
        <img
          :src="`https://picsum.photos/200/${image.imageHeight}?r=${index}`"
          @load="() => (image.loaded = true)"
          class="feeds-img"
          alt=""
        />
        <div v-show="image.loaded" class="desc">{{ index }}</div>
      </div>
    </template>
  </VueMasonary>
</template>

<style lang="scss" scoped>
.feeds-item {
  .feeds-img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .desc {
    position: absolute;
    bottom: 0;
    right: 8px;
    color: #fff;
  }

  .ad {
    width: 100%;
    height: 100%;
    background: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
}
</style>
