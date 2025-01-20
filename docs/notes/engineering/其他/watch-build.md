---
title: 自动打包运行
createTime: 2025/01/20 10:46:14
permalink: /engineering/42w52t4e/
---

Vite 项目可以实现在开发阶段监控文件变动，自动打包运行。可以通过 [`chokidar-cli`](https://www.npmjs.com/package/chokidar-cli) 包实现。

## 安装

```sh
pnpm i chokidar-cli
```

## 使用

::: code-tabs
@tab package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "watch:build": "chokidar 'src/**/*' -c 'pnpm run build && pnpm run preview' --initial",
    "preview": "vite preview"
  }
}
```

:::

解释：`watch:build` 命令的内容表示监控 `src` 目录下的所有文件变动，当文件变动时，执行 `pnpm run build && pnpm run preview` 命令。
