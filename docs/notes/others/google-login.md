---
title: 谷歌登录
createTime: 2025/03/12 17:39:42
permalink: /others/56hkqylw/
---

## 谷歌登录示例

::: code-tabs
@tab index.vue

```vue :collapsed-lines
<script setup lang="ts">
onMounted(() => {
  // 谷歌登录成功的回调 (调用登录接口)
  window.googleCallback = (response: { credential: string }) => {
    console.log("🚀🚀🚀 google response: ", response);
    handleLogin(response.credential);
  };
  // 检查 Google 对象是否存在
  if (window.google) {
    // 初始化 Google 登录实例
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: window.googleCallback,
    });
    // 初始化 Google 登录按钮
    window.google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: "filled_blue",
      size: "large",
      shape: "circle",
    });
    // 显示 Google 登录提示
    window.google.accounts.id.prompt();
  }
});
</script>

<template>
  <div class="login app-content-wrapper">
    <div class="login-content app-content">
      <div id="google-btn">
        <div
          id="g_id_onload"
          :data-client_id="GOOGLE_CLIENT_ID"
          data-context="signin"
          data-ux_mode="popup"
          data-itp_support="true"
          data-callback="googleCallback"
        />
        <div
          class="g_id_signin"
          data-type="standard"
          data-shape="circle"
          data-theme="filled_blue"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
```

:::
