---
title: Animation
createTime: 2025/04/10 09:38:12
permalink: /styles/dz4vh7px/
---

## 利用延迟实现复杂动画

在动画暂停的情况下，通过控制动画延迟来控制动画的位置。

::: demo

```html
<div class="container">
  <div class="ball-container">
    <div class="ball"></div>
  </div>
  <input class="input" type="range" min="0" max="1" step="0.01" value="0" />
</div>
```

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.ball-container {
  width: 550px;
  height: 100px;
  border: 1px solid #000;
  display: flex;
  align-items: center;
}

.ball {
  --delay: 0s;
  width: 50px;
  height: 50px;
  background-color: red;
  border-radius: 50%;
  animation: move 1s linear forwards paused;
  animation-delay: var(--delay);
  /* 动画延迟 */
}

@keyframes move {
  50% {
    transform: translateX(250px) scale(0.5);
    background: green;
  }
  100% {
    transform: translateX(500px) scale(1);
    background: blue;
  }
}
```

```js
const input = document.querySelector(".input");
const ball = document.querySelector(".ball");
const calc = () => {
  ball.style.setProperty("--delay", -input.value + "s");
};
input.oninput = calc;
calc();
```

:::
