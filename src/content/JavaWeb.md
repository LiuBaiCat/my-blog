---
title: JavaWeb的学习
date: 2024-12-04
tags: [JavaWeb, 基础学习]
description: JavaWeb的学习
pinned: false
---

> https://www.bilibili.com/video/BV1m84y1w7Tb/

# 1.maven的介绍

![/img_javaweb/00.jpg](/img_javaweb/00.png)

> 可以理解为
>
> ①管理插件（jar包，比如JDBC，EL，JSTL）（不用自己导jar包自己下载了）
>
> ②可以把后端项目编译成一个jar包的东西

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.2</version>
</dependency>
```

# 2.maven的本地部署

![](/img_javaweb/00(2).png)

# 3.创建maven项目

![](/img_javaweb/01.png)

![](/img_javaweb/02.png)



![](/img_javaweb/03.png)4.maven-依赖管理

①依赖传递

![](/img_javaweb/04.png)

②排除依赖

![](/img_javaweb/05.png)

③依赖范围

![](/img_javaweb/06.png)

# 4.打包插件

![](/img_javaweb/07.png)

# 5.生命周期

![](/img_javaweb/08.png)

![](/img_javaweb/09.png)

![](/img_javaweb/10.png)

# 6. SpringBoot Web 快速入门

![](/img_javaweb/11.png)

![](/img_javaweb/12.png)

![](/img_javaweb/13.png)

![](/img_javaweb/14.png)

![](/img_javaweb/15.png)

# 7. HTTP - 请求数据格式

![](/img_javaweb/16.png)

![](/img_javaweb/17.png)

![](/img_javaweb/18.png)

![](/img_javaweb/19.png)

# 8. 常见响应状态码

![](/img_javaweb/20.png)

# 9. 请求响应

## ① 前言

![](/img_javaweb/21.png)

![](/img_javaweb/22.png)

## ② 简单参数

![](/img_javaweb/23.png)

![](/img_javaweb/24.png)

## ③数组集合参数

```java
//3.数组集合参数
@RequestMapping("/arrayParam")
public String arrayParam(String[] hobby) {
	System.out.println(Arrays.toString(hobby));
	return "OK";
}
```

## ④日期参数

```java
//4.日期时问参数
@RequestMapping("/dateParam")
public String dateParam(@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime updateTime) {
    System.out.println(updateTime);
return "OK";
}
//@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime updateTime
```
## ⑤JSON参数

```java
//@RequestBody
@PutMapping
    public Result updateDept(@RequestBody Dept dept) {
        log.info("更新部门数据:{}",dept);

        //调用service更新部门数据
        deptService.updateDept(dept);

        return Result.success();
    }
```



## ⑥路径参数

```java
//    @DeleteMapping("/{id}")和@PathVariable
@DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        log.info("删除部门数据:{}",id);

        //调用service删除部门数据
        deptService.deleteDept(id);

        return Result.success();
    }
```

## ⑦总结
![](/img_javaweb/25.png)

# 10. 统一响应结果
![](/img_javaweb/26.png)

# 11.请求响应 -- 案例
```
https://www.bilibili.com/video/BV1m84y1w7Tb?p=74
```
![](/img_javaweb/27.png)

# 12. 分层解耦 -- 三层架构
![](/img_javaweb/28.png)

![](/img_javaweb/29.png)

![](/img_javaweb/30.png)

![](/img_javaweb/31.png)

![](/img_javaweb/32.png)

![](/img_javaweb/33.png)

# 13. MyBatis (新技术 <u>MyBatis Plus</u>)



## ① 快速入门(连接数据库)

![](/img_javaweb/34.png)

![](/img_javaweb/35.png)

![](/img_javaweb/36.png)

![](/img_javaweb/37.png)

![](/img_javaweb/38.png)

![](/img_javaweb/39.png)

## ②JDBC介绍

![](/img_javaweb/40.png)

![](/img_javaweb/41.png)

## ③MyBatis  vs  JDBC

![](/img_javaweb/42.png)

![](/img_javaweb/43.png)

# 14. 数据库连接池
![](/img_javaweb/44.png)

![](/img_javaweb/45.png)

![](/img_javaweb/46.png)

# 15. lombok 工具包介绍

![](/img_javaweb/47.png)

# 16. MyBatis基础操作介绍

![](/img_javaweb/48.png)

![](/img_javaweb/49.png)

![](/img_javaweb/50.png)

![](/img_javaweb/51.png)

![](/img_javaweb/52.png)

![](/img_javaweb/53.png)

# 17.XML映射文件

![](/img_javaweb/54.png)

![](/img_javaweb/55.png)

# 18. 动态SQL语句

![](/img_javaweb/56.png)

![](/img_javaweb/57.png)

![](/img_javaweb/58.png)

![](/img_javaweb/59.png)

# 19. 开发规范

![](/img_javaweb/60.png)

![](/img_javaweb/61.png)

# 20. 分页插件 PageHelper

![](/img_javaweb/62.png)

![](/img_javaweb/63.png)

# 21. 文件上传

![](/img_javaweb/64.png)

![](/img_javaweb/65.png)

## ① 本地存储
![](/img_javaweb/66.png)

![](/img_javaweb/67.png)

![](/img_javaweb/68.png)

## ② 阿里云OSS(略)（没钱）
```
https://www.bilibili.com/video/BV1m84y1w7Tb?p=148
```
![](/img_javaweb/69.png)

# 22.配置文件

![](/img_javaweb/70.png)
![](/img_javaweb/71.png)
![](/img_javaweb/72.png)
![](/img_javaweb/73.png)
![](/img_javaweb/74.png)
![](/img_javaweb/75.png)
![](/img_javaweb/76.png)
![](/img_javaweb/77.png)
![](/img_javaweb/78.png)
![](/img_javaweb/79.png)
![](/img_javaweb/80.png)
![](/img_javaweb/81.png)
![](/img_javaweb/82.png)
![](/img_javaweb/83.png)
![](/img_javaweb/84.png)

# 23. 登录验证
![](/img_javaweb/85.png)
![](/img_javaweb/86.png)
![](/img_javaweb/87.png)
![](/img_javaweb/88.png)
![](/img_javaweb/89.png)

# 24.拦截过滤器
## ① filter
![](/img_javaweb/90.png)
## ② Interceptor
![](/img_javaweb/91.png)
![](/img_javaweb/92.png)
![](/img_javaweb/93.png)