---
title: SVG
createTime: 2024/12/30 10:35:39
permalink: /others/82pr0swv/
---

可缩放矢量图形（Scalable Vector Graphics，SVG）基于 XML 标记语言，用于描述二维的矢量图形。

作为一个基于文本的开放网络标准，SVG 能够优雅而简洁地渲染不同大小的图形，并和 CSS、DOM、JavaScript 和 SMIL 等其他网络标准无缝衔接。**本质上，SVG 相对于图像，就好比 HTML 相对于文本。**

## 一个简单的示例

::: demo

```html
<svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="red" />
  <circle cx="150" cy="100" r="80" fill="green" />
  <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
</svg>
```

:::

绘制流程解释：

1. 从 `<svg>` 根元素开始：

   - 应舍弃来自 (X)HTML 的 doctype 声明，因为基于 DTD 的 SVG 验证导致的问题比它能解决的问题更多。
   - SVG 2 之前 version 属性和 baseProfile 属性用来供其他类型的验证识别 SVG 的版本。SVG 2 已弃用 version 和 baseProfile 这两个属性。
   - 作为 XML 的一种方言，SVG 必须正确的绑定命名空间（在 xmlns 属性中绑定）。请阅读命名空间速成页面获取更多信息。

2. 绘制一个完全覆盖图像区域的矩形 `<rect>`，把背景颜色设为红色。

3. 一个半径 80px 的绿色圆圈 `<circle>` 绘制在红色矩形的正中央（向右偏移 150px，向下偏移 100px）。

4. 绘制文字“SVG”。文字被填充为白色，通过设置居中的锚点把文字定位到期望的位置：在这种情况下，中心点应该对应于绿色圆圈的中点。还可以精细调整字体大小和垂直位置，确保最后的样式是美观的。

::: note
SVG 文件全局有效的规则是“后来居上”，越后面的元素越可见

在 html 中嵌入 svg 时，可以通过 img 标签来包裹 svg 标签

```html
<img>
  <svg version="1.1"
    baseProfile="full"
    width="300" height="200"
    xmlns="http://www.w3.org/2000/svg">
    ...
  </svg>
</img>
```

:::

## 坐标定位

对于所有元素，SVG 使用的坐标系统或者说网格系统，和 Canvas 用的差不多（所有计算机绘图都差不多）。这种坐标系统是：以页面的左上角为 (0,0) 坐标点，坐标以像素为单位，x 轴正方向是向右，y 轴正方向是向下。
<img src="./images/default-grid.png" class="my-img" />

示例：

```html
<rect x="0" y="0" width="100" height="100" />
```

定义一个矩形，即从左上角开始，向右延展 100px，向下延展 100px，形成一个 100\*100 大的矩形。

```html
<svg width="200" height="200" viewBox="0 0 100 100">…</svg>
```

这里定义的画布尺寸是 200\*200px。但是，viewBox 属性定义了画布上可以显示的区域：从 (0,0) 点开始，100 宽 \* 100 高的区域。这个 100\*100 的区域，会放到 200\*200 的画布上显示。于是就形成了放大两倍的效果。

## 基本形状

要想插入一个形状，你可以在文档中创建一个元素。不同的元素对应着不同的形状，并且使用不同的属性来定义图形的大小和位置。

::: demo title="All Base Shapes"

```html
<svg width="200" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5" />
  <rect x="60" y="10" rx="10" ry="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5" />

  <circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5" />
  <ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" stroke-width="5" />

  <line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="5" />
  <polyline
    points="60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145"
    stroke="orange"
    fill="transparent"
    stroke-width="5"
  />

  <polygon
    points="50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180"
    stroke="green"
    fill="transparent"
    stroke-width="5"
  />

  <path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5" />
</svg>
```

:::

### 1. 矩形 rect

```html
<rect x="10" y="10" width="30" height="30" /> <rect x="60" y="10" rx="10" ry="10" width="30" height="30" />
```

- x: 矩形左上角的 x 位置
- y: 矩形左上角的 y 位置
- width: 矩形的宽度
- height: 矩形的高度
- rx: 圆角的 x 方位的半径
- ry: 圆角的 y 方位的半径

### 2. 圆形 circle

```html
<circle cx="25" cy="75" r="20" />
```

- r: 圆的半径
- cx: 圆心的 x 位置
- cy: 圆心的 y 位置

### 3. 椭圆 ellipse

```html
<ellipse cx="75" cy="75" rx="20" ry="5" />
```

- rx: 椭圆的 x 半径
- ry: 椭圆的 y 半径
- cx: 椭圆中心的 x 位置
- cy: 椭圆中心的 y 位置

### 4. 线条 line

Line 绘制直线。它取两个点的位置作为属性，指定这条线的起点和终点位置。

```html
<line x1="10" x2="50" y1="110" y2="150" stroke="black" stroke-width="5" />
```

- x1: 起点的 x 位置
- y1: 起点的 y 位置
- x2: 终点的 x 位置
- y2: 终点的 y 位置

### 5. 折线 polyline

Polyline 是一组连接在一起的直线。因为它可以有很多的点，折线的所有点位置都放在一个 points 属性中

```html
<polyline points="60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145" />
```

- points: 点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开。每个点必须包含 2 个数字，一个是 x 坐标，一个是 y 坐标。所以点列表 (0,0), (1,1) 和 (2,2) 可以写成这样：“0 0, 1 1, 2 2”。

### 6. 多边形 polygon

Polygon 和折线很像，它们都是由连接一组点集的直线构成。不同的是，polygon 的路径在最后一个点处自动回到第一个点。

```html
<polygon
  points="50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180"
  stroke="green"
  fill="transparent"
  stroke-width="5"
/>
```

- points: 点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开。每个点必须包含 2 个数字，一个是 x 坐标，一个是 y 坐标。所以点列表 (0,0), (1,1) 和 (2,2) 可以写成这样：“0 0, 1 1, 2 2”。路径绘制完后闭合图形，所以最终的直线将从位置 (2,2) 连接到位置 (0,0)。

### 7. 路径 path

可以使用 path 绘制任意形状，将在后面单独介绍

```html
<path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5" />
```

- d: 一个点集数列以及其他关于如何绘制路径的信息

## 路径 path

<https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths>

path 元素的形状是通过属性 d 定义的，属性 d 的值是一个“命令 + 参数”的序列

每一个命令都用一个关键字母来表示，比如，字母“M”表示的是“Move to”命令，当解析器读到这个命令时，它就知道你是打算移动到某个点。跟在命令字母后面的，是你需要移动到的那个点的 x 和 y 轴坐标。比如移动到 (10,10) 这个点的命令，应该写成“M 10 10”。这一段字符结束后，解析器就会去读下一段命令。

::: note
每一个命令都有两种表示方式，一种是用大写字母，表示采用绝对定位。另一种是用小写字母，表示采用相对定位
:::

因为属性 d 采用的是用户坐标系统，所以不需标明单位。

### 1. 直线命令

- M = moveto(M x y) ：将画笔移动到指定的坐标位置 (但不画线)，相当于设置起点。
- L = lineto(L x y) ：在当前位置和新位置（L 前面画笔所在的点）之间画一条线段。
- H = horizontal lineto(H x) ：画一条水平线到指定的 x 位置。
- V = vertical lineto(V y) ：画一条垂直线到指定的 y 位置。
- Z = closepath()：关闭路径，即用一条直线连接当前点与路径的起点。

画一个简单的矩形
::: demo

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 10 H 90 V 90 H 10 L 10 10" />

  <circle cx="10" cy="10" r="2" fill="red" />
  <circle cx="90" cy="90" r="2" fill="red" />
  <circle cx="90" cy="10" r="2" fill="red" />
  <circle cx="10" cy="90" r="2" fill="red" />
</svg>
```

:::

### 2. 曲线命令

- C = Cubic Bézier Curve(C x1 y1 x2 y2 x y)：三次贝塞尔曲线，前两个参数是控制点，最后一个参数是终点。
- S = (S x2 y2 x y)：通常情况下，一个点某一侧的控制点是它另一侧的控制点的对称（以保持斜率不变）。这样，你可以使用一个简写的贝塞尔曲线命令 S；S 命令可以用来创建与前面一样的贝塞尔曲线，但是，如果 S 命令跟在一个 C 或 S 命令后面，则它的第一个控制点会被假设成前一个命令曲线的第二个控制点的中心对称点。

- Q = Quadratic Bézier Curve(Q x1 y1 x y)：二次贝塞尔曲线，前一个参数是控制点，最后一个参数是终点。
- T = (T x y)：快捷命令 T 会通过前一个控制点，推断出一个新的控制点。

- A = Arc(A rx ry x-axis-rotation large-arc-flag sweep-flag x y)：画一段圆弧，(rx, ry) 是弧的半径，x-axis-rotation 是 x 轴的旋转角度，large-arc-flag 和 sweep-flag 是两个标志位，(x, y) 是弧的终点。

## 填充和边框

可以使用几种方法来**着色**（包括指定对象的属性）使用内联 CSS 样式、内嵌 CSS 样式，或者使用外部 CSS 样式文件。大多数的 web 网站的 SVG 使用的是内联样式 CSS，对于这些方法都有优缺点。

### 1. 填充 fill

设置对象内部的颜色

- fill: 填充颜色
- fill-opacity: 填充透明度
- fill-rule: 填充规则

### 2. 边框 stroke

设置绘制对象的线条的颜色

- stroke: 边框颜色
- stroke-width: 边框宽度
- stroke-opacity: 边框透明度
- stroke-dasharray: 边框虚线
- stroke-linecap: 边框线端样式

### 3. 使用 CSS

语法和在 HTML 里使用 CSS 一样，只不过你要把 background-color、border 改成 fill 和 stroke。

::: demo

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" height="60" y="10" width="80" style="stroke: black; stroke-width: 5px; fill: red;" />
</svg>
```

:::

CSS 可以利用 style 属性插入到元素的行间，也可以被移到你所包含的一个特殊的样式部分。不过，我们不会像 HTML 那样把这样的部分塞进 `<head>` 部分，而是把它包含在一个叫做 `<defs>` 的区域

## 渐变

并非只能简单填充颜色和描边，更令人兴奋的是，你还可以创建和并在填充和描边上应用渐变色。

有两种类型的渐变：线性渐变和径向渐变。你必须给渐变内容指定一个 id 属性，否则文档内的其他元素就不能引用它。为了让渐变能被重复使用，渐变内容需要定义在 `<defs>` 标签内部，而不是定义在形状上面。

### 1. 线性渐变

线性渐变沿着直线改变颜色，要插入一个线性渐变，你需要在 SVG 文件的 defs 元素内部，创建一个 `<linearGradient>` 节点。

::: demo

```html
<svg width="120" height="240" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="Gradient1">
      <stop class="stop1" offset="0%" />
      <stop class="stop2" offset="50%" />
      <stop class="stop3" offset="100%" />
    </linearGradient>
    <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="red" />
      <stop offset="50%" stop-color="black" stop-opacity="0" />
      <stop offset="100%" stop-color="blue" />
    </linearGradient>
    <style type="text/css">
      <![CDATA[
              #rect1 { fill: url(#Gradient1); }
              .stop1 { stop-color: red; }
              .stop2 { stop-color: black; stop-opacity: 0; }
              .stop3 { stop-color: blue; }
            ]]>
    </style>
  </defs>

  <rect id="rect1" x="10" y="10" rx="15" ry="15" width="100" height="100" />
  <rect x="10" y="120" rx="15" ry="15" width="100" height="100" fill="url(#Gradient2)" />
</svg>
```

:::

### 2. 径向渐变

径向渐变从中心点向外创建颜色渐变，要插入一个径向渐变，你需要在 SVG 文件的 defs 元素内部，创建一个 `<radialGradient>` 节点。

::: demo

```html
<?xml version="1.0" standalone="no"?>
<svg width="120" height="240" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="RadialGradient1">
      <stop offset="0%" stop-color="red" />
      <stop offset="100%" stop-color="blue" />
    </radialGradient>
    <radialGradient id="RadialGradient2" cx="0.25" cy="0.25" r="0.25">
      <stop offset="0%" stop-color="red" />
      <stop offset="100%" stop-color="blue" />
    </radialGradient>
  </defs>

  <rect x="10" y="10" rx="15" ry="15" width="100" height="100" fill="url(#RadialGradient1)" />
  <rect x="10" y="120" rx="15" ry="15" width="100" height="100" fill="url(#RadialGradient2)" />
</svg>
```

:::

## 图案

patterns（图案）是 SVG 中用到的最让人混淆的填充类型之一。它的功能非常强大。

## 文本

在 SVG 中有两种截然不同的文本模式。一种是写在图像中的文本，另一种是 SVG 字体。此处重点介绍写在图像中的文本。

使用 `<text>` 标签来创建文本。`<text>` 标签的 x 和 y 属性决定了文本在视口中显示的位置。

::: demo

```html
<svg width="120" height="30" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="20">Hello World!</text>
</svg>
```

:::
