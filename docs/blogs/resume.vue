<template>
  <main class="resume-layout">
    <header class="header">
      <div class="name-and-position">
        <div class="name">{{ personalInfo.name }}</div>
        <div class="position">{{ personalInfo.position }}</div>
      </div>
      <div class="info">
        <span>{{ personalInfo.gender }}</span>
        <span>{{ personalInfo.birth }}</span>
        <span>{{ personalInfo.phone }}</span>
        <span>{{ personalInfo.email }}</span>
      </div>
    </header>
  </main>
</template>

<script setup lang="ts">
const personalInfo = {
  name: "胡强",
  position: "Web 前端开发工程师",
  gender: "男",
  birth: "1998-06",
  phone: "182-7151-8107",
  email: "qianghu98@163.com",
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.resume-layout {
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem 3rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;

  .header {
    .name-and-position {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
