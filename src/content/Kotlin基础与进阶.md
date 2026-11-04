---
title: Kotlin 基础与进阶
date: 2024-12-30
updatetime: 2026-11-04
tags: [Kotlin, 基础学习, 协程, Android]
description: 从语法、集合、面向对象和空安全，到 Lambda、作用域函数、对象模型与 Kotlin 协程，一份面向 Android 开发的 Kotlin 基础与进阶复习。
pinned: false
---

> Android 学习系列 1/4。下一篇：[Android 基础与工程化](/article/Android基础与工程化)

这份笔记先保留早期 Kotlin 学习中的语法、集合和面向对象内容，再补上现代 Android 开发中经常出现的 Lambda、作用域函数、对象模型和协程。阅读目标不是背完整语言手册，而是能看懂并写出 Compose、ViewModel 与网络层里常见的 Kotlin 代码。

# 1. First Kotlin

> 最简版

```kotlin
fun main(args: Array<String>) {    // 包级可见的函数，接受一个字符串数组作为参数
   println("Hello World!")         // 分号可以省略
}
```

> 面向对象

```kotlin
class Greeter(val name: String) {
   fun greet() { 
      println("Hello, $name")
   }
}
 
fun main(args: Array<String>) {
   Greeter("World!").greet()          // 创建一个对象不用 new 关键字
}
```

# 2.Kotlin 基础语法

## ①函数定义

> 函数定义使用关键字 fun，参数格式为：参数 : 类型

```kotlin
fun sum(a: Int, b: Int): Int {   // Int 参数，返回值 Int
    return a + b
}
```



> 表达式作为函数体，返回类型自动推断：

```kotlin
fun sum(a: Int, b: Int) = a + b

public fun sum(a: Int, b: Int): Int = a + b   // 公共 API 显式写出返回类型通常更清楚
```



> 无返回值的函数(类似Java中的void)：

```kotlin
fun printSum(a: Int, b: Int) { 
    print(a + b)
}
```



> 可变长参数函数：

```kotlin
fun vars(vararg v:Int){
    for(vt in v){
        print(vt)
    }
}

// 测试
fun main(args: Array<String>) {
    vars(1,2,3,4,5)  // 输出12345
}
```



> lambda(匿名函数)

```kotlin
fun main(args: Array<String>) {
    val sumLambda: (Int, Int) -> Int = {x,y -> x+y}
    println(sumLambda(1,2))  // 输出 3
}
```

## ②定义常量与变量

> 可变变量定义：var 关键字
>
> //类似于JavaScript中的let

```kotlin
var <标识符> : <类型> = <初始化值>
```



> 不可变变量定义：val 关键字，只能赋值一次的变量(类似Java中final修饰的变量)
>
> //类似于JavaScript中的const

```kotlin
val <标识符> : <类型> = <初始化值>
```



> 例子：

```kotlin
val a: Int = 1
val b = 1       // 系统自动推断变量类型为Int
val c: Int      // 如果不在声明时初始化则必须提供变量类型
c = 1           // 明确赋值


var x = 5        // 系统自动推断变量类型为Int
x += 1           // 变量可修改
```



## ③注释

```kotlin
// 这是一个单行注释

/* 这是一个多行的
   块注释。 */

/* 
与 Java 不同,
Kotlin 中的块注释允许嵌套。
*/
```

## ④字符串模板

> $ 表示一个变量名或者变量值
>
> $varName 表示变量值
>
> ${varName.fun()} 表示变量的方法返回值:

```kotlin
var a = 1
// 模板中的简单名称：
val s1 = "a is $a" 

a = 2
// 模板中的任意表达式：
val s2 = "${s1.replace("is", "was")}, but now is $a"

/*	
	a is 1
	a was 1, but now is 2
*/
```

## ⑤NULL检查机制

> Kotlin的空安全设计对于声明可为空的参数，在使用时要进行空判断处理，有两种处理方式，字段后加!!像Java一样抛出空异常，另一种字段后加?可不做处理返回值为 **null** 或配合 **?:** 做空判断处理

```kotlin
//类型后面加?表示可为空
var age: String? = "23" 
//抛出空指针异常
val ages = age!!.toInt()
//不做处理返回 null
val ages1 = age?.toInt()
//age为空返回-1
val ages2 = age?.toInt() ?: -1
```

## ⑥类型检测及自动类型转换

> 我们可以使用 **is** 运算符检测一个对象是否是指定类型的实例(类似于 Java 中的 instanceof 关键字)。

```kotlin
if (obj is Type) {
    // 如果 obj 是 Type 类型，则可以直接使用 Type 类型的属性和方法
} else {
    // 处理其他类型情况
}
```



> 例子：

```kotlin
fun main() {
    val obj: Any = "Hello, Kotlin"

    if (obj is String) {
        println("字符串长度: ${obj.length}") // 在这里 `obj` 已被智能转换为 `String`
    } else {
        println("不是字符串类型")
    }
}
```



```kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String) return null
  // 在这个分支中, `obj` 的类型会被自动转换为 `String`
  return obj.length
}
```



```kotlin
fun getStringLength(obj: Any): Int? {
  // 在 `&&` 运算符的右侧, `obj` 的类型会被自动转换为 `String`
  if (obj is String && obj.length > 0)
    return obj.length
  return null
}
```



## ⑦区间

```kotlin
for (i in 1..4) print(i) // 输出“1234”

for (i in 4..1) print(i) // 什么都不输出

for (i in 4..1) print(i) // 什么都不输出

if (i in 1..10) { // 等同于 1 <= i && i <= 10
    println(i)
}

// 使用 step 指定步长
for (i in 1..4 step 2) print(i) // 输出“13”

for (i in 4 downTo 1 step 2) print(i) // 输出“42”


// 使用 until 函数排除结束元素
for (i in 1 until 10) {   // i in [1, 10) 排除了 10
     println(i)
}
```

# 3.Kotlin 基本数据类型

## ①基本数据类型

> 整数类型:	**Byte**,**Short**,**Int**,**Long**
>
> 浮点数类型:	**Float**,**Double**
>
> 字符类型:	**Char**
>
> 布尔类型:	**Boolean**
>
> 字符串类型:	**String**

> 数组类型:
>
> Kotlin 提供了数组类型来存储同种类型的元素，例如：
>
> - **IntArray**: 存储 `Int` 类型的数组。
> - **DoubleArray**: 存储 `Double` 类型的数组。
> - **Array<T>**: 泛型数组，可以存储任意类型。

```kotlin
fun main() {

    // 数组类型
    val intArray: IntArray = intArrayOf(1, 2, 3, 4, 5)
    val doubleArray: DoubleArray = doubleArrayOf(1.1, 2.2, 3.3)
    val stringArray: Array<String> = arrayOf("Kotlin", "Java", "Python")

    println("Int Array: ${intArray.joinToString()}")
    println("Double Array: ${doubleArray.joinToString()}")
    println("String Array: ${stringArray.joinToString()}")

/*    
    Int Array: 1, 2, 3, 4, 5
    Double Array: 1.1, 2.2, 3.3
    String Array: Kotlin, Java, Python
 */
}
```

## ②位操作符

```kotlin
shl(bits) – 左移位 (Java’s <<)
shr(bits) – 右移位 (Java’s >>)
ushr(bits) – 无符号右移位 (Java’s >>>)
and(bits) – 与
or(bits) – 或
xor(bits) – 异或
inv() – 反向
```

## ③数组

```kotlin
fun main {
    //[1,2,3]
    val a = arrayOf(1, 2, 3)
    //[0,2,4]
    val b = Array(3, { i -> (i * 2) })
 // val b = Array(3) { i -> (i * 2) }

    //读取数组内容
    println(a[0])    // 输出结果：1
    println(b[1])    // 输出结果：2
}
```

## ④字符串

> 和 Java 一样，String 是不可变的。方括号 [] 语法可以很方便的获取字符串中的某个字符，也可以通过 for 循环来遍历：

```kotlin
for (c in str) {
    println(c)
}
```



> Kotlin 支持三个引号 """ 扩起来的字符串，支持多行字符串，比如：

```kotlin
fun main() {
    val text = """
    多行字符串
    多行字符串
    """
    println(text)   // 输出有一些前置空格
/*

    多行字符串
    多行字符串


    进程已结束,退出代码0
*/
}
```



> String 可以通过 trimMargin() 方法来删除多余的空白。

```kotlin
fun main() {
    val text = """
    |多行字符串
    |菜鸟教程
    |多行字符串
    |Runoob
    """.trimMargin()
    println(text)    // 前置空格删除了
/*
多行字符串
菜鸟教程
多行字符串
Runoob

进程已结束,退出代码0
*/
}
```

> 默认 | 用作边界前缀，但你可以选择其他字符并作为参数传入，比如 trimMargin(">")。

## ⑤字符串模板

```kotlin
fun main() {
    val s = "runoob"
    val str = "$s.length is ${s.length}" 
    // 求值结果为 "runoob.length is 6"
    println(str)
}
```

原生字符串和转义字符串内部都支持模板。 如果你需要在原生字符串中表示字面值 $ 字符（它不支持反斜杠转义），你可以用下列语法：

```kotlin
fun main() {
    val price = """
    ${'$'}9.99
    """
    println(price)  // 求值结果为 $9.99
}
```

# 4.Kotlin 条件控制

## ①三元操作符

```kotlin
val a = 1
val b = 2
val c = if (a >= b) a else b
```

## ②When 表达式

> when 类似其他语言的 switch 操作符。其最简单的形式如下：

```kotlin
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> { // 注意这个块
        print("x 不是 1 ，也不是 2")
    }
}
```



```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```



> 另一种可能性是检测一个值是（is）或者不是（!is）一个特定类型的值。注意： 由于智能转换，你可以访问该类型的方法和属性而无需 任何额外的检测。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```



> when 也可以用来取代 if-else if链。 如果不提供参数，所有的分支条件都是简单的布尔表达式，而当一个分支的条件为真时则执行该分支：

```kotlin
when {
    x.isOdd() -> print("x is odd")
    x.isEven() -> print("x is even")
    else -> print("x is funny")
}
```

# 5.Kotlin 循环控制

> 遍历

```kotlin
fun main() {
    val array = listOf("apple", "banana", "kiwi")
    for ((index, value) in array.withIndex()) {
        println("array[$index]: $value")
    }
    
    for (index in array.indices) {
        println("item at $index is ${array[index]}")
    }
}
```

### ①Break 和 Continue 标签

> 在 Kotlin 中任何表达式都可以用标签（label）来标记。 标签的格式为标识符后跟 @ 符号，例如：abc@、fooBar@都是有效的标签。 要为一个表达式加标签，我们只要在其前加标签即可。

```kotlin
loop@ for (i in 1..100) {
    // ……
}
```



> 现在，我们可以用标签限制 break 或者continue：

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (……) break@loop
    }
}
```

> 标签限制的 break 跳转到刚好位于该标签指定的循环后面的执行点。 continue 继续标签指定的循环的下一次迭代。

### ②标签处返回

```kotlin
fun main() {
    val ints = listOf(1, 3, 4, 0, 6)
    ints.forEach {
        if (it == 0) return
        print(it)
    }
}
// 134
```



```kotlin
fun main() {
    val ints = listOf(1, 3, 4, 0, 6)
    ints.forEach lit@ {
        if (it == 0) return@lit
        print(it)
    }
}
// 1346
```

> ==>

```kotlin
fun main() {
    val ints = listOf(1, 3, 4, 0, 6)
    ints.forEach {
        if (it == 0) return@forEach
        print(it)
    }
}
// 1346
```

> ==>

```kotlin
fun main() {
    val ints = listOf(1, 3, 4, 0, 6)
    ints.forEach(fun(value: Int) {
        if (value == 0) return
        print(value)
    })
}
// 1346
```

# 6.Kotlin 类和对象

## ①类定义

```kotlin
class Runoob {  // 类名为 Runoob
    // 大括号内是类体构成
}

class Empty // 我们也可以定义一个空类
```



```kotlin
fun main() {
    val site = Runoob() // Kotlin 中没有 new 关键字
}
```

## ②getter 和 setter

> 属性声明的完整语法：

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
 
```

> getter 和 setter 都是可选
>
> 如果属性类型可以从初始化语句或者类的成员函数中推断出来，那就可以省去类型，val不允许设置setter函数，因为它是只读的。



```kotlin
class Runoob  constructor(name: String) {  // 类名为 Runoob
    // 大括号内是类体构成
    var url: String = "http://www.runoob.com"
    var country: String = "CN"
    var siteName = name

    init {
        println("初始化网站名: ${name}")
    }

    fun printTest() {
        println("我是类的函数")
    }
}

fun main(args: Array<String>) {
    val runoob =  Runoob("菜鸟教程")
    println(runoob.siteName)
    println(runoob.url)
    println(runoob.country)
    runoob.printTest()
}
```

## ③次构造函数

```kotlin
class Runoob  constructor(name: String) {  // 类名为 Runoob
    // 大括号内是类体构成
    var url: String = "http://www.runoob.com"
    var country: String = "CN"
    var siteName = name

    init {
        println("初始化网站名: ${name}")
    }
    // 次构造函数
    constructor (name: String, alexa: Int) : this(name) {
        println("Alexa 排名 $alexa")
    }

    fun printTest() {
        println("我是类的函数")
    }
}

fun main() {
    val runoob =  Runoob("菜鸟教程", 10000)
    println(runoob.siteName)
    println(runoob.url)
    println(runoob.country)
    runoob.printTest()
}

```

## ④抽象类

> 抽象是面向对象编程的特征之一，类本身，或类中的部分成员，都可以声明为abstract的。抽象成员在类中不存在具体的实现。
>
> 注意：无需对抽象类或抽象成员标注open注解。

```kotlin
open class Base {
    open fun f() {}
}

abstract class Derived : Base() {
    override abstract fun f()
}
```

## ⑤嵌套类

> 我们可以把类嵌套在其他类中，看以下实例：

```kotlin
class Outer {                  // 外部类
    private val bar: Int = 1
    class Nested {             // 嵌套类
        fun foo() = 2
    }
}

fun main(args: Array<String>) {
    val demo = Outer.Nested().foo() // 调用格式：外部类.嵌套类.嵌套类方法/属性
    println(demo)    // == 2
}
```

## ⑥内部类

> 内部类使用 inner 关键字来表示。
>
> 内部类会带有一个对外部类的对象的引用，所以内部类可以访问外部类成员属性和成员函数。

```kotlin
class Outer {
    private val bar: Int = 1
    var v = "成员属性"
    /**嵌套内部类**/
    inner class Inner {
        fun foo() = bar  // 访问外部类成员
        fun innerTest() {
            var o = this@Outer //获取外部类的成员变量
            println("内部类可以引用外部类的成员，例如：" + o.v)
        }
    }
}

fun main(args: Array<String>) {
    val demo = Outer().Inner().foo()
    println(demo) //   1
    val demo2 = Outer().Inner().innerTest()   
    println(demo2)   // 内部类可以引用外部类的成员，例如：成员属性
}
```

> 为了消除歧义，要访问来自外部作用域的 this，我们使用this@label，其中 @label 是一个 代指 this 来源的标签。

## ⑦匿名内部类

> 使用对象表达式来创建匿名内部类：

```kotlin
class Test {
    var v = "成员属性"

    fun setInterFace(test: TestInterFace) {
        test.test()
    }
}

/**
 * 定义接口
 */
interface TestInterFace {
    fun test()
}

fun main(args: Array<String>) {
    var test = Test()

    /**
     * 采用对象表达式来创建接口对象，即匿名内部类的实例。
     */
    test.setInterFace(object : TestInterFace {
        override fun test() {
            println("对象表达式创建匿名内部类的实例")
        }
    })
}
```

# 7.Kotlin 继承

## ①构造函数

### [1]子类有主构造函数

```kotlin
open class Person(var name : String, var age : Int){// 基类

}

class Student(name : String, age : Int, var no : String, var score : Int) : Person(name, age) {

}

// 测试
fun main(args: Array<String>) {
    val s =  Student("Runoob", 18, "S12346", 89)
    println("学生名： ${s.name}")
    println("年龄： ${s.age}")
    println("学生号： ${s.no}")
    println("成绩： ${s.score}")
}
/*
学生名： Runoob
年龄： 18
学生号： S12346
成绩： 89
*/
```

### [2]子类没有主构造函数

```kotlin
/**用户基类**/
open class Person(name:String){
    /**次级构造函数**/
    constructor(name:String,age:Int):this(name){
        //初始化
        println("-------基类次级构造函数---------")
    }
}

/**子类继承 Person 类**/
class Student:Person{

    /**次级构造函数**/
    constructor(name:String,age:Int,no:String,score:Int):super(name,age){
        println("-------继承类次级构造函数---------")
        println("学生名： ${name}")
        println("年龄： ${age}")
        println("学生号： ${no}")
        println("成绩： ${score}")
    }
}

fun main(args: Array<String>) {
    var s =  Student("Runoob", 18, "S12345", 89)
}
/*
-------基类次级构造函数---------
-------继承类次级构造函数---------
学生名： Runoob
年龄： 18
学生号： S12345
成绩： 89

*/
```

# 8.Kotlin 接口

```kotlin
interface MyInterface {
    var name:String //name 属性, 抽象的
    fun bar()
    fun foo() {
        // 可选的方法体
        println("foo")
    }
}
class Child : MyInterface {
    override var name: String = "runoob" //重写属性
    override fun bar() {
        // 方法体
        println("bar")
    }
}
fun main(args: Array<String>) {
    val c =  Child()
    c.foo();
    c.bar();
    println(c.name)
}
```

# 9.Kotlin 扩展

## 扩展函数

> 扩展函数可以在已有类中添加新的方法，不会对原类做修改，扩展函数定义形式：

```kotlin
fun receiverType.functionName(params){
    body
}
```

> - receiverType：表示函数的接收者，也就是函数扩展的对象
> - functionName：扩展函数的名称
> - params：扩展函数的参数，可以为NULL

```kotlin
class User(var name:String)

/**扩展函数**/
fun User.Print(){
    print("用户名 $name")
}

fun main(arg:Array<String>){
    var user = User("Runoob")
    user.Print()
}

```

# 10.Kotlin 数据类与密封类

## ①数据类

> Kotlin 可以创建一个只包含数据的类，关键字为 **data**：

```kotlin
data class User(val name: String, val age: Int)
```

> 编译器会自动的从主构造函数中根据所有声明的属性提取以下函数：
>
> - `equals()` / `hashCode()`
> - `toString()` 格式如 `"User(name=John, age=42)"`
> - `componentN() functions` 对应于属性，按声明顺序排列
> - `copy()` 函数

> 如果这些函数在类中已经被明确定义了，或者从超类中继承而来，就不再会生成。
>
> 为了保证生成代码的一致性以及有意义，数据类需要满足以下条件：
>
> - 主构造函数至少包含一个参数。
> - 所有的主构造函数的参数必须标识为`val` 或者 `var` ;
> - 数据类不可以声明为 `abstract`, `open`, `sealed` 或者 `inner`;
> - 数据类可以继承普通类或实现接口，但自身不能声明为 `abstract`、`open`、`sealed` 或 `inner`。

```kotlin
data class User(val name: String, val age: Int)


fun main(args: Array<String>) {
    val jack = User(name = "Jack", age = 1)
    val olderJack = jack.copy(age = 2)
    println(jack)
    println(olderJack)

}
```

### [1]数据类以及解构声明

> 组件函数允许数据类在解构声明中使用：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") // prints "Jane, 35 years of age"
```

## ②密封类

> 密封类用来表示受限的类继承结构：当一个值为有限几种的类型, 而不能有任何其他类型时。在某种意义上，他们是枚举类的扩展：枚举类型的值集合 也是受限的，但每个枚举常量只存在一个实例，而密封类 的一个子类可以有可包含状态的多个实例。
>
> 声明密封类型使用 **sealed** 修饰类或接口。现代 Kotlin 允许直接子类型位于同一模块、同一包中，不必全部内嵌在父类型内部；早期 Kotlin 才要求它们嵌套。
>
> `sealed interface` 可以用于组合受控类型。密封类型不能直接实例化，也不应与 `open` 组合使用。

```kotlin
sealed class Expr
data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
```

> 使用密封类的关键好处在于使用 when 表达式 的时候，如果能够 验证语句覆盖了所有情况，就不需要为该语句再添加一个 else 子句了。

# 11. 集合：从保存数据到处理数据

Android 页面里经常要处理任务列表、导航项和接口返回的数据。Kotlin 的集合 API 可以把“取字段、过滤、排序、分组”写成一条可读的链。

## ①可变集合与只读集合

`listOf()`、`mapOf()` 和 `setOf()` 返回只读接口，适合描述一份不会被原地修改的数据；`mutableListOf()`、`mutableMapOf()` 返回可变集合。

```kotlin
val names = listOf("Android", "Kotlin", "Compose")
val scores = mutableMapOf("Kotlin" to 90, "Compose" to 85)
scores["Android"] = 95
```

“只读”不等于集合内部元素一定不可变，它只表示通过这个引用不能调用 `add()`、`remove()`。在 Compose 中，界面状态最好用不可变数据加替换整个集合的方式更新；需要可观察列表时，则使用 `mutableStateListOf()`，这两种情况不要混为一谈。

## ②常用集合操作符

| 操作符 | 作用 | 示例结果 |
| --- | --- | --- |
| `map` | 把每个元素转换成另一个值 | 列表长度不变 |
| `filter` | 保留符合条件的元素 | 列表可能变短 |
| `flatMap` | 转换后把多个集合合并成一个 | 适合嵌套列表 |
| `sortedBy` | 按属性升序排序 | 返回新列表 |
| `groupBy` | 按属性分组 | 返回 `Map` |
| `sumOf` | 对数值属性求和 | 返回数值 |
| `any` / `all` | 判断是否存在或是否全部满足 | 返回布尔值 |

```kotlin
data class Task(val title: String, val done: Boolean, val minutes: Int)

val tasks = listOf(
    Task("阅读 Compose", false, 30),
    Task("整理笔记", true, 20),
    Task("练习协程", false, 45)
)

val unfinished = tasks
    .filter { !it.done }
    .sortedByDescending { it.minutes }
    .map { it.title }

val totalMinutes = tasks.sumOf { it.minutes }
```

链式调用要从左往右读：先过滤，再排序，最后只保留标题。复杂链路可以换行，并把每一步的含义通过命名或注释表达出来；不要为了炫技把十几个操作塞在同一行。

## ③不可变数据与更新

数据类配合 `copy()`，可以让状态更新变得可追踪：

```kotlin
data class TodoUiState(
    val loading: Boolean = false,
    val tasks: List<Task> = emptyList(),
    val error: String? = null
)

val next = state.copy(loading = false, tasks = newTasks)
```

`copy()` 会创建新对象，旧状态保持不变。这种写法适合 Compose 重组、Flow 状态流和测试；如果集合本身是可变的，界面可能读不到你期待的变化，或者出现“内容改了但引用没变”的问题。

# 12. Lambda 与函数类型

Lambda 是“可以作为参数传递的代码块”。Compose 的点击回调、`items` 的内容 lambda 和协程启动器都大量使用它。

```kotlin
val add: (Int, Int) -> Int = { a, b -> a + b }
val onDone: () -> Unit = { println("完成") }

fun runTask(action: () -> Unit) {
    action()
}
```

函数类型的基本形式是 `(参数类型) -> 返回类型`。如果只有一个参数，可以使用 `it`；但参数含义不直观时，显式命名更清楚：

```kotlin
val titles = tasks.map { task -> task.title }
tasks.forEach { task ->
    println(task.title)
}
```

尾随 lambda 写法允许把最后一个函数参数移到括号外：

```kotlin
Button(onClick = { count++ }) {
    Text("点击 $count 次")
}
```

Compose 的 `Button` 第一个参数是 `onClick`，末尾还有一个 `content` 槽位；`{ Text(...) }` 就是内容 lambda。理解这一点后，阅读 Compose 组件签名会轻松很多。

# 13. 作用域函数：让对象配置更紧凑

Kotlin 提供 `let`、`run`、`with`、`apply`、`also` 五个常用作用域函数。它们都接收一个 lambda，区别主要在接收者、返回值和参数形式。

| 函数 | 接收者 | lambda 内引用 | 返回值 | 常见用途 |
| --- | --- | --- | --- | --- |
| `let` | `it` | `it` | lambda 最后一行 | 可空值处理、转换 |
| `run` | `this` | `this` | lambda 最后一行 | 基于对象计算 |
| `with` | `this` | `this` | lambda 最后一行 | 对同一对象执行多项操作 |
| `apply` | `this` | `this` | 原对象 | 配置对象属性 |
| `also` | `it` | `it` | 原对象 | 日志、附加校验 |

```kotlin
val user = User("Liu").apply { age = 20 }
val displayName = user.name
    .takeIf { it.isNotBlank() }
    ?.let { "用户：$it" }
    ?: "未登录"
```

选择原则：需要配置并继续链式调用时优先 `apply`；需要基于一个值做转换时用 `let`；需要在对象上下文中计算一个结果时用 `run`。不要把 `apply` 当成所有代码块的外壳，否则只会让作用域更难读。

# 14. 对象、伴生对象、枚举与密封类型

## ①`object`：只创建一个实例

`object` 声明的是单例。它适合保存无状态工具、常量入口或确实只应存在一个实例的对象：

```kotlin
object AppConfig {
    const val PAGE_SIZE = 20

    fun isDebugBuild(debuggable: Boolean): Boolean = debuggable
}

AppConfig.PAGE_SIZE
```

单例不是“所有东西都往里放的垃圾桶”。如果对象需要持有可变状态、依赖数据库或随页面生命周期变化，就应该交给 ViewModel、数据层或依赖注入容器管理。`object` 的初始化是懒加载的，但一旦创建就会在进程内长期存在，错误地缓存 `Activity`、`View` 或 `Context` 很容易造成内存泄漏。

对象表达式则用于临时创建匿名对象：

```kotlin
val listener = object : OnTaskChanged {
    override fun onChanged(title: String) {
        println(title)
    }
}
```

这和 Java 匿名内部类相似。Android 中更常见的简化写法是 SAM 转换或 lambda，能直接表达函数时不必刻意保留匿名对象。

## ②伴生对象：类级别的成员

`companion object` 是声明在类内部的特殊对象，可以通过类名访问，常用于工厂方法、常量或与类紧密相关的构造逻辑：

```kotlin
data class UserId(val value: String) {
    companion object {
        fun from(raw: String): UserId = UserId(raw.trim())
    }
}

val id = UserId.from("  42  ")
```

伴生对象不是 Java 的静态成员，只是 Kotlin 提供了接近静态调用的语法。若只是纯常量，优先考虑包级常量或顶层声明；若工厂需要依赖外部服务，也不要为了“看起来像静态方法”把依赖偷偷塞进伴生对象。

## ③枚举：有限且固定的值

枚举适合表示一组固定选项，例如任务优先级：

```kotlin
enum class Priority(val label: String) {
    LOW("低"),
    NORMAL("普通"),
    HIGH("高")
}

val priority = Priority.HIGH
println(priority.label)
```

枚举值在编译期固定，数量有限，适合直接参与 `when`、筛选和序列化映射。若值需要携带更多动态数据，或不同分支拥有不同结构，密封类型通常更灵活。

## ④密封接口与密封类：受控的类型集合

密封类型强调“所有实现都在同一模块的受控范围内”。它很适合建模加载状态：

```kotlin
sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Success<T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}

fun render(state: UiState<List<String>>) = when (state) {
    UiState.Loading -> "加载中"
    is UiState.Success -> "共 ${state.data.size} 项"
    is UiState.Error -> state.message
}
```

这里使用 `sealed interface`，比传统 `sealed class` 更容易组合接口。密封类型的子类型不必全部嵌套在父类型内部；它们只需位于同一模块并遵守语言规则。把状态写成 `Loading / Success / Error` 后，`when` 能帮助检查是否漏掉分支，也比用多个互不相关的布尔值更不容易出现矛盾状态。

# 15. 空安全与扩展函数在 Android 中的用法

## ①可空性属于类型

Kotlin 在类型层面区分 `String` 与 `String?`。可空值不能直接调用成员，必须先做判断、安全调用或显式断言：

```kotlin
fun greeting(name: String?): String {
    val safeName = name?.trim().orEmpty()
    return if (safeName.isBlank()) "你好，访客" else "你好，$safeName"
}
```

常用操作可以按目的区分：

| 写法 | 作用 | 注意点 |
| --- | --- | --- |
| `value?.length` | 安全调用 | 结果仍可能为 `null` |
| `value ?: fallback` | 提供默认值 | 不要用空字符串掩盖业务错误 |
| `value?.let {}` | 仅非空时执行 | `let` 适合短转换，不适合层层嵌套 |
| `value!!` | 断言非空 | 断言失败会抛异常，业务代码尽量不用 |
| `requireNotNull(value)` | 参数校验并抛异常 | 适合表达调用者违反了契约 |

Android 中来自 Intent、网络、数据库或资源的数据都可能是 `null`。不要用一串 `!!` 把问题推迟到运行时，而应在数据边界尽早校验并转换成稳定的 UI 状态。

##②扩展函数：给已有类型补充行为

扩展函数不能修改原类，也不能访问其私有成员，但可以让调用点更自然：

```kotlin
fun String.toDisplayName(): String =
    trim().ifBlank { "匿名用户" }

fun Int.toDpText(): String = "${this}dp"

val name = "  Compose  ".toDisplayName()
```

扩展函数本质上是静态函数，接收者作为第一个参数传入。导入时要注意来源；同名扩展过多时，调用点可能很难看出实际执行哪一个。扩展属性也不能保存真正的字段，只能通过 getter/setter 计算：

```kotlin
val String.isHttpUrl: Boolean
    get() = startsWith("https://") || startsWith("http://")
```

扩展适合无状态转换和领域语义，不适合把复杂业务逻辑藏进一个看似简单的点号调用。

# 16. 协程：把异步流程写成顺序代码

##①`suspend` 函数表示可能挂起

协程可以让异步代码保留“从上到下”的阅读顺序。`suspend` 函数只能在协程或其他挂起函数中调用：

```kotlin
suspend fun loadTitle(): String {
    delay(500)
    return "远程标题"
}

suspend fun showTitle() {
    val title = loadTitle()
    println(title)
}
```

`delay` 会挂起协程，不会阻塞线程。真正的网络或数据库调用是否适合放到协程，还要看 API 本身是否支持取消，以及调用应运行在哪个 Dispatcher 上。

##②`launch` 与 `async`

`CoroutineScope.launch` 启动一个不直接返回结果的协程；`async` 返回 `Deferred<T>`，需要时用 `await()` 取结果：

```kotlin
scope.launch {
    val first = async { loadTitle() }
    val second = async { loadTitle() }
    println(first.await() + second.await())
}
```

并发启动不代表可以忽略失败。结构化并发要求子任务归属于父作用域：父协程取消时，子任务也应被取消；其中一个子任务失败时，按作用域配置可能取消整个协程树。页面离开时不能留下无人管理的后台任务。

##③Dispatcher、取消与异常

常见 Dispatcher 包括：

| Dispatcher | 适合的工作 |
| --- | --- |
| `Dispatchers.Main` | 更新 UI 状态、调用主线程 API |
| `Dispatchers.IO` | 阻塞式文件、数据库或网络读写 |
| `Dispatchers.Default` | CPU 密集型计算 |

现代挂起 API 往往已经处理好线程切换，不要机械地在每一行前后包 `withContext`。在 Android UI 中，更新 State 应回到主线程；具体耗时工作由数据层或合适的 Dispatcher 完成。

协程取消是协作式的。代码要尊重 `ensureActive()` 或挂起点抛出的 `CancellationException`，不要把它当成普通错误吞掉：

```kotlin
scope.launch {
    try {
        loadTitle()
    } catch (e: CancellationException) {
        throw e
    } catch (e: Exception) {
        showError(e.message)
    }
}
```

##④`viewModelScope` 与 `rememberCoroutineScope`

`viewModelScope` 随 ViewModel 存活，适合页面数据加载和业务请求；`rememberCoroutineScope` 随 Composable 离开组合而取消，适合由点击、滚动等 UI 事件启动的短任务：

```kotlin
@Composable
fun SaveButton(onSave: suspend () -> Unit) {
    val scope = rememberCoroutineScope()
    Button(onClick = { scope.launch { onSave() } }) {
        Text("保存")
    }
}
```

这里的 `onSave` 只是 UI 层回调示例，真实业务通常交给 ViewModel。不要在 Composable 函数体中直接调用 `launch` 或发起请求；重组可能重复执行函数体。需要随组合启动的工作放到 `LaunchedEffect`，由事件触发的工作用 `rememberCoroutineScope`。

##⑤协程与 Flow 的边界

协程描述一次异步执行，Flow 描述可连续发出多个值的数据流。ViewModel 常用 `StateFlow` 暴露 UI 状态，网络或数据库层可能返回 `Flow`。本系列不展开 Flow 的完整操作符；现阶段只需记住：Flow 的收集也要在受控作用域中完成，Android UI 应使用生命周期感知的收集方式，而不是无条件在 Composable 中自行收集。

# 17. Android 开发中的 Kotlin 习惯

##①用小数据类表达领域值

```kotlin
data class Task(
    val id: Long,
    val title: String,
    val done: Boolean = false
)
```

数据类适合承载稳定的值对象和 UI 状态。不要在数据类里放可变的全局缓存；更新时用 `copy()` 产生新值，便于 Compose 和状态流比较。

##②用`when`表达完整分支

对枚举、密封类型和业务状态优先使用 `when`，并在需要时让编译器检查穷尽性。大量互斥布尔值会制造“同时加载和失败”的非法状态，状态模型应该让非法组合无法表示。

##③让函数保持小而可测试

优先写只依赖参数的函数，把网络、数据库和 UI 副作用推到边界。一个函数同时读全局变量、发请求、改缓存并弹提示，测试和排错都会变难。依赖通过参数或构造函数传入，Android 项目才能逐步形成可替换的数据层。

##④命名表达意图

`data`、`list`、`state` 只能说明类型，不能说明业务含义。用 `unfinishedTasks`、`isSaving`、`onTaskChecked` 这类名字，让调用方不需要猜。Compose 回调通常以 `on` 开头，状态参数则用名词或形容词。

# 18. Kotlin 复习清单

| 主题 | 应能回答的问题 |
| --- | --- |
| 类型与空安全 | `String?` 与 `String` 有何区别？什么时候用 `let`、`?:` 或 `requireNotNull`？ |
| 集合 | 只读集合是否真的不可变？`map`、`filter`、`sumOf` 分别返回什么？ |
| 面向对象 | 主构造函数、继承、接口和伴生对象如何协作？ |
| 对象模型 | `object` 单例何时会长期持有引用？枚举和密封类型分别适合什么状态？ |
| Lambda | 函数类型、尾随 lambda 和 `it` 如何阅读？ |
| 作用域函数 | `let`、`apply`、`run` 的接收者与返回值有什么不同？ |
| 协程 | `suspend`、`launch`、`async` 和取消分别解决什么问题？ |
| Android 边界 | 哪些代码应放进 ViewModel、数据层或 Composable？ |

如果这些概念还不稳，先回到 Compose 的 `@Composable` 和状态章节，观察 Kotlin 的 lambda、数据类与协程如何落到真实 UI。下一篇从项目创建、Gradle、Manifest 和 Activity 启动流程开始，把语言知识放回 Android 工程。

> 系列导航：**1/4 Kotlin 基础与进阶** · [2/4 Android 基础与工程化](/article/Android基础与工程化) · [3/4 Android Compose 总结](/article/Android-Compose学习总结) · [4/4 Android 进阶篇](/article/Android进阶篇)
