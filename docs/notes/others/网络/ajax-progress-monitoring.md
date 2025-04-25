---
title: Ajax 进度监控
createTime: 2025/04/23 17:50:27
permalink: /others/k90jlm9j/
---

使用 XHR 可以实现请求和响应进度的监控，Fetch 只能实现请求进度的监控。

::: note
<https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/progress_event>
:::

## 两种原生请求方法的区别

| 功能点                    | XHR      | Fetch    |
| ------------------------- | -------- | -------- |
| 基本的请求能力            | ✅       | ✅       |
| 基本的获取响应能力        | ✅       | ✅       |
| 监控请求进度              | ✅       | ❌       |
| 监控响应进度              | ✅       | ✅       |
| Service Worker 中是否可用 | ❌       | ✅       |
| 控制 cookie 的携带        | ✅       | ✅       |
| 控制重定向                | ❌       | ✅       |
| 请求取消                  | ✅       | ✅       |
| 自定义 referrer           | ❌       | ✅       |
| 流                        | ❌       | ✅       |
| API 风格                  | Event    | Promise  |
| 活跃度                    | 停止更新 | 不断更新 |

## 响应的进度监控

### 使用 XHR 监控响应和请求进度

```js
export function xhrProgress(options = {}) {
  const { url, method = "GET", onProgress, data = null } = options;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // 初始化请求
    xhr.open(method, url);

    // 设置响应类型为 arraybuffer，这样可以直接处理二进制数据
    // 其他可选值包括：'text', 'json', 'blob', 'document' 等
    xhr.responseType = "arraybuffer";

    // 当请求成功完成时触发的事件处理函数
    xhr.onload = function () {
      console.log("响应完成");
    };

    // 请求错误时的处理
    xhr.onerror = function () {
      reject(new Error("Network error"));
    };

    // 监控请求进度
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        console.log(`请求进度: ${percent}%`);
      }
    };

    // 监控响应进度
    xhr.onprogress = function (event) {
      if (event.lengthComputable) {
        // 计算下载进度的百分比
        // event.loaded: 已下载的字节数
        // event.total: 总字节数
        const percent = Math.round((event.loaded / event.total) * 100);
        console.log(`响应进度: ${percent}%`);
        onProgress?.({
          loaded: event.loaded,
          total: event.total,
        });
      }
    };

    // 发送请求
    xhr.send(data);
  });
}
```

### 使用 Fetch 监控响应进度

- 服务器会在响应头的 `Content-Length` 中指定响应体的总长度

```js
export function fetchProgress(options = {}) {
  const { url, method = "GET", onProgress, data = null } = options;

  return new Promise(async (resolve) => {
    // 第一个 await 等待响应头
    const response = await fetch(url, {
      method,
      body: data,
    });
    // 从响应头中获取总长度
    const total = +response.headers.get("Content-Length");
    // 创建一个流式读取器，用于读取响应体
    const reader = response.body.getReader();
    // 用于存储已下载的字节数
    let loaded = 0;
    // 创建一个文本解码器，用于解码响应体
    const decoder = new TextDecoder();
    // 用于存储响应体
    let body = "";

    while (true) {
      // 异步读取响应体
      const { done, value } = await reader.read();
      // 如果读取完成，则退出循环
      if (done) {
        break;
      }
      // 更新已下载的字节数
      loaded += value.length;
      console.log("已下载的字节数", loaded);
      console.log("总的字节数: ", total);

      // 解码响应体
      const text = decoder.decode(value, { stream: true });
      // 更新响应体
      body += text;
      // 调用 onProgress 回调函数，传递已下载的字节数和总长度
      onProgress?.({ loaded, total });
    }
    // 返回响应体
    resolve(body);
  });
}
```
