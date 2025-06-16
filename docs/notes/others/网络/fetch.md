---
title: Fetch
createTime: 2025/04/23 14:03:37
permalink: /others/5l8v161a/
---

为什么 `fetch` 需要两个 `await`？
::: note
<https://tomontheinternet.com/why-two-awaits>
<https://github.com/tom-on-the-internet/fetch-demonstration>
:::

## 基本用法

```javascript
const response = await fetch(url);
const data = await response.json();
```

## 为什么需要两个 await？

在 Fetch API 中，我们经常会看到两个 `await`，原因如下：

1. **第一个 await：获取 Response 对象**

   - `fetch()` 返回一个 Promise，该 Promise 解析为 Response 对象
   - 第一个 `await` 等待网络请求完成，获取 Response 对象
   - Response 对象包含了 HTTP 响应的元数据（状态码、头部等）

2. **第二个 await：解析响应体**
   - `response.json()` 返回一个 Promise，该 Promise 解析为 JSON 数据
   - 第二个 `await` 等待响应体被完全读取和解析
   - 解析后的数据才是我们真正需要的内容

## 为什么不能合并成一个 await？

```javascript
// 错误示例
const data = await fetch(url).json(); // 这行代码会报错
```

不能这样写的原因是：

- `fetch()` 返回的是 Response 对象，而不是 Promise
- 必须先等待 Response 对象可用，才能调用其上的方法
- 需要分两步：先获取 Response，再解析数据

## 正确的写法

```javascript
// 方法一：分步处理
const response = await fetch(url);
const data = await response.json();

// 方法二：链式调用
const data = await (await fetch(url)).json();
```

## 注意事项

1. **错误处理**

   - 建议使用 try-catch 处理可能的错误
   - 网络请求和 JSON 解析都可能失败

2. **性能考虑**

   - 两个 await 意味着两个异步操作
   - 如果不需要 Response 的元数据，可以直接链式调用

3. **其他响应格式**
   - 除了 `json()`，还有 `text()`、`blob()` 等方法
   - 每种方法都需要单独的 await

## 示例

::: code-tabs
@tab server.js

```js
const http = require("http");
const fs = require("fs");
const path = require("path");

/**
 * 一个简单的服务器，可以返回网页或流式传输 JSON 数据到客户端
 */
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 返回 HTML 页面
  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, (_, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });

    return;
  }

  // 返回 JSON 数据，但是很慢
  if (req.method === "GET" && req.url === "/json") {
    res.writeHead(200, { "Content-Type": "application/json" });

    // 设置可读流
    const filePath = path.join(__dirname, "data.json");
    const stream = fs.createReadStream(filePath, { encoding: "utf8" });

    // 每次读取一个字节（字符）并发送给客户端
    stream.on("readable", function () {
      const interval = setInterval(() => {
        const chunk = stream.read(1);
        if (chunk !== null) {
          res.write(chunk);
        } else {
          clearInterval(interval);
          res.end();
        }
      }, 2); // <--- 故意设置得很慢！
    });

    return;
  }

  // 请求的资源不存在
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}/`);
});
```

@tab index.html

```html
<!-- 一个展示 fetch 如何缓慢流式传输请求体的网页 -->
<html lang="zh">
  <body>
    <h1>为什么我们需要 await json？</h1>
    <div>
      <div id="fetch-json-function-box" class="function-box">
        点击这个按钮将运行下面的函数。你需要在控制台中查看结果。<br /><br />
      </div>
      <button id="fetch-json">获取 JSON</button>
    </div>
    <hr />
    <div>
      <div id="fetch-stream-function-box" class="function-box"></div>
      <button id="fetch-stream">流式获取 JSON</button>
      <div class="output-box">...内容将在这里流式显示...</div>
    </div>
  </body>
  <script>
    // 等待指定毫秒数的辅助函数
    async function wait(ms) {
      return new Promise((res) => setTimeout(res, ms));
    }

    // 使用 fetch 获取 JSON 数据
    const fetchJson = async function () {
      console.log("正在发送请求");
      let response = await fetch("/json");
      console.log("已获取响应头，正在等待响应体");
      let myObject = await response.json();
      console.log("已将 JSON 转换为对象");
      console.log(myObject);
    };

    // 使用流式方式获取 JSON 数据
    const fetchStream = async function () {
      outputBox.textContent = "";
      let response = await fetch("/json");
      const decoder = new TextDecoder("utf-8");
      for await (const value of response.body) {
        const chunk = decoder.decode(value);
        outputBox.textContent += chunk;
      }
    };

    // 获取 DOM 元素
    let fetchJsonButton = document.getElementById("fetch-json");
    let fetchStreamButton = document.getElementById("fetch-stream");
    let fetchJsonFunctionBox = document.getElementById("fetch-json-function-box");
    let fetchStreamFunctionBox = document.getElementById("fetch-stream-function-box");
    let outputBox = document.querySelector(".output-box");

    // 向用户展示函数内容
    fetchJsonFunctionBox.innerText += fetchJson.toString();
    fetchStreamFunctionBox.innerText += fetchStream.toString();

    // 添加点击事件监听器
    fetchJsonButton.addEventListener("click", fetchJson);
    fetchStreamButton.addEventListener("click", fetchStream);
  </script>
</html>
```

:::

## fetch 流式传输和 SSE 的区别

fetch 流式获取数据 和 SSE（Server-Sent Events）虽然都可以实现"流式"地从服务端获取数据，但它们的原理、适用场景和实现方式有明显区别：

### 1. fetch 流式获取数据

- **原理**：fetch 返回的 Response 对象有一个 body 属性，是一个 ReadableStream。你可以用 for await...of 或 reader 逐步读取数据块（chunk），实现"流式"处理。
- **适用场景**：适合需要一次性获取大文件、媒体流、或需要边下边处理的场景（如大 JSON、视频、文件下载等）。
- **数据格式**：可以是任意格式（JSON、文本、二进制等），由服务端决定。
- **连接特性**：fetch 请求是一次性的，数据流完毕后连接关闭。如果需要持续推送，需要客户端不断重新发起请求。
- **实现示例**：

  ```js
  const response = await fetch("/big-data");
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // 处理 value
  }
  ```

### 2. SSE（Server-Sent Events）

- **原理**：SSE 是浏览器内置的事件流协议，使用 EventSource 对象。服务端以 text/event-stream 格式持续推送事件，客户端自动接收。
- **适用场景**：适合服务端主动、持续推送消息给客户端，比如实时通知、消息推送、进度更新等。
- **数据格式**：只能是文本（通常是 UTF-8 编码的 JSON 或字符串），格式固定。
- **连接特性**：SSE 连接是长连接，服务端可以不断推送数据，浏览器断线会自动重连。
- **实现示例**：

  ```js
  const es = new EventSource("/events");
  es.onmessage = (event) => {
    console.log("收到消息:", event.data);
  };
  ```

### 3. 主要区别总结

| 特性       | fetch 流式读取        | SSE (EventSource)        |
| ---------- | --------------------- | ------------------------ |
| 连接类型   | 一次性请求，流式读取  | 长连接，持续推送         |
| 数据格式   | 任意（文本/二进制等） | 仅文本（event-stream）   |
| 断线重连   | 需手动实现            | 浏览器自动重连           |
| 适用场景   | 大文件/流式处理       | 实时消息/事件推送        |
| 浏览器支持 | 新版浏览器支持        | 大部分主流浏览器支持     |
| 服务端实现 | 普通 HTTP 响应        | 需支持 event-stream 协议 |

### 4. 什么时候用哪个？

- **fetch 流式**：需要处理大文件、媒体流、或自定义协议的数据流时。
- **SSE**：需要服务端主动、持续推送消息给前端时（如 AI 消息、实时通知、进度条、聊天消息等）。
