---
title: 问询模式
createTime: 2025/04/22 16:22:46
permalink: /others/08b4oily/
---

使用问询模式解决交通灯问题

::: demo

```html
<div class="traffic-light">
  <div class="light-container">
    <div class="light-item red"></div>
    <div class="light-item yellow"></div>
    <div class="light-item green"></div>
  </div>
  <div class="time">90</div>
</div>
```

```js
class TrafficLight {
  constructor(lights) {
    // 传入的灯的配置
    this._lights = lights;
    // 当前灯的下标
    this._currentIndex = 0;
    // 当前灯切换的时间戳
    this._switchTime = Date.now();
  }

  // 访问器属性，获取当前灯的配置信息
  get currentLight() {
    return this._lights[this._currentIndex];
  }

  // 计算上一次切换灯到现在经过的时间
  _disTime() {
    return Date.now() - this._switchTime;
  }

  // 更新灯的状态
  _update() {
    while (1) {
      // 如果经过的时间不够切换灯
      if (this._disTime() < this.currentLight.duration) {
        break;
      }

      // 切换灯
      this._switchTime += this.currentLight.duration;
      this._currentIndex = (this._currentIndex + 1) % this._lights.length;
    }
  }

  // 获取当前灯的状态
  getCurrentLight() {
    // 更新灯的状态
    this._update();

    return {
      color: this.currentLight.color,
      remaining: this.currentLight.duration - this._disTime(),
    };
  }
}

/** ---------------------------------------------------- */
// 创建一个交通灯实例：红灯5秒，黄灯3秒，绿灯5秒
const light = new TrafficLight([
  {
    color: "red",
    duration: 5000,
  },
  {
    color: "yellow",
    duration: 3000,
  },
  {
    color: "green",
    duration: 5000,
  },
]);

const trafficLight = document.querySelector(".traffic-light");
const time = document.querySelector(".time");

// 更新交通灯和时间
function update() {
  // 获取当前灯的配置
  const current = light.getCurrentLight();
  // 更新交通灯样式
  trafficLight.className = `traffic-light ${current.color}`;
  // 更新时间
  time.textContent = Math.ceil(current.remaining / 1000);
}
// 初始化更新一次
update();

// 每帧更新一次
function ref() {
  // 在下一帧执行一次回调函数
  requestAnimationFrame(() => {
    ref(); // 请求下一帧的执行
    update(); // 更新交通灯和时间
  });
}
ref();
```

```css
@import url('https://fonts.cdnfonts.com/css/ds-digital');

.traffic-light {
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.light-container {
  width: 300px;
  display: flex;
  justify-content: space-around;
}

.light-item {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ccc;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);
}

.traffic-light.red .light-item.red {
  background-color: #f00;
}

.traffic-light.yellow .light-item.yellow {
  background-color: #ff0;
}

.traffic-light.green .light-item.green {
  background-color: #0f0;
}

.time {
  font-size: 48px;
  font-family: DS-Digital;
}
```

:::
