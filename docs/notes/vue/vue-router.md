---
title: Vue Router
createTime: 2025/05/30 15:53:36
permalink: /vue/wucyo1sp/
---

- 安装：`npm i vue-router@3` 插件
- 理解： 一个路由（route）就是一组映射关系（key - value），多个路由需要路由器（router）进行管理；
- 前端路由：key 是路径，value 是组件；
- 后端路由：key 是路径，value 是函数；服务器根据请求路径找到匹配的函数来处理请求，返回响应数据；
- 适用于单页面应用（Single Page Web Application, SPA）。整个应用只有一个完整的页面，点击导航链接不会刷新页面，只会做页面的局部更新，数据需要通过 ajax 获取；
- VueRouter 的实例对象（new 出来的）就是一个路由器

## 基本使用

- 在 `main.js` 入口文件中

```js
/******************** 入口文件 main.js ********************/
import Vue from "vue"; // 引入 Vue
import VueRouter from "vue-router"; // 引入 VueRouter 插件
import router from "./router"; // 引入路由器配置文件

Vue.use(VueRouter); // 应用路由插件。应用该插件之后，就可以在创建 vm 的时候传入 router 配置项

// 创建 vm
new Vue({
  el: "#app",
  render: (h) => h(App),
  router: router, // 传入路由配置项
});
```

- 在 `router/index.js` 路由配置文件中

```js
/******************** 路由配置文件 router/index.js ********************/
// 该文件用于创建整个应用的路由器
import VueRouter from "vue-router"; // 引入 VueRouter，一个构造函数
import About from "../views/about"; // 引入路由组件 vm （方法 1）

// 创建并暴露一个路由器
export default new VueRouter({
  routes: [
    {
      path: "/about",
      component: About,
    },
    {
      path: "/home",
      component: () => import("@/views/home"), // 按需引入路由组件（方法 2）
    },
  ],
});
```

- 在组件中借助 `router-link` 标签实现路由的切换，该标签最终会被解析为 `a` 标签；用 `to` 属性指定路由跳转的目标组件，用 `active-class` 属性指定当前组件被激活时使用的样式；
- 用 `router-view` 标签指定路由组件的呈现位置

```vue
<a href="./about.html">About</a>
<!-- 多页面应用使用 <a> 标签实现页面跳转 -->
<!-- **************************************************************** -->
<!-- 在父组件中实现组件切换 -->
<router-link active-class="active" to="/about">About</router-link>
<router-link active-class="active" to="/home">Home</router-link>

<!-- 指定组件的展示位置 -->
<router-view></router-view>
```

## 几个注意点

- 路由组件通常存放在 `views or pages` 文件夹，一般非路由组件通常存放在 `components` 文件夹；
- 路由组件通过 `router-view` 渲染使用，非路由组件通过写组件标签使用；
- 通过切换，“隐藏”了的路由组件，默认是失活 `deactivated` 的，需要的时候再去激活 `activated`；
- 每个组件都有一个 `$route` 属性，里面存储着自己的路由信息( `route.path` `route.params` 等)；
- 每个组件都有一个 `$router` 属性，里面存储着整个应用唯一的 router 。

## 多级路由

- 配置路由规则，使用 `children` 配置项配置子路由：

```js
routes: [
  {
    path: "/home",
    component: Home,
    children: [
      // 通过 children 配置子级路由
      {
        path: "news", // 此处不加斜杠
        component: News,
      },
    ],
  },
];
```

- 跳转（要写完整路径）：

```vue
<router-link to="/home/news">News</router-link>
```

## 路由的 query 参数

- 传递参数（参数写在 `router-link` 的 `to` 属性当中）（无需占位符）；
- 在 to 前面加了冒号之后，就把等号后面的内容当做 js 表达式去解析了（ `v-bind` ）。

```vue
<!-- 跳转并携带 query 参数，to 的字符串写法 -->
<router-link to="/home/message/detail?id=666&title=你好">跳转</router-link>
<router-link :to="`/home/message/detail?id=${m.id}&title=${m.title}`">跳转</router-link>

<!-- 跳转并携带 query 参数，to 的对象写法 -->
<router-link
  :to="{
    path: '/home/message/detail',
    query: { id: m.id, title: m.title },
  }"
>跳转</router-link>
```

- 接收参数：

```js
vc.$route.query.id;
vc.$route.query.title;
```

## 命名路由

- 作用：可以简化路由的跳转，代替 to 之后的路径

```js
// 注册路由的时候给路由命名 router/index.js
{
  name: 'hello',
	path: '/demo',
	component: Demo,
	children: [ {	 } ]
}
```

- 路由跳转（用了 name 就不用 path ）

```vue
<!-- 简化前，需要写完整的路径 -->
<router-link to="/demo/test/welcome">跳转</router-link>

<!-- 简化后，直接通过名字跳转 -->
<router-link :to="{ name: 'hello' }">跳转</router-link>

<!-- 简化写法配合传递参数 -->
<router-link
  :to="{
    name: 'hello',
    query: { id: 666, title: '你好' },
  }"
>跳转</router-link>
```

## 路由的 params 参数

- 配置路由时，**使用占位符声明接收 params 参数**

```js
// 路由器配置文件 router/index.js
{
  name: 'shouye',
	path: '/home:/:id/:title',  // 使用占位符声明接收 params 参数
	component: Home
}
```

- 传递参数（参数写在 `router-link` 的 `to` 当中）

```vue
<!-- 跳转并携带 params 参数，to 的字符串写法 -->
<router-link :to="/home/666/你好">跳转</router-link>
<router-link :to="/home/${m.id}/${m.title}">跳转</router-link>

<!-- 跳转并携带 params 参数，to 的对象写法 -->
<router-link
  :to="{
    name: 'shouye',
    params: {
      id: m.id,
      title: m.title,
    },
  }"
>跳转</router-link>
```

> 注意：路由携带 params 参数时，若使用 to 的对象写法，则不能使用 path 配置项，必须使用 name 配置！

- 接收参数

```js
vc.$route.params.id;
vc.$route.params.title;
```

## 路由的 props 配置项

- 好像很少使用
- 作用：让路由组件更方便地接收参数（query 和 params 方法均可），代替 `$route.xxxx.id` 写法；
- props 配置项写在 `router/index.js` 文件中**需要接收参数的组件中**；
- 理解：在使用 query 和 params 方法传递参数的时候，在路由器里面写上 props 配置项，这样在接收参数的组件中接收参数时，不用写 `$route.xxxx.id`，可以直接用 id，title 等代替。

```js
// 在router/index.js中
{
	name: 'xiangqing',
	path: 'detail',
	component: Detail,
	// 第一种写法：props 值为对象。该对象中所有的键值对的组合最终都会通过 props 传给 Detail 组件；
	// props: { a: 900 }  缺点：传递的是非动态数据

	// 第二种写法：props 值为布尔值。布尔值为 true，则把所有 params 参数通过 props 传给 Detail 组件；
	// props: true

	// 第三种写法：props 值为函数。该函数返回的对象中每一组键值对都会通过 props 传给 Detail 组件。
	props($route) {
		return {
			id: $route.query.id,
			title: $route.query.title
		}
	}
}

// 在 Detail 组件中（接受参数的组件）
props: ['id', 'title']
```

## router-link 的 replace 属性

- 作用：控制路由跳转时操作浏览器历史记录的模式；
- 浏览器的历史记录有两种写入方式

  - `push` 是追加历史记录，路由跳转时候默认为 `push`
  - `replace` 是替换当前记录

- 如何开启 `replace` 模式：`<router-link replace ...>News</router-link>`

## 编程式路由导航

- 作用：不借助 `<router-link> ` 实现路由跳转，让路由跳转更加灵活；使用组件身上 `$router` 的方法；
- 案例：如果用 `<button>` 进行路由跳转，则无法使用 `router-link` ，因为它会被转成 `<a>` 标签；或者有其他业务需求时的业务跳转；
- 具体编码：给标签绑定一个点击事件，事件的**回调函数**调用以下方法

```js
// $router 的两个 API（对象的内容和 router-link 中 to 属性的对象写法一致）
this.$router.push({
  name: "xiangqing",
  params: {
    id: xxx,
    title: xxx,
  },
});

this.$router.replace({
  name: "xiangqing",
  params: {
    id: xxx,
    title: xxx,
  },
});
this.$router.forward(); // 前进
this.$router.back(); // 后退
this.$router.go(); // 可前进也可后退，传入一个数字，指定跳转的步数
```

## 缓存路由组件 keep-alive

- 功能：让不展示的路由组件保持挂载，不被销毁，防止重复渲染
  - 如 input 类型，切走的时候组件被销毁，里面的内容也没了，这时应该缓存下来
  - 如列表页，一般缓存起来
  - 缓存多个组件，写成数组的形式 `:include=['News', 'Message']`
  - 可在路由元信息中配置 keepAlive 属性判断是否需要缓存

```vue
<keep-alive include="News">  <!-- include指定哪个组件要被缓存，写组件名 -->
    <router-view></router-view>
</keep-alive>

<keep-alive :include="['News', 'Others']"> <!-- 缓存多个组件，用数组写 -->
  <router-view></router-view>
</keep-alive>

<!-- 在路由元信息中配置是否需要缓存 -->
<div id="app" class="wrapper">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view><!-- 需要缓存的组件 --> 
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view><!-- 不需要缓存的组件 -->
</div>
```

## 新的生命周期

- 与缓存组件相关的两个新的生命周期；
- 作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态；
- 具体名字：
  - `activated` 路由组件被激活时触发；
  - `deactivated` 路由组件失活时触发。

## 路由守卫

- 作用：对路由组件进行权限控制，允许或阻止对某些组件的访问（写在路由器中）；

- 不能直接创建并暴露路由器，需要先用一个变量 router 接收路由器，然后在暴露之前添加路由守卫；

- 在配置路由时，在元信息 mata 里面配置该路由是否需要权限校验的信息；

- 分类：全局守卫、独享守卫、组件内守卫；

### 全局守卫：写在路由器外面

```js
const router = new VueRouter({
  // 先用一个变量接收路由器，在其暴露之前添加守卫
  routes: [
    {
      name: "guanyu",
      path: "/about",
      component: About,
      meta: "{ isAuth: true }", // 配置是否需要授权
    },
  ],
});

// 全局前置守卫：初始化时执行、每次路由切换前执行
router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    // 判断当前路由是否需要进行权限控制
    if (localStorage.getItem("school") === "atguigu") {
      // 权限控制的具体规则
      next(); // 放行
    } else {
      alert("学校名不对，暂无权限查看");
    }
  } else {
    next();
  }
});

// 全局后置守卫：初始化时执行、每次路由切换后执行（路径已经变过去了，常用于修改网页标题）
router.afterEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title; // 修改网页的 title
  } else {
    document.title = "vue_test";
  }
});

export default router;
```

### 独享守卫：写在路由器配置项里面

- 只有 `beforeEnter` 一个配置项

```js
export default {
  name: "guanyu",
  path: "/about",
  component: About,
  meta: "{ isAuth: false }", // 配置是否需要授权
  beforeEnter(to, from, next) {
    if (to.meta.isAuth) {
      // 判断当前路由是否需要进行权限控制
      if (localStorage.getItem("school") === "atguigu") {
        next();
      } else {
        alert("暂无权限查看");
      }
    } else {
      next();
    }
  },
};
```

#### 组件内守卫：写在组件配置项里面

- 有 `beforeRouteEnter` 和 `beforeRouteLeave` 两个配置项，进入守卫和离开守卫

```js
export default {
  name: "About",
  beforeRouteEnter(to, from, next) {}, // 进入守卫：通过路由规则，进入该组件时被调用
  beforeRouteLeave(to, from, next) {}, // 离开守卫：通过路由规则，离开该组件时被调用
};
```

### 路由钩子函数

- 全局守卫（全局路由器 router 身上的函数）
  - `beforeEach` 全局前置：每次路由切换之前和初始化的时候
  - `afterEach` 全局后置：每次路由切换完成之后调用和初始化的时候（用来改网页 title）
  - `beforResolve`
- 独享守卫（每条路由的配置项，与 name，path 等同级）
  - `beforeEnter`
- 组件内守卫（每个组件的配置项）
  - `beforeRouteEnter` 通过路由规则**进入**该组件时被调用
  - `beforeRouteUpdate`
  - `beforeRouteLeave` 通过路由规则**离开**该组件时被调用

## 路由器的两种工作模式

- 对于一个 URL 来说，＃ 及其后面的内容就是 hash 值；
- 哈希值不会包含在 HTTP 请求中，不会带给服务器；
- hash 模式：
  - 地址中永远带着 ＃ 号，不美观；
  - 若以后将地址通过第三方手机 APP 分享，若 APP 校验严格，则地址会被标记为不合法；
  - 兼容性较好。
- history 模式：
  - 地址干净，美观，无 ＃ 号 ；
  - 兼容性和 hash 模式相比略差；
  - 应用部署上线时需要后端人员支持，解决**刷新页面**服务端 404 的问题

```js
const router = new VueRouter({
  mode: 'history',  // 默认为hash，带#号
  ...
})
```

## 4.x 版本

## 对路由的理解

前端路由：路径与页面组件的对应关系

路由器 (插件)

## 基本切换效果

`Vue3` 中要使用 `vue-router` 的最新版本，目前是 `4` 版本

### 1️⃣ 创建路由器

`src/router/index.js`

```js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import News from "@/pages/News.vue";
import About from "@/pages/About.vue";

/** 创建路由器 */
const router = createRouter({
  // 1. 路由模式
  history: createWebHistory(),
  // 2. 路由规则
  routes: [
    { path: "/home", component: Home },
    { path: "/about", component: About },
  ],
});

export default router;
```

### 2️⃣ 注册路由器

`main.js`

```js
import router from "./router/index";

app.use(router);
app.mount("#app");

// 建议写成异步
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
```

### 3️⃣ 使用路由器

`App.vue`

```vue
<template>
  <div class="app">
    <h2 class="title">Vue 路由测试</h2>
    <!-- 导航区 -->
    <div class="navigate">
      <RouterLink to="/home" active-class="active">首页</RouterLink>
      <RouterLink to="/news" active-class="active">新闻</RouterLink>
      <RouterLink to="/about" active-class="active">关于</RouterLink>
    </div>
    <!-- 展示区 -->
    <div class="main-content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="App">
import { RouterLink, RouterView } from "vue-router";
</script>
```

## 两个注意点

路由组件通常存放在 `pages` 或 `views` 文件夹，非路由组件通常存放在 `components` 文件夹

通过点击导航，视觉效果上“消失”了的路由组件，默认是被**卸载**掉的，需要的时候再去**挂载**

## 路由器工作模式

### 1️⃣ `history` 模式

优点：路径更加美观，不带有 `#`，更接近传统的网站路径

缺点：后期项目上线，需要服务端配合处理路径问题，否则刷新会有 `404` 错误

```js
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(), // history模式
  routes,
});
```

### 2️⃣ `hash` 模式

优点：兼容性更好，因为不需要服务器端处理路径

缺点：路径带有 `#` 不太美观，且在 SEO 优化方面相对较差

```js
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHashHistory(), // hash模式
  routes,
});
```

## `to` 的两种写法

```vue
<!-- 第一种：to 的字符串写法 (直接写完整的路径) -->
<router-link active-class="active" to="/home">主页</router-link>

<!-- 第二种：to 的对象写法 -->
<router-link active-class="active" :to="{ path: '/home' }">Home</router-link>
```

## 命名路由

给路由规则命名，添加 `name` 属性，可以简化路由跳转及传参

```js
const routes: [
  { name: 'zhuye', path: '/home', component: Home },
  { name: 'xinwen', path: '/news', component: News },
  { name: 'guanyu', path: '/about', component: About }
]
```

跳转路由

```vue
<!--简化前：需要写完整的路径（to 的字符串写法） -->
<router-link to="/news/detail">跳转</router-link>

<!--简化后：直接通过名字跳转（to 的对象写法配合 name 属性） -->
<router-link :to="{ name: 'guanyu' }">跳转</router-link>
```

## 嵌套路由

编写 `News` 的子路由：`Detail.vue`

配置路由规则，使用 `children` 配置项

```typescript
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: "zhuye", path: "/home", component: Home },
    {
      name: "xinwen",
      path: "/news",
      component: News,
      children: [
        {
          name: "xiang",
          path: "detail",
          component: Detail,
        },
      ],
    },
    { name: "guanyu", path: "/about", component: About },
  ],
});

export default router;
```

跳转路由（记得要加完整路径）

```vue
<router-link to="/news/detail">xxxx</router-link>
<!-- 或 -->
<router-link :to="{ path: '/news/detail' }">xxxx</router-link>
```

```vue
<!-- News.vue -->
<template>
  <div class="news">
    <!-- 导航区 -->
    <nav class="news-list">
      <RouterLink v-for="news in newsList" :key="news.id" :to="{ path: '/news/detail' }">
        {{ news.name }}
      </RouterLink>
    </nav>
    <!-- 展示区 -->
    <div class="news-detail">
      <RouterView />
    </div>
  </div>
</template>
```

## 路由传参

### 1️⃣ query 参数

**传递参数**

```vue
<!-- 跳转并携带 query 参数（to 的字符串写法） -->
<router-link to="/news/detail?a=1&b=2&content=欢迎你">
	跳转
</router-link>

<!-- 跳转并携带 query 参数（to 的对象写法） -->
<RouterLink
  :to="{
    name: 'xiang', // 用 name 也可以跳转
    path: '/news/detail',
    query: {
      id: news.id,
      title: news.title,
      content: news.content,
    },
  }"
>
  {{ news.title }}
</RouterLink>
```

**接收参数**

```js
import { useRoute } from "vue-router";
const route = useRoute(); // 拿到当前路径的路由信息对象，包含路由的路径、参数等
// 打印 query 参数
console.log(route.query);
```

### 2️⃣ params 参数

**传递参数**

```vue
<!-- 跳转并携带 params 参数（to 的字符串写法，可以用模板字符串使用变量） -->
<RouterLink :to="`/news/detail/${news.id}/${news.title}/${news.content}`">
  {{ news.title }}
</RouterLink>

<!-- 跳转并携带 params 参数（to 的对象写法） -->
<RouterLink
  :to="{
    name: 'xiang',
    params: {
      id: news.id,
      title: news.title,
      content: news.title,
    },
  }"
>
  {{ news.title }}
</RouterLink>
```

**接收参数**

```js
import { useRoute } from "vue-router";
const route = useRoute();
// 打印 params 参数
console.log(route.params);
```

> 传递 `params` 参数时，若使用 `to` 的对象写法，必须使用 `name` 配置项，不能用 `path`。
>
> 传递 `params` 参数时，需要提前在规则中占位

```js
const routes: [

  {
    name: 'xinwen',
    path: '/news',
    component: News,
    children: [
      {
        name: 'xiang',
        path: 'detail/:id/:title/:content'
      }
    ]
  },
]
```

## 路由的 props 配置

让路由组件更方便的收到参数（可以将路由参数作为 `props` 传给组件）

1️⃣ 布尔值写法

把收到的每一组 params 参数，作为 props 传给 Detail 组件

当 props 设置为 true 时，route.params 将被设置为组件的 props

```js
{
	name:'xiang',
	path:'detail/:id/:title/:content',
	component:Detail,
  props: true
}
```

2️⃣ 对象写法

把对象中的每一组 key-value 作为 props 传给 Detail 组件

当 props 是一个对象时，它将原样设置为组件 props。当 props 是静态的时候很有用

```js
{
	name:'xiang',
	path:'detail/:id/:title/:content',
	component:Detail,
  props: { a: 1, b: 2, c: 3 },
}
```

3️⃣ 函数写法

把函数返回的对象中每一组 key-value 作为 props 传给 Detail 组件

你可以创建一个返回 props 的函数。这允许你将参数转换为其他类型，将静态值与基于路由的值相结合等等

```js
{
	name:'xiang',
	path:'detail/:id/:title/:content',
	component:Detail,
  props (route) {
    return route.query
  }
}
```

## replace 属性

控制路由跳转时操作浏览器历史记录的模式

浏览器的历史记录有两种写入方式：分别为 `push` 和 `replace`

- `push` 是追加历史记录 (默认值)
- `replace `是替换当前记录

开启 `replace` 模式

```vue
<RouterLink replace ...>News</RouterLink>
```

## 编程式导航

路由组件的两个重要的属性：`$route` 和 `$router` 变成了两个 `hooks`

```js
import { useRoute, useRouter } from "vue-router";

const route = useRoute(); // 当前路由信息对象
const router = useRouter(); // 路由器实例

console.log(route.query);
console.log(route.parmas);

// push 和 replace函数参数中的语法和 router-link 的 to 相同，可以写字符串和对象
console.log(router.push);
console.log(router.replace);
```

## 重定向

将特定的路径，重新定向到已有路由

```js
const route = {
  path: "/",
  redirect: "/home",
};
```
