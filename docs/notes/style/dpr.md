---
title: DPR
createTime: 2025/04/23 16:56:41
permalink: /style/h8jzo1xf/
---

DPR 是设备像素比，是设备像素和 CSS 像素的比值。我们使用 `window.devicePixelRatio` 来获取设备的 DPR。

## 解决图片清晰度的问题

一张图片有三个尺寸

- 原始尺寸 `naturalWidth`
- 样式尺寸 `width`
- 缩放倍率 `window.devicePixelRatio`

想要图片清晰，需要满足以下条件即可。

`原始尺寸 = 样式尺寸 * 缩放倍率`
