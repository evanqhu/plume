---
title: 绝对路径和相对路径
createTime: 2024/12/23 11:40:22
permalink: /others/lcqjwgr6/
---

::: note
前端开发中**路径**一般指的是 **URL 地址**
:::

## 绝对路径

> 开头必有协议名或 `/`

1️⃣ 直接书写完整的 URL 地址，包含 **协议名**、**域名**、**端口号**、**路径**

```html
<!-- 完整的 URL -->
<a href="http://localhost:5500/home/demo">link</a>
```

2️⃣ 省略完整 URL 的部分内容

- 省略协议（直接使用当前页面的协议）
- 省略域名（直接使用当前页面的域名）
- 省略端口号（直接使用当前页面的端口号）

```html
<!-- 省略协议 -->
<a href="//localhost:5500/home/demo">link</a>

<!-- 省略端口号 -->
<a href="http://localhost/home/demo">link</a>

<!-- 省略协议、域名和端口号 -->
<a href="/home/demo">link</a>
```

## 相对路径

> 相对路径相对的是当前的 path 部分，以 `.`` 开头或直接单词开头

假如当前页面的 URL 是 `http://localhost:5500/a/b/c`，当前页面的 path 部分即为 `/a/b/c`

1️⃣ 以 `./` 开头，或者省略 `./` （`./` 表示当前页面的 path 部分中最后一个 `/` 之前的部分）

```html
<!-- 完整的 URL -->
<a href="./relative/path">link</a>
<a href="relative/path">link</a>
```

2️⃣ 以 `../` 开头（`../` 表示当前页面的 path 部分中倒数第二个 `/` 之前的部分）

```html
<!-- 完整的 URL -->
<a href="../relative/path">link</a>
```

## 对比

假设当前页面的 URL 是 `http://localhost:5500/a/b/c`

- 书写绝对路径时，资源的 URL 跟 path 没有关系

```html
<!-- 绝对路径：省略协议、域名和端口号 -->
<a href="/home/demo">link</a>
```

转换后实际的 URL 为 `http://localhost:5500/home/demo` ，跟 path 无关

- 书写相对路径时，资源的 URL 时相对 path 的

```html
<!-- 相对路径：以 ./ 开头，或者省略 ./ -->
<a href="./home/demo">link</a>
<a href="home/demo">link</a>
```

转换后实际的 URL 为 `http://localhost:5500/a/b/home/demo`
