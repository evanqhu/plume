---
title: hover-mixin
createTime: 2025/03/12 17:16:50
permalink: /styles/tjvr5otf/
---

自定义一个 scss 的 hover mixin

```scss
// 鼠标悬浮样式
@mixin hover($opacity: null, $color: null, $bg: null, $scale: null) {
  @media (pointer: fine) {
    cursor: pointer; // 鼠标变成小手
    -webkit-tap-highlight-color: transparent; // 取消移动端点击样式
    transition: opacity, color, background-color, transform 0.25s ease; // 添加平滑过渡

    &:hover {
      // 仅在传入有效值时才设置对应的样式
      @if $opacity != null {
        opacity: $opacity; // 鼠标悬浮时改变透明度
      }

      @if $color != null {
        color: $color; // 鼠标悬浮时改变文字颜色
      }

      @if $bg != null {
        background: $bg; // 鼠标悬浮时改变背景色
      }

      @if $scale != null {
        transform: scale($scale); // 鼠标悬浮时放大
      }
    }
  }
}
```
