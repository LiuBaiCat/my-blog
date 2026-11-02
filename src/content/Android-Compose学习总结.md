---
title: Jetpack Compose 基础学习总结
date: 2025-01-09
updatetime: 2026-11-02
tags: [Android, Jetpack Compose, Kotlin, 学习笔记]
description: 基于 2024–2025 年 Jetpack Compose Codelab 截图整理的完整基础复习，涵盖生命周期、布局、Material 3、资源、懒加载列表、状态、副作用、自适应、无障碍与 UI 测试。
pinned: false
---

# 01. 从“画界面”切换到“描述界面”

这份笔记来自 2024 年底到 2025 年初学习 Android 与 Jetpack Compose 时留下的 31 张 Codelab 截图。内容分散在 Greeting、Dice Roller、Tip Time、MySoothe 和 Wellness 等小示例中，按知识体系重组后，可以串成这条路线：Compose 如何描述界面、如何布局、如何访问资源、如何承载列表、如何管理状态，以及如何适配不同窗口尺寸。

## 1.1 Composable 是“界面描述函数”

传统 View 体系经常先找到控件对象，再修改属性；Compose 则让 `@Composable` 函数描述“当前状态下界面应该是什么样”。界面随状态变化自动重新计算。

```kotlin
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(text = "Hello, $name!", modifier = modifier)
}
```

`Greeting` 没有手动返回一个 TextView，而是通过调用 `Text` 发出界面内容。Compose 执行界面的过程称为组合（composition）；读取到的状态变化后，受影响的 Composable 会重组（recomposition）。因此每写一段界面，都要同时想清楚：它由哪些 Composable 组成、由谁决定尺寸和位置、哪些值会变化，以及变化后由谁持有状态。

## 1.2 界面是父子层级结构

Compose 页面是一棵 Composable 树。父容器负责安排子元素，子元素内部还能继续嵌套。三个基础容器分别是：

| 容器 | 主要用途 |
| --- | --- |
| `Column` | 子元素从上到下排列 |
| `Row` | 子元素从左到右排列 |
| `Box` | 把子元素叠放在同一区域，并控制对齐 |

大多数“元素怎么跑到这里去了”的问题，最终都能追溯到父容器尺寸、子元素尺寸或 Modifier 链。

## 1.3 用 Preview 缩短反馈路径

`@Preview` 让 Android Studio 不必启动模拟器就能查看 Composable。截图中的预览使用了 `@Preview(showBackground = true, showSystemUi = true, name = "My Preview")`，并把 `Greeting` 包在 `HappyBirthdayTheme` 中。该主题属于原练习项目，独立复现时要换成自己的主题或最小的 `MaterialTheme`；Preview 适合快速检查，但不能代替真实设备上的交互、旋转和性能测试。

## 1.4 组合、重组与离开组合

一个 Composable 会经历三个容易混淆的阶段：

| 阶段 | 含义 | 会发生什么 |
| --- | --- | --- |
| 首次组合 | 第一次执行 Composable | 创建界面节点、状态和记住的对象 |
| 重组 | 读取的状态可能变化 | 重新执行受影响的 Composable，跳过输入未变的部分 |
| 离开组合 | 界面节点从树中移除 | 取消与它关联的副作用和协程 |

因此不能把 Composable 当成只会执行一次的普通函数。它可能因为状态、参数或父级变化而多次运行，也可能被 Compose 跳过一个没有必要重组的子树。

## 1.5 Composable 应保持无副作用

网络请求、数据库写入、注册监听器、修改全局变量等操作不应该直接写在 Composable 的普通执行路径中。因为重组次数和顺序不是业务逻辑可以依赖的约定，重复执行会带来重复请求或重复注册。需要与组合生命周期绑定的工作，应交给 `LaunchedEffect`、`DisposableEffect` 等副作用 API，后面会单独整理。

# 02. 布局与 Modifier：先位置，后外观

## 2.1 Column、Row、Box 与排列方式

`Column` 和 `Row` 都有一条主轴和一条交叉轴。`Column` 使用 `verticalArrangement` 分配纵向空间，用 `horizontalAlignment` 控制横向对齐；`Row` 使用 `horizontalArrangement` 分配横向空间，用 `verticalAlignment` 控制纵向对齐。

```kotlin
Column(
    modifier = Modifier.fillMaxWidth().padding(16.dp),
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.spacedBy(12.dp)
) {
    Text("Align your body")
    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("Inversions")
        Text("Quick yoga")
    }
}
```

`Arrangement.Start`、`Center`、`End` 对应主轴起点、居中和终点；`SpaceBetween`、`SpaceAround`、`SpaceEvenly` 把剩余空间放到子元素之间或周围。`spacedBy()` 提供固定间距，通常比手动塞 Spacer 更直观。

`Box` 不负责排队，而是把多个子元素叠在同一个区域。既可以用 `contentAlignment` 统一对齐，也可以对子元素使用 `Modifier.align()`；背景图片和标题文字就适合这样叠放。

## 2.2 Modifier 是有顺序的装饰链

Modifier 可给元素增加尺寸、内边距、背景、裁剪、点击和滚动行为。它不是无序属性，链式调用顺序会改变结果。

```kotlin
Text(
    text = "Hello, Compose!",
    modifier = Modifier.padding(16.dp).background(Color.Green)
)
```

上面的代码先留出内边距，再给整块区域画背景。交换顺序后，绿色只覆盖文字附近，外侧再补上透明内边距。`size()` 与 `clip()` 也遵循同样思路：先确定尺寸，再按目标形状裁剪。

```kotlin
Image(
    painter = painterResource(R.drawable.avatar),
    contentDescription = "用户头像",
    contentScale = ContentScale.Crop,
    modifier = Modifier.size(88.dp).clip(CircleShape)
)
```

`clip(CircleShape)` 只负责视觉裁剪，不改变图片比例；图片怎样填满圆形，还要由 `contentScale` 决定。

## 2.3 普通滚动与内容内边距

普通 `Column` 或 `Row` 内容溢出时不会自动滚动。内容有限且整体需要滚动时，可以添加 `verticalScroll(rememberScrollState())`：

```kotlin
Column(
    modifier = Modifier.padding(40.dp).verticalScroll(rememberScrollState()),
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.Center
) {
    TipTimeContent()
}
```

`rememberScrollState()` 保存滚动位置。这里把 `verticalScroll` 放在 `padding` 后面，表示内容在内边距以内的视口中移动；交换位置会改变可滚动边界。子项很多时则优先使用 Lazy 容器，只组合可见项目。

## 2.4 父级约束与常用尺寸修饰符

Compose 的一次布局可以粗略理解成三步：父级把最小/最大约束传给子级；子级在这个范围内选择自己的尺寸；父级再决定子级放在什么位置。理解这个顺序后，很多尺寸问题就不需要反复试错。

| Modifier | 作用 |
| --- | --- |
| `fillMaxWidth()` | 在父级允许的最大宽度内尽量铺满 |
| `size()` | 请求固定尺寸，但仍会受父级约束影响 |
| `requiredSize()` | 强制使用指定尺寸，并覆盖父级传入的约束，谨慎使用 |
| `weight()` | 在 `Row` 或 `Column` 中分配剩余主轴空间 |
| `aspectRatio()` | 根据一个维度保持指定宽高比 |
| `Spacer()` | 只占空间、不显示内容，常与固定间距或 `weight` 配合 |

```kotlin
Row(Modifier.fillMaxWidth()) {
    Text(
        text = "标题占据剩余空间",
        modifier = Modifier.weight(1f)
    )
    Spacer(Modifier.width(12.dp))
    Box(Modifier.size(48.dp).background(MaterialTheme.colorScheme.primary))
}
```

`weight()` 只在 `RowScope` 或 `ColumnScope` 中可用，而且应当作用于直接子元素。`fillMaxWidth()` 是“在约束内铺满”，`requiredSize()` 则是“无视一部分父级限制”，后者很容易让界面越界，通常不是处理普通布局的首选。

# 03. Material 3、主题与常用控件

## 3.1 MaterialTheme 统一颜色、字体与形状

Material 3 页面通常在根部包一层 `MaterialTheme`。颜色、排版和形状通过 CompositionLocal 向下提供，子组件可以直接读取 `MaterialTheme.colorScheme`、`MaterialTheme.typography` 与 `MaterialTheme.shapes`。

```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) darkColorScheme() else lightColorScheme()
    MaterialTheme(colorScheme = colors, content = content)
}
```

`isSystemInDarkTheme()` 读取系统深浅色设置；切换主题时，状态变化会触发相关界面重组。实际项目还可以提供自定义 `Typography` 和 `Shapes`，但不要把业务状态塞进 Theme。组件颜色优先使用 `MaterialTheme.colorScheme.primary`、`surface` 等语义色，而不是到处硬编码颜色值。

## 3.2 Button、Card、Switch 等常用控件

Material 3 已经把颜色、交互态和无障碍语义封装进常用组件。初学时先记住组件职责，比背全部参数更重要：

| 控件 | 主要用途 | 关键交互 |
| --- | --- | --- |
| `Button` / `OutlinedButton` | 普通或次要操作 | `onClick` |
| `IconButton` | 只放图标的独立操作 | `onClick` + 图标描述 |
| `Card` | 把相关内容组织成一个表面 | 可接受点击或自定义内容 |
| `Switch` | 打开/关闭一个设置 | `checked` + `onCheckedChange` |
| `Checkbox` | 选择一项或多项 | `checked` + `onCheckedChange` |
| `TextField` / `OutlinedTextField` | 接收文字输入 | `value` + `onValueChange` |

受控组件本身通常不替调用方保存业务值。例如 `Switch` 只显示传入的 `checked`，用户拨动时发出 `onCheckedChange`；真正的状态仍由调用方持有，这与前面讲过的状态提升是同一种模式。

## 3.3 TextField 与输入状态

最基础的 TextField 使用 `value/onValueChange`。输入文字需要跨配置变更保留时，可以让字符串由 `rememberSaveable` 持有：

```kotlin
var name by rememberSaveable { mutableStateOf("") }

OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("姓名") },
    singleLine = true
)
Text("你好，$name")
```

`onValueChange` 收到的新字符串是“请求修改”的事件，不保证调用方一定接受；表单校验可以在这里过滤输入或保留原值。较新的 Compose 文本 API 还提供 `rememberTextFieldState()` 和 `TextFieldState`，更适合需要选区、组合输入和输入转换的复杂输入框。基础表单无需一开始就引入所有高级能力，但要认识到：UI 控件与文本状态正在进一步解耦。

# 04. 资源、字符串与图片

## 4.1 `res` 与自动生成的 `R` 类

图片、字符串、颜色等静态内容放在 `app/src/main/res` 下。Resource Manager 可把图片导入 `drawable` 等目录；编译时 Android 生成 `R` 类，代码通过资源 ID 访问：

```kotlin
val imageId = R.drawable.androidparty
val titleId = R.string.happy_birthday_text
```

`R.drawable.androidparty` 可拆成三部分：`R` 是自动生成的资源引用类，`drawable` 是资源类型或目录，`androidparty` 是文件名对应的资源 ID。导入位图时截图选择了 `No Density`，文件进入 `drawable-nodpi`，表示不按屏幕密度重新缩放。它适合像素尺寸本来就具有明确含义的素材，普通界面图片和图标不应全部选 `No Density`。

## 4.2 字符串资源与 `stringResource`

直接写 `Text("Happy Birthday Sam!")` 会把文字散落在代码中，翻译、复用和统一修改都不方便。Android Studio 的 “Extract string resource” 可以把字面量提取到 `strings.xml`，例如资源名 `happy_birthday_text`、文件 `strings.xml`、目录 `values`。

资源名通常使用小写字母和下划线。随后用 `stringResource()` 读取，其他语言只要提供同名资源，界面文字就会随配置变化：

```kotlin
Text(text = stringResource(id = R.string.happy_birthday_text))
```

## 4.3 Image、ContentScale 与无障碍描述

`Image` 要同时考虑来源、描述和缩放方式：

```kotlin
Image(
    painter = painterResource(id = R.drawable.ab1_inversions),
    contentDescription = stringResource(R.string.ab1_inversions),
    contentScale = ContentScale.Crop,
    modifier = Modifier.size(88.dp).clip(CircleShape)
)
```

| 类型 | 行为 | 常见场景 |
| --- | --- | --- |
| `Fit` | 完整显示图片，可能留下空白 | 不能裁掉内容的插画 |
| `FillBounds` | 拉伸填满边界，可能变形 | 对比例不敏感的占位图 |
| `Crop` | 保持比例并裁掉溢出部分 | 头像、封面和卡片图 |

`contentDescription` 提供给屏幕阅读器。信息图片要写有意义的描述；纯装饰图片可设为 `null`，避免读屏重复朗读。资源引用中的描述不能只是为了消除警告而复制文件名。

# 05. 懒加载列表与网格

## 5.1 LazyRow：只组合可见项目

横向卡片列表使用 `LazyRow`。它自带横向滚动，不需要再套 `horizontalScroll()`：

```kotlin
LazyRow(
    contentPadding = PaddingValues(horizontal = 16.dp),
    horizontalArrangement = Arrangement.spacedBy(16.dp)
) {
    items(wellnessTasks, key = { task -> task.id }) { task ->
        WellnessTaskCard(task)
    }
}
```

`WellnessTask` 和 `WellnessTaskCard` 是原项目类型；独立项目要换成自己的数据与 item 内容。为动态列表提供稳定 `key`，可帮助 Compose 在插入、删除或重排时正确复用组合。

## 5.2 LazyColumn：纵向长列表

纵向列表是最常用的 Lazy 容器。`key` 解决“这是不是同一个项目”的身份问题，`contentType` 则帮助 Compose 知道哪些 item 可以复用同一种组合结构：

```kotlin
@Composable
fun TaskList(tasks: List<WellnessTask>) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(
            items = tasks,
            key = { task -> task.id },
            contentType = { "task" }
        ) { task ->
            WellnessTaskCard(task)
        }
    }
}
```

这是依赖原项目 `WellnessTask` 的类型示例。只有一种 item 时 `contentType` 可以省略；同一列表混合标题、图片卡片、广告等不同结构时，提供不同类型值可以减少错误复用。

## 5.3 LazyHorizontalGrid：横向滚动、内部成行

`LazyHorizontalGrid` 适合“左右滚动、每个横向区域有两行卡片”的布局。截图中的收藏集合固定两行，并设置固定高度：

```kotlin
LazyHorizontalGrid(
    rows = GridCells.Fixed(2),
    contentPadding = PaddingValues(horizontal = 16.dp),
    horizontalArrangement = Arrangement.spacedBy(16.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
    modifier = Modifier.height(168.dp)
) {
    items(favoriteCollections) { item ->
        FavoriteCollectionCard(item, Modifier.height(80.dp))
    }
}
```

网格高度、行数和卡片高度必须一起考虑。父容器过高会纵向拉伸卡片，固定高度太小又可能截断内容。这里的两行、16dp 间距、80dp 卡片和 168dp 网格是一组配套约束。

## 5.4 `padding` 与 `contentPadding`

给整个 Lazy 容器加普通 `Modifier.padding()`，滚动视口本身会缩进，首尾项目移动到边缘时仍可能被裁切。`contentPadding` 则把内边距算进滚动内容的首尾。当目标是“列表占满父级宽度，但首尾项目与屏幕边缘保持 16dp 距离”时，优先使用 `contentPadding`；当目标是“整个列表都不进入父容器某区域”时，才更适合外层尺寸约束或普通 padding。

# 06. 状态、重组与单向数据流

## 6.1 `mutableStateOf` 让值可观察

普通局部变量每次重组都可能重新初始化。`mutableStateOf()` 返回可观察的 `MutableState<T>`，读取它会让当前 Composable 订阅变化：

```kotlin
var result by remember { mutableStateOf(1) }

Button(onClick = { result = (1..6).random() }) {
    Text("Roll")
}
Text("Result: $result")
```

`by` 让状态看起来像普通变量，但读写实际经过 `MutableState`。赋值后，读取过 `result` 的 Composable 会重组并显示新结果；`remember` 则把状态容器保留在一次组合的生命周期中。要记住：`mutableStateOf` 提供状态容器，`remember` 负责在重组间保留它，状态被修改才会触发相关界面刷新。

## 6.2 `remember` 与 `rememberSaveable`

`remember` 只能跨越重组。旋转屏幕、切换深浅色、修改语言等配置变更可能导致 Activity 重建，此时局部状态会丢失。`rememberSaveable` 会通过保存实例状态恢复数据：

```kotlin
var count by rememberSaveable { mutableStateOf(0) }
```

| 保存位置 | 生命周期 | 适合保存 |
| --- | --- | --- |
| `remember` | 当前组合与重组 | 临时对象、滚动控制对象 |
| `rememberSaveable` | 配置变更和系统重建后恢复 | 输入、开关、轻量页面状态 |
| ViewModel | 通常跨配置变更保留，Activity 完成后释放 | 屏幕级业务状态、异步任务结果 |
| 数据层 | 由数据库、文件或服务定义 | 需要长期持久化的数据 |

`rememberSaveable` 最终要通过 Bundle 一类机制保存，因此类型必须可保存。复杂对象通常需要 `@Parcelize` 或自定义 `Saver`；业务数据、网络结果和页面长期状态不应全部塞进 Composable，后续应由状态持有者或 ViewModel 管理。

## 6.3 状态提升与无状态组件

自己创建并修改状态的 Composable 是有状态组件，用起来方便，但更难复用和测试。状态提升把状态移到调用方，让可复用子组件只接收数据与事件：

```kotlin
@Composable
fun StatelessCounter(
    count: Int,
    onIncrement: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier.padding(16.dp)) {
        if (count > 0) Text("You've had $count glasses.")
        Button(onClick = onIncrement, enabled = count < 10) {
            Text("Add one")
        }
    }
}
```

调用方持有状态，并同时传入当前值和事件：

```kotlin
@Composable
fun StatefulCounter(modifier: Modifier = Modifier) {
    var count by rememberSaveable { mutableStateOf(0) }
    StatelessCounter(count, { count++ }, modifier)
}
```

这就是“状态下降、事件上升”的单向数据流。无状态组件不知道状态存在哪里，只负责显示并发出 `onIncrement`；真正的修改发生在状态拥有者处。提升时，状态至少应放到所有读取者的最低共同父级，并放到能够合法修改它的位置；能由现有状态推导的值通常不必再保存一份。

## 6.4 `remember(key)` 与派生状态

`remember` 可以接收 key。当 key 变化时，之前的对象会失效并重新计算：

```kotlin
val tasks = remember(userId) {
    loadTasksForDisplay(userId)
}
```

这适合“某个输入变了，就必须换一份新对象”的情况，但不能把耗时加载写成阻塞 Composable 的普通函数。另一种常见写法是 `derivedStateOf`：它根据其他可观察状态计算派生值，并在依赖变化时提供更新结果。

```kotlin
val visibleTasks by remember {
    derivedStateOf {
        tasks.filter { it.title.contains(query) }
    }
}
```

这里 `tasks` 和 `query` 都是可观察状态。`derivedStateOf` 更适合读取频繁但结果不一定每次变化、且会被多处读取的派生值；普通的一次性字符串拼接或简单布尔计算直接写表达式即可，不必给每个计算都套一层。

## 6.5 可观察列表

`mutableListOf()` 和 `ArrayList` 可以修改，但添加或删除元素不会通知 Compose。可使用 `mutableStateListOf()`，或把初始集合转换成 `toMutableStateList()`：

```kotlin
val tasks = remember {
    mutableStateListOf<WellnessTask>().apply { addAll(initialTasks) }
}
tasks.add(newTask)
```

`SnapshotStateList<T>` 会在列表结构变化时通知界面。若元素的属性也要独立观察，元素应使用不可变数据并替换整个元素，或把可变字段设计成可观察状态。不能只记住“把 List 换成 MutableList”，还要确认究竟哪一层发生了变化。

## 6.6 状态该留在 Composable 里吗

Composable 适合持有纯 UI 状态，例如菜单是否展开、悬浮按钮的动画状态。涉及业务规则、请求、缓存和跨页面共享的状态，更适合放到状态持有者或 ViewModel。典型链路是：UI 发出事件，ViewModel 更新状态，新的 UI State 回到 Compose，Compose 再描述界面。

ViewModel 的完整分层、StateFlow 收集和依赖注入不在本次基础范围内，但可以先记住边界：Compose 负责“怎么显示”，状态持有者负责“当前是什么状态”，数据层负责“数据从哪里来”。不要把网络请求、数据库访问和复杂业务判断都塞进 Composable。

# 07. 副作用：把一次性工作放对位置

## 7.1 LaunchedEffect：随组合启动协程

`LaunchedEffect` 会在进入组合时启动协程，在离开组合时取消；key 改变时会取消旧任务并按新 key 重启：

```kotlin
LaunchedEffect(userId) {
    profile = loadProfile(userId)
}
```

它适合“当某个 key 对应的工作需要异步执行，并随组件生命周期取消”的场景，例如加载详情、监听一个由 key 决定的数据源。不要使用 `LaunchedEffect(Unit)` 来规避参数变化，也不要写 `LaunchedEffect(true)` 后放永无止境的忙循环；代码能跑起来不等于生命周期正确。

## 7.2 rememberCoroutineScope：从事件启动协程

`LaunchedEffect` 跟随组合自动运行；按钮点击这类由用户事件触发的一次性工作，更适合 `rememberCoroutineScope()`：

```kotlin
val scope = rememberCoroutineScope()
val snackbarHostState = remember { SnackbarHostState() }

Button(onClick = {
    scope.launch {
        snackbarHostState.showSnackbar("已保存")
    }
}) {
    Text("保存")
}
```

这个 scope 与当前组合绑定，Composable 离开后会被取消。它适合 UI 相关协程，不应被拿来绕过 ViewModel 承担业务长任务。

## 7.3 DisposableEffect 与 SideEffect

需要注册和注销资源时，例如监听生命周期、广播或系统回调，使用 `DisposableEffect`：

```kotlin
DisposableEffect(Unit) {
    val listener = createListener()
    registerListener(listener)

    onDispose {
        unregisterListener(listener)
    }
}
```

`onDispose` 会在 key 改变或 Composable 离开组合时执行。没有注销逻辑的同步通知可以使用 `SideEffect`；例如把 Compose 状态同步给一个由外部框架管理的对象。选择原则可以简化为：

| 需求 | 常用 API |
| --- | --- |
| 进入组合后运行 suspend 工作 | `LaunchedEffect` |
| 点击后启动 UI 协程 | `rememberCoroutineScope` |
| 注册并注销监听器 | `DisposableEffect` |
| 每次成功重组后同步外部对象 | `SideEffect` |

副作用不是“把任何代码换个 API 包起来”。如果一个操作只应在点击时发生，就放在事件回调里；如果它属于页面业务，就继续向上交给 ViewModel。

# 08. Scaffold 与自适应界面

## 8.1 用 Scaffold 组织页面骨架

Scaffold 提供 Material 页面常见区域的插槽：

| 插槽 | 典型用途 |
| --- | --- |
| `appBar` | 顶部标题、返回或菜单 |
| `bottomBar` | 底部导航栏 |
| `floatingActionButton` | 右下角主要操作 |
| `drawerContent` | 侧边抽屉 |
| `snackbarHost` | 短暂的操作反馈 |

```kotlin
Scaffold(
    bottomBar = { MyBottomNavigation() },
    floatingActionButton = {
        FloatingActionButton(onClick = { /* 主要操作 */ }) {
            Icon(Icons.Default.Add, contentDescription = "添加")
        }
    }
) { innerPadding ->
    HomeScreen(Modifier.padding(innerPadding))
}
```

Scaffold 会把顶部栏、底部栏和系统栏占用的空间通过 `innerPadding` 交给内容区。内容根节点必须合理消费这份内边距，否则底部列表可能被导航栏遮住。

## 8.2 WindowInsets 与安全绘制区域

启用 edge-to-edge 后，应用可以绘制到状态栏和导航栏后面，但可点击内容仍应避开系统栏、刘海和手势区域。`WindowInsets.safeDrawing` 描述这些需要避开的范围：

```kotlin
Box(
    modifier = Modifier
        .fillMaxSize()
        .windowInsetsPadding(WindowInsets.safeDrawing)
) {
    PageContent()
}
```

Scaffold 默认会通过 `innerPadding` 处理一部分 Insets。已经消费的内边距不要再手动叠加一次，否则会出现重复留白。判断原则是：先确认当前组件是否已经消费系统栏空间，再选择 `padding(innerPadding)`、`windowInsetsPadding()` 或对应的 Insets 参数。

## 8.3 窗口尺寸分类

竖屏预览好看，不代表横屏也合适。窗口宽度分类把可用宽度分为三档：

| 宽度分类 | 大致宽度 | 常见界面策略 |
| --- | --- | --- |
| `Compact` | 小于 600dp | 单栏、底部导航 |
| `Medium` | 600–839dp | 双栏或侧边 NavigationRail |
| `Expanded` | 840dp 及以上 | 多栏、常用侧边导航 |

截图使用 `WindowSizeClass` 为 MySoothe 选择竖向或横向版本：

```kotlin
@OptIn(ExperimentalMaterial3WindowSizeClassApi::class)
@Composable
fun MySootheApp(windowSize: WindowSizeClass) {
    when (windowSize.widthSizeClass) {
        WindowWidthSizeClass.Compact -> MySootheAppPortrait()
        WindowWidthSizeClass.Expanded -> MySootheAppLandscape()
        else -> MySootheAppPortrait()
    }
}
```

入口处在 `setContent` 中执行 `val windowSize = calculateWindowSizeClass(this)`，再把结果传给 `MySootheApp`。这套写法来自当时的 Codelab，`calculateWindowSizeClass` 当时需要选择加入实验性 API。较新的 Material 3 Adaptive 体系提供 `currentWindowAdaptiveInfo()` 等能力；2026 年新建项目应以当前依赖和官方指南为准，不要把 2025 年的实验性示例当成唯一方案。

更重要的是分类思想：根据可用窗口宽度选择布局，而不是根据“手机还是平板”写死设备判断。折叠屏、分屏、自由窗口和横竖屏切换都可能改变应用实际拿到的空间。

# 09. 可访问性、测试与性能意识

## 9.1 Semantics 与无障碍

Compose 会把界面转换为 Semantics 树，供 TalkBack、自动填充和测试工具理解。`Text`、`Button`、`Switch` 等 Material/Foundation 组件已经自带角色、文字和行为语义，不需要为每个控件手工补一套。

只有自绘控件或复杂组合才需要重点关注 `Modifier.semantics`。信息图片写有意义的 `contentDescription`，装饰图片设为 `null`；一组内容需要被读屏当成整体时可以用 `mergeDescendants = true`；开关等组件还可以提供 `stateDescription` 和 `role`。不要用 `clickable` 替代本应使用 `Button` 的语义，否则会丢掉组件默认的交互和无障碍行为。

## 9.2 Compose UI 测试

Compose 测试也通过 Semantics 树查找节点。优先根据用户能看到的文字或描述定位；容易被文案和本地化影响的稳定控件，可以使用 `Modifier.testTag("add-one")`：

```kotlin
@get:Rule
val composeTestRule = createComposeRule()

@Test
fun clickAddOne_updatesCount() {
    composeTestRule.setContent { StatefulCounter() }

    composeTestRule.onNodeWithText("Add one").performClick()
    composeTestRule.onNodeWithText("You've had 1 glasses.")
        .assertIsDisplayed()
}
```

这是局部测试示例，`StatefulCounter` 来自前文；`testTag` 可用 `onNodeWithTag()` 查找。测试应验证用户可见行为，而不是依赖内部实现细节。

## 9.3 基础性能意识

性能优化的起点是少做无意义工作：Lazy 列表提供稳定 `key` 和合理的 `contentType`；不要在 Composable 中直接做网络、数据库或大计算；频繁读取的状态尽量放在真正需要它的子级。`derivedStateOf` 可以帮助减少无关派生更新，但它不是给每个简单表达式加缓存的理由。先保证结构和状态流正确，再根据基准与工具结果优化。

# 10. 把知识串起来

## 10.1 常用 API 对照

写页面时可依次检查：怎样分层、父级和滚动边界在哪里、Modifier 顺序是否符合预期、文字和图片是否进入资源系统、哪些值会变化、状态应该放在哪里。

| 需求 | 常用 API |
| --- | --- |
| 纵向、横向、叠放布局 | `Column`、`Row`、`Box` |
| 主轴排列与交叉轴对齐 | `Arrangement`、`Alignment` |
| 尺寸、背景、裁剪 | `Modifier.size`、`background`、`clip` |
| 内容间隔 | `padding`、`spacedBy`、`contentPadding` |
| 普通滚动 | `verticalScroll`、`horizontalScroll` |
| 大量列表与网格 | `LazyRow`、`LazyColumn`、Lazy Grid |
| 资源与图片 | `stringResource`、`painterResource`、`R` |
| 图片缩放 | `ContentScale.Fit`、`FillBounds`、`Crop` |
| 可观察状态与列表 | `mutableStateOf`、`rememberSaveable`、`mutableStateListOf` |
| 主题与常用控件 | `MaterialTheme`、`Button`、`Card`、`TextField` |
| 生命周期副作用 | `LaunchedEffect`、`DisposableEffect`、`SideEffect` |
| 页面骨架 | `Scaffold`、`innerPadding` |
| 自适应布局 | `WindowSizeClass`、宽度分类 |
| 无障碍与测试 | `semantics`、`testTag`、`onNodeWithText` |

## 10.2 常见易错点

| 现象 | 更可能的原因 | 调整方向 |
| --- | --- | --- |
| 改了列表但界面不动 | 使用了普通 `mutableListOf` | 改用可观察列表或替换整个 State |
| 旋转后输入丢失 | 只使用了 `remember` | 评估 `rememberSaveable` 或 ViewModel |
| 首尾卡片被裁切 | 给 Lazy 容器加了视口 padding | 使用 `contentPadding` |
| 图片变形或留白 | `ContentScale` 与场景不匹配 | 按 Fit、FillBounds、Crop 的语义选择 |
| 背景范围不对 | Modifier 链顺序不同 | 逐项检查 padding、background、size、clip |
| 页面被底部栏遮挡 | 忽略 Scaffold 的 `innerPadding` | 把只读内边距传给内容根节点 |
| 图片无法被读屏识别 | 描述缺失或不准确 | 信息图片写描述，装饰图片设 `null` |
| 重组后接口被重复请求 | 在 Composable 中直接执行副作用 | 放进 `LaunchedEffect` 或 ViewModel |
| 监听器在页面退出后仍存活 | 注册后没有注销 | 使用 `DisposableEffect` 的 `onDispose` |
| 系统栏区域出现双重留白 | Insets 被重复消费 | 先检查 Scaffold 是否已经提供内边距 |

## 10.3 复习清单与继续学习

能不看资料回答以下问题，这份 Compose 基础就算真正串起来了：

- `Column` 和 `Row` 的主轴、交叉轴与排列参数分别是什么？
- 为什么 Modifier 顺序会影响 padding、background 和 clip？
- `R.drawable.name` 与 `R.string.name` 分别从哪里生成？
- `ContentScale.Crop` 与 `Fit` 的视觉差异是什么？
- 为什么 Lazy 列表应使用 `contentPadding`？
- `mutableStateOf`、`remember`、`rememberSaveable` 分别解决什么问题？
- 状态提升后，无状态组件接收的数据与事件是什么？
- `LaunchedEffect`、`rememberCoroutineScope` 和 `DisposableEffect` 的职责有什么不同？
- 为什么 `Scaffold` 的 `innerPadding` 必须被内容区消费？
- 为什么自适应界面应判断窗口尺寸，而不是只判断设备类型？
- Semantics 为什么同时服务于无障碍和 Compose 测试？

这次学习覆盖的是 Compose 入门骨架，还没有展开 Navigation、ViewModel 完整分层、网络请求、数据库、动画和性能分析。下一步可把多个页面组合成导航结构，把业务状态移到 ViewModel，并在真实项目中练习状态流和不同窗口尺寸下的布局切换。

官方资料：

- [Thinking in Compose](https://developer.android.com/develop/ui/compose/mental-model)、[Lifecycle of composables](https://developer.android.com/develop/ui/compose/lifecycle)、[Side-effects](https://developer.android.com/develop/ui/compose/side-effects)
- [State](https://developer.android.com/develop/ui/compose/state)、[Where to hoist state](https://developer.android.com/develop/ui/compose/state-hoisting)
- [Material 3](https://developer.android.com/develop/ui/compose/designsystems/material3)、[Lazy lists and lazy grids](https://developer.android.com/develop/ui/compose/lists)
- [Accessibility semantics](https://developer.android.com/develop/ui/compose/accessibility/semantics)、[Testing Compose layouts](https://developer.android.com/develop/ui/compose/testing)
- [Use window size classes](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes)

Jetpack Compose 最核心的转变不是换一套控件名称，而是把界面看成“状态到描述”的函数：布局负责位置，Modifier 负责边界和表现，资源提供外部内容，状态驱动刷新，副作用只负责与外部世界同步。把这些边界分开，再看完整页面就会清楚很多。
