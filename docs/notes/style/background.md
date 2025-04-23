---
title: 背景属性
createTime: 2025/03/13 13:16:54
permalink: /style/vyp90uph/
---

## 01 背景属性

### 背景颜色 `background-color`

符合 CSS 中颜色规范的值。默认背景颜色是 `transparent`。

### 背景图片 `background-image`

`url(图片的地址)`

注意：当图片地址是变量时，建议在变量外面加上引号

### 背景重复方式 `background-repeat`

- `repeat`：背景重复，铺满整个元素 (默认值)
- `repeat-x`：背景重复，横向铺满整个元素
- `repeat-y`：背景重复，纵向铺满整个元素
- `no-repeat`：不重复，背景图片只显示一次

### 背景定位 `background-position`

1. 通过关键字设置位置
   - 写两个值，用空格隔开
   - 水平： `left` 、 `center` 、 `right`
   - 垂直： `top` 、 `center` 、 `bottom`
   - 如果只写一个值，另一个方向的值取 `center`
2. 通过数值设置位置
   - 以元素左上角，为坐标原点，设置图片左上角的位置。
   - 两个值，分别是 x 坐标和 y 坐标。
   - 只写一个值，会被当做 x 坐标， y 坐标取 `center`

### 背景原点 `background-origin`

- `padding-box`：从 `padding` 区域开始显示背景图像 (默认值)
- `border-box`：从 `border` 区域开始显示背景图像
- `content-box`：从 `content` 区域开始显示背景图像

### 背景裁剪 `background-clip`

- `border-box`：从 `border` 区域开始裁剪背景图像 (默认值)
- `padding-box`：从 `padding` 区域开始裁剪背景图像
- `content-box`：从 `content` 区域开始裁剪背景图像
- `text`：背景图只呈现在文字上。

### 背景尺寸 `background-size`

1. 用长度值指定背景图片大小，不允许负值 `background-size: 300px 200px;`
2. 用百分比指定背景图片大小，不允许负值 `background-size: 100% 100%;`
3. `auto`：背景图片的真实大小 (默认值)
4. `contain`：将背景图片等比缩放，使背景图片的宽或高，与容器的宽或高相等，再将完整背景图片包含在容器内 (可能会造成容器里部分区域没有背景图片)
5. `cover`：将背景图片等比缩放，直到完全覆盖容器，图片会尽可能全的显示在元素上，但要注意：背景图片有可能显示不完整 (相对比较好的选择)

### 复合属性 `background`

语法：`background: color url repeat position / size origin clip`

::: note

1. `origin` 和 `clip` 的值如果一样，如果只写一个值，则 `origin` 和 `clip` 都设置；如果设置了两个值，前面的是 `origin` ，后面的 `clip`
2. `size` 的值必须写在 `position` 值的后面，并且用 `/` 分开

:::

### 多背景图

```css
background: url('../images/bg-lt.png') no-repeat,
            url('../images/bg-rt.png') no-repeat right top,
            url('../images/bg-lb.png') no-repeat left bottom,
            url('../images/bg-rb.png') no-repeat right bottom;
```
