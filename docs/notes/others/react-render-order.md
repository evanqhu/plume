---
title: React 渲染顺序
createTime: 2024/12/23 11:41:38
permalink: /others/cz5xq5qe/
---

```js
function App() {
  console.log("1");
  const [data, setData] = useState("a");
  useEffect(() => {
    console.log("2");
    setTimeout(() => {
      setData("b");
    }, 100);
  }, []); // 依赖为空数组，仅初次渲染执行
  return <Content props={data} />;
}

function Content(props) {
  console.log("3");
  useEffect(() => {
    console.log("4");
    return () => {
      console.log("5");
    };
  }, []); // 依赖为空数组，仅初次渲染执行
  useEffect(() => {
    console.log("6");
    return () => {
      console.log("7");
    };
  }); // 省略依赖，表示每次渲染都执行
  return <div>{props.data}</div>;
}
```

输出结果：1 3 4 6 2 1 3 7 6

### 初次渲染

- 运行 App 组件代码，打印 1
- 运行 Content 组件代码，打印 3
- 渲染 Content Dom，完毕后依次执行 Content 组件的两个 useEffect 的 setup 函数，分别打印 4 和 6
- Content 组件 DOM 渲染完毕，渲染 App 组件 DOM，完毕后执行 App 组件的 useEffect 的 setup 函数，打印 2
- 执行 setTimeout，修改 data 的值，App 组件依赖更新，整体重新渲染 (进入第二次渲染)

### 第二次渲染

- 运行 App 组件同步代码，打印 1
- 运行 Content 组件代码，打印 3
- 执行 Content 组件的第二个 useEffect，先执行清理函数，打印 7，再执行 setup 函数，打印 6
- 注意：依赖为空数组的 useEffect 只会在初次渲染时执行一次，后续更新不会执行
