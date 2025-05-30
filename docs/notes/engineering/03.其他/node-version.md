---
title: Node 版本管理
createTime: 2025/05/30 16:05:26
permalink: /engineering/kvdtbvju/
---

[Node.js](https://nodejs.org/en) 是基于 Chrome V8 引擎的 JavaScript 运行环境。

电脑中可以通过多种方式安装 Node.js，比如直接下载安装，`homebrew` 安装，`nvm` 安装等

官网下载安装的 Node.js 会安装在全局，`homebrew` 安装的 Node.js 会安装在 `brew` 文件夹下，他们都容易与 `nvm` 安装的 Node.js 冲突，所以建议先卸载其他所有途径安装的 Node.js，之后再去下载 `nvm`，然后使用 `nvm` 安装 Node.js

参考文章：<https://www.runoob.com/w3cnote/nvm-manager-node-versions.html>

[`nvm`](https://github.com/nvm-sh/nvm) 是最常用的 Node.js 版本管理工具，可以方便地在同一台机器上安装和切换多个 Node 版本。

## 安装 nvm

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

1. 使用 nvm 安装不同版本的 node，同时自动安装不同版本的 npm
2. 在各个 node 版本下都使用 npm 来安装 pnpm，都加上 -g 全局安装
3. 这样使用 nvm 切换 node 环境时，npm，pnpm，npx 的版本都会自动切换

## 使用 nvm

```sh
# 查看可用的 node 版本
nvm ls-remote

# 查看已安装的 node 版本
nvm ls

# 安装指定版本
nvm install 18.18.2

# 切换 node 版本
nvm use 18.18.2

# 设置默认 node 版本
nvm alias default 18.18.2

# 删除指定版本
nvm uninstall 18.18.2
```

## 安装 Node 14

像 Node 14 及其之前版本是基于 `x86` 架构开发的，直接在 M 系列芯片的设备上使用 `nvm install 14` 会报错，这时需要先运行 `arch -x86_64 zsh` 命令，再安装

`arch -x86_64 zsh` 是一个命令，用于在 macOS 系统上以 `x86_64` 架构运行 `Zsh`

- `arch`：这是一个 macOS 命令，用于指定运行命令时使用的架构。macOS 系统可以运行在不同的处理器架构上，例如 `x86_64` (即 Intel 的 64 位架构) 和 `arm64` (即 Apple Silicon M1 和 M2 处理器的 64 位架构)
- `-x86_64`：这是 `arch` 命令的一个参数，指定需要使用 `x86_64` 架构来运行后面的命令
- `zsh`：这是一个流行的命令行 Shell，类似于 Bash，但提供了更多的功能和更强的自定义能力

组合起来，`arch -x86_64 zsh` 意思是在 `x86_64` 架构下启动 `Zsh Shell`。这在使用 Apple Silicon 的 macOS 设备时特别有用，因为这些设备默认运行在 `arm64` 架构下，但有时可能需要在 `x86_64` 架构下运行某些程序或命令。

例如，当你在 Apple Silicon Mac 上运行一些只兼容 `x86_64` 架构的软件时，可以使用这种方法启动兼容环境。
