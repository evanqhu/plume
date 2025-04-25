---
title: 对象数组去重
createTime: 2025/04/25 15:48:01
permalink: /examples/wbobidm3/
---

对象数组去重，只要对象的所有属性和属性值都相同，则表示对象相同

```js
const arr = [
  { a: 1, b: 2 },
  { a: 1, b: 2 },
  { a: 1, b: 2, c: { a: 1, b: 2 } },
  { a: 1, b: 2, c: { b: 2, a: 1 } },
];
```

## 算法

@[code js :collapsed-lines](./index.js)
