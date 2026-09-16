---
title: Java进阶
date: 2024-12-03
updatetime: 2026-09-16
tags: [Java, 进阶, 并发]
description: Java进阶知识整理：IO流、多线程与并发、Lambda、Stream流、反射与注解、JVM、网络编程、JDBC
pinned: false
---
# Java进阶

> **关于本文**：这篇笔记是由 AI 根据我的学习材料整理总结的，不是逐字照抄的教材。内容可能存在错误、遗漏、表述不准确或版本差异（部分 API 的写法随 JDK 版本变化），代码片段也多为说明用的简化示例，未全部实际编译运行。请以官方文档和实际运行结果为准，发现问题的欢迎指正。

基础语法、面向对象、集合与异常见 [Java基础的学习](/article/java)，这里承接后面的内容。

## 一、IO流

IO 流按两个维度分类：

- 按方向：**输入流**（读数据到程序）/ **输出流**（把数据写出去）；
- 按单位：**字节流**（万能，能处理图片视频）/ **字符流**（只能处理文本，但能正确处理编码）。

字节流的基类是 `InputStream` / `OutputStream`，字符流是 `Reader` / `Writer`。所有流用完都必须关闭，最省事的写法是 **try-with-resources**。

### 1.File类

`File` 表示路径本身，不负责读写内容。

```java
package io;

import java.io.File;
import java.io.IOException;

public class FileDemo {
	public static void main(String[] args) throws IOException {
		File f = new File("D:/demo/a.txt");
		System.out.println(f.exists());        // 是否存在
		System.out.println(f.isFile());        // 是否是文件
		System.out.println(f.isDirectory());   // 是否是目录
		System.out.println(f.getName());       // a.txt
		System.out.println(f.getAbsolutePath());
		System.out.println(f.length());        // 字节数

		// 创建：父目录不存在会失败，要先 mkdirs
		File dir = new File("D:/demo/new");
		if (!dir.exists()) {
			dir.mkdirs();                      // 连父目录一起创建
		}
		File nf = new File(dir, "b.txt");
		System.out.println(nf.createNewFile());   // 已存在返回 false

		// 遍历目录
		File root = new File("D:/demo");
		File[] files = root.listFiles();
		if (files != null) {
			for (File file : files) {
				System.out.println(file.getName());
			}
		}

		System.out.println(nf.delete());       // 删除文件或空目录
	}
}
```

### 2.字节流

```java
package io;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class ByteStreamDemo {
	public static void main(String[] args) {
		// 写出：第二个参数 true 表示追加，不写则覆盖
		try (FileOutputStream out = new FileOutputStream("D:/demo/a.txt", true)) {
			out.write("Hello 世界\n".getBytes());   // 必须转成字节数组
			out.write(new byte[] {65, 66, 67});      // 写入 ABC 的 ASCII 码
		} catch (IOException e) {
			e.printStackTrace();
		}

		// 读取：一次读一批，效率远高于一次读一个字节
		try (FileInputStream in = new FileInputStream("D:/demo/a.txt")) {
			byte[] buf = new byte[1024];
			int len;
			while ((len = in.read(buf)) != -1) {     // read 返回实际读到的字节数，-1 表示读完
				System.out.print(new String(buf, 0, len));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

一次性读整个小文件可以用 `Files.readAllBytes` / `Files.readString`（Java 11+）：

```java
import java.nio.file.Files;
import java.nio.file.Path;

String content = Files.readString(Path.of("D:/demo/a.txt"));
Files.writeString(Path.of("D:/demo/b.txt"), content);
```

### 3.字符流

字符流内部带了编码转换，处理文本更合适。`FileWriter` 第二个参数为 `true` 时是追加模式。

```java
package io;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class CharStreamDemo {
	public static void main(String[] args) {
		try (FileWriter fw = new FileWriter("D:/demo/c.txt")) {
			fw.write("第一行\n");
			fw.write("第二行\n");
			fw.write(new char[] {'a', 'b', 'c'});
			fw.flush();          // 手动刷缓冲；不调用的话 close 时也会刷
		} catch (IOException e) {
			e.printStackTrace();
		}

		try (FileReader fr = new FileReader("D:/demo/c.txt")) {
			char[] buf = new char[1024];
			int len;
			while ((len = fr.read(buf)) != -1) {
				System.out.print(new String(buf, 0, len));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

### 4.缓冲流

缓冲流在内存里开一块缓冲区，减少与磁盘的交互次数，读写大文件时能差出几倍性能。用法是把它套在基础流外面。

```java
package io;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class BufferStreamDemo {
	public static void main(String[] args) {
		try (BufferedWriter bw = new BufferedWriter(new FileWriter("D:/demo/d.txt"))) {
			bw.write("第一行");
			bw.newLine();            // 跨平台换行
			bw.write("第二行");
			bw.newLine();
		} catch (IOException e) {
			e.printStackTrace();
		}

		// readLine 按行读，读不到返回 null，这是最常用的文本读法
		try (BufferedReader br = new BufferedReader(new FileReader("D:/demo/d.txt"))) {
			String line;
			while ((line = br.readLine()) != null) {
				System.out.println(line);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

字节流的缓冲流是 `BufferedInputStream` / `BufferedOutputStream`，用法完全一样。

### 5.转换流

`FileReader` 用的是平台默认编码，在 Windows 上默认是 GBK，读 UTF-8 文件会乱码。转换流可以**显式指定编码**。

```java
package io;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class ConvertStreamDemo {
	public static void main(String[] args) {
		// 字节流 → 字符流，并指定按 UTF-8 解码
		try (BufferedReader br = new BufferedReader(
				new InputStreamReader(new FileInputStream("D:/demo/a.txt"), StandardCharsets.UTF_8))) {
			String line;
			while ((line = br.readLine()) != null) {
				System.out.println(line);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

对应写出的方向是 `OutputStreamWriter`。**读写文本时只要涉及非 ASCII 字符，就应该明确指定编码。**

### 6.对象序列化

把对象直接写进文件/网络叫序列化，反过来叫反序列化。类必须实现 `Serializable` 接口（只是个标记，没有抽象方法）。

```java
package io;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class SerialDemo {
	public static void main(String[] args) {
		try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("D:/demo/user.dat"))) {
			oos.writeObject(new User("小明", 18));
		} catch (IOException e) {
			e.printStackTrace();
		}

		try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("D:/demo/user.dat"))) {
			User u = (User) ois.readObject();
			System.out.println(u);
		} catch (IOException | ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
}

class User implements Serializable {
	// 序列化版本号：不写也会自动生成，但类一改就会变，导致旧文件读不回来
	private static final long serialVersionUID = 1L;

	private String name;
	private int age;

	// transient 修饰的字段不参与序列化
	private transient String password;

	public User(String name, int age) {
		this.name = name;
		this.age = age;
	}

	@Override
	public String toString() {
		return "User{name=" + name + ", age=" + age + ", password=" + password + "}";
	}
}
```

### 7.Properties

`Properties` 是 `Hashtable` 的子类，专门读写 `.properties` 配置文件，键和值都是字符串。

```java
package io;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

public class PropertiesDemo {
	public static void main(String[] args) {
		Properties props = new Properties();
		props.setProperty("jdbc.url", "jdbc:mysql://localhost:3306/db");
		props.setProperty("jdbc.user", "root");

		try (FileOutputStream out = new FileOutputStream("D:/demo/config.properties")) {
			props.store(out, "数据库配置");       // 第二个参数是注释
		} catch (IOException e) {
			e.printStackTrace();
		}

		Properties read = new Properties();
		try (FileInputStream in = new FileInputStream("D:/demo/config.properties")) {
			read.load(in);
			System.out.println(read.getProperty("jdbc.user"));        // root
			System.out.println(read.getProperty("not.exists", "默认值"));  // 默认值
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

## 二、多线程与并发

### 1.三种创建线程的方式

```java
package thread;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class CreateThreadDemo {
	public static void main(String[] args) throws ExecutionException, InterruptedException {
		// 方式一：继承 Thread，重写 run
		new MyThread().start();

		// 方式二：实现 Runnable（推荐，还能再继承别的类）
		new Thread(new MyRunnable()).start();

		// 方式三：实现 Callable，可以有返回值、可以抛异常
		FutureTask<String> task = new FutureTask<>(new MyCallable());
		new Thread(task).start();
		System.out.println(task.get());      // get() 会阻塞，直到拿到结果
	}
}

class MyThread extends Thread {
	@Override
	public void run() {
		System.out.println("继承 Thread: " + Thread.currentThread().getName());
	}
}

class MyRunnable implements Runnable {
	@Override
	public void run() {
		System.out.println("实现 Runnable: " + Thread.currentThread().getName());
	}
}

class MyCallable implements Callable<String> {
	@Override
	public String call() {
		return "Callable 的返回值";
	}
}
```

**启动线程必须调 `start()`，不能调 `run()`。** 直接调 `run()` 只是在当前线程里当普通方法执行，不会开新线程。

`Thread` 常用方法：

```java
Thread t = new Thread(() -> System.out.println("跑"));
t.setName("worker-1");           // 设置线程名
t.setDaemon(true);               // 设为守护线程，主线程结束后自动退出
t.start();
t.join();                        // 阻塞当前线程，等 t 执行完
// Thread.sleep(1000);           // 当前线程休眠 1 秒
// Thread.currentThread().interrupt();  // 打断睡眠，会抛 InterruptedException
```

### 2.线程安全问题

多个线程操作同一份共享数据时，可能出现「卖出负数张票」这类问题，叫线程安全问题。

```java
package thread;

public class TicketDemo {
	public static void main(String[] args) {
		Ticket ticket = new Ticket();
		new Thread(ticket, "窗口1").start();
		new Thread(ticket, "窗口2").start();
		new Thread(ticket, "窗口3").start();
	}
}

class Ticket implements Runnable {
	private int count = 100;

	@Override
	public void run() {
		while (true) {
			// 同步代码块，同一时刻只有一个线程能进来
			synchronized (this) {
				if (count <= 0) {
					break;
				}
				System.out.println(Thread.currentThread().getName() + " 卖出第 " + count + " 张票");
				count--;
			}
			try {
				Thread.sleep(10);
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
			}
		}
	}
}
```

### 3.synchronized与Lock

`synchronized` 是隐式锁，进入代码块自动加锁、离开自动释放（包括异常时）。

```java
// 同步代码块，锁对象可以是任意对象
synchronized (lock) {
	// 临界区
}

// 同步方法，锁的是 this（非静态）或 类名.class（静态）
public synchronized void sell() {
	// 临界区
}
```

`Lock` 是显式锁，需要手动 `unlock()`，但比 `synchronized` 更灵活（可尝试获取、可中断、可指定公平锁）。

```java
package thread;

import java.util.concurrent.locks.ReentrantLock;

class Ticket2 implements Runnable {
	private int count = 100;
	private final ReentrantLock lock = new ReentrantLock();

	@Override
	public void run() {
		while (true) {
			lock.lock();
			try {                       // 必须放在 try 里，保证异常时也能解锁
				if (count <= 0) {
					break;
				}
				System.out.println(Thread.currentThread().getName() + " 卖出第 " + count + " 张票");
				count--;
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				lock.unlock();          // unlock 一定要在 finally 里
			}
		}
	}
}
```

两个容易被追问的概念：

- **可见性**：一个线程修改了共享变量，另一个线程可能读不到（工作内存缓存）。`volatile` 修饰变量可以保证可见性和有序性，但**不保证原子性**，`i++` 这种复合操作仍然要加锁。
- **原子性**：`i++` 实际是「读 → 加 → 写」三步，中间可能被切走。要原子自增用 `AtomicInteger`。

```java
import java.util.concurrent.atomic.AtomicInteger;

AtomicInteger i = new AtomicInteger(0);
i.incrementAndGet();          // 原子自增，等价于 ++i
```

### 4.线程池

每来一个任务就 `new Thread` 的代价很高：创建销毁开销大、线程数不可控。线程池把线程复用起来。

```java
package thread;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class PoolDemo {
	public static void main(String[] args) {
		ThreadPoolExecutor pool = new ThreadPoolExecutor(
				2,                              // 核心线程数，常驻
				5,                              // 最大线程数
				60L, TimeUnit.SECONDS,          // 非核心线程空闲多久回收
				new ArrayBlockingQueue<>(10),   // 任务队列
				new ThreadPoolExecutor.AbortPolicy()  // 拒绝策略
		);

		for (int i = 1; i <= 8; i++) {
			final int n = i;
			pool.execute(() -> System.out.println(Thread.currentThread().getName() + " 处理任务 " + n));
		}

		pool.shutdown();      // 不再接新任务，执行完队列里的任务后关闭
	}
}
```

执行顺序：核心线程 → 任务队列 → 非核心线程 → 拒绝策略。四个拒绝策略：

| 策略 | 行为 |
|---|---|
| `AbortPolicy` | 默认，直接抛 `RejectedExecutionException` |
| `CallerRunsPolicy` | 让提交任务的线程自己执行 |
| `DiscardPolicy` | 静默丢弃 |
| `DiscardOldestPolicy` | 丢掉队列里最早的任务，再提交当前任务 |

线程数经验值：CPU 密集型取「核数 + 1」，IO 密集型取「核数 × 2」或更大。

### 5.并发工具类

```java
package thread;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CopyOnWriteArrayList;

public class UtilsDemo {
	public static void main(String[] args) throws InterruptedException {
		// 线程安全的集合，替代自己给 ArrayList / HashMap 加锁
		ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
		map.putIfAbsent("a", 1);              // 不存在才放入，是原子的
		map.computeIfAbsent("b", k -> 2);
		System.out.println(map.get("a"));

		CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
		list.add("x");                        // 写时复制，读多写少场景才用

		// 倒计时门闩：等所有子任务做完再继续
		CountDownLatch latch = new CountDownLatch(3);
		for (int i = 0; i < 3; i++) {
			new Thread(() -> {
				System.out.println(Thread.currentThread().getName() + " 完成任务");
				latch.countDown();            // 计数减一
			}).start();
		}
		latch.await();                        // 阻塞，直到计数归零
		System.out.println("全部完成，继续往下走");
	}
}
```

| 工具 | 用途 |
|---|---|
| `ConcurrentHashMap` | 高并发下的 Map，分段/桶级加锁 |
| `CopyOnWriteArrayList` | 读多写少的 List，写时复制整个数组 |
| `CountDownLatch` | 一个线程等多个线程完成 |
| `CyclicBarrier` | 一组线程互相等，到齐后一起继续（可循环） |
| `Semaphore` | 控制同时访问的线程数量 |
| `BlockingQueue` | 阻塞队列，生产者消费者模型的标配 |

## 三、Lambda与函数式接口

### 1.Lambda表达式

Lambda 用来简化**只有一个抽象方法**的接口（函数式接口）的匿名内部类写法。

```java
package lambda;

import java.util.Arrays;
import java.util.Comparator;

public class LambdaDemo {
	public static void main(String[] args) {
		// 匿名内部类写法
		new Thread(new Runnable() {
			@Override
			public void run() {
				System.out.println("匿名内部类");
			}
		}).start();

		// Lambda 写法：参数列表 -> 方法体
		new Thread(() -> System.out.println("Lambda")).start();

		// 参数只有一个时可以省略圆括号
		Comparator<String> byLength = s -> s.length();

		// 方法体只有一行时可以省略 return 和大括号
		Comparator<String> asc = (a, b) -> a.compareTo(b);
		Comparator<String> desc = (a, b) -> {
			return b.compareTo(a);
		};

		String[] names = {"Bob", "Alice", "Grace"};
		Arrays.sort(names, desc);
		System.out.println(Arrays.toString(names));   // [Grace, Bob, Alice]
	}
}
```

省略规则总结：参数类型可省（由编译器推断）、单参数可省括号、单行可省 `return` 与花括号。

### 2.函数式接口

只有一个抽象方法的接口叫函数式接口，可以用 `@FunctionalInterface` 标注让编译器检查。Java 内置的四个最常用：

| 接口 | 抽象方法 | 含义 |
|---|---|---|
| `Supplier<T>` | `T get()` | 无参有返回，生产数据 |
| `Consumer<T>` | `void accept(T t)` | 有参无返回，消费数据 |
| `Function<T,R>` | `R apply(T t)` | 有参有返回，转换 |
| `Predicate<T>` | `boolean test(T t)` | 有参返回布尔，判断 |

```java
package lambda;

import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

public class FunctionalDemo {
	public static void main(String[] args) {
		Supplier<String> supplier = () -> "生产一个字符串";
		System.out.println(supplier.get());

		Consumer<String> consumer = s -> System.out.println("消费: " + s);
		consumer.accept("数据");

		Function<String, Integer> function = s -> s.length();
		System.out.println(function.apply("hello"));    // 5

		Predicate<Integer> isEven = n -> n % 2 == 0;
		System.out.println(isEven.test(4));             // true

		// 复合用法
		System.out.println(isEven.and(n -> n > 0).test(6));   // true
		System.out.println(isEven.negate().test(3));          // true
	}
}
```

### 3.方法引用

方法引用是 Lambda 的进一步简化：要写的 Lambda 恰好就是调用某个已有方法时，可以写成 `类名::方法名`。

```java
package lambda;

import java.util.List;
import java.util.function.Function;
import java.util.function.Supplier;

public class MethodRefDemo {
	public static void main(String[] args) {
		// 静态方法引用：类名::静态方法
		Function<String, Integer> f1 = Integer::parseInt;
		System.out.println(f1.apply("123"));            // 123

		// 实例方法引用：对象::实例方法
		String prefix = "hello";
		Supplier<Boolean> s1 = prefix::isEmpty;

		// 特定类型的方法引用：类名::实例方法（第一个参数作为调用者）
		Function<String, String> f2 = String::trim;
		System.out.println(f2.apply("  a  "));           // a

		// 构造器引用：类名::new
		Supplier<List<String>> s2 = java.util.ArrayList::new;

		// 对比：以下三种写法完全等价
		List.of("a", "b").forEach(s -> System.out.println(s));
		List.of("a", "b").forEach(System.out::println);
	}
}
```

## 四、Stream流

Stream 是对集合的**声明式**操作：只描述「要做什么」，不写「怎么遍历」。它不修改原集合，也不会存储数据。

### 1.创建与中间操作

中间操作返回新的 Stream，**是惰性的**——不调用终结操作就什么都不会执行。

```java
package stream;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

public class StreamDemo {
	public static void main(String[] args) {
		List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);

		// 三种创建方式
		Stream<Integer> fromList = nums.stream();
		Stream<String> fromArray = Arrays.stream(new String[] {"a", "b"});
		Stream<Integer> fromOf = Stream.of(1, 2, 3);

		// filter 过滤
		nums.stream()
			.filter(n -> n % 2 == 0)
			.forEach(n -> System.out.print(n + " "));   // 2 4 6
		System.out.println();

		// map 映射：一对一转换
		nums.stream()
			.map(n -> n * n)
			.forEach(n -> System.out.print(n + " "));   // 1 4 9 16 25 36
		System.out.println();

		// flatMap 展平：一对多，把嵌套结构压平
		List<List<Integer>> nested = List.of(List.of(1, 2), List.of(3, 4));
		nested.stream()
			.flatMap(List::stream)
			.forEach(n -> System.out.print(n + " "));   // 1 2 3 4
		System.out.println();

		// distinct 去重、sorted 排序、limit 取前几个、skip 跳过前几个
		nums.stream()
			.distinct()
			.sorted((a, b) -> b - a)
			.limit(3)
			.forEach(n -> System.out.print(n + " "));   // 6 5 4
		System.out.println();

		// peek 主要用于调试，看中间结果
		nums.stream().filter(n -> n > 3).peek(System.out::println).count();
	}
}
```

### 2.终结操作与Collectors

终结操作会触发整个流水线执行，并产生结果或副作用。**一个 Stream 只能终结一次**，终结后再用会抛 `IllegalStateException`。

```java
package stream;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class TerminalDemo {
	public static void main(String[] args) {
		List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);

		// forEach 遍历
		nums.stream().forEach(System.out::print);
		System.out.println();

		// count 个数、max / min
		System.out.println(nums.stream().filter(n -> n > 3).count());          // 3
		System.out.println(nums.stream().max(Integer::compareTo).orElse(0));   // 6

		// reduce 归约：把一串值合成一个
		int sum = nums.stream().reduce(0, Integer::sum);
		System.out.println(sum);                                               // 21

		// anyMatch / allMatch / noneMatch
		System.out.println(nums.stream().anyMatch(n -> n > 5));    // true
		System.out.println(nums.stream().allMatch(n -> n > 0));    // true

		// findFirst 短路查找，返回 Optional
		Optional<Integer> first = nums.stream().filter(n -> n > 2).findFirst();
		System.out.println(first.orElse(-1));                      // 3

		// collect 收集成集合
		List<Integer> evens = nums.stream()
				.filter(n -> n % 2 == 0)
				.collect(Collectors.toList());
		System.out.println(evens);                                 // [2, 4, 6]

		// 收集成 Set、String
		System.out.println(nums.stream().collect(Collectors.toSet()));
		System.out.println(nums.stream().map(String::valueOf)
				.collect(Collectors.joining(", ", "[", "]")));      // [1, 2, 3, 4, 5, 6]

		// 分组与分区
		Map<Boolean, List<Integer>> grouped = nums.stream()
				.collect(Collectors.partitioningBy(n -> n % 2 == 0));
		System.out.println(grouped.get(true));                     // [2, 4, 6]
	}
}
```

对象流的分组统计，是 Stream 最实用的场景：

```java
package stream;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

record Person(String name, String city, int age) {}

public class GroupDemo {
	public static void main(String[] args) {
		List<Person> people = List.of(
				new Person("小明", "北京", 18),
				new Person("小红", "上海", 20),
				new Person("小刚", "北京", 25));

		// 按城市分组
		Map<String, List<Person>> byCity = people.stream()
				.collect(Collectors.groupingBy(Person::city));
		System.out.println(byCity.keySet());                       // [上海, 北京]

		// 按城市分组后统计人数
		Map<String, Long> countByCity = people.stream()
				.collect(Collectors.groupingBy(Person::city, Collectors.counting()));
		System.out.println(countByCity);                           // {上海=1, 北京=2}

		// 按城市分组后求平均年龄
		Map<String, Double> avgAge = people.stream()
				.collect(Collectors.groupingBy(Person::city, Collectors.averagingInt(Person::age)));
		System.out.println(avgAge);

		// 按城市分组后只要人名
		Map<String, List<String>> namesByCity = people.stream()
				.collect(Collectors.groupingBy(Person::city,
						Collectors.mapping(Person::name, Collectors.toList())));
		System.out.println(namesByCity);
	}
}
```

`Optional` 是为了避免空指针而设计的容器，核心用法：

```java
Optional<String> opt = Optional.ofNullable(getName());
opt.ifPresent(System.out::println);          // 有值才执行
String v = opt.orElse("默认值");              // 为空给默认值
String v2 = opt.orElseThrow(() -> new IllegalStateException("没值"));
```

## 五、反射与注解

### 1.Class对象

反射指程序运行时获取类的信息并操作它。`Class` 对象是入口，一个类在 JVM 里只有一个 `Class` 实例。

```java
package reflect;

public class ClassDemo {
	public static void main(String[] args) throws ClassNotFoundException {
		// 三种获取方式
		Class<?> c1 = String.class;                       // 类名.class
		Class<?> c2 = "abc".getClass();                    // 对象.getClass()
		Class<?> c3 = Class.forName("java.lang.String");   // Class.forName，最常用（配合配置文件的类名）

		System.out.println(c1 == c2 && c2 == c3);          // true，同一个 Class 对象

		System.out.println(c1.getName());                  // java.lang.String
		System.out.println(c1.getSimpleName());            // String
		System.out.println(c1.getPackageName());           // java.lang

		// 父类、接口、修饰符
		Class<?> list = java.util.ArrayList.class;
		System.out.println(list.getSuperclass());                    // class java.util.AbstractList
		System.out.println(java.util.Arrays.toString(list.getInterfaces()));
		System.out.println(java.lang.reflect.Modifier.isPublic(list.getModifiers()));  // true
	}
}
```

### 2.操作字段、方法、构造器

```java
package reflect;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectDemo {
	public static void main(String[] args) throws Exception {
		Class<?> clazz = Class.forName("reflect.Student");

		// 构造对象：newInstance 已被废弃，用 getDeclaredConstructor
		Constructor<?> ctor = clazz.getDeclaredConstructor(String.class, int.class);
		Object obj = ctor.newInstance("小明", 18);
		System.out.println(obj);

		// 操作私有字段：必须 setAccessible(true) 取消访问检查
		Field nameField = clazz.getDeclaredField("name");
		nameField.setAccessible(true);
		System.out.println(nameField.get(obj));            // 小明
		nameField.set(obj, "小红");
		System.out.println(obj);                            // Student{name=小红, age=18}

		// 调用方法
		Method study = clazz.getDeclaredMethod("study", String.class);
		study.setAccessible(true);
		study.invoke(obj, "数学");

		// 无参方法
		Method hello = clazz.getMethod("hello");
		System.out.println(hello.invoke(obj));
	}
}

class Student {
	private String name;
	private int age;

	public Student(String name, int age) {
		this.name = name;
		this.age = age;
	}

	private void study(String subject) {
		System.out.println(name + " 正在学 " + subject);
	}

	public String hello() {
		return "Hello, " + name;
	}

	@Override
	public String toString() {
		return "Student{name=" + name + ", age=" + age + "}";
	}
}
```

`getDeclaredXxx` 能拿到本类声明的所有成员（含私有），`getXxx` 只能拿到 public 的（含继承来的）。反射会绕过泛型和访问控制，是框架的基石（Spring 的依赖注入、MyBatis 的结果映射都靠它），但性能明显低于直接调用，业务代码不要滥用。

### 3.注解与元注解

注解本身只是标记，**不会自己生效**，必须有代码（反射）去读取它才起作用。

```java
package annotate;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

// 自定义注解
@Retention(RetentionPolicy.RUNTIME)     // 保留到运行时，才能被反射读到
@Target({ElementType.METHOD, ElementType.TYPE})   // 能贴在哪些位置
@Documented                              // 生成 javadoc 时带上
@Inherited                               // 子类可以继承父类的这个注解
public @interface MyTest {
	// 使用 value() 时可以简写成 @MyTest("xxx")
	String value() default "";

	int order() default 0;
}

// 使用
@MyTest("类上的注解")
class Service {
	@MyTest(value = "方法上的注解", order = 1)
	public void run() {
		System.out.println("run 执行");
	}
}

class TestRunner {
	public static void main(String[] args) throws Exception {
		Class<?> clazz = Service.class;
		if (clazz.isAnnotationPresent(MyTest.class)) {
			System.out.println(clazz.getAnnotation(MyTest.class).value());
		}

		// 通过反射找带注解的方法并调用，JUnit 就是这么实现的
		for (Method m : clazz.getDeclaredMethods()) {
			if (m.isAnnotationPresent(MyTest.class)) {
				System.out.println(m.getAnnotation(MyTest.class).value());
				m.invoke(clazz.getDeclaredConstructor().newInstance());
			}
		}
	}
}
```

`@Retention` 三档：

| 值 | 保留阶段 | 用途 |
|---|---|---|
| `SOURCE` | 只在源码 | `@Override`、`@SuppressWarnings`，给编译器看的 |
| `CLASS` | 编译到 class 文件但运行时不可见 | 默认值 |
| `RUNTIME` | 运行时可反射读取 | 自定义注解基本都用这个 |

### 4.动态代理

在运行时生成一个代理对象，在调用真实方法前后插入额外逻辑（日志、事务、权限）。JDK 动态代理要求目标类**实现接口**。

```java
package proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class ProxyDemo {
	public static void main(String[] args) {
		UserService target = new UserServiceImpl();

		UserService proxy = (UserService) Proxy.newProxyInstance(
				target.getClass().getClassLoader(),
				target.getClass().getInterfaces(),
				new InvocationHandler() {
					@Override
					public Object invoke(Object proxyObj, Method method, Object[] params) throws Throwable {
						System.out.println("前置日志: " + method.getName());
						Object result = method.invoke(target, params);   // 调用真实方法
						System.out.println("后置日志");
						return result;
					}
				});

		System.out.println(proxy.getUserName(1));
	}
}

interface UserService {
	String getUserName(int id);
}

class UserServiceImpl implements UserService {
	@Override
	public String getUserName(int id) {
		return "用户" + id;
	}
}
```

CGLIB（Spring 内部用它）不需要接口，直接生成子类代理，但类不能是 `final`。

## 六、JVM

### 1.运行时内存结构

| 区域 | 线程私有 | 存放内容 | 是否 OOM |
|---|---|---|---|
| 程序计数器 | 是 | 当前执行的字节码行号 | 不会 |
| 虚拟机栈 | 是 | 方法调用的栈帧（局部变量表、操作数栈） | 会（栈深度溢出/创建栈失败） |
| 本地方法栈 | 是 | native 方法的栈帧 | 会 |
| 堆 | 否 | **几乎所有的对象实例和数组** | 会（最常见） |
| 方法区 / 元空间 | 否 | 类信息、常量、静态变量 | 会 |

堆进一步分代（JDK 8 以后）：

- **新生代**：Eden + Survivor0 + Survivor1，默认比例 8:1:1，新对象先分配在 Eden；
- **老年代**：对象在新生代熬过默认 15 次 GC（`-XX:MaxTenuringThreshold`）后晋升。

内存相关的常见参数：

```bash
-Xms512m                  # 堆初始大小
-Xmx1024m                 # 堆最大大小，建议和 Xms 设成一样避免动态调整
-Xmn256m                  # 新生代大小
-XX:MetaspaceSize=128m    # 元空间初始大小
-XX:+HeapDumpOnOutOfMemoryError   # OOM 时自动导出堆快照
```

栈溢出和堆溢出是两回事，判断依据是异常类型：

```java
// 递归没有出口 → java.lang.StackOverflowError
// 不断往集合里塞对象 → java.lang.OutOfMemoryError: Java heap space
```

### 2.垃圾回收

**怎么判断对象是垃圾**：主流用**可达性分析**，从 GC Roots（栈中的局部变量、静态变量、常量等）出发，能走到的对象是活的，走不到的就是垃圾。早期用引用计数，解决不了循环引用。

**垃圾回收算法**：

| 算法 | 思路 | 缺点 |
|---|---|---|
| 标记-清除 | 标记垃圾后直接清理 | 产生内存碎片 |
| 复制 | 把活对象复制到另一块空内存 | 浪费一半空间 |
| 标记-整理 | 标记后把活对象向一端移动 | 移动成本高 |
| 分代收集 | 新生代用复制，老年代用标记-整理/清除 | 无 |

**分代回收的过程**：新对象在 Eden，Eden 满了触发 **Minor GC**，活对象复制到 Survivor；反复存活的对象晋升到老年代；老年代满了触发 **Full GC**，通常伴随较长的停顿（Stop The World）。

常用收集器：`Serial`（单线程）、`Parallel`（吞吐量优先，JDK 8 默认）、`CMS`（低延迟，已废弃）、`G1`（JDK 9 起默认，可预测停顿）、`ZGC`（超低延迟）。

**对象什么时候真的被回收**？至少要经过两次标记：不可达后判断是否需要执行 `finalize()`，若没有 `finalize()` 或已执行过，就可以回收了。

### 3.类加载机制

类的生命周期：加载 → 链接（验证、准备、解析）→ 初始化 → 使用 → 卸载。

**双亲委派模型**：收到类加载请求时，先交给父加载器，父加载器加载不了才自己加载。

```
BootstrapClassLoader（加载 rt.jar / java.base，C++ 实现）
        ↑
PlatformClassLoader（JDK 9+，加载扩展类）
        ↑
AppClassLoader（加载 classpath 下的类）
        ↑
自定义 ClassLoader
```

好处：保证 `java.lang.String` 这类核心类只会被同一个加载器加载，避免用户伪造一个同名类替换掉它。

类初始化的触发时机（**主动引用**才触发）：

- `new`、读写静态字段、调用静态方法；
- 反射调用 `Class.forName`（带初始化参数）；
- 初始化子类时父类先初始化；
- 虚拟机启动时的主类。

**被动引用不触发初始化**，例如通过子类访问父类的静态字段、通过数组定义引用类、引用常量（常量在编译期就放进常量池了）。

## 七、网络编程

### 1.TCP

TCP 面向连接、可靠、有先后顺序，通信前要先三次握手建立连接。服务端用 `ServerSocket`，客户端用 `Socket`。

```java
package net;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class TcpServer {
	public static void main(String[] args) throws IOException {
		ServerSocket server = new ServerSocket(8080);
		System.out.println("服务端启动，等待连接…");

		try (Socket socket = server.accept()) {          // 阻塞，直到有客户端连上
			BufferedReader in = new BufferedReader(
					new InputStreamReader(socket.getInputStream()));
			PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

			String line = in.readLine();
			System.out.println("收到: " + line);

			out.println("已收到: " + line);                // 回写给客户端
		}
		server.close();
	}
}
```

```java
package net;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class TcpClient {
	public static void main(String[] args) throws IOException {
		try (Socket socket = new Socket("127.0.0.1", 8080)) {
			PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
			BufferedReader in = new BufferedReader(
					new InputStreamReader(socket.getInputStream()));

			out.println("你好，服务端");
			System.out.println("服务端回应: " + in.readLine());
		}
	}
}
```

要点：

- `accept()` 阻塞等待连接，`readLine()` 阻塞等待数据，所以实际服务端要给每个连接开一个线程（或用 NIO / 线程池）；
- 端口 0 ~ 1023 是系统保留的，自定义服务用 1024 以上；
- 输出流用 `PrintWriter` 并开 `autoFlush`，否则数据可能卡在缓冲区里发不出去。

### 2.UDP

UDP 无连接、不保证可靠、没有顺序，但快。适合视频直播、游戏这类能容忍丢包的场景。

```java
package net;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpDemo {
	public static void main(String[] args) throws Exception {
		// 发送端
		DatagramSocket sender = new DatagramSocket();
		byte[] data = "UDP 消息".getBytes("UTF-8");
		DatagramPacket packet = new DatagramPacket(
				data, data.length, InetAddress.getByName("127.0.0.1"), 9090);
		sender.send(packet);
		sender.close();

		// 接收端
		DatagramSocket receiver = new DatagramSocket(9090);
		byte[] buf = new byte[1024];
		DatagramPacket received = new DatagramPacket(buf, buf.length);
		receiver.receive(received);                       // 阻塞等待
		System.out.println(new String(received.getData(), 0, received.getLength(), "UTF-8"));
		receiver.close();
	}
}
```

TCP 与 UDP 对比：

| | TCP | UDP |
|---|---|---|
| 连接 | 面向连接 | 无连接 |
| 可靠性 | 可靠，有确认重传 | 不保证 |
| 顺序 | 保证 | 不保证 |
| 速度 | 慢 | 快 |
| 典型场景 | HTTP、文件传输、数据库 | 直播、游戏、DNS |

## 八、JDBC、Maven与JUnit

MySQL 语法和数据库设计见 [MySQL](/article/MySQL)，Servlet 与 Web 部分见 [JavaWeb](/article/JavaWeb)，这里只记 JDBC 的使用套路。

### 1.JDBC

六步固定流程：注册驱动 → 获取连接 → 创建 Statement → 执行 SQL → 处理结果 → 释放资源。

```java
package jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class JdbcDemo {
	public static void main(String[] args) {
		String url = "jdbc:mysql://localhost:3306/demo?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8";
		String user = "root";
		String password = "123456";

		// try-with-resources 自动关闭连接
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement ps = conn.prepareStatement("select id, name from user where id = ?")) {

			ps.setInt(1, 1);                     // 参数下标从 1 开始
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {               // next() 指向下一行，没有返回 false
					System.out.println(rs.getInt("id") + " " + rs.getString("name"));
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
```

**一律用 `PreparedStatement`，不要用字符串拼 SQL**：前者能防 SQL 注入，还有预编译缓存。

```java
// 危险：id 传入 "1 or 1=1" 就能拖库
String sql = "select * from user where id = " + id;

// 正确：参数占位用问号，由驱动负责转义
String sql2 = "select * from user where id = ?";
```

增删改用 `ps.executeUpdate()`，返回受影响的行数。事务用 `conn.setAutoCommit(false)` + `commit()` / `rollback()` 控制：

```java
conn.setAutoCommit(false);
try {
	// 多条 update ...
	conn.commit();
} catch (SQLException e) {
	conn.rollback();
	throw e;
}
```

实际项目不会手写这些，而是用 **连接池**（HikariCP、Druid）+ **MyBatis / MyBatis Plus**（见 [MyBatis Plus](/article/MyBatis Plus)）。

### 2.Maven

Maven 的约定：`src/main/java` 放源码，`src/main/resources` 放配置，`src/test/java` 放测试，统一输出到 `target`。

```xml
<project>
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.example</groupId>          <!-- 组织名 -->
	<artifactId>demo</artifactId>           <!-- 项目名 -->
	<version>1.0-SNAPSHOT</version>         <!-- 版本，SNAPSHOT 表示开发中 -->

	<properties>
		<maven.compiler.source>17</maven.compiler.source>
		<maven.compiler.target>17</maven.compiler.target>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	</properties>

	<dependencies>
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<version>8.0.33</version>
			<scope>runtime</scope>          <!-- 依赖范围：编译 / 测试 / 运行 -->
		</dependency>
	</dependencies>
</project>
```

坐标 `groupId:artifactId:version` 唯一确定一个依赖，可以在 [Maven 中央仓库](https://mvnrepository.com) 查。

常用命令：

```bash
mvn clean           # 删除 target
mvn compile         # 编译
mvn test            # 跑测试
mvn package         # 打成 jar / war
mvn install         # 装到本地仓库，供其他项目依赖
mvn dependency:tree # 查看依赖树，排查版本冲突
```

依赖范围 `scope`：

| scope | 编译 | 测试 | 运行 | 打包 | 典型依赖 |
|---|---|---|---|---|---|
| `compile`（默认） | 是 | 是 | 是 | 是 | 大部分依赖 |
| `provided` | 是 | 是 | 否 | 否 | `servlet-api`（容器已提供） |
| `runtime` | 否 | 是 | 是 | 是 | MySQL 驱动 |
| `test` | 否 | 是 | 否 | 否 | JUnit |

### 3.JUnit

```java
package test;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class CalculatorTest {
	private Calculator calculator;

	@BeforeEach                 // 每个测试方法前执行一次，用来准备数据
	void setUp() {
		calculator = new Calculator();
	}

	@AfterEach                  // 每个测试方法后执行一次，用来清理
	void tearDown() {
		calculator = null;
	}

	@Test
	@DisplayName("加法应该正确")
	void testAdd() {
		// 期望值在前，实际值在后
		Assertions.assertEquals(5, calculator.add(2, 3));
	}

	@Test
	void testDivideByZero() {
		// 断言一定会抛异常
		Assertions.assertThrows(ArithmeticException.class, () -> calculator.divide(1, 0));
	}

	@Test
	@Disabled("暂时不跑")
	void testSkipped() {
	}
}

class Calculator {
	int add(int a, int b) {
		return a + b;
	}

	int divide(int a, int b) {
		return a / b;
	}
}
```

断言方法都以 `assert` 开头：`assertEquals` / `assertTrue` / `assertNull` / `assertThrows` / `assertTimeout`。**JUnit 5 的测试类和测试方法都不需要 `public`**，和 JUnit 4 不同。
