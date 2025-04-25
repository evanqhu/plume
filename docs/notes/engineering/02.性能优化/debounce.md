---
title: 函数防抖
createTime: 2025/04/25 13:56:03
permalink: /engineering/ijh82fcl/
---

函数防抖（Debounce）是一种优化技术，用于限制函数在短时间内被频繁调用的次数。它通过延迟执行函数来减少不必要的计算或操作，从而提高性能。

防抖函数是一个高阶函数，它接受一个函数作为参数，并返回一个新函数。新函数在短时间内被频繁调用时，不会立即执行，而是会延迟执行，直到一段时间后没有新的调用，才会执行。

## 条件

如果一个函数满足以下条件，就可以用函数防抖来优化：

- 频繁触发
- 耗时操作
- 只关心最终结果

## 示例

```js
/** 通用的防抖函数 */
function debounce(fn, delay) {
  let timeout;

  return function (...args) {
    // 如果之前有定时器，则清除
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.call(this, ...args), delay);
  };
}

const handler = () => {
  console.log("耗时操作");
};

const newHandler = debounce(handler, 500);

container.addEventListener("resize", newHandler);
```
