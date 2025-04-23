---
title: 滚动捕捉
createTime: 2025/04/08 14:34:01
permalink: /style/cm2r7k1g/
---

::: note
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type>

<https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-align>
:::

在现代网页开发中，尤其是在需要实现平滑滚动和精确对齐的场景中，`scroll-snap-type` 和 `scroll-snap-align` 是非常有用的 CSS 属性。它们可以帮助你创建流畅的滚动体验，常用于实现滑动视图、图片画廊等组件。

## `scroll-snap-type`

`scroll-snap-type` 属性用于指定容器的滚动行为，决定在滚动时如何精确对齐子元素。它的作用是设定容器的滚动“捕捉”方式。

**语法：**

```css
scroll-snap-type: <axis> <mandatory | proximity>;
```

- `<axis>`：指定滚动的方向，可以是以下值之一：

  - `x`：表示水平滚动。
  - `y`：表示垂直滚动。
  - `block`：表示块级滚动，通常是垂直滚动，适用于块级布局。
  - `inline`：表示内联滚动，通常是水平滚动，适用于行内布局。

- `<mandatory | proximity>`：
  - `mandatory`：滚动时将强制捕捉到一个子元素（即不会自由滚动，必须对齐）。
  - `proximity`：滚动时在接近某个子元素时会自动捕捉，滚动比较灵活。

**例子：**

```css
.container {
  scroll-snap-type: y mandatory;
}
```

这个例子表示容器将在垂直方向进行强制捕捉，滚动到最近的子元素。

## `scroll-snap-align`

`scroll-snap-align` 属性用于控制单个滚动元素相对于容器的对齐方式。它定义了滚动子元素在容器内如何对齐。

**语法：**

```css
scroll-snap-align: <start | end | center | none>;
```

- `start`：子元素的起始位置与容器的起始位置对齐。
- `end`：子元素的结束位置与容器的结束位置对齐。
- `center`：子元素在容器内居中对齐。
- `none`：不进行对齐，子元素的位置会保持自由。

**例子：**

```css
.item {
  scroll-snap-align: start;
}
```

这个例子表示每个子元素（`.item`）会在滚动时将其起始位置与容器的起始位置对齐。

## 结合使用示例

::: demo

```html
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

```css
.container {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  border: 1px solid #000;
  height: 5rem;
  line-height: 5rem;
}

.item {
  flex: 0 0 100%; /* 每个子元素占满容器 */
  scroll-snap-align: start; /* 每个子元素起始位置对齐容器起始位置 */
  text-align: center;
}
```

:::

在这个示例中，滚动容器会水平滚动，每个 `.item` 元素会在滚动时强制对齐到容器的起始位置。

## 总结

- `scroll-snap-type` 控制容器的滚动捕捉方式和方向，能够设置强制或灵活的滚动对齐。
- `scroll-snap-align` 控制每个滚动子元素如何在容器内对齐。

这两个属性通常结合使用，用于实现平滑且精确的滚动体验，广泛应用于滑动组件、图像画廊、新闻轮播等界面设计中。


**基于 scroll snap 的超轻量的 Vue 轮播图组件**
<RepoCard repo="bartdominiak/vue-snap" />
