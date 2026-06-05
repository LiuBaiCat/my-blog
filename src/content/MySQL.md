---
title: MySQL数据库
date: 2024-11-07
tags: [MySQL, 基础学习]
description: MySQL数据库的学习
pinned: false
---

# 01.数据库的启动与停止

启动

```cmd
net start mysql80
```

停止

```cmd
net stop mysql80
```

# 02.数据库的连接

## 客户端连接

```cmd
mysql [-h 127.0.0.1] [-P 3306] -u root -p
```

# 03.概述-数据模型

## 关系型数据库

![](/img_mysql/1.png)

## 数据模型

![](/img_mysql/2.png)

# 04.通用语法和分类


## SQL通用语法

1). SQL语句可以单行或多行书写，以分号结尾。

2). SQL语句可以使用空格/缩进来增强语句的可读性。

3). MySQL数据库的SQL语句不区分大小写，关键字建议使用大写。

4). 注释：

单行注释：-- 注释内容 或 # 注释内容

多行注释：/* 注释内容 */

## SQL分类(DDL、DML、DQL、DCL)

SQL语句，根据其功能，主要分为四类：DDL、DML、DQL、DCL。

| 分类 |            全称            |                          说明                          |
| :--- | :------------------------: | :----------------------------------------------------: |
| DDL  |  Data Definition Language  |   数据定义语言，用来定义数据库对象(数据库，表，字段)   |
| DML  | Data Manipulation Language |     数据操作语言，用来对数据库表中的数据进行增删改     |
| DQL  |    Data Query Language     |         数据查询语言，用来查询数据库中表的记录         |
| DCL  |   Data Control Language    | 数据控制语言，用来创建数据库用户、控制数据库的访问权限 |

## （一）、DDL

### ①DDL-数据库-操作

#### **1).** **查询所有数据库**--show databases 

```sql
SHOW DATABASES ; 
```

#### **2).** **查询当前数据库**--select database() 

```sql
SELECT DATABASE() ;
```

#### **3).** **创建数据库**--create database

​		create database [ if not exists ] 数据库名 [ default charset 字符集 ] [ collate 排序规则 ] ;

```sql
CREATE DATABASE [ IF NOT EXISTS ] 数据库名 [ DEFAULT CHARSET 字符集 ] [ COLLATE 排序规则 ]
```

#### **4).** **删除数据库**--drop database

​		drop database [ if exists ] 数据库名 ; 

​		如果删除一个不存在的数据库，将会报错。此时，可以加上参数 if exists ，如果数据库存在，再执行删除，否则不执行删除。

```sql
DROP DATABASE [ if EXISTS ] 数据库名 ;
```

#### **5).** **切换数据库**--use 数据库名

```sql
USE 数据库名;
```

### ②.DDL-表操作-查询

#### **1).** **查询当前数据库所有表**--show tables

```sql
SHOW TABLES;
```

#### **2).** **查看指定表结构**--desc

```sql
DESC 表名 ;
```

#### **3).** **查询指定表的建表语句**--show create table

```sql
SHOW CREATE TABLE 表名 ;
```

#### **4).** **创建表结构**

```sql
CREATE TABLE 表名(
字段1 字段1类型 [ COMMENT 字段1注释 ],
字段2 字段2类型 [COMMENT 字段2注释 ],
字段3 字段3类型 [COMMENT 字段3注释 ],
......
字段n 字段n类型 [COMMENT 字段n注释 ]
) [ COMMENT 表注释 ] ;
```

```cmd
注意: [...] 内为可选参数，最后一个字段后面没有逗号
```

### ③.DDL-表操作-数据类型

MySQL中的数据类型有很多，主要分为三类：数值类型、字符串类型、日期时间类型。

#### 1). 数值类型

![](/img_mysql/3.png)

```cmd
如:
1). 年龄字段 -- 不会出现负数, 而且人的年龄不会太大
age tinyint unsigned
2). 分数 -- 总分100分, 最多出现一位小数
score double(4,1)
```

#### 2). 字符串类型

![](/img_mysql/4.png)

```cmd
如：
1). 用户名 username ------> 长度不定, 最长不会超过50
username varchar(50)
2). 性别 gender ---------> 存储值, 不是男,就是女
gender char(1)
3). 手机号 phone --------> 固定长度为11
phone char(11)
```

#### 3). 日期时间类型

![](/img_mysql/5.png)

```cmd
如:
1). 生日字段 birthday
birthday date
2). 创建时间 createtime
createtime datetime
```

#### 案例

![](/img_mysql/6.png)

```sql
create table emp(
	id int comment '编号',
    workno varchar(10) comment '工号',
    name varchar(10) comment '姓名',
    gender varchar(1) comment '性别',
    age tinyint unsigned comment '年龄',
    idcard char(18) comment '身份证号',
    entrydate date comment '入职时间'
) comment '员工表';
```

### ④.DDL-表操作-修改(ALTER)

#### 1). 添加字段

```sql
ALTER TABLE 表名 ADD 字段名 类型 (长度) [ COMMENT 注释 ] [ 约束 ];
```

案例:

为emp表增加一个新的字段”昵称”为nickname，类型为varchar(20)

```sql
ALTER TABLE emp ADD nickname varchar(20) COMMENT '昵称';
```

#### 2). 修改数据类型

```sql
ALTER TABLE 表名 MODIFY 字段名 新数据类型 (长度);
```

#### 3). 修改字段名和字段类型

```sql
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型 (长度) [ COMMENT 注释 ] [ 约束 ];
```

案例:

将emp表的nickname字段修改为username，类型为varchar(30)

```sql
ALTER TABLE emp CHANGE nickname username varchar(30) COMMENT '昵称';
```

#### 4). 删除字段

```sql
ALTER TABLE 表名 DROP 字段名;
```

案例:

将emp表的字段username删除

```sql
ALTER TABLE emp DROP username;
```

#### 5). 修改表名

```sql
ALTER TABLE 表名 RENAME TO 新表名;
```

案例:

将emp表的表名修改为 employee

```sql
ALTER TABLE emp RENAME TO employee;
```

### ⑤.DDL-表操作-删除(DROP,TRUNCATE)

#### 1). 删除表

```sql
DROP TABLE [ IF EXISTS ] 表名;
```

案例:

如果tb_user表存在，则删除tb_user表

```sql
DROP TABLE IF EXISTS tb_user;
```

#### 2). 删除指定表, 并重新创建表

```sql
TRUNCATE TABLE 表名; 
```

### ⑥.DDL-总结

![](/img_mysql/7.png)

## （二）、DML

### ①DML-操作

数据操作语言，用来对数据库表中的数据进行增删改

|   操作   | 语法   |
| :------: | :----- |
| 添加数据 | INSERT |
| 修改数据 | UPDATE |
| 删除数据 | DELETE |

### ②.DML-添加数据(INSERT INTO)

#### **1).** **给指定字段添加数据**

```sql
INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...);
```

案例: 给employee表所有的字段添加数据 ；

```sql
INSERT INTO employee(id,workno,name,gender,age,idcard,entrydate)
VALUES(1,'1','Itcast','男',10,'123456789012345678','2000-01-01');
```

#### **2).** **给全部字段添加数据**

```sql
INSERT INTO 表名 VALUES (值1, 值2, ...);
```

案例：插入数据到employee表，具体的SQL如下：

```sql
insert into employee values(2,'2','张无忌','男',18,'123456789012345670','2005-01-01');
```

#### **3).** **批量添加数据**

```sql
INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...) ;
```

```sql
INSERT INTO 表名 VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...) ;
```

案例：批量插入数据到employee表，具体的SQL如下：

```sql
insert into employee values(3,'3','韦一笑','男',38,'123456789012345670','2005-01-01'),(4,'4','赵敏','女',18,'123456789012345670','2005-01-01');
```

> 注意事项:
>
> • 插入数据时，指定的字段顺序需要与值的顺序是一一对应的。
>
> • 字符串和日期型数据应该包含在引号中。
>
> • 插入的数据大小，应该在字段的规定范围内。

### ③.DML-修改数据(UPDATE)

修改数据的具体语法为:

```sql
UPDATE 表名 SET 字段名1 = 值1 , 字段名2 = 值2 , .... [ WHERE 条件 ] ;
```

> 注意事项:
>
> 修改语句的条件可以有，也可以没有，如果没有条件，则会修改整张表的所有数据。

### ④.DML-删除数据(DELETE)

```sql
DELETE FROM 表名 [ WHERE 条件 ] ;
```

> 注意事项:
>
> • DELETE 语句的条件可以有，也可以没有，如果没有条件，则会删除整张表的所有数据。
>
> • DELETE 语句不能删除某一个字段的值(可以使用UPDATE，将该字段值置为NULL即可)。
>
> • 当进行删除全部数据操作时，datagrip会提示我们，询问是否确认删除，我们直接点击Execute即可。

### ⑤.DML-总结

![](/img_mysql/8.png)

## （三）、DQL

### ①.DQL-基础查询(SELECT)

DQL英文全称是Data Query Language(数据查询语言)，数据查询语言，用来查询数据库中表的记录。

查询关键字: SELECT

DQL 查询语句，语法结构如下：

![](/img_mysql/9.png)

#### **1).** **查询多个字段**

```sql
SELECT 字段1, 字段2, 字段3 ... FROM 表名 ;
```

```sql
SELECT * FROM 表名 ;
```

> 注意 : * 号代表查询所有字段，在实际开发中尽量少用（不直观、影响效率）。

#### **2).** **字段设置别名**

```sql
SELECT 字段1 [ AS 别名1 ] , 字段2 [ AS 别名2 ] ... FROM 表名;
```

```sql
SELECT 字段1 [ 别名1 ] , 字段2 [ 别名2 ] ... FROM 表名;
```

#### **3).** **去除重复记录**

```sql
SELECT DISTINCT 字段列表 FROM 表名;
```

![](/img_mysql/10.png)

### ②.DQL-条件查询(where)

#### **1).** **语法**

```sql
SELECT 字段列表 FROM 表名 WHERE 条件列表 ;
```

#### **2).** **条件**

常用的比较运算符如下:

![](/img_mysql/11.png)

常用的逻辑运算符如下:

![](/img_mysql/12.png)

#### 3). 案例

查询有身份证号的员工信息

```sql
select * from emp where idcard is not null;
```

查询年龄不等于 88 的员工信息

```sql
select * from emp where age <> 88;
```

查询年龄在15岁(包含) 到 20岁(包含)之间的员工信息

```sql
select * from emp where age >= 15 and age <= 20;
select * from emp where age between 15 and 20;
```

查询年龄等于18 或 20 或 40 的员工信息

```sql
select * from emp where age = 18 or age = 20 or age =40;
select * from emp where age in(18,20,40);
```

 查询姓名为两个字的员工信息 _

```sql
select * from emp where name like '__';
```

查询身份证号最后一位是X的员工信息

```sql
select * from emp where idcard like '%X';
select * from emp where idcard like '_________________X';
```

### ③.DQL-聚合函数(count,max,min,avg,sum)

将一列数据作为一个整体，进行纵向计算 。

常见聚合函数

| 函数  | 功能     |
| ----- | -------- |
| count | 统计数量 |
| max   | 最大值   |
| min   | 最小值   |
| avg   | 平均值   |
| sum   | 求和     |

####  语法

```sql
SELECT 聚合函数(字段列表) FROM 表名 ;
```

> 注意 : NULL值是不参与所有聚合函数运算的。

#### 案例

统计该企业员工数量

```sql
select count(*) from emp; -- 统计的是总记录数
-- select count(1) from emp; 统计符合条件的总记录数
select count(idcard) from emp; -- 统计的是idcard字段不为null的记录数
```

### ④.DQL-分组查询(GROUP BY)

#### 1). 语法

```sql
SELECT 字段列表 FROM 表名 [ WHERE 条件 ] GROUP BY 分组字段名 [ HAVING 分组
后过滤条件 ];
```

#### 2). where与having区别

执行时机不同：where是分组之前进行过滤，不满足where条件，不参与分组；而having是分组之后对结果进行过滤。

判断条件不同：where不能对聚合函数进行判断，而having可以。

> 注意事项:
>
> • 分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义。
>
> • 执行顺序: where > 聚合函数 > having 。
>
> • 支持多字段分组, 具体语法为 : group by columnA,columnB

#### 案例:

A. 根据性别分组 , 统计男性员工 和 女性员工的数量

```sql
select gender, count(*) from emp group by gender ; 
```

B. 根据性别分组 , 统计男性员工 和 女性员工的平均年龄

```sql
select gender, avg(age) from emp group by gender ;
```

C. 查询年龄小于45的员工 , 并根据工作地址分组 , 获取员工数量大于等于3的工作地址

```sql
select workaddress, count(*) [as] address_count from emp where age < 45 group by
workaddress having address_count >= 3;
```

D. 统计各个工作地址上班的男性及女性员工的数量

```sql
select workaddress, gender, count(*) '数量' from emp group by gender , workaddress;
```

### ⑤.DQL-排序查询(ORDER BY)



#### 1). 语法

```sql
SELECT 字段列表 FROM 表名 ORDER BY 字段1 排序方式1 , 字段2 排序方式2 ;
```

#### 2). 排序方式

- ASC : 升序(默认值)
- DESC: 降序

> 注意事项：
>
> • 如果是升序, 可以不指定排序方式ASC ;
>
> • 如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序 ;

案例:

A. 根据年龄对公司的员工进行升序排序

```sql
select * from emp order by age asc;
select * from emp order by age;
```

B. 根据入职时间, 对员工进行降序排序

```sql
select * from emp order by entrydate desc;
```

C. 根据年龄对公司的员工进行升序排序 , 年龄相同 , 再按照入职时间进行降序排序

```sql
select * from emp order by age asc , entrydate desc;
```

### ⑥.DQL-分页查询(LIMIT)

#### 1). 语法

```sql
SELECT 字段列表 FROM 表名 LIMIT 起始索引, 查询记录数 ;
```

> 注意事项:
>
> • 起始索引从0开始，起始索引 = （查询页码 - 1）* 每页显示记录数。
>
> • 分页查询是数据库的方言，不同的数据库有不同的实现，MySQL中是LIMIT。
>
> • 如果查询的是第一页数据，起始索引可以省略，直接简写为 limit 10。

#### 案例![](/img_mysql/13.png)

![](/img_mysql/14.png)

### ⑦.DQL-执行顺序

#### 1). 编写顺序

![](/img_mysql/15.png)

#### 2). 执行顺序

![](/img_mysql/16.png)

### ⑧.DQL-总结

![](/img_mysql/17.png)

## （四）、 DCL

### ①.DCL--用户管理

DCL英文全称是**Data Control Language**(数据控制语言)，用来管理数据库用户、控制数据库的访问权限。

![](/img_mysql/18.png)

#### 1). 查询用户

```sql
select * from mysql.user;
-- use mysql;
-- select * from user;
```

![](/img_mysql/19.png)

其中 Host代表当前用户访问的主机, 如果为localhost, 仅代表只能够在当前本机访问，是不可以远程访问的。 User代表的是访问该数据库的用户名。在MySQL中需要通过Host和User来唯一标识一个用户。

#### 2). 创建用户

```sql
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码'; 
```

#### 3). 修改用户密码

```sql
ALTER USER '用户名'@'主机名' IDENTIFIED WITH mysql_native_password BY '新密码' ;
```

#### 4). 删除用户

```sql
DROP USER '用户名'@'主机名' ;
```

> 注意事项:
>
> • 在MySQL中需要通过用户名@主机名的方式，来唯一标识一个用户。
>
> • 主机名可以使用 % 通配。
>
> • 这类SQL开发人员操作的比较少，主要是DBA（ Database Administrator 数据库管理员）使用。

### ②.DCL-权限控制

![](/img_mysql/20.png)

官方文档：https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html

#### 1). 查询权限

```sql
SHOW GRANTS FOR '用户名'@'主机名' ;
```

#### 2). 授予权限

```sql
GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';
```

#### 3). 撤销权限

```sql
REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';
```

> 注意事项：
> • 多个权限之间，使用逗号分隔
> • 授权时， 数据库名和表名可以使用 * 进行通配，代表所有。

#### 案例

A. 查询 'heima'@'%' 用户的权限

```sql
show grants for 'heima'@'%';
```

B. 授予 'heima'@'%' 用户itcast数据库所有表的所有操作权限

```sql
grant all on itcast.* to 'heima'@'%';
```

C. 撤销 'heima'@'%' 用户的itcast数据库的所有权限

```sql
revoke all on itcast.* from 'heima'@'%';
```

### ③.DCL-小结

![](/img_mysql/21.png)

#  05.函数

## （一）、字符串函数

MySQL中内置了很多字符串函数，常用的几个如下：

![](/img_mysql/22.png)

演示如下：

### A. concat : 字符串拼接

```sql
select concat('Hello' , ' MySQL');
```

### B. lower : 全部转小写

```sql
select lower('Hello');
```

### C. upper : 全部转大写

```sql
select upper('Hello');
```
### D. lpad : 左填充

```sql
select lpad('01', 5, '-');
```
### E. rpad : 右填充

```sql
select rpad('01', 5, '-');
```
### F. trim : 去除空格

```sql
select trim(' Hello MySQL ');
```
### G. substring : 截取子字符串

```sql
select substring('Hello MySQL',1,5);
```

### 案例

```sql
-- 由于业务需求变更，企业员工的工号，统一为5位数，目前不足5位数的全部在前面补0。比如： 1号员工的工号应该为00001
update emp set workno = lpad(workno, 5, '0');
```

## （二）、数值函数

常见的数值函数如下：

![](/img_mysql/23.png)

### A. ceil：向上取整

```sql
select ceil(1.1); 
```

### B. floor：向下取整

```sql
select floor(1.9); 
```

### C. mod：取模

```sql
select mod(7,4);
```

### D. rand：获取随机数

```sql
select rand(); 
```

### E. round：四舍五入

```sql
select round(2.344,2); 
```

### 案例：

通过数据库的函数，生成一个六位数的随机验证码。

思路： 获取随机数可以通过rand()函数，但是获取出来的随机数是在0-1之间的，所以可以在其基础上乘以1000000，然后舍弃小数部分，如果长度不足6位，补0

```sql
select lpad(round(rand()*power(10,6),0),6,'0');
select substring(rand(),3,6);
```

## （三）、时间函数

常见的日期函数如下：

![](/img_mysql/24.png)

演示如下：

### A. curdate：当前日期

```sql
select curdate();
```
### B. curtime：当前时间
```sql
select curtime();
```
### C. now：当前日期和时间
```sql
select now();
```
### D. YEAR , MONTH , DAY：当前年、月、日
```sql
select YEAR(now());
select MONTH(now());
select DAY(now());
```
### E. date_add：增加指定的时间间隔
```sql
select date_add(now(), INTERVAL 70 YEAR );
```
### F. datediff：获取两个日期相差的天数
```sql
select datediff('2021-10-01', '2021-12-01');
```

案例：

查询所有员工的入职天数，并根据入职天数倒序排序。

思路： 入职天数，就是通过当前日期 - 入职日期，所以需要使用datediff函数来完成。

```sql
select name, datediff(curdate(), entrydate) as 'entrydays' from emp order by entrydays desc;
```

## （四）、流程函数

流程函数也是很常用的一类函数，可以在SQL语句中实现条件筛选，从而提高语句的效率。

![](/img_mysql/25.png)

演示如下：

### A. if
```sql
select if(false, 'Ok', 'Error');
```
### B. ifnull
```sql
select ifnull('Ok','Default');
-- ok
select ifnull('','Default');
-- ''
select ifnull(null,'Default');
-- null
```
### C. case when then else end
需求: 查询emp表的员工姓名和工作地址 (北京/上海 ----> 一线城市 , 其他 ----> 二线城市)
```sql
select
name,
( case workaddress when '北京' then '一线城市' when '上海' then '一线城市' else
'二线城市' end ) as '工作地址'
from emp;
```
```sql
select
       name,
        if(workaddress = '上海' || workaddress = '北京','一线城市','二线城市') 工作地址
        case workaddress when '北京' then '一线城市' when '上海' then '一线城市' else '二线城市' end  工作地址
        if(workaddress in ('上海','北京'),'一线城市','二线城市') 工作地址
from emp;
```

### 案例:

```sql
create table score(
	id 		int 		comment 'ID',
	name 	varchar(20) comment '姓名',
	math 	int 		comment '数学',
	english int 		comment '英语',
	chinese int 		comment '语文'
) comment '学员成绩表';
insert into score(id, name, math, english, chinese) VALUES (1, 'Tom', 67, 88, 95), (2, 'Rose' , 23, 66, 90),(3, 'Jack', 56, 98, 76);
```
具体的SQL语句如下:
```sql
select
	id,
	name,
	(case when math >= 85 then '优秀' when math >=60 then '及格' else '不及格' end )'数学',
	(case when english >= 85 then '优秀' when english >=60 then '及格' else '不及格'end ) '英语',
	(case when chinese >= 85 then '优秀' when chinese >=60 then '及格' else '不及格'end ) '语文'
from score;
```

或

```sql
select
       id,
       name,
       if(math >= 85,'优秀',if(math >= 60,'及格','不及格')) 数学,
       if(english >= 85,'优秀',if(english >= 60,'及格','不及格')) 英语,
       if(chinese >= 85,'优秀',if(chinese >= 60,'及格','不及格')) 语文
from score;
```

## （五）、函数小结

![](/img_mysql/26.png)

# 06.约束

## （一）、概念

约束是作用于表中字段上的规则，用于限制存储在表中的数据。

## （二）、目的

保证数据库中数据的正确、有效性和完整性。

## （三）、分类

![](/img_mysql/27.png)

> 注意：约束是作用于表中字段上的，可以在创建表/修改表的时候添加约束。

## （四）、约束演示

对应的建表语句为：

```sql
CREATE TABLE tb_user(

id int AUTO_INCREMENT PRIMARY KEY COMMENT 'ID唯一标识',

name varchar(10) NOT NULL UNIQUE COMMENT '姓名' ,

age int check (age > 0 && age <= 120) COMMENT '年龄' ,

status char(1) default '1' COMMENT '状态',

gender char(1) COMMENT '性别'

);
```

在为字段添加约束时，我们只需要在字段之后加上约束的关键字即可，需要关注其语法。我们执行上面的SQL把表结构创建完成，然后接下来，就可以通过一组数据进行测试，从而验证一下，约束是否可以生效。

```sql
insert into tb_user(name,age,status,gender) values ('Tom1',19,'1','男'),
('Tom2',25,'0','男');  													-- ok
insert into tb_user(name,age,status,gender) values ('Tom3',19,'1','男'); -- ok
insert into tb_user(name,age,status,gender) values (null,19,'1','男'); -- X (但占了id=4的位置)
insert into tb_user(name,age,status,gender) values ('Tom3',19,'1','男'); -- ok
insert into tb_user(name,age,status,gender) values ('Tom4',80,'1','男'); -- ok
insert into tb_user(name,age,status,gender) values ('Tom5',-1,'1','男'); -- X
insert into tb_user(name,age,status,gender) values ('Tom5',121,'1','男'); -- X
insert into tb_user(name,age,gender) values ('Tom5',120,'男');			 -- ok
```

## （五）、外键约束

### ①概念

外键：用来让两张表的数据之间建立连接，从而保证数据的一致性和完整性。

![](/img_mysql/28.png)

左侧的emp表是员工表，里面存储员工的基本信息，包含员工的ID、姓名、年龄、职位、薪资、入职日期、上级主管ID、部门ID，在员工的信息中存储的是部门的ID dept_id，而这个部门的ID是关联的部门表dept的主键id，那emp表的dept_id就是外键,关联的是另一张表的主键。

> 注意：目前上述两张表，只是在逻辑上存在这样一层关系；在数据库层面，并未建立外键关联，所以是无法保证数据的一致性和完整性的。

没有数据库外键关联的情况下，能够保证一致性和完整性呢，我们来测试一下。

准备数据

```sql
create table dept(
	id int auto_increment comment 'ID' primary key,
	name varchar(50) not null comment '部门名称'
)comment '部门表';
INSERT INTO dept (id, name) VALUES (1, '研发部'), (2, '市场部'),(3, '财务部'), (4,'销售部'), (5, '总经办');
create table emp(
	id int auto_increment comment 'ID' primary key,
	name varchar(50) not null comment '姓名',
	age int comment '年龄',
	job varchar(20) comment '职位',
	salary int comment '薪资',
	entrydate date comment '入职时间',
	managerid int comment '直属领导ID',
	dept_id int comment '部门ID'
)comment '员工表';
INSERT INTO emp (id, name, age, job,salary, entrydate, managerid, dept_id)
VALUES
(1, '金庸', 66, '总裁',20000, '2000-01-01', null,5),(2, '张无忌', 20,'项目经理',12500, '2005-12-05', 1,1),(3, '杨逍', 33, '开发', 8400,'2000-11-03', 2,1),(4, '韦一笑', 48, '开发',11000, '2002-02-05', 2,1),(5, '常遇春', 43, '开发',10500, '2004-09-07', 3,1),(6, '小昭', 19, '程序员鼓励师',6600, '2004-10-12', 2,1);
```

### ② 添加外键的语法

```sql
CREATE TABLE 表名(
字段名 数据类型,
...
[CONSTRAINT] [外键名称] FOREIGN KEY (外键字段名) REFERENCES 主表 (主表列名)
);
```

```sql
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段名) REFERENCES 主表 (主表列名) ;
```

#### 案例:

为emp表的dept_id字段添加外键约束,关联dept表的主键id。

```sql
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id);
```

### ③ 删除外键

```sql
ALTER TABLE 表名 DROP FOREIGN KEY 外键名称;
```

#### 案例：

删除emp表的外键fk_emp_dept_id。

```sql
alter table emp drop foreign key fk_emp_dept_id;
```

### ④外键-删除/更新行为

添加了外键之后，再删除父表数据时产生的约束行为，我们就称为删除/更新行为。具体的删除/更新行为有以下几种:

![](/img_mysql/29.png)

具体语法为:

```sql
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段) REFERENCES 主表名 (主表字段名) ON UPDATE CASCADE ON DELETE CASCADE;
```

演示如下：

由于NO ACTION 是默认行为，我们前面语法演示的时候，已经测试过了，就不再演示了，这里我们再演示其他的两种行为：CASCADE、SET NULL。

#### 1). CASCADE

```sql
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id) on update cascade on delete cascade ;
```

![](/img_mysql/30.png)

#### 2). SET NULL

```sql
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id) on update set null on delete set null ;
```

![](/img_mysql/31.png)

## （六）、约束小结

![](/img_mysql/32.png)

# 07.多表查询

我们之前在讲解SQL语句的时候，讲解了DQL语句，也就是数据查询语句，但是之前讲解的查询都是单表查询，而本章节我们要学习的则是多表查询操作，主要从以下几个方面进行讲解。

## （一）、**多表关系**

项目开发中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构，由于业务之间相互关联，所以各个表结构之间也存在着各种联系，基本上分为三种：

- 一对多(多对一)
- 多对多
- 一对一

### ①**一对多**

- 案例: 部门 与 员工的关系
- 关系: 一个部门对应多个员工，一个员工对应一个部门
- 实现: 在多的一方建立外键，指向一的一方的主键

![](/img_mysql/33.png)

### ②**多对多**

- 案例: 学生 与 课程的关系
- 关系: 一个学生可以选修多门课程，一门课程也可以供多个学生选择
- 实现: 建立第三张中间表，中间表至少包含两个外键，分别关联两方主键

![](/img_mysql/34.png)

对应的SQL脚本:

```sql
create table student(
	id int auto_increment primary key comment '主键ID',
	name varchar(10) comment '姓名',
	no varchar(10) comment '学号'
) comment '学生表';
insert into student values (null, '黛绮丝', '2000100101'),(null, '谢逊','2000100102'),(null, '殷天正', '2000100103'),(null, '韦一笑', '2000100104');

create table course(
	id int auto_increment primary key comment '主键ID',
	name varchar(10) comment '课程名称'
) comment '课程表';
insert into course values (null, 'Java'), (null, 'PHP'), (null , 'MySQL') ,(null, 'Hadoop');

create table student_course(
    id int auto_increment comment '主键' primary key,
	studentid int not null comment '学生ID',
	courseid int not null comment '课程ID',
	constraint fk_courseid foreign key (courseid) references course (id),
	constraint fk_studentid foreign key (studentid) references student (id)
)comment '学生课程中间表';

insert into student_course values (null,1,1),(null,1,2),(null,1,3),(null,2,2),(null,2,3),(null,3,4);
```

### ③**一对一**

- 案例: 用户 与 用户详情的关系
- 关系: 一对一关系，多用于单表拆分，将一张表的基础字段放在一张表中，其他详情字段放在另一张表中，以提升操作效率

  <div style="color=red;">- 实现: 在任意一方加入外键，关联另外一方的主键，并且设置外键为唯一的(UNIQUE)</div>

![](/img_mysql/35.png)

对应的SQL脚本:

```sql
create table tb_user(
	id int auto_increment primary key comment '主键ID',
	name varchar(10) comment '姓名',
	age int comment '年龄',
	gender char(1) comment '1: 男 , 2: 女',
	phone char(11) comment '手机号'
) comment '用户基本信息表';

create table tb_user_edu(
	id int auto_increment primary key comment '主键ID',
	degree varchar(20) comment '学历',
	major varchar(50) comment '专业',
	primaryschool varchar(50) comment '小学',
	middleschool varchar(50) comment '中学',
    university varchar(50) comment '大学',
	userid int unique comment '用户ID',
	constraint fk_userid foreign key (userid) references tb_user(id)
) comment '用户教育信息表';


insert into tb_user(id, name, age, gender, phone) values
	(null,'黄渤',45,'1','18800001111'),
	(null,'冰冰',35,'2','18800002222'),
	(null,'码云',55,'1','18800008888'),
	(null,'李彦宏',50,'1','18800009999');
	
insert into tb_user_edu(id, degree, major, primaryschool, middleschool,university, userid) values
	(null,'本科','舞蹈','静安区第一小学','静安区第一中学','北京舞蹈学院',1),
	(null,'硕士','表演','朝阳区第一小学','朝阳区第一中学','北京电影学院',2),
	(null,'本科','英语','杭州市第一小学','杭州市第一中学','杭州师范大学',3),
	(null,'本科','应用数学','阳泉第一小学','阳泉区第一中学','清华大学',4);
```

## （二）、**多表查询概述**

### ①**数据准备**

#### 1). 删除之前 emp, dept表的测试数据

#### 2). 执行如下脚本，创建emp表与dept表并插入测试数据

```sql
-- 创建dept表，并插入数据
create table dept(
	id int auto_increment comment 'ID' primary key,
	name varchar(50) not null comment '部门名称'
)comment '部门表';
INSERT INTO dept (id, name) VALUES (1, '研发部'), (2, '市场部'),(3, '财务部'), (4,'销售部'), (5, '总经办'), (6, '人事部');

-- 创建emp表，并插入数据
create table emp(
	id int auto_increment comment 'ID' primary key,
    name varchar(50) not null comment '姓名',
    age int comment '年龄',
    job varchar(20) comment '职位',
    salary int comment '薪资',
    entrydate date comment '入职时间',
    managerid int comment '直属领导ID',
    dept_id int comment '部门ID'
)comment '员工表';

-- 添加外键
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id);
INSERT INTO emp (id, name, age, job,salary, entrydate, managerid, dept_id)
VALUES
(1, '金庸', 66, '总裁',20000, '2000-01-01', null,5),
(2, '张无忌', 20, '项目经理',12500, '2005-12-05', 1,1),
(3, '杨逍', 33, '开发', 8400,'2000-11-03', 2,1),
(4, '韦一笑', 48, '开发',11000, '2002-02-05', 2,1),
(5, '常遇春', 43, '开发',10500, '2004-09-07', 3,1),
(6, '小昭', 19, '程序员鼓励师',6600, '2004-10-12', 2,1),
(7, '灭绝', 60, '财务总监',8500, '2002-09-12', 1,3),
(8, '周芷若', 19, '会计',4800, '2006-06-02', 7,3),
(9, '丁敏君', 23, '出纳',5250, '2009-05-13', 7,3),
(10, '赵敏', 20, '市场部总监',12500, '2004-10-12', 1,2),
(11, '鹿杖客', 56, '职员',3750, '2006-10-03', 10,2),
(12, '鹤笔翁', 19, '职员',3750, '2007-05-09', 10,2),
(13, '方东白', 19, '职员',5500, '2009-02-12', 10,2),
(14, '张三丰', 88, '销售总监',14000, '2004-10-12', 1,4),
(15, '俞莲舟', 38, '销售',4600, '2004-10-12', 14,4),
(16, '宋远桥', 40, '销售',4600, '2004-10-12', 14,4),
(17, '陈友谅', 42, null,2000, '2011-10-12', 1,null);
```

### ②**概述**(笛卡尔积)

多表查询就是指从多张表中查询数据。

原来查询单表数据，执行的SQL形式为：select * from emp;

那么我们要执行多表查询，就只需要使用逗号分隔多张表即可，如： select * from emp , dept; 

此时,我们看到查询结果中包含了大量的结果集，总共102条记录，而这其实就是员工表emp所有的记录(17) 与 部门表dept所有记录(6) 的所有组合情况，这种现象称之为笛卡尔积。接下来，就来简单介绍下笛卡尔积。

笛卡尔积: 笛卡尔乘积是指在数学中，两个集合A集合 和 B集合的所有组合情况。

而在多表查询中，我们是需要消除无效的笛卡尔积的，只保留两张表关联部分的数据。

在SQL语句中，如何来去除无效的笛卡尔积呢？ 我们可以给多表查询加上连接查询的条件即可。

```sql
select * from emp , dept where emp.dept_id = dept.id;
```

### ③分类



#### 1). 连接查询

- A. **内连接**：相当于查询A、B交集部分数据

- B. **外连接**：

  ​	左外连接：查询左表所有数据，以及两张表交集部分数据

  ​	右外连接：查询右表所有数据，以及两张表交集部分数据

- C. **自连接**：当前表与自身的连接查询，自连接必须使用表别名

#### 2). 子查询

![](/img_mysql/36.png)

## （三）、多表查询——连接查询

### ①内连接

内连接查询的是两张表交集部分的数据。(也就是绿色部分的数据)

#### 	1). 隐式内连接

```sql
SELECT 字段列表 FROM 表1 , 表2 WHERE 条件 ... ;
```

​		案例:		查询每一个员工的姓名 , 及关联的部门的名称	

```sql
select e.name,d.name from emp e , dept d where e.dept_id = d.id;
```

#### 	2). 显式内连接

```sql
SELECT 字段列表 FROM 表1 [ INNER ] JOIN 表2 ON 连接条件 ... ;
```

​		案例:		查询每一个员工的姓名 , 及关联的部门的名称	

```sql
select e.name, d.name from emp e [inner] join dept d on e.dept_id = d.id;
```

> 注意事项:
>
> 一旦为表起了别名，就不能再使用表名来指定对应的字段了，此时只能够使用别名来指定字段。

### ②外连接

#### 1).左外连接

```sql
SELECT 字段列表 FROM 表1 LEFT [ OUTER ] JOIN 表2 ON 条件 ... ;
```

​		左外连接相当于查询表1(左表)的所有数据，当然也包含表1和表2交集部分的数据。

##### 案例

A. 查询**emp**表的所有数据, 和对应的部门信息

 由于需求中提到，要查询emp的所有数据，所以是不能内连接查询的，需要考虑使用外连接查询。

 表结构: emp, dept

 连接条件: emp.dept_id = dept.id

```sql
select e.*, d.name from emp e left [outer] join dept d on e.dept_id = d.id;
```

#### 2). 右外连接

```sql
SELECT 字段列表 FROM 表1 RIGHT [ OUTER ] JOIN 表2 ON 条件 ... ;
```

​		右外连接相当于查询表2(右表)的所有数据，当然也包含表1和表2交集部分的数据。

##### 案例

B. 查询**dept**表的所有数据, 和对应的员工信息(右外连接)

由于需求中提到，要查询dept表的所有数据，所以是不能内连接查询的，需要考虑使用外连接查询。

 表结构: emp, dept

 连接条件: emp.dept_id = dept.id

```sql
select d.*, e.* from emp e right outer join dept d on e.dept_id = d.id;

select d.*, e.* from dept d left outer join emp e on e.dept_id = d.id;
```

> 注意事项：
>
> 左外连接和右外连接是可以相互替换的，只需要调整在连接查询时SQL中，表结构的先后顺序就可以了。而我们在日常开发使用时，更偏向于左外连接。

### ③自连接

自连接查询，顾名思义，就是自己连接自己，也就是把一张表连接查询多次。我们先来学习一下自连接的查询语法：

```sql
SELECT 字段列表 FROM 表A 别名A JOIN 表A 别名B ON 条件 ... ;
```

而对于自连接查询，可以是内连接查询，也可以是外连接查询。

#### 案例：

A. 查询员工 及其 所属领导的名字

 表结构: emp

```sql
select a.name , b.name from emp a , emp b where a.managerid = b.id;

select a.name , b.name from emp a join emp b on a.managerid = b.id;
```

B. 查询所有员工 emp 及其领导的名字 emp , 如果员工没有领导, 也需要查询出来

 表结构: emp a , emp b

```sql
select a.name '员工', b.name '领导' from emp a left join emp b on a.managerid = b.id;
```

> 注意事项:
>
> 在自连接查询中，必须要为表起别名，要不然我们不清楚所指定的条件、返回的字段，到底是哪一张表的字段。

### ④联合查询- union，union all

对于union查询，就是把多次查询的结果并起来，形成一个新的查询集。

```sql
SELECT 字段列表 FROM 表A ...
UNION [ ALL ]
SELECT 字段列表 FROM 表B ....;
```

- 对于联合查询的多张表的列数必须保持一致，字段类型也需要保持一致。
- union all 会将全部的数据直接合并在一起，union 会对合并之后的数据去重。

#### 案例:

A. 将薪资低于 5000 的员工 , 和 年龄大于 50 岁的员工全部查询出来.

当前对于这个需求，我们可以直接使用多条件查询，使用逻辑运算符 or 连接即可。 那这里呢，我们也可以通过union/union all来联合查询.

```sql
select * from emp where salary < 5000
union [all]
select * from emp where age > 50;
```

union all查询出来的结果，仅仅进行简单的合并，并未去重。

union 联合查询，会对查询出来的结果进行去重处理。

![](/img_mysql/37.png)

## （四）、多表查询——子查询

### ①. 概念

SQL语句中嵌套SELECT语句，称为嵌套查询，又称子查询。

```sql
SELECT * FROM t1 WHERE column1 = ( SELECT column1 FROM t2 );
```

子查询外部的语句可以是INSERT / UPDATE / DELETE / SELECT 的任何一个。

### ②. 分类

### **1).  根据子查询结果不同，分为**：

#### <u>A. 标量子查询（子查询结果为单个值）</u>

子查询返回的结果是单个值（数字、字符串、日期等），最简单的形式，这种子查询称为标量子查询。

> 常用的操作符：=		<>		>		>=		<		<= 

案例:

1. 查询 "销售部" 的所有员工信息

完成这个需求时，我们可以将需求分解为两步：

①. 查询 "销售部" 部门ID

```sql
select id from dept where name = '销售部';
```

②. 根据 "销售部" 部门ID, 查询员工信息

```sql
select * from emp where dept_id = (select id from dept where name = '销售部');
```

2. 查询在 "方东白" 入职之后的员工信息

完成这个需求时，我们可以将需求分解为两步：

①. 查询 方东白 的入职日期

```sql
select entrydate from emp where name = '方东白';
```

②. 查询指定入职日期之后入职的员工信息

```sql
select * from emp where entrydate > (select entrydate from emp where name = '方东白');
```

#### <u>B. 列子查询(子查询结果为一列)</u>

子查询返回的结果是一列（可以是多行），这种子查询称为列子查询。

常用的操作符：IN 、NOT IN 、 ANY 、SOME 、 ALL

![](/img_mysql/38.png)

案例:
A.查询"销售部”和"市场部”的所有员工信息

分解为以下两步:

①.查询"销售部”和"市场部”的部门ID

```sql
select id from dept where name = '销售部' or name = '市场部';
```

根据部门ID，查询员工信息

```sql
select * from emp where dept_id in (select id from dept where name = '销售部' or name = '市场部');
```

B. 查询比 财务部 所有人工资都高的员工信息

分解为以下两步:

①. 查询所有 财务部 人员工资

```sql
select id from dept where name = '财务部';

select salary from emp where dept_id = (select id from dept where name = '财务部');
```

②. 比 财务部 所有人工资都高的员工信息

```sql
select * from emp where salary > all ( select salary from emp where dept_id = (select id from dept where name = '财务部') );
```

#### <u>C. 行子查询(子查询结果为一行)</u>

子查询返回的结果是一行（可以是多列），这种子查询称为行子查询。

常用的操作符：= 、<> 、IN 、NOT IN

案例:

A. 查询与 "张无忌" 的薪资及直属领导相同的员工信息 ;

这个需求同样可以拆解为两步进行:

①. 查询 "张无忌" 的薪资及直属领导

```sql
select salary, managerid from emp where name = '张无忌';
```

②. 查询与 "张无忌" 的薪资及直属领导相同的员工信息 ;

```sql
select * from emp where (salary,managerid) = (select salary, managerid from emp where name = '张无忌');
```

#### <u>D. 表子查询(子查询结果为多行多列)</u>

子查询返回的结果是多行多列，这种子查询称为表子查询。

常用的操作符：IN

案例:

A. 查询与 "鹿杖客" , "宋远桥" 的职位和薪资相同的员工信息

分解为两步执行:

①. 查询 "鹿杖客" , "宋远桥" 的职位和薪资

```sql
select job, salary from emp where name = '鹿杖客' or name = '宋远桥';
```

②. 查询与 "鹿杖客" , "宋远桥" 的职位和薪资相同的员工信息

```sql
select * from emp where (job,salary) in ( select job, salary from emp where name = '鹿杖客' or name = '宋远桥' );
```

B. 查询入职日期是 "2006-01-01" 之后的员工信息 , 及其部门信息

分解为两步执行:

①. 入职日期是 "2006-01-01" 之后的员工信息

```sql
select * from emp where entrydate > '2006-01-01';
```

②. 查询这部分员工, 对应的部门信息;

```sql
select e.*, d.* from (select * from emp where entrydate > '2006-01-01') e left join dept d on e.dept_id = d.id ;
```

### **2).  根据子查询位置，分为：**

#### <u>A. WHERE之后</u>

#### <u>B. FROM之后</u>

#### <u>C. SELECT之后</u>

## （五）、多表查询总结

# 08.事务查询

## （一）、**事务操作**

![](/img_mysql/40.png)

数据准备：

```sql
drop table if exists account;
create table account(
id int primary key AUTO_INCREMENT comment 'ID',
name varchar(10) comment '姓名',
money double(10,2) comment '余额'
) comment '账户表';
insert into account(name, money) VALUES ('张三',2000), ('李四',2000);
```

## （二）、**控制事务**

### ①设置为手动提交

```sql
-- ---------------
update account set money = 2000 where name in ('张三','李四');
-- ---------------
select * from account where name = '张三';
update account set money = money - 1000 where name = '张三';
-- 程序抛出异常...
update account set money = money + 1000 where name = '李四';
commit ;
-- -----设置为手动提交------
select @@autocommit;
set @@autocommit = 0;
-- -----提交事件------
commit;
-- ------回滚事件-------
rollback;
```

### ②start transaction

```sql
start transaction ;
-- 或 BEGIN

select * from account where name = '张三';
update account set money = money - 1000 where name = '张三';
# 程序抛出异常...
update account set money = money + 1000 where name = '李四';

commit ;

rollback ;
```

## （三）、**事务四大特性**

- 原子性（Atomicity）：事务是不可分割的最小操作单元，要么全部成功，要么全部失败。
- 一致性（Consistency）：事务完成时，必须使所有的数据都保持一致状态。
- 隔离性（Isolation）：数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行。
- 持久性（Durability）：事务一旦提交或回滚，它对数据库中的数据的改变就是永久的。

上述就是事务的四大特性，简称ACID。

## （四）、**并发事务问题**

### ①. 赃读：

一个事务读到另外一个事务还没有提交的数据。

![](/img_mysql/41.png)

比如B读取到了A未提交的数据。

### ②不可重复读：

一个事务先后读取同一条记录，但两次读取的数据不同，称之为不可重复读。

![](/img_mysql/42.png)

事务A两次读取同一条记录，但是读取到的数据却是不一样的。

### ③ 幻读：

一个事务按照条件查询数据时，没有对应的数据行，但是在插入数据时，又发现这行数据已经存在，好像出现了 "幻影"。

![](/img_mysql/43.png)

## （五）、**事务隔离级别**

为了解决并发事务所引发的问题，在数据库中引入了事务隔离级别。主要有以下几种：

![](/img_mysql/44.png)

### ①. 查看事务隔离级别

```sql
SELECT @@TRANSACTION_ISOLATION;
```

### ②. 设置事务隔离级别

```sql
SET [ SESSION | GLOBAL ] TRANSACTION ISOLATION LEVEL { READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE }
```

> 注意：事务隔离级别越高，数据越安全，但是性能越低。

## （六）、**事务小结**

![](/img_mysql/45.png)

# 09.索引
![](/img_mysql/46.png)

- 介绍
- 结构
- 语法

## （一）、**索引介绍**
### ①、有无索引的区别
![](/img_mysql/47.png)
### ②、优缺点
![](/img_mysql/48.png)

## （二）、**索引结构**
### ①、普通结构
![](/img_mysql/49.png)
### ②、B+树（多路平衡搜索树）
所有的数据都只在叶子节点中保存，且所有的Key也都会在叶子节点中出现，非叶子节点只是为了检索数据
![](/img_mysql/50.png)

## （三）、**语法**
![](/img_mysql/51.png)
> 注意事项：
>
> - 主键字段，在建表时，回自动创建主键索引
> - 添加唯一约束时，数据库实际上会添加唯一索引

![](/img_mysql/52.png)
## （四）、**小结**
![](/img_mysql/53.png)