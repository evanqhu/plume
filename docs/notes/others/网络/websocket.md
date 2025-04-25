---
title: WebSocket
createTime: 2025/04/23 10:24:05
permalink: /others/qi9ukpqx/
---

WebSocket 是 HTML5 提供的一种在单个 TCP 连接上进行全双工通讯的协议。

::: note
<https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API>

<https://www.ruanyifeng.com/blog/2017/05/websocket.html>
:::

## 基本概念

WebSocket 是一种网络传输协议，位于 OSI 模型的应用层。它使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。

## 主要特点

1. 全双工通信：客户端和服务器可以同时发送和接收数据
2. 低延迟：建立连接后，数据传输延迟低
3. 节省资源：相比 HTTP 轮询，WebSocket 减少了不必要的网络开销
4. 持久连接：一次握手，持续连接
5. 支持二进制和文本数据

## 使用场景

1. 实时聊天应用
2. 在线游戏
3. 股票交易系统
4. 实时协作工具
5. 物联网设备监控

## 基本用法

### 客户端代码示例

```javascript
// 创建 WebSocket 连接
const socket = new WebSocket("ws://example.com/socket");

// 连接建立时触发
socket.onopen = function () {
  console.log("连接已建立");
  socket.send("Hello Server!");
};

// 接收消息时触发
socket.onmessage = function (event) {
  console.log("收到消息:", event.data);
};

// 连接关闭时触发
socket.onclose = function () {
  console.log("连接已关闭");
};

// 发生错误时触发
socket.onerror = function (error) {
  console.error("发生错误:", error);
};
```

### 服务器端代码示例（Node.js）

```javascript
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("新的客户端连接");

  ws.on("message", function incoming(message) {
    console.log("收到消息:", message);
    // 广播消息给所有客户端
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
```

## 注意事项

### 1. 连接断开和重连机制

WebSocket 连接可能会因为网络问题、服务器重启等原因断开，需要实现自动重连机制。

```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isManualClose = false; // 标记是否是手动关闭
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.isManualClose = false; // 重置手动关闭标记

    this.socket.onopen = () => {
      console.log("连接成功");
      this.reconnectAttempts = 0;
    };

    this.socket.onclose = (event) => {
      console.log("连接断开");

      // 检查是否是手动关闭
      if (this.isManualClose) {
        console.log("手动关闭连接，不进行重连");
        return;
      }

      // 非手动关闭，尝试重连
      console.log("连接异常断开，尝试重连...");
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error("连接错误:", error);
    };
  }

  // 手动关闭连接
  close() {
    this.isManualClose = true;
    if (this.socket) {
      this.socket.close(1000, "用户手动关闭");
    }
  }

  reconnect() {
    if (this.isManualClose) {
      console.log("手动关闭的连接，不进行重连");
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`第 ${this.reconnectAttempts} 次重连尝试`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("重连失败，已达到最大重试次数");
    }
  }
}

// 使用示例
const client = new WebSocketClient("ws://example.com/socket");

// 正常关闭连接（不会触发重连）
function closeConnection() {
  client.close();
}

// 监听网络状态变化
window.addEventListener("online", () => {
  if (!client.isManualClose && client.socket.readyState === WebSocket.CLOSED) {
    client.reconnect();
  }
});

// 监听页面卸载
window.addEventListener("beforeunload", () => {
  client.close();
});
```

### 2. 消息大小限制

WebSocket 协议本身没有消息大小限制，但浏览器和服务器可能有默认限制。需要根据实际情况处理大消息。

```javascript
// 分片发送大消息
function sendLargeMessage(socket, message) {
  const chunkSize = 1024; // 1KB
  for (let i = 0; i < message.length; i += chunkSize) {
    const chunk = message.slice(i, i + chunkSize);
    socket.send(chunk);
  }
}

// 接收分片消息
let receivedChunks = [];
socket.onmessage = function (event) {
  receivedChunks.push(event.data);
  if (event.data.length < chunkSize) {
    const completeMessage = receivedChunks.join("");
    console.log("收到完整消息:", completeMessage);
    receivedChunks = [];
  }
};
```

### 3. 安全性考虑

使用 WSS（WebSocket Secure）确保通信安全。

```javascript
// 客户端
const secureSocket = new WebSocket("wss://example.com/socket");

// 服务器端（Node.js）
const https = require("https");
const fs = require("fs");
const WebSocket = require("ws");

const server = https.createServer({
  cert: fs.readFileSync("cert.pem"),
  key: fs.readFileSync("key.pem"),
});

const wss = new WebSocket.Server({ server });
```

### 4. 心跳机制

保持连接活跃，检测连接状态。

```javascript
// 客户端心跳
function setupHeartbeat(socket) {
  const interval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "ping" }));
    }
  }, 30000); // 每30秒发送一次心跳

  socket.onclose = () => {
    clearInterval(interval);
  };
}

// 服务器端心跳处理
wss.on("connection", function connection(ws) {
  let timeout = null;

  function heartbeat() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      ws.terminate();
    }, 30000 + 1000); // 30秒无响应则断开连接
  }

  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === "ping") {
      ws.send(JSON.stringify({ type: "pong" }));
      heartbeat();
    }
  });
});
```

### 5. 跨域问题

处理 WebSocket 的跨域请求。

```javascript
// 服务器端配置（Node.js）
const wss = new WebSocket.Server({
  port: 8080,
  verifyClient: (info, callback) => {
    // 检查 origin
    const origin = info.origin;
    if (origin === "https://example.com") {
      callback(true);
    } else {
      callback(false, 401, "Unauthorized");
    }
  },
});
```

## 与 HTTP 轮询的对比

| 特性       | WebSocket | HTTP 轮询 |
| ---------- | --------- | --------- |
| 连接方式   | 持久连接  | 短连接    |
| 延迟       | 低        | 高        |
| 服务器负载 | 低        | 高        |
| 带宽消耗   | 低        | 高        |
| 实时性     | 好        | 差        |

## WebSocket API 详解

### 1. 构造函数

```javascript
const socket = new WebSocket(url[, protocols]);
```

- `url`: WebSocket 服务器的 URL
- `protocols`: 可选的子协议数组

### 2. 属性

```javascript
// 连接状态
socket.readyState; // 0: 连接中, 1: 已连接, 2: 关闭中, 3: 已关闭

// 缓冲数据量
socket.bufferedAmount;

// 协议
socket.protocol;

// 扩展
socket.extensions;
```

### 3. 方法

```javascript
// 发送数据
socket.send(data);

// 关闭连接
socket.close([code[, reason]]);
```

### 4. 事件

```javascript
// 连接建立
socket.onopen = function (event) {
  console.log("连接已建立");
};

// 接收消息
socket.onmessage = function (event) {
  console.log("收到消息:", event.data);
};

// 连接关闭
socket.onclose = function (event) {
  console.log("连接已关闭", event.code, event.reason);
};

// 发生错误
socket.onerror = function (error) {
  console.error("发生错误:", error);
};
```

### 5. 二进制数据传输

```javascript
// 发送二进制数据
const arrayBuffer = new ArrayBuffer(8);
socket.send(arrayBuffer);

// 发送 Blob 数据
const blob = new Blob(["Hello World"]);
socket.send(blob);

// 接收二进制数据
socket.binaryType = "arraybuffer"; // 或 'blob'
socket.onmessage = function (event) {
  if (event.data instanceof ArrayBuffer) {
    // 处理 ArrayBuffer
  } else if (event.data instanceof Blob) {
    // 处理 Blob
  }
};
```

## WebSocketClient 使用说明

### 基本用法

```javascript
// 创建 WebSocketClient 实例
const client = new WebSocketClient("ws://example.com/socket");

// 建立连接
client.connect();

// 发送消息
client.socket.send("Hello Server!");

// 接收消息
client.socket.onmessage = function (event) {
  console.log("收到消息:", event.data);
};
```

### 完整示例

```javascript
// 创建 WebSocketClient 实例
const client = new WebSocketClient("ws://example.com/socket");

// 连接建立后的处理
client.socket.onopen = function () {
  console.log("连接已建立");

  // 发送消息
  client.socket.send(
    JSON.stringify({
      type: "message",
      content: "Hello Server!",
    })
  );
};

// 接收消息的处理
client.socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log("收到消息:", data);

  // 根据消息类型处理
  switch (data.type) {
    case "message":
      console.log("普通消息:", data.content);
      break;
    case "notification":
      console.log("通知:", data.content);
      break;
    case "error":
      console.error("错误:", data.message);
      break;
  }
};

// 错误处理
client.socket.onerror = function (error) {
  console.error("发生错误:", error);
};

// 连接关闭处理
client.socket.onclose = function (event) {
  console.log("连接已关闭", event.code, event.reason);
};

// 开始连接
client.connect();
```

### 高级用法

```javascript
// 自定义重连参数
const client = new WebSocketClient("ws://example.com/socket", {
  maxReconnectAttempts: 10, // 最大重连次数
  reconnectDelay: 2000, // 初始重连延迟（毫秒）
  reconnectDelayMultiplier: 2, // 重连延迟倍数
});

// 手动重连
client.reconnect();

// 手动关闭连接
client.socket.close();

// 检查连接状态
if (client.socket.readyState === WebSocket.OPEN) {
  console.log("连接已建立");
} else if (client.socket.readyState === WebSocket.CONNECTING) {
  console.log("正在连接...");
} else if (client.socket.readyState === WebSocket.CLOSING) {
  console.log("正在关闭...");
} else if (client.socket.readyState === WebSocket.CLOSED) {
  console.log("连接已关闭");
}
```

### 实际应用场景

1. 聊天应用

```javascript
const chatClient = new WebSocketClient("ws://chat.example.com");

chatClient.socket.onopen = function () {
  // 发送登录信息
  chatClient.socket.send(
    JSON.stringify({
      type: "login",
      username: "user123",
      token: "auth_token",
    })
  );
};

chatClient.socket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  if (message.type === "chat") {
    // 显示聊天消息
    displayMessage(message.sender, message.content);
  }
};

// 发送聊天消息
function sendChatMessage(content) {
  if (chatClient.socket.readyState === WebSocket.OPEN) {
    chatClient.socket.send(
      JSON.stringify({
        type: "chat",
        content: content,
      })
    );
  }
}
```

2. 实时数据监控

```javascript
const monitorClient = new WebSocketClient("ws://monitor.example.com");

monitorClient.socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  updateDashboard(data);
};

// 订阅特定数据
function subscribeToMetric(metricId) {
  if (monitorClient.socket.readyState === WebSocket.OPEN) {
    monitorClient.socket.send(
      JSON.stringify({
        type: "subscribe",
        metricId: metricId,
      })
    );
  }
}
```

### 注意事项

1. 确保在页面卸载时关闭连接

```javascript
window.addEventListener("beforeunload", function () {
  client.socket.close();
});
```

2. 处理网络状态变化

```javascript
window.addEventListener("online", function () {
  if (client.socket.readyState === WebSocket.CLOSED) {
    client.reconnect();
  }
});
```

3. 错误处理和重试策略

```javascript
client.socket.onerror = function (error) {
  console.error("连接错误:", error);
  // 可以在这里添加自定义的错误处理逻辑
  if (error.code === "ECONNREFUSED") {
    // 处理连接被拒绝的情况
  }
};
```

### 区分连接断开原因

```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isManualClose = false; // 标记是否是手动关闭
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.isManualClose = false; // 重置手动关闭标记

    this.socket.onopen = () => {
      console.log("连接成功");
      this.reconnectAttempts = 0;
    };

    this.socket.onclose = (event) => {
      console.log("连接断开");

      // 检查是否是手动关闭
      if (this.isManualClose) {
        console.log("手动关闭连接，不进行重连");
        return;
      }

      // 非手动关闭，尝试重连
      console.log("连接异常断开，尝试重连...");
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error("连接错误:", error);
    };
  }

  // 手动关闭连接
  close() {
    this.isManualClose = true;
    if (this.socket) {
      this.socket.close(1000, "用户手动关闭");
    }
  }

  // 强制关闭连接（不发送关闭帧）
  forceClose() {
    this.isManualClose = true;
    if (this.socket) {
      this.socket.close();
    }
  }

  reconnect() {
    if (this.isManualClose) {
      console.log("手动关闭的连接，不进行重连");
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`第 ${this.reconnectAttempts} 次重连尝试`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("重连失败，已达到最大重试次数");
    }
  }
}

// 使用示例
const client = new WebSocketClient("ws://example.com/socket");

// 正常关闭连接（不会触发重连）
function closeConnection() {
  client.close();
}

// 强制关闭连接（不会触发重连）
function forceCloseConnection() {
  client.forceClose();
}

// 监听网络状态变化
window.addEventListener("online", () => {
  if (!client.isManualClose && client.socket.readyState === WebSocket.CLOSED) {
    client.reconnect();
  }
});

// 监听页面卸载
window.addEventListener("beforeunload", () => {
  client.close();
});
```

### WebSocket 关闭代码说明

WebSocket 关闭时会返回一个关闭代码（Close Code），常见的代码包括：

- 1000: 正常关闭
- 1001: 端点离开（如服务器关闭或浏览器导航到其他页面）
- 1002: 协议错误
- 1003: 接收到不支持的数据类型
- 1005: 无状态码（未发送关闭帧）
- 1006: 异常关闭（未发送关闭帧）
- 1007: 数据格式不一致
- 1008: 策略违规
- 1009: 消息太大
- 1010: 客户端需要扩展
- 1011: 服务器遇到意外情况
- 1015: TLS 握手失败

```javascript
// 根据关闭代码处理不同情况
client.socket.onclose = function (event) {
  switch (event.code) {
    case 1000:
      console.log("正常关闭");
      break;
    case 1001:
      console.log("端点离开");
      break;
    case 1006:
      console.log("异常关闭，可能是网络问题");
      if (!client.isManualClose) {
        client.reconnect();
      }
      break;
    default:
      console.log(`未知关闭代码: ${event.code}`);
      if (!client.isManualClose) {
        client.reconnect();
      }
  }
};
```
