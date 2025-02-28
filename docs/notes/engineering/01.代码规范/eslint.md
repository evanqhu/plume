---
title: ESLint
createTime: 2024/12/21 01:59:17
permalink: /engineering/tyul9odm/
---

::: note
ESLint 是一个开源的 JavaScript 代码检查工具，用于识别和报告代码中的模式，帮助开发者遵循最佳实践，提高代码质量和可维护性。

官网：<https://eslint.org/docs/latest/use/getting-started>

中文文档：<https://eslint.nodejs.cn/docs/latest/use/getting-started>
:::

> ESLint 的插件命名一般为 `eslint-plugin-xxx`，使用时可省略 `eslint-plugin-`
> ESLint 的规则集命名一般为 `eslint-config-xxx`，使用时可省略 `eslint-config-`
> @vue 这种表示 scoped 组织

## 01 安装依赖包

```sh
pnpm i eslint@latest eslint-define-config -D
pnpm i eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
pnpm i prettier eslint-plugin-prettier eslint-config-prettier -D
```

> 我们在项目中安装 `ESlint`，最终是会通过命令 `pnpm lint`  或者 `pnpm lint:fix`  去执行，这个命令会用项目中安装的 `eslint` 去检查指定目录/文件的代码，最终输出不符合规则的代码错误信息。

## 02 依赖包介绍

- `eslint` ESLint 包，提供 `eslint` 命令
  - 内部依赖 `@eslint/js` ESLint 的 JavaScript 插件；包含有关 JS 的规则集
- `eslint-define-config` 为配置文件提供类型函数， `defineConfig` `defineFlatConfig`
- `eslint-plugin-vue` ESLint 的 Vue 插件；内部依赖了 `vue-eslint-parser` 解析器包
- `@typescript-eslint/eslint-plugin` ESLint 的 TypeScript 插件
- `@typescript-eslint/parser` TypeScript 解析器
- `prettier` Prettier 包，提供 `prettier` 命令
- `eslint-plugin-prettier` ESLint 的 Prettier 插件；将 Prettier 作为 ESLint 规则来运行
- `eslint-config-prettier` 关闭 ESLint 中可能与 Prettier 发生冲突的规则（仅此功能）

## 03 在 package.json 中配置命令

::: code-tabs
@tab package.json

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

:::

## 04 ESLint 平面配置文件

::: code-tabs
@tab eslint.config.js

```js :collapsed-lines
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import * as parserVue from "vue-eslint-parser";
import configPrettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineFlatConfig } from "eslint-define-config";
import * as parserTypeScript from "@typescript-eslint/parser";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";

export default defineFlatConfig([
  // 1. 适用于所有文件
  {
    // 使用 ESLint 推荐的 js 配置
    ...js.configs.recommended,
    // 配置忽略的文件或目录
    ignores: ["**/.*", "dist/*", "*.d.ts", "public/*", "src/assets/**", "src/**/iconfont/**"],
    // 语言选项
    languageOptions: {
      // 定义全局变量（只读），避免在代码中使用这些变量时报错
      globals: {
        // index.d.ts
        RefType: "readonly",
        EmitType: "readonly",
        TargetContext: "readonly",
        ComponentRef: "readonly",
        ElRef: "readonly",
        ForDataType: "readonly",
        AnyFunction: "readonly",
        PropType: "readonly",
        Writable: "readonly",
        Nullable: "readonly",
        NonNullable: "readonly",
        Recordable: "readonly",
        ReadonlyRecordable: "readonly",
        Indexable: "readonly",
        DeepPartial: "readonly",
        Without: "readonly",
        Exclusive: "readonly",
        TimeoutHandle: "readonly",
        IntervalHandle: "readonly",
        Effect: "readonly",
        ChangeEvent: "readonly",
        WheelEvent: "readonly",
        ImportMetaEnv: "readonly",
        Fn: "readonly",
        PromiseFn: "readonly",
        ComponentElRef: "readonly",
        parseInt: "readonly",
        parseFloat: "readonly",
      },
    },
    plugins: {
      // 启用 Prettier 插件，用于代码格式化
      prettier: pluginPrettier,
    },
    rules: {
      // 合并 Prettier 的默认规则
      ...configPrettier.rules,
      ...pluginPrettier.configs.recommended.rules,
      "no-debugger": "off",
      // 自定义 no-unused-vars 规则，允许以 "_" 开头的变量和参数不被标记为未使用
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // 配置 Prettier 格式化规则，忽略行尾符号差异
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
  // 2. 适用于 .ts 文件
  {
    files: ["**/*.?([cm])ts", "**/*.?([cm])tsx"],
    languageOptions: {
      parser: parserTypeScript, // 使用 TypeScript 的解析器
      parserOptions: {
        sourceType: "module", // 使用 ECMAScript 模块
        warnOnUnsupportedTypeScriptVersion: false, // 忽略 TypeScript 版本不兼容的警告
      },
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript, // 启用 TypeScript 插件
    },
    rules: {
      // 启用 TypeScript 严格模式的规则
      ...pluginTypeScript.configs.strict.rules,
      "@typescript-eslint/ban-types": "off", // 允许使用被禁用的类型
      "@typescript-eslint/no-redeclare": "error", // 禁止重复声明变量
      "@typescript-eslint/ban-ts-comment": "off", // 允许使用 @ts-ignore 等注释
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any 类型
      "@typescript-eslint/prefer-as-const": "warn", // 建议使用 as const 声明常量
      "@typescript-eslint/no-empty-function": "off", // 允许空函数
      "@typescript-eslint/no-non-null-assertion": "off", // 允许使用非空断言
      "@typescript-eslint/no-import-type-side-effects": "error", // 禁止带有副作用的类型导入
      "@typescript-eslint/explicit-module-boundary-types": "off", // 关闭函数返回值类型声明的强制要求
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { disallowTypeAnnotations: false, fixStyle: "inline-type-imports" }, // 强制使用一致的类型导入格式
      ],
      "@typescript-eslint/prefer-literal-enum-member": [
        "error",
        { allowBitwiseExpressions: true }, // 允许使用按位操作符
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // 忽略未使用的函数参数
          varsIgnorePattern: "^_", // 忽略未使用的变量
        },
      ],
    },
  },
  // 3. 适用于 .d.ts 类型声明文件
  {
    files: ["**/*.d.ts"],
    rules: {
      "eslint-comments/no-unlimited-disable": "off", // 允许在注释中使用无限制的 ESLint 禁用规则
      "import/no-duplicates": "off", // 允许重复的 import
      "unused-imports/no-unused-vars": "off", // 允许未使用的变量
    },
  },
  // 4. 适用于 .js 文件
  {
    files: ["**/*.?([cm])js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off", // 允许使用 require 导入
      "@typescript-eslint/no-var-requires": "off", // 允许使用 var require
    },
  },
  // 5. 适用于 .vue 文件
  {
    files: ["**/*.vue"],
    languageOptions: {
      globals: {
        $: "readonly",
        $$: "readonly",
        $computed: "readonly",
        $customRef: "readonly",
        $ref: "readonly",
        $shallowRef: "readonly",
        $toRef: "readonly",
      },
      parser: parserVue, // 使用 Vue 的解析器
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // 支持 JSX 语法
        },
        extraFileExtensions: [".vue"], // 额外支持 .vue 文件
        parser: "@typescript-eslint/parser", // Vue 文件中的脚本部分使用 TypeScript 解析器
        sourceType: "module", // 使用 ECMAScript 模块
      },
    },
    plugins: {
      vue: pluginVue, // 启用 Vue 插件
    },
    processor: pluginVue.processors[".vue"], // 处理 .vue 文件的特殊解析逻辑
    rules: {
      ...pluginVue.configs.base.rules, // 基础规则
      ...pluginVue.configs["vue3-essential"].rules, // Vue 3 必要规则
      ...pluginVue.configs["vue3-recommended"].rules, // Vue 3 推荐规则
      "no-undef": "off", // 关闭未定义变量的检查
      "no-unused-vars": "off", // 关闭未使用变量的检查
      "vue/no-v-html": "off", // 允许使用 v-html 指令
      "vue/require-default-prop": "off", // 允许 prop 没有默认值
      "vue/require-explicit-emits": "off", // 允许没有显式声明的事件
      "vue/multi-word-component-names": "off", // 允许单词组成的组件名
      "vue/no-setup-props-reactivity-loss": "off", // 关闭 setup 中 props 的响应性丢失检查
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always", // HTML 中的空元素总是自闭合
            normal: "always", // HTML 中的普通元素总是自闭合
            component: "always", // Vue 组件总是自闭合
          },
          svg: "always", // SVG 元素总是自闭合
          math: "always", // MathML 元素总是自闭合
        },
      ],
    },
  },
]);
```

:::

## 05 Prettier 配置文件

::: code-tabs
@tab .prettierrc.js

```js
// @ts-check

/** @type {import("prettier").Config} */
export default {
  bracketSpacing: true,
  singleQuote: false,
  arrowParens: "avoid",
  trailingComma: "none",
};
```

:::

## 06 简洁方案

使用 `@antfu/eslint-config` 包

- 安装依赖包

```sh
pnpm i eslint @antfu/eslint-config -D
```

- 配置文件

```js
// eslint.config.mjs
import antfu from "@antfu/eslint-config";

export default antfu();
```

## 07 ESLint < 9 的方案

### 安装的包

- `eslint`
- `prettier`
- `eslint-plugin-vue` Vue 官方 ESLint 插件
- `@vue/eslint-config-typescript` [npm 地址](https://www.npmjs.com/package/@vue/eslint-config-typescript)
  - Vue 官方 TS-ESLint 规则集
  - 内部依赖了 `@typescript-eslint/parser` 解析器和 `@typescript-eslint/eslint-plugin` 插件
- `@vue/eslint-config-prettier` [npm 地址](https://www.npmjs.com/package/@vue/eslint-config-prettier)
  - Vue 官方 Prettier-ESLint 规则集
  - 内部依赖了 `eslint-config-prettier` 规则集和 `eslint-plugin-prettier` 插件
- `@rushstack/eslint-patch`
  - 配合 Vue 官方的两个规则集使用的

```sh
pnpm i eslint prettier -D
pnpm i eslint-plugin-vue @vue/eslint-config-typescript @vue/eslint-config-prettier -D
```

::: note

```js
module.exports = {
  extends: [
    "plugin:eslint-plugin-vue", // 等于 'plugin:vue'（'plugin:vue/vue3-essential'表示不同的规则集）
    "@vue/eslint-config-typescript", // 等于 '@vue/typescript'
  ],
};
```

:::

### 配置文件

::: code-tabs
@tab .eslintrc.cjs

```js
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential", // eslint-plugin-vue 包
    "eslint:recommended", // eslint 包
    "@vue/eslint-config-typescript", // @vue/eslint-config-typescript 包
    "@vue/eslint-config-prettier", // @vue/eslint-config-prettier 包
    // Vue 推荐的是 @vue/eslint-config-prettier/skip-formatting
    // 但是这样就不会在代码中报 Prettier 的警告，这里改了一下
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
};
```

@tab .prettierrc.json

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "none"
}
```

@tab package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --build --force",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write src/"
  }
}
```

:::

> 使用 `.eslint.cjs` 作为 ESLint 配置文件的命名是为了明确它是一个 CommonJS 模块（运行在 Node 环境，使用 `require` 导入，`module.exports` 导出），便于与 ESM 文件区分。

### 其他配置文件推荐

::: details v3-admin-vite 项目

```js
// https://github.com/un-pany/v3-admin-vite/blob/main/.eslintrc.cjs
// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/eslint-config-typescript",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  rules: {
    // TS
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-debugger": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    // Vue
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/require-explicit-emits": "off",
    "vue/multi-word-component-names": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
    // Prettier
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
```

:::

## 08 Nuxt 中的方案

直接使用 Nuxt ESLint Module 并开启 stylistic

::: code-tabs

@tab nuxt.config.ts

```ts
export default defineNuxtConfig({
  modules: ["@nuxt/eslint"],
  eslint: {
    config: {
      stylistic: true, // <---
    },
  },
});
```

@tab eslint.config.mjs

```ts
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@stylistic/quotes": "warn", // 单引号
      "@stylistic/semi": "warn", // 不添加尾随分号
      "@stylistic/comma-dangle": "warn", // 添加尾随逗号
      "vue/html-quotes": "warn", // Vue template 中用单引号
      "@stylistic/no-trailing-spaces": "warn", // 删除尾随空格
      "@stylistic/eol-last": "warn", // 添加尾随换行
      "@stylistic/no-multiple-empty-lines": "warn", // 删除多余的空行
      "@typescript-eslint/no-explicit-any": "warn", // 允许使用 any 类型
      // Vue 属性换行
      "vue/max-attributes-per-line": [
        "warn",
        {
          singleline: {
            max: 5,
          },
          multiline: {
            max: 1,
          },
        },
      ],
    },
  }
);
```

:::
