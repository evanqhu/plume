---
title: 惰性函数
createTime: 2025/04/10 17:21:54
permalink: /engineering/596xlju6/
---

惰性函数（Lazy Function）通常是指函数的行为或实现会在首次执行时延迟到需要时才确定。

---

## 示例

在这段代码中，`addEvent` 函数的行为在首次调用时才会被定义，并根据不同的浏览器环境动态选择合适的事件绑定方式。这是一个典型的惰性加载和惰性初始化的场景。
且该函数在初始化之后，后续使用时不需要重复执行 `if` 逻辑。

这个技巧也可以叫做**函数重定义**，如果某些操作只需要执行一次，像环境检测、资源初始化等，就可以使用类似技巧。

```js
function addEvent(element, type, handler) {
  if (window.addEventListener) {
    console.log("首次执行函数，检测到浏览器环境是 Chrome 或 Edge");
    addEvent = function (element, type, handler) {
      console.log("开始添加事件");
      element.addEventListener(type, handler, false);
    };
  } else if (window.attachEvent) {
    console.log("首次执行函数，检测到浏览器环境是 IE8 及以下");
    addEvent = function (element, type, handler) {
      console.log("开始添加事件");
      element.attachEvent("on" + type, handler);
    };
  } else {
    console.log("首次执行函数，检测到浏览器环境是其他老版本");
    addEvent = function (element, type, handler) {
      console.log("开始添加事件");
      element["on" + type] = handler;
    };
  }
}
```
