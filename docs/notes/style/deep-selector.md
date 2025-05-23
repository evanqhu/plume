---
title: 深度作用选择器
createTime: 2024/12/23 11:52:21
permalink: /style/g9se3d85/
---

::: note
<https://cn.vuejs.org/api/sfc-css-features.html>

<https://juejin.cn/post/6978781674070884366>

<https://juejin.cn/post/7413669480624357386>

<https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8>
:::

## 概念

在 Vue 中，当 `<style>` 标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素，父组件的样式将不会渗透到子组件。 如果你希望 scoped 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用深度选择器。

添加 scoped 属性之后，会给组件中的元素添加一个唯一的动态属性，这样样式就只作用于当前组件内的元素了。

## 深度选择器

如果要修改内部组件的样式，就需要使用到样式穿透

### 1️⃣ `>>>`

不支持 sass；兼容性差，不推荐使用

```css
<style scoped>
.parent {
  >>> .child {
    color: red;
  }
}
</style>
```

### 2️⃣ `/deep/`

不支持 sass

```css
<style scoped>
.parent {
  /deep/ .child {
    color: red;
  }
}
</style>
```

### 3️⃣ `::v-deep`

Vue 3 中弃用（目前也能用）

```scss
<style scoped lang="scss">
::v-deep .demo {
  color: red;
}
</style>
```

### 4️⃣ `:deep()` 伪类

推荐使用

```scss
<style scoped lang="scss">
.parent :deep(.demo) {
  color: red;
}
</style>
```

上面的代码被编译成

```css
.a[data-v-f3f3eg9] .b {
  color: red;
}
```

## scoped 含义

- `.login-container` 这是一个普通的 class 选择器，用于选中 class 为 "login-container" 的元素
- `[data-v-37dfd6fc]` 这是一个属性选择器，用于选中具有 `data-v-37dfd6fc` 属性的元素

### 在 Vue 中的含义

- Vue 的 scoped CSS：在 Vue 中，当给 `<style>` 标签添加 `scoped` 属性时，Vue 会给组件中的所有元素添加一个唯一的 `data-v-*` 属性。这个属性的作用是将样式的作用域限制在当前组件内，避免样式冲突。
- 选择器作用：因此，`.login-container[data-v-37dfd6fc]` 这个选择器结合了 class 选择器和属性选择器，其作用是：
  - **选中:** 选中当前组件中 class 为 "login-container" 的元素。
  - **确保样式作用域:** 由于 `data-v-37dfd6fc` 是当前组件独有的属性，因此确保了样式只作用于当前组件内的 "login-container" 元素，避免了样式冲突。

### 总结

`.login-container[data-v-37dfd6fc]` 这个选择器在 Vue 中主要用于：

- 精确选中组件内的元素: 避免了同名 class 在不同组件中产生冲突。
- 保证样式的作用域: 确保样式只作用于当前组件，提高了样式的模块化和可维护性。

### 为什么有 `data-v-37dfd6fc` 这样的属性？

- Vue 的编译过程: 当 Vue 编译模板时，会给组件中的每个元素添加一个唯一的 `data-v-*` 属性。
- 作用域隔离: 这个属性是 Vue 实现 scoped CSS 的关键，通过这个属性，Vue 可以区分不同组件的样式。
- 属性值: `data-v-37dfd6fc` 中的 `37dfd6fc` 是一个随机生成的 ID，保证了每个组件的属性值都是唯一的。

### 常见问题

- 为什么 `data-v-*` 属性中的 ID 是随机的？ 为了避免不同组件之间的样式冲突，Vue 会为每个组件生成一个唯一的 ID。
- 我可以手动修改 `data-v-*` 属性吗？ 不建议手动修改，因为这可能会破坏 Vue 的样式作用域机制。

总之，`data-v-*` 属性是 Vue 实现 scoped CSS 的核心机制，理解这个属性对于深入了解 Vue 的样式系统非常重要。

> 为了避免过多使用样式穿透，可以在一个组件中写两个 style 标签，一个加 scoped，一个不加，不加的就用来修改 UI 组件库或内部其他组件的样式的样式

Vue 的作用域样式 Scoped CSS 的实现思路如下：

1. 为每个组件实例（注意：是组件的实例，不是组件类）生成一个能唯一标识组件实例的标识符，我称它为组件实例标识，简称实例标识，记作 InstanceID；
2. 给组件模板中的每一个标签对应的 Dom 元素（组件标签对应的 Dom 元素是该组件的根元素）添加一个标签属性，格式为 `data-v-实例标识`，示例：`<div data-v-e0f690c0="" >`；
3. 给组件的作用域样式 `<style scoped>` 的每一个选择器的最后一个选择器单元增加一个属性选择器 `原选择器[data-v-实例标识]` ，示例：假设原选择器为 `.cls #id > div`，则更改后的选择器为 `.cls #id > div[data-v-e0f690c0]`；
