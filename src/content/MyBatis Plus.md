---
title: MyBatis Plus的学习
date: 2024-12-05
tags: [MyBatis Plus, 基础学习]
description: MyBatis Plus的学习
pinned: false
---

```js
// 官网
https://baomidou.com/introduce/
```



# 1.引入依赖

![](/img_mybatisplus/01.png)

# 2.Mybatis X 插件

## ①XML 映射跳转

MybatisX 提供了便捷的 XML 映射文件与 Java 接口之间的跳转功能，让开发者能够快速地在两者之间切换，提高开发效率。

![mybatisx-jump](/img_mybatisplus/mybatisx-jump.gif)

## ②代码生成

通过 MybatisX，您可以轻松地根据数据库表结构生成对应的 Java 实体类、Mapper 接口及 XML 映射文件。

![mybatisx-generate](/img_mybatisplus/mybatisx-generate.gif)



# 3.定义Mapper

![](/img_mybatisplus/03.png)



# 4.常见注解

![04](/img_mybatisplus/04.png)



# 5.常见配置

![05](/img_mybatisplus/05.png)



# 6.案例

![06](/img_mybatisplus/06.png)

![06](/img_mybatisplus/07.png)



# 7.条件构造器(适用于复杂条件)

![08](/img_mybatisplus/08.png)

![09](/img_mybatisplus/09.png)

![10](/img_mybatisplus/10.png)

![11](/img_mybatisplus/11.png)

![12](/img_mybatisplus/12.png)

# 8.分页插件

```java
// com.itheima.mp
//   config
//      MybatisConfig.java
```

![001](/img_mybatisplus/001.png)

```java
    @Test
    void testPage() {
        int PageNo = 1;
        int pageSize = 2;
        // 1. 准备分页条件
        // 1.1. 分页条件
        Page<User> page = Page.of(PageNo,pageSize);
        // 1.2. 排序条件
        page.addOrder(new OrderItem("balance",true));
        page.addOrder(new OrderItem("id",true));
        // 2. 执行分页查询
        Page<User> p = userService.page(page);
        // 3. 解析
        long total = p.getTotal();
        System.out.println("total = " + total);
        long pages = p.getPages();
        System.out.println("pages = " + pages);
        List<User> users = p.getRecords();
        users.forEach(System.out::println);
    }
```

