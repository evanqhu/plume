---
title: 代码规范化
createTime: 2025/05/24 01:03:52
permalink: /engineering/8trasztt/
---

## **0️⃣ 前言**

本文以 React 项目为例，在项目中进行代码规范化及仓库提交规范化配置，包括

- **ESLint**
- **Prettier**
- **Stylelint**
- **Commitlint**
- **Postcss**
- **等**

## **1️⃣ ESLint + Prettier**

**ESLint 官网：https://eslint.org/docs/v8.x/**

**Prettier 官网：https://prettier.io/docs/en/install**

**本文 ESLint 版本 v8.57.0**

### **1.1 配置 ESLint**

**一般我们使用 Vite 等工具来初始化项目，此时项目中都会自带 ESLint，无需二次安装**

**本文以 Vite 为例，新建一个空白项目**

```bash
pnpm create vite
```

**之后根据流程即可创建一个模板项目，该项目已安装 ESLint 并带有相应的配置**

**如果项目中没有安装 ESLint，可以使用下方命令安装并初始化 ESLint**

```bash
# 安装 ESLint
npm i eslint@8 -D

# 创建 ESLint 配置文件
touch .eslintrc.cjs
```

### **1.2 npm 包与配置文件**

```bash
# 解析器
npm i @typescript-eslint/parser -D
# parser: '@typescript-eslint/parser'

# 扩展：React 规则扩展
# https://github.com/jsx-eslint/eslint-plugin-react
npm i eslint-plugin-react -D
# extends: ['plugin:react/recommended', 'plugin:react/jsx-runtime'],
# plugins: ['react']

# 扩展：TypeScript 规则扩展
# https://typescript-eslint.io/packages/eslint-plugin
npm i @typescript-eslint/eslint-plugin -D
# extends: ['plugin:@typescript-eslint/recommended-type-checked', 'plugin:@typescript-eslint/stylistic-type-checked']
# plugins: ['@typescript-eslint']

# 扩展：React hooks 规则扩展
# https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
npm i eslint-plugin-react-hooks -D
# extends: ['plugin:react-hooks/recommended']
# plugins: ['react-hooks']

# 插件：验证组件是否可以快速刷新
# https://github.com/ArnaudBarre/eslint-plugin-react-refresh
npm i eslint-plugin-react-refresh -D
# plugins: ['react-refresh']

# 插件：规范导入顺序
# https://github.com/lydell/eslint-plugin-simple-import-sort
npm i eslint-plugin-simple-import-sort -D
# plugins: ['simple-import-sort']

# React 汇总
npm i @typescript-eslint/parser eslint-plugin-react @typescript-eslint/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-simple-import-sort -D

# Vue 汇总（TODO）
```

### **1.3 配置 Prettier**

```bash
# 关闭所有不必要或可能与 Prettier 冲突的规则；作为 ESLint 规则运行 Prettier，并将差异报告为单独的 ESLint 问题
# https://github.com/prettier/eslint-config-prettier （用来覆盖 ESLint 本身的规则配置）
# https://github.com/prettier/eslint-plugin-prettier （让 Prettier 来接管 eslint --fix 即修复代码的能力）

npm i prettier eslint-config-prettier eslint-plugin-prettier -D
# extends: ['plugin:prettier/recommended']
# 该扩展需要放在最后
```

### **1.4 推荐配置**

```jsx
// .eslintrc.cjs
// @see https://eslint.org/docs/v8.x/
/** @type {import('eslint').ESLint.ConfigData} */

module.exports = {
  /* 环境为浏览器环境和 ECMAScript 2020 */
  env: { browser: true, es2020: true } /* 继承的规则配置 (可以从 ESLint config 包中继承，也可从插件中继承) */,
  extends: [
    // https://eslint.org/docs/v8.x/rules/（ESLint 自带）
    "eslint:recommended", // https://github.com/jsx-eslint/eslint-plugin-react（React 规则集）

    "plugin:react/recommended",
    "plugin:react/jsx-runtime", // https://typescript-eslint.io/packages/eslint-plugin（TypeScript 规则集）

    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked", // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks（React hooks 规则集）

    "plugin:react-hooks/recommended", // https://github.com/prettier/eslint-plugin-prettier（Prettier 相关）

    "plugin:prettier/recommended",
  ] /* 忽略文件 */,
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    ".prettierrc.cjs",
    ".stylelintrc.cjs",
    "commitlint.config.ts",
    "pnpm-lock.yaml",
  ] /* 解析器 */,
  parser: "@typescript-eslint/parser" /* 配置解析器的行为和选项 */,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  } /* 插件 */,
  plugins: [
    "react",
    "@typescript-eslint",
    "react-hooks", // https://github.com/ArnaudBarre/eslint-plugin-react-refresh（验证组件是否可以快速刷新）
    "react-refresh", // https://github.com/lydell/eslint-plugin-simple-import-sort（规范导入顺序）
    "simple-import-sort",
  ] /* 根目录为当前目录 */,
  root: true /* 自定义规则 */,
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "prettier/prettier": "warn",
    "@typescript-eslint/no-explicit-any": "off", // 关闭使用 any 类型的检测规则
    "@typescript-eslint/no-unsafe-assignment": "off", // 关闭不安全的赋值操作规则
    "@typescript-eslint/no-unsafe-member-access": "off", // 关闭不安全成员访问规则
    "@typescript-eslint/no-unsafe-return": "off", // 关闭不安全返回值规则
    "@typescript-eslint/no-unsafe-call": "off", // 关闭不安全调用规则
    "@typescript-eslint/no-unsafe-argument": "off", // 关闭不安全参数传递规则
    "@typescript-eslint/ban-types": "off", // 关闭禁止使用特定类型的规则
    "@typescript-eslint/no-unused-vars": "warn", // 关闭未使用变量的检测规则 // @see: https://github.com/lydell/eslint-plugin-simple-import-sort

    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",

    "react/display-name": "off", // 关闭 React 组件的 display name 规则
  } /* 设置 */,
  settings: {
    react: { version: "detect" },
  },
};
```

```jsx
// .prettierrc.cjs
// @see https://prettier.io/docs/en/options

/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 120, // 每行代码的最大长度
  tabWidth: 2, // 每个制表符等于的空格数
  useTabs: false, // 是否使用制表符代替空格
  semi: true, // 是否在语句末尾添加分号
  singleQuote: true, // 是否使用单引号
  jsxSingleQuote: true, // JSX 中是否使用单引号
  arrowParens: "always", // 箭头函数参数是否使用括号
};
```

## **2️⃣ Stylelint**

**Stylelint 官网：https://stylelint.io/user-guide/get-started**

### **2.1 安装**

```bash
npm i stylelint stylelint-config-standard stylelint-config-standard-less -D
npm i stylelint-order stylelint-less stylelint-prettier stylelint-config-recess-order -D
```

### **2.2 配置文件**

```jsx
// .stylelintrc.cjs
/** @type {import('stylelint').Config} */

module.exports = {
  extends: [
    // https://github.com/stylelint/stylelint-config-standard（标准规则集）
    "stylelint-config-standard", // https://github.com/stylelint-less/stylelint-less（Less 规则集）
    "stylelint-config-standard-less", // https://github.com/stormwarning/stylelint-config-recess-order（继承已有的样式顺序）
    "stylelint-config-recess-order", // https://github.com/prettier/stylelint-prettier（作为 Stylelint 规则运行 Prettier）
    "stylelint-prettier/recommended",
  ],
  plugins: [
    // https://www.npmjs.com/package/stylelint-less（Less 插件）
    "stylelint-less", // https://github.com/hudochenkov/stylelint-order（允许自定义样式顺序）
    "stylelint-order",
  ],
  rules: {
    "order/order": ["custom-properties", "declarations"],
    "selector-class-pattern": null,
    "value-no-vendor-prefix": null,
    "property-no-vendor-prefix": null,
    "value-keyword-case": null,
  },
};
```

## **3️⃣ husky + commitlint**

**husky 官网：https://typicode.github.io/husky/**

**lint-staged 官网：https://github.com/lint-staged/lint-staged**

**commitlint 官网：https://commitlint.js.org/guides/getting-started.html**

**commitizen 官网：https://github.com/commitizen/cz-cli**

**cz-git 官网：https://cz-git.qbb.sh/zh/guide/**

### **3.1 安装 husky 和 lint-staged**

**husky：允许在 git 的生命周期中使用钩子执行特定的操作 lint-staged：针对添加到暂存区的文件进行处理**

```bash
npm i husky lint-staged -D
```

### **3.2 初始化 husky 文件**

```bash
npx husky init
pnpm exec husky init
```

### **3.3 配置 lint-staged**

```json
// package.json 根据实际情况配置
{
  "scripts": {
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,html,md}": "prettier --write",
    "*.{css,less}": "stylelint --fix"
  }
}
```

### **3.4 修改 pre-commit**

```bash
# .husky/pre-commit
npm run lint-staged
```

### **3.5 安装 commitlint**

**commitlint：用于 git 提交之前进行校验**

```bash
npm i @commitlint/{cli,config-conventional} -D
```

### **3.6 生成配置文件**

```bash
echo "export default { extends: ['@commitlint/config-conventional'] };" > .commitlintrc.cjs
```

**参考 https://cz-git.qbb.sh/zh/config/ 进行配置**

### **3.7 安装 commitizen 和 cz-git**

**commitizen：使用命令行进行提交的小工具**

**cz-git： commitizen 的插件，文档：https://cz-git.qbb.sh/zh/guide/**

```bash
npm i commitizen cz-git -D
```

### **3.8 执行**

```json
// package.json
{
  "scripts": {
    "commit": "git pull && git add -A && git-cz && git push"
  },
  "config": {
    "commitizen": { "path": "node_modules/cz-git" }
  }
}
```

## **4️⃣ 常用脚本**

```json
// package.json
{
  "scripts": {
    "dev": "vite --open",
    "dev:mock": "vite --open --mode mock",
    "build": "tsc && vite build",
    "lint": "eslint --report-unused-disable-directives --max-warnings 0 '**/*.{ts,tsx}'",
    "lint:fix": "eslint --fix '**/*.{ts,tsx}'",
    "prettier": "prettier --check '**/*.{ts,tsx,json,html,md}'",
    "prettier:fix": "prettier --write '**/*.{ts,tsx,json,html,md}'",
    "style": "stylelint '**/*.{css,less}'",
    "style:fix": "stylelint --fix '**/*.{css,less}'",
    "preview": "vite preview",
    "prepare": "husky",
    "lint-staged": "lint-staged",
    "commit": "bash pull-commit-push.sh"
  }
}
```

**pull-commit-push.sh**

```bash
#!/bin/bash

# 检查远程仓库是否存在
git ls-remote &> /dev/null

# 获取上一个命令的退出状态
exit_status=$?

if [ $exit_status -eq 0 ]; then
    echo "远程仓库存在，执行 git pull 和 git push"
    git pull
    git add -A
    git-cz
    git push
else
    echo "远程仓库不存在，仅执行 git add 和 git-cz"
    git add -A
    git-cz
fi
```

```bash
# 启动开发服务器（默认 development 环境）
$ npm run dev

# 启动开发服务器并使用 mock 拦截请求
$ npm run dev:mock

# 打包项目（默认 production 环境）
$ npm run build

# ESLint 语法校验
$ npm run lint

# ESLint 语法校验并修复
$ npm run lint:fix

# Prettier 格式校验并修复
$ npm run lint:prettier

# Stylelint 样式校验并修复
$ npm run lint:style

# 预览构建产物（打包后执行）
$ npm run preview

# 自动执行（生命周期脚本）
$ npm run prepare

# 在 git commit 之前自动执行
$ npm run lint-staged

# git 提交
$ npm run commit
```

## **5️⃣ postcss**

### **5.1 安装**

```bash
npm i postcss autoprefixer -D
```

### **5.2 配置**

**在 vite.config.ts 文件中进行如下配置**

```jsx
import autoprefixer from 'autoprefixer';

export default defineConfig(() => {
  css: {
    postcss: {
      plugins: [
        // 处理 css 兼容性问题
        // https://github.com/postcss/autoprefixer
        autoprefixer(),
      ],
    },
  },
});
```
