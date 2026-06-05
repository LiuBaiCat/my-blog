---
title: uni-app的学习
date: 2024-12-28
tags: [uni-app, 基础学习]
description: uni-app的学习
pinned: false
---

# uni-app的学习

## 1.uni-app与html的区别

> 一些常用属性

| uni-app     | HTML               |
| ----------- | ------------------ |
| view        | div标签            |
| text        | span标签           |
| scroll-view | overflow:scroll    |
| swiper      | 轮播图             |
| navigator   | a标签（/路由跳转） |

### 1.view

属性

> 1.手指按上去之后的样式
>
> hover-class="boxHover"
>
> 2.手指松开后点击态保留的时间
>
> hover-stay-time="0"
>
> 3.手指按住之后多久（毫秒）出现点击态
>
> hover-start-time="50"
>
> 4.阻止冒泡
>
> hover-stop-propagation = "true"

![](/img_uniapp/01.png)

### 2.text

> 1.文本是否可被选中
>
> selectable
> ⚠️ 注意：`selectable` 在微信小程序中长按只能选中整段文本，体验不一致；如需精细选择，考虑使用 `rich-text` 或 `view` + `user-select:text`。
>
> 2.显示连续空格
>
> space="ensp"（中文字符空格一半大小）
>
> space="emsp"（中文字符空格大小）
>
> space="nbsp"（根据字体设置的空格大小）

### 3.scroll-view

> 1.允许纵向滚动
>
> scroll-y="true"
>
> 2.其他属性可以看官网细究
>
>  💡 常见坑点：在微信小程序中，`scroll-view` 必须设置一个**明确的高度**（例如 `height: 200rpx` 或父容器固定高度），否则不会滚动。`flex:1` 不一定生效。
>  https://uniapp.dcloud.net.cn/component/scroll-view.html

### 4.swiper

```vue
<swiper class="swiper">
    <swiper-item>111</swiper-item>
    <swiper-item>222</swiper-item>
    <swiper-item>333</swiper-item>
    <swiper-item>444</swiper-item>
</swiper>
```

> 1.是否显示面板指示点
>
> indicator-dots
>
> 2.指示点颜色
>
> indicator-color
>
> 3.当前选中的指示点颜色
>
> indicator-active-color
>
> 4.是否采用衔接滑动，即播放到末尾后重新回到开头
>
> circular
>
> 5.自动播放
>
> autoplay
>
> 6.自动切换时间间隔
>
> interval="5000"
>
> 7.滑动方向是否为纵向
>
> vertical

### 5.navigator

```vue
<navigator url="/pages/demo1/demo1">
    跳转到demo1
</navigator>
```

1.跳转方式

| open-type 值     | 对应 API         | 说明                     |
| ---------------- | ---------------- | ------------------------ |
| navigate（默认） | `uni.navigateTo` | 保留当前页，跳转新页面   |
| redirect         | `uni.redirectTo` | 关闭当前页，跳转新页面   |
| reLaunch         | `uni.reLaunch`   | 关闭所有页面，打开新页面 |
| switchTab        | `uni.switchTab`  | 跳转到 tabBar 页面       |

2.两个小程序之间的跳转方式【比如：不小心点到广告跳转到另一个地方去】

target="self"（默认）

# 补充说明：其他需要注意的地方

---

## 一、项目结构与配置（和普通 Vue/React 项目不同）

1. **pages.json 代替路由配置文件**

   不像 Vue Router 或 React Router 写在代码里，uni-app 的路由和页面路径必须在 `pages.json` 中注册。

   ```json
   {
     "pages": [
       {"path": "pages/index/index", "style": {...}},
       {"path": "pages/demo/demo"}
     ],
     "globalStyle": {...},
     "tabBar": {...}
   }
   ```

2. **manifest.json 管理应用配置**

   用于设置 App 名称、图标、权限、微信小程序的 AppID 等，跨端打包必须配置。

3. **uni.scss 全局样式变量**

   内置了一些常用变量（如主题色、圆角），可以覆盖以统一风格。

---

## 二、样式差异（重点踩坑区）

1. **尺寸单位推荐 rpx**

   相当于屏幕宽度的 1/750，自动适配不同屏幕（包括小程序和 App）。不要习惯性只用 px。

2. **不支持部分 CSS 选择器**

   小程序环境下不支持通配符 `*`、部分伪类（如 `:before` 可用，但 `:nth-child` 可能有问题），也尽量避免使用 `id` 选择器（性能问题）。

3. **背景图片**

   本地图片不能直接通过 `background-image: url(../static/xxx.png)` 使用（小程序限制），建议改用 `<image>` 组件或转换为 base64 / 网络图片。

4. **fixed 定位的差异**

   在 App 端可能受原生导航栏影响，需要配合 `nvue` 或使用 `page` 的 `:style` 动态调整。

---

## 三、生命周期（混合了 Vue 和页面级生命周期）

| Vue 生命周期          | uni-app 页面生命周期            | 说明                                                              |
| --------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `created` / `mounted` | `onLoad` / `onShow` / `onReady` | `mounted` 在 App 端不一定代表页面可见，建议用 `onShow` 做数据刷新 |
| -                     | `onPullDownRefresh`             | 下拉刷新，需在 pages.json 中开启 `"enablePullDownRefresh": true`  |
| -                     | `onReachBottom`                 | 触底加载更多                                                      |
| -                     | `onShareAppMessage`             | 分享（小程序、App 均可）                                          |

💡 **注意**：页面跳转传参在 `onLoad(options)` 中接收，而 Vue 的 `$route` 不存在。

---

## 四、路由与跳转（不能用 `<router-link>` 或 `useRouter`）

| 场景                   | 组件方式                                 | API 方式                  |
| ---------------------- | ---------------------------------------- | ------------------------- |
| 普通跳转（保留当前页） | `<navigator url="/pages/detail/detail">` | `uni.navigateTo({ url })` |
| 替换当前页             | 无直接组件                               | `uni.redirectTo({ url })` |
| 关闭所有页面打开新页   | `open-type="reLaunch"`                   | `uni.reLaunch({ url })`   |
| TabBar 跳转            | `open-type="switchTab"`                  | `uni.switchTab({ url })`  |

💡 **坑点**：如果目标页面在 tabBar 中，只能用 `switchTab`，否则会报错。

---

## 五、条件编译 – 跨端定制的核心武器

uni-app 最大价值是一套代码多端运行，但不同端有不同需求，使用 `#ifdef` / `#ifndef` 注释来控制编译。

```vue
<!-- #ifdef H5 -->
<view>只在 H5 显示</view>
<!-- #endif -->

<!-- #ifdef MP-WEIXIN -->
<button open-type="getUserInfo">微信专用按钮</button>
<!-- #endif -->

<!-- #ifdef APP-PLUS -->
<plus-component />
<!-- #endif -->
```

> 📌 **不同区块的条件编译写法**：
>
> - 模板（template）中：`<!-- #ifdef H5 -->`
> - 脚本（script）中：`/* #ifdef H5 */`
> - 样式（style）中：`/* #ifdef H5 */`
> - 注意：`#ifndef` 表示“除了该平台”，`#endif` 结尾。

支持平台：`APP-PLUS`、`H5`、`MP-WEIXIN`、`MP-ALIPAY`、`MP-BAIDU` 等。

---

## 六、API 调用方式（异步风格与 Promise 化）

uni-app 提供全局 `uni` 对象，所有 API 风格类似微信小程序（回调函数），但可以 **Promise 化**：

```javascript
// 传统回调
uni.request({
  url: "https://...",
  success: (res) => {},
  fail: (err) => {},
});

// Promise 化（推荐）
const [err, res] = await uni.request({ url }).catch((e) => [e]);
```

💡 官方提供了 `uni.addInterceptor` 做全局处理，也可以自己封装 `uni.promisify`。

---

## 七、原生组件与普通组件的交互限制

- 小程序中的 `video`、`map`、`textarea` 等是**原生组件**，层级最高，会覆盖普通 `view`。解决方案：
  - 使用 `cover-view` / `cover-image` 覆盖到原生组件之上。
  - 避免在原生组件上方悬浮复杂交互元素。

- App 端可使用 `nvue`（原生渲染），解决长列表性能问题，但写法与普通 `vue` 略有差异（不支持某些 CSS 属性）。

---

## 八、状态管理（Vuex / Pinia 的跨端限制）

- uni-app **完全支持 Vuex 和 Pinia**，但在**微信小程序环境**下有一个注意事项：

  **不要**在 `store` 中存储 `Map`、`Set`、`Date` 等非基本类型，因为这些数据在微信小程序的序列化/反序列化过程中会丢失原型。建议只存储 JSON 可序列化的数据。

- 多页面共享状态时，`uni.getStorageSync` / `uni.setStorageSync` 也是一种跨页面的简单方案（类似 localStorage，但容量较小，约 10MB）。

> ⚠️ 分包限制：如果你的项目使用了分包，Vuex / Pinia 的 store 必须在**主包**中初始化并导出。分包内的页面如果直接 `import store`，可能会因为分包加载时机问题导致 store 为 `undefined`。解决方案：在主包 `main.js` 中挂载到 Vue 原型，或通过全局 `getApp().store` 访问。

---

## 九、组件通信的额外方式（跨端特有）

| 方式                        | 适用场景                         | 注意点                                                                             |
| --------------------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| `uni.$emit` / `uni.$on`     | 全局事件总线（任意页面/组件）    | 小程序端也支持，但记得在 `onUnload` 中 `off`，否则会内存泄漏                       |
| `getCurrentPages()`         | 获取页面栈，直接调用上一页的方法 | 只在页面级别可用，组件内慎用                                                       |
| `uni.createSelectorQuery()` | 获取节点信息（宽高、位置）       | 类似 `document.querySelector`，但必须放在 `onReady` 或 `setTimeout` 中，否则拿不到 |

> ⚠️ 注意：`getCurrentPages()` 在 `onLoad` 生命周期中调用时，可能无法获取到完整的页面栈（例如上一个页面尚未完全入栈）。建议在 `onReady` 或 `setTimeout` 中延迟使用。

---

## 十、自定义导航栏与原生交互

很多项目需要隐藏默认导航栏，自定义头部：

```json
// pages.json
{
  "path": "pages/user/user",
  "style": {
    "navigationStyle": "custom" // 隐藏原生导航栏
  }
}
```

然后你自己写一个 `<view class="custom-nav">` 模拟状态栏高度 + 标题。

需要注意：

- **状态栏高度**通过 `uni.getSystemInfoSync().statusBarHeight` 获取。
- 右侧按钮的点击区域要足够大（小程序默认最小点击区域 44rpx）。
- 自定义导航栏后，页面的 `onShareAppMessage` 仍然有效，但需要手动绑定按钮触发 `uni.share` 吗？不用，`button open-type="share"` 依然能用。

---

## 十一、性能优化：长列表与图片懒加载

1. **长列表**：使用 `<recycle-list>`（App 端专用）或 `<list>` 组件（nvue）来回收视图。H5 和小程序直接使用 `scroll-view` + 虚拟滚动（需自己实现或借助第三方库）。

2. **图片懒加载**：小程序里 `<image lazy-load="true" />` 有效；H5 和 App 端则需要手动使用 `IntersectionObserver` 或 `uni.createIntersectionObserver`。

3. **避免频繁 setData**：不要在一个循环里调用多次 `this.data = xxx`，而是先组装好对象再一次性赋值。这和 React 的 `setState` 合并更新类似，但小程序环境更敏感。

---

## 十二、跨端兼容性列表（官方不保证 100% 一致）

有些 CSS 属性或 JS API **只在特定端有效**：

| 特性               | H5     | 微信小程序                                  | App    |
| ------------------ | ------ | ------------------------------------------- | ------ |
| `position: sticky` | ✅     | ❌（需用 `scroll-view` 的 `sticky` 属性）   | ✅     |
| `localStorage`     | ✅     | ❌（用 `uni.setStorageSync` 替代）          | ✅     |
| `WebSocket`        | ✅     | ✅（但额外限制：并发 5 个，不能配置子协议） | ✅     |
| `canvas` 绘图      | 全支持 | 部分 2d API 缺失                            | 全支持 |

> 解法：**条件编译 + 真机测试**。不要相信模拟器的表现。

---

## 十三、文件结构与命名陷阱（影响编译结果）

- **页面文件必须放在 `pages` 目录下**，且文件名（不带扩展名）需与 `pages.json` 中的 `path` 最后一段一致。例如 `pages/user/info.vue` 对应 `"path": "pages/user/info"`。

- **组件文件名推荐大驼峰**（如 `UserCard.vue`），但在模板中使用时需转为 kebab-case（`<user-card />`）或保持大驼峰（`<UserCard />`）—— uni-app 都支持，但**微信小程序工具**可能对大驼峰给出警告。

- **static 目录**下的文件不会被编译，也不会被 tree shaking。图片、字体等资源放这里，但**不要放 JS 文件**（因为不会被 webpack 处理，且无法引入）。

---

## 十四、nvue 的“血泪教训”（App 端高性能渲染）

nvue 是 uni-app App 端的原生渲染方案（基于 weex），与普通 vue 页面差异巨大：

| 特性     | nvue                                                         | 普通 vue |
| -------- | ------------------------------------------------------------ | -------- |
| CSS 支持 | 子集（仅 flex 布局，不支持 `position: absolute` 以外的定位） | 完整 CSS |
| 盒模型   | 默认 `border-box`，且 `width` 不支持百分比（需用 750rpx）    | 正常     |
| 生命周期 | 无 `mounted`，用 `created` + `ready`                         | 完整     |
| 页面切换 | 无法使用 `navigateTo` 保留 nvue 页面（会触发卸载）           | 正常     |

**使用建议**：只有长列表、复杂动画等性能敏感页面才用 nvue，普通页面用 vue。两者可以通过 `vue -> nvue` 跳转，但**不能共用同一组件**（除非用条件编译区分）。

---

## 十五、renderjs – 弥补跨端 DOM 操作缺失

在某些场景（如集成三方地图 SDK、富文本编辑器），需要直接操作 DOM。H5 端可以，但小程序端不行。uni-app 提供 `renderjs`，它是一个运行在视图层的特殊 script：

```vue
<script module="test" lang="renderjs">
export default {
  methods: {
    handleClick() {
      // 这里可以操作 document、window
      document.getElementById('xxx').style.color = 'red';
    }
  }
}
</script>
```

- **只能用于 H5 和 App 端**（小程序不支持）。
- 与逻辑层（普通 script）通信通过 `this.$ownerInstance.callMethod()` 或全局事件。
- 适合做地图、图表（ECharts）等需要 DOM 的库。

---

## 十六、微信小程序登录的坑（2023 年后 API 变更）

微信官方调整了 getUserInfo 和 getUserProfile：

- `uni.getUserInfo` 不再弹出授权窗口，只能获取匿名信息。
- 正确流程：使用 `uni.getUserProfile`（每次调用都会弹窗）或 `button open-type="getUserInfo"`（但该方式已废弃）。
- 推荐流程：先用 `uni.login` 获取 code，传给后端换取 openId；用户点击“授权头像昵称”时调用 `uni.getUserProfile`。

**注意**：`getUserProfile` 必须由用户点击触发（不能自动调用），并且小程序审核时若涉及登录，必须提供“拒绝授权仍可浏览”的模式。

> 📅 **2025 年现状**：`uni.getUserProfile` 虽然仍可用，但微信官方已逐步收紧，频繁调用可能导致弹窗被拦截。更推荐的静默登录方案：
>
> 1. 使用 `uni.login` 获取 `code`，传给后端换取 `openId` / `unionId`。
> 2. 需要用户头像昵称时，使用 `<button open-type="chooseAvatar">`（新版微信小程序）或引导用户手动上传。
> 3. 手机号一键登录（`getPhoneNumber`）是当前最稳妥的实名方式。

---

## 十七、分包与预下载（微信小程序包体积超限的解决方案）

当主包超过 2MB，必须分包：

```json
// pages.json
{
  "subPackages": [
    {
      "root": "packageA",
      "pages": ["pages/cat/cat", "pages/dog/dog"]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA"]
    }
  }
}
```

**坑点**：

- 分包内的页面跳转路径必须写全（例如 `/packageA/pages/cat/cat`）。
- 分包之间不能互相引用对方静态资源（图片等需放在主包 `static` 或使用网络图）。
- 独立分包（`independent`）可以独立于主包运行，适合登录页等。

---

## 十八、富文本渲染的多种方案与选型

| 方案                             | 适用端                 | 说明                                    |
| -------------------------------- | ---------------------- | --------------------------------------- |
| `v-html`                         | H5、App（普通 vue 页） | 不支持小程序，且容易 XSS                |
| `rich-text` 组件                 | 全部                   | 支持有限标签，性能好，但样式难控制      |
| `uparse` / `u-parse`（社区插件） | 全部                   | 基于 `rich-text` 扩展，支持表格、视频等 |
| `web-view` 加载 HTML             | 全部                   | 适合复杂富文本，但交互受限              |

推荐：简单内容用 `rich-text`；复杂内容用 `web-view` 或小程序内嵌 H5。
