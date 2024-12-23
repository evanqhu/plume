---
title: 浏览器缓存
createTime: 2024/12/23 11:37:02
permalink: /others/xqmqu9al/
---

缓存策略：根据资源响应头中的 `Cache-Control` 字段使用强缓存，如果没有强缓存或缓存失败，则尝试使用协商缓存，优先使用 `ETag` 协商，其次使用 `Last-Modified` 协商

缓存策略只在 get 请求范围内讨论

## 1️⃣ 强缓存

- 浏览器直接从缓存中读取资源，不与服务器通信
- 它基于 **HTTP 响应头**中的 `Cache-Control` 字段
  - `Cache-Control`：更灵活的缓存控制，通过多个指令 (如 max-age、no-cache、no-store 等) 来控制缓存行为
  - `Expires`：一个表示资源的到期时间。在此时间之前，浏览器会直接使用缓存，不请求服务器 (已淘汰)
- 状态码为 `200 OK (from disk cache)`

```js
// 不使用强缓存
Cache-Control: no-cache // 相当于 max-age=0，资源在浏览器有备份，但是不直接使用，允许协商缓存使用

// 强缓存，十分钟内请求该资源，直接使用浏览器的缓存
Cache-Control: max-age=600 // 指定缓存有效期，单位是秒
Date: <当前时间>
Expires: <max-age 后的时间>
```

## 2️⃣ 协商缓存

- 基于响应头中的 `Last-Modified` 或 `ETag` 字段进行判断
- 当强缓存过期后
- 浏览器会向服务器发送请求，询问资源是否修改过
  - 浏览器检查**响应头**中的 `Last-modified/ETag` 字段
  - 浏览器在**请求头**中携带 `If-Modified-Since/If-Not-Match` 字段，值就是 `Last-modified/ETag` 的值
  - `Last-modified` 字段记录当前资源上一次的修改时间；`ETag` 字段记录当前资源的哈希值
  - `Last-modified` 对应 `If-Modified-Since`；`ETag` 对应 `If-Not-Match`
- 服务器比较该资源最新修改时间，如果资源没有变动，则不返回资源，响应 `304 (Not Modified)`
- 浏览器重新启用强缓存，并更新有效期

`Last-Modified` 指的是文件的最后修改时间

`ETag` 是文件的唯一标识符，只要文件内容不变，这个标识符就不会变

> `ETag` 比 `Last-Modified` 好的原因：
>
> - `Last-Modified` 是文件的最后修改时间，如果文件内容没有变，修改时间变了，服务器仍会认为资源已更改
> - `Last-Modified` 的时间戳只能精确到秒
> - 只要资源内容不变，`ETag` 值就不变
