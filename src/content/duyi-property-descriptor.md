---
title: 前端深研(5/6)——属性描述符
date: 2026-07-08
updatetime: 2026-07-08
tags: [前端, 属性描述符]
description: 属性描述符是前端开发中一个重要的概念，它负责处理对象的属性行为。
pinned: true
---

# 1. 什么是属性描述符?

在 JavaScript 中，对象的每一个属性都对应着一个**属性描述符（Property Descriptor）**，它描述了该属性的行为和特征。通过属性描述符，我们可以精确控制属性的读取、修改、遍历等行为，甚至可以通过 getter/setter 实现属性的动态计算。

> JavaScript 中的属性描述符分为两类：
>
> - **数据属性描述符**：包含 value、writable、enumerable、configurable
> - **访问器属性描述符**：包含 get、set、enumerable、configurable

# 2. 获取属性描述符

使用 `Object.getOwnPropertyDescriptor` 可以获取对象某个自有属性的描述符。

```javascript
let obj = {
  a: 1,
  b: 2,
};

let descriptor = Object.getOwnPropertyDescriptor(obj, "a");
console.log(descriptor);
// { value: 1, writable: true, enumerable: true, configurable: true }
```

可以看到，默认情况下对象的属性描述符四个特性均为 `true`。

# 3. 数据属性描述符

使用 `Object.defineProperty` 可以定义或修改属性的描述符。

```javascript
Object.defineProperty(obj, "a", {
  value: 100, // 属性值
  writable: false, // 是否可重写
  enumerable: false, // 是否可遍历
  configurable: false, // 是否可再修改描述符本身
});
console.log(obj.a); // 100
console.log(obj); // { b: 2 } —— a 不可遍历，所以没有显示
```

四个描述符的含义：

| 描述符         | 说明                                             | 默认值      |
| -------------- | ------------------------------------------------ | ----------- |
| `value`        | 属性值                                           | `undefined` |
| `writable`     | 属性值是否可被改写                               | `false`     |
| `enumerable`   | 属性是否可被遍历（`for...in`、`Object.keys` 等） | `false`     |
| `configurable` | 属性描述符本身是否可被修改，以及属性是否可被删除 | `false`     |

## 3.1 writable —— 是否可重写

当 `writable` 为 `false` 时，尝试修改属性值会静默失败（严格模式下会报错）。

## 3.2 enumerable —— 是否可遍历

当 `enumerable` 为 `false` 时，该属性不会出现在 `for...in` 循环和 `Object.keys()` 的结果中。

## 3.3 configurable —— 是否可配置

当 `configurable` 为 `false` 时，无法再通过 `Object.defineProperty` 修改该属性的描述符（writable 从 true 改为 false 除外），也无法删除该属性。

# 4. 实际应用：保护数据

```javascript
let aGoods = {
  title: "商品A",
  price: 100,
  desc: "这是一个A商品",
  sellNum: 1,
  favorRate: 2,
  pic: "https://example.com/a.jpg",
};

class UIGoods {
  constructor(goods) {
    Object.defineProperty(this, "data", {
      value: goods,
      writable: false,
      configurable: false,
    });
  }
}

let goods = new UIGoods(aGoods);
goods.data = "abc"; // 静默失败，data 不可重写
console.log(goods.data); // 未被修改
```

> 通过将 `data` 属性的 `writable` 和 `configurable` 设为 `false`，可以有效防止外部意外篡改数据引用。

# 5. 访问器属性（get/set）

除了直接存储值的数据属性，JavaScript 还支持**访问器属性**，通过 `get`（读取器）和 `set`（设置器）来拦截属性的读写操作。

```javascript
let obj = {
  a: 1,
  b: 2,
};

Object.defineProperty(obj, "a", {
  get() {
    console.log("读取器被调用了");
    return this._a;
  },
  set(val) {
    console.log("设置器被调用了");
    this._a = val;
  },
});
console.log(obj.a); // 触发 getter
```

## 5.1 只读属性

通过 setter 抛出错误，可以实现只读属性：

```javascript
Object.defineProperty(obj, "b", {
  get() {
    return 114;
  },
  set(val) {
    throw new Error("b 属性是只读的，不能被重新赋值");
  },
});
console.log(obj.b); // 114
// obj.b = 100; // 抛出错误
```

# 6. 实际应用：UIGoods 进阶

结合数据属性描述符和访问器属性描述符，可以实现一个更健壮的 UIGoods 类：

```javascript
let aGoods = {
  title: "商品A",
  price: 100,
  desc: "这是一个A商品",
  sellNum: 1,
  favorRate: 2,
  pic: "https://example.com/a.jpg",
};

class UIGoods {
  get totalPrice() {
    return this.choose * this.data.price;
  }
  get isChoose() {
    return this.choose > 0;
  }

  constructor(goods) {
    // 深拷贝 goods 并冻结对象
    goods = { ...goods };
    Object.freeze(goods);
    Object.defineProperty(this, "data", {
      value: goods,
      writable: false,
      configurable: false,
    });

    let internalChoose = 0;
    Object.defineProperty(this, "choose", {
      configurable: false,
      get() {
        return internalChoose;
      },
      set(val) {
        if (typeof val !== "number") {
          throw new Error("choose 属性必须是数字类型");
        }
        let temp = parseInt(val);
        if (temp !== val) {
          throw new Error("choose 属性必须是整数");
        }
        if (val < 0) {
          throw new Error("choose 属性必须大于等于0");
        }
        internalChoose = val;
      },
    });

    Object.seal(this);
  }
}
Object.freeze(UIGoods.prototype);

let goods = new UIGoods(aGoods);
```

## 6.1 Object.freeze —— 冻结对象

`Object.freeze(goods)` 让 `goods` 对象的所有属性变为只读且不可配置，不可增删改属性。这里对商品数据做深拷贝后冻结，确保原始数据不可变。

## 6.2 getter/setter 实现类型校验

`choose` 属性使用了访问器描述符：

- `get()` 返回内部变量 `internalChoose`
- `set(val)` 对传入值进行三重校验：类型必须为 number、必须为整数、必须大于等于 0

## 6.3 Object.seal —— 密封对象

`Object.seal(this)` 阻止新属性被添加到对象，并将所有现有属性标记为不可配置。但已有属性的值仍然可以修改，除非该属性是只读的。

## 6.4 冻结原型

`Object.freeze(UIGoods.prototype)` 防止在原型上添加或修改方法，进一步增强封装的安全性。

```javascript
UIGoods.prototype.add = 2;
console.log(goods.add); // undefined —— 原型已冻结，添加失败
```
