---
title: FastAPI 从入门到异步数据库实战
date: 2026-10-16
updatetime: 2026-10-16
tags: [FastAPI, Python, 学习笔记, SQLAlchemy, MySQL]
description: 基于黑马程序员 FastAPI 练习项目的知识点总结，从路由、参数校验、响应、中间件、依赖注入讲到异步 SQLAlchemy 2.0 + MySQL 的图书管理 CRUD 实战与常见坑。
pinned: false
---

# 01. 项目背景与技术栈

这份笔记来自黑马程序员课程里的 FastAPI 练习项目：**用三个文件、一本书（Book），把 Web 后端最常用的那套能力从头走一遍**。上一个阶段的 Python 学习记录在[《Python 从基础到实战》](/article/Python基础到实战)里，那篇的最后一章是"FastAPI 入门 + 汉字谜盒"的初体验；这一篇算是它的续篇——把请求侧、响应侧、中间件、依赖注入完整练一遍，再用异步 SQLAlchemy 接上 MySQL，做出一个带增删改查、模糊搜索和分页的图书管理接口。

三个文件是一条清晰的递进路线：

| 文件 | 覆盖内容 | 行数 |
| --- | --- | --- |
| `main1.py` | 应用实例与文档开关、路由、Path/Query 参数校验、Pydantic 请求体、响应类型、HTTPException、中间件、日志 | 137 |
| `main2.py` | 依赖注入 `Depends`：把分页参数抽成公共依赖，新闻列表和用户列表共用 | 30 |
| `main.py` | 异步 SQLAlchemy 2.0 + MySQL：模型定义、建表、会话依赖、查询 / 模糊搜索 / 聚合 / 分页、增删改 | 231 |

项目虚拟环境里实测的版本（对应 `.venv/Lib/site-packages` 下的 dist-info）：

| 依赖 | 版本 | 作用 |
| --- | --- | --- |
| fastapi | 0.143.0 | Web 框架本体 |
| pydantic | 2.14.0 | 请求体校验与序列化（v2 语法） |
| sqlalchemy | 2.1.4 | ORM，使用 2.0 风格声明式模型 |
| aiomysql | 0.3.2 | MySQL 的异步驱动 |
| uvicorn | 0.54.0 | ASGI 服务器 |
| starlette | 1.7.0 | FastAPI 底层的 ASGI 工具箱（中间件、响应类等） |

下面按"请求进来到数据落库"的顺序记录：先跑起来（第 02 章），再看请求侧（第 03 章）、响应与异常（第 04 章）、中间件与依赖注入（第 05 章），然后是异步数据库（第 06 章）和 CRUD 实战（第 07 章），最后把踩过的坑集中成清单（第 08 章）。

# 02. 应用骨架与启动方式

## 2.1 创建应用实例

FastAPI 的最小骨架只有两行：创建实例 + 用装饰器挂路由。

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

`app` 就是整个应用的入口对象，后面所有路由、中间件、生命周期钩子都挂在它上面。路由函数返回字典、列表、Pydantic 模型、ORM 对象都可以，FastAPI 会自动把它们转成 JSON。

## 2.2 自动文档与"关文档"

默认情况下 FastAPI 会自动生成三份东西：

| 路径 | 内容 |
| --- | --- |
| `/docs` | Swagger UI，可交互的接口调试页 |
| `/redoc` | ReDoc，可读性更好的文档页 |
| `/openapi.json` | OpenAPI 规范 JSON，前两个页面都是靠它渲染的 |

练习项目里把它们全关掉了，因为在生产环境暴露完整接口结构并不安全：

```python
app = FastAPI(
    docs_url=None,     # 关闭 /docs (Swagger UI)
    redoc_url=None,    # 关闭 /redoc (ReDoc)
    openapi_url=None,  # 关闭 /openapi.json（重要！）
)
```

注意：**只关 `docs_url` 和 `redoc_url` 是不够的**，`/openapi.json` 还在，别人照样能把整个接口结构拿走，所以要三个一起关。本地开发时再按需打开。

## 2.3 三种启动方式

```bash
# 方式一：FastAPI CLI（开发模式，自动重载，默认 127.0.0.1:8000）
fastapi dev main.py

# 方式二：uvicorn 命令（--reload 打开热重载）
uvicorn main:app --reload
```

```python
# 方式三：把启动逻辑写进主程序
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

三种方式最终都是把 `app` 交给 ASGI 服务器（uvicorn）跑。`fastapi dev` 和 `uvicorn --reload` 适合开发，`fastapi run` / 纯 `uvicorn main:app` 适合生产。

## 2.4 两个基础路由

```python
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
```

`{name}` 是路径参数，直接出现在 URL 里；函数参数名和花括号里的名字一致时，FastAPI 自动完成绑定。访问 `/hello/Liubai` 会得到 `{"message": "Hello Liubai"}`。

# 03. 请求侧：路由、参数与请求体

一个请求的参数可能出现在三个地方：URL 路径里、URL `?` 后面、请求体里。FastAPI 靠"函数参数的类型和默认值"来自动区分。

## 3.1 路径参数与 Path 校验

```python
from fastapi import Path

@app.get("/book/{id}")
async def get_book(id: int = Path(..., description="Book ID", gt=0, lt=1000)):
    return {"id": id, "title": f"this is a {id} book"}

@app.get("/author/{name}")
async def get_author(name: str = Path(..., description="Author name", min_length=1, max_length=10)):
    return {"name": name}
```

几个要点：

- `id: int` 会把 URL 里的字符串转成整数，转不动就自动返回 422，不用自己写 `int(id)`。
- `Path(..., ...)` 里的 `...` 是 `Ellipsis`，表示**必填**；给了默认值就变成可选。
- `gt=0, lt=1000` 是数值范围校验，`min_length` / `max_length` 针对字符串长度，超范围同样直接 422。
- `description` 只是文档描述，不影响校验。

## 3.2 查询参数与 Query 校验

```python
@app.get("/news")
async def get_news(skip: int = 0, limit: int = 100):
    return {"skip": skip, "limit": limit}
```

不在路径里、也没有对应 Pydantic 模型承接的参数，会被当作查询参数，例如 `/news?skip=20&limit=10`。给了默认值就是可选，不传时用默认值。

需要校验时用 `Query`（`main2.py` 里的公共分页参数）：

```python
from fastapi import Query

async def common_parameters(
    skip: int = Query(ge=0, default=0),
    limit: int = Query(le=60, default=10),
):
    return {"skip": skip, "limit": limit}
```

`skip=0, limit=1000` 这种"恶意分页"会在校验层被 `le=60` 直接拦掉。

## 3.3 固定路径要放在动态路径前面

这是很容易踩的一个坑。`main.py` 里有一批固定路径：

```text
/book/books
/book/frist_book
/book/search
/book/count
/book/page
```

以及一条被注释掉的动态路径：

```python
# @app.get("/book/{book_id}")
# async def get_book(book_id: int, db: AsyncSession = Depends(get_database)):
```

路由是按注册顺序匹配的。如果这条 `{book_id}` 路由注册在前面，那么访问 `/book/count` 时会先命中它，`count` 转不成 `int`，直接 422——`/book/count` 和 `/book/page` 就永远轮不到。所以：**固定路径的路由写在动态路径前面**，或者给动态路由加更严格的约束（比如 `Path(..., pattern=r"^\d+$")`）。

## 3.4 请求体：Pydantic BaseModel

```python
from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

@app.post("/register")
async def register(user: User):
    return {"message": "User registered successfully", "user": user.model_dump()}
```

参数类型是一个继承 `BaseModel` 的类时，FastAPI 就知道要从请求体（JSON）里取值，并且自动完成：

- JSON 解析与类型校验，字段缺失或类型不符返回 422 并指出具体字段；
- 生成 `/docs` 里的请求体结构；
- 文档里的示例值（可用 `model_config = {"json_schema_extra": {...}}` 自定义）。

## 3.5 Field 校验参数速查

字段级校验写在 `Field` 里，和 `Path` / `Query` 是同一套规则：

```python
from pydantic import Field

class User2(BaseModel):
    username: str = Field(..., description="用户名，长度1-10个字符", min_length=1, max_length=10)
    password: str = Field(..., description="密码，长度6-12个字符", min_length=6, max_length=12)
```

| 参数 | 含义 | 备注 |
| --- | --- | --- |
| `...` | 必填 | 用 `Ellipsis` 占位，等价于"没有默认值" |
| `default` | 默认值 | 有默认值即非必填 |
| `description` | 字段说明 | 出现在 `/docs` 与 openapi.json |
| `min_length` / `max_length` | 字符串长度范围 | 也可用于列表长度 |
| `gt` / `ge` | 大于 / 大于等于 | 数值 |
| `lt` / `le` | 小于 / 小于等于 | 数值 |
| `pattern` | 正则约束 | 练习里没用到，实际项目很常用 |

`Path`、`Query`、`Body`、`Field` 的校验关键字基本互通，记住一套就够用。

## 3.6 可选字段与默认值

```python
from typing import Optional

class SearchQuery(BaseModel):
    id: Optional[int] = None
    bookname: Optional[str] = ""
    price: Optional[float] = None
    publisher: Optional[str] = ""
    author: Optional[str] = ""
```

两种"空"要分开看：`None` 表示"没传/传了 null"，`""` 表示"传了空字符串"。项目里的搜索接口就是按这个约定判断的——`id` 和 `price` 用 `is not None`，文本字段用 `!= ""`。

## 3.7 extra="allow" 与 model_extra

默认情况下 Pydantic 会**忽略**模型里没定义的字段。练习项目想让多传的字段报错，于是显式开启 `extra="allow"`：

```python
class SearchQuery(BaseModel):
    model_config = {"extra": "allow"}  # 允许额外字段，不报错
    # ... 字段定义

@app.post("/book/search")
async def search_books(query: SearchQuery, db: AsyncSession = Depends(get_database)):
    # model_extra 保存请求中传入但模型里不存在的字段，有则返回 400 错误
    if query.model_extra:
        raise HTTPException(status_code=400, detail=f"无效的查询参数字段: {query.model_extra}")
    ...
```

`model_extra` 是一个字典，装着"传进来了但模型没声明"的字段。这相当于手写了一遍严格模式；更省事的写法是 `model_config = {"extra": "forbid"}`，让 Pydantic 在解析阶段直接拒绝（框架统一返回 422），不用自己判断。

# 04. 响应与异常

## 4.1 默认 JSON 响应

返回 `dict` / `list` 是最常见的形式，FastAPI 用 `JSONResponse` 序列化。返回 Pydantic 模型实例或 ORM 对象也行，框架会尝试逐属性取值。

## 4.2 response_model

```python
class News(BaseModel):
    id: int
    title: str
    content: str

@app.get("/news/{id}", response_model=News)
async def get_news(id: int):
    return News(id=id, title=f"News {id}", content=f"Content of News {id}")
```

`response_model` 的三个作用：

1. **过滤字段**：返回对象上多余的数据会被丢掉，避免把密码、内部 ID 之类顺带发出去；
2. **生成文档**：`/docs` 里能看到响应结构；
3. **校验与转换**：保证返回数据符合声明（不符合会报服务端错误，暴露问题）。

## 4.3 HTMLResponse 与 FileResponse

```python
from starlette.responses import HTMLResponse, FileResponse

@app.get("/html", response_class=HTMLResponse)
async def get_html():
    return "<h1>Hello World</h1>"

@app.get("/file")
async def get_file():
    file_path = "./files/114514.png"
    return FileResponse(file_path)
```

- `response_class=HTMLResponse`：告诉框架"这个字符串是 HTML，别当 JSON 转义"。
- `FileResponse`：直接把磁盘文件作为响应体流式返回，适合图片、附件、前端静态资源。常用的额外参数是 `filename="xxx.png"`（触发下载）和 `media_type="image/png"`。
- 这里的 `./files/xxx` 是**相对当前工作目录**的路径，换个目录启动就 404，改进写法见第 08 章。

## 4.4 HTTPException

```python
from fastapi import HTTPException

@app.get("/book1/{id}", response_model=News)
async def get_book(id: int):
    if id < 0:
        raise HTTPException(status_code=400, detail="Book ID must be positive")
    return News(id=id, title=f"Book {id}", content=f"Content of Book {id}")
```

要点：

- 必须用 `raise`，`return HTTPException(...)` 只会把它当成普通返回值序列化成 200 响应（第 08 章有个真实案例）。
- `detail` 可以是字符串，也可以是任意可 JSON 化的结构（比如 `{"code": 40401, "msg": "..."}`）。
- 校验失败（422）是框架自动抛的；业务规则不满足（400/403/404/409）由自己抛。

# 05. 中间件与依赖注入

## 5.1 自定义 HTTP 中间件

```python
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@app.middleware("http")
async def middleware1(request: Request, call_next):
    logging.info("Middleware1 before request")
    response = await call_next(request)
    logging.info("Middleware1 after request")
    return response

@app.middleware("http")
async def middleware2(request: Request, call_next):
    logging.info("Middleware2 before request")
    response = await call_next(request)
    logging.info("Middleware2 after request")
    return response
```

中间件是"包在路由外面的层"：请求先穿过所有中间件到达路由，响应再反向穿回去。典型用途是记录耗时、统一加响应头、校验令牌、记录访问日志。

## 5.2 洋葱模型与执行顺序

注意一个反直觉的点：**后注册的中间件在最外层**。Starlette 内部是 `self.user_middleware.insert(0, Middleware(...))`，新的中间件被插到栈顶，所以 `middleware2` 先收到请求、最后处理响应：

```mermaid
sequenceDiagram
    participant C as 客户端
    participant M2 as middleware2
    participant M1 as middleware1
    participant R as 路由处理函数

    C->>M2: 请求
    M2->>M1: await call_next(request)
    M1->>R: await call_next(request)
    R-->>M1: 响应
    M1-->>M2: 响应
    M2-->>C: 响应
```

启动服务后访问任意接口，控制台日志的顺序是：

```text
Middleware2 before request
Middleware1 before request
Middleware1 after request
Middleware2 after request
```

想记录请求耗时，就该把计时逻辑放在最外层中间件里：

```python
import time

@app.middleware("http")
async def timing_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    cost_ms = (time.perf_counter() - start) * 1000
    logging.info(f"{request.method} {request.url.path} -> {response.status_code} ({cost_ms:.1f}ms)")
    return response
```

## 5.3 日志配置速查

```python
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
```

| 占位符 | 含义 |
| --- | --- |
| `%(asctime)s` | 时间 |
| `%(levelname)s` | 日志级别 |
| `%(message)s` | 日志正文 |
| `%(filename)s` | 文件名 |
| `%(lineno)s` | 行号 |
| `%(funcName)s` | 函数名 |

排错时把后三个加上，日志能直接定位到代码位置。

## 5.4 依赖注入：Depends 复用公共参数

新闻列表和用户列表都要分页，参数完全一样。抽成公共依赖后，两个接口都能复用（`main2.py` 的全部内容）：

```python
from fastapi import Depends, Query

async def common_parameters(
    skip: int = Query(ge=0, default=0),
    limit: int = Query(le=60, default=10),
):
    return {"skip": skip, "limit": limit}

@app.get("/news/news_list")
async def get_news_list(commons: dict = Depends(common_parameters)):
    return {"message": "Get news list", "commons": commons}

@app.get("/user/user_list")
async def get_user_list(commons: dict = Depends(common_parameters)):
    return {"message": "Get user list", "commons": commons}
```

依赖注入的三个实际价值：

1. **复用**：校验规则、默认值只写一份，改一处全生效；
2. **解耦**：路由函数不关心参数怎么来的，只接收组装好的结果；
3. **可测试**：`app.dependency_overrides` 可以把依赖替换成假实现，不用改业务代码。

同一个请求内，同一个依赖默认只计算一次（`Depends(..., use_cache=True)`），多个子依赖共用不会重复执行。

## 5.5 带 yield 的依赖

依赖不只是"返回参数"，还能"管理资源"——用 `yield` 把资源交给路由函数，用完再收尾：

```python
async def get_database():
    async with AsyncSessionLocal() as session:
        try:
            yield session        # 把会话交给路由函数
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

这就是数据库会话的依赖项，下一章展开。这里先记住两件事：

- 路由函数抛异常时，异常会在 `yield` 处重新抛出，`except` 分支能正常回滚，再向上交给异常处理器；
- `yield` 之后的收尾代码默认在**响应发送完成之后**执行；如果希望它在响应发出前就跑（比如"提交失败必须变成 500"），可以写 `Depends(get_database, scope="function")`（FastAPI 0.121+ 支持 `scope` 参数）。

# 06. 异步数据库：SQLAlchemy 2.0 + MySQL

`main.py` 是这个练习项目的重头戏：把前面的路由能力接到真实数据库上。技术组合是 **SQLAlchemy 2.0 异步模式 + aiomysql 驱动 + MySQL**。

## 6.1 异步引擎与连接串

```python
from sqlalchemy.ext.asyncio import create_async_engine

ASYNC_DATABASE_URL = "mysql+aiomysql://root:123456@localhost:3306/itheima_fast?charset=utf8mb4"

async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,          # 打印 SQL，方便调试
    pool_size=10,       # 连接池大小
    max_overflow=20,    # 池满后允许临时超出的连接数
)
```

连接串的结构：

```text
mysql+aiomysql://用户名:密码@主机:端口/数据库名?charset=utf8mb4
└─方言──┘└─驱动─┘
```

| 片段 | 说明 |
| --- | --- |
| `mysql` | 数据库方言 |
| `aiomysql` | 异步驱动；换成 `pymysql` 就变成同步模式 |
| `charset=utf8mb4` | 支持 emoji 与四字节字符，中文项目必备 |
| `echo=True` | 开发期打印 SQL；生产环境要关掉，否则日志会爆 |

## 6.2 模型定义：DeclarativeBase

SQLAlchemy 2.0 的声明式写法用类型注解描述字段：

```python
from datetime import datetime
from sqlalchemy import DateTime, Float, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    create_time: Mapped[datetime] = mapped_column(DateTime, default=func.now(), comment="创建时间")
    update_time: Mapped[datetime] = mapped_column(DateTime, default=func.now(), comment="更新时间")

class Book(Base):
    __tablename__ = "book"
    id: Mapped[int] = mapped_column(primary_key=True, comment="主键ID")
    bookname: Mapped[str] = mapped_column(String(255), comment="书名")
    author: Mapped[str] = mapped_column(String(255), comment="作者")
    price: Mapped[float] = mapped_column(Float, comment="价格")
    publisher: Mapped[str] = mapped_column(String(255), comment="出版社")
```

类型注解和列类型的对应关系：

| Python 注解 | 列类型 | 备注 |
| --- | --- | --- |
| `int` + `primary_key=True` | INT 主键 | ORM 会自动自增 |
| `str` | 需要显式给 `String(255)` | 不写长度 MySQL 建表会报错 |
| `float` | FLOAT | 金额场景建议 Numeric |
| `datetime` + `DateTime` | DATETIME | 配合 `default=func.now()` 由数据库生成 |

`comment` 会写进建表语句，Navicat 之类的工具里能直接看到字段说明，强烈建议保留。

## 6.3 抽象基类复用公共字段

`Base` 里定义的两个时间字段会被**所有**子表继承——这就是"抽象基类"的用法：创建时间、更新时间、逻辑删除标记这类字段只写一次。

小改进：现在 `update_time` 只在插入时取当前时间，更新时不会变。给它补上 `onupdate`：

```python
update_time: Mapped[datetime] = mapped_column(
    DateTime, default=func.now(), onupdate=func.now(), comment="更新时间"
)
```

## 6.4 建表与生命周期管理

建表用 `metadata.create_all()`；但它是同步 API，所以要借 `run_sync` 丢进异步连接里执行：

```python
async def create_tables():
    async with async_engine.begin() as conn:      # 事务中执行
        await conn.run_sync(Base.metadata.create_all)
```

项目里用 `@app.on_event("startup")` 在启动时调用它：

```python
@app.on_event("startup")
async def startup():
    await create_tables()
```

`on_event` 从 FastAPI 0.93 起就标记为弃用，官方推荐用 `lifespan`（一个 `asynccontextmanager`），而且它还多了一次"应用关闭"的收尾时机：

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时：建表（生产项目更推荐 Alembic 迁移）
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # 关闭时：释放连接池
    await async_engine.dispose()

app = FastAPI(lifespan=lifespan)
```

生产环境一般不用 `create_all`（它只负责"表不存在时创建"，不会改字段），而是用 Alembic 管理迁移版本。

## 6.5 会话工厂 async_sessionmaker

```python
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,  # 提交后会话不过期，不会重新查询数据库
)
```

`expire_on_commit` 值得单独说：默认值是 `True`，session 提交后所有对象属性会过期，再访问就会触发一次查询刷新。在异步环境里，这种"隐式 IO"会因为发生在同步上下文而报 `MissingGreenlet` 错误。把它设为 `False`，提交后对象还能直接用，这是异步项目的常规配置。

## 6.6 会话依赖 get_database

```python
from fastapi import Depends

async def get_database():
    async with AsyncSessionLocal() as session:
        try:
            yield session           # 返回数据库会话给路由处理函数
            await session.commit()  # 提交事务
        except Exception:
            await session.rollback()  # 回滚事务
            raise
        finally:
            await session.close()     # 关闭数据库会话
```

路由函数只要声明 `db: AsyncSession = Depends(get_database)`，就能拿到一个"用完自动提交 / 出错自动回滚 / 一定关闭"的会话。这是一次成功的依赖注入实践：把事务边界从每个接口里搬出来，集中到一个地方。

使用方式：

```python
@app.get("/book/books")
async def get_books(db: AsyncSession = Depends(get_database)):
    result = await db.execute(select(Book))
    return result.scalars().all()
```

# 07. 图书管理 CRUD 实战

## 7.1 查询：五种取数方式

`select()` 是 SQLAlchemy 2.0 的统一查询入口，配合不同的"取数方法"应对不同场景：

| 写法 | 返回 | 适用场景 |
| --- | --- | --- |
| `result.scalars().all()` | 列表（可能为空） | 查询列表 |
| `result.scalars().first()` | 第一行或 `None` | 只要一条，且不关心多不多余 |
| `result.scalar_one_or_none()` | 单值或 `None` | 按条件查唯一一条（0 或 1 条） |
| `result.scalar_one()` | 单值 | 聚合统计、确定只有一条时 |
| `await db.get(Book, id)` | 对象或 `None` | 按主键查询，优先走身份映射缓存 |

项目里的三个例子：

```python
# 查询所有图书
@app.get("/book/books")
async def get_books(db: AsyncSession = Depends(get_database)):
    result = await db.execute(select(Book))
    book_list = result.scalars().all()
    return book_list

# 查询第一本图书
@app.get("/book/frist_book")
async def get_first_book(db: AsyncSession = Depends(get_database)):
    result = await db.execute(select(Book))
    book = result.scalars().first()
    return book

# 查询指定 ID 的图书（项目里被注释的写法，更推荐 db.get）
# @app.get("/book/{book_id}")
# async def get_book(book_id: int, db: AsyncSession = Depends(get_database)):
#     res = await db.execute(select(Book).where(Book.id == book_id))
#     book = res.scalar_one_or_none()
#     if not book:
#         raise HTTPException(status_code=404, detail="Book not found")
#     return book
```

`select(Book).where(...)` 里能用的条件运算符：

| 运算符 | 含义 | 示例 |
| --- | --- | --- |
| `like` | 模糊匹配 | `Book.bookname.like("%三体%")` |
| `==` `!=` | 等于 / 不等于 | `Book.id == 1` |
| `>` `<` `>=` `<=` | 比较 | `Book.price > 50` |
| `in_` | 在列表中 | `Book.id.in_([1, 2, 3])` |
| `&` `\|` `~` | 与 / 或 / 非 | `(Book.price > 10) & (Book.price < 100)` |

## 7.2 多条件模糊查询

搜索接口要支持"传了哪个字段就按哪个字段过滤"，思路是**动态收集非空条件**，最后用 `and_` 拼起来：

```python
from sqlalchemy import and_

@app.post("/book/search")
async def search_books(query: SearchQuery, db: AsyncSession = Depends(get_database)):
    conditions = []
    if query.id is not None:
        conditions.append(Book.id == query.id)          # 主键精确匹配
    if query.bookname != "":
        conditions.append(Book.bookname.like(f"%{query.bookname}%"))  # 书名模糊查询
    if query.author != "":
        conditions.append(Book.author.like(f"%{query.author}%"))      # 作者模糊查询
    if query.price is not None:
        conditions.append(Book.price == query.price)    # 价格精确匹配
    if query.publisher != "":
        conditions.append(Book.publisher.like(f"%{query.publisher}%"))  # 出版社模糊查询

    if conditions:
        result = await db.execute(select(Book).where(and_(*conditions)))
    else:
        result = await db.execute(select(Book))         # 无条件则查询全部
    return result.scalars().all()
```

几个细节：

- `select(Book).where(条件1, 条件2, ...)` 本身就是 AND 连接，`and_(*conditions)` 只是把列表展开成多个参数；
- `like` 里的 `%` 匹配任意字符，`_` 匹配单个字符；用户输入里带 `%` 时需要转义（`like(..., escape="\\")`），否则语义会被改变；
- `""` 和 `None` 分开判断，是这套"可选查询"约定的前提。

## 7.3 聚合查询

```python
from sqlalchemy import func

@app.get("/book/count")
async def count_books(db: AsyncSession = Depends(get_database)):
    result = await db.execute(select(func.count(Book.id)))
    total = result.scalar_one()          # 获取唯一的统计结果
    return {"total": total}
```

| 聚合函数 | 含义 |
| --- | --- |
| `func.count(...)` | 统计行数 |
| `func.avg(...)` | 平均值 |
| `func.max(...)` / `func.min(...)` | 最大 / 最小 |
| `func.sum(...)` | 求和 |

聚合结果是一个标量，用 `scalar_one()` 取；如果有分组（`group_by`），则是"多行"，要改用 `result.all()`。

## 7.4 分页查询

分页 = 总数 + 当前页数据 + 总页数：

```python
@app.get("/book/page")
async def page_books(
    offset: int = 0,   # 起始偏移量（从第 offset 条开始）
    limit: int = 10,   # 每页返回的记录条数
    db: AsyncSession = Depends(get_database),
):
    # 1. 统计总记录数
    count_result = await db.execute(select(func.count(Book.id)))
    total = count_result.scalar_one()

    # 2. 跳过 offset 条，最多取 limit 条
    result = await db.execute(select(Book).offset(offset).limit(limit))
    book_list = result.scalars().all()

    # 3. 计算总页数（向上取整：Python 的 // 是向下取整）
    total_pages = (total + limit - 1) // limit

    return {
        "total": total,
        "total_pages": total_pages,
        "offset": offset,
        "limit": limit,
        "books": book_list,
    }
```

`(total + limit - 1) // limit` 是向上取整的常用技巧：`total=105, limit=10` 得到 11 页。调用示例：`/book/page?offset=0&limit=10`（第 1 页）、`?offset=10&limit=10`（第 2 页）。

## 7.5 新增

```python
class BookBase(BaseModel):
    id: Optional[int] = None
    bookname: Optional[str] = ""
    author: Optional[str] = ""
    price: Optional[float] = None
    publisher: Optional[str] = ""

@app.post("/book/add_book")
async def add_book(book: BookBase, db: AsyncSession = Depends(get_database)):
    book_obj = Book(**book.model_dump())
    try:
        db.add(book_obj)
        await db.commit()
        return {"message": "Book added successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
```

要点：

- `Book(**book.model_dump())` 把请求体字段平铺成构造参数；`model_dump()` 是 Pydantic v2 的写法（v1 的 `.dict()` 已弃用）；
- 新增时把 `id` 留空交给数据库自增，请求体里显式给 `id` 只适合数据导入；
- `db.add()` 只是把对象加入会话，`commit()` 才真正落库；出错必须 `rollback()`，否则会话会停在失败事务里；
- 想拿到自增主键，要在提交后 `await db.refresh(book_obj)` 或先 `await db.flush()`；
- 不建议把 `str(e)` 原文塞进响应体——数据库结构、SQL 片段都可能泄漏给客户端。这里应该记日志，对外只回一句通用提示。

## 7.6 更新

```python
@app.put("/book/update_book/{book_id}")
async def update_book(book_id: int, book: BookBase, db: AsyncSession = Depends(get_database)):
    book_obj = await db.get(Book, book_id)
    if book_obj is None:
        raise HTTPException(status_code=404, detail="Book not found")
    book_obj.bookname = book.bookname
    book_obj.author = book.author
    book_obj.price = book.price
    book_obj.publisher = book.publisher
    await db.commit()
    return {"message": "Book updated successfully"}
```

流程是"先查后改"：先 `db.get` 取出 ORM 对象，不存在就 404；然后逐字段赋值，提交时 SQLAlchemy 自动生成 `UPDATE`。字段多的时候可以批量赋值：

```python
for key, value in book.model_dump(exclude={"id"}).items():
    setattr(book_obj, key, value)
```

`exclude={"id"}` 不能省——不改主键。

## 7.7 删除

```python
@app.delete("/book/delete_book/{book_id}")
async def delete_book(book_id: int, db: AsyncSession = Depends(get_database)):
    book_obj = await db.get(Book, book_id)
    if book_obj is None:
        raise HTTPException(status_code=404, detail="Book not found")
    await db.delete(book_obj)
    await db.commit()
    return {"message": "Book deleted successfully"}
```

同样是先查后删，`db.delete()` 标记删除，`commit()` 生效。

# 08. 踩坑与改进清单

把项目里真实存在的问题集中列一下，这些坑比知识点本身更值得记：

| # | 原写法 | 问题 | 改进 |
| --- | --- | --- | --- |
| 1 | `@app.on_event("startup")` | FastAPI 0.93 起弃用，且没有关闭时机 | 改用 `lifespan` 异步上下文管理器 |
| 2 | `user.dict()` / `book.dict()` | Pydantic v2 已弃用，未来版本会移除 | 改用 `model_dump()` |
| 3 | 搜索接口里 `return HTTPException(status_code=400, ...)` | 异常对象被当普通返回值，客户端收到 **200** | 必须改成 `raise HTTPException(...)` |
| 4 | `from urllib.request import Request` | 类型注解是错的，中间件实际收到的是 Starlette 的 `Request` | `from fastapi import Request`（FastAPI 直接重导出 starlette 的 `Request`） |
| 5 | `FileResponse("./files/114514.png")` | 相对当前工作目录，换目录启动就 404 | `Path(__file__).resolve().parent / "files" / "114514.png"` |
| 6 | 连接串硬编码 `root:123456` | 密码进版本库，环境切换还要改代码 | 用环境变量 + `pydantic-settings` 读取 |
| 7 | 路由里 `await db.commit()`，依赖里又 `commit()` | 重复提交、事务边界不清晰 | 二选一：要么全交给依赖，要么在路由里显式管理 |
| 8 | `update_time` 只有 `default`，没有 `onupdate` | 更新记录后该字段永远不变 | `mapped_column(DateTime, default=func.now(), onupdate=func.now())` |
| 9 | `except` 里 `detail=f"Error: {str(e)}"` | 把数据库错误原文返回给客户端，泄漏内部信息 | 记日志 + 返回统一提示 |
| 10 | 异步路由里可能出现同步阻塞调用 | 阻塞事件循环，接口整体变慢 | 用 `httpx.AsyncClient` / `asyncio.sleep`，或将同步路由写成普通 `def`（FastAPI 会自动丢线程池） |

其中三个值得展开说：

**on_event → lifespan**。除了弃用问题，`on_event` 只能注册"启动"或"关闭"一个方向，多个钩子的执行顺序也不直观。`lifespan` 把两者合成一段代码，`yield` 之前是启动、之后是关闭，还能在其中持有资源（连接池、缓存客户端）并自动释放。

**`return HTTPException` 与 `raise HTTPException`**。这是最隐蔽的一个：接口看着"能返回错误信息"，实际 HTTP 状态码是 200，前端按状态码拦截错误时会完全失效。判断方法很简单——用 `/docs` 或 curl 看一眼返回的状态码。

**事务边界**。`get_database` 已经把提交 / 回滚 / 关闭做完了，业务代码里的 `try/except + commit/rollback` 就成了重复劳动，而且两处都可能提交，出现问题时很难判断是谁提交的。建议明确一条规则：**事务边界只放一个地方**。如果要保留路由内的提交（便于拿到自增 ID 或做多步提交），那就把依赖里的 `commit()` 去掉，只留 `rollback/close`。

# 09. 小结

一轮练习下来，这份清单基本覆盖了 FastAPI 入门到能写业务代码所需的知识点：

- 应用骨架：`FastAPI()` 实例、`docs_url/redoc_url/openapi_url`、三种启动方式；
- 请求侧：路径参数 + `Path` 校验、查询参数 + `Query` 校验、请求体 `BaseModel` + `Field` 校验、固定路径与动态路径的顺序；
- 响应侧：默认 JSON、`response_model`、`HTMLResponse`、`FileResponse`；
- 异常：`HTTPException` 的正确用法，422 与业务错误的分工；
- 中间件：`@app.middleware("http")` 的洋葱模型（后注册的在最外层）、日志配置、耗时统计；
- 依赖注入：`Depends` 复用公共参数、`use_cache`、`yield` 依赖管理资源与事务，以及 `scope="function"` 对退出时机的影响；
- 数据库：`create_async_engine`、`DeclarativeBase` + `Mapped/mapped_column`、抽象基类复用公共字段、`metadata.create_all` + `run_sync`、`lifespan`、`async_sessionmaker` + `expire_on_commit=False`；
- CRUD：`select` 的五种取数方式、多条件模糊查询、聚合函数、分页公式、增删改与 404 处理；
- 工程习惯：密码外置、日志定位、错误信息不外泄、事务边界唯一。

下一步可以往这几个方向继续练：

1. **分层**：`router / service / repository` 三层拆开，路由只做参数与响应，业务逻辑进 service；
2. **配置管理**：`pydantic-settings` + `.env`，把连接串、密钥从代码里挪出去；
3. **数据迁移**：用 Alembic 替代 `create_all`，支持字段变更与回滚；
4. **认证**：JWT + `Depends` 做登录校验，顺手练 `OAuth2PasswordBearer`；
5. **测试**：`pytest` + `httpx.AsyncClient` 写接口测试，配合 `dependency_overrides` 替换数据库依赖；
6. **部署**：uvicorn/gunicorn 多进程、Docker 镜像、连接池参数调优。

从"能跑通接口"到"能维护的项目"，中间隔着的其实就是上面这些工程细节。
