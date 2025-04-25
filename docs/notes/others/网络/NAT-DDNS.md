---
title: 内网穿透
createTime: 2025/03/26 10:32:56
permalink: /others/1aufoj2o/
---

在开发过程中，我们经常需要让他人预览本地开发中的项目。本文介绍几种实用的项目分享方案。

## 1. 局域网内分享

### 基本原理

在同一局域网内，其他用户可以通过局域网 IP 直接访问你的本地项目。

### 使用方法

当启动项目时（以 Nuxt 项目为例），终端会显示两个地址：

```sh
-> Local:   http://localhost:1024    # 本机访问地址
-> Network: http://192.168.2.81:1024 # 局域网访问地址
```

局域网内的其他用户可直接使用 Network 地址访问。

## 2. 局域网外分享（内网穿透）

### 使用 ngrok 实现内网穿透

#### 步骤 1: 安装 ngrok

```sh
# 方式一：使用 Homebrew
brew install ngrok

# 方式二：使用 npm
npm i -g ngrok
```

#### 步骤 2: 配置账户

1. 在 [ngrok 官网](https://dashboard.ngrok.com/signup) 注册账户（免费版即可）
2. 获取并配置认证令牌：

```sh
ngrok config add-authtoken <your-token>
```

#### 步骤 3: 启动服务

```sh
ngrok http 1024
```

### Vite 项目配置

如果你的项目使用 Vite，需要添加以下配置以允许 ngrok 访问：

```ts
{
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.app'],
    }
  }
}
```

## 注意事项

- ngrok 免费版每次启动会生成不同的临时域名
- 建议在项目文档中说明使用的端口号
- 确保防火墙设置不会阻止所需端口的访问
