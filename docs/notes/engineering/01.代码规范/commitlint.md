---
title: CommitLint
createTime: 2024/12/21 02:54:07
permalink: /engineering/wj0k960w/
---

::: note
husky：<https://typicode.github.io/husky>

simple-git-hooks：<https://github.com/toplenboren/simple-git-hooks/tree/master>

lint-staged：<https://github.com/lint-staged/lint-staged>

commitizen：<https://commitizen-tools.github.io/commitizen>

cz-git：<https://cz-git.qbb.sh/zh/guide>
:::

## 01 安装依赖包

- 使用 `husky`

```sh
pnpm i husky lint-staged @commitlint/{cli,types,config-conventional} commitizen cz-git -D
```

- 使用 `simple-git-hooks`

```sh
pnpm i simple-git-hooks lint-staged @commitlint/{cli,types,config-conventional} commitizen cz-git -D
```

## 02 依赖包介绍

- `husky` 允许在 git 的生命周期中使用钩子执行特定的操作，会生成 .husky 文件
- `simple-git-hooks` 可以作为 husky 的替代品，更简洁
- `lint-staged` 针对添加到 git 暂存区的文件进行处理
- `@commitlint/cli` 对 git 提交的 msg 进行校验
- `@commitlint/config-conventional` 提交 msg 校验规则集
- `commitizen` 使用交互式命令行进行提交的小工具
- `cz-git` commitizen 的插件

## 03 初始化 git hooks 配置

> 在 git 的生命周期钩子中执行某些命令，这里主要是 pre-commit 钩子，在 git commit 之前执行

### 1️⃣ 使用 husky

```sh
pnpm exec husky init
```

在 `.husky/pre-commit` 文件中配置相关命令

```sh
pnpm run lint-staged
```

### 2️⃣ 使用 simple-git-hooks

::: code-tabs
@tab package.json

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm run lint-staged"
  }
}
```

:::

执行脚本更新 git hooks 配置

```sh
# [Optional] These 2 steps can be skipped for non-husky users
git config core.hooksPath .git/hooks/
rm -rf .git/hooks

# Update ./git/hooks
npx simple-git-hooks
```

## 04 配置 lint-staged

> 针对 git 暂存区的文件进行处理，执行某些命令

可以在 `package.json` 中增加 `lint-staged` 配置项，也可以新增 `.lintstagedrc` 文件

::: code-tabs
@tab package.json

```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "*.{vue,js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,less,scss,html,md}": ["prettier --write"],
    "package.json": ["prettier --write"]
  }
}
```

:::

## 05 设置 commitlint 配置

> 对 git 提交的 msg 进行校验

::: code-tabs
@tab commitlint.config.js

```js :collapsed-lines
// commitlint.config.cjs
/** @type {import("cz-git").UserConfig} */
module.exports = {
  ignores: [(commit) => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 108],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "subject-case": [0],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "wip",
        "workflow",
        "types",
        "release",
      ],
    ],
  },
  prompt: {
    messages: {
      // type: "Select the type of change that you're committing:",
      // scope: 'Denote the SCOPE of this change (optional):',
      // customScope: 'Denote the SCOPE of this change:',
      // subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      // body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      // breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      // footerPrefixsSelect: 'Select the ISSUES type of changeList by this change (optional):',
      // customFooterPrefixs: 'Input ISSUES prefix:',
      // footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      // confirmCommit: 'Are you sure you want to proceed with the commit above?',
      // 中文版
      type: "选择你要提交的类型 :",
      scope: "选择一个提交范围（可选）:",
      customScope: "请输入自定义的提交范围 :",
      subject: "填写简短精炼的变更描述 :\n",
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixsSelect: "选择关联issue前缀（可选）:",
      customFooterPrefixs: "输入自定义issue前缀 :",
      footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      confirmCommit: "是否提交或修改commit ?",
    },
    types: [
      // { value: 'feat', name: 'feat:     🚀  A new feature', emoji: '🚀' },
      // { value: 'fix', name: 'fix:      🧩  A bug fix', emoji: '🧩' },
      // { value: 'docs', name: 'docs:     📚  Documentation only changes', emoji: '📚' },
      // { value: 'style', name: 'style:    🎨  Changes that do not affect the meaning of the code', emoji: '🎨' },
      // {
      //   value: 'refactor',
      //   name: 'refactor: ♻️   A code change that neither fixes a bug nor adds a feature',
      //   emoji: '♻️',
      // },
      // { value: 'chore', name: "chore:    🔨  Other changes that don't modify src or test files", emoji: '🔨' },
      // { value: 'perf', name: 'perf:     ⚡️  A code change that improves performance', emoji: '⚡️' },
      // { value: 'test', name: 'test:     ✅  Adding missing tests or correcting existing tests', emoji: '✅' },
      // {
      //   value: 'build',
      //   name: 'build:    📦️   Changes that affect the build system or external dependencies',
      //   emoji: '📦️',
      // },
      // { value: 'ci', name: 'ci:       🎡  Changes to our CI configuration files and scripts', emoji: '🎡' },
      // { value: 'revert', name: 'revert:   ⏪️  Reverts a previous commit', emoji: '⏪️' },
      // 中文版
      { value: "feat", name: "特性:   🚀  新增功能", emoji: "🚀" },
      { value: "fix", name: "修复:   🧩  修复缺陷", emoji: "🧩" },
      { value: "docs", name: "文档:   📚  文档变更", emoji: "📚" },
      {
        value: "style",
        name: "格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）",
        emoji: "🎨",
      },
      { value: "refactor", name: "重构:   🔧  代码重构（不包括 bug 修复、功能新增）", emoji: "🔧" },
      {
        value: "chore",
        name: "其他:   🧰  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）",
        emoji: "🧰",
      },
      // { value: 'perf', name: '性能:   ⚡️  性能优化', emoji: '⚡️' },
      // { value: 'test', name: '测试:   ✅  添加疏漏测试或已有测试改动', emoji: '✅' },
      {
        value: "build",
        name: "构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）",
        emoji: "📦️",
      },
      // { value: 'ci', name: '集成:   🎡  修改 CI 配置、脚本', emoji: '🎡' },
      // { value: 'revert', name: '回退:   ⏪️  回滚 commit', emoji: '⏪️' },
    ],
    useEmoji: true,
    themeColorCode: "",
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: "bottom",
    customScopesAlias: "custom",
    emptyScopesAlias: "empty",
    upperCaseSubject: false,
    allowBreakingChanges: ["feat", "fix"],
    breaklineNumber: 100,
    breaklineChar: "|",
    // 跳过的问题列表
    skipQuestions: ["scope", "customScope", "body", "breaking", "footerPrefix", "customFooterPrefixs", "footer"],
    issuePrefixs: [{ value: "closed", name: "closed:   ISSUES has been processed" }],
    customIssuePrefixsAlign: "top",
    emptyIssuePrefixsAlias: "skip",
    customIssuePrefixsAlias: "custom",
    allowCustomIssuePrefixs: true,
    allowEmptyIssuePrefixs: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: "",
    defaultIssues: "",
    defaultScope: "",
    defaultSubject: "",
  },
};
```

:::

## 06 配置运行脚本

> 在 package.json 中配置运行脚本，配置 cz-git 小工具等

::: code-tabs
@tab package.json

```json
{
  "scripts": {
    "lint-staged": "lint-staged",
    "commit": "bash commit.sh"
  },
  "lint-staged": {
    "*.{vue,js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,less,scss,html,md}": ["prettier --write"],
    "package.json": ["prettier --write"]
  },
  // 指定使用的适配器
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

:::

该脚本用于在提交代码时，自动执行拉取仓库、 lint-staged、commitizen 等工具，确保代码质量和提交信息的规范性。

::: code-tabs
@tab commit.sh

```sh
#!/bin/bash

# 检查远程仓库是否存在
git ls-remote &> /dev/null

# 获取上一个命令的退出状态
exit_status=$?

if [ $exit_status -eq 0 ]; then
    echo "远程仓库存在，执行 git pull 和 git push"
    git pull
    git add -A # 添加所有文件到暂存区
    git-cz # 弹出命令行提交选项，提交代码到本地仓库
    git push # 将代码推送到远程仓库
else
    echo "远程仓库不存在，仅执行 git add 和 git-cz"
    git add -A
    git-cz
fi
```

:::
