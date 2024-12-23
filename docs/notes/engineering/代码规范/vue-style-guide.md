---
title: Vue 风格指南
createTime: 2024/12/21 21:04:17
permalink: /engineering/pt2dunwu/
---

::: note
Vue 3：<https://cn.vuejs.org/style-guide>

Vue 2：<https://v2.cn.vuejs.org/v2/style-guide>

其他：<https://vue3-element-admin-site.midfar.com/zh/guide/advanced/style-guide>
:::

## 01 几个比较重要的

- 组件的组件名尽量为**多个单词**
- 对于**文件夹和文件**的命名
  - 路由组件：`kebab-case` ，如 `views/export-excel.vue`
  - 非路由组件：`PascalCase` ，如 `components/HeaderSearch.vue`
  - 所有的 JS/TS 文件都使用 `kebab-case` ，如 `remote-search.js`
- `import` 引入组件时，使用大驼峰命名 `import ExportExcel form ‘@/views/export-excel.vue`
- 在模板中使用组件时，统一使用短横线链接，尽量与 UI 组件统一，同时避免在 JSX 中不支持大驼峰写法的问题（Vue 官方推荐：在单文件组件中，推荐为子组件使用  `PascalCase`  的标签名，以此来和原生的 HTML 元素作区分），这两种均可，视情况而定
- 在子组件的标签体中传递 props 时和绑定自定义事件时使用 `kebab-case`，如 `:class-name="app-container"`
- 组件中声明接收 props 时使用 `camelCase`，如 `className`
- 在单文件组件、字符串模板和  JSX  中没有内容的组件应该是自闭合的——但在 JSX 里永远不要这样做
- 指令缩写 (用  `:`  表示  `v-bind:`、用  `@`  表示  `v-on:`  和用  `#`  表示  `v-slot:`) 应该要么都用要么都不用

## 02 选项式组件中选项的顺序

1. name
2. components
3. directives
4. filters
5. mixins
6. provide inject
7. props
8. emits
9. setup
10. data
11. computed
12. watch
13. 生命周期钩子
14. methods

## 03 元素属性的顺序

1. is
2. v-for
3. v-if v-else v-show
4. id
5. ref key
6. v-slot #
7. v-model
8. v-自定义指令
9. v-bind class style 等其他自定义属性和原生属性
   1. style
   2. class
10. v-on @
11. v-text v-html

`plugin:vue/recommended` 规则中涵盖了 `vue/attributes-order` 规则
