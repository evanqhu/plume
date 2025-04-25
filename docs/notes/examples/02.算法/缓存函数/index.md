---
title: 缓存函数
createTime: 2025/04/24 10:50:31
permalink: /examples/rygs10pr/
---

实现一个 memorize 函数，缓存函数的结果，避免重复计算。

```js
// 缓存函数
function memorize(fn) {}

const object1 = { a: 1, b: 2 };

const object2 = { c: 3, d: 4 };

// 需要缓存的函数
const fn = (obj) => Object.values(obj);
// 缓存后的函数
const memorizedFn = memorize(fn);

console.log(fn(object1)); // [1, 2]
console.log(fn(object2)); // [3, 4]
console.log(memorizedFn(object1)); // [1, 2]
console.log(memorizedFn(object2)); // [3, 4]

object1.a = 10;

console.log(fn(object1)); // [10, 2]
console.log(fn(object2)); // [3, 4]
// 缓存结果不会被修改
console.log(memorizedFn(object1)); // [1, 2]
console.log(memorizedFn(object2)); // [3, 4]

// 还可以修改缓存结果
memorizedFn.cache.set(object1, [100, 200]);
console.log(memorizedFn(object1)); // [100, 200]
```

@[code js :collapsed-lines](./index.js)
