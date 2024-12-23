---
title: 时间分片
createTime: 2024/12/23 11:22:53
permalink: /others/t83td7no/
---

浏览器时间分片是一种前端性能优化技术，用于将长时间运行的任务拆分为多个小块，分散到多个浏览器空闲时间片段中执行，从而避免长时间阻塞主线程，提升页面的响应性。

通过时间分片技术，任务的执行被分散到多个帧内，让浏览器在任务之间有时间处理其他重要的工作（如渲染、用户交互等）。

## 时间分片

### 单线程限制

JavaScript 在浏览器中是单线程执行的，长时间运行的任务（例如复杂的循环、计算等）会阻塞主线程，导致：

- 页面卡顿
- 用户事件（如点击、滚动等）得不到及时响应

### 提升用户体验

- 将任务分片可以释放主线程，使浏览器能及时响应用户操作

## 实现方法

### 1️⃣ setTimeout

`setTimeout` 将任务切分成多个小块，在每次任务完成后交还控制权给浏览器。

```js
function bigTask() {
  const tasks = Array.from({ length: 1000000 }, (_, i) => i); // 模拟大量任务
  // [1, 2, ..., 9999]

  function processChunk() {
    const chunk = tasks.splice(0, 1000); // 每次处理 1000 个任务
    chunk.forEach((task) => {
      // 模拟任务处理
      console.log(task);
    });

    if (tasks.length > 0) {
      setTimeout(processChunk, 0); // 下一次时间片再处理
    }
  }

  processChunk();
}

bigTask();
```

- 每次只处理 1000 个任务，然后将控制权交还给浏览器。
- 下一次处理通过 setTimeout 执行。
- 避免一次性执行 100 万个任务导致主线程卡死。

### 2️⃣ requestAnimationFrame

`requestAnimationFrame` 是专为与动画渲染同步设计的 API，每次屏幕刷新时执行回调，非常适合时间分片。

```js
function bigTask() {
  const tasks = Array.from({ length: 1000000 }, (_, i) => i);

  function processChunk() {
    const chunk = tasks.splice(0, 1000); // 每帧处理 1000 个任务
    chunk.forEach((task) => {
      console.log(task);
    });

    if (tasks.length > 0) {
      requestAnimationFrame(processChunk); // 下一帧再处理
    }
  }

  processChunk();
}

bigTask();
```

- 每帧处理一部分任务，利用浏览器刷新机制分散任务。
- 保持页面动画和渲染流畅。

## 案例

初始化 n = 0，每次计算让 n += 1，直到 n = 1000。但每次计算的时间不能超过 15ms

```js
// 这段代码通过 requestAnimationFrame 和 setTimeout 把累加任务分片
// 让每次执行一部分操作后，暂停一下，给浏览器喘息的时间。
const sumToN = (n) => {
  const start = Date.now();
  // 返回一个 Promise 对象
  return new Promise((resolve) => {
    let sum = 0; // 初始化累加和为 0
    let startTime = Date.now(); // 记录当前时间，后续用于计算时间间隔
    let intervalId; // 用于存储 setTimeout 返回的定时器 ID

    // 定义递归函数用于累加
    const addNext = () => {
      console.log("🚀🚀🚀 sum: ", sum); // 从 0 打印到 1000，大概需要花 8 秒钟
      if (sum < n) {
        // 判断是否还需要继续累加
        sum += 1; // 累加 1
        // requestAnimationFrame(addNext);
        // addNext();
        if (Date.now() - startTime < 15) {
          // 计算从上一次任务开始到现在的时间差
          // 如果从上次时间点开始的时间小于 15 毫秒，表示任务还没有占用太多时间
          // 继续使用 requestAnimationFrame 递归调用自身，让任务尽快执行
          requestAnimationFrame(addNext);
        } else {
          // 如果时间差大于等于 15 毫秒，表示任务已经消耗了一些性能
          // 切换到 setTimeout，让主线程有时间处理其他事情
          startTime = Date.now();
          intervalId = setTimeout(addNext, 0); // 延迟为 0，表示尽快执行
          // 通过这种方式，累加任务会被分片执行，而不会卡死主线程
        }
      } else {
        // 当累加完成时，清除定时器
        clearTimeout(intervalId);
        // 将最终的 sum 值通过 resolve 返回
        console.log("🚀🚀🚀 time: ", Date.now() - start);
        resolve(sum);
      }
    };

    // 开始执行递归函数
    addNext();
  });
};

// 使用示例
sumToN(1000).then((result) => {
  console.log("🚀🚀🚀 result: ", result); // 输出累加结果
});
```

不使用任何优化，直接累加，耗时大约 160ms；使用该方法后，耗时大约 8000ms。
