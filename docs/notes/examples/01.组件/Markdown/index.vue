<script setup lang="ts">
import { ref, computed } from "vue";
import { marked } from "marked";

const input = ref("# hello");

const compiledMarkdown = computed(() => {
  return marked(input.value);
});
</script>

<template>
  <div id="editor">
    <textarea v-model="input" rows="10" cols="30"></textarea>
    <div v-html="compiledMarkdown"></div>
  </div>
</template>

<style lang="scss" scoped>
#editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  textarea {
    resize: none;
    border: none;
    outline: none;
    padding: 10px;
    border: 1px solid #ccc;
  }

  :deep(h2) {
    padding: 0;
    margin: 0;
  }

  :deep(p) {
    padding: 0;
    margin: 0;
    line-height: 1.5;
  }

  :deep(ul) {
    margin: 0;
  }
}
</style>
