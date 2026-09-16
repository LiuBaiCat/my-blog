---
title: Java基础的学习
date: 2024-12-02
updatetime: 2026-09-16
tags: [Java, 基础学习, 面向对象]
description: Java基础的学习
pinned: false
---
# Java基础的学习
## 一、基础操作
### 1.Hello world
```java
package a001;
public class Hello {
	public static void main(String[] args) {
		System.out.println("Hello World!");
	}
}
```
### 2.变量与数据类型

Java 是强类型语言，每个变量都必须先声明类型再赋值。8 种基本数据类型：

| 类型 | 占用 | 取值范围 | 默认值 |
|---|---|---|---|
| `byte` | 1 字节 | -128 ~ 127 | 0 |
| `short` | 2 字节 | -32768 ~ 32767 | 0 |
| `int` | 4 字节 | -2^31 ~ 2^31-1 | 0 |
| `long` | 8 字节 | -2^63 ~ 2^63-1 | 0L |
| `float` | 4 字节 | 约 ±3.4×10^38 | 0.0f |
| `double` | 8 字节 | 约 ±1.7×10^308 | 0.0d |
| `char` | 2 字节 | 0 ~ 65535（Unicode） | 0（NUL） |
| `boolean` | 1 字节 | true / false | false |

`long` 字面量要加后缀 `L`，`float` 要加 `f`，否则默认按 `int` / `double` 处理。

```java
package a001;
public class VarDemo {
	public static void main(String[] args) {
		int age = 18;
		long population = 8000000000L;   // 不加 L 会编译报错：整数过大
		float pi = 3.14f;                // 不加 f 会报错：不兼容的类型 double 转换到 float
		double score = 95.5;
		char grade = 'A';
		boolean pass = true;
		String name = "小明";             // 引用类型，不是基本类型
		System.out.println(name + " " + age + " " + grade + " " + pass + " " + pi + " " + score + " " + population);
	}
}
```

变量使用前必须初始化，局部变量没有默认值。`final` 修饰的变量只能赋值一次，即常量：

```java
final double PI = 3.1415926;
// PI = 3.14;  // 编译报错：无法为 final 变量赋值
```

### 3.运算符

```java
package a001;
public class OperatorDemo {
	public static void main(String[] args) {
		int a = 7, b = 2;
		System.out.println(a + b);   // 9
		System.out.println(a - b);   // 5
		System.out.println(a * b);   // 14
		System.out.println(a / b);   // 3  整数相除向下取整，不是 3.5
		System.out.println(a % b);   // 1
		System.out.println(7.0 / 2); // 3.5 有 double 参与才保留小数

		// 自增自减
		int i = 1;
		System.out.println(i++);     // 1 先用后加
		System.out.println(i);       // 2
		System.out.println(++i);     // 3 先加后用

		// 复合赋值，隐含强制类型转换
		short s = 1;
		s += 1;                      // 等价于 s = (short)(s + 1)，不会报错

		// 字符串拼接：+ 只要有一边是字符串，就变成拼接
		System.out.println("1 + 2 = " + 1 + 2);   // 1 + 2 = 12
		System.out.println("1 + 2 = " + (1 + 2)); // 1 + 2 = 3
	}
}
```

逻辑运算符存在**短路**特性：`&&` 左边为 false 时右边不再计算，`||` 左边为 true 时右边不再计算。

```java
int x = 5;
boolean r = x > 10 && x++ > 0;  // 左边已是 false，x++ 根本不执行
System.out.println(x);          // 5，而不是 6
```

位运算按二进制逐位操作，日常业务少用，读源码时常见：

```java
System.out.println(6 & 3);   // 2  按位与
System.out.println(6 | 3);   // 7  按位或
System.out.println(6 ^ 3);   // 5  按位异或
System.out.println(~6);      // -7 按位取反
System.out.println(2 << 3);  // 16 左移 3 位，等价于 2 * 2^3
System.out.println(16 >> 3); // 2  右移 3 位，等价于 16 / 2^3
```

### 4.基础运算
```java
package a001;
public class SumN {
	public static void main(String[] args) {
		int n = 100;
		int sum1 = (1 + n) * n / 2;
		int sum2 = 0;
		for (int i = 1; i <= n; i++) {
			sum2 += i;
		}
		System.out.println(sum1);
		System.out.println(sum2);
	}
}
```
### 5.数学运算
```java
package a001;
public class OneYuanErCi {
	public static void main(String[] args) {
		double a = 1.0;
		double b = 3.0;
		double c = -4.0;
		double r1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		double r2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		System.out.println(r1);
		System.out.println(r2);
		System.out.println(r1 == 1 && r2 == -4 ? "测试通过" : "测试失败");
	}
}
```
### 6.布尔运算
```java
package a001;
public class IsAge {
	public static void main(String[] args) {
		int age = 7;
		boolean isPrimaryStudent = age >= 6 && age <= 12;
		System.out.println(isPrimaryStudent ? "Yes" : "No");
	}
}
```
### 7.String的指向
```java
package a001;
public class StringZhiXiang {
	public static void main(String[] args) {
		String s = "hello";
		String t = s;
		s = "world";
		System.out.println(t); 
		// t是"hello",不是"world"
	}
}
```
### 8.类型转换
```java
package a001;
public class IntToChar {
	public static void main(String[] args) {
		// 请将下面一组int值视为字符的Unicode码，把它们拼成一个字符串：
		// int a = 72;
		// int b = 105;
		// int c = 65281;
		char a = 72;
		char b = 105;
		char c = 65281;
		String s = "" + a + b + c;
		System.out.println(s);
	}
}
```
### 9.自动类型转换与强制类型转换

**自动类型转换**：小范围类型可以自动提升为大范围类型，`byte → short → int → long → float → double`，`char` 可以提升为 `int`。

```java
int i = 100;
long l = i;        // 自动
double d = i;      // 自动
char c = 'A';
int code = c;      // 自动，得到 65
```

**强制类型转换**：大范围转小范围必须显式加括号，可能丢失精度或溢出。

```java
double d = 3.99;
int i = (int) d;        // 3，直接截断小数，不是四舍五入
long big = 300L;
byte b = (byte) big;    // 44，溢出后按低位截取，结果无意义
```

表达式中的类型提升规则：`byte`、`short`、`char` 参与运算时会先提升为 `int`，所以下面的写法会编译报错。

```java
byte b1 = 10;
byte b2 = 20;
byte b3 = b1 + b2;        // 编译报错：不兼容的类型，int 无法转换为 byte
int b4 = b1 + b2;         // 正确
byte b5 = (byte) (b1 + b2); // 强制转换后正确
```

### 10.流程控制

`if` / `else if` / `else`，`for` 已在前面用过，这里补齐其余分支与循环。

```java
package a001;
public class FlowDemo {
	public static void main(String[] args) {
		int score = 85;

		// if - else if - else
		if (score >= 90) {
			System.out.println("优秀");
		} else if (score >= 60) {
			System.out.println("及格");
		} else {
			System.out.println("不及格");
		}

		// switch：case 穿透，漏写 break 会继续往下执行
		int day = 3;
		switch (day) {
			case 1:
			case 2:
			case 3:
				System.out.println("工作日");
				break;
			default:
				System.out.println("休息日");
		}

		// switch 表达式（Java 14+），箭头语法不会穿透
		String type = switch (day) {
			case 6, 7 -> "周末";
			default -> "工作日";
		};
		System.out.println(type);

		// while：先判断后执行
		int n = 0;
		while (n < 3) {
			System.out.println("while " + n);
			n++;
		}

		// do-while：先执行后判断，至少执行一次
		int m = 10;
		do {
			System.out.println("do-while " + m);
			m++;
		} while (m < 3);
	}
}
```

`break` 跳出整个循环，`continue` 跳过本次进入下一次，`return` 直接结束方法。

```java
for (int i = 1; i <= 10; i++) {
	if (i == 3) continue;   // 跳过 3
	if (i == 6) break;      // 到 6 结束
	System.out.println(i);  // 1 2 4 5
}
```

嵌套循环中，可以用**标签**让 `break` 跳出外层循环：

```java
outer:
for (int i = 0; i < 3; i++) {
	for (int j = 0; j < 3; j++) {
		if (j == 1) break outer;  // 直接跳出两层
		System.out.println(i + "," + j);
	}
}
```

增强 for（for-each）不能用于需要索引或修改数组元素的场景：

```java
int[] ns = {1, 2, 3};
for (int n : ns) {
	n = n * 2;  // 只改副本，原数组不变
}
System.out.println(Arrays.toString(ns));  // [1, 2, 3]
```

### 11.输入Scanner
```java
package a001;
import java.util.Scanner;
public class InputScanner {
	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in); // 创建Scanner对象
		System.out.print("Input your name: "); // 打印提示
		String name = scanner.nextLine(); // 读取一行输入并获取字符串
		System.out.print("Input your age: "); // 打印提示
		int age = scanner.nextInt(); // 读取一行输入并获取整数
		System.out.printf("Hi, %s, you are %d years old\n", name, age); // 格式化输出
		scanner.close();
	}
}
```
### 12.Random

```java
package a001;
import java.util.Random;

public class RandomDemo {
	public static void main(String[] args) {
		Random r = new Random();
		System.out.println(r.nextInt());        // 全范围的 int，含负数
		System.out.println(r.nextInt(10));      // 0 ~ 9
		System.out.println(r.nextDouble());     // 0.0 ~ 1.0
		System.out.println(r.nextBoolean());    // true / false

		// 生成 1 ~ 100 之间的随机数
		int n = r.nextInt(100) + 1;
		System.out.println(n);

		// 固定种子，每次运行结果相同，方便复现问题
		Random r2 = new Random(42);
		System.out.println(r2.nextInt(100));
	}
}
```

`Math.random()` 返回 `double`，等价于 `0.0 <= x < 1.0`，需要整数范围时自己算：

```java
int n = (int) (Math.random() * 100) + 1;  // 1 ~ 100
```

### 13.数组的输出
```java
package a001;
import java.util.Arrays;
public class OutArray {
	public static void main(String[] args) {
		int[] ns = { 1, 1, 2, 3, 5, 8 };
		// 1.
		for (int n : ns) System.out.print(n + ", ");
		//-------------------------------------------------
		System.out.println();
		// 2.
        System.out.println(Arrays.toString(ns));
	}
}
```
### 14.数组排序
```java
package a001;
import java.util.Arrays;
public class SortPaiXu {
	public static void main(String[] args) {
		// TODO 自动生成的方法存根
		int[] ns = { 28, 12, 89, 73, 65, 18, 96, 50, 8, 36 };
		// 排序前:
		System.out.println(Arrays.toString(ns));
		for (int i = 0; i < ns.length - 1; i++) {
			for (int j = 0; j < ns.length - i - 1; j++) {
				if (ns[j] > ns[j + 1]) {
					// 交换ns[j]和ns[j+1]:
					int tmp = ns[j];
					ns[j] = ns[j + 1];
					ns[j + 1] = tmp;
				}}}
		// 排序后:
		System.out.println(Arrays.toString(ns));
		// ---------------------------------------------------
        int[] ns2 = { 28, 12, 89, 73, 65, 18, 96, 50, 8, 36 };
        Arrays.sort(ns2);
        System.out.println(Arrays.toString(ns2));
	}
}
```


### 15.二维数组

```java
package a001;
import java.util.Arrays;

public class Array2DDemo {
	public static void main(String[] args) {
		// 声明与初始化
		int[][] ns = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
		System.out.println(ns[1][2]);        // 6
		System.out.println(ns.length);       // 3，行数
		System.out.println(ns[0].length);    // 3，第一行的列数

		// 动态初始化，每行长度可以不同（锯齿数组）
		int[][] jagged = new int[3][];
		jagged[0] = new int[] {1};
		jagged[1] = new int[] {1, 2};
		jagged[2] = new int[] {1, 2, 3};

		// 嵌套 for 遍历
		for (int i = 0; i < ns.length; i++) {
			for (int j = 0; j < ns[i].length; j++) {
				System.out.print(ns[i][j] + " ");
			}
			System.out.println();
		}

		// 增强 for 遍历
		for (int[] row : ns) {
			System.out.println(Arrays.toString(row));
		}
	}
}
```

### 16.Arrays工具类

`java.util.Arrays` 提供了一组操作数组的静态方法，注意它只操作**一维**数组。

```java
package a001;
import java.util.Arrays;

public class ArraysDemo {
	public static void main(String[] args) {
		int[] ns = {3, 1, 4, 1, 5};

		System.out.println(Arrays.toString(ns));            // [3, 1, 4, 1, 5]
		Arrays.sort(ns);
		System.out.println(Arrays.toString(ns));            // [1, 1, 3, 4, 5]

		// 二分查找，必须先排序，返回索引，找不到返回负数
		System.out.println(Arrays.binarySearch(ns, 4));     // 3

		// 复制，超过原长度补默认值，不足则截断
		int[] longer = Arrays.copyOf(ns, 8);
		System.out.println(Arrays.toString(longer));        // [1, 1, 3, 4, 5, 0, 0, 0]
		int[] range = Arrays.copyOfRange(ns, 1, 3);
		System.out.println(Arrays.toString(range));         // [1, 3]

		// 全部填充
		int[] filled = new int[5];
		Arrays.fill(filled, 7);
		System.out.println(Arrays.toString(filled));        // [7, 7, 7, 7, 7]

		// 比较内容是否相等，不能直接用 ==（比的是引用地址）
		System.out.println(Arrays.equals(ns, new int[] {1, 1, 3, 4, 5}));  // true

		// 转成 List（固定长度，不能 add/remove）
		System.out.println(Arrays.asList("a", "b", "c"));
	}
}
```

`Arrays.sort` 只能给基本类型和实现了 `Comparable` 的类排序。自定义对象需要传比较器：

```java
String[] names = {"Bob", "Alice", "Grace"};
Arrays.sort(names);                                   // 字典序
Arrays.sort(names, (a, b) -> b.compareTo(a));         // 反序
```

### 17.System.arraycopy

`System.arraycopy(源数组, 源起始索引, 目标数组, 目标起始索引, 复制长度)`，是底层实现的高效复制。

```java
package a001;
import java.util.Arrays;

public class ArrayCopyDemo {
	public static void main(String[] args) {
		int[] src = {1, 2, 3, 4, 5};
		int[] dest = new int[5];

		// 把 src 从索引 1 开始的 3 个元素，复制到 dest 的索引 2 开始处
		System.arraycopy(src, 1, dest, 2, 3);
		System.out.println(Arrays.toString(dest));  // [0, 0, 2, 3, 4]

		// 同数组内也可以复制，常用于删除/插入元素时的整体移位
		int[] arr = {1, 2, 3, 4, 5};
		System.arraycopy(arr, 2, arr, 1, 3);        // 把 3,4,5 左移到 1 的位置
		System.out.println(Arrays.toString(arr));   // [1, 3, 4, 5, 5]
	}
}
```

## 二、面向对象
### 1.class
```java
package faceToProgarm;
public class CityMain {
	public static void main(String[] args) {
		City bj = new City("Beijing", 39.903, 116.401);
		// bj.name = "Beijing";
		// bj.latitude = 39.903;
		// bj.longitude = 116.401;
		System.out.println(bj.name);
		System.out.println("location: " + bj.latitude + ", " + bj.longitude);
	}
}

class City {
	String name;
	double latitude;// 纬度
	double longitude;// 经度

	public City(String name, double latitude, double longitude) {
		super();
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
}
```
### 2.封装

封装指把字段私有化（`private`），只通过公开方法（getter/setter）访问。好处是能在方法里加校验，外部无法把字段直接改成非法值。

```java
package faceToProgarm;

public class DogMain {
	public static void main(String[] args) {
		Dog dog = new Dog("旺财", 3);
		System.out.println(dog);           // Dog{name=旺财, age=3}

		dog.setAge(-5);                    // 校验拦住，没有真的写进去
		System.out.println(dog.getAge());  // 3
	}
}

class Dog {
	private String name;
	private int age;

	public Dog(String name, int age) {
		this.name = name;
		setAge(age);                       // 构造方法里也走 setter，保证校验生效
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		if (age < 0) {
			throw new IllegalArgumentException("年龄不能为负数: " + age);
		}
		this.age = age;
	}

	@Override
	public String toString() {
		return "Dog{name=" + name + ", age=" + age + "}";
	}
}
```

`@Override` 是注解，作用是让编译器确认这里确实重写了父类（或 `Object`）的方法，方法名写错会直接编译报错。

`toString()` 的默认实现是「类名@哈希码」，直接 `println(对象)` 不会输出字段值，必须自己重写。`Object` 中另外两个常被重写的方法是 `equals()` 和 `hashCode()`，集合章节会用到。

### 3.方法重载(同名方法)
```java
package faceToProgarm;
public class HelloMain {
	public static void main(String[] args) {
		// TODO 自动生成的方法存根
		Hello h = new Hello();
		h.hello();
		h.hello("小明");
		h.hello("小明",15);
	}
}

class Hello {
	public void hello() {
		System.out.println("Hello, world!");
	}
	public void hello(String name) {
		System.out.println("Hello, " + name + "!");
	}
	public void hello(String name, int age) {
		if (age < 18) {
			System.out.println("Hi, " + name + "!");
		} else {
			System.out.println("Hello, " + name + "!");
		}
	}
}
```
### 4.继承
```java
package faceToProgarm;
public class PersonStudentMain {
	public static void main(String[] args) {
		// TODO 自动生成的方法存根
		Student s = new Student("Xiao Ming", 12, 89);
		System.out.println(s.hello());
	}
}

class Person {
	protected String name;
	protected int age;

	public Person(String name, int age) {
		this.name = name;
		this.age = age;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
}

class Student extends Person {
	protected int score;
	public Student(String name, int age, int score) {
		super(name, age);
		this.score = score;
	}
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
	}
	public String hello() {
		return "Hello, " + name; // OK!
	}
}
```
### 5.多态
```java
package faceToProgarm;

class Person2 {
	public void run() {
		System.out.println("Person.run");
	}
}

class Student2 extends Person2 {
	@Override
	public void run() {
		System.out.println("Student.run");
	}
}

public class DuoTaiPerStu {
	public static void main(String[] args) {
		// TODO 自动生成的方法存根
		Person2 p = new Student2();
        p.run();
        // Student.run
	}
}
```
### 6.抽象类
```java
package faceToProgarm;
public class ChouXiangLei {
	public static void main(String[] args) {
		// TODO 自动生成的方法存根
		Person3 p1 = new Student3();
        p1.run();
		Person3 p2 = new Teacher3();
        p2.run();
	}
}
abstract class Person3 {
    public abstract void run();
}
class Student3 extends Person3 {
    @Override
    public void run() {
        System.out.println("Student.run");
    }
}
class Teacher3 extends Person3 {
    @Override
    public void run() {
        System.out.println("Teacher.run");
    }
}
```

### 7.接口

如果一个抽象类没有字段，所有方法全部都是抽象方法：

```java
abstract class Person {
    public abstract void run();
    public abstract String getName();
}
```

抽象类 → 接口（去掉 `abstract` 关键字，`class` 换成 `interface`）

```java
interface Person {
    void run();
    String getName();
}
```
-----------------------------
```java
package faceToProgarm;
public class JieKouLei {
	public static void main(String[] args) {
		Person4 p = new Student4("xiaoming");
		p.run();
	}
}
interface Person4 {
    void run();
    String getName();
}
class Student4 implements Person4 {
    private String name;
    public Student4(String name) {
        this.name = name;
    }
    @Override
    public void run() {
        System.out.println(this.name + " run");
    }
    @Override
    public String getName() {
        return this.name;
    }
}
```

### 8.抽象类与接口的组合使用

一个类只能继承一个父类，但可以实现多个接口。实际开发里常见「抽共性用抽象类 + 加能力用接口」的组合。

```java
package faceToProgarm;

public class SportMain {
	public static void main(String[] args) {
		// 接口作为方法形参，任何实现了 Swim 的对象都能传进来
		goSwimming(new PingPangSporter("小明", 18));
		goSwimming(new Frog());
	}

	static void goSwimming(Swim s) {
		s.swim();
	}
}

abstract class Person5 {
	protected String name;
	protected int age;

	public Person5(String name, int age) {
		this.name = name;
		this.age = age;
	}
}

// 抽象类可以继承抽象类，形成多级继承
abstract class Sporter extends Person5 {
	public Sporter(String name, int age) {
		super(name, age);
	}
	public abstract void study();
}

interface Swim {
	void swim();
}

// 同时继承抽象类 + 实现接口
class PingPangSporter extends Sporter implements Swim {
	public PingPangSporter(String name, int age) {
		super(name, age);
	}
	@Override
	public void study() {
		System.out.println(name + " 学打乒乓球");
	}
	@Override
	public void swim() {
		System.out.println(name + " 在用蛙泳");
	}
}

// 不是所有子类都会游泳，不实现 Swim 接口即可
class BasketballSporter extends Sporter {
	public BasketballSporter(String name, int age) {
		super(name, age);
	}
	@Override
	public void study() {
		System.out.println(name + " 学打篮球");
	}
}

// 接口也可以被别的类实现，不要求有共同父类
class Frog implements Swim {
	@Override
	public void swim() {
		System.out.println("青蛙在游泳");
	}
}
```

### 9.接口的 default 与 static 方法

接口在 Java 8 之后可以有方法体，但必须显式标注 `default` 或 `static`。`default` 方法是给实现类的默认实现，类可以覆盖也可以不覆盖；`static` 方法只能通过接口名调用。

```java
package faceToProgarm;

interface Greeting {
	void hi();

	// 默认方法，实现类可以不写
	default void bye() {
		System.out.println("byebye");
	}

	// 静态方法，只能用 Greeting.info() 调用
	static void info() {
		System.out.println("我是 Greeting 接口");
	}
}

class Chinese implements Greeting {
	@Override
	public void hi() {
		System.out.println("你好");
	}
}

class Main {
	public static void main(String[] args) {
		Greeting g = new Chinese();
		g.hi();             // 你好
		g.bye();            // byebye，用的是接口的默认实现
		Greeting.info();    // 我是 Greeting 接口
	}
}
```

如果一个类同时实现两个接口，而两个接口有同名的 `default` 方法，编译器会报错，必须在类中重写该方法并明确用 `接口名.super.方法名()` 指定用哪一个。

### 10.访问修饰符

| 修饰符 | 本类 | 同包 | 子类 | 任意位置 |
|---|---|---|---|---|
| `private` | 可以 | 不可以 | 不可以 | 不可以 |
| 默认（不写） | 可以 | 可以 | 不可以 | 不可以 |
| `protected` | 可以 | 可以 | 可以 | 不可以 |
| `public` | 可以 | 可以 | 可以 | 可以 |

经验做法：字段一律 `private`，需要被子类直接用才写 `protected`，方法默认给 `public`，工具方法给 `public static`。

### 11.代码块与final

静态代码块在类加载时执行一次，实例代码块每次创建对象时执行，且都在构造方法之前。

```java
package faceToProgarm;

public class BlockDemo {
	public static void main(String[] args) {
		System.out.println("main 开始");
		new Block();
		System.out.println("---");
		new Block();
	}

	static {
		System.out.println("静态代码块，只在类加载时执行一次");
	}

	{
		System.out.println("实例代码块，每次 new 都执行");
	}

	public BlockDemo() {
		System.out.println("BlockDemo 构造方法");
	}
}

class Block {
	{
		System.out.println("实例代码块");
	}

	public Block() {
		System.out.println("构造方法");
	}
}
// 输出顺序：静态代码块 → main 开始 → 实例代码块 → 构造方法 → --- → 实例代码块 → 构造方法
```

`final` 的三种用法：

```java
final int MAX = 100;              // 修饰变量：只能赋值一次，即常量
// final class A {}               // 修饰类：不能被继承
// public final void run() {}     // 修饰方法：不能被子类重写
```

`static final` 一起用就是常量，命名习惯全大写加下划线：

```java
public static final double PI = 3.1415926;
```

### 12.静态方法

实例字段在每个实例中都有自己的一个独立“空间”，但是静态字段只有一个共享“空间”，所有实例都会共享该字段。

对于静态字段，无论修改哪个实例的静态字段，效果都是一样的：所有实例的静态字段都被修改了，原因是静态字段并不属于实例。

接口的静态字段：

```java
public interface Person {
    public static final int MALE = 1;
    public static final int FEMALE = 2;
}
// ===》
public interface Person {
    // 编译器会自动加上public static final:
    int MALE = 1;
    int FEMALE = 2;
}
```

### 13.内部类

```java
// inner class
public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer("Nested"); // 实例化一个Outer
        Outer.Inner inner = outer.new Inner(); // 实例化一个Inner
        inner.hello();
    }
}

class Outer {
    private String name;

    Outer(String name) {
        this.name = name;
    }

    class Inner {
        void hello() {
            System.out.println("Hello, " + Outer.this.name);
        }
    }
}
```

### 14.成员内部类的变量遮蔽

内部类里访问同名变量时，按「局部变量 → 内部类成员 → 外部类成员」由近到远查找，要跳级访问必须加限定。

```java
package faceToProgarm;

public class ShadowMain {
	public static void main(String[] args) {
		new Outer2().new Inner2().show();
		// 输出：10 → 20 → 30
	}
}

class Outer2 {
	private int a = 10;

	class Inner2 {
		private int a = 20;

		void show() {
			int a = 30;
			System.out.println(a);          // 30 局部变量，就近原则
			System.out.println(this.a);     // 20 内部类的成员
			System.out.println(Outer2.this.a); // 10 外部类的成员，必须加 外部类名.this
		}
	}
}
```

### 15.静态内部类

`static` 修饰的内部类不依赖外部类对象，可以直接 `new 外部类.内部类()`。代价是只能访问外部类的静态成员。

```java
package faceToProgarm;

public class StaticInnerMain {
	public static void main(String[] args) {
		Outer3.Inner3 inner = new Outer3.Inner3();  // 不需要先 new Outer3
		inner.show();
		Outer3.Inner3.show2();                      // 内部类的静态方法直接调用
	}
}

class Outer3 {
	private static String school = "黑马";
	private String name = "小明";                    // 非静态，内部类访问不到

	static class Inner3 {
		void show() {
			System.out.println("静态内部类访问外部类静态成员: " + school);
			// System.out.println(name);  // 编译报错：无法从静态上下文中引用非静态变量
		}

		static void show2() {
			System.out.println("静态内部类的静态方法");
		}
	}
}
```

创建方式对比：

| 类型 | 创建语法 | 能否访问外部类非静态成员 |
|---|---|---|
| 成员内部类 | `outer.new Inner()` | 可以 |
| 静态内部类 | `new Outer.Inner()` | 不可以 |

### 16.匿名内部类

不想为一个只用一次的实现专门建一个 `.java` 文件时，可以用匿名内部类。写法是 `new 接口名() { 重写方法 }`，本质上创建了一个没有名字的子类对象。

```java
package faceToProgarm;

public class AnonMain {
	public static void main(String[] args) {
		// 写法一：直接作为实参传入
		goSwimming(new Swim2() {
			@Override
			public void swim() {
				System.out.println("学生在游泳");
			}
		});

		// 写法二：先赋值给接口引用，再传入
		Swim2 s = new Swim2() {
			@Override
			public void swim() {
				System.out.println("老师在游泳");
			}
		};
		goSwimming(s);
	}

	// 接口作为方法形参
	static void goSwimming(Swim2 s) {
		s.swim();
	}
}

interface Swim2 {
	void swim();
}
```

编译后会产生 `AnonMain$1.class`、`AnonMain$2.class`，说明匿名内部类确实各自生成了一个类文件。

匿名内部类在 Java 8 之后绝大多数场景都被 Lambda 取代了。只有当接口有多个抽象方法、或者需要同时重写多个方法时，仍然得用匿名内部类。

### 17.枚举

枚举用来表示一组固定的常量，比 `static final int` 更安全，能把取值范围限制在编译器可检查的集合内。

```java
package faceToProgarm;

public class EnumDemo {
	public static void main(String[] args) {
		OrderState state = OrderState.PENDING;
		System.out.println(state);                  // 待支付
		System.out.println(state.getName());        // 待支付
		System.out.println(state.ordinal());        // 0，在枚举中的序号

		// 按名字取值，名字不存在会抛 IllegalArgumentException
		OrderState s2 = OrderState.valueOf("SHIPPED");
		System.out.println(s2);

		// 遍历所有枚举项
		for (OrderState s : OrderState.values()) {
			System.out.println(s.ordinal() + " = " + s.getName());
		}
	}
}

enum OrderState {
	PENDING("待支付"),
	PAID("已支付"),
	SHIPPED("已发货"),
	DELIVERED("已送达"),
	CANCELLED("已取消");

	private final String name;

	// 枚举的构造方法只能是 private，不写也是 private
	OrderState(String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	@Override
	public String toString() {
		return this.name;
	}
}
```

枚举天生单例，可以直接用 `==` 比较，这是它比字符串常量更好的地方：

```java
if (state == OrderState.PENDING) {
	System.out.println("还在等付款");
}
```

### 18.StringBuilder
```java
package faceToProgarm;
public class StringBuilderMain {
	public static void main(String[] args) {
        StringBuilder sb = new StringBuilder(1024);
        sb.append("Mr ")
          .append("Bob")
          .append("!")
          .insert(0, "Hello, ");
        System.out.println(sb.toString());
	}
}
```
### 19.StringJoiner

类似用分隔符拼接数组的需求很常见，所以Java标准库还提供了一个`StringJoiner`来干这个事：

```java
import java.util.StringJoiner;
public class Main {
    public static void main(String[] args) {
        String[] names = {"Bob", "Alice", "Grace"};
        var sj = new StringJoiner(", ", "Hello ", "!");
        for (String name : names) {
            sj.add(name);
        }
        System.out.println(sj.toString());
    }
}
```

### 20.String.join()

`String`还提供了一个静态方法`join()`，这个方法在内部使用了`StringJoiner`来拼接字符串，在不需要指定“开头”和“结尾”的时候，用`String.join()`更方便：

```java
String[] names = {"Bob", "Alice", "Grace"};
var s = String.join(", ", names);
```
### 21.BigInteger
```java
// BigInteger to float
import java.math.BigInteger;

public class Main {
    public static void main(String[] args) {
        BigInteger n = new BigInteger("999999").pow(99);
        float f = n.floatValue();
        System.out.println(f); // Infinity
    }
}
```

### 22.BigDecimal

和`BigInteger`类似，`BigDecimal`可以表示一个任意大小且精度完全准确的浮点数。

```java
BigDecimal bd = new BigDecimal("123.4567");
System.out.println(bd.multiply(bd)); // 15241.55677489
```

### 23.注释与Javadoc

Java 有三种注释。前两种给「读代码的人」看，第三种是**文档注释**，能被 `javadoc` 工具提取成 HTML 文档，IDE 里鼠标悬停在方法上看到的提示就来自它。

```java
package faceToProgarm;

// 单行注释

/*
 * 多行注释
 */

/**
 * 文档注释，只有这种能被 javadoc 提取
 *
 * @author 作者
 * @version 1.0
 * @see java.lang.String
 */
public class Tool {

	/**
	 * 求两个整数的和
	 *
	 * @param a 第一个加数
	 * @param b 第二个加数
	 * @return 两数之和
	 * @throws IllegalArgumentException 当任一参数为负数时抛出
	 */
	public static int add(int a, int b) {
		if (a < 0 || b < 0) {
			throw new IllegalArgumentException("参数不能为负数");
		}
		return a + b;
	}

	/**
	 * 计算阶乘。这里用 {@link #add(int, int)} 说明关联关系，
	 * 用 {@code 0! = 1} 表示代码片段。
	 *
	 * @param n 非负整数
	 * @return n 的阶乘
	 */
	public static long factorial(int n) {
		if (n <= 1) {
			return 1;
		}
		return n * factorial(n - 1);
	}
}
```

常用标签：

| 标签 | 用途 |
|---|---|
| `@param` | 描述方法参数 |
| `@return` | 描述返回值 |
| `@throws` / `@exception` | 描述会抛出的异常 |
| `@see` | 参考链接 |
| `@since` | 从哪个版本开始有 |
| `@deprecated` | 已过时，建议用什么替代 |
| `@author` / `@version` | 作者 / 版本（类上使用） |
| `{@link 类#方法}` | 行内链接，生成可跳转的引用 |
| `{@code 代码}` | 行内代码片段，不需要转义尖括号 |

生成文档：

```bash
javadoc -d doc -encoding UTF-8 -charset UTF-8 src/**/*.java
```

注意 `/** */` 必须紧贴在声明之前，中间不能有空行，否则不会被识别为文档注释。

## 三、Java集合

在Java中，如果一个Java对象可以在内部持有若干其他Java对象，并对外提供访问接口，我们把这种Java对象称为集合。很显然，Java的数组可以看作是一种集合。

既然Java提供了数组这种数据类型，可以充当集合，那么，我们为什么还需要其他集合类？这是因为数组有如下限制：

- 数组初始化后大小不可变；
- 数组只能按索引顺序存取。

因此，我们需要各种不同类型的集合类来处理不同的数据，例如：

- 可变大小的顺序链表；

- 保证无重复元素的集合；

- ...

  **Collection**

  Java标准库自带的`java.util`包提供了集合类：`Collection`，它是除`Map`外所有其他集合类的根接口。Java的`java.util`包主要提供了以下三种类型的集合：

  - `List`：一种有序列表的集合，例如，按索引排列的`Student`的`List`；
  - `Set`：一种保证没有重复元素的集合，例如，所有无重复名称的`Student`的`Set`；
  - `Map`：一种通过键值（key-value）查找的映射表集合，例如，根据`Student`的`name`查找对应`Student`的`Map`。

  Java集合的设计有几个特点：一是实现了接口和实现类相分离，例如，有序表的接口是`List`，具体的实现类有`ArrayList`，`LinkedList`等，二是支持泛型，我们可以限制在一个集合中只能放入同一种数据类型的元素。

  Java集合使用统一的`Iterator`遍历。

### 1.List

`List<E>`接口，可以看到几个主要的接口方法：

- 在末尾添加一个元素：`boolean add(E e)`

- 在指定索引添加一个元素：`boolean add(int index, E e)`

- 删除指定索引的元素：`E remove(int index)`

- 删除某个元素：`boolean remove(Object e)`

- 获取指定索引的元素：`E get(int index)`

- 获取链表大小（包含元素的个数）：`int size()`

  ```java
  import java.util.List;
  
  public class Main {
      public static void main(String[] args) {
          List<String> list = List.of("apple", "pear", "banana");
          for (String s : list) {
              System.out.println(s);
          }
      }
  }
  ```

  在`List`中查找元素时，`List`的实现类通过元素的`equals()`方法比较两个元素是否相等，因此，放入的元素必须正确覆写`equals()`方法，Java标准库提供的`String`、`Integer`等已经覆写了`equals()`方法。

  ```java
  package jiHe;
  
  import java.util.ArrayList;
  import java.util.List;
  import java.util.Objects;
  
  public class ListMain {
  
  	public static void main(String[] args) {
  		// TODO 自动生成的方法存根
  		List<Person> list = new ArrayList<>();
  		list.add(new Person("Xiao", "Ming", 18));
  		list.add(new Person("Xiao", "Hong", 25));
  		list.add(new Person("Bob", "Smith", 20));
  		boolean exist = list.contains(new Person("Bob", "Smith", 20));
  		System.out.println(exist ? "测试成功!" : "测试失败!");
  	}
  
  }
  
  class Person {
  	String firstName;
  	String lastName;
  	int age;
  
  	public Person(String firstName, String lastName, int age) {
  		this.firstName = firstName;
  		this.lastName = lastName;
  		this.age = age;
  	}
  
  	@Override
  	public boolean equals(Object o) {
  	    if (this == o) return true; // 首先检查对象引用是否相同
  	    if (o == null) return false; // 检查是否为null或者是否属于不同的类
  	 
  	    Person person = (Person) o; // 强制类型转换
  	 
  	    return age == person.age &&
  	           Objects.equals(firstName, person.firstName) &&
  	           Objects.equals(lastName, person.lastName);
  	}
  }
  //    @Override
  //    public boolean equals(Object obj) {
  //        if (obj instanceof Person p){
  //            return Objects.equals(firstName,p.firstName)&&Objects.equals(lastName,p.lastName)&& age== p.age;
  //        }
  //        return false;
  //    }
  ```
### 2.Iterator迭代器

所有 `Collection` 都能用统一的 `Iterator` 遍历，这是集合设计的核心之一：不管底层是数组还是链表，遍历写法一样。

```java
package jiHe;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorDemo {
	public static void main(String[] args) {
		List<String> list = new ArrayList<>();
		list.add("apple");
		list.add("pear");
		list.add("banana");

		Iterator<String> it = list.iterator();
		while (it.hasNext()) {
			String s = it.next();
			System.out.println(s);
		}
	}
}
```

**遍历时删除元素只能用 `Iterator.remove()`**，用集合自己的 `remove()` 会抛 `ConcurrentModificationException`：

```java
List<String> list = new ArrayList<>(List.of("apple", "pear", "banana"));

// 错误写法：边增强 for 边删，运行时报 ConcurrentModificationException
// for (String s : list) {
//     if (s.equals("pear")) list.remove(s);
// }

// 正确写法
Iterator<String> it = list.iterator();
while (it.hasNext()) {
	if (it.next().equals("pear")) {
		it.remove();
	}
}
System.out.println(list);   // [apple, banana]
```

### 3.LinkedList

`LinkedList` 同时实现了 `List` 和 `Deque`，既能当列表用，也能当队列/栈用。

```java
package jiHe;

import java.util.LinkedList;

public class LinkedListDemo {
	public static void main(String[] args) {
		LinkedList<String> list = new LinkedList<>();
		list.add("b");
		list.add("c");
		list.addFirst("a");       // 头部插入
		list.addLast("d");        // 尾部插入
		System.out.println(list); // [a, b, c, d]
		System.out.println(list.getFirst());  // a
		System.out.println(list.getLast());   // d

		// 当栈用（后进先出）
		LinkedList<Integer> stack = new LinkedList<>();
		stack.push(1);
		stack.push(2);
		System.out.println(stack.pop());   // 2

		// 当队列用（先进先出）
		LinkedList<Integer> queue = new LinkedList<>();
		queue.offer(1);
		queue.offer(2);
		System.out.println(queue.poll());  // 1
	}
}
```

`ArrayList` 与 `LinkedList` 的区别：

| | `ArrayList` | `LinkedList` |
|---|---|---|
| 底层结构 | 动态数组 | 双向链表 |
| 随机访问 `get(i)` | 快，O(1) | 慢，要逐个找，O(n) |
| 头部插入/删除 | 慢，要整体移位，O(n) | 快，O(1) |
| 内存占用 | 小 | 每个节点多存两个指针 |

实际开发里绝大多数场景用 `ArrayList`，因为按索引读取远比头部插入常见。

### 4.Map

  键值对

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 123);
        map.put("pear", 456);
        System.out.println(map.get("apple")); // 123
        map.put("apple", 789); // 再次放入apple作为key，但value变为789
        System.out.println(map.get("apple")); // 789
    }
}
```
### 5.Set

`Set`用于存储不重复的元素集合。

`Set`接口并不保证有序，而`SortedSet`接口则保证元素是有序的：

- `HashSet`是无序的，因为它实现了`Set`接口，并没有实现`SortedSet`接口；

- `TreeSet`是有序的，因为它实现了`SortedSet`接口。

  ```java
  import java.util.*;
  
  public class Main {
      public static void main(String[] args) {
          Set<String> set = new TreeSet<>();
          set.add("apple");
          set.add("banana");
          set.add("pear");
          set.add("orange");
          for (String s : set) {
              System.out.println(s);
          }
      }
  }
  ```

### 6.Collections工具类

`Collections` 操作的是集合（对应 `Arrays` 操作数组），都是静态方法。

```java
package jiHe;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsDemo {
	public static void main(String[] args) {
		List<Integer> list = new ArrayList<>(List.of(3, 1, 4, 1, 5));

		Collections.sort(list);              // 升序排序
		System.out.println(list);            // [1, 1, 3, 4, 5]

		Collections.reverse(list);           // 反转
		System.out.println(list);            // [5, 4, 3, 1, 1]

		Collections.shuffle(list);           // 随机打乱
		System.out.println(list);

		System.out.println(Collections.max(list));   // 最大值
		System.out.println(Collections.min(list));   // 最小值
		System.out.println(Collections.frequency(list, 1));  // 1 出现的次数

		// 二分查找，同样要求先排序
		Collections.sort(list);
		System.out.println(Collections.binarySearch(list, 4));

		// 自定义比较器排序
		Collections.sort(list, (a, b) -> b - a);
		System.out.println(list);            // 降序
	}
}
```

常用「不可变集合」和「空集合」工具方法：

```java
List<String> empty = Collections.emptyList();            // 空集合，不能 add
List<String> only = Collections.singletonList("a");      // 只有一个元素
List<String> fixed = Collections.unmodifiableList(list); // 只读视图，改会抛异常
```

`List.of()` / `Map.of()` / `Set.of()` 也能创建不可变集合，但注意它们**不允许 null 元素**，`Collections` 的方式允许。

### 7.泛型

泛型让「类型」变成参数，把类型检查从运行期提前到编译期。前面用过的 `List<String>` 只是使用侧，这里补定义侧。

**泛型类**：类型参数写在类名后面，可以在字段、方法参数、返回值里使用。

```java
package jiHe;

public class Box<T> {
	private T value;

	public Box(T value) {
		this.value = value;
	}

	public T get() {
		return value;
	}

	public void set(T value) {
		this.value = value;
	}

	public static void main(String[] args) {
		Box<String> b1 = new Box<>("hello");
		Box<Integer> b2 = new Box<>(123);
		System.out.println(b1.get());
		System.out.println(b2.get());
		System.out.println(b1.getClass() == b2.getClass());  // true，见下方「类型擦除」
	}
}
```

**泛型方法**：类型参数写在返回值之前，与类是否泛型无关。

```java
public static <T> T pickFirst(List<T> list) {
	return list.get(0);
}
```

**泛型接口**：

```java
interface Pair<K, V> {
	K getKey();
	V getValue();
}
```

泛型的类型参数只能是引用类型，`List<int>` 是非法的，要用包装类 `List<Integer>`。

**通配符**：`?` 表示未知类型，配合上下界使用。

```java
// ? extends Number：只读，能取出 Number，不能往里放（上界，生产者）
static double sum(List<? extends Number> list) {
	double total = 0;
	for (Number n : list) {
		total += n.doubleValue();
	}
	return total;
}

// ? super Integer：只写，能往里放 Integer，取出只能是 Object（下界，消费者）
static void fill(List<? super Integer> list) {
	list.add(1);
}
```

记法：**上界 `extends` 适合读，下界 `super` 适合写**。

**类型擦除**：泛型只存在于编译期，编译后类型参数会被擦除成 `Object`（或它的上界）。所以 `List<String>` 和 `List<Integer>` 在运行时是同一个类，也不能写 `new T[]`、不能对泛型做 `instanceof`。

```java
List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());  // true
```

### 8.集合底层原理

**ArrayList 的扩容机制**：底层是一个 `Object[] elementData`。

- 用无参构造 `new ArrayList<>()` 时，数组先是个空数组，第一次 `add` 才分配容量 10；
- 元素放满后再 `add`，扩容为原来的 **1.5 倍**（`oldCapacity + (oldCapacity >> 1)`），并把旧数组 `Arrays.copyOf` 到新数组；
- 所以已知数据量大时，最好用 `new ArrayList<>(1000)` 预设容量，避免反复扩容复制。

**HashMap 的结构**：数组 + 链表 + 红黑树。

- 默认初始容量 16，负载因子 0.75，元素数超过 `容量 × 0.75` 就扩容为 **2 倍**；
- `put` 时用 `key.hashCode()` 经过扰动运算算出数组下标，下标相同即**哈希冲突**，用链表挂在同一个桶上；
- 链表长度达到 **8** 且数组容量达到 **64** 时，链表转为**红黑树**（查询从 O(n) 变成 O(log n)）；元素减少到 6 以下会退化回链表；
- `get` 时先比 `hashCode`，再比 `equals`，所以**作为 key 的对象必须同时正确重写 `hashCode()` 和 `equals()`**。

```java
package jiHe;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class HashMapDemo {
	public static void main(String[] args) {
		Map<Student, String> map = new HashMap<>();
		map.put(new Student("小明", 18), "一班");
		System.out.println(map.get(new Student("小明", 18)));  // 一班
	}
}

class Student {
	String name;
	int age;

	public Student(String name, int age) {
		this.name = name;
		this.age = age;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Student s = (Student) o;
		return age == s.age && Objects.equals(name, s.name);
	}

	@Override
	public int hashCode() {
		return Objects.hash(name, age);
	}
}
```

只重写 `equals()` 不重写 `hashCode()`，两个「相等」的对象会算出不同的下标，`get` 就取不到值，这是最常见的踩坑点。

**HashSet 与 TreeSet**：`HashSet` 底层就是 `HashMap`，只用了 key；`TreeSet` 底层是 `TreeMap`（红黑树），按元素大小有序排列，要求元素实现 `Comparable` 或传入 `Comparator`。

## 四、常用API

### 1.String常用方法

`String` 是不可变对象，所有「修改」方法都返回新字符串，原对象不变。

```java
package api;

public class StringDemo {
	public static void main(String[] args) {
		String s = "  Hello World  ";

		// 六种创建方式
		String s1 = "abc";                        // 直接赋值，放在字符串常量池
		String s2 = new String("abc");            // 新对象，不在常量池
		String s3 = new String(new char[] {'a', 'b', 'c'});   // 由 char 数组构造
		String s4 = new String(new byte[] {97, 98, 99});      // 由字节数组构造（按 ASCII 解码）
		System.out.println(s1 == s2);             // false，比的是引用地址
		System.out.println(s1.equals(s2));        // true，比的是内容
		System.out.println(s1 == s1.intern());    // true，intern() 返回常量池中的引用

		System.out.println(s.trim());             // Hello World，去掉首尾空白
		System.out.println(s.length());           // 15
		System.out.println(s.charAt(2));          // H，下标从 0 开始
		System.out.println(s.substring(2, 7));    // Hello，含头不含尾
		System.out.println(s.substring(2));       // 从下标 2 到结尾
		System.out.println(s.contains("World"));  // true
		System.out.println(s.indexOf("World"));   // 8，找不到返回 -1
		System.out.println(s.toUpperCase());      // 转大写
		System.out.println(s.replace("World", "Java"));       // 全部替换
		System.out.println(s.replaceAll("\\s+", ""));         // 按正则替换，去掉所有空白
		System.out.println("a,b,c".split(",").length);        // 3，按正则切分
		System.out.println("ab".repeat(3));                    // ababab（Java 11+）
		System.out.println(s.isEmpty());                       // false
		System.out.println(String.join("-", "a", "b", "c"));   // a-b-c
		System.out.println("abc".equalsIgnoreCase("ABC"));     // true
	}
}
```

判断字符串是否相等**必须用 `equals()`**，`==` 比的是引用地址。这也是 `String` 不可变带来的副作用：字面量会进常量池复用，`new` 出来的不会。

格式化输出用 `String.format()` 或 `System.out.printf()`：

```java
System.out.printf("%s 今年 %d 岁，成绩 %.2f%n", "小明", 18, 95.5);
String msg = String.format("共 %d 条记录", 12);
```

### 2.Math工具类

```java
package api;

public class MathDemo {
	public static void main(String[] args) {
		System.out.println(Math.PI);            // 3.141592653589793
		System.out.println(Math.E);             // 2.718281828459045
		System.out.println(Math.abs(-5));       // 5
		System.out.println(Math.max(3, 7));     // 7
		System.out.println(Math.min(3, 7));     // 3

		System.out.println(Math.round(3.5));    // 4，四舍五入，返回 long
		System.out.println(Math.round(-3.5));   // -3，注意负数按「加 0.5 后向下取整」

		System.out.println(Math.pow(2, 10));    // 1024.0
		System.out.println(Math.sqrt(16));      // 4.0
		System.out.println(Math.cbrt(27));      // 3.0 立方根

		System.out.println(Math.ceil(3.1));     // 4.0 向上取整
		System.out.println(Math.floor(3.9));    // 3.0 向下取整

		System.out.println(Math.random());      // 0.0 ~ 1.0 之间的 double
		System.out.println(Math.max(Math.max(1, 2), 3));  // 三个数取最大要嵌套
	}
}
```

### 3.System类

```java
package api;

import java.util.Arrays;

public class SystemDemo {
	public static void main(String[] args) {
		System.out.println("标准输出，可重定向到文件");
		System.err.println("标准错误输出");

		// 计时：毫秒时间戳
		long start = System.currentTimeMillis();
		long sum = 0;
		for (int i = 0; i < 1000000; i++) {
			sum += i;
		}
		long end = System.currentTimeMillis();
		System.out.println("耗时 " + (end - start) + " 毫秒");

		// 数组复制，比循环赋值快，底层是内存拷贝
		int[] src = {1, 2, 3, 4, 5};
		int[] dest = new int[5];
		System.arraycopy(src, 1, dest, 2, 3);
		System.out.println(Arrays.toString(dest));   // [0, 0, 2, 3, 4]

		// 退出 JVM，0 表示正常退出，非 0 表示异常退出
		// System.exit(0);   // 后面的代码不再执行

		System.out.println(System.getProperty("os.name"));      // 操作系统名
		System.out.println(System.getProperty("java.version")); // JDK 版本
		System.out.println(System.getenv("PATH"));              // 环境变量

		// 纳秒级计时，更精确
		long ns = System.nanoTime();
		System.out.println(ns > 0);
	}
}
```

### 4.Objects与Arrays工具类

```java
package api;

import java.util.Arrays;
import java.util.Objects;

public class UtilsDemo {
	public static void main(String[] args) {
		// Objects：空安全的工具方法
		String a = null;
		System.out.println(Objects.isNull(a));        // true
		System.out.println(Objects.nonNull(a));       // false
		System.out.println(Objects.equals(a, null));  // true，不会抛空指针
		System.out.println(Objects.toString(a, "默认值"));  // 默认值
		// Objects.requireNonNull(a, "a 不能为 null");  // 为 null 时抛 NullPointerException

		// Arrays：数组工具类
		int[] ns = {3, 1, 4};
		Arrays.sort(ns);
		System.out.println(Arrays.toString(ns));   // [1, 3, 4]
		System.out.println(Arrays.binarySearch(ns, 3));  // 1
		System.out.println(Arrays.equals(ns, new int[] {1, 3, 4}));  // true
		System.out.println(Arrays.stream(ns).sum());     // 8
	}
}
```

`Objects.hash(...)` 常用来实现 `hashCode()`，`Objects.equals(...)` 用来实现 `equals()` 里的字段比较，两者都自动处理 null。

### 5.包装类与装箱拆箱

8 种基本类型都有对应的包装类，主要用途是放进集合、提供工具方法、允许 null。

| 基本类型 | 包装类 |
|---|---|
| `byte` / `short` / `int` / `long` | `Byte` / `Short` / `Integer` / `Long` |
| `float` / `double` | `Float` / `Double` |
| `char` / `boolean` | `Character` / `Boolean` |

```java
package api;

public class BoxDemo {
	public static void main(String[] args) {
		// 自动装箱：基本类型 → 包装类
		Integer i = 100;
		// 自动拆箱：包装类 → 基本类型
		int n = i;

		// 常用方法：字符串与基本类型互转
		Integer i2 = Integer.valueOf("123");
		int i3 = Integer.parseInt("456");
		String s = String.valueOf(789);
		System.out.println(Integer.MAX_VALUE);   // 2147483647
		System.out.println(Integer.MIN_VALUE);   // -2147483648
		System.out.println(Integer.toBinaryString(10));  // 1010

		// Integer 缓存：-128 ~ 127 之间的对象会被复用
		Integer a = 127;
		Integer b = 127;
		System.out.println(a == b);            // true，命中缓存

		Integer c = 128;
		Integer d = 128;
		System.out.println(c == d);            // false，超出缓存范围，是新对象
		System.out.println(c.equals(d));       // true，包装类比较一律用 equals
	}
}
```

**自动拆箱的空指针陷阱**：包装类为 null 时参与运算会抛 `NullPointerException`。

```java
Integer total = null;
// int result = total + 1;   // 运行时报 NullPointerException，拆箱失败
int result = total == null ? 0 : total + 1;
```

### 6.BigDecimal的精度与舍入

`double` 存在二进制表示误差，`0.1 + 0.2` 不等于 `0.3`，涉及金额必须用 `BigDecimal`。

```java
package api;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class BigDecimalDemo {
	public static void main(String[] args) {
		System.out.println(0.1 + 0.2);   // 0.30000000000000004

		// 必须用字符串构造，用 double 构造会把误差带进来
		BigDecimal a = new BigDecimal("0.1");
		BigDecimal b = new BigDecimal("0.2");
		System.out.println(a.add(b));         // 0.3
		System.out.println(a.subtract(b));    // -0.1
		System.out.println(a.multiply(b));    // 0.02

		// 除法必须指定精度和舍入模式，否则除不尽会抛 ArithmeticException
		BigDecimal c = new BigDecimal("10");
		BigDecimal d = new BigDecimal("3");
		// System.out.println(c.divide(d));   // 报错：Non-terminating decimal expansion
		System.out.println(c.divide(d, 2, RoundingMode.HALF_UP));   // 3.33

		System.out.println(new BigDecimal("2.5").setScale(0, RoundingMode.HALF_UP));   // 3
		System.out.println(new BigDecimal("2.4").setScale(0, RoundingMode.HALF_UP));   // 2
		System.out.println(new BigDecimal("2.5").setScale(0, RoundingMode.DOWN));      // 2，直接截断

		// 比较大小必须用 compareTo，equals 会把精度也算进去
		System.out.println(new BigDecimal("1.0").compareTo(new BigDecimal("1.00")));  // 0，相等
		System.out.println(new BigDecimal("1.0").equals(new BigDecimal("1.00")));     // false
	}
}
```

常用舍入模式：

| 模式 | 含义 |
|---|---|
| `HALF_UP` | 四舍五入（最常用） |
| `HALF_DOWN` | 五舍六入 |
| `UP` | 远离零方向舍入 |
| `DOWN` | 向零方向截断 |
| `CEILING` | 向正无穷方向舍入 |
| `FLOOR` | 向负无穷方向舍入 |

### 7.日期时间

老 API（`Date`、`Calendar`）可变且线程不安全，新代码一律用 `java.time` 包（Java 8+），它们都是**不可变**的。

```java
package api;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Duration;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class DateTimeDemo {
	public static void main(String[] args) {
		// 当前时间
		LocalDate today = LocalDate.now();
		LocalTime now = LocalTime.now();
		LocalDateTime dateTime = LocalDateTime.now();
		System.out.println(today);      // 2026-09-16
		System.out.println(now);        // 15:20:30.123
		System.out.println(dateTime);

		// 指定时间
		LocalDate d = LocalDate.of(2026, 9, 16);
		LocalTime t = LocalTime.of(23, 59, 59);
		System.out.println(d + " " + t);

		// 取值
		System.out.println(d.getYear());            // 2026
		System.out.println(d.getMonthValue());      // 9
		System.out.println(d.getDayOfMonth());      // 16
		System.out.println(d.getDayOfWeek());       // WEDNESDAY
		System.out.println(d.lengthOfMonth());      // 30

		// 加减，返回新对象，原对象不变
		System.out.println(d.plusDays(10));         // 2026-09-26
		System.out.println(d.minusMonths(1));       // 2026-08-16
		System.out.println(d.plus(1, ChronoUnit.YEARS));

		// 格式化与解析
		DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		System.out.println(dateTime.format(fmt));   // 2026-09-16 15:20:30
		LocalDate parsed = LocalDate.parse("2026-09-16");
		System.out.println(parsed);

		// 时间间隔
		Period period = Period.between(LocalDate.of(2026, 1, 1), d);
		System.out.println(period.getMonths() + " 个月 " + period.getDays() + " 天");

		Duration duration = Duration.between(LocalTime.of(9, 0), LocalTime.of(17, 30));
		System.out.println(duration.toHours());     // 8

		// 判断先后
		System.out.println(d.isAfter(LocalDate.of(2020, 1, 1)));  // true
		System.out.println(d.isLeapYear());                        // false
	}
}
```

如果要和数据库交互或需要带时区，用 `Instant` 加 `ZoneId`：

```java
import java.time.Instant;
import java.time.ZoneId;

Instant instant = Instant.now();                              // UTC 时间戳
LocalDateTime local = instant.atZone(ZoneId.systemDefault()).toLocalDateTime();
```

### 8.正则表达式

`String` 的 `matches` / `replaceAll` / `split` 都接受正则；需要复用或提取分组时用 `Pattern` 和 `Matcher`。

```java
package api;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexDemo {
	public static void main(String[] args) {
		// 常用字符类
		System.out.println("123".matches("\\d+"));       // true，一个或多个数字
		System.out.println("abc".matches("\\w+"));       // true，字母数字下划线
		System.out.println("a".matches("[a-z]"));        // true，小写字母
		System.out.println("".matches("a*"));            // true，0 个或多个
		System.out.println("13800138000".matches("1[3-9]\\d{9}"));  // true，手机号

		// 注意：matches 要求整串匹配，部分匹配要用 find
		System.out.println("abc123".matches("\\d+"));    // false
		System.out.println(Pattern.compile("\\d+").matcher("abc123").find());  // true

		// 提取分组
		Pattern p = Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})");
		Matcher m = p.matcher("今天是 2026-09-16，明天是 2026-09-17");
		while (m.find()) {
			System.out.println(m.group());    // 整个匹配：2026-09-16
			System.out.println(m.group(1));   // 第 1 组：2026
			System.out.println(m.group(2));   // 第 2 组：09
		}

		// 替换
		System.out.println("a1b2c3".replaceAll("\\d", "#"));   // a#b#c#

		// 分割，分隔符是正则，注意 . | 等元字符要转义
		System.out.println(java.util.Arrays.toString("a.b.c".split("\\.")));  // [a, b, c]
	}
}
```

常用元字符速查：

| 写法 | 含义 |
|---|---|
| `\d` / `\D` | 数字 / 非数字 |
| `\w` / `\W` | 字母数字下划线 / 非 |
| `\s` / `\S` | 空白字符 / 非空白 |
| `.` | 任意一个字符（默认不含换行） |
| `*` / `+` / `?` | 0+ / 1+ / 0或1 |
| `{n}` / `{n,m}` | 恰好 n 次 / n 到 m 次 |
| `^` / `$` | 行首 / 行尾 |
| `[abc]` / `[^abc]` | 其中之一 / 除了这些 |
| `(x)` / `\|` | 分组 / 或 |

Java 字符串里写正则，反斜杠要写两次，`\d` 要写成 `"\\d"`。

## 五、异常处理

异常体系：`Throwable` 分两支，`Error` 是 JVM 层面的严重错误（如 `OutOfMemoryError`、`StackOverflowError`），程序无法处理；`Exception` 才是应用该关心的。

`Exception` 又分两类：

- **受检异常（Checked）**：编译期强制处理，不写 `try` 或不 `throws` 就编译不过，如 `IOException`、`SQLException`；
- **非受检异常（RuntimeException）**：编译期不检查，运行时才暴露，如 `NullPointerException`、`ArrayIndexOutOfBoundsException`、`NumberFormatException`。

### 1.try-catch-finally

```java
package exception;

import java.io.FileInputStream;
import java.io.IOException;

public class TryDemo {
	public static void main(String[] args) {
		try {
			int[] arr = {1, 2, 3};
			System.out.println(arr[5]);                  // 抛出 ArrayIndexOutOfBoundsException
		} catch (ArrayIndexOutOfBoundsException e) {
			System.out.println("数组越界: " + e.getMessage());
		} catch (Exception e) {                          // 兜底，必须放在具体的后面
			System.out.println("其他异常: " + e);
		} finally {
			System.out.println("无论是否异常都会执行，用来释放资源");
		}

		System.out.println("异常被捕获后程序继续往下执行");
	}
}
```

几个要点：

- `finally` 一定会执行，除非在 `try` 里 `System.exit()` 或 JVM 崩溃；
- `catch` 的顺序必须**由具体到宽泛**，否则会编译报错「已经被捕获」；
- Java 7+ 支持多异常合并捕获：`catch (IOException | SQLException e)`；
- 永远不要写空的 `catch` 块把异常吞掉，至少打印日志。

**try-with-resources**（Java 7+）：实现了 `AutoCloseable` 的资源会自动关闭，比手写 `finally` 更安全。

```java
try (FileInputStream in = new FileInputStream("a.txt")) {
	System.out.println(in.read());
} catch (IOException e) {
	e.printStackTrace();
}
// 离开 try 块时自动调用 in.close()，不需要 finally
```

### 2.throw与throws

- `throw` 在方法体内**主动抛出一个**异常对象；
- `throws` 写在方法签名上，**声明**这个方法可能抛哪些异常，交给调用方处理。

```java
package exception;

import java.io.IOException;

public class ThrowDemo {
	// throws 声明受检异常，调用方必须处理
	public static void readFile(String path) throws IOException {
		if (path == null) {
			throw new IllegalArgumentException("路径不能为 null");  // 非受检，不用声明
		}
		throw new IOException("文件不存在: " + path);
	}

	public static void main(String[] args) {
		try {
			readFile("a.txt");
		} catch (IOException e) {
			System.out.println(e.getMessage());
		}
	}
}
```

`throw` 必须放在能执行到的位置，写在 `return` 之后会编译报错「无法访问的语句」。

### 3.自定义异常

业务上的错误语义用标准异常表达不清楚时，就自定义。惯例是继承 `RuntimeException`，这样可以避免到处写 `throws`。

```java
package exception;

// 自定义非受检异常
public class AgeIllegalException extends RuntimeException {
	public AgeIllegalException() {
		super();
	}

	public AgeIllegalException(String message) {
		super(message);
	}
}

class Test {
	public static void main(String[] args) {
		try {
			checkAge(-1);
		} catch (AgeIllegalException e) {
			System.out.println("捕获到自定义异常: " + e.getMessage());
		}
	}

	static void checkAge(int age) {
		if (age < 0) {
			throw new AgeIllegalException("年龄不合法: " + age);
		}
	}
}
```

如果要强制调用方处理，就继承 `Exception`；如果希望调用方自己决定处不处理，继承 `RuntimeException`。**如果父类方法没有 `throws`，子类重写时不能抛出更宽的受检异常。**

### 4.异常信息的常用方法与堆栈

```java
try {
	Integer.parseInt("abc");
} catch (NumberFormatException e) {
	System.out.println(e.getMessage());   // For input string: "abc"
	System.out.println(e);                // 类名 + message
	e.printStackTrace();                   // 打印完整堆栈，定位问题靠它
}
```

`printStackTrace()` 输出里从上往下的第一行是异常类型和信息，往下是调用链，**最下面几行才是问题的源头**，中间那段 `at ...` 就是「堆栈」这个词的由来。

异常不是控制流。能用 `if` 判断的正常分支就用 `if`，异常只用来处理「意料之外」的情况，因为抛出异常要生成堆栈，性能代价远高于判断。

  
