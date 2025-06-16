---
title: Vuex
createTime: 2025/05/30 15:53:08
permalink: /vue/l9ohsg3n/
---

`npm i vuex@3`

## 概念

在 Vue 中实现集中式状态（数据）管理的一个 **Vue 插件**，对 Vue 应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。当多个组件需要共享数据时使用。

<img src="https://s2.loli.net/2024/06/14/nihWbEHpsATBo7q.png" alt="vuex.png" style="zoom: 67%;" />

**五个配置项：**

- State：是一个对象，用于存储数据
- Actions：是一个对象，用于响应组件中的动作
- Mutations：是一个对象，用于操作数据
- Getter：从基本数据 (State) 派生的数据，相当于 state 的计算属性
- Modules：模块化 Vuex，可以让每一个模块拥有自己的 state、mutation、action、getters，使得结构非常清晰，方便管理

## 搭建 Vuex 环境

- 创建文件：`src/store/index.js` 该文件用于创建 store

```js
/******************** src/store/index.js ********************/
import Vue from "vue"; // 引入 Vue 核心库
import Vuex from "vuex"; // 引入 Vuex 插件
Vue.use(Vuex); // 应用 Vuex 插件。应用该插件之后，就可以在创建 vm 的时候传入 store 配置项

// 准备 state 对象：保存具体的数据
const state = { sum: 0 };

// 准备 actions 对象：响应组件中用户的动作（业务逻辑写在这里）
const actions = {
  // context 相当于精简版的 store，身上有 dispatch, commit, state 等方法和属性
  jiaOdd(context, value) {
    if (context.state.sum % 2) {
      context.commit("JIA", value); // mutation 里面的方法名都用大写
    }
  },
  jiaWait(context, value) {
    setTimeout(() => {
      context.commit("JIA", value);
    }, 500);
  },
};

// 准备 mutations 对象：修改 state 中的数据
const mutations = {
  JIA(state, value) {
    // mutations中的方法名一般大写
    state.sum += value;
  },
};

// 创建并暴露 store
export default new Vuex.Store({
  actions: actions,
  mutations, // 对象的简写形式，属性和值相同，只写一个即可
  state,
  getters,
  // 还能写 modules
});
```

- 在 `main.js` 中创建 vm 时传入 `store` 配置项

```js
/******************** 入口文件 main.js ********************/
import Vue from "vue"; // 引入 Vue 核心库
import store from "./store"; // 引入 store（Vuex 插件的引入和使用都写在 Vuex 的配置文件中了）

// 创建 vm
new Vue({
  el: "#app",
  render: (h) => h(App),
  store: store, // 传入store配置项，可简写为 store
});
```

## 基本使用

- 初始化数据、在 store 文件夹下的 `index.js` 文件中配置 `actions` `mutations` `state`

- 组件中读取 Vuex 中的数据 `$store.state.sum`
- 组件中修改 Vuex 中的数据

  - `$store.dispatch('action中的方法名', 数据)`
  - `$store.commit('mutations中的方法名', 数据)`

- 备注：若没有网络请求或其他业务逻辑，组件中也可以越过 actions，即不写 `dispatch`，直接编写 `commit`

```js
/******************** 组件中 vc ********************/
methods: {
  increment() {
    this.$store.commit('JIA', this.n)  // 没有业务逻辑时，可不经过 action，直接 commit
  },
  incrementOdd() {
    this.$store.dispatch('jiaOdd', this.n)  // 经过 action 处理业务逻辑，然后再提交给 mutation
  },
}
// mapMutations 和 mapActions 分别用来替代以上两行代码
```

## getters 的使用

- 功能：当 state 中的数据需要经过加工后再使用时，可以使用 getters 加工；相比于计算属性，它的优点在于可以跨组件复用；
- 组件中读取数据：`$store.getters.bigSum`

```js
const state = { sum: 0 };
const getters = {
  // 用于对 state 中的数据进行加工
  bigSum(state) {
    return state.sum * 10;
  },
};

// 创建并暴露 store
export default new Vuex.Store({
  ...getters,
});
```

## 四个 map 方法的使用

当组件需要多次使用 Vuex 中的数据时，就需要写很多次 `$store.state`，可以使用计算属性将 state 中的数据映射出来。以下 map 方法可以替代 computed，直接在组件中引入并使用。

> 对象 `{ }` 中的 key 和 value，其中 key 永远都是字符串，所以可以不加引号；但是 value 一般要加引号，如果不加的话，就相当于是一个变量了。
>
> 对象的简写形式：`{a=a}` 可以简写为 `{a}`。注意第一个 a 为字符串，第二个 a 为变量。`{a: 'a'}`不可简写

- **mapState 方法**：用于帮助我们映射 `state` 中的数据为计算属性；

  - mapState 是一个对象，key 是属性（方法）名，value 是函数；computed 也是对象，一个对象不能直接写在一个对象里面；

  * `...mapState` 的意思是把 mapState 中每一组 key-value 都拿出来放到 computed 中，扩展运算符；
  * 对象 key 是组件 vc 中的属性名，value 是 `$store.state` 中的属性名，二者一致时可以简写成一个。

```js
// 先引入
import { mapState } from 'vuex'

// 写在计算属性中
computed: {
  // 借助 mapState 生成计算属性：sum、school、subject（对象写法）
  ...mapState({ sum: 'sum', school: 'school', subject: 'subject' }),
  // 借助 mapState 生成计算属性：sum、school、subject（数组写法）
  ...mapState(['sum', 'school', 'subject']),
  // 相当于
  sum() { return this.$store.state.sum }
}
```

- **mapGetters 方法**：用于帮助我们映射 `getters` 中的数据为计算属性

```js
import { mapGetters } from 'vuex'

computed: {
  // 借助 mapGetters 生成计算属性：bigSum（对象写法）
  ...mapGetters({ bigSum: 'bigSum' }),
  // 借助 mapGetters 生成计算属性：bigSum（数组写法）
  ...mapGetters(['bigSum'])
}
```

- **mapActions 方法**：用于帮助我们生成与 `actions` 对话的方法，即：包含 `$store.dispatch(xxx)` 的函数

```js
import { mapActions } from 'vuex'

// 写在方法中
methods:{
  // 靠 mapActions 生成：incrementOdd、incrementWait（对象形式）
  ...mapActions({ incrementOdd:'jiaOdd', incrementWait:'jiaWait' })
  // 靠 mapActions 生成：incrementOdd、incrementWait（数组形式）
  ...mapActions(['jiaOdd', 'jiaWait'])
  // 相当于
  incrementOdd(){ this.$store.dispatch('jiaOdd', this.n)	},
}
```

- **mapMutations 方法**：用于帮助我们生成与 `mutations` 对话的方法，即：包含 `$store.commit(xxx)` 的函数

```js
import { mapMutations } from 'vuex'

methods:{
  // 靠 mapActions 生成：increment、decrement（对象形式）
  ...mapMutations({ increment: 'JIA', decrement:'JIAN' }),
  // 靠 mapMutations 生成：JIA、JIAN（数组形式）
  ...mapMutations(['JIA', 'JIAN']),
  // 相当于
  increment() { this.$store.commit('JIA', this.n) }
}
```

> 备注：mapActions 与 mapMutations 使用时，若需要传递参数：需要在模板中绑定事件时传递好参数，否则参数是事件对象。
>
> `@click="increment"` 不携带参数，默认传递鼠标事件
>
> `@click="increment(n)"` 传递参数 n

## 模块化+命名空间

- 目的：让代码更好维护，让多种数据分类更加明确；
- 修改 `store/index.js` ，把不同组件的 Vuex 写在不同的 JS 文件中，也可以在同一个文件中

```js
const countOptions = {
  namespaced: true,  // 开启命名空间
  state: { x: 1 },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
  }
}

const personOptions = {
  namespaced: true,  // 开启命名空间
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

export default new Vuex.Store({
  modules: {  // 模块，它也可以嵌套
    countAbout: countOptions,
    personAbout: personOptions
  }
})
```

- 开启命名空间 `namespaced: true` 后，组件中读取 `state` 数据：

```js
/*********** Vuex 模块化时不使用 map 方法 **********/
this.$store.state.personAbout.list  // 读取 state
this.$store.getters['personAbout/firstPersonName']  // 读取 getters
this.$store.dispatch('personAbout/addPersonWang', personObj)  // 调用 dispatch
this.$store.commit('personAbout/ADD_PERSON', personObj)  // 调用 commit

/*********** Vuex 模块化时使用 map 方法 **********/
...mapState('countAbout', ['sum', 'school', 'subject'])  // 第一个参数读取命名空间
...mapGetters('countAbout', ['bigSum'])
...mapActions('countAbout', { incrementOdd: 'jiaOdd', incrementWait: 'jiaWait' })
...mapMutations('countAbout', { increment: 'JIA', decrement: 'JIAN' })
```
