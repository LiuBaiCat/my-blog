---
title: Android 基础与工程化
date: 2026-11-04
updatetime: 2026-11-04
tags: [Android, Android Studio, Gradle, 工程化, 学习笔记]
description: 从 Android Studio、Gradle 和项目目录，到 Manifest、Activity 启动链路、生命周期、资源、权限、测试与发布，整理 Android 开发必须掌握的基础工程知识。
pinned: false
---

> Android 学习系列 2/4。上一篇：[Kotlin 基础与进阶](/article/Kotlin基础与进阶) · 下一篇：[Android Compose 总结](/article/Android-Compose学习总结)

学习 Android 很容易一上来就写界面，却在遇到 Gradle 同步失败、Activity 重建、资源找不到或安装包签名错误时停住。这一篇把项目从创建到发布的主干串起来：先知道文件在哪里，再知道应用如何启动，最后理解构建、调试和上线的基本规则。Compose、Navigation、网络与数据库分别在后续文章中展开。

# 1. 学习 Android 先建立工程视角

## 1.1 一个 Android 应用由什么组成

一个应用不只是若干 Kotlin 文件。它至少包含：

| 组成 | 作用 |
| --- | --- |
| 源码 | Kotlin/Java 类、Composable、业务逻辑 |
| 资源 | 字符串、颜色、尺寸、图片、布局、主题 |
| Manifest | 向系统声明组件、权限和应用级配置 |
| Gradle 构建 | 管理依赖、编译、打包、签名和变体 |
| 运行时环境 | Android 系统、ART、系统服务与设备硬件 |
| 测试 | JVM 单元测试、设备测试与 UI 测试 |

理解这些边界后，排查问题可以先判断它属于哪一层：代码异常、资源解析、Manifest 注册、依赖冲突、构建配置还是设备环境。

## 1.2 推荐学习顺序

本系列建议按“语言 → 工程 → 界面 → 数据与架构”的顺序阅读：

1. Kotlin 的类、集合、lambda、空安全与协程。
2. Android Studio、Gradle、目录、Manifest 和 Activity。
3. Compose 的布局、状态、副作用与列表。
4. Navigation、ViewModel、Flow、网络、持久化与分层。

这并不是说必须学完 Kotlin 才能写界面，而是遇到问题时应该能向下追问：Compose 的 `onClick` 为什么是 lambda？页面重建后状态为什么消失？网络结果如何从 Repository 到 UI？这些问题最终都会落回语言和工程基础。

# 2. Android Studio 与运行环境

## 2.1 Android Studio 的职责

Android Studio 是基于 IntelliJ IDEA 的官方 IDE，主要提供：

- 项目模板与 Gradle 同步；
- Kotlin/Java 代码编辑、补全和重构；
- Compose Preview、布局检查器与 UI 调试；
- 模拟器、真机日志和设备管理；
- 断点调试、CPU/内存分析和构建产物查看。

IDE 只是工具，不理解 Gradle 和运行链路时，按钮报错很难定位。遇到同步失败先看 Build 输出中的第一个真实错误，而不是只看最后一行的 `Build failed`。

## 2.2 SDK、JDK 与 Gradle 不是同一个东西

| 名称 | 主要用途 |
| --- | --- |
| JDK | 编译 Kotlin/Java，运行 Gradle 与部分构建工具 |
| Android SDK | 提供平台 API、构建工具、模拟器镜像和调试桥 |
| Gradle | 组织任务、依赖和构建流程 |
| Android Gradle Plugin | 让 Gradle 能构建 Android 应用 |
| Kotlin Gradle Plugin | 编译 Kotlin 源码 |

模板会为项目指定一组兼容版本。不要只升级某一个插件而忽略 JDK、Gradle 和 AGP 的兼容关系；优先使用 Android Studio 的升级提示与官方兼容表。

## 2.3 模拟器与真机

模拟器适合快速切换屏幕尺寸、系统版本和网络状态；真机更适合验证相机、传感器、性能、厂商系统和真实触摸体验。二者不能互相完全替代。

创建模拟器时关注：

- 系统镜像版本是否覆盖 `minSdk` 以上的关键区间；
- 内存和存储是否足够；
- 是否开启硬件加速；
- 横竖屏、字体缩放和深色模式是否测试。

真机调试通常需要开启开发者选项和 USB 调试。无线调试可在设备与电脑处于可信网络时使用；不要把调试端口和授权设备随意暴露到公共网络。

## 2.4 常用调试入口

Logcat 用于看运行日志，但不要只打印没有上下文的字符串。至少包含事件、关键标识和状态：

```kotlin
Log.d("TaskList", "load tasks: count=${tasks.size}, fromCache=$fromCache")
```

日志中不要输出密码、令牌、完整个人信息或生产环境敏感数据。调试断点、Layout Inspector、Compose Preview 和设备旋转测试，应该配合使用，而不是只依赖重新运行。

# 3. Gradle 与项目配置

## 3.1 Gradle Wrapper 保证构建一致性

项目根目录通常有 `gradlew`、`gradlew.bat` 和 `gradle/wrapper/`。应优先使用 Wrapper 命令，而不是直接使用电脑上任意版本的 Gradle：

`./gradlew assembleDebug`（macOS/Linux）或 `gradlew.bat assembleDebug`（Windows）

Wrapper 把项目需要的 Gradle 版本固定下来，团队成员和 CI 才能得到接近一致的结果。

## 3.2 settings、根构建脚本与模块脚本

现代 Android 项目常见结构如下：

| 文件 | 主要职责 |
| --- | --- |
| `settings.gradle.kts` | 声明仓库、插件管理和包含的模块 |
| 根 `build.gradle.kts` | 配置所有模块共享的插件或构建约定 |
| `app/build.gradle.kts` | 应用模块的 Android 与依赖配置 |
| `gradle/libs.versions.toml` | 集中声明依赖和插件版本 |
| `gradle.properties` | Gradle/JVM 全局构建参数 |

依赖版本应集中管理。直接在多个模块写不同版本的同一库，容易出现运行时类冲突。

## 3.3 应用模块的最小配置

下面是使用版本目录的局部示例，具体插件与 SDK 版本以项目模板为准：

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.todo"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.todo"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
    }
}
```

几个字段要分清：

| 字段 | 含义 |
| --- | --- |
| `namespace` | 生成 `R` 类和代码命名空间 |
| `applicationId` | 安装到设备上的唯一应用标识 |
| `minSdk` | 允许安装的最低系统版本 |
| `compileSdk` | 编译时使用的 Android API 级别 |
| `targetSdk` | 应用声明已适配的目标行为级别 |
| `versionCode` | 商店和系统判断升级的整数版本 |
| `versionName` | 面向用户的版本名称 |

`namespace` 可以与 `applicationId` 不同。改名时不要只改目录或类包名，必须同时核对 Manifest、Gradle、签名和商店配置。

## 3.4 依赖配置

```kotlin
dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.material3)
    testImplementation(libs.junit)
}
```

`implementation`、`api`、`compileOnly` 和 `runtimeOnly` 代表不同的依赖暴露方式。应用模块大多数时候使用 `implementation`；不要为了让某个类“恰好能编译”而随意改成 `api`。

## 3.5 Debug、Release 与构建变体

Android 默认可有 debug 和 release 构建类型：

| 类型 | 常见用途 | 特点 |
| --- | --- | --- |
| debug | 日常开发 | 可调试，通常使用开发服务器和日志 |
| release | 发布 | 需要签名、压缩与上线检查 |

构建命令的产物通常在 `app/build/outputs/` 下。不要手动修改生成目录；它会被下一次构建覆盖。

发布包要检查：

- release 使用的 API 地址不是本地或测试环境；
- 日志级别不会泄露敏感信息；
- 签名密钥与密码没有写进仓库；
- `versionCode` 确实递增；
- 混淆/压缩规则没有破坏序列化、反射或 WebView 接口；
- 在接近发布配置的设备上完成一次干净安装和升级测试。

# 4. 项目目录与资源边界

## 4.1 `app/src/main`

最常见的目录：

| 路径 | 内容 |
| --- | --- |
| `java/` 或 `kotlin/` | Kotlin/Java 源码 |
| `res/` | 字符串、颜色、图片、主题等资源 |
| `AndroidManifest.xml` | 应用与组件声明 |
| `assets/` | 原样打包的任意文件 |
| `app/src/test/` | 不依赖设备的 JVM 测试 |
| `app/src/androidTest/` | 依赖 Android 设备/模拟器的测试 |

`res` 下的资源经过资源系统编译，能享受限定符、类型检查和自动生成的 `R` 类；`assets` 更接近原样文件，需要自己读取。普通界面文本和图标通常放 `res`，大型原始数据或第三方静态文件才考虑 `assets`。

## 4.2 资源限定符

同一逻辑资源可以有不同设备版本：

- `values/strings.xml`：默认字符串；
- `values-en/strings.xml`：英文；
- `drawable-nodpi/`：不按密度缩放的特殊图片；
- `mipmap-*dpi/`：启动图标等按密度选择的资源；
- `values-night/`：深色模式颜色或主题；
- `values-sw600dp/`：较大窗口的尺寸资源。

Android 会根据设备配置选择最合适的资源。找不到匹配时回退到默认资源，因此默认目录不能漏掉必要资源。

## 4.3 字符串、颜色与尺寸

面向用户的文本应放在字符串资源中，而不是散落在 Kotlin 代码里。这样可翻译、可复用，也方便无障碍和测试。

在 Compose 中使用字符串资源时，通常会通过资源 API 获取；具体写法在 Compose 篇展开。需要记住的边界是：业务文案可以资源化，但日志和内部错误码不一定要作为界面资源。

## 4.4 `R` 类为什么有时找不到

`R` 类由构建系统根据资源和命名空间生成。常见原因包括：

- 资源 XML 有语法错误；
- 文件名含非法字符或大小写冲突；
- Gradle 没有同步成功；
- 包名或 `namespace` 配错；
- 引用了被删除或未放入正确资源目录的文件。

先修复 Build 输出中的资源错误，再执行清理和重新同步。反复点 Run 通常不会修复资源编译失败。

# 5. Manifest 与启动链路

## 5.1 Manifest 是应用向系统的声明

`AndroidManifest.xml` 描述应用包信息、组件、权限、硬件/软件特性和部分系统行为。典型声明包括：

- 应用级 `application` 配置；
- 启动 Activity；
- 其他 Activity、Service、BroadcastReceiver 和 Provider；
- 运行时权限与普通权限；
- 是否允许备份、是否支持某个屏幕方向等。

现代 Android 推荐在 Manifest 中尽量减少静态配置，把可运行时确定的属性留给代码或构建配置。但组件可见性、Intent Filter 和权限仍然必须准确声明。

## 5.2 从桌面图标到首帧

启动一个带桌面图标的 Activity，可以粗略理解为：

1. 用户点击 Launcher 图标。
2. 系统根据 `MAIN` + `LAUNCHER` Intent Filter 找到目标组件。
3. 如果应用进程不存在，系统创建进程并初始化 `Application`。
4. 系统创建启动 Activity，依次调用生命周期回调。
5. `onCreate` 设置内容，Compose 开始首次组合。
6. 首帧绘制完成，用户看到界面。

Compose 项目的入口通常仍是 Activity：

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TodoTheme {
                TodoApp()
            }
        }
    }
}
```

`TodoTheme` 和 `TodoApp` 是项目内的示例名。`setContent` 把 Compose 树接入 Activity；真正的应用内容不必全部写在 `MainActivity` 中。`enableEdgeToEdge()` 让界面延伸到系统栏区域，之后要用 Insets 正确处理内容避让。

## 5.3 Application 与单例的边界

自定义 `Application` 可以做进程级初始化，例如日志、崩溃上报或依赖容器。它不适合保存页面状态，也不应该启动大量阻塞初始化拖慢首帧。页面相关状态交给 ViewModel 或更小作用域，避免 Activity 销毁后仍被全局单例引用。

## 5.4 显式 Intent 与隐式 Intent

显式 Intent 指定目标组件，适合应用内部导航或启动明确页面；隐式 Intent 描述动作，让系统寻找能处理的组件。跨应用调用前要检查是否有可用处理器，并注意外部输入不可信，不能在未校验时把敏感参数或文件权限交给任意应用。

# 6. Activity 与生命周期基础

## 6.1 为什么会有生命周期

移动系统会在内存不足、配置变化、用户切到后台或多窗口切换时调整页面状态。Activity 不是永久存活的单例，系统可以销毁并重建它。生命周期方法提供资源创建、可见性变化和释放的时机。

常见回调可以按状态理解：

| 回调 | 大致含义 | 常见动作 |
| --- | --- | --- |
| `onCreate` | 页面正在创建 | 初始化 UI、绑定 ViewModel、恢复必要状态 |
| `onStart` | 页面开始可见 | 注册只与可见性有关的监听 |
| `onResume` | 页面获得焦点，可交互 | 恢复相机/传感器等前台资源 |
| `onPause` | 页面失去焦点 | 停止持续交互，但不要做长时间工作 |
| `onStop` | 页面不再可见 | 释放不必要的 UI/媒体资源 |
| `onDestroy` | Activity 即将销毁 | 取消注册、释放仍属于该 Activity 的资源 |

不要把所有清理都堆到 `onDestroy`。例如相机预览应在失去焦点时及时停止，位置更新应根据产品需求选择合适的可见性阶段。

## 6.2 配置变化与状态恢复

旋转屏幕、切换深色模式或改变字体大小可能触发配置变化。默认情况下 Activity 可能被重建，普通成员变量会重新初始化。可以用以下位置保存不同类型的状态：

| 位置 | 适合保存 | 生命周期 |
| --- | --- | --- |
| Composable `remember` | 仅当前组合需要、重建可丢弃的 UI 状态 | 离开组合即丢失 |
| `rememberSaveable` | 简单可序列化、需要进程/重建恢复的 UI 状态 | 受保存状态机制管理 |
| `ViewModel` | 页面业务状态与跨配置变化的数据 | 页面级作用域 |
| DataStore / Room | 需要长期持久化的数据 | 应用或数据层 |

不要用 `android:configChanges` 掩盖所有重建问题。它只适合确实由应用自己处理、且经过验证的少数场景；大多数界面应能正确处理重建。

## 6.3 返回栈与任务

Activity 是系统组件，返回栈决定用户按返回键时回到哪里。Compose 应用在单 Activity 内通常会使用 Navigation 管理页面栈，但系统返回、任务切换和深链仍会影响页面行为。进阶篇会讲 Navigation，这里先区分：Activity 是系统任务的一部分，Compose 页面是应用内部的导航目的地。

## 6.4 进程死亡不是普通的 Activity 销毁

系统可以在后台杀死整个进程。重新打开时，应用会重新创建进程和 Activity，但未持久化的普通变量已经不存在。保存状态应只放轻量恢复信息；大对象、数据库查询和网络结果应从数据层重新获取，而不是硬塞进 Bundle。

# 7. 权限、隐私与系统边界

## 7.1 普通权限与运行时权限

Manifest 声明权限只是第一步。危险权限通常还需要在运行时请求，并根据用户结果调整界面：

```kotlin
val requestPermission = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.RequestPermission()
) { granted ->
    if (!granted) {
        showPermissionExplanation = true
    }
}
```

这段 Compose 代码只展示基本状态流；完整权限流程还应在使用前解释目的，并处理用户拒绝、永久拒绝和设置页跳转。权限名称和请求方式会随系统版本演进，必须以当前 Android 官方文档和目标 SDK 行为为准。

## 7.2 最小权限原则

- 只申请当前功能真正需要的权限；
- 在用户触发相关功能时再请求，而不是启动就弹；
- 能使用系统照片选择器、文件选择器或近似能力时，不请求更宽泛权限；
- 用户拒绝后仍让无关功能可用；
- 日志、缓存和崩溃报告中移除敏感信息；
- 处理外部 Intent、URL、文件和 Deep Link 时做输入校验。

权限不是“授予后就可以随便用”。应用还应遵守数据最小化、透明告知和系统隐私指示器等要求。

## 7.3 文件、存储与网络边界

应用内部文件适合私有数据；共享媒体或用户选择的文件应通过系统选择器和内容 URI 访问。网络请求则要处理无网络、超时、证书失败和服务器错误。无论数据来自网络、数据库还是 Intent，都要在进入业务层前验证格式与来源。

# 8. 调试、测试与质量意识

## 8.1 先定位问题属于哪一层

| 现象 | 优先检查 |
| --- | --- |
| 编译找不到类 | 依赖、版本目录、包名、源码集 |
| 启动即崩溃 | Logcat 首个异常、Manifest 组件、初始化顺序 |
| 界面重建后状态丢失 | `remember`/`rememberSaveable`/ViewModel 的作用域 |
| 设备旋转后重复请求 | 是否把请求写进了 Composable 或生命周期错误位置 |
| release 才出错 | 签名、混淆、环境地址、不可调试行为 |
| 偶现内存上涨 | 生命周期监听、线程、缓存和持有引用 |

## 8.2 单元测试与设备测试

JVM 单元测试适合验证纯 Kotlin 逻辑、状态转换和格式化函数；设备测试适合验证 Activity、Compose UI、系统 API 和真实交互。

```kotlin
class TaskFilterTest {
    @Test
    fun unfinishedTasks_excludesDoneItems() {
        val tasks = listOf(
            Task(id = 1, title = "写笔记", done = false),
            Task(id = 2, title = "复习", done = true)
        )

        val result = tasks.filterNot { it.done }

        assertEquals(listOf("写笔记"), result.map { it.title })
    }
}
```

测试名称要描述行为和条件。先测稳定业务规则，再用少量 UI 测试覆盖关键流程；不要为了追求数量给所有实现细节写脆弱测试。

## 8.3 内存泄漏的基本判断

内存泄漏是对象已经不需要，却仍被更长生命周期的对象引用。Android 常见来源：

| 风险写法 | 问题 | 改进 |
| --- | --- | --- |
| 单例保存 Activity/View | 页面销毁后仍被全局引用 | 保存 Application Context 或使用短生命周期作用域 |
| 未注销监听器 | 系统或第三方对象继续引用页面 | 在对应生命周期注销 |
| 长任务捕获 UI 回调 | 后台任务持有旧页面 | 使用 ViewModel/Repository 与可取消作用域 |
| 无界静态缓存 | 对象永不释放 | 使用有上限的缓存并定义淘汰策略 |
| 非静态内部类长期持有外部类 | 隐式引用 Activity | 改为静态/顶层类或缩短生命周期 |

LeakCanary 和 Android Studio Profiler 可以帮助定位，但工具只能指出引用链；最终仍要设计正确的生命周期和所有权。

## 8.4 发布前的自动化检查

至少保留一条可重复的构建路径，例如在 CI 中运行：

- `gradlew testDebugUnitTest`
- `gradlew lintDebug`
- `gradlew assembleRelease`

命令、任务名和变体应随项目配置调整。测试失败时不要通过关闭 lint 或删除断言来“修复”；先判断是代码问题、配置问题还是环境问题。

# 9. 打包、签名与发布基础

## 9.1 签名是什么

Android 用签名证明安装包来源，并保证后续升级由同一开发者发布。debug 构建有自动调试签名，release 构建必须使用受保护的发布签名。签名密钥和密码不能提交到 Git，也不应通过聊天或公开日志传播。

常见做法是把密钥放在受控的本地/CI 密钥管理系统，通过环境变量或加密配置注入构建流程。发布前要确认 CI 的权限最小化，并保留密钥备份与轮换方案。

## 9.2 发布包不是只看“能安装”

上线前至少验证：

1. release 包能干净安装，也能从上一版升级。
2. 首次启动、登录、核心业务、返回和后台恢复都正常。
3. 权限被拒绝时应用不会崩溃或陷入死循环。
4. 无网络、弱网和服务器错误有可理解的反馈。
5. 横竖屏、深色模式、大字体和小屏幕没有关键内容被遮挡。
6. 隐私政策、数据收集和权限说明与真实行为一致。
7. 崩溃和性能监控不会采集不该采集的数据。

Google Play 的 AAB、签名、目标 API 和商店政策会持续更新，发布步骤应以 [官方发布文档](https://developer.android.com/studio/publish) 和商店控制台当前要求为准。

## 9.3 版本与迁移

`versionCode` 必须递增，`versionName` 只是展示名。数据库结构变化、缓存格式变化或远程协议变化都需要迁移策略；不能假设用户会从上一版本直接升级到最新版本。发布后保留崩溃监控、回滚和紧急修复路径，比单纯把包上传更重要。

# 10. Android 基础复习清单

| 主题 | 应该能独立完成 |
| --- | --- |
| 环境 | 解释 JDK、Android SDK、Gradle、AGP 和 Wrapper 的区别 |
| 目录 | 知道源码、资源、Manifest、测试和构建产物分别在哪里 |
| Gradle | 读懂模块脚本中的 namespace、SDK、依赖和版本目录 |
| 启动 | 能从 Launcher Intent 追到 `Application`、Activity 和首帧 |
| 生命周期 | 能说明旋转屏幕、切后台和进程死亡时哪些状态会丢失 |
| 资源 | 会使用字符串资源、限定符和不同密度的图片 |
| 权限 | 能区分 Manifest 声明、运行时请求和功能降级 |
| 调试 | 能从 Logcat、Build 输出和 Profiler 定位常见问题 |
| 测试 | 能为纯逻辑写 JVM 测试，并知道何时需要设备测试 |
| 发布 | 知道签名、versionCode、release 检查与商店政策的基本边界 |

官方入口建议从 [Android 开发者文档](https://developer.android.com/docs)、[Android Studio](https://developer.android.com/studio)、[Gradle 与构建](https://developer.android.com/build)、[Manifest 指南](https://developer.android.com/guide/topics/manifest/manifest-intro)、[Activity 生命周期](https://developer.android.com/guide/components/activities/activity-lifecycle)、[权限](https://developer.android.com/training/permissions/requesting) 和 [测试](https://developer.android.com/training/testing) 开始。

下一篇进入 Jetpack Compose：不再先找控件对象，而是用 Composable、Modifier 和状态描述界面。基础篇里的资源、Activity 和生命周期仍然适用，只是界面更新方式发生了变化。

> 系列导航：[1/4 Kotlin 基础与进阶](/article/Kotlin基础与进阶) · **2/4 Android 基础与工程化** · [3/4 Android Compose 总结](/article/Android-Compose学习总结) · [4/4 Android 进阶篇](/article/Android进阶篇)
