---
title: CSS
createTime: 2025/03/12 17:03:48
permalink: /style/
---

CSS 有两个重要的知识点：视觉格式化模型和属性值的计算过程。

## 视觉格式化模型

视觉格式化模型是 CSS 中一个重要的概念，它描述了浏览器如何将 HTML 元素渲染到屏幕上。视觉格式化模型包括以下几个部分：

- 包含块  
  包含块（containing block）是用来计算元素尺寸和定位的参考区域。大多数情况下，元素的包含块是其最近的定位祖先元素或者根元素（如 `<html>`）。  
  The containing block is the ancestor element that determines the size and position of the current element.

- 包含块的尺寸  
  包含块的尺寸通常由其父元素的内容区（content area）决定。对于根元素来说，包含块的尺寸就是视口（viewport）的尺寸。  
  The size of the containing block is usually determined by the content area of its parent element.

- 包含块的定位  
  定位（positioning）指的是元素在包含块中的具体位置。常见的定位方式有 static、relative、absolute 和 fixed。绝对定位和固定定位的元素，其位置是相对于最近的定位祖先（即包含块）来计算的。  
  Positioning refers to how an element is placed within its containing block.

- 包含块的浮动  
  浮动（float）会影响元素的布局方式。浮动元素会脱离常规文档流，向左或向右移动，直到碰到包含块的边界或其他浮动元素。  
  Floating elements are taken out of the normal flow and positioned to the left or right of their containing block.

- 包含块的清除  
  清除（clear）用于控制元素是否可以出现在浮动元素的旁边。通过设置 clear 属性，可以让元素"清除"前面的浮动，避免与浮动元素重叠。  
  The clear property is used to control whether an element can be next to floating elements.

### 视觉格式化模型的类型

视觉格式化模型主要有以下几种类型：

- 块级格式化上下文（Block Formatting Context, BFC）  
  BFC 是页面上的一块独立渲染区域，只有块级盒子参与。常见的触发方式有：`float` 不为 `none`，`overflow` 不为 `visible`，`display: flow-root`，`position: absolute/fixed` 等。BFC 可以用来解决外边距重叠、清除浮动等问题。

- 行内格式化上下文（Inline Formatting Context, IFC）  
  IFC 主要用于行内元素的布局，如文本、`span`、`a` 等。行内元素会在水平方向上排列，遇到边界或换行符时自动换行。

- 弹性格式化上下文（Flex Formatting Context, FFC）  
  由 `display: flex` 或 `inline-flex` 触发，子元素会按照弹性盒模型进行排列和分配空间。

- 网格格式化上下文（Grid Formatting Context, GFC）  
  由 `display: grid` 或 `inline-grid` 触发，子元素会按照网格布局进行排列。

### 视觉格式化模型的作用

- 决定元素如何生成盒子（box），以及这些盒子如何排列和相互影响
- 影响元素的尺寸、位置、层叠关系等
- 是理解 CSS 布局和排版的基础

## 属性值的计算过程

CSS 属性值的计算过程分为以下几个阶段：

1. 指定值（Specified Value）  
   由开发者在样式表中直接指定的属性值，比如 `width: 100px;`。

2. 计算值（Computed Value）  
   浏览器根据继承、初始值、百分比等规则，将指定值转换为计算值。例如，`em`、`rem`、百分比等会被解析为相对于父元素或根元素的值。

3. 使用值（Used Value）  
   计算值经过进一步处理后，得到最终用于布局的值。例如，`width: auto` 会根据内容和上下文被解析为具体的像素值。

4. 实际值（Actual Value）  
   元素在渲染时的最终值，可能会受到其他因素影响（如滚动条、溢出等）。

### 计算过程示例

以 `width` 属性为例：

- 如果指定为 `width: 50%`，浏览器会先找到包含块的宽度（计算值），再算出实际像素值（使用值），最后渲染到页面上（实际值）。

### 继承与初始值

- 并非所有属性都能继承。比如 `color` 可以继承，`width` 不能。
- 没有被指定的属性会使用初始值（initial value）。

---

如果你还想了解更多 CSS 相关知识，欢迎继续提问！
