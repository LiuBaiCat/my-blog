---
title: React知识点总结
date: 2025-12-24
tags: [React, 基础学习]
description: React知识点总结
pinned: false
---
# React知识点总结

## 1. React基础

### 1.1 工程化的环境创建
React工程化环境创建主要有两种方式：

#### 1.1.1 Create React App (CRA)
Create React App是React官方推出的项目创建工具，但目前已不再是官方推荐的首选方式，它使用Webpack作为构建工具，配置相对固定。

```bash
# 使用npm创建React项目
npx create-react-app my-react-app

# 使用yarn创建React项目
yarn create react-app my-react-app

# 使用pnpm创建React项目
pnpm create react-app my-react-app

# 可以使用模板启动一个新的 TypeScript 应用程序
npx create-react-app my-app --template typescript
```

##### 1.1.1.1 CRA扩展配置
CRA默认配置较为固定，若需要自定义配置，可以使用`@craco/craco`（Create React App Configuration Override）来扩展配置，比如配置路径别名：

1. **安装依赖**
```bash
npm install @craco/craco --save-dev
# 或
yarn add @craco/craco --dev
# 或
pnpm add @craco/craco --save-dev
```

2. **创建配置文件**
在项目根目录创建`craco.config.js`文件：

```js
// craco.config.js
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      // 配置路径别名，将@指向src目录
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
```

3. **修改package.json**
```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

4. **使用别名**
配置完成后，可以在项目中使用`@`作为src目录的别名：
```jsx
// 之前的写法
import Home from "../pages/Home";
// 配置别名后的写法
import Home from "@/pages/Home";
```

#### 1.1.2 Vite
Vite是新一代的前端构建工具，具有更快的开发服务器和构建速度，是目前React官方推荐的项目创建方式之一。

```bash
# 使用npm创建React项目
npm create vite@latest my-react-app -- --template react-ts

# 使用yarn创建React项目
yarn create vite my-react-app --template react-ts

# 使用pnpm创建React项目
pnpm create vite my-react-app --template react-ts
```

#### 1.1.3 Next.js
Next.js是React的全栈框架，提供了服务器端渲染、静态站点生成等功能，也是React官方推荐的框架之一。

```bash
# 使用npm创建Next.js项目
npx create-next-app@latest my-next-app
```

#### 1.1.4 手动配置
对于需要高度自定义的项目，可以手动配置Webpack、Babel等工具。

### 1.2 JSX语法
JSX是React的核心语法扩展，允许在JavaScript中编写HTML结构。

```jsx
// JSX示例
const Test1 = () => {
  const test = "test";
  return <div style={{ color: "red", fontSize: "20px" }}>{test}</div>;
};
```

### 1.3 函数组件与类组件
- **函数组件**：使用函数定义的组件，是React的推荐方式
- **类组件**：使用ES6类定义的组件，较旧的方式

#### 1.3.1 class API（了解即可，较旧）

> 以下是class API的相关图片，了解即可，实际开发推荐使用函数组件和Hooks，具体原因如下：
> - **代码更简洁**：函数组件语法更简洁，减少样板代码
> - **逻辑复用更方便**：Hooks允许在组件间复用状态逻辑，无需高阶组件或Render Props
> - **更容易理解**：避免了class组件中的this指向问题
> - **生命周期管理更灵活**：useEffect Hook统一处理副作用，替代了class组件中的多个生命周期方法
> - **性能更优**：函数组件在React内部处理更高效
> - **更容易测试**：函数组件和Hooks更适合单元测试
> - **React团队推荐**：React 16.8+推出Hooks后，官方推荐使用函数组件

![class API的基础语法](/img_react/class%20API的基础语法(too%20old).png)

![class API的生命周期](/img_react/class%20API的生命周期(too%20old).png)

![class API的父子通讯](/img_react/class%20API%20的父子通讯(too%20old).png)

### 1.4 条件渲染
```jsx
const VIf = () => {
  const age = 19;
  return (
    <div>
      {/* 三元表达式 */}
      <div>{age >= 18 ? <span>成年</span> : <span>未成年</span>}</div>
      {/* 逻辑与 */}
      <div>{age >= 18 && <span>成年</span>}</div>
      <div>{age < 18 && <span>未成年</span>}</div>
      {/* 函数返回 */}
      <div>{getContent()}</div>
    </div>
  );
};
```

### 1.5 列表渲染
```jsx
function VFor() {
  const list1 = [
    { id: 1001, name: "Vue", count: 100 },
    { id: 1002, name: "React", count: 200 },
    { id: 1003, name: "Angular", count: 300 },
  ];
  return (
    <div>
      <ul>
        {list1.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 1.6 事件处理
```jsx
const ButtonClick = () => {
  const handleClick = () => {
    console.log("按钮被点击了");
  };
  return (
    <div>
      <button onClick={handleClick}>按钮</button>
      <button onClick={() => handleClick2("A")}>A按钮</button>
      <button onClick={(e) => handleClick2("D", e)}>D按钮</button>
    </div>
  );
};
```

### 1.7 状态管理（useState）
```jsx
const MyUseState1 = () => {
  // 基本类型状态
  const [count, setCount] = useState(0);
  
  // 对象类型状态
  const [form, setForm] = useState({ name: "jack", count: 0 });
  
  const changeForm = () => {
    setForm({
      ...form, // 展开现有对象，保持其他属性不变
      name: "tom",
    });
  };
  
  return <div>状态管理示例</div>;
};
```

### 1.8 样式处理
```jsx
function ReactCSS() {
  // 内联样式对象
  const style2 = {
    color: "yellowGreen",
    fontSize: "50px",
  };
  return (
    <div>
      {/* 行内样式 */}
      <span style={{ color: "red", fontSize: "50px" }}>this is a span</span>
      {/* 样式对象 */}
      <span style={style2}>this is a span</span>
      {/* CSS类名 */}
      <span className="foo">this is class foo</span>
    </div>
  );
}
```

### 1.9 DOM操作（useRef）
```jsx
const GetDOM = () => {
  const inputRef = useRef();
  const showDom = () => {
    console.log(inputRef.current); // 访问DOM元素
    console.log(inputRef.current.value); // 访问DOM元素属性
  };
  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={showDom}>获取DOM</button>
    </div>
  );
};
```

## 2. 组件通信

### 2.1 父子组件通信
- **父传子**：通过props传递数据
- **子传父**：通过props传递回调函数

```jsx
// 子组件
const Son = (props) => {
  return (
    <div>
      <div>{props.name}</div> {/* 使用父组件传递的数据 */}
      <button onClick={() => props.onGetSonMsg("子组件消息")}>发送消息</button>
    </div>
  );
};

// 父组件
const SonAndFather = () => {
  const [msg, setMsg] = useState("");
  const getMsg = (msg) => {
    setMsg(msg); // 接收子组件传递的消息
  };
  return (
    <div>
      <Son name="父组件名称" onGetSonMsg={getMsg} />
      <div>父组件接收到：{msg}</div>
    </div>
  );
};
```

### 2.2 兄弟组件通信
通过共同的父组件作为中间件实现通信

```jsx
const Brother = () => {
  const A = ({ onGetAName }) => {
    const name = "this is A name";
    return (
      <div>
        这是A组件,
        <button onClick={() => onGetAName(name)}>send</button>
      </div>
    );
  };
  
  const B = ({ name }) => {
    return <div>这是B组件,{name}</div>; // 接收A组件的消息
  };
  
  const [name, setName] = useState("");
  const getAName = (name) => {
    setName(name); // 父组件作为中间件
  };
  
  return (
    <div>
      <A onGetAName={getAName} />
      <B name={name} />
    </div>
  );
};
```

### 2.3 跨层组件通信（Context API）
使用Context API实现跨多层级组件通信

```jsx
const CrossLayer = () => {
  // 1. 创建Context
  const MsgContext = createContext();
  
  const A = () => {
    return (
      <div>
        这是A组件
        <B /> {/* A组件的子组件 */}
      </div>
    );
  };
  
  const B = () => {
    const msg = useContext(MsgContext); // 3. 使用Context
    return <div>这是B组件,{msg}</div>;
  };
  
  const msg = "this is app msg";
  return (
    <MsgContext.Provider value={msg}> {/* 2. 提供Context */}
      <div>
        this is App
        <A />
      </div>
    </MsgContext.Provider>
  );
};
```

## 3. React高级特性

### 3.1 副作用处理（useEffect）
用于处理组件的副作用，如数据获取、订阅、DOM操作等

```jsx
const MyUseEffect = () => {
  const apiURL = "http://geek.itheima.net/v1_0/channels";
  const [list, setList] = useState([]);
  
  // 数据获取示例
  useEffect(() => {
    async function getList() {
      const res = await fetch(apiURL);
      const jsonRes = await res.json();
      setList(jsonRes.data.channels);
    }
    getList();
  }, []); // 空依赖数组，只在组件挂载时执行一次
  
  return <div>副作用处理示例</div>;
};
```

### 3.2 useEffect依赖项

```jsx
const DifferentOfUseEffect = () => {
  const [count, setCount] = useState(0);
  
  // 1. 没有依赖项：初始 + 每次更新时执行
  // useEffect(() => { console.log("副作用函数执行了"); });
  
  // 2. 空依赖数组：只在初始执行一次
  // useEffect(() => { console.log("副作用函数执行了"); }, []);
  
  // 3. 特定依赖项：监听依赖项变化执行
  useEffect(() => {
    console.log("副作用函数执行了");
  }, [count]); // 只在count变化时执行
  
  return <div>useEffect依赖项示例</div>;
};
```

### 3.3 useEffect清除副作用

```jsx
const UninstallOfUseEffect = () => {
  const Son = () => {
    useEffect(() => {
      const timer = setInterval(() => {
        console.log("定时器执行中...");
      }, 1000);
      
      // 清除副作用函数（组件卸载时执行）
      return () => {
        clearInterval(timer);
      };
    }, []);
    
    return <div>这是子组件</div>;
  };
  
  const [isShow, setIsShow] = useState(true);
  return (
    <div>
      {isShow && <Son />}
      <button onClick={() => setIsShow(false)}>卸载Son组件</button>
    </div>
  );
};
```

### 3.4 自定义Hook
自定义Hook允许复用组件逻辑

```jsx
// 自定义Hook
function useIsShow() {
  const [isShow, setIsShow] = useState(false);
  const handleChange = () => {
    setIsShow(!isShow);
  };
  return { isShow, handleChange };
}

// 使用自定义Hook
const MyHOOK = () => {
  const { isShow, handleChange } = useIsShow();
  return (
    <div>
      MyHOOK,
      {isShow && <div>this is a div</div>}
      <button onClick={() => handleChange()}>show/hide</button>
    </div>
  );
};
```

### 3.5 useMemo/useCallback
useMemo和useCallback是React提供的性能优化Hook，它们可以缓存计算结果和函数引用，避免不必要的重渲染。

#### 3.5.1 useMemo
useMemo用于缓存计算结果，只有当依赖项发生变化时才会重新计算。

```jsx
import { useMemo, useState } from "react";

const UseMemoDemo = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("React");
  
  // 只有当count变化时，才会重新计算expensiveValue
  const expensiveValue = useMemo(() => {
    console.log("计算expensiveValue");
    let result = 0;
    for (let i = 0; i < 1000000000; i++) {
      result += i;
    }
    return result + count;
  }, [count]);
  
  return (
    <div>
      <div>Count: {count}</div>
      <div>Name: {name}</div>
      <div>Expensive Value: {expensiveValue}</div>
      <button onClick={() => setCount(count + 1)}>增加count</button>
      <button onClick={() => setName("React Hook")}>修改name</button>
    </div>
  );
};
```

#### 3.5.2 useCallback
useCallback用于缓存函数引用，只有当依赖项发生变化时才会创建新的函数。

```jsx
import { useCallback, useState } from "react";

const UseCallbackDemo = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("React");
  
  // 只有当name变化时，才会创建新的handleClick函数
  const handleClick = useCallback(() => {
    console.log(`Hello, ${name}!`);
  }, [name]);
  
  return (
    <div>
      <div>Count: {count}</div>
      <div>Name: {name}</div>
      <button onClick={() => setCount(count + 1)}>增加count</button>
      <button onClick={() => setName("React Hook")}>修改name</button>
      <button onClick={handleClick}>点击我</button>
    </div>
  );
};

// 子组件
const ChildComponent = React.memo(({ onClick }) => {
  console.log("ChildComponent渲染");
  return <button onClick={onClick}>子组件按钮</button>;
});
```

#### 3.5.3 区别与应用场景
| Hook | 作用 | 应用场景 |
|------|------|----------|
| useMemo | 缓存计算结果 | 复杂计算、大数据处理 |
| useCallback | 缓存函数引用 | 传递给子组件的回调函数、依赖于其他状态的函数 |

#### 3.5.4 注意事项
- 不要过度使用，只有当确实存在性能问题时才使用
- 依赖项数组必须包含所有在Hook中使用的外部变量
- 对于简单的计算或函数，直接使用可能比使用Hook更高效

### 3.6 useReducer
useReducer是useState的替代方案，用于管理复杂状态，它接收一个reducer函数和初始状态，返回当前状态和dispatch函数。

#### 3.6.1 基本概念
- **reducer函数**：接收当前状态和action，返回新状态的纯函数
- **action**：描述状态变化的对象，通常包含type和payload属性
- **dispatch函数**：用于发送action到reducer的函数
- **initialState**：初始状态

#### 3.6.2 基本用法

```jsx
import { useReducer } from "react";

// 1. 定义reducer函数
const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "SET_COUNT":
      return { ...state, count: action.payload };
    default:
      return state;
  }
};

// 2. 定义初始状态
const initialState = {
  count: 0
};

const UseReducerDemo = () => {
  // 3. 使用useReducer Hook
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <div>Count: {state.count}</div>
      {/* 4. 使用dispatch函数发送action */}
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "SET_COUNT", payload: 100 })}>设置为100</button>
    </div>
  );
};
```

#### 3.6.3 useReducer与useState的对比

| 特性 | useState | useReducer |
|------|----------|------------|
| 状态管理复杂度 | 适合简单状态 | 适合复杂状态 |
| 状态更新方式 | 直接更新状态 | 通过dispatch发送action |
| 状态逻辑复用 | 较难 | 容易（reducer函数可单独提取） |
| 调试 | 较难 | 容易（action可追踪） |
| 性能优化 | 依赖React自动优化 | 可通过useCallback优化dispatch |

#### 3.6.4 应用场景
- **复杂状态管理**：当状态包含多个子值，或者状态转换逻辑复杂时
- **状态逻辑复用**：当多个组件需要共享相同的状态逻辑时
- **可预测的状态更新**：当需要清晰的状态转换记录时
- **与Context API结合使用**：用于管理全局状态

#### 3.6.5 高级示例：与Context API结合

```jsx
import { createContext, useContext, useReducer } from "react";

// 1. 创建Context
const CountContext = createContext();

// 2. 定义reducer函数
const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

// 3. 创建Provider组件
const CountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <CountContext.Provider value={{ state, dispatch }}>
      {children}
    </CountContext.Provider>
  );
};

// 4. 自定义Hook用于使用Context
const useCount = () => {
  const context = useContext(CountContext);
  if (!context) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
};

// 5. 使用示例
const ComponentA = () => {
  const { state } = useCount();
  return <div>Component A: {state.count}</div>;
};

const ComponentB = () => {
  const { dispatch } = useCount();
  return <button onClick={() => dispatch({ type: "INCREMENT" })}>增加</button>;
};

// 6. 根组件
const App = () => {
  return (
    <CountProvider>
      <ComponentA />
      <ComponentB />
    </CountProvider>
  );
};
```

### 3.7 useImperativeHandle
useImperativeHandle用于自定义暴露给父组件的实例值，通常与forwardRef一起使用，它允许子组件控制向父组件暴露哪些属性和方法。

#### 3.7.1 基本概念
- **forwardRef**：用于将ref从父组件传递到子组件的HOC
- **useImperativeHandle**：用于自定义暴露给父组件的实例值
- **ref**：用于访问DOM元素或组件实例的对象

#### 3.7.2 基本用法

```jsx
import { forwardRef, useImperativeHandle, useState, useRef } from "react";

// 子组件
const ChildComponent = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);
  const inputRef = useRef(null);
  
  // 自定义暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    // 暴露方法
    increment: () => {
      setCount(count + 1);
    },
    decrement: () => {
      setCount(count - 1);
    },
    // 暴露状态
    getCount: () => count,
    // 暴露DOM操作
    focusInput: () => {
      inputRef.current.focus();
    }
  }));
  
  return (
    <div>
      <div>Count: {count}</div>
      <input ref={inputRef} type="text" placeholder="请输入内容" />
    </div>
  );
});

// 父组件
const ParentComponent = () => {
  // 创建ref
  const childRef = useRef(null);
  
  const handleClick = () => {
    // 调用子组件暴露的方法
    childRef.current.increment();
  };
  
  const handleFocus = () => {
    // 调用子组件暴露的DOM操作方法
    childRef.current.focusInput();
  };
  
  const handleGetCount = () => {
    // 调用子组件暴露的获取状态方法
    console.log(childRef.current.getCount());
  };
  
  return (
    <div>
      <h2>父组件</h2>
      <ChildComponent ref={childRef} />
      <button onClick={handleClick}>调用子组件的increment方法</button>
      <button onClick={handleFocus}>让子组件的输入框获得焦点</button>
      <button onClick={handleGetCount}>获取子组件的count值</button>
    </div>
  );
};
```

#### 3.7.3 应用场景
- **父组件需要直接调用子组件的方法**：例如表单提交、模态框控制等
- **父组件需要直接访问子组件的DOM元素**：例如滚动到底部、获取输入框焦点等
- **自定义暴露的实例值**：避免暴露子组件的所有内部实现细节，只暴露需要的方法和属性

#### 3.7.4 注意事项
- **只在必要时使用**：useImperativeHandle打破了React的单向数据流，增加了组件间的耦合度，应尽量避免使用
- **与forwardRef一起使用**：useImperativeHandle必须与forwardRef一起使用，否则ref无法传递到子组件
- **不要暴露过多的内部实现**：只暴露必要的方法和属性，保持组件的封装性
- **类型安全**：在TypeScript中，需要为暴露的实例值定义类型，确保类型安全

## 4. 状态管理

### 4.1 Redux Toolkit
Redux Toolkit是官方推荐的Redux开发工具集，简化了Redux的使用

安装 redux

```bash
npm i @reduxjs/toolkit react-redux
```

#### 4.1.1 配置Store
```jsx
// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./modules/counterStore";
import channelReducer from "./modules/channelStore";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    channel: channelReducer,
  },
});
export default store;
```

#### 4.1.2 创建Slice
```jsx
// store/modules/counterStore.js
import { createSlice } from "@reduxjs/toolkit";

const counterStore = createSlice({
  name: "counter",
  // 初始化state
  initialState: {
    count: 0,
  },
  // 修改状态的方法 同步方法 支持直接修改（通过Immer库）
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

// 从slice中解构出action creators
const { increment, decrement } = counterStore.actions;
// 获取reducer函数
const reducer = counterStore.reducer;
// 按需导出action creators
export { increment, decrement };
// 以默认导出的方式导出reducer
export default reducer;
```

#### 4.1.3 异步状态
在Redux Toolkit中，可以使用`createAsyncThunk`来处理异步操作，它会自动生成pending、fulfilled、rejected三种状态的action。

```jsx
// store/modules/channelStore.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 1. 创建异步action
const fetchChannels = createAsyncThunk(
  "channel/fetchChannels", // action类型前缀
  async () => {
    const res = await fetch("http://geek.itheima.net/v1_0/channels");
    const data = await res.json();
    return data.data.channels;
  }
);

// 2. 创建Slice
const channelStore = createSlice({
  name: "channel",
  initialState: {
    channels: [],
    loading: false,
    error: null,
  },
  reducers: {},
  // 处理异步action
  extraReducers: (builder) => {
    builder
      // 处理pending状态
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
      })
      // 处理fulfilled状态
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      // 处理rejected状态
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// 导出异步action
export { fetchChannels };
// 导出reducer
export default channelStore.reducer;
```

```jsx
// 使用异步action
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels } from "./store/modules/channelStore";

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, loading, error } = useSelector((state) => state.channel);

  // 组件挂载时触发异步请求
  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败：{error}</div>;

  return (
    <ul>
      {channels.map((channel) => (
        <li key={channel.id}>{channel.name}</li>
      ))}
    </ul>
  );
};
```

### 4.2 Zustand
Zustand是一个轻量级的状态管理库，使用简单，支持切片模式，可以将store拆分成多个小store，便于管理和维护。

#### 4.2.1 安装Zustand

```bash
# 使用npm安装
npm install zustand

# 使用yarn安装
yarn add zustand

# 使用pnpm安装
pnpm add zustand
```

#### 4.2.2 基础使用

```jsx
import { create } from "zustand";

// 创建store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// 在组件中使用
const Counter = () => {
  const { count, increment, decrement } = useStore();
  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

#### 4.2.2 切片模式（项目中实际使用）

Zustand支持切片模式，可以将store拆分成多个小store，每个小store负责管理自己的状态和动作，然后通过展开运算符合并到一个store中。

```jsx
import { create } from "zustand";
const apiURL = "http://geek.itheima.net/v1_0/channels";

// 1. 创建计数器切片store
const createCounterStore = (set) => {
  return {
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  };
};

// 2. 创建频道列表切片store
const createChannelListStore = (set) => {
  return {
    channelList: [],
    fetchChannelList: async () => {
      const res = await fetch(apiURL);
      const jsonRes = await res.json();
      set({ channelList: jsonRes.data.channels });
    },
  };
};

// 3. 合并切片store
const useStore = create((...a) => {
  return {
    ...createCounterStore(...a),
    ...createChannelListStore(...a),
  };
});
```

#### 4.2.3 异步状态处理

Zustand支持直接在store中处理异步请求，无需额外的中间件。

```jsx
// 在切片中定义异步action
const createChannelListStore = (set) => {
  return {
    channelList: [],
    fetchChannelList: async () => {
      const res = await fetch(apiURL);
      const jsonRes = await res.json();
      set({ channelList: jsonRes.data.channels });
    },
  };
};

// 在组件中使用异步action
function App() {
  const { count, increment, decrement, channelList, fetchChannelList } = useStore();
  
  // 组件挂载时调用异步action
  useEffect(() => {
    fetchChannelList();
  }, [fetchChannelList]);
  
  return (
    <div>
      {/* 渲染频道列表 */}
      <ul>
        {channelList.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### 4.2.4 Zustand的优势

- **轻量级**：体积小，依赖少
- **使用简单**：API简洁，学习成本低
- **支持切片模式**：便于状态管理的模块化
- **支持异步操作**：无需额外中间件
- **组件集成简单**：直接在组件中使用，无需Provider
- **性能优化**：自动优化重渲染，只更新依赖的组件

Zustand适合中小型项目，特别是对于状态管理需求不是很复杂的项目，它提供了比Redux更简洁的解决方案。

## 5. 路由管理

### 5.1 React Router

#### 5.1.1 配置路由
```jsx
// router/index.js
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// 懒加载组件
const Home = lazy(() => import("@/pages/Home"));
const Panel1 = lazy(() => import("@/pages/Panel1"));
const Panel2 = lazy(() => import("@/pages/Panel2"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/article/:id?", // 可选参数
    element: <Article />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        index: true, // 默认子路由
        element: <Suspense fallback={<div>Loading...</div>}><Navigate to="/home/panel1" replace /></Suspense>,
      },
      {
        path: "/home/panel1",
        element: <Panel1 />,
      },
      {
        path: "/home/panel2",
        element: <Panel2 />,
      },
    ],
  },
  {
    path: "*", // 404路由
    element: <NotFound />,
  },
]);

export default router;
```

#### 5.1.2 路由守卫

**路由守卫**是一种机制，用于在路由跳转前后进行权限验证、登录检查等操作。

##### 5.1.2.1 路由守卫的作用
- **权限控制**：验证用户是否有权访问某个路由
- **登录检查**：检查用户是否已登录，未登录则跳转到登录页
- **日志记录**：记录路由跳转日志
- **页面埋点**：统计页面访问情况
- **数据预处理**：在进入页面之前获取必要的数据

##### 5.1.2.2 实现路由守卫

在React Router v6中，可以通过自定义路由组件来实现路由守卫功能。以下是一个简单的AuthRoute实现示例：

```jsx
// 路由守卫组件 AuthRoute
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  // 模拟检查用户是否已登录
  const isLogin = localStorage.getItem("token");
  
  // 如果已登录，渲染子组件；否则跳转到登录页
  return isLogin ? children : <Navigate to="/login" replace />;
};

// 使用路由守卫
const router = createBrowserRouter([
  {
    path: "/protected",
    element: (
      <AuthRoute>
        <ProtectedPage />
      </AuthRoute>
    ),
  },
  // 其他路由...
]);
```

#### 5.1.3 声明式导航
声明式导航是通过组件的方式来实现路由跳转，React Router提供了`<Link>`和`<NavLink>`两个组件用于声明式导航。

##### 5.1.3.1 Link组件
`<Link>`组件用于实现基本的声明式导航，它会渲染一个`<a>`标签，但不会刷新页面。

```jsx
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <Link to="/">首页</Link>
      <Link to="/login">登录</Link>
      <Link to="/article/123">文章详情</Link>
    </nav>
  );
};
```

##### 5.1.3.2 NavLink组件
`<NavLink>`组件是`<Link>`的增强版，它会根据当前路由自动添加`active`类名，用于实现导航高亮效果。

```jsx
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        首页
      </NavLink>
      <NavLink
        to="/login"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        登录
      </NavLink>
      <NavLink
        to="/article/123"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        文章详情
      </NavLink>
    </nav>
  );
};
```

#### 5.1.4 编程式导航
编程式导航是通过JavaScript代码来实现路由跳转，React Router v6中主要使用`useNavigate` Hook来实现。

##### 5.1.4.1 useNavigate Hook
`useNavigate` Hook返回一个函数，该函数可以用于实现编程式导航。

```jsx
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // 登录成功后跳转到首页
    navigate("/");
    
    // 跳转到指定路径，并替换当前历史记录
    // navigate("/", { replace: true });
    
    // 前进或后退
    // navigate(1); // 前进一页
    // navigate(-1); // 后退一页
    
    // 跳转到带参数的路由
    // navigate("/article/123");
    
    // 跳转到带查询参数的路由
    // navigate("/search?keyword=react");
  };
  
  return (
    <div>
      <h2>登录</h2>
      <button onClick={handleLogin}>登录</button>
    </div>
  );
};
```

##### 5.1.4.2 在组件外部使用导航
在非组件环境中，可以使用`createBrowserRouter`返回的`router.navigate`方法来实现导航。

#### 5.1.5 路由类型
- **BrowserRouter**：使用history模式，URL没有#符号
- **HashRouter**：使用hash模式，URL带有#符号

#### 5.1.6 懒加载
使用`lazy`和`Suspense`实现组件懒加载，优化性能

```jsx
const Home = lazy(() => import("@/pages/Home"));

// 使用懒加载组件
<Suspense fallback={<div>Loading...</div>}>
  <Home />
</Suspense>
```

## 6. 常用工具库

### 6.1 lodash
JavaScript实用工具库，提供了很多常用的函数

```jsx
import _ from "lodash";

// 数组排序示例
const sortedList = _.orderBy(defaultList, ["like"], ["desc"]);
```

### 6.2 classnames
用于条件拼接CSS类名

```jsx
import classNames from "classnames";

// 条件类名示例
<span
  className={classNames("nav-item", {
    active: type === item.type,
  })}
>
  {item.text}
</span>
```

### 6.3 uuid
生成唯一标识符

```jsx
import { v4 as uuidV4 } from "uuid";

// 生成唯一ID
const newId = uuidV4();
```

### 6.4 dayjs
轻量级的日期处理库

```jsx
import dayjs from "dayjs";

// 格式化日期
const formattedDate = dayjs(new Date()).format("MM-DD hh:mm");
```

## 7. 表单处理

### 7.1 受控组件
```jsx
const ReactVModel = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)} // 受控组件
      />
    </div>
  );
};
```

## 8. 总结

本总结涵盖了React开发中的核心知识点，包括：

- **React基础**：工程化环境创建（CRA、Vite、Next.js）、JSX语法、函数组件与类组件、条件渲染与列表渲染、事件处理、状态管理（useState）、样式处理、DOM操作（useRef）
- **组件通信**：父子组件通信、兄弟组件通信、跨层组件通信（Context API）
- **React高级特性**：副作用处理（useEffect）、自定义Hook、性能优化（useMemo/useCallback）、复杂状态管理（useReducer）、组件实例暴露（useImperativeHandle）
- **状态管理**：Redux Toolkit（同步状态、异步状态）、Zustand
- **路由管理**：React Router基础配置、路由守卫、声明式导航、编程式导航、路由类型、组件懒加载
- **常用工具库**：lodash、classnames、uuid、dayjs
- **表单处理**：受控组件

## 9. 学习资源

- [React官方文档](https://react.dev/)
- [Redux Toolkit官方文档](https://redux-toolkit.js.org/)
- [React Router官方文档](https://reactrouter.com/)
- [Zustand官方文档](https://zustand-demo.pmnd.rs/)

---

**注意**：本总结基于React 18版本，部分API可能在旧版本中有所不同。建议结合官方文档或最新b站教学视频进行学习和使用。