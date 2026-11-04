---
title: Android 进阶篇
date: 2026-11-04
updatetime: 2026-11-04
tags: [Android, Jetpack Compose, Navigation, MVVM, Retrofit, Room, 学习笔记]
description: 用 Todo 与登录流程串联 Navigation Compose、ViewModel、MVVM、StateFlow、Retrofit/OkHttp、DataStore、Room 和 Repository，建立从 UI 到数据层的 Android 进阶主线。
pinned: false
---

> Android 学习系列 4/4。上一篇：[Android Compose 总结](/article/Android-Compose学习总结) · 返回系列：[Kotlin 基础与进阶](/article/Kotlin基础与进阶)

前三篇分别解决了 Kotlin、Android 工程和 Compose UI。到了真实项目，难点不再是“按钮怎么写”，而是页面如何组织、状态放在哪里、网络失败如何反馈、数据怎样持久化，以及这些部分如何保持可测试。这一篇用 Todo 和登录流程串起一条最小但完整的进阶主线。示例关注职责与数据流，不展开 Hilt、模块化、复杂缓存策略或完整生产级架构。

# 1. 先建立分层与数据流

## 1.1 一条请求应该经过哪里

一个典型页面可以粗略分成：

| 层 | 主要职责 | 不应该负责 |
| --- | --- | --- |
| UI | 展示状态、接收用户事件 | 直接拼 SQL、读令牌、处理网络细节 |
| ViewModel | 组合用例、持有页面状态、处理事件 | 持有 Activity/View、直接绘制界面 |
| Repository | 统一数据来源与领域数据访问 | 知道某个按钮是否显示 |
| 数据源 | 网络、数据库、DataStore、缓存 | 决定页面导航和文案排版 |

数据向下请求，结果向上转换为状态。UI 不直接操作 Retrofit 和 Room；ViewModel 不直接持有 Composable 或 Activity。这样的边界让每一层都能独立测试，也避免页面重建时把业务逻辑一起重建。

## 1.2 单向数据流

页面可以遵守一个简单循环：

1. ViewModel 暴露只读的 UI State。
2. Composable 收集 State 并渲染。
3. 用户点击按钮，调用 ViewModel 的事件方法。
4. ViewModel 启动协程，调用 Repository。
5. Repository 返回数据或错误。
6. ViewModel 产生新 State，Compose 重组。

事件只向上传，状态只向下流。Composable 不直接修改 Repository，也不在内部偷偷启动网络请求。这个约束会让状态来源更清晰。

## 1.3 页面状态与业务数据分开

业务实体描述“任务是什么”，UI State 描述“这个页面此刻怎样展示”：

```kotlin
data class Task(
    val id: Long,
    val title: String,
    val done: Boolean
)

data class TodoUiState(
    val tasks: List<Task> = emptyList(),
    val loading: Boolean = false,
    val errorMessage: String? = null,
    val input: String = ""
)
```

如果页面有互斥的加载、成功和失败状态，也可以使用密封接口。选择数据类还是密封类型，要看状态是否真的互斥；不要同时放 `isLoading`、`isSuccess` 和 `isError` 却不约束它们的关系。

# 2. Navigation Compose：把多个页面组织起来

## 2.1 NavController、NavHost 与目的地

Navigation Compose 用 `NavHost` 承载一组目的地，用 `NavController` 发起导航和维护返回栈：

```kotlin
val navController = rememberNavController()

NavHost(
    navController = navController,
    startDestination = HomeRoute
) {
    composable<HomeRoute> {
        HomeScreen(
            onTaskClick = { id ->
                navController.navigate(TaskDetailRoute(id))
            }
        )
    }

    composable<TaskDetailRoute> { entry ->
        val route = entry.toRoute<TaskDetailRoute>()
        TaskDetailScreen(taskId = route.id)
    }
}
```

目的地不是一个字符串 URL 就是全部。`NavHost` 负责页面切换，返回栈负责“返回时回到哪里”。不要把 NavController 随意传进每个业务组件；页面最好只暴露类似 `onTaskClick` 的回调，由应用级导航代码决定具体路由。

## 2.2 类型安全路由

新版 Navigation Compose 支持基于 Kotlin Serialization 的类型安全路由。路由可以声明为可序列化对象或数据类：

```kotlin
@Serializable
data object HomeRoute

@Serializable
data class TaskDetailRoute(val taskId: Long)

@Serializable
data class LoginRoute(val returnTo: String? = null)
```

然后使用 `composable<HomeRoute>`、`navigate(TaskDetailRoute(42))` 和 `toRoute<TaskDetailRoute>()`。相比手写字符串模板，参数类型和必填项更明确，路由重构也更容易发现调用点。项目需要启用 Kotlin Serialization 插件并添加对应依赖，具体版本按当前官方文档配置。

## 2.3 参数与返回结果

路由参数适合放稳定、可重建页面所需的标识，例如 `taskId`、筛选条件或登录后的目标路径。不要把整个大对象、图片二进制或临时 UI 状态塞进路由。详情页需要完整数据时，用 id 到 ViewModel/Repository 获取。

返回结果可以由前一个页面自己处理：详情页修改完成后返回，首页重新观察 Repository 的 Flow；也可以在导航结果回调中传递一个轻量结果。不要假设详情页和首页永远同时存在，页面应按自己的状态来源恢复。

## 2.4 深链与返回栈

深链从通知、网页或其他应用进入某个页面时，系统可能创建新的任务或返回栈。设计导航时要考虑：

- 直接打开详情页时，按返回应该回到哪里；
- 用户未登录时，登录完成后是否返回原目标；
- 重复点击导航是否会产生多个相同页面；
- 进程恢复后，参数是否仍然存在。

页面栈不是业务状态的替代品。哪些页面能打开由导航决定，页面数据由 ViewModel 和数据层决定。

# 3. ViewModel 与 MVVM：页面状态的持有者

## 3.1 ViewModel 解决什么问题

`ViewModel` 的生命周期长于单次 Activity 配置变化，适合保存页面业务状态和协调协程。它不应该持有 Activity、View 或 Composable 引用，也不应直接依赖 Android UI 类型。

```kotlin
class TodoViewModel(
    private val repository: TaskRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(TodoUiState())
    val uiState: StateFlow<TodoUiState> = _uiState.asStateFlow()

    fun onInputChange(value: String) {
        _uiState.update { it.copy(input = value) }
    }

    fun addTask() {
        val title = _uiState.value.input.trim()
        if (title.isEmpty()) return

        viewModelScope.launch {
            _uiState.update { it.copy(loading = true, errorMessage = null) }
            runCatching { repository.addTask(title) }
                .onSuccess {
                    _uiState.update { it.copy(input = "", loading = false) }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(loading = false, errorMessage = "保存失败：${error.message}")
                    }
                }
        }
    }
}
```

这是一个局部示例，`TaskRepository` 稍后定义。真实项目还要处理错误文案、重复点击、取消和日志脱敏。`runCatching` 会把协程取消也包装成失败，因此涉及取消时不能无条件吞掉 `CancellationException`；应明确区分可恢复错误和取消。

## 3.2 MVVM 不是三个文件夹

MVVM 的核心是职责分离，不是必须创建 `model/`、`view/`、`viewmodel/` 三个目录。Composable 是 View，ViewModel 持有可观察状态，Model/Repository 提供业务数据。导航通常由应用层协调，不应塞进每个 ViewModel。

页面需要的数据由 ViewModel 暴露，用户动作通过方法进入 ViewModel。ViewModel 可以组合多个 Repository 或 UseCase，但不应该知道某个 Composable 使用 `Card` 还是 `ListItem`。

## 3.3 一次性事件怎样处理

导航、弹出 Snackbar、关闭页面等事件只应执行一次。常见方案包括：

- ViewModel 暴露事件 Flow，UI 用生命周期感知方式收集；
- 把事件编码进 UI State，并在消费后明确清除；
- 通过 UI 层回调处理纯界面事件，不把 ViewModel 变成命令总线。

不要用普通 `StateFlow` 保存一次性事件却不消费，否则配置变化后可能再次触发。也不要为了“纯 MVVM”把所有导航都强塞给 ViewModel；导航依赖 UI 环境时，让页面暴露回调通常更清楚。

## 3.4 ViewModel 的创建与依赖

简单页面可以用 `viewModel()` 创建无参 ViewModel；需要 Repository 时，应通过 Factory、依赖注入或组合根提供依赖。不要在 ViewModel 内部直接 `new` 一个全局单例数据库，否则测试无法替换数据源。

```kotlin
val viewModel: TodoViewModel = viewModel(
    factory = TodoViewModelFactory(application.container.taskRepository)
)
```

这里的 `application.container` 是组合根示例，不是推荐的完整 DI 方案。依赖注入框架属于后续专题；现阶段先把构造依赖和可测试性做对。

# 4. StateFlow、SharedFlow 与生命周期感知收集

## 4.1 StateFlow 表示当前状态

`StateFlow` 始终有当前值，新收集者会立即得到最新状态，适合 UI State：

```kotlin
private val _query = MutableStateFlow("")
val query: StateFlow<String> = _query.asStateFlow()
```

只暴露只读 `StateFlow`，让外部通过 ViewModel 方法更新，避免 UI 直接改内部可变状态。StateFlow 会合并快速连续的值，只保证最后状态，不保证每次中间值都被观察；这对“当前界面应该是什么样”是合理的。

## 4.2 SharedFlow 表示广播事件

`SharedFlow` 更适合多个观察者接收的事件流，或者不需要初始值的数据流。常用配置是 `replay = 0`、`extraBufferCapacity > 0`：

```kotlin
private val _events = MutableSharedFlow<TodoEvent>(
    extraBufferCapacity = 1
)
val events: SharedFlow<TodoEvent> = _events.asSharedFlow()
```

事件流同样有生命周期和丢失风险。页面还没开始收集时发出的事件是否应该保留，必须由业务决定；需要可靠任务队列时，不要用“内存中的一次性弹窗事件”冒充持久化任务。

## 4.3 在 Compose 中收集状态

Android Compose 推荐使用生命周期感知收集，而不是无条件 `collectAsState()`：

```kotlin
@Composable
fun TodoRoute(viewModel: TodoViewModel) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    TodoScreen(
        state = state,
        onInputChange = viewModel::onInputChange,
        onAddTask = viewModel::addTask
    )
}
```

`collectAsStateWithLifecycle()` 会在页面不需要可见收集时停止上游收集，避免后台页面持续做无意义工作。具体导入来自 lifecycle-runtime-compose，依赖应与 Compose 与 Lifecycle 版本匹配。

## 4.4 Flow 操作符的边界

`map`、`filter`、`combine`、`debounce` 等操作符适合在数据层或 ViewModel 组合数据，但不要把大计算塞进每次发射都执行的 lambda。需要缓存派生结果时，先确认状态变化频率和线程要求，再用 `stateIn`、`map` 或 `derivedStateOf` 的对应层级工具。

Flow 不是网络请求本身。Retrofit 的 `suspend` 函数返回一次结果，Room 可以返回持续更新的 Flow；Repository 的职责是把这些来源统一成对 UI 有意义的领域数据流。

# 5. Retrofit 与 OkHttp：网络访问

## 5.1 DTO、接口与序列化

网络返回通常先映射为 DTO，不直接把服务器 JSON 结构当成整个应用模型：

```kotlin
@Serializable
data class TaskDto(
    val id: Long,
    val title: String,
    val done: Boolean = false
)

interface TodoApi {
    @GET("tasks")
    suspend fun getTasks(): List<TaskDto>

    @POST("tasks")
    suspend fun createTask(@Body request: CreateTaskRequest): TaskDto
}
```

DTO 字段要处理服务器可能缺失、改名或新增的情况。使用 kotlinx.serialization 时，可以用默认值、`@SerialName` 和明确的 `ignoreUnknownKeys` 策略；不要让 UI 直接依赖 DTO，否则服务端字段变化会穿透整个应用。

## 5.2 OkHttpClient 与拦截器

OkHttp 负责底层 HTTP、连接、超时和拦截器，Retrofit 在其上定义接口与序列化：

```kotlin
val okHttpClient = OkHttpClient.Builder()
    .connectTimeout(15, TimeUnit.SECONDS)
    .readTimeout(20, TimeUnit.SECONDS)
    .addInterceptor { chain ->
        val request = chain.request().newBuilder()
            .addHeader("Accept", "application/json")
            .build()
        chain.proceed(request)
    }
    .build()

val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .client(okHttpClient)
    .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
    .build()
```

认证令牌应由安全的认证流程提供。日志拦截器只在 debug 构建启用，并避免打印 Authorization、Cookie、密码和个人数据。`baseUrl` 必须以 `/` 结尾，接口相对路径才会按预期拼接。

## 5.3 错误不是只有“请求失败”

网络层至少要区分：

| 情况 | 可给用户的信息 |
| --- | --- |
| 无网络/连接超时 | 检查网络，可重试 |
| HTTP 401/403 | 登录失效或权限不足 |
| HTTP 404 | 资源不存在或接口配置错误 |
| HTTP 5xx | 服务暂时不可用，稍后重试 |
| JSON 解析失败 | 通用错误，同时记录可诊断日志 |
| 用户取消 | 通常不显示错误，不再重试 |

Retrofit 的 `suspend` 接口在非成功状态可能抛异常，也可能由 `Response<T>` 返回状态码。选择一种统一约定，并在 Repository 中映射为领域错误，而不是让每个页面自己判断 Retrofit 异常文本。

## 5.4 网络请求不要直接写进 Composable

Composable 可能重组多次，函数体不是一次性初始化块。请求应放在 ViewModel 或 Repository 的受控协程中；由页面进入触发的请求可以用 ViewModel 初始化或明确的事件方法，不要在 Composable 函数体中直接调用 `api.getTasks()`。

如果确实需要在组合生命周期内同步外部状态，应使用 `LaunchedEffect`，并给它稳定 key。网络结果的状态仍应由 ViewModel 持有，而不是让一个 Composable 成为唯一数据源。

# 6. DataStore 与 JSON：保存轻量配置和结构化数据

## 6.1 DataStore 适合什么

DataStore 适合异步保存轻量配置，例如主题模式、首次启动标记、筛选条件或非敏感用户偏好。它提供基于协程和 Flow 的 API，比旧的 SharedPreferences 更适合现代异步代码。

Preferences DataStore 的声明通常放在文件顶层，并只创建一次：

```kotlin
private val Context.settingsDataStore by preferencesDataStore(
    name = "settings"
)

class SettingsRepository(
    private val context: Context
) {
    private val themeKey = booleanPreferencesKey("dark_theme")

    val darkTheme: Flow<Boolean> = context.settingsDataStore.data
        .catch { error ->
            if (error is IOException) emit(emptyPreferences()) else throw error
        }
        .map { preferences -> preferences[themeKey] ?: false }

    suspend fun setDarkTheme(enabled: Boolean) {
        context.settingsDataStore.edit { preferences ->
            preferences[themeKey] = enabled
        }
    }
}
```

DataStore 不是加密存储。令牌、密码和敏感密钥不能因为“已经用了 DataStore”就直接明文保存；应使用 Android Keystore 或经过安全评估的凭据存储方案。Context 应使用应用级 Context，避免 Repository 长期持有 Activity。

## 6.2 JSON 序列化

kotlinx.serialization 可以把 Kotlin 数据类转换为 JSON，适合保存结构化配置、导入导出或测试数据：

```kotlin
@Serializable
data class DraftTask(
    val title: String,
    val tags: List<String> = emptyList()
)

val text = Json.encodeToString(DraftTask("复习 Flow"))
val task = Json.decodeFromString<DraftTask>(text)
```

需要配置 `Json` 时，明确是否忽略未知字段、是否允许空值以及如何处理默认值。不要把服务器 DTO、数据库 Entity 和领域模型强行合并成一个类；它们的演进节奏不同，映射层可以隔离变化。

## 6.3 配置读取失败与迁移

DataStore 也可能遇到文件损坏、旧格式迁移或 I/O 异常。读取流应处理可恢复的 I/O 错误，写入应放在协程中并避免在 UI 主线程执行。保存结构升级时要考虑旧值，不能直接假设用户第一次安装。

# 7. Room：本地结构化数据

## 7.1 Entity、DAO 与 Database

Room 在 SQLite 上提供编译期检查和 Kotlin API。最小 Todo 示例包含 Entity、DAO 和 Database：

```kotlin
@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val done: Boolean = false,
    val updatedAt: Long = System.currentTimeMillis()
)

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks ORDER BY updatedAt DESC")
    fun observeAll(): Flow<List<TaskEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(task: TaskEntity)

    @Query("DELETE FROM tasks WHERE id = :id")
    suspend fun deleteById(id: Long)
}

@Database(
    entities = [TaskEntity::class],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
}
```

`Flow<List<TaskEntity>>` 会在表变化时重新发射，UI 不需要手动刷新。Entity 应贴近数据库结构，领域 `Task` 由 Repository 映射；如果数据库字段需要迁移，不能把 UI 也绑定到旧字段。

## 7.2 创建数据库

```kotlin
val database = Room.databaseBuilder(
    context.applicationContext,
    AppDatabase::class.java,
    "todo.db"
)
    .build()
```

数据库实例应作为应用级资源复用，不要每打开一个页面就创建一次。生产环境不应依赖 `fallbackToDestructiveMigration()` 清空用户数据；结构变化应提供 Migration，并测试从旧版本升级到新版本。

## 7.3 查询、事务与索引

- 查询条件用参数绑定，不要拼接用户输入；
- 多张表的一致性修改放进事务；
- 经常筛选/排序的字段评估索引，但不要给所有字段无脑加索引；
- 列表只查询需要的列或分页数据，避免一次加载过大结果；
- 数据库操作放在 Room 提供的挂起/Flow API 中，不阻塞主线程。

Room 的 SQL 错误通常能在编译期发现，但业务约束仍需自己保证。例如同一个任务重复插入是否应该覆盖、标题是否允许为空、删除是否要级联，都属于数据模型设计。

# 8. Repository：统一数据来源

## 8.1 先定义接口

```kotlin
interface TaskRepository {
    fun observeTasks(): Flow<List<Task>>
    suspend fun addTask(title: String)
    suspend fun refresh()
}
```

接口让 ViewModel 只依赖业务能力，而不是依赖 Room DAO 或 Retrofit API。测试时可以传入内存 Fake，不需要真实数据库和网络。

## 8.2 本地与网络如何协作

一个简单离线优先实现如下，示例只展示结构，不代表所有产品都应完全照搬：

```kotlin
class OfflineTaskRepository(
    private val dao: TaskDao,
    private val api: TodoApi
) : TaskRepository {
    override fun observeTasks(): Flow<List<Task>> =
        dao.observeAll().map { entities ->
            entities.map { entity ->
                Task(entity.id, entity.title, entity.done)
            }
        }

    override suspend fun addTask(title: String) {
        dao.upsert(TaskEntity(title = title))
    }

    override suspend fun refresh() {
        val remoteTasks = api.getTasks()
        remoteTasks.forEach { dto ->
            dao.upsert(
                TaskEntity(
                    id = dto.id,
                    title = dto.title,
                    done = dto.done
                )
            )
        }
    }
}
```

这个例子把 Room 作为 UI 的单一数据源：网络刷新先写入数据库，页面继续观察数据库。真实同步还要处理服务器 id 与本地 id、删除墓碑、冲突合并、分页和失败重试；不要因为示例能跑就认为离线同步已经完成。

## 8.3 错误与结果映射

Repository 可以定义领域错误：

```kotlin
sealed interface DataError {
    data object Offline : DataError
    data object Unauthorized : DataError
    data class Unknown(val cause: Throwable?) : DataError
}
```

网络异常、HTTP 状态和数据库异常在 Repository 中转换为稳定含义，ViewModel 再决定显示什么状态。不要把完整异常堆栈直接展示给用户，也不要把可恢复错误变成应用崩溃。

## 8.4 令牌与登录状态

登录 Repository 负责认证请求、令牌保存和登出清理。令牌存储应使用安全方案；DataStore 只适合保存非敏感偏好，或保存经过额外保护的数据。登出时还要处理内存中的用户数据、数据库隔离和缓存清理，不能只删除一个字符串。

# 9. 用 Todo 与登录流程串联

## 9.1 Todo 的完整数据流

1. `TodoScreen` 输入标题，触发 `onAddTask`。
2. `TodoViewModel.addTask()` 校验输入并调用 `TaskRepository.addTask()`。
3. Repository 写入 Room。
4. Room 的 `observeAll()` 发出新列表。
5. Repository 把 Entity 映射成 `Task`。
6. ViewModel 更新 `TodoUiState`，Composable 重组。

这里 UI 不需要知道 Room 的 SQL，也不需要手动通知列表刷新。只要 Repository 的统一接口稳定，未来把本地存储换成远程缓存或加入同步层，页面仍可保持相对不变。

## 9.2 登录流程的状态

登录页通常需要区分空闲、提交中、失败和成功：

```kotlin
sealed interface LoginUiState {
    data object Idle : LoginUiState
    data object Loading : LoginUiState
    data class Error(val message: String) : LoginUiState
    data class Success(val nextRoute: String) : LoginUiState
}
```

ViewModel 发起登录并产生状态；页面观察到 `Success` 后调用导航回调。敏感密码不要放进 StateFlow 的长期状态，也不要写入日志。登录完成后，应用级会话状态决定是否显示主页、登录页或受保护页面。

## 9.3 依赖关系应该单向

推荐依赖方向：

`Compose → ViewModel → Repository → Room/Retrofit/DataStore`

数据源不应该反向依赖 ViewModel，Repository 不应该依赖某个 Composable，页面也不应该直接拿 DAO。若发现 ViewModel 里到处创建 Retrofit、Context 和数据库，说明组合根和依赖边界需要整理。

## 9.4 测试进阶数据流

可以先为 Repository 和 ViewModel 写 JVM 测试，用 Fake 替代网络与数据库：

```kotlin
class FakeTaskRepository : TaskRepository {
    private val tasks = MutableStateFlow<List<Task>>(emptyList())

    override fun observeTasks(): Flow<List<Task>> = tasks

    override suspend fun addTask(title: String) {
        tasks.update { current ->
            current + Task(id = current.size + 1L, title = title, done = false)
        }
    }

    override suspend fun refresh() = Unit
}
```

测试重点包括：输入为空时不新增、保存失败时恢复 loading、登录失败时给出正确状态、登出后不泄露上一用户数据。Compose UI 测试再覆盖关键可见行为，而不是把所有内部实现都写进测试。

## 9.5 常见架构错误

| 现象 | 根因 | 调整 |
| --- | --- | --- |
| 页面旋转后请求重复或状态丢失 | 状态放在 Composable 内部 | 移到 ViewModel，事件使用受控协程 |
| ViewModel 难以测试 | 内部直接创建数据库和网络 | 构造函数注入 Repository/API |
| 网络成功后列表仍不刷新 | UI 与数据源各自维护副本 | 使用 Repository 统一数据流 |
| 登出后仍看到旧数据 | 缓存和用户会话未隔离 | 登出清理缓存，数据库按用户隔离 |
| 所有异常都显示“网络错误” | 错误未分层映射 | 区分取消、HTTP、解析和本地错误 |
| Flow 在后台持续收集 | 使用了无生命周期约束的收集 | `collectAsStateWithLifecycle()` 或对应生命周期 API |

# 10. 进阶复习清单

| 主题 | 应能回答或完成 |
| --- | --- |
| 分层 | UI、ViewModel、Repository、数据源各自负责什么？ |
| 单向数据流 | 用户事件如何变成新的 UI State？ |
| Navigation | 类型安全路由如何声明、传参和取参？ |
| ViewModel | 为什么它能跨配置变化保存状态？不能持有什么？ |
| Flow | StateFlow 与 SharedFlow 的语义差异是什么？ |
| 生命周期 | 为什么 UI 要使用 `collectAsStateWithLifecycle()`？ |
| Retrofit | DTO、接口、OkHttp 拦截器和错误映射如何配合？ |
| DataStore | 哪些数据适合保存？为什么它不是加密保险箱？ |
| Room | Entity、DAO、Database、Migration 分别解决什么？ |
| Repository | 如何统一网络与数据库，避免 UI 维护多份状态？ |
| 测试 | 如何用 Fake Repository 测试 ViewModel 的关键状态？ |

本篇没有展开 Hilt、模块化、复杂缓存、离线同步冲突、WorkManager、动画、自定义绘制和性能剖析。下一步可以根据真实项目选择一个方向深入，但不要同时引入所有框架。先把一条登录或 Todo 流程做通：能从 UI 触发、经过 ViewModel 与 Repository、写入数据源、再以 Flow 回到界面，并且错误、取消和重建都可解释。

官方资料：

- [Navigation Compose](https://developer.android.com/develop/ui/compose/navigation)、[Type safety in Kotlin DSL and Navigation Compose](https://developer.android.com/guide/navigation/design/type-safety)
- [ViewModel overview](https://developer.android.com/topic/libraries/architecture/viewmodel)、[UI layer](https://developer.android.com/topic/architecture/ui-layer)
- [Kotlin flows on Android](https://developer.android.com/kotlin/flow)、[Repeatable and lifecycle-aware flows](https://developer.android.com/topic/architecture/recommendations#lifecycle-aware-flows)
- [Retrofit](https://github.com/square/retrofit)、[OkHttp](https://github.com/square/okhttp)
- [DataStore](https://developer.android.com/topic/libraries/architecture/datastore)、[Save data locally](https://developer.android.com/training/data-storage)
- [Room](https://developer.android.com/training/data-storage/room)、[Data layer](https://developer.android.com/topic/architecture/data-layer)

这套系列最终形成的是四个入口：Kotlin 负责语言，Android 基础负责工程和系统边界，Compose 负责声明式界面，进阶篇负责页面组织、状态和数据。遇到新问题时先判断它属于哪一层，再回到对应章节，而不是在一篇文章里寻找所有答案。

> 系列导航：[1/4 Kotlin 基础与进阶](/article/Kotlin基础与进阶) · [2/4 Android 基础与工程化](/article/Android基础与工程化) · [3/4 Android Compose 总结](/article/Android-Compose学习总结) · **4/4 Android 进阶篇**
