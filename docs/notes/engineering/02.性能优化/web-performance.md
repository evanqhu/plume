---
title: 网页性能指标
createTime: 2025/01/24 10:45:21
permalink: /engineering/jk1h90h7/
---

## LCP (Largest Contentful Paint)

描述：页面中最大可见内容的渲染时间，通常指主标题或图片。

目标：LCP 越小越好，通常希望 LCP 在 2.5 秒内完成。

## CLS (Cumulative Layout Shift)

描述：页面中所有可见元素的布局变化的总和，页面内容的视觉稳定性，避免加载过程中元素位置突然改变。

目标：CLS 越小越好，通常希望 CLS 在 0.1 秒内完成。

## INP (Interaction to Next Paint)

描述：用户与页面交互后，到页面内容发生变化的时间。

目标：INP 越小越好，通常希望 INP 在 50 毫秒内完成。

## TTFB (Time To First Byte)

描述：从用户发起请求到服务器返回第一个字节的时间。

目标：TTFB 越小越好，通常希望 TTFB 在 200 毫秒内完成。

## FCP (First Contentful Paint)

描述：页面中第一个内容（如文本、图像）被渲染到屏幕上的时间。

目标：FCP 越小越好，通常希望 FCP 在 1.8 秒内完成。

## FMP (First Meaningful Paint)

描述：页面中第一个有意义的元素被渲染到屏幕上的时间。

目标：FMP 越小越好，通常希望 FMP 在 2 秒内完成。
