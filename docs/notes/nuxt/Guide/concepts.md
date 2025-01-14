---
title: 概念
createTime: 2025/01/14 10:54:01
permalink: /nuxt/rtq8fkxt/
---

::: note
<https://nuxt.com/docs/guide/concepts/auto-imports>
:::

## 自动导入

Nuxt 3 提供了自动导入功能，可以让你在项目中使用各种 Nuxt 提供的 API 和组件，而无需手动导入。

- 自动导入 `Vue.js` API，`Vue Router` API，`Pinia` API 等
- 自动导入 `/components` 目录下的组件 (支持子目录，名称组合)
- 自动导入 `/composables` 目录下的组合式函数 (仅扫描顶层文件，不支持子目录)
- 自动导入 `/utils` 目录下的工具函数 (仅扫描顶层文件，不支持子目录)

## 渲染模式

Nuxt 支持多种渲染模式，可以全 SSR 渲染，也可以全客户端渲染，也可以混合渲染，还可以生成静态站点文件。

## 服务器引擎

Nuxt 使用 Nitro 作为服务器引擎

## 模块

Nuxt 提供了一个模块系统，用于扩展框架核心功能并简化集成。
