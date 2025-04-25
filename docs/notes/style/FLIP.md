---
title: FLIP 动画
createTime: 2025/04/25 11:26:44
permalink: /style/ktrxxeya/
---

FLIP 是 First, Last, Invert, Play 的缩写，是一种用于创建流畅动画的动画技术。Vue 中的 `transition` 组件就是基于 FLIP 实现的。

## 原理

FLIP 动画的原理是：

1. **First**: 记录元素的初始状态（位置、大小等）
2. **Last**: 记录元素的最终状态
3. **Invert**: 计算初始状态和最终状态之间的差异，并应用反向变换
4. **Play**: 移除反向变换，让元素自然过渡到最终状态

## 实现步骤

1. **First**: 使用 `getBoundingClientRect()` 获取元素的初始位置和尺寸
2. **Last**: 触发 DOM 变化后，再次获取元素的位置和尺寸
3. **Invert**: 计算差异并应用 transform 属性
4. **Play**: 使用 CSS transition 或 Web Animations API 实现动画

## 代码示例

```javascript
function flipAnimation(element) {
  const list = document.getElementById("list");

  // 1. First 获取初始状态
  const first = element.getBoundingClientRect();

  // 触发 DOM 变化
  element.classList.add("active");

  // 移动元素到最终位置
  list.appendChild(element);

  // 2. last 获取最终状态
  const last = element.getBoundingClientRect();

  // 3. Invert 计算差异并应用反向变换
  const deltaX = first.left - last.left;
  const deltaY = first.top - last.top;
  const deltaWidth = first.width / last.width;
  const deltaHeight = first.height / last.height;

  // 应用反向变换，将元素移动到初始位置和大小
  element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaWidth}, ${deltaHeight})`;

  /** 注意⚠️：代码执行到这里，用户是看不到样式变化的，因为浏览器还没有重绘，所以需要等待下一帧 */

  requestAnimationFrame(() => {
    // 4. Play: 移除反向变换，让元素自然过渡
    element.style.transition = "transform 0.5s ease-out";
    element.style.transform = "";

    // 动画结束后清理样式
    item1.addEventListener(
      "transitionend",
      () => {
        item1.style.transition = "";
        item1.classList.remove("moving");
      },
      { once: true }
    );
  });
}
```

## 优点

1. 性能优化：使用 transform 和 opacity 进行动画，避免重排
2. 流畅性：通过反向变换实现更自然的动画效果
3. 灵活性：可以应用于各种 DOM 变化场景

## 应用场景

1. 列表重排序
2. 元素位置变化
3. 模态框打开/关闭
4. 图片画廊切换

## 注意事项

1. 确保使用 `requestAnimationFrame` 来优化性能
2. 动画结束后记得清理样式
3. 考虑使用 `will-change` 属性来提示浏览器优化
4. 注意处理动画中断的情况

@[demo html](./demos/flip-demo.html)
