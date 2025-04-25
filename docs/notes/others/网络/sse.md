---
title: SSE
createTime: 2025/04/23 13:45:35
permalink: /others/w83sqny6/
---

Server-Sent Events (SSE) 是一种服务器推送技术，允许服务器通过 HTTP 连接向客户端发送实时更新。与 WebSocket 不同，SSE 是单向的，只支持服务器向客户端发送数据。

::: note
<https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events/Using_server-sent_events>

<https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html>
:::

## 主要特点

1. **单向通信**：服务器到客户端的单向数据流
2. **基于 HTTP**：使用标准的 HTTP 协议
3. **自动重连**：内置自动重连机制
4. **轻量级**：相比 WebSocket 更轻量
5. **简单易用**：API 简单，易于实现

## 使用场景

- 实时新闻推送
- 股票价格更新
- 社交媒体动态
- 实时日志监控
- 在线聊天应用（仅接收消息）

## 浏览器支持

现代浏览器基本都支持 SSE，包括：

- Chrome 6+
- Firefox 6+
- Safari 5+
- Edge 79+
- Opera 11+

## 基本实现

### 服务器端（Node.js 示例）

```javascript
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // 设置跨域
  res.setHeader("Access-Control-Allow-Origin", "*");

  // 响应 index.html
  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, (_, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });

    return;
  }

  // 响应 SSE
  if (req.method === "GET" && req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // 模拟服务器推送数据
    let count = 0;
    const interval = setInterval(() => {
      if (count > 10) {
        res.write("event: end\ndata: 结束\n\n");
        clearInterval(interval);
      } else {
        res.write(`data: 当前时间：${new Date().toLocaleString()} 计数：${count}\n\n`);
        count++;
      }
    }, 1000);

    // 客户端断开连接时，停止推送
    req.on("close", () => {
      console.log("client disconnected");
      clearInterval(interval);
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### 客户端实现

```javascript
const eventSource = new EventSource("http://localhost:3000/events");
eventSource.onmessage = (event) => {
  console.log(event.data);
  const app = document.querySelector(".app");
  app.innerHTML += event.data + "<br>";
};
eventSource.onerror = (event) => {
  console.log(event);
};
eventSource.addEventListener("end", (event) => {
  const app = document.querySelector(".app");
  app.innerHTML += event.data + "<br>";
  // eventSource.close();
});
```

## 事件格式

SSE 消息格式如下：

```
event: customEvent
data: {"message": "Hello World"}
id: 123
retry: 10000

```

- `event`: 事件类型（可选）
- `data`: 消息内容
- `id`: 消息 ID（可选）
- `retry`: 重连时间（毫秒，可选）

## 与 WebSocket 的比较

| 特性       | SSE  | WebSocket  |
| ---------- | ---- | ---------- |
| 通信方向   | 单向 | 双向       |
| 协议       | HTTP | 自定义协议 |
| 连接开销   | 低   | 高         |
| 实现复杂度 | 简单 | 复杂       |
| 浏览器支持 | 良好 | 优秀       |
| 实时性     | 高   | 更高       |

## 最佳实践

1. 设置适当的 `retry` 时间
2. 使用 `id` 字段实现消息追踪
3. 实现错误处理和重连机制
4. 考虑使用心跳机制保持连接
5. 注意跨域问题（CORS）

## 注意事项

1. 每个浏览器对 SSE 连接数有限制
2. 某些代理服务器可能会中断长连接
3. 需要处理连接断开的情况
4. 注意内存泄漏问题
5. 考虑使用 polyfill 支持旧版浏览器

## 总结

SSE 是一个简单高效的服务器推送技术，特别适合需要服务器向客户端推送数据的场景。虽然功能不如 WebSocket 强大，但在特定场景下是一个很好的选择。
