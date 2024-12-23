---
title: 自定义 VSCode 快捷键
createTime: 2024/12/23 11:53:36
permalink: /others/znkr2q23/
---

假如想在 VSCode 中通过自定义的快捷键来生成某段代码片段，可以使用如下方法：

### 1️⃣ 新建代码片段

`evanqhu.code-snippets`

```json
{
  "JSDoc 注释 Add JSDoc comment": {
    "prefix": "jd",
    "body": ["/** $0 */"]
  }
}
```

### 2️⃣ 自定义快捷键

`keybindings,json`

```json
[
  {
    "key": "cmd+'",
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus",
    "args": { "name": "JSDoc 注释 Add JSDoc comment" }
  }
]
```

这样，在 VSCode 中按下 `cmd+'` 就可以快速生成 `/** $0 */` 了。
