---
title: 区分设备类型
createTime: 2024/12/23 11:51:32
permalink: /others/90ibb7l5/
---

在前端开发中，区分移动端和 PC 环境是常见需求。不同的设备类型通常会有不同的屏幕尺寸、输入方式和交互习惯。因此，开发者需要针对不同的设备类型进行适配。常见的区分移动端和 PC 环境的方法如下：

## 01 CSS 媒体查询

媒体查询是前端适配的主要方法。通过媒体查询，CSS 可以根据设备的屏幕尺寸、分辨率等条件加载不同的样式，从而实现响应式设计。

```css
/* 适配移动端设备 */
@media (max-width: 768px) {
  body {
    background-color: lightblue;
  }
}

/* 适配 PC 端设备 */
@media (min-width: 769px) {
  body {
    background-color: lightgreen;
  }
}
```

> 通过设置最大宽度（`max-width`）或最小宽度（`min-width`），可以区分移动端和 PC 端的样式。

## 02 `window.innerWidth` 和 `window.innerHeight`

通过 JavaScript 获取浏览器窗口的宽度和高度，判断是否为移动设备。可以在页面加载或调整窗口大小时执行相应的逻辑。

```js
function isMobile() {
  return window.innerWidth <= 768;
}

if (isMobile()) {
  console.log("移动端设备");
} else {
  console.log("PC 端设备");
}
```

> 通过检查窗口的宽度判断设备类型，宽度小于等于 768px 通常认为是移动端设备。

## 03 `navigator.userAgent`

该方法较为常用，`navigator.userAgent` 提供了浏览器和设备的详细信息，通过匹配常见的设备标识符可以区分移动端和 PC 环境。

```jsx
function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobile|android|iphone|ipad|ipod/.test(userAgent);
}

if (isMobile()) {
  console.log("移动端设备");
} else {
  console.log("PC 端设备");
}
```

> 通过检测 `userAgent` 中的关键字（如 `mobile`、`android`、`iphone` 等）判断是否为移动设备。这种方法简单但不够精确，尤其在有些设备或用户代理字符串被修改的情况下。

## 04 `window.matchMedia()`

`window.matchMedia()` 允许使用 JavaScript 编写和 CSS 媒体查询类似的条件表达式。适合在 JavaScript 中实时监听设备类型的变化。

```js
const mediaQuery = window.matchMedia("(max-width: 768px)");

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("移动端设备");
  } else {
    console.log("PC 端设备");
  }
}

// 检查初始设备类型
handleDeviceChange(mediaQuery);

// 监听设备类型变化
mediaQuery.addEventListener("change", handleDeviceChange);
```

> `window.matchMedia()` 可以与 CSS 媒体查询保持一致，实时监听设备屏幕大小的变化，适合响应式动态调整页面内容。

## 05 使用第三方库

第三方库 `mobile-detect.js` 是一个轻量级工具，用于检测设备类型（如手机、平板、PC）。它通过解析 `userAgent` 信息识别设备。

```sh
npm install mobile-detect
```

```js
import MobileDetect from "mobile-detect";

const md = new MobileDetect(window.navigator.userAgent);

if (md.mobile()) {
  console.log("移动端设备");
} else {
  console.log("PC 端设备");
}
```

> `mobile-detect.js` 提供了一个简单的 API，用于识别移动设备和桌面设备，还能进一步区分平板、手机等类型。

## 06 触摸事件检测

移动设备一般支持触摸事件，而 PC 端通常依赖鼠标和键盘输入。通过检测设备是否支持触摸事件，可以判断是否为移动设备。

### 示例：

```js
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

if (isTouchDevice()) {
  console.log("移动端设备");
} else {
  console.log("PC 端设备");
}
```

> 通过检查 `window` 是否支持 `ontouchstart` 事件或设备的触摸点数来判断设备是否为移动端。
