---
title: 项目部署
createTime: 2024/12/21 21:16:06
permalink: /engineering/2ouf27yo/
---

::: note
<https://www.bilibili.com/video/BV19n4y1d7Gr>
:::

## 项目打包

- 我们开发用的脚手架其实就是一个微型服务器，用于支撑开发环境、运行代理服务器等
- 打包完的文件中不存在 `.vue`、`.jsx`、`.less` 等文件，而是纯粹的 `.html`、`.css`、`.js` 等
- 打包后的文件，不再借助脚手架运行，而是需要部署到服务器上运行

::: tip
打包后文件的资源引用路径使用的是**绝对路径**，只是省略了协议域名和端口号，所以需要部署到服务器上才能获取到对应的资源

```html
<script type="module" crossorigin src="/assets/index-DOw98.js"></script>
```

:::

- 打包前，请务必梳理好前端项目的 ajax 封装（请求前缀、代理规则等）

## 本地服务器部署

### 具体操作步骤

#### 1️⃣ 准备一个本地的服务器

本地服务器可以用 Java、Php、Go、Node.js 等语言编写，本教程采用是 Node.js 编写服务器，端口号为 `8088`，且已经配置了 `public` 文件夹为静态资源。

```js
// 引入 express
const express = require("express");
const cors = require("cors");

// 配置端口号
const PORT = 8088;

// 创建 app 服务对象
const app = express();

// 使用 cors 中间件，允许所有来源的跨域请求
app.use(cors());

// 使用静态资源中间件
app.use(express.static(__dirname + "/public"));

// 指定服务器运行的端口号(绑定端口监听)
app.listen(PORT, function (err) {
  if (!err) console.log(`服务器启动成功了: http://localhost:${PORT}`);
  else console.log(err);
});
```

#### 2️⃣ 前端项目打包

具体的打包命令，可以参考 `package.json` 中的 `scripts` 字段配置。打包的结果是生成 `dist` 文件夹。

#### 3️⃣ 将打包结果交给服务器

将打包生成的文件内容，放到服务器的静态资源文件夹中（上文中的 `public` 文件夹）

#### 4️⃣ 测试访问前端项目

浏览器访问：`http://localhost:8088` 即可看到我们的项目，但此时会遇到两个问题：

1. 页面刷新 `404`
2. ajax 请求无法发送

### 👻 解决刷新 404 问题

> 问题分析：当前端路由使用 `history` 模式时，刷新页面，浏览器会将当前地址 path 作为后端路由，请求相应的资源，而不是前端路由，所以会出现 404 问题。

**前端项目的路由，通常分为两种工作模式，分别为：**

#### 1️⃣ hash 模式

`hash` 值又称锚点，通常用于指定网页中的某个位置，例如下面的网址：
`https://www.cctv.com/#SUBD1605080062`，其中的 `#SUBD1605080062` 就是 `hash` 值，`hash` 值只在客户端（如浏览器）中使用，是不会带给服务器的，所以使用 `hash` 模式时，不存在刷新 404 问题。

#### 2️⃣ history 模式

`history` 去掉了 URL 中的 `#` 号，可以让应用的 URL 看起来更美观，带来的问题就是刷新时，会将前端路由携带给后端，而后端没有对应资源的匹配，就出现了 404 问题。

#### 🛠️ 解决方案

1. 将前端路由器工作模式改为 hash 模式 —— 不推荐

2. 让**服务器**在收到未配置的 GET 路由时，都返回 `index.html` 即可

方案二最终其实是把 URL 中的 path，交给了前端路由去处理，具体配置如下：

```js
// 当路径匹配不上时，返回 index.html，此时页面中的 js 开始工作，前端路由生效
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
```

也可以在服务端借助 `connect-history-api-fallback` 中间件完成配置

```js
const history = require("connect-history-api-fallback");
// 使用中间件
app.use(history());
```

> 使用 `connect-history-api-fallback` 可以让配置更灵活，比如 `/login` 临时不需要作为前端路由处理，就可以按照如下方式配置

```js
app.use(
  history({
    verbose: false,
    rewrites: [{ from: /^\/login.*$/, to: (context) => context.parsedUrl.path }],
  })
);
```

### 👻 请求无法发送问题

> 问题分析：脱离脚手架后，就没有了代理服务器，无法转发请求到【提供数据】的服务器。

#### 🛠️ 解决方案

一般在开发前端项目的时候，会使用多个 `.env` 环境变量:

- 在 `.env.development` 开发环境变量中将请求的前缀设置为 `/api`，然后在脚手架中使用代理服务器转发以 `/api` 开头的请求
- 在 `.env.staging` 预发布环境变量中将请求的前缀设置为实际的后端测试服务器地址
- 在 `.env.production` 生产环境变量中将请求的前缀设置为实际的后端生产服务器地址

::: code-tabs
@tab .env.development

```dotenv
# 后端接口公共路径
VITE_BASE_API = '/api'
```

@tab .env.staging

```dotenv
# 后端接口公共路径(正式接口)
VITE_BASE_API = 'https://test.api.example.com'
```

@tab .env.production

```dotenv
# 后端接口公共路径(正式接口)
VITE_BASE_API = 'https://api.example.com'
```

@tab vite.config.ts

```ts
export default defineConfig(({ mode }) => {
  return {
    // 代理服务器
    server: {
      host: true,
      open: true,
      proxy: {
        "/api": {
          target: "http://test.api.example.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
```

:::

#### 其他方案

假如不使用多个环境变量，在生产部署时请求前缀依然为 `/api`，则可以使用以下方案：

在部署前端项目的 Node 服务器 (提供前端静态资源服务) 中借助 `http-proxy-middleware` 中间件配置代理，具体配置如下：

```js
// 引入 createProxyMiddleware
const { createProxyMiddleware } = require("http-proxy-middleware");

// 配置服务端代理中间件
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://api.example.com",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);
```

配置之后，当前的 Node 服务器既作为静态资源服务器，用于部署前端项目；又作为代理服务器，用于转发请求到【提供数据】的服务器。

## nginx 服务器部署

### nginx 简介

Nginx（发音为“engine-x”）是一款高性能的 HTTP 服务器和反向代理服务器，同时也是一个 IMAP/POP3/SMTP 代理服务器。Nginx 最初由 Igor Sysoev 编写，于 2004 年发布。它以其高性能、高稳定性、丰富的功能集和低系统资源消耗而闻名，主要功能有：

1. 反向代理
2. 负载均衡
3. 静态内容服务
4. HTTP/2 支持
5. SSL/TLS 支持
6. 高速缓存

### nginx 配置代理练习

今日头条接口地址：`https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc`
直接向其发送 Ajax 请求会有跨域问题，接下来我们借助 nginx 解决跨域问题

#### 1️⃣ 不过滤前缀

以解决今日头条跨域为例，不干掉前缀 `/hot-event` 配置如下

::: code-tabs
@tab nginx.conf

```nginx
location /hot-event {
  # 设置代理目标
  proxy_pass https://www.toutiao.com;

  # 允许跨域
  add*header 'Access-Control-Allow-Origin' '*';
  add*header 'Access-Control-Allow-Methods' '*';
  add*header 'Access-Control-Allow-Headers' '*';
  add*header 'Access-Control-Expose-Headers' '*';
}
```

:::

前端写法

```js
axios.get("http://localhost:8099/hot-event/hot-board/?origin=toutiao_pc");
```

#### 2️⃣ 过滤前缀

### nginx 部署前端项目

整体思路：让 nginx 充当两个角色，既是**静态内容服务器**，又是**代理服务器**。

#### 1️⃣ 修改 nginx 配置如下，注意 nginx 的根目录最好不是 C 盘

::: code-tabs
@tab nginx.conf

```nginx
# 配置 nginx 根目录 (静态资源服务器)
location / {
  root  D:\dist;
  index index.html index.htm;
}
# 配置代理 (代理服务器)
location /api/ {
  # 设置代理目标
  proxy_pass https://api.example.com/;
}
```

:::

::: tip
通过配置 `/` 可以决定是否去掉请求路径中的 `/api`
:::

::: code-tabs
@tab nginx.conf

```nginx
# 保留路径中的 /api
location /api {
  # 设置代理目标
  proxy_pass https://api.example.com;
}
# 去掉路径中的 /api
location /api/ {
  # 设置代理目标
  proxy_pass https://api.example.com/;
}
```

:::

#### 2️⃣ 修改前端项目，让所有请求都转发给 `/api`，随后重新打包

```js
const request = axios.create({
  baseURL: "/api",
  timeout: 10000,
});
```

#### 3️⃣ 随后直接访问 nginx 服务器即可，例如 nginx 如果运行在 8099 端口，则访问

```sh
http://localhost:8099
```

#### 4️⃣ 随后会遇到刷新 404 问题，追加 nginx 配置来解决

::: code-tabs
@tab nginx.conf

```nginx
# 配置 nginx 根目录 (静态资源服务器)
location / {
  root D:\dist;
  index index.html index.htm;
  try_files $uri $uri/ /index.html; # 解决刷新 404
}
# 配置代理 (代理服务器)
location /api/ {
  # 设置代理目标
  proxy_pass https://api.example.com/;
}
```

:::

## 云服务器部署

我们可以在云服务器上借助 nginx 完成部署，大致流程与本地 nginx 部署一致

1. 关于购买云服务器，可选择：阿里云、腾讯云等
2. 关于操作系统，看个人习惯，Ubuntu、CentOs、RedHat、都不错
3. 购买完成后记得重置密码
4. linux 远程操作软件：Xshell、Xftp
5. 具体配置如下：

- 给服务器安装 nginx

```sh
yum install nginx
```

- 将打包后的前端资源放在：`/var/project` 文件夹中
- 使用 Xftp 配置服务器的 nginx，修改文件：`/etc/nginx/nginx.config`

::: code-tabs
@tab nginx.config

```nginx :collapsed-lines
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
          root   /var/project;
          index  index.html index.htm;
          try_files $uri $uri/ /index.html; # 解决刷新404
        }
        # 配置代理
        location /api/ {
          # 设置代理目标
          proxy_pass https://api.example.com/;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}
```

:::
