---
title: Java基础的学习
date: 2024-12-02
tags: [Java, 基础学习]
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
### 2.基础运算
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
### 3.数学运算
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
### 4.布尔运算
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
### 5.String的指向
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
### 6.类型转换
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
### 7.输入Scanner
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
### 8.数组的输出
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
### 9.数组排序
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
### 2.方法重载(同名方法)
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
### 3.继承
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
### 4.多态
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
### 5.抽象类
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

### 6.接口

如果一个抽象类没有字段，所有方法全部都是抽象方法：

```java
abstract class Person {
    public abstract void run();
    public abstract String getName();
}
```

|

|

V

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

### 7.静态方法

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

### 8.内部类

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

### 9.StringBuilder
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
### 10.StringJoiner

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

### 11.String.join()

`String`还提供了一个静态方法`join()`，这个方法在内部使用了`StringJoiner`来拼接字符串，在不需要指定“开头”和“结尾”的时候，用`String.join()`更方便：

```java
String[] names = {"Bob", "Alice", "Grace"};
var s = String.join(", ", names);
```
### 12.BigInteger
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

### 13.BigDecimal

和`BigInteger`类似，`BigDecimal`可以表示一个任意大小且精度完全准确的浮点数。

```java
BigDecimal bd = new BigDecimal("123.4567");
System.out.println(bd.multiply(bd)); // 15241.55677489
```

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
### 2.Map

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
### 3.Set

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

  
