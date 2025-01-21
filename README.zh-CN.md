# my-vuepress-site

网站使用 [vuepress](https://vuepress.vuejs.org/) 和 [vuepress-theme-plume](https://github.com/pengzhanbo/vuepress-theme-plume) 构建生成。

## Install

```sh
pnpm i
```

## Usage

```sh
# 启动开发服务
pnpm docs:dev
# 构建生产包
pnpm docs:build
# 本地预览生产服务
pnpm docs:preview
# 更新 vuepress 和主题
pnpm vp-update
```

## 文档

- [vuepress](https://vuepress.vuejs.org/)
- [vuepress-theme-plume](https://theme-plume.vuejs.press/)

## 问题记录

- 如何让 notes 文件夹下生成的 permalink 是按路径和文件名来命名的，甚至可以自定义这个规则
- 博客可以配置 sidebar 吗
- notes 中的 text 是干什么的

## 使用指南

- 开启 autoFrontmatter
- 对于博客类笔记 (非 notes 文件夹下的) 使用 autoFrontmatter 自动生成 permalink
- 对于 notes 中的非系统性笔记 (如：组件、算法、工程化等)，使用 autoFrontmatter 自动生成 permalink，并且配置 sidebar 为 auto
- 对于 notes 中的系统性笔记 (有顺序的)，有两种方案：
  - 依然使用 autoFrontmatter 自动生成 permalink，并且配置 sidebar 为 auto，但是在文件名前添加序号用于排序 (感觉这样是最方便的)
  - 手动配置 permalink 为文件夹名 + 文件名，然后手动依次配置 sidebar，这样就可以自定义顺序了 (感觉很麻烦)
- 对于代码演示，使用 `@[demo vue](url)` 引入，可以使用相对路径，将 Vue 组件放在同级目录即可
- 展示外部文件的代码，通过 `@[code vue](url) 引入`，可以使用相对路径
