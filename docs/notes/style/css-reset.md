---
title: 重置 CSS
createTime: 2025/01/24 16:07:06
permalink: /style/57w2x3c1/
---

<https://www.joshwcomeau.com/css/custom-css-reset/>

## 我的最佳实践

```css
/*
  Josh's Custom CSS Reset
  https://www.joshwcomeau.com/css/custom-css-reset/
*/

/* 1. Use a more-intuitive box-sizing model */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 2. Remove default margin */
* {
  margin: 0;
}

body {
  /* 3. Add accessible line-height */
  line-height: 1.5;
  /* 4. Improve text rendering */
  -webkit-font-smoothing: antialiased;
  /* Set default font-family */
  font-family: 
    "Inter var experimental", /* Inter 字体的一个变体版本，支持可变字体特性 */
    "Inter var", /* Inter 字体的标准变体版本，它也支持可变字体特性 */
    Inter, /* Inter 字体的常规版本 */
    -apple-system, /* Apple 设备（如 macOS 和 iOS）上使用的默认系统字体，一般为 San Francisco */
    BlinkMacSystemFont, /* Chrome 浏览器在 macOS 上使用的系统字体，一般与 -apple-system 相同 */
    "Segoe UI", /* Windows 系统的默认界面字体 */
    Roboto, /* Google 的开源字体，广泛用于 Android 和 Chrome OS */
    Oxygen, /* KDE 桌面环境（一个 Linux 桌面环境）使用的字体 */
    Ubuntu, /* Ubuntu 操作系统使用的默认字体 */
    Cantarell, /* GNOME 桌面环境的默认字体 */
    "Fira Sans", /* Mozilla 的开源字体，用于 Firefox 浏览器 */
    "Droid Sans", /* 旧 Android 系统的默认字体 */
    "Helvetica Neue", /* 旧版 macOS 和 Windows 系统的默认字体 */
    sans-serif; /* 最后，如果以上字体都不可用，则使用系统默认的无衬线字体 */
}

/* 5. Improve media defaults */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/* 6. Inherit fonts for form controls */
input, button, textarea, select {
  font: inherit;
}

/* 7. Avoid text overflows */
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

/* 8. Improve line wrapping */
p {
  text-wrap: pretty;
}
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}

/* 9. Create a root stacking context */
#__nuxt {
  isolation: isolate;
}

/* 清除 input 框自动填充的背景颜色 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px transparent inset;
  -webkit-transition:
    background-color 0s ease-in-out 9999s,
    color 0s ease-in-out 9999s;
  -webkit-transition-delay: 9999s;
  /* 设置一个很长的过渡延迟 */
  -webkit-text-fill-color: inherit;
}

/* 清除 a 标签默认样式 */
a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
  color: inherit;
}
```
