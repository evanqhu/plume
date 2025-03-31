---
title: Cookie
createTime: 2025/03/31 13:21:55
permalink: /engineering/k3jt8fn6/
---

## 接口跨域问题

### 问题 1️⃣

前端域名：`example.com`

接口域名：`api.example.com`

1. 权限相关接口，需要在 Headers 中携带 `cookie` 进行鉴权
2. 由于前后端不同源，请求时需设置：`withCredentials: true` 或 `credentials: include`，这样才能把 `cookie` 带过去
3. 后端设置 `Access-Control-Allow-Origin: '*'`。Credential 不支持这种设置，必须是具体的域名，导致 [CORS 错误](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials)
4. 如果保持后端 `Access-Control-Allow-Origin: '*'` 不变，则无法使用 Credential，`cookie` 无法被携带到后端，无法鉴权

### 解决方案

1️⃣ 服务端代理

前端对所有接口请求都通过 Node 服务器进行一次转发

如：在 Nuxt 中，可以对所有环境都通过 Nitro 服务器作为代理发送请求

2️⃣ 使用 Nginx

使用 Nginx 转发请求

3️⃣ 后端使用 JWT (推荐)

后端不使用 Headers 中的 cookie 来鉴权，而是使用自定义的 Headers 头，如 Authorization：

`Authorization: Bearer <token>`

### 问题 2️⃣

前端域名 1：`example.com`
前端域名 2：`sample.com`

接口域名：`api.example.com`

1. 后端设置了 `Access-Control-Allow-Origin: '具体域名'`
2. 前端使用 `withCredentials: true` 或 `credentials: include`
3. 但是接口却拿不到 token

### 原因分析

前端调用 `api.example.com/login` 登录接口，该接口返回一个 set-cookie，该 cookie 只能被 `api.example.com` 访问，其他域名无法访问

`Set-Cookie: satoken=xxxx; Max-Age=86400; Path=/`

对于域名 1 来说，该 cookie 可以正常种下，之后请求也能正常携带；但是对于 域名 2 来说，由于域名 2 和后端接口不**同站**，所以该 cookie 无法被种下，之后也无法携带到后端

### 解决方案

使用自定义 Header 携带 Token，但仍需要使用 Cookie 作为中介

1. 调用登录接口时，接口会返回 `tokenName` 和 `tokenValue`，使用 `useCookie()` 将 `tokenName` 和 `tokenValue` 存到 `cookie` 中

```ts
const login = async (data: { ggToken: string }) => {
  const res = await api.userApi.login(data);
  if (res?.tokenName && res?.tokenValue) {
    TOKEN_KEY.value = res.tokenName;
    // 设置 token
    useCookie(TOKEN_KEY.value, {
      maxAge: 60 * 60 * 24 * 30, // 30 天
    }).value = res.tokenValue;
  }
};
```

2. 封装请求方法时，不设置 Credential，直接在 Header 中添加 `Authorization`

```ts
export const customFetch = $fetch.create({
  onRequest({ options }) {
    const { TOKEN_KEY } = useUserStore();
    const userAuth = useCookie(TOKEN_KEY);
    if (userAuth.value) {
      options.headers.set('Authorization', `Bearer ${userAuth.value}`)
      // options.headers.set(TOKEN_KEY, userAuth.value);
    }
  },
});
```

3. 如上操作之后，后端通过 Authorization Header 来鉴权，避免使用 Cookie；前端 Cookie 仅用于登录时手动种下，后续请求时通过 Header 携带，无需关系后端接口的 Set-Cookie 设置

::: note

1. 接口返回的 `set-cookie` 也会种下一个 `cookie`，种下的 `cookie` 的 Domain 是 `api.example.com`，且不一定能种成功，因为可能是跨站
2. 使用 `useCookie()` 存储的 `cookie` 的 Domain 是当前前端域名，这个基本上都能种成功

:::
