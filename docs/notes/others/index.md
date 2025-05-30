---
title: 杂项
createTime: 2024/12/23 14:45:18
permalink: /others/
---

## VPN 终端代理

在 clashX 中点击 `复制终端代理命令`，粘贴到终端中执行，当前终端的网络请求即可强制使用代理

复制的命令一般为：

```sh
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

## CDN 字体

<https://www.cdnfonts.com>

<https://fonts.google.com>

项目中需要使用某些字体时，可以直接通过 CDN 引入，然后在项目中使用即可，无需下载字体包

```css
@import url("https://fonts.cdnfonts.com/css/archivo-black");
```

CDN 链接中一般是这样一段代码，其中 src 表示先尝试从本地获取代码，如果没有，则从对应链接下载代码，并格式化为指定字体格式

```css
@font-face {
  font-family: archivo black;
  font-style: normal;
  font-weight: 400;
  src: local("Archivo Black"), url(https://fonts.cdnfonts.com/s/15376/ArchivoBlack-Regular.woff) format("woff");
}
```

## 自动切换 Node 版本

当使用 nvm 作为 Node 包管理工具时， 可以使用 `nvm use v18` 或 `nvm use 18` 这样的命令来切换终端的 Node 版本

可以在项目根目录新建 `.nvmrc` 文件，指定项目的 Node 版本

在 VS Code 中安装 `vsc-nvm` 插件，该插件会在打开终端时自动运行 `nvm use` 命令，选择的 Node 版本正是读取自 `.nvmrc` 文件

::: code-tabs
@tab .nvmrc

```sh
v18
```

:::

## 解决 Element Plus 的样式问题

在 Nuxt3 项目中使用 Element Plus 时，发现使用 scss 自定义样式的时候会出现报错，提示 `Failed to resolve import "element-plus/theme-chalk/src/common/var.scss" from "element-plus/theme-chalk/src/index.scss".`，后面找到原因是由于包的组织问题，在 node_modules 中找不到 `element-plus/theme-chalk/src/common/var.scss` 文件。解决方案是新增 .npmrc 文件，内容如下：
shamefully-hoist=true
strict-peer-dependencies=false
shell-emulator=true

# fix code ERESOLVE \n ERESOLVE could not resolve

legacy-peer-deps=true
