---
title: Kotlin基础的学习
date: 2024-12-30
tags: [Kotlin, 基础学习]
description: Kotlin的基础学习
pinned: false
---

Kotlin的基础学习

# 1.Frist Kotlin

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

public fun sum(a: Int, b: Int): Int = a + b   // public 方法则必须明确写出返回类型
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

> 类似于 ？↓

```vue
<script setup>
    const SumAdd = (a, b) => {return a + b}
    console.log(SumAdd(1, 2))  // 输出 3
</script>
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

```
loop@ for (i in 1..100) {
    // ……
}
```



> 现在，我们可以用标签限制 break 或者continue：

```
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

```
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

```
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
> - 数据类不能继承其他类 (但是可以实现接口)。

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
> 声明一个密封类，使用 **sealed** 修饰类，密封类可以有子类，但是所有的子类都必须要内嵌在密封类中。
>
> sealed 不能修饰 interface ,abstract class(会报 warning,但是不会出现编译错误)

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
