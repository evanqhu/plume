---
title: hover-mixin
createTime: 2025/03/12 17:16:50
permalink: /styles/tjvr5otf/
---

自定义一个 scss 的 hover mixin

```scss
// 鼠标悬浮样式
@mixin hover {
  @media (pointer: fine) {
    cursor: pointer; // 鼠标变成小手
    -webkit-tap-highlight-color: transparent; // 取消移动端点击样式
    transition: all 0.3s ease; // 添加平滑过渡

    &:hover {
      @content; // 插入自定义样式内容，相当于"插槽"机制
    }
  }
}
```
