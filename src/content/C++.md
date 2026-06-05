---
title: C++部分基础的学习
date: 2024-12-07
tags: [C++, 基础学习]
description: C++部分基础的学习
pinned: false
---
# C++部分基础的学习

## 00.输出

| 操作符 | 含义         |
| ------ | ------------ |
| dec    | 十进制输出   |
| hex    | 十六进制输出 |
| oct    | 八进制输出   |
| endl   | 输出换行符   |



## 01.数据类型

| 类型     | 关键字  |
| :------- | :------ |
| 布尔型   | bool    |
| 字符型   | char    |
| 整型     | int     |
| 浮点型   | float   |
| 双浮点型 | double  |
| 无类型   | void    |
| 宽字符型 | wchar_t |

其实 wchar_t 是这样来的：

```
typedef short int wchar_t;
```

所以 wchar_t 实际上的空间是和 short int 一样。

一些基本类型可以使用一个或多个类型修饰符进行修饰：

- signed
- unsigned
- short
- long

| 类型               |      位       |                             范围                             |
| :----------------- | :-----------: | :----------------------------------------------------------: |
| char               |   1 个字节    |                  -128 到 127 或者 0 到 255                   |
| unsigned char      |   1 个字节    |                           0 到 255                           |
| signed char        |   1 个字节    |                         -128 到 127                          |
| int                |   4 个字节    |                  -2147483648 到 2147483647                   |
| unsigned int       |   4 个字节    |                       0 到 4294967295                        |
| signed int         |   4 个字节    |                  -2147483648 到 2147483647                   |
| short int          |   2 个字节    |                       -32768 到 32767                        |
| unsigned short int |   2 个字节    |                         0 到 65,535                          |
| signed short int   |   2 个字节    |                       -32768 到 32767                        |
| long int           |   8 个字节    |   -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807    |
| signed long int    |   8 个字节    |   -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807    |
| unsigned long int  |   8 个字节    |               0 到 18,446,744,073,709,551,615                |
| float              |   4 个字节    | 精度型占4个字节（32位）内存空间，+/- 3.4e +/- 38 (~7 个数字) |
| double             |   8 个字节    | 双精度型占8 个字节（64位）内存空间，+/- 1.7e +/- 308 (~15 个数字) |
| long long          |   8 个字节    | 双精度型占8 个字节（64位）内存空间，表示 -9,223,372,036,854,775,807 到 9,223,372,036,854,775,807 的范围 |
| long double        |   16 个字节   | 长双精度型 16 个字节（128位）内存空间，可提供18-19位有效数字。 |
| wchar_t            | 2 或 4 个字节 |                           1 个宽字                           |

### typedef 声明

您可以使用 **typedef** 为一个已有的类型取一个新的名字。下面是使用 typedef 定义一个新类型的语法：

```
typedef type newname; 
```

例如，下面的语句会告诉编译器，feet 是 int 的另一个名称：

```
typedef int feet;
```

现在，下面的声明是完全合法的，它创建了一个整型变量 distance：

```
feet distance;
```

### 枚举类型

枚举类型(enumeration)是C++中的一种派生数据类型，它是由用户定义的若干枚举常量的集合。

如果一个变量只有几种可能的值，可以定义为枚举(enumeration)类型。所谓"枚举"是指将变量的值一一列举出来，变量的值只能在列举出来的值的范围内。

创建枚举，需要使用关键字 **enum**。枚举类型的一般形式为：

```
enum 枚举名{ 
     标识符[=整型常数], 
     标识符[=整型常数], 
... 
    标识符[=整型常数]
} 枚举变量;
    
```

如果枚举没有初始化, 即省掉"=整型常数"时, 则从第一个标识符开始。

例如，下面的代码定义了一个颜色枚举，变量 c 的类型为 color。最后，c 被赋值为 "blue"。

```
enum color { red, green, blue } c;
c = blue;
```

默认情况下，第一个名称的值为 0，第二个名称的值为 1，第三个名称的值为 2，以此类推。但是，您也可以给名称赋予一个特殊的值，只需要添加一个初始值即可。例如，在下面的枚举中，**green** 的值为 5。

```
enum color { red, green=5, blue };
```

在这里，**blue** 的值为 6，因为默认情况下，每个名称都会比它前面一个名称大 1，但 red 的值依然为 0。

### 类型转换

类型转换是将一个数据类型的值转换为另一种数据类型的值。

C++ 中有四种类型转换：静态转换、动态转换、常量转换和重新解释转换。

#### 静态转换（Static Cast）

静态转换是将一种数据类型的值强制转换为另一种数据类型的值。

静态转换通常用于比较类型相似的对象之间的转换，例如将 int 类型转换为 float 类型。

静态转换不进行任何运行时类型检查，因此可能会导致运行时错误。

#### 实例

```c++
int i = 10; 
float f = static_cast<float>(i); 
// 静态将int类型转换为float类型
```



#### 动态转换（Dynamic Cast）

动态转换通常用于将一个基类指针或引用转换为派生类指针或引用。动态转换在运行时进行类型检查，如果不能进行转换则返回空指针或引发异常。

#### 实例

```c++
class Base {}; 
class Derived : public Base {}; 
Base* ptr_base = new Derived; 
Derived* ptr_derived = dynamic_cast<Derived*>(ptr_base); 
// 将基类指针转换为派生类指针
```

#### 常量转换（Const Cast）

常量转换用于将 const 类型的对象转换为非 const 类型的对象。

常量转换只能用于转换掉 const 属性，不能改变对象的类型。

#### 实例

```c++
const int i = 10;
int& r = const_cast<int&>(i); // 常量转换，将const int转换为int
```



#### 重新解释转换（Reinterpret Cast）

重新解释转换将一个数据类型的值重新解释为另一个数据类型的值，通常用于在不同的数据类型之间进行转换。

重新解释转换不进行任何类型检查，因此可能会导致未定义的行为。

#### 实例

```c++
int i = 10; 
float f = reinterpret_cast<float&>(i); 
// 重新解释将int类型转换为float类型
```

## 02.变量类型

### 1.整数类型（Integer Types）：

- `int`：用于表示整数，通常占用4个字节。
- `short`：用于表示短整数，通常占用2个字节。
- `long`：用于表示长整数，通常占用4个字节。
- `long long`：用于表示更长的整数，通常占用8个字节。

### 2.浮点类型（Floating-Point Types）：

- `float`：用于表示单精度浮点数，通常占用4个字节。
- `double`：用于表示双精度浮点数，通常占用8个字节。
- `long double`：用于表示更高精度的浮点数，占用字节数可以根据实现而变化。

### 3.字符类型（Character Types）：

- `char`：用于表示字符，通常占用1个字节。
- `wchar_t`：用于表示宽字符，通常占用2或4个字节。
- `char16_t`：用于表示16位Unicode字符，占用2个字节。
- `char32_t`：用于表示32位Unicode字符，占用4个字节。

### 4.布尔类型（Boolean Type）：

- `bool`：用于表示布尔值，只能取`true`或`false`。

### 5.枚举类型（Enumeration Types）：

- `enum`：用于定义一组命名的整数常量。

### 6.指针类型（Pointer Types）：

- `type*`：用于表示指向类型为`type`的对象的指针。

### 7.数组类型（Array Types）：

- `type[]`或`type[size]`：用于表示具有相同类型的元素组成的数组。

### 8.结构体类型（Structure Types）：

- `struct`：用于定义包含多个不同类型成员的结构。

### 9.类类型（Class Types）：

- `class`：用于定义具有属性和方法的自定义类型。

### 10.共用体类型（Union Types）：

- `union`：用于定义一种特殊的数据类型，它可以在相同的内存位置存储不同的数据类型。

## 03.C++ 常量

### 字符常量

| 转义序列   | 含义                       |
| :--------- | :------------------------- |
| \\         | \ 字符                     |
| \'         | ' 字符                     |
| \"         | " 字符                     |
| \?         | ? 字符                     |
| \a         | 警报铃声                   |
| \b         | 退格键                     |
| \f         | 换页符                     |
| \n         | 换行符                     |
| \r         | 回车                       |
| \t         | 水平制表符                 |
| \v         | 垂直制表符                 |
| \ooo       | 一到三位的八进制数         |
| \xhh . . . | 一个或多个数字的十六进制数 |

### 字符串常量

字符串字面值或常量是括在双引号 "" 中的。一个字符串包含类似于字符常量的字符：普通的字符、转义序列和通用的字符。

您可以使用 \ 做分隔符，把一个很长的字符串常量进行分行。

下面的实例显示了一些字符串常量：

```c++
#include <iostream>
#include <string>
using namespace std;

int main() {
    string greeting = "hello, runoob";
    cout << greeting;
    cout << "\n";     // 换行符
    string greeting2 = "hello, \
                       runoob";
    cout << greeting2;
    return 0;
}
```

```cmd
hello, runoob
hello, runoob
```

### 定义常量

在 C++ 中，有两种简单的定义常量的方式：

- 使用 **#define** 预处理器。
- 使用 **const** 关键字。

## #define 预处理器

下面是使用 #define 预处理器定义常量的形式：

```c++
#define identifier value
```

```c++
#define PI 3.14
#define NEWLINE '\n'
```

## const 关键字

您可以使用 **const** 前缀声明指定类型的常量，如下所示：

```c++
const type variable = value;
```

```c++
const int  LENGTH = 10;
const int  WIDTH  = 5;
const char NEWLINE = '\n';
```

## 04.C++ 中的类型限定符

类型限定符提供了变量的额外信息，用于在定义变量或函数时改变它们的默认行为的关键字。

| 限定符   | 含义                                                         |
| :------- | :----------------------------------------------------------- |
| const    | **const** 定义常量，表示该变量的值不能被修改。               |
| volatile | 修饰符 **volatile** 告诉该变量的值可能会被程序以外的因素改变，如硬件或其他线程。。 |
| restrict | 由 **restrict** 修饰的指针是唯一一种访问它所指向的对象的方式。只有 C99 增加了新的类型限定符 restrict。 |
| mutable  | mutable 用于修饰类的成员变量。被 mutable 修饰的成员变量可以被修改，即使它们所在的对象是 const 的。 |
| static   | 用于定义静态变量，表示该变量的作用域仅限于当前文件或当前函数内，不会被其他文件或函数访问。 |
| register | 用于定义寄存器变量，表示该变量被频繁使用，可以存储在CPU的寄存器中，以提高程序的运行效率。 |

### const 实例

```c++
const int NUM = 10; // 定义常量 NUM，其值不可修改
const int* ptr = &NUM; // 定义指向常量的指针，指针所指的值不可修改
int const* ptr2 = &NUM; // 和上面一行等价
```

### volatile 实例

```c++
volatile int num = 20; // 定义变量 num，其值可能会在未知的时间被改变
```

### mutable 实例

```c++
class Example {
public:
    int get_value() const {
        return value_; // const 关键字表示该成员函数不会修改对象中的数据成员
    }
    void set_value(int value) const {
        value_ = value; // mutable 关键字允许在 const 成员函数中修改成员变量
    }
private:
    mutable int value_;
};
```

### static 实例

```c++
void example_function() {
    static int count = 0; // static 关键字使变量 count 存储在程序生命周期内都存在
    count++;
}
```

### register 实例

```c++
void example_function(register int num) {
    // register 关键字建议编译器将变量 num 存储在寄存器中
    // 以提高程序执行速度
    // 但是实际上是否会存储在寄存器中由编译器决定
}
```

## 05.C++ 运算符

运算符是一种告诉编译器执行特定的数学或逻辑操作的符号。C++ 内置了丰富的运算符，并提供了以下类型的运算符：

- 算术运算符
- 关系运算符
- 逻辑运算符
- 位运算符
- 赋值运算符
- 杂项运算符

### 位运算符

位运算符作用于位，并逐位执行操作。&、 | 和 ^ 的真值表如下所示：

| p    | q    | p & q | p \| q | p ^ q |
| :--- | :--- | :---- | :----- | :---- |
| 0    | 0    | 0     | 0      | 0     |
| 0    | 1    | 0     | 1      | 1     |
| 1    | 1    | 1     | 1      | 0     |
| 1    | 0    | 0     | 1      | 1     |

假设如果 A = 60，且 B = 13，现在以二进制格式表示，它们如下所示：

A = 0011 1100

B = 0000 1101

\-----------------

A&B = 0000 1100

A|B = 0011 1101

A^B = 0011 0001

~A = 1100 0011

| 运算符 | 描述                                                         | 实例                                                         |
| :----- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| &      | 按位与操作，按二进制位进行"与"运算。运算规则：`0&0=0;    0&1=0;     1&0=0;      1&1=1;` | (A & B) 将得到 12，即为 0000 1100                            |
| \|     | 按位或运算符，按二进制位进行"或"运算。运算规则：`0|0=0;    0|1=1;    1|0=1;     1|1=1;` | (A \| B) 将得到 61，即为 0011 1101                           |
| ^      | 异或运算符，按二进制位进行"异或"运算。运算规则：`0^0=0;    0^1=1;    1^0=1;   1^1=0;` | (A ^ B) 将得到 49，即为 0011 0001                            |
| ~      | 取反运算符，按二进制位进行"取反"运算。运算规则：`~1=-2;    ~0=-1;` | (~A ) 将得到 -61，即为 1100 0011，一个有符号二进制数的补码形式。 |
| <<     | 二进制左移运算符。将一个运算对象的各二进制位全部左移若干位（左边的二进制位丢弃，右边补0）。 | A << 2 将得到 240，即为 1111 0000                            |
| >>     | 二进制右移运算符。将一个数的各二进制位全部右移若干位，正数左补0，负数左补1，右边丢弃。 | A >> 2 将得到 15，即为 0000 1111                             |

### 赋值运算符

下表列出了 C++ 支持的赋值运算符：

| 运算符 | 描述                                                         | 实例                            |
| :----- | :----------------------------------------------------------- | :------------------------------ |
| =      | 简单的赋值运算符，把右边操作数的值赋给左边操作数             | C = A + B 将把 A + B 的值赋给 C |
| +=     | 加且赋值运算符，把右边操作数加上左边操作数的结果赋值给左边操作数 | C += A 相当于 C = C + A         |
| -=     | 减且赋值运算符，把左边操作数减去右边操作数的结果赋值给左边操作数 | C -= A 相当于 C = C - A         |
| *=     | 乘且赋值运算符，把右边操作数乘以左边操作数的结果赋值给左边操作数 | C *= A 相当于 C = C * A         |
| /=     | 除且赋值运算符，把左边操作数除以右边操作数的结果赋值给左边操作数 | C /= A 相当于 C = C / A         |
| %=     | 求模且赋值运算符，求两个操作数的模赋值给左边操作数           | C %= A 相当于 C = C % A         |
| <<=    | 左移且赋值运算符                                             | C <<= 2 等同于 C = C << 2       |
| >>=    | 右移且赋值运算符                                             | C >>= 2 等同于 C = C >> 2       |
| &=     | 按位与且赋值运算符                                           | C &= 2 等同于 C = C & 2         |
| ^=     | 按位异或且赋值运算符                                         | C ^= 2 等同于 C = C ^ 2         |
| \|=    | 按位或且赋值运算符                                           | C \|= 2 等同于 C = C \| 2       |

```c++
c <<= 2; // 44
c >>= 2; // 11
c &= 2; // 2
C ^= 2; // 0
c |= 2; // 2
```

### 杂项运算符

下表列出了 C++ 支持的其他一些重要的运算符。

| 运算符               | 描述                                                         |
| :------------------- | :----------------------------------------------------------- |
| sizeof               | [sizeof 运算符](https://www.runoob.com/cplusplus/cpp-sizeof-operator.html)返回变量的大小。例如，sizeof(a) 将返回 4，其中 a 是整数。 |
| Condition ? X : Y    | [条件运算符](https://www.runoob.com/cplusplus/cpp-conditional-operator.html)。如果 Condition 为真 ? 则值为 X : 否则值为 Y。 |
| ,                    | [逗号运算符](https://www.runoob.com/cplusplus/cpp-comma-operator.html)会顺序执行一系列运算。整个逗号表达式的值是以逗号分隔的列表中的最后一个表达式的值。 |
| .（点）和 ->（箭头） | [成员运算符](https://www.runoob.com/cplusplus/cpp-member-operators.html)用于引用类、结构和共用体的成员。 |
| Cast                 | [强制转换运算符](https://www.runoob.com/cplusplus/cpp-casting-operators.html)把一种数据类型转换为另一种数据类型。例如，int(2.2000) 将返回 2。 |
| &                    | [指针运算符 &](https://www.runoob.com/cplusplus/cpp-pointer-operators.html) 返回变量的地址。例如 &a; 将给出变量的实际地址。 |
| *                    | [指针运算符 *](https://www.runoob.com/cplusplus/cpp-pointer-operators.html) 指向一个变量。例如，*var; 将指向变量 var。 |

### C++ 中的运算符优先级

| 类别       | 运算符                            | 结合性   |
| :--------- | :-------------------------------- | :------- |
| 后缀       | () [] -> . ++ - -                 | 从左到右 |
| 一元       | + - ! ~ ++ - - (type)* & sizeof   | 从右到左 |
| 乘除       | * / %                             | 从左到右 |
| 加减       | + -                               | 从左到右 |
| 移位       | << >>                             | 从左到右 |
| 关系       | < <= > >=                         | 从左到右 |
| 相等       | == !=                             | 从左到右 |
| 位与 AND   | &                                 | 从左到右 |
| 位异或 XOR | ^                                 | 从左到右 |
| 位或 OR    | \|                                | 从左到右 |
| 逻辑与 AND | &&                                | 从左到右 |
| 逻辑或 OR  | \|\|                              | 从左到右 |
| 条件       | ?:                                | 从右到左 |
| 赋值       | = += -= *= /= %=>>= <<= &= ^= \|= | 从右到左 |
| 逗号       | ,                                 | 从左到右 |

## 06.定义函数

C++ 中的函数定义的一般形式如下：

```c++
return_type function_name( parameter list )
{
   body of the function
}
```

### Lambda 函数与表达式

C++11 提供了对匿名函数的支持,称为 Lambda 函数(也叫 Lambda 表达式)。

Lambda 表达式把函数看作对象。Lambda 表达式可以像对象一样使用，比如可以将它们赋给变量和作为参数传递，还可以像函数一样对其求值。

Lambda 表达式本质上与函数声明非常类似。Lambda 表达式具体形式如下:

```c++
[capture](parameters)->return-type{body}
```

例如：

```c++
[](int x, int y){ return x < y ; }
```

如果没有返回值可以表示为：

```c++
[capture](parameters){body}
```

例如：

```c++
[]{ ++global_x; } 
```

在一个更为复杂的例子中，返回类型可以被明确的指定如下：

```c++
[](int x, int y) -> int { int z = x + y; return z + x; }
```

## 07.C++数学运算

为了利用这些函数，您需要引用数学头文件 **<cmath>**。

| 序号 | 函数 & 描述                                                  |
| :--- | :----------------------------------------------------------- |
| 1    | **double cos(double);** 该函数返回弧度角（double 型）的余弦。 |
| 2    | **double sin(double);** 该函数返回弧度角（double 型）的正弦。 |
| 3    | **double tan(double);** 该函数返回弧度角（double 型）的正切。 |
| 4    | **double log(double);** 该函数返回参数的自然对数。           |
| 5    | **double pow(double, double);** 假设第一个参数为 x，第二个参数为 y，则该函数返回 x 的 y 次方。 |
| 6    | **double hypot(double, double);** 该函数返回两个参数的平方总和的平方根，也就是说，参数为一个直角三角形的两个直角边，函数会返回斜边的长度。 |
| 7    | **double sqrt(double);** 该函数返回参数的平方根。            |
| 8    | **int abs(int);** 该函数返回整数的绝对值。                   |
| 9    | **double fabs(double);** 该函数返回任意一个浮点数的绝对值。  |
| 10   | **double floor(double);** 该函数返回一个小于或等于传入参数的最大整数。 |

### C++ 随机数

在许多情况下，需要生成随机数。关于随机数生成器，有两个相关的函数。一个是 **rand()**，该函数只返回一个伪随机数。生成随机数之前必须先调用 **srand()** 函数。

下面是一个关于生成随机数的简单实例。实例中使用了 **time()** 函数来获取系统时间的秒数，通过调用 rand() 函数来生成随机数：

```c++
#include <iostream>
#include <ctime>
#include <cstdlib>
 
using namespace std;
 
int main ()
{
   int i,j;
 
   // 设置种子
   srand( (unsigned)time( NULL ) );
 
   /* 生成 10 个随机数 */
   for( i = 0; i < 10; i++ )
   {
      // 生成实际的随机数
      j= rand();
      cout <<"随机数： " << j << endl;
   }
 
   return 0;
}
```

## 08.C++ 数组

```c++
type arrayName [ arraySize ];
```

```c++
#include <iostream>
using namespace std;
 
#include <iomanip>
using std::setw;
 
int main ()
{
   int n[ 10 ]; // n 是一个包含 10 个整数的数组
 
   // 初始化数组元素          
   for ( int i = 0; i < 10; i++ )
   {
      n[ i ] = i + 100; // 设置元素 i 为 i + 100
   }
   cout << "Element" << setw( 13 ) << "Value" << endl;
 
   // 输出数组中每个元素的值                     
   for ( int j = 0; j < 10; j++ )
   {
      cout << setw( 7 )<< j << setw( 13 ) << n[ j ] << endl;
   }
 
   return 0;
}
```

### setw()函数、setfill函数

```c++
set(int n); // 前面多少个空格
setfill(char c); // 空出来的地方用什么替换
//#include<iomanip>
```

使用了 **setw() 函数** 来格式化输出

```cmd
Element        Value
      0          100
      1          101
      2          102
      3          103
      4          104
      5          105
      6          106
      7          107
      8          108
      9          109
```

## 09.字符串

\#include <cstring>

| 序号 |                         函数 & 目的                          |
| :--- | :----------------------------------------------------------: |
| 1    |       **strcpy(s1, s2);** 复制字符串 s2 到字符串 s1。        |
| 2    | **strcat(s1, s2);** 连接字符串 s2 到字符串 s1 的末尾。连接字符串也可以用 **+** 号，例如: `string str1 = "runoob"; string str2 = "google"; string str = str1 + str2;` |
| 3    |            **strlen(s1);** 返回字符串 s1 的长度。            |
| 4    | **strcmp(s1, s2);** 如果 s1 和 s2 是相同的，则返回 0；如果 s1<s2 则返回值小于 0；如果 s1>s2 则返回值大于 0。 |
| 5    | **strchr(s1, ch);** 返回一个指针，指向字符串 s1 中字符 ch 的第一次出现的位置。 |
| 6    | **strstr(s1, s2);** 返回一个指针，指向字符串 s1 中字符串 s2 的第一次出现的位置。 |

### C++ 中的 String 类

```c++
string str1 = "runoob";
string str2 = "google";
string str3 = str1 + str2; // runoobgoogle
int len = str3.size(); // 12
```

## 10.指针

```c++
type *var-name;
```

```c++
int    *ip;    /* 一个整型的指针 */
double *dp;    /* 一个 double 型的指针 */
float  *fp;    /* 一个浮点型的指针 */
char   *ch;    /* 一个字符型的指针 */
```

```c++
int  var = 20;   // 实际变量的声明
int  *ip;        // 指针变量的声明
ip = &var;       // 在指针变量中存储 var 的地址
cout << ip << endl; // 0xbfc601ac
cout << *ip << endl; // 20
```

## 11.C++ 引用

### C++ 引用 vs 指针

引用很容易与指针混淆，它们之间有三个主要的不同：

- 不存在空引用。引用必须连接到一块合法的内存。
- 一旦引用被初始化为一个对象，就不能被指向到另一个对象。指针可以在任何时候指向到另一个对象。
- 引用必须在创建时被初始化。指针可以在任何时间被初始化。

### C++ 中创建引用

试想变量名称是变量附属在内存位置中的标签，您可以把引用当成是变量附属在内存位置中的第二个标签。因此，您可以通过原始变量名称或引用来访问变量的内容。例如：

```c++
int i = 17;
```

我们可以为 i 声明引用变量，如下所示：

```c++
int&  r = i;
double& s = d;
```

在这些声明中，& 读作**引用**。因此，第一个声明可以读作 "r 是一个初始化为 i 的整型引用"，第二个声明可以读作 "s 是一个初始化为 d 的 double 型引用"。

```c++
#include <iostream>
 
using namespace std;
 
int main ()
{
   // 声明简单的变量
   int    i;
   double d;
 
   // 声明引用变量
   int&    r = i;
   double& s = d;
   
   i = 5;
   cout << "Value of i : " << i << endl;
   cout << "Value of i reference : " << r  << endl;
 
   d = 11.7;
   cout << "Value of d : " << d << endl;
   cout << "Value of d reference : " << s  << endl;
   
   return 0;
}
```

```c++
Value of i : 5
Value of i reference : 5
Value of d : 11.7
Value of d reference : 11.7
```

## 12.C++ 结构体

```c++
struct Books
{
   char  title[50];
   char  author[50];
   char  subject[100];
   int   book_id;
} book;
```

### 指向结构的指针

您可以定义指向结构的指针，方式与定义指向其他类型变量的指针相似，如下所示：

```c++
struct Books *struct_pointer;
```

现在，您可以在上述定义的指针变量中存储结构变量的地址。为了查找结构变量的地址，请把 & 运算符放在结构名称的前面，如下所示：

```c++
struct_pointer = &Book1;
```

为了使用指向该结构的指针访问结构的成员，您必须使用 -> 运算符，如下所示：

```c++
struct_pointer->title;
```

```c++
#include <iostream>
#include <string>
 
using namespace std;
 
// 声明一个结构体类型 Books 
struct Books
{
    string title;
    string author;
    string subject;
    int book_id;
 
    // 构造函数
    Books(string t, string a, string s, int id)
        : title(t), author(a), subject(s), book_id(id) {}
};
 
// 打印书籍信息的函数
void printBookInfo(const Books& book) {
    cout << "书籍标题: " << book.title << endl;
    cout << "书籍作者: " << book.author << endl;
    cout << "书籍类目: " << book.subject << endl;
    cout << "书籍 ID: " << book.book_id << endl;
}
 
int main()
{
    // 创建两本书的对象
    Books Book1("C++ 教程", "Runoob", "编程语言", 12345);
    Books Book2("CSS 教程", "Runoob", "前端技术", 12346);
 
    // 输出书籍信息
    printBookInfo(Book1);
    printBookInfo(Book2);
 
    return 0;
}
```

```cmd
书标题  : C++ 教程
书作者 : Runoob
书类目 : 编程语言
书 ID : 12345
书标题  : CSS 教程
书作者 : Runoob
书类目 : 前端技术
书 ID : 12346
```

### typedef 关键字

下面是一种更简单的定义结构的方式，您可以为创建的类型取一个"别名"。例如：

```
typedef struct Books
{
   char  title[50];
   char  author[50];
   char  subject[100];
   int   book_id;
}Books;
```

现在，您可以直接使用 *Books* 来定义 *Books* 类型的变量，而不需要使用 struct 关键字。下面是实例：

```
Books Book1, Book2;
```

您可以使用 **typedef** 关键字来定义非结构类型，如下所示：

```
typedef long int *pint32;
 
pint32 x, y, z;
```

x, y 和 z 都是指向长整型 long int 的指针。

### 结构体与类的区别

在 C++ 中，struct 和 class 本质上非常相似，唯一的区别在于默认的访问权限：

- `struct` 默认的成员和继承是 `public`。
- `class` 默认的成员和继承是 `private`。

你可以将 `struct` 当作一种简化形式的 `class`，适合用于没有太多复杂功能的简单数据封装。

### 结构体与函数的结合

你可以通过构造函数初始化结构体，还可以通过引用传递结构体来避免不必要的拷贝。

```c++
struct Books {
    string title;
    string author;
    string subject;
    int book_id;

    // 构造函数
    Books(string t, string a, string s, int id)
        : title(t), author(a), subject(s), book_id(id) {}

    void printInfo() const {
        cout << "书籍标题: " << title << endl;
        cout << "书籍作者: " << author << endl;
        cout << "书籍类目: " << subject << endl;
        cout << "书籍 ID: " << book_id << endl;
    }
};

void printBookByRef(const Books& book) {
    book.printInfo();
}
```

## 13.C++ vector 容器

C++ 中的 vector 是一种序列容器，它允许你在运行时动态地插入和删除元素。

vector 是基于数组的数据结构，但它可以自动管理内存，这意味着你不需要手动分配和释放内存

**基本特性:**

- **动态大小**：`vector` 的大小可以根据需要自动增长和缩小。
- **连续存储**：`vector` 中的元素在内存中是连续存储的，这使得访问元素非常快速。
- **可迭代**：`vector` 可以被迭代，你可以使用循环（如 `for` 循环）来访问它的元素。
- **元素类型**：`vector` 可以存储任何类型的元素，包括内置类型、对象、指针等。

**使用场景：**

- 当你需要一个可以动态增长和缩小的数组时。
- 当你需要频繁地在序列的末尾添加或移除元素时。
- 当你需要一个可以高效随机访问元素的容器时。

要使用 vector，首先需要包含 **<vector>** 头文件

```c++
vector<int> myVector; // 创建一个存储整数的空 vector
vector<int> myVector(5); // 创建一个包含 5 个整数的 vector，每个值都为默认值（0）
vector<int> myVector(5, 10); // 创建一个包含 5 个整数的 vector，每个值都为 10
vector<int> vec2 = {1, 2, 3, 4}; // 初始化一个包含元素的 vector
```

### 添加元素

```c++
myVector.push_back(7); // 将整数 7 添加到 vector 的末尾
```

### 访问元素

可以使用下标操作符 [] 或 at() 方法访问 vector 中的元素：

```c++
int x = myVector[0]; // 获取第一个元素
int y = myVector.at(1); // 获取第二个元素
```

### 获取大小

可以使用 size() 方法获取 vector 中元素的数量：

```c++
int size = myVector.size(); // 获取 vector 中的元素数量
```

### 迭代访问

可以使用迭代器遍历 vector 中的元素：

```c++
for (auto it = myVector.begin(); it != myVector.end(); ++it) {
    cout << *it << " ";
}
```

或者使用范围循环：

```c++
for (int element : myVector) {
    cout << element << " ";
}
```

### 删除元素

可以使用 erase() 方法删除 vector 中的元素：

```c++
myVector.erase(myVector.begin() + 2); // 删除第三个元素
```

### 清空 Vector

可以使用 clear() 方法清空 vector 中的所有元素：

```c++
myVector.clear(); // 清空 vector
```

## 14.C++ 数据结构

C++ 提供了多种数据结构，既有基础的如数组、结构体、类等，也有高级的 STL 容器如 `vector`、`map` 和 `unordered_map` 等。

#### 1. **数组（Array）**

#### 2. **结构体（Struct）**

#### 3. **类（Class）**

```c++
class Person {
private:
    string name;
    int age;
public:
    Person(string n, int a) : name(n), age(a) {}
    void printInfo() {
        cout << "Name: " << name << ", Age: " << age << endl;
    }
};
Person p("Bob", 30);
p.printInfo(); // 输出: Name: Bob, Age: 30
```

4. **链表（Linked List）**

链表是一种动态数据结构，由一系列节点组成，每个节点包含数据和指向下一个节点的指针。

**特点**：

- 动态调整大小，不需要提前定义容量。
- 插入和删除操作效率高，时间复杂度为 O(1)（在链表头部或尾部操作）。
- 线性查找，时间复杂度为 O(n)。

```c++
// 实例（单向链表）
struct Node {
    int data;
    Node* next;
};
Node* head = nullptr;
Node* newNode = new Node{10, nullptr};
head = newNode; // 插入新节点
```

**优缺点**：

- 优点：动态大小，适合频繁插入和删除的场景。
- 缺点：随机访问效率低，不如数组直接访问快。

#### 5. **栈（Stack）**

栈是一种后进先出（LIFO, Last In First Out）的数据结构，常用于递归、深度优先搜索等场景。

**特点**：

- 只允许在栈顶进行插入和删除操作。
- 时间复杂度为 O(1)。

##### 实例

```c++
stack<int> s;
s.push(1);
s.push(2);
cout << s.top(); // 输出 2
s.pop();
```

**优缺点**：

- 优点：操作简单，效率高。
- 缺点：只能在栈顶操作，访问其他元素需要弹出栈顶元素。

#### 6. **队列（Queue）**

队列是一种先进先出（FIFO, First In First Out）的数据结构，常用于广度优先搜索、任务调度等场景。

**特点**：

- 插入操作在队尾进行，删除操作在队头进行。
- 时间复杂度为 O(1)。

##### 实例

```c++
queue<int> q;
q.push(1);
q.push(2);
cout << q.front(); // 输出 1
q.pop();
```

**优缺点**：

- 优点：适合按顺序处理数据的场景，如任务调度。
- 缺点：无法随机访问元素。

#### 7. **双端队列（Deque）**

双端队列允许在两端进行插入和删除操作，是栈和队列的结合体。

**特点**：

- 允许在两端进行插入和删除。
- 时间复杂度为 O(1)。

##### 实例

```c++
deque<int> dq;
dq.push_back(1);
dq.push_front(2);
cout << dq.front(); // 输出 2
dq.pop_front();
```

**优缺点**：

- 优点：灵活的双向操作。
- 缺点：空间占用较大，适合需要在两端频繁操作的场景。

#### 8. **哈希表（Hash Table）**

哈希表是一种通过键值对存储数据的数据结构，支持快速查找、插入和删除操作。C++ 中的 `unordered_map` 是哈希表的实现。

**特点**：

- 使用哈希函数快速定位元素，时间复杂度为 O(1)。
- 不保证元素的顺序。

##### 实例

```c++
unordered_map<string, int> hashTable;
hashTable["apple"] = 10;
cout << hashTable["apple"]; // 输出 10
```

**优缺点**：

- 优点：查找、插入、删除操作效率高。
- 缺点：无法保证元素顺序，哈希冲突时性能会下降。

#### 9. **映射（Map）**

`map` 是一种有序的键值对容器，底层实现是红黑树。与 `unordered_map` 不同，它保证键的顺序，查找、插入和删除的时间复杂度为 O(log n)。

**特点**：

- 保证元素按键的顺序排列。
- 使用二叉搜索树实现。

##### 实例

```c++
map<string, int> myMap;
myMap["apple"] = 10;
cout << myMap["apple"]; // 输出 10
```

**优缺点**：

- 优点：元素有序，适合需要按顺序处理数据的场景。
- 缺点：操作效率比 `unordered_map` 略低。

#### 10. **集合（Set）**

`set` 是一种用于存储唯一元素的有序集合，底层同样使用红黑树实现。它保证元素不重复且有序。

**特点**：

- 保证元素的唯一性。
- 元素自动按升序排列。
- 时间复杂度为 O(log n)。

##### 实例

```c++
set<int> s;
s.insert(1);
s.insert(2);
cout << *s.begin(); // 输出 1
```

**优缺点**：

- 优点：自动排序和唯一性保证。
- 缺点：插入和删除的效率不如无序集合。

#### 11. **动态数组（Vector）**

`vector` 是 C++ 标准库提供的动态数组实现，可以动态扩展容量，支持随机访问。

**特点**：

- 动态调整大小。
- 支持随机访问，时间复杂度为 O(1)。
- 当容量不足时，动态扩展，时间复杂度为摊销 O(1)。

##### 实例

```c++
vector<int> v;
v.push_back(1);
v.push_back(2);
cout << v[0]; // 输出 1
```

**优缺点**：

- 优点：支持随机访问，动态扩展。
- 缺点：插入和删除中间元素的效率较低。

## 15.C++ 继承

```c++
// 基类
class Animal {
    // eat() 函数
    // sleep() 函数
};


//派生类
class Dog : public Animal {
    // bark() 函数
};
```

## 16.C++ 重载运算符和重载函数

### C++ 中的函数重载

```c++
#include <iostream>
using namespace std;
 
class printData
{
   public:
      void print(int i) {
        cout << "整数为: " << i << endl;
      }
 
      void print(double  f) {
        cout << "浮点数为: " << f << endl;
      }
 
      void print(char c[]) {
        cout << "字符串为: " << c << endl;
      }
};
 
int main(void)
{
   printData pd;
 
   // 输出整数
   pd.print(5);
   // 输出浮点数
   pd.print(500.263);
   // 输出字符串
   char c[] = "Hello C++";
   pd.print(c);
 
   return 0;
}
```

```cmd
整数为: 5
浮点数为: 500.263
字符串为: Hello C++
```

### C++ 中的运算符重载

您可以重定义或重载大部分 C++ 内置的运算符。这样，您就能使用自定义类型的运算符。

重载的运算符是带有特殊名称的函数，函数名是由关键字 operator 和其后要重载的运算符符号构成的。与其他函数一样，重载运算符有一个返回类型和一个参数列表。

```c++
Box operator+(const Box&);
```

声明加法运算符用于把两个 Box 对象相加，返回最终的 Box 对象。大多数的重载运算符可被定义为普通的非成员函数或者被定义为类成员函数。如果我们定义上面的函数为类的非成员函数，那么我们需要为每次操作传递两个参数，如下所示：

```c++
Box operator+(const Box&, const Box&);
```

下面的实例使用成员函数演示了运算符重载的概念。在这里，对象作为参数进行传递，对象的属性使用 **this** 运算符进行访问，如下所示：

```c++
#include <iostream>
using namespace std;
 
class Box
{
   public:
 
      double getVolume(void)
      {
         return length * breadth * height;
      }
      void setLength( double len )
      {
          length = len;
      }
 
      void setBreadth( double bre )
      {
          breadth = bre;
      }
 
      void setHeight( double hei )
      {
          height = hei;
      }
      // 重载 + 运算符，用于把两个 Box 对象相加
      Box operator+(const Box& b)
      {
         Box box;
         box.length = this->length + b.length;
         box.breadth = this->breadth + b.breadth;
         box.height = this->height + b.height;
         return box;
      }
   private:
      double length;      // 长度
      double breadth;     // 宽度
      double height;      // 高度
};
// 程序的主函数
int main( )
{
   Box Box1;                // 声明 Box1，类型为 Box
   Box Box2;                // 声明 Box2，类型为 Box
   Box Box3;                // 声明 Box3，类型为 Box
   double volume = 0.0;     // 把体积存储在该变量中
 
   // Box1 详述
   Box1.setLength(6.0); 
   Box1.setBreadth(7.0); 
   Box1.setHeight(5.0);
 
   // Box2 详述
   Box2.setLength(12.0); 
   Box2.setBreadth(13.0); 
   Box2.setHeight(10.0);
 
   // Box1 的体积
   volume = Box1.getVolume();
   cout << "Volume of Box1 : " << volume <<endl;
 
   // Box2 的体积
   volume = Box2.getVolume();
   cout << "Volume of Box2 : " << volume <<endl;
 
   // 把两个对象相加，得到 Box3
   Box3 = Box1 + Box2;
 
   // Box3 的体积
   volume = Box3.getVolume();
   cout << "Volume of Box3 : " << volume <<endl;
 
   return 0;
}
```

```cmd
Volume of Box1 : 210
Volume of Box2 : 1560
Volume of Box3 : 5400
```

### 可重载运算符/不可重载运算符

下面是可重载的运算符列表：

| 双目算术运算符 | + (加)，-(减)，*(乘)，/(除)，% (取模)                        |
| -------------- | ------------------------------------------------------------ |
| 关系运算符     | ==(等于)，!= (不等于)，< (小于)，> (大于)，<=(小于等于)，>=(大于等于) |
| 逻辑运算符     | \|\|(逻辑或)，&&(逻辑与)，!(逻辑非)                          |
| 单目运算符     | + (正)，-(负)，*(指针)，&(取地址)                            |
| 自增自减运算符 | ++(自增)，--(自减)                                           |
| 位运算符       | \| (按位或)，& (按位与)，~(按位取反)，^(按位异或),，<< (左移)，>>(右移) |
| 赋值运算符     | =, +=, -=, *=, /= , % = , &=, \|=, ^=, <<=, >>=              |
| 空间申请与释放 | new, delete, new[ ] , delete[]                               |
| 其他运算符     | **()**(函数调用)，**->**(成员访问)，**,**(逗号)，**[]**(下标) |

下面是不可重载的运算符列表：

- **.**  ：成员访问运算符
- **.\***, **->\***  ：成员指针访问运算符
- **::**  ：域运算符
- **sizeof** ：长度运算符
- **?:**  ：条件运算符
- **# **  ： 预处理符号

## 17.C++ 多态

**多态**按字面的意思就是多种形态。当类之间存在层次结构，并且类之间是通过继承关联时，就会用到多态。

C++ 多态意味着调用成员函数时，会根据调用函数的对象的类型来执行不同的函数。

下面的实例中，基类 Shape 被派生为两个类，如下所示：

```c++
#include <iostream> 
using namespace std;
 
class Shape {
   protected:
      int width, height;
   public:
      Shape( int a=0, int b=0)
      {
         width = a;
         height = b;
      }
      int area()
      {
         cout << "Parent class area :" <<endl;
         return 0;
      }
};
class Rectangle: public Shape{
   public:
      Rectangle( int a=0, int b=0):Shape(a, b) { }
      int area ()
      { 
         cout << "Rectangle class area :" <<endl;
         return (width * height); 
      }
};
class Triangle: public Shape{
   public:
      Triangle( int a=0, int b=0):Shape(a, b) { }
      int area ()
      { 
         cout << "Triangle class area :" <<endl;
         return (width * height / 2); 
      }
};
// 程序的主函数
int main( )
{
   Shape *shape;
   Rectangle rec(10,7);
   Triangle  tri(10,5);
 
   // 存储矩形的地址
   shape = &rec;
   // 调用矩形的求面积函数 area
   shape->area();
 
   // 存储三角形的地址
   shape = &tri;
   // 调用三角形的求面积函数 area
   shape->area();
   
   return 0;
}
```

```cmd
Parent class area :
Parent class area :
```

导致错误输出的原因是，调用函数 area() 被编译器设置为基类中的版本，这就是所谓的**静态多态**，或**静态链接** - 函数调用在程序执行前就准备好了。有时候这也被称为**早绑定**，因为 area() 函数在程序编译期间就已经设置好了。

但现在，让我们对程序稍作修改，在 Shape 类中，area() 的声明前放置关键字 **virtual**，如下所示：

```c++
class Shape {
   protected:
      int width, height;
   public:
      Shape( int a=0, int b=0)
      {
         width = a;
         height = b;
      }
      virtual int area()
      {
         cout << "Parent class area :" <<endl;
         return 0;
      }
};
```

```cmd
Rectangle class area :
Triangle class area :
```

### 纯虚函数

您可能想要在基类中定义虚函数，以便在派生类中重新定义该函数更好地适用于对象，但是您在基类中又不能对虚函数给出有意义的实现，这个时候就会用到纯虚函数。

我们可以把基类中的虚函数 area() 改写如下：

```c++
class Shape {
   protected:
      int width, height;
   public:
      Shape( int a=0, int b=0)
      {
         width = a;
         height = b;
      }
      // pure virtual function
      virtual int area() = 0;
};
```

= 0 告诉编译器，函数没有主体，上面的虚函数是**纯虚函数**。

## 18.C++ 数据封装

```c++
#include <iostream>
using namespace std;
 
class Adder{
   public:
      // 构造函数
      Adder(int i = 0)
      {
        total = i;
      }
      // 对外的接口
      void addNum(int number)
      {
          total += number;
      }
      // 对外的接口
      int getTotal()
      {
          return total;
      };
   private:
      // 对外隐藏的数据
      int total;
};
int main( )
{
   Adder a;
   
   a.addNum(10);
   a.addNum(20);
   a.addNum(30);
 
   cout << "Total " << a.getTotal() <<endl;
   return 0;
}
```

```cmd
Total 60
```

```c++
#include <iostream>
using namespace std;

class Student {
private:
    string name;
    int age;

public:
    // 构造函数
    Student(string studentName, int studentAge) {
        name = studentName;
        age = studentAge;
    }

    // 访问器函数（getter）
    string getName() {
        return name;
    }

    int getAge() {
        return age;
    }

    // 修改器函数（setter）
    void setName(string studentName) {
        name = studentName;
    }

    void setAge(int studentAge) {
        if (studentAge > 0) {
            age = studentAge;
        } else {
            cout << "Invalid age!" << endl;
        }
    }

    // 打印学生信息
    void printInfo() {
        cout << "Name: " << name << ", Age: " << age << endl;
    }
};

int main() {
    // 创建一个 Student 对象
    Student student1("Alice", 20);

    // 访问和修改数据
    student1.printInfo();

    student1.setName("Bob");
    student1.setAge(22);

    student1.printInfo();

    return 0;
}
```

## 19.C++ 接口（抽象类）

接口描述了类的行为和功能，而不需要完成类的特定实现。

C++ 接口是使用**抽象类**来实现的，抽象类与数据抽象互不混淆，数据抽象是一个把实现细节与相关的数据分离开的概念。

如果类中至少有一个函数被声明为纯虚函数，则这个类就是抽象类。纯虚函数是通过在声明中使用 "= 0" 来指定的，如下所示：

```c++
class Box
{
   public:
      // 纯虚函数
      virtual double getVolume() = 0;
   private:
      double length;      // 长度
      double breadth;     // 宽度
      double height;      // 高度
};
```

### 抽象类的实例

请看下面的实例，基类 Shape 提供了一个接口 **getArea()**，在两个派生类 Rectangle 和 Triangle 中分别实现了 **getArea()**

```c++
#include <iostream>
 
using namespace std;
 
// 基类
class Shape 
{
public:
   // 提供接口框架的纯虚函数
   virtual int getArea() = 0;
   void setWidth(int w)
   {
      width = w;
   }
   void setHeight(int h)
   {
      height = h;
   }
protected:
   int width;
   int height;
};
 
// 派生类
class Rectangle: public Shape
{
public:
   int getArea()
   { 
      return (width * height); 
   }
};
class Triangle: public Shape
{
public:
   int getArea()
   { 
      return (width * height)/2; 
   }
};
 
int main(void)
{
   Rectangle Rect;
   Triangle  Tri;
 
   Rect.setWidth(5);
   Rect.setHeight(7);
   // 输出对象的面积
   cout << "Total Rectangle area: " << Rect.getArea() << endl;
 
   Tri.setWidth(5);
   Tri.setHeight(7);
   // 输出对象的面积
   cout << "Total Triangle area: " << Tri.getArea() << endl; 
 
   return 0;
}
```

```cmd
Total Rectangle area: 35
Total Triangle area: 17
```

