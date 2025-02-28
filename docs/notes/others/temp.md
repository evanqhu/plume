---
title: 临时笔记
createTime: 2025/02/08 16:56:39
permalink: /others/vqxw3hwj/
---

在 Nuxt3 项目中使用 Element Plus 时，发现使用 scss 自定义样式的时候会出现报错，提示 `Failed to resolve import "element-plus/theme-chalk/src/common/var.scss" from "element-plus/theme-chalk/src/index.scss".`，后面找到原因是由于包的组织问题，在 node_modules 中找不到 `element-plus/theme-chalk/src/common/var.scss` 文件。解决方案是新增 .npmrc 文件，内容如下：
shamefully-hoist=true
strict-peer-dependencies=false
shell-emulator=true
# fix code ERESOLVE \n ERESOLVE could not resolve
legacy-peer-deps=true