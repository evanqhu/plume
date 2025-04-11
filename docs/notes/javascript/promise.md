---
title: Promise 期约
createTime: 2025/04/10 22:16:52
permalink: /javascript/h5viaov5/
---

Promise 是 JavaScript 中一种异步编程的解决方案。

在 [Promise A+](https://promisesaplus.com/) 社区规范中最先定义了 Promise 的实现，带有 then 方法的对象或函数

到 ES6 时，Promise 被纳入了 ECMAScript 标准，统一了用法，原生提供了 Promise 构造函数

::: note 链接
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>
:::

## Promise 规范

我们常说的 Promise 一般是满足 Promise A+ 规范的对象或函数，简单可以理解为带有 `then` 方法的对象和函数就可以说是一个 Promise。

通过 `new Promise` 创建的一个实例对象也是满足 Promise A+ 规范的的一个 Promise。

所以一般判断一个变量是不是一个 Promise，不是通过 `val instanceof Promise` 来判断的，而是去判断它是否满足 Promise A+ 规范。

## 前置知识

- 函数对象：将函数作为对象使用
- 实例对象：通过 `new` 构造函数或类产生的对象
- 同步回调函数：立即在主线程执行，不会放入回调队列，如数组遍历相关的回调 `arr.forEach(() => {})`
- 异步回调函数：不会立即执行，会放入**回调队列**中等待主线程执行完毕再执行，如定时器，ajax，Promise 的回调

```js
// 函数对象
function Person() {}
Person.age = 18;
console.log(Person.age);

// 实例对象
const p = new Person();
```

## 异步编程

同步就是按照代码书写的顺序执行，异步不按照代码顺序执行，异步的执行效率更高；浏览器主线程作为一个线程，不能够同时接受多方面的请求。所以当一个事件没有结束时，界面将无法处理其他请求；我们常常用子线程来完成一些可能消耗时间足够长以至于被用户察觉的事情。

因为子线程独立于主线程，所以即使出现阻塞也不会影响主线程的运行。但是子线程有一个局限：一旦发射了以后就**会与主线程失去同步，我们无法确定它的结束**，如果结束之后需要处理一些事情，比如处理来自服务器的信息，我们是无法将它合并到主线程中去的。为了解决这个问题，JavaScript 中的异步操作函数往往通过**回调函数**来实现异步任务的结果处理。

**回调函数**就是一个函数，它是在我们启动一个异步任务的时候就告诉它：等你完成了这个任务之后要干什么。这样一来主线程几乎不用关心异步任务的状态了，他自己会善始善终。Promise 之前的 ajax 和定时器都是异步解决方案。

例如 `setTimeout(callback, t)` 就会启动一个子线程，执行回调函数

### Promise 类

Promise 是一个 ES6 提供的**类**，或者说是一个**构造函数**，目的是更加优雅地书写复杂的异步任务。将"函数瀑布"变成顺序格式的代码。

> **Promise 的实例对象可以用来封装一个异步操作，并可以获取其成功或失败的值**

1️⃣ 起始函数 `executor`

- Promise 构造函数只有一个参数，是一个**同步回调函数**，这个函数在构造之后会立即在主线程被**同步**运行，所以我们称之为**起始函数 executor** 函数
- **起始函数**包含两个函数参数， `resolve()` 和 `reject()` 函数
- 在 Promise 的 `executor` 函数体中书写**异步任务**，之后调用 `resolve()` 和 `reject()`
- 当调用 `resolve()`，表示异步任务成功，Promise 状态变为成功态；`resolve()` 中可以放置一个参数用于指定成功的 `value` 值
- 当调用 `reject()`，表示异步任务失败，Promise 状态变为失败态；`reject()` 参数中一般会传递一个错误对象用于指定失败的 `reason` 值
- `resolve()` 和 `reject()` 的作用域只有起始函数，不包括 `then` 以及其他序列；
- `resolve()` 和 `reject()` 并不能够使**起始函数**停止运行，如果希望起始函数在 `resolve()` 之后停止，别忘了 `return`；

2️⃣ Promise 实例的方法

- Promise 类的原型上有 `then` `catch` `finally` 三个方法，这三个方法的参数都是回调函数
  - `then()` 用于指定 Promise 成功和失败的回调 (一般只指定成功的回调)
  - `catch()` 用于指定 Promise 失败时的回调
  - `finally()` 用于指定 Promise 最终执行的回调
- `then()` 中的回调函数是**异步回调函数**，**then 方法返回一个新 Promise 实例**，因此可以继续**链式调用** ，解决传统的回调地狱的问题

  - 如果 `then()` 指定的回调执行后返回一个非 Promise 值，如 `undefined`，那么新 Promise 实例的状态为成功，值为 `undefined`
  - 如果 `then()` 指定的回调执行后返回一个 Promise 实例 `p`，那么新 Promise 实例的状态和值与 `p` 一致
  - 如果 `then()` 指定的回调执行后抛出异常，那么新 Promise 实例的状态为失败，值为抛出的异常

- `then()` 方法传入两个函数参数，第一个是成功的回调函数，第二个是失败的回调函数（我们一般只传成功的回调）
- 原始 Promise 实例的**状态只能改变一次**，从 `pending` 到 `fulfiled` 或从 `pending` 到 `rejected`
- 指定多个失败或成功的回调函数，都会依次调用 **(回调队列)**，注意是多个 `then()` 的回调几乎同时推入回调队列，同时执行

3️⃣ 其他

- Promise 的**错误穿透**
  - 当使用 Promise 的 `then()` 方法链式调用时，可以在最后用 `catch` 指定一个失败的回调；前面任何操作出现错误，都会传到最后失败的回调中处理
- 什么时候适合用 Promise 而不是传统回调函数？
  - 当**需要多次顺序执行异步操作的时候**，例如，如果想通过异步方法先后检测用户名和密码，需要先异步检测用户名，然后再异步检测密码的情况下就很适合 Promise
- Promise 只不过是一种更良好的编程风格，没有把异步转换为同步
- 什么时候我们需要再写一个 `then()` 而不是在当前的 `then()` 接着编程？
  - 当你又需要调用一个异步任务的时候

### 代码示例

```js
/** 示例 1 */
new Promise((resolve, reject) => {
  // 要做的事 (同步代码，里面开启一些异步任务)
  resolve(); // or reject()
}).then(
  (value) => {}, // 成功的回调 (异步回调)
  (reason) => {} // 失败的回调 (异步回调)
);

/** 示例 2 */
new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("First");
    resolve(); // 表示一切正常，继续执行
  }, 1000);
})
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Second");
        resolve();
      }, 1000);
    });
  })
  .then(() => {
    setTimeout(() => {
      console.log("Third");
    }, 3000);
  });

/** 示例 3 */
new Promise((resolve, reject) => {
  console.log(1111);
  resolve(2222); // 表示一切正常，把 2222 传递给下一个 then 的 value，继续执行
})
  .then((value) => {
    console.log(value);
    return 3333; // 表示一切正常，把 3333 传递给下一个 then 的 value
  })
  .then((value) => {
    console.log(value);
    throw "An error"; // 抛出异常和调用 reject 类似
  })
  .catch((err) => {
    console.log(err);
  });

// 1111 2222 3333 An error 几乎同时执行

/** 示例 4 错误穿透 */
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(-1);
  }, 1000);
});

p.then(
  (value) => {
    console.log("成功了 1", value);
    return "b";
  },
  // reason => { console.log('失败了 1', reason); return -2; },
  (reason) => {
    throw reason;
  } // 系统底层补了这么一句代码，指定失败的回调，用于错误穿透
)
  .then(
    (value) => {
      console.log("成功了 2", value);
      return "c";
    },
    // reason => { console.log('失败了 2', reason); return -3; },
    (reason) => {
      throw reason;
    } // 系统底层补了这么一句代码，指定失败的回调，用于错误穿透
  )
  .catch((reason) => {
    console.log("失败了", reason);
  });
```

## Promise 函数

把 Promise 放在函数的返回值中，这样函数就成了一个异步函数，可以在调用函数之后使用 `then` 方法，也可以放在 `await` 之后，相当于用 Promise 封装了一个异步操作。

```js
// Promise 函数 (解决回调地狱)
function print(delay, message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(message);
      resolve();
    }, delay);
  });
}

// 调用 Promise 函数
print(1000, "First")
  .then(() => {
    return print(1000, "Second");
  })
  .then(function () {
    print(1000, "Third");
  });

// 改写异步函数
async function asyncFunc() {
  await print(1000, "First"); // await 后面一般跟一个 Promise 实例对象
  await print(1000, "Second");
  await print(1000, "Third");
}
asyncFunc();
```

## Async Await

异步函数 `async function` 中可以使用 `await` 指令，`await` 指令后一般跟着一个 Promise 实例，异步函数会在这个 Promise 运行中暂停，直到其运行结束再继续运行。

- **`async` 修饰的函数，函数的返回值一定为 Promise 实例**
- `async` 函数无论你返回什么，都会被自动包裹成一个新的 Promise。
- Promise 实例的结果由 `async` 函数执行的返回值决定
- `await` 指令后的表达式一般是一个 Promise 实例，也可以是其它值
  - 如果表达式是 Promise 对象，那么 `await` 后的返回值是 Promise 成功的值
  - 如果表达式是 Promise 对象，且失败了，就会抛出异常，需要通过 `try catch` 来捕获处理
  - 如果表达式是其它值，直接将此值作为 `await` 的返回值
- `await` 的底层原理还是将代码翻译成 `then` 方法

```js
async function demo() {
  const result = await p;
  console.log('异步任务执行完成');
  console.log(result);
}

// 底层翻译成
function demo() {
  p.then(
  	result => {
      console.log('异步任务执行完成');
      console.log(result;)
    }
  )
}
```

```js
async function fn1() {
  console.log(1);
  await fn2(); // 遇到 await，执行 fn2（这是个 async 函数，会返回 Promise），fn2 内部的代码是同步的
  console.log(2); // await 之后的代码会放到微任务队列中，等同步代码执行完再执行
}

async function fn2() {
  console.log("fn2"); // 这行是同步的，立即执行
}

fn1();
console.log(3); // 这行是同步的，fn1 的 await 后续部分不会阻塞它

// 1 fn2 3 2  await 阻塞后面代码的运行，它相当于一个 Promise，then 方法会阻塞

console.log(fn2()); // Promise {<fulfilled>: undefined}
```

Promise 解决了传统回调函数的回调地狱的问题，但是导致了纵向的回调链，遇到复杂的业务场景也不美观；`async await` 的代码更简洁，看起来像同步代码，是基于 Promise 实现的

## Promise API

### 1️⃣ `Promise.all(PromiseArr)`

**只有当所有 Promise 都成功时，它才会成功；如果有任何一个 Promise 失败，它就会失败**

传入包含 n 个 Promise 的数组，返回一个新的 Promise 实例，只有**所有的 Promise 都成功才成功**，且成功的 value 是所有 Promise 成功的 value 的数组，只要有一个失败了就直接失败。并且只要检测到失败的，就立即返回失败的 Promise。

```js :collapsed-lines
// 创建三个 Promise，模拟三个异步请求
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 1 完成");
    resolve("数据 1");
  }, 1000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 2 完成");
    resolve("数据 2");
  }, 2000);
});

const p3 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 3 完成");
    resolve("数据 3");
  }, 3000);
});

// 使用 Promise.all 并行执行所有请求
Promise.all([p1, p2, p3])
  .then((results) => {
    console.log("所有请求都成功完成！");
    console.log("结果数组:", results); // ['数据 1', '数据 2', '数据 3']
  })
  .catch((error) => {
    console.error("有一个请求失败了:", error);
  });

// 输出顺序:
// 请求 1 完成
// 请求 2 完成
// 请求 3 完成
// 所有请求都成功完成！
// 结果数组: ['数据 1', '数据 2', '数据 3']
```

**失败示例**:

```js
// 创建一个会失败的 Promise
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("请求 4 失败");
    reject(new Error("请求 4 出错了"));
  }, 1500);
});

// 使用 Promise.all 并行执行所有请求，包括一个会失败的请求
Promise.all([p1, p2, p4])
  .then((results) => {
    console.log("所有请求都成功完成！");
    console.log("结果数组:", results);
  })
  .catch((error) => {
    console.error("有一个请求失败了:", error);
  });

// 输出顺序:
// 请求 1 完成
// 请求 4 失败
// 有一个请求失败了: Error: 请求 4 出错了
// 注意: p2 和 p3 虽然最终会完成，但 Promise.all 在检测到第一个失败时就立即返回了
```

### 2️⃣ `Promise.any(PromiseArr)`

**只要其中一个 Promise 成功，返回的 Promise 就会成功；如果所有的 Promise 都失败，则返回失败**

```js :collapsed-lines
// 创建三个 Promise，模拟三个异步请求
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("请求 1 失败");
    reject(new Error("请求 1 出错了"));
  }, 1000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 2 成功");
    resolve("数据 2");
  }, 2000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("请求 3 失败");
    reject(new Error("请求 3 出错了"));
  }, 3000);
});

// 使用 Promise.any 并行执行所有请求
Promise.any([p1, p2, p3])
  .then((result) => {
    console.log("至少有一个请求成功完成！");
    console.log("第一个成功的结果:", result); // '数据 2'
  })
  .catch((error) => {
    console.error("所有请求都失败了:", error);
  });

// 输出顺序:
// 请求 1 失败
// 请求 2 成功
// 至少有一个请求成功完成！
// 第一个成功的结果: 数据 2
// 注意: 请求 3 虽然最终会失败，但 Promise.any 在检测到第一个成功时就立即返回了
```

**全部失败示例**:

```js :collapsed-lines
// 创建三个都会失败的 Promise
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("请求 4 失败");
    reject(new Error("请求 4 出错了"));
  }, 1000);
});

const p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("请求 5 失败");
    reject(new Error("请求 5 出错了"));
  }, 2000);
});

const p6 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("请求 6 失败");
    reject(new Error("请求 6 出错了"));
  }, 3000);
});

// 使用 Promise.any 并行执行所有请求
Promise.any([p4, p5, p6])
  .then((result) => {
    console.log("至少有一个请求成功完成！");
    console.log("第一个成功的结果:", result);
  })
  .catch((error) => {
    console.error("所有请求都失败了:", error);
    console.log("错误类型:", error.name); // AggregateError
    console.log("所有错误:", error.errors); // [Error: 请求 4 出错了, Error: 请求 5 出错了, Error: 请求 6 出错了]
  });

// 输出顺序:
// 请求 4 失败
// 请求 5 失败
// 请求 6 失败
// 所有请求都失败了: AggregateError: All promises were rejected
// 错误类型: AggregateError
// 所有错误: [Error: 请求 4 出错了, Error: 请求 5 出错了, Error: 请求 6 出错了]
```

### 3️⃣ `Promise.allSettled(PromiseArr)`

**等待所有 Promise 都完成（无论成功还是失败），并返回一个包含每个 Promise 结果的数组**

数组中的每一项都是一个对象，status 字段表示状态，value 表示成功的值，reason 表示失败的原因

```js
[
  { status: 'fulfilled', value: 1 },
  { status: 'fulfilled', value: 2 },
  {
    status: 'rejected',
    reason: Error: 出错了，出错请求：92
        at Timeout._onTimeout (/Users/code/请求并发.js:13:20)
        at listOnTimeout (node:internal/timers:569:17)
        at process.processTimers (node:internal/timers:512:7)
  },
]
```

```js :collapsed-lines
// 创建三个 Promise，模拟三个异步请求
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 1 完成");
    resolve("数据 1");
  }, 1000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("请求 2 失败");
    reject(new Error("请求 2 出错了"));
  }, 2000);
});

const p3 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 3 完成");
    resolve("数据 3");
  }, 3000);
});

// 使用 Promise.allSettled 并行执行所有请求
Promise.allSettled([p1, p2, p3]).then((results) => {
  console.log("所有请求都已完成（无论成功或失败）！");
  console.log("结果数组:", results);

  // 处理结果
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`请求 ${index + 1} 成功，值为: ${result.value}`);
    } else {
      console.log(`请求 ${index + 1} 失败，原因为: ${result.reason.message}`);
    }
  });
});

// 输出顺序:
// 请求 1 完成
// 请求 2 失败
// 请求 3 完成
// 所有请求都已完成（无论成功或失败）！
// 结果数组: [
//   { status: 'fulfilled', value: '数据 1' },
//   { status: 'rejected', reason: Error: 请求 2 出错了 },
//   { status: 'fulfilled', value: '数据 3' }
// ]
// 请求 1 成功，值为: 数据 1
// 请求 2 失败，原因为: 请求 2 出错了
// 请求 3 成功，值为: 数据 3
```

### 4️⃣ `Promise.race(PromiseArr)`

只要传入的 Promise 数组中 **有一个 Promise 率先变为 fulfilled 或 rejected**，race 返回的这个 Promise 就会以相同的状态完成（不管后面的 Promise 有没有完成）。

也就是说，**第一个完成（无论成功还是失败）的 Promise 的结果，就是最终的结果**。

```js :collapsed-lines
// 创建三个 Promise，模拟三个异步请求
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 1 完成");
    resolve("数据 1");
  }, 1000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 2 完成");
    resolve("数据 2");
  }, 2000);
});

const p3 = new Promise((resolve) => {
  setTimeout(() => {
    console.log("请求 3 完成");
    resolve("数据 3");
  }, 3000);
});

// 使用 Promise.race 并行执行所有请求
Promise.race([p1, p2, p3])
  .then((result) => {
    console.log("有一个请求率先完成！");
    console.log("第一个完成的结果:", result); // '数据 1'
  })
  .catch((error) => {
    console.error("有一个请求率先失败:", error);
  });

// 输出顺序:
// 请求 1 完成
// 有一个请求率先完成！
// 第一个完成的结果: 数据 1
// 注意: 请求 2 和请求 3 虽然最终会完成，但 Promise.race 在检测到第一个完成时就立即返回了
```

**失败示例**:

```js
// 创建一个会失败的 Promise
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("请求 4 失败");
    reject(new Error("请求 4 出错了"));
  }, 500);
});

// 使用 Promise.race 并行执行所有请求，包括一个会失败的请求
Promise.race([p1, p2, p4])
  .then((result) => {
    console.log("有一个请求率先完成！");
    console.log("第一个完成的结果:", result);
  })
  .catch((error) => {
    console.error("有一个请求率先失败:", error);
  });

// 输出顺序:
// 请求 4 失败
// 有一个请求率先失败: Error: 请求 4 出错了
// 注意: 请求 1 和请求 2 虽然最终会完成，但 Promise.race 在检测到第一个完成（无论是成功还是失败）时就立即返回了
```

### 5️⃣ `Promise.resolve()`

**用于快速返回一个状态为 fulfilled 的 Promise 实例对象**

- 将值转换为已解决的 Promise。如果传入的是一个普通值，`Promise.resolve` 会返回一个已解决的 Promise，解析值为该普通值
- **保持原有的 Promise。**如果传入的值已经是一个 Promise，`Promise.resolve` 会直接返回这个 Promise，不做任何修改
- 处理 `thenable` 对象。如果传入的是一个 `thenable` 对象（即具有 `then` 方法的对象），`Promise.resolve` 会返回一个跟踪这个 `thenable` 对象最终状态的 Promise

```js :collapsed-lines
// 示例 1: 将普通值转换为 Promise
const p1 = Promise.resolve(42);
console.log(p1); // Promise { <fulfilled>: 42 }

p1.then((value) => {
  console.log("Promise 已解决，值为:", value); // Promise 已解决，值为: 42
});

// 示例 2: 保持原有的 Promise
const originalPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("原始 Promise 的结果");
  }, 1000);
});

const p2 = Promise.resolve(originalPromise);
console.log(p2); // Promise { <pending> }

p2.then((value) => {
  console.log("Promise 已解决，值为:", value); // Promise 已解决，值为: 原始 Promise 的结果
});

// 示例 3: 处理 thenable 对象
const thenable = {
  then: (resolve, reject) => {
    setTimeout(() => {
      resolve("thenable 对象的结果");
    }, 1000);
  },
};

const p3 = Promise.resolve(thenable);
console.log(p3); // Promise { <pending> }

p3.then((value) => {
  console.log("Promise 已解决，值为:", value); // Promise 已解决，值为: thenable 对象的结果
});

// 示例 4: 在异步函数中使用
async function fetchData() {
  // 模拟异步请求
  const data = await Promise.resolve({ id: 1, name: "测试数据" });
  console.log("获取到的数据:", data);
  return data;
}

fetchData().then((result) => {
  console.log("函数返回结果:", result);
});
// 输出:
// 获取到的数据: { id: 1, name: '测试数据' }
// 函数返回结果: { id: 1, name: '测试数据' }
```

### 6️⃣ `Promise.reject()`

**用于快速返回一个状态为 rejected 的 Promise 实例对象**

```js :collapsed-lines
// 示例 1: 创建一个被拒绝的 Promise
const p1 = Promise.reject(new Error("操作失败"));
console.log(p1); // Promise { <rejected>: Error: 操作失败 }

p1.catch((error) => {
  console.log("Promise 被拒绝，错误为:", error.message); // Promise 被拒绝，错误为: 操作失败
});

// 示例 2: 在异步函数中使用
async function fetchData() {
  try {
    // 模拟异步请求失败
    const data = await Promise.reject(new Error("网络请求失败"));
    return data;
  } catch (error) {
    console.log("捕获到错误:", error.message);
    return null;
  }
}

fetchData().then((result) => {
  console.log("函数返回结果:", result); // 函数返回结果: null
});

// 示例 3: 在条件判断中使用
function processData(data) {
  if (!data) {
    return Promise.reject(new Error("数据不能为空"));
  }

  return Promise.resolve(data);
}

processData(null)
  .then((result) => {
    console.log("处理结果:", result);
  })
  .catch((error) => {
    console.log("处理失败:", error.message); // 处理失败: 数据不能为空
  });

processData({ id: 1, name: "测试数据" })
  .then((result) => {
    console.log("处理结果:", result); // 处理结果: { id: 1, name: '测试数据' }
  })
  .catch((error) => {
    console.log("处理失败:", error.message);
  });

// 输出:
// Promise { <rejected>: Error: 操作失败 }
// Promise 被拒绝，错误为: 操作失败
// 捕获到错误: 网络请求失败
// 函数返回结果: null
// 处理失败: 数据不能为空
// 处理结果: { id: 1, name: '测试数据' }
```

## 面试题

### 工具函数

```js
// catch 方法
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

// resolve 方法
Promise.resolve = function (value) {
  // 1. 如果传入的是一个 Promise，则直接返回
  if (value instanceof Promise) {
    return value;
  }

  // 2. 如果传入的是一个 thenable 对象，则返回一个新的 Promise，并跟踪其状态
  if (
    (typeof value === "object" || typeof value === "function") &&
    value !== null &&
    typeof value.then === "function"
  ) {
    return new Promise((resolve, reject) => {
      value.then(resolve, reject);
    });
  }

  // 3. 如果传入的是一个普通值，则返回一个新的 Promise，并将其状态设置为 fulfilled
  return new Promise((resolve) => {
    resolve(value);
  });
};

// reject 方法
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};
```

### 手动实现 Promise.all()

```js
const myPromiseAll = (arr) => {
  // 检查传入的是否为一个可迭代对象
  if (!Array.isArray(arr)) {
    return Promise.reject(new TypeError("Argument must be an iterable"));
  }

  // 返回一个新的 Promise
  return new Promise((resolve, reject) => {
    const results = []; // 定义结果数组
    let count = 0; // 定义变量存储完成的 Promise 数量

    // 如果是空数组
    if (arr.length === 0) {
      return resolve(results);
    }

    // 循环遍历 Promise 数组
    arr.forEach((item, index) => {
      // 使用 Promise.resolve 确保每个项都是一个 Promise，因为数组中传入的可能不是 Promise，而是一个值
      Promise.resolve(item)
        .then((value) => {
          results[index] = value; // 保证返回结果的数组顺序不变
          count++;

          // 如果所有的 Promise 都完成，则返回解决的 Promise
          if (count === arr.length) {
            resolve(results);
          }
        })
        .catch((reason) => {
          reject(reason); // 如果有一个 Promise 被拒绝，则返回拒绝的 Promise
        });
    });
  });
};
```

### 注意点

为什么 `p2 !== p1`，明明 `async1` 返回的是 `p1` 呢？

关键点在于 `async` 函数的返回值，`async` 函数无论你返回什么，都会被自动包裹成一个新的 Promise。

```js
const p1 = Promise.resolve();

async function async1() {
  return p1;
}

const p2 = async1();
console.log(p1 === p2); // false

// 解释
async function async1() {
  return p1;
}

// 等价于
async function async1() {
  return new Promise((resolve) => {
    resolve(p1);
  });
}
```

### 状态吸收 (weird)

如果你用 new Promise 的 resolve() 或 reject() 传入的是另一个 Promise，那这个 Promise 的最终状态就会“跟随”这个传入的 Promise，也就是“吸收”它的状态。

```js
// 示例 1
const p1 = new Promise((resolve) => {
  resolve();
});

const p2 = new Promise((resolve) => {
  resolve(p1);
});

console.log(p1); // Promise { <fulfilled>: undefined }
console.log(p2); // Promise { <pending> }
```

p1 在 executor 函数中同步执行了 `resolve()`，所以打印 p1 的状态是 `fulfilled`

p2 在 executor 函数中同步执行了 `resolve(p1)`，传入了一个 Promise，p2 需要等待 p1 的状态变化结束才算执行完成，所以在同步打印的时候 p2 的状态是 `pending`

### 一道离谱的 Promise 面试题

```js
Promise.resolve() // pr1
  .then(() => {
    // p0
    console.log(0);
    return Promise.resolve(4); // p4
  })
  .then((res) => {
    // pres
    console.log(res);
  });

Promise.resolve() // pr2
  .then(() => {
    // p1
    console.log(1);
  })
  .then(() => {
    // p2
    console.log(2);
  })
  .then(() => {
    // p3
    console.log(3);
  })
  .then(() => {
    // p5
    console.log(5);
  })
  .then(() => {
    // p6
    console.log(6);
  });

// 输出顺序：0 1 2 3 4 5 6
```

**分析**

1. 执行 `Promise.resolve()`。会返回一个新的 Promise 实例对象，记为 `pr1`，状态为 `fulfilled`，值为 `undefined`
2. 执行 `pr1.then()`。 会返回一个新的 Promise 实例对象，记为 `p0`，状态为 `pending`，值为 `undefined`
   - 为什么这个 `p0` 的状态是 `pending` 呢？因为 `p0` 的状态由 `pr1.then()` 的回调函数决定，而 `pr1.then()` 的回调函数还没有执行完毕，所以 `p0` 的状态是 `pending`
   - 在执行 `pr1.then()` 时，由于 `pr1` 的状态是 `fulfilled`，所以这里的回调函数会被加入到微队列排队执行
   - 微队列： `0`
3. 执行 `p0.then()`。 会返回一个新的 Promise 实例对象，记为 `pres`，状态为 `pending`，值为 `undefined`
   - 微队列： `0`
4. 执行第二个 `Promise.resolve()`。会返回一个新的 Promise 实例对象，记为 `pr2`，状态为 `fulfilled`，值为 `undefined`
5. 执行 `pr2.then()`。 会返回一个新的 Promise 实例对象，记为 `p1`，状态为 `pending`，值为 `undefined`
   - 执行 `pr2.then()` 时，由于 `pr2` 的状态是 `fulfilled`，所以这里的回调函数会被加入到微队列排队执行
   - 微队列： `0` `1`
6. 执行 `p1.then()`。 会返回一个新的 Promise 实例对象，记为 `p2`，状态为 `pending`，值为 `undefined`
   - 微队列： `0` `1`
7. 执行 `p2.then()`。 会返回一个新的 Promise 实例对象，记为 `p3`，状态为 `pending`，值为 `undefined`
   - 微队列： `0` `1`
8. 执行 `p3.then()`。 会返回一个新的 Promise 实例对象，记为 `p5`，状态为 `pending`，值为 `undefined`
   - 微队列： `0` `1`
9. 执行 `p5.then()`。 会返回一个新的 Promise 实例对象，记为 `p6`，状态为 `pending`，值为 `undefined`
   - 微队列： `0` `1`

**同步代码执行完毕，开始执行微任务队列**

- 此时 Promise 状态
  - pr1 fulfilled
  - p0 pending
  - pres pending
  - pr2 fulfilled
  - p1 pending
  - p2 pending
  - p3 pending
  - p5 pending
  - p6 pending
- 微队列： `0` `1`

10. 输出 0，之后执行 `return Promise.resolve(4);`，由于这里返回的是一个 Promise `p4`，根据规范，此处会调用 `p4.then()`，并在回调中完成 `p0`。以上操作在微队列中执行，因此如下：
    - 微队列： `1` `p4.then(() => 完成 p0)`
    - 输出： `0`
    - 此时 `p0` 的状态依然为 `pending`
11. 输出 1，`p1` 的状态变为 `fulfilled`，把 `p1.then()` 的回调加入到微队列
    - 微队列： `p4.then(() => 完成 p0)` `2`
    - 输出： `0` `1`
12. 执行 `p4.then(() => 完成 p0)`，相当于把 `() => 完成 p0` 加入到微队列
    - 微队列： `2` `() => 完成 p0`
    - 输出： `0` `1`
13. 输出 2，`p2` 的状态变为 `fulfilled`，把 `p2.then()` 的回调加入到微队列
    - 微队列： `() => 完成 p0` `3`
    - 输出： `0` `1` `2`
14. 执行 `() => 完成 p0`，`p0` 的状态变为 `fulfilled`，把 `p0.then()` 的回调加入到微队列，这个回调是打印 `res`，`res` 是 `p4` 的值，也就是 `4`
    - 微队列： `3` `4`
    - 输出： `0` `1` `2`
15. 输出 3，`p3` 的状态变为 `fulfilled`，把 `p3.then()` 的回调加入到微队列
    - 微队列： `4` `5`
    - 输出： `0` `1` `2` `3`
16. 输出 4, `pres` 的状态变为 `fulfilled`
    - 微队列：`5`
    - 输出： `0` `1` `2` `3` `4`
17. 输出 5, `p5` 的状态变为 `fulfilled`，把 `p5.then()` 的回调加入到微队列
    - 微队列： `6`
    - 输出： `0` `1` `2` `3` `4` `5`
18. 输出 6，`p6` 的状态变为 `fulfilled`，结束

## 任务队列和事件循环

**任务队列**：JS 是单线程的语言，为了实现不阻塞，可以使用事件循环。在 JS 中，所有任务可以分成两种

- 同步任务 (synchronous)：在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务
- 异步任务 (asynchronous)：不进入主线程、而进入**任务队列** (task queue) 的任务，只有任务队列通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行 **(异步永远和队列挂钩)**

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
console.log(i);
// 先输出一个3，接着1秒之后，一次性输出三个3。三个定时器几乎同时设置的
```

**事件循环**：同步任务进入主线程，异步任务进入任务队列，主线程内的任务执行完毕为空，会去任务队列读取对应的任务，推入主线程执行。上述过程的不断重复就事件循环。

事件循环又叫做消息循环，是浏览器渲染主线程的工作方式。

在 Chrome 的源码中，它开启一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其他线程只需要在合适的时候将任务加入到队列末尾即可。

过去把消息队列简单分为宏队列和微队列，这种说法目前已无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式。

根据 W3C 官方的解释，每个任务有不同的类型，同类型的任务必须在同一个队列，不同的任务可以属于不同的队列。不同任务队列有不同的优先级，在一次事件循环中，由浏览器自行决定取哪一个队列的任务。但浏览器必须有一个微队列，微队列的任务一定具有最高的优先级，必须优先调度执行。

<img src="https://s2.loli.net/2024/06/13/GM2aciYh7UoKzCN.png" alt="event-loop.png" style="zoom: 50%;" />

**异步任务**也可以细分为两种，一种宏任务（MacroTask）也叫 Task，一种叫微任务（MicroTask）。

- 宏任务：一般 script 代码，用户交互事件、setTimeout、setInterval、requestAnimationFrame (浏览器独有)、I/O、UI rendering (浏览器独有)等；（用户调用的）
- 微任务：Promise 相关任务，process.nextTick (JS 调用的)

**任务执行流程**

1. 先执行同步任务，全部执行完；
2. 执行微任务，如果在执行微任务的过程中，又产生了微任务，那么会加入到队列的末尾，也会在这个周期被调用执行，直到微任务队列为空停止；
3. 微任务队列为空时，取一个宏任务执行；
4. 宏任务执行过程中遇到微任务会添加到微任务队列中，待这个宏任务执行完毕后，再去取微任务；如果有微任务，则执行，如果没有，则再取宏任务执行。（每次要执行宏队列里面的一个任务之前，先看微队列里面是否有待执行的任务，如果有则先执行微任务）

```js
setTimeout(() => {
  console.log(0);
}, 0);

new Promise((resolve, reject) => {
  console.log(1);
  resolve();
})
  .then(() => {
    console.log(2); // 这里的回调先挂载在 Promise 实例自身，然后马上被推入微队列，它没有接口请求的延迟
    new Promise((resolve, reject) => {
      console.log(3);
      resolve();
    })
      .then(() => {
        console.log(4);
      })
      .then(() => {
        console.log(5);
      });
  })
  .then(() => {
    console.log(6);
  });

new Promise((resolve, reject) => {
  console.log(7);
  resolve();
}).then(() => {
  console.log(8);
});

// 输出结果： 172384650
```

> 注意这个例子，假设 `getInfo` 接口的返回时间为 500 ms
>
> 当 delay 大于 500 时，输出顺序为 `then` `finally` `setTimeout`（符合预期）
>
> 当 delay 小于 500 时，输出顺序为 `setTimeout` `then` `finally` （⚠️）
>
> 因为当 delay 小于 500 时，假设 delay 为 200
>
> 1. 当 200 ms 过去后，`setTimeout` 的回调被放入宏任务队列；
> 2. 事件循环检查微任务队列，发现为空（此时，`getInfo` 接口未完成，`then` 和 `finally` 中的回调还没有被推入微队列）
> 3. 事件循环处理宏任务队列，执行 `setTimeout` 的回调
> 4. `getInfo` 接口请求最终完成
> 5. `then()` 和 `finally()` 的回调被放入微任务队列并执行

```js
init() {
  getInfo().then((res: any) => {
    console.log('🚀🚀🚀 then: ');
  }).finally(() => {
    console.log('🚀🚀🚀 finally: ');
  });

  setTimeout(() => {
    console.log('🚀🚀🚀 : setTimeout');
  }, delay);
}

init()
```

## 手写 Promise

```js :collapsed-lines
/** 定义 Promise 类*/
class MyPromise {
  // 构造函数：接收一个执行器函数 executor
  constructor(executor) {
    // 初始化 Promise 的状态和值
    this.status = "pending"; // 初始状态：等待中
    this.value = undefined; // 成功值：当 Promise 被 resolve 时存储的值
    this.reason = undefined; // 失败原因：当 Promise 被 reject 时存储的错误信息
    this.onFulfilledCallbacks = []; // 成功回调队列：存储所有 then 方法中注册的成功回调函数
    this.onRejectedCallbacks = []; // 失败回调队列：存储所有 then 方法中注册的失败回调函数

    // 定义 resolve 方法：将 Promise 状态从 pending 变为 fulfilled
    const resolve = (value) => {
      // 如果状态不是 pending，则直接返回，确保 Promise 状态只能改变一次
      if (this.status !== "pending") return;

      // 使用 queueMicrotask 确保回调函数在微任务队列中执行，模拟 Promise 的异步特性
      queueMicrotask(() => {
        // 如果 resolve 的值是一个 Promise 实例，则需要等待该 Promise 完成
        if (value instanceof MyPromise) {
          value.then(resolve, reject);
        } else {
          // 将状态改为 fulfilled，并存储成功值
          this.status = "fulfilled";
          this.value = value;
          // 执行所有注册的成功回调函数
          this.onFulfilledCallbacks.forEach((fn) => fn(value));
        }
      });
    };

    // 定义 reject 方法：将 Promise 状态从 pending 变为 rejected
    const reject = (reason) => {
      // 如果状态不是 pending，则直接返回，确保 Promise 状态只能改变一次
      if (this.status !== "pending") return;

      // 使用 queueMicrotask 确保回调函数在微任务队列中执行
      queueMicrotask(() => {
        // 将状态改为 rejected，并存储失败原因
        this.status = "rejected";
        this.reason = reason;
        // 执行所有注册的失败回调函数
        this.onRejectedCallbacks.forEach((fn) => fn(reason));
      });
    };

    // 执行 executor 函数，并传入 resolve 和 reject 方法
    try {
      executor(resolve, reject);
    } catch (err) {
      // 如果 executor 执行过程中抛出异常，则调用 reject 方法
      reject(err);
    }
  }

  /**
   * then 方法：注册 Promise 状态改变后的回调函数
   * 实例方法：通过 Promise 实例调用，例如 promise.then(onFulfilled, onRejected)
   *
   * @param {Function} onFulfilled - 成功时的回调函数，接收 Promise 的解决值
   * @param {Function} onRejected - 失败时的回调函数，接收 Promise 的拒绝原因
   * @returns {MyPromise} 返回一个新的 Promise，实现链式调用
   *
   * 使用示例：
   * new MyPromise(resolve => resolve(42))
   *   .then(value => value * 2)
   *   .then(value => console.log(value)) // 输出: 84
   */
  then(onFulfilled, onRejected) {
    // 返回一个新的 Promise，实现链式调用
    return new MyPromise((resolve, reject) => {
      // 定义处理成功的回调函数
      const handleFulfilled = (value) => {
        try {
          // 如果 onFulfilled 是一个函数，则执行它并处理其返回值
          if (typeof onFulfilled === "function") {
            const result = onFulfilled(value);
            // 处理 then 方法返回的 Promise 或其他值
            resolvePromise(result, resolve, reject);
          } else {
            // 如果 onFulfilled 不是函数，则直接将值传递给下一个 Promise
            resolve(value);
          }
        } catch (err) {
          // 如果回调函数执行过程中抛出异常，则调用 reject 方法
          reject(err);
        }
      };

      // 定义处理失败的回调函数
      const handleRejected = (reason) => {
        try {
          // 如果 onRejected 是一个函数，则执行它并处理其返回值
          if (typeof onRejected === "function") {
            const result = onRejected(reason);
            // 处理 then 方法返回的 Promise 或其他值
            resolvePromise(result, resolve, reject);
          } else {
            // 如果 onRejected 不是函数，则直接将错误传递给下一个 Promise
            reject(reason);
          }
        } catch (err) {
          // 如果回调函数执行过程中抛出异常，则调用 reject 方法
          reject(err);
        }
      };

      // 根据当前 Promise 的状态执行不同的逻辑
      if (this.status === "fulfilled") {
        // 如果当前 Promise 已经是 fulfilled 状态，则异步执行成功回调
        queueMicrotask(() => handleFulfilled(this.value));
      } else if (this.status === "rejected") {
        // 如果当前 Promise 已经是 rejected 状态，则异步执行失败回调
        queueMicrotask(() => handleRejected(this.reason));
      } else {
        // 如果当前 Promise 是 pending 状态，则将回调函数添加到队列中
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
  }

  /**
   * catch 方法：注册 Promise 失败时的回调函数
   * 实例方法：通过 Promise 实例调用，例如 promise.catch(onRejected)
   *
   * @param {Function} onRejected - 失败时的回调函数，接收 Promise 的拒绝原因
   * @returns {MyPromise} 返回一个新的 Promise，实现链式调用
   *
   * 使用示例：
   * new MyPromise((_, reject) => reject(new Error('出错了')))
   *   .catch(err => console.error(err)) // 输出: Error: 出错了
   */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  /**
   * finally 方法：无论 Promise 成功还是失败，都会执行的回调函数
   * 实例方法：通过 Promise 实例调用，例如 promise.finally(callback)
   *
   * @param {Function} callback - 无论成功还是失败都会执行的回调函数
   * @returns {MyPromise} 返回一个新的 Promise，实现链式调用
   *
   * 使用示例：
   * new MyPromise(resolve => resolve(42))
   *   .then(value => console.log(value)) // 输出: 42
   *   .finally(() => console.log('完成')) // 输出: 完成
   */
  finally(callback) {
    return this.then(
      // 成功时执行 callback 并返回原值
      (value) => {
        callback();
        return value;
      },
      // 失败时执行 callback 并抛出原错误
      (reason) => {
        callback();
        throw reason;
      }
    );
  }

  /**
   * 静态方法：直接通过类名调用的方法，不需要创建类的实例
   * 例如：MyPromise.resolve(42) 而不是 new MyPromise(...).resolve(42)
   *
   * 静态 resolve 方法：创建一个已解决的 Promise
   * 使用场景：当需要将一个值转换为 Promise 时
   * 示例：MyPromise.resolve(42).then(value => console.log(value)) // 输出: 42
   */
  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  /**
   * 静态 reject 方法：创建一个已拒绝的 Promise
   * 使用场景：当需要创建一个表示错误的 Promise 时
   * 示例：MyPromise.reject(new Error('出错了')).catch(err => console.error(err))
   */
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  /**
   * 静态 all 方法：等待所有 Promise 完成，返回一个包含所有结果的数组
   * 使用场景：当需要并行执行多个异步操作，并等待所有操作完成时
   * 特点：如果任何一个 Promise 失败，整个 all 方法返回的 Promise 也会失败
   * 示例：
   * MyPromise.all([
   *   fetch('/api/users'),
   *   fetch('/api/posts')
   * ]).then(([users, posts]) => console.log(users, posts))
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = []; // 存储所有 Promise 的结果
      let count = 0; // 计数器，记录已完成的 Promise 数量

      // 遍历所有 Promise
      promises.forEach((p, i) => {
        // 确保每个项都是 Promise 实例
        MyPromise.resolve(p).then((value) => {
          // 将结果存储在对应位置，保持顺序
          results[i] = value;
          count++;
          // 当所有 Promise 都完成时，返回结果数组
          if (count === promises.length) {
            resolve(results);
          }
        }, reject); // 如果任何一个 Promise 失败，则整个 all 方法失败
      });
    });
  }

  /**
   * 静态 race 方法：返回第一个完成的 Promise 的结果
   * 使用场景：当需要从多个异步操作中获取最快完成的结果时
   * 特点：无论成功还是失败，只要有一个 Promise 完成，race 方法就会返回其结果
   * 示例：
   * MyPromise.race([
   *   fetch('/api/fast-server'),
   *   fetch('/api/slow-server')
   * ]).then(result => console.log('最快返回的结果:', result))
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      // 遍历所有 Promise
      promises.forEach((p) => {
        // 确保每个项都是 Promise 实例
        MyPromise.resolve(p).then(resolve, reject); // 第一个完成的 Promise 将决定整个 race 的结果
      });
    });
  }
}

/** 内部工具函数：处理 then 方法返回值为 Promise 的情况 */
function resolvePromise(result, resolve, reject) {
  // 如果返回值是 Promise 实例，则等待其完成
  if (result instanceof MyPromise) {
    result.then(resolve, reject);
  } else {
    // 如果返回值不是 Promise 实例，则直接传递给下一个 Promise
    resolve(result);
  }
}
```
