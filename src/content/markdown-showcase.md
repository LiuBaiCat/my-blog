---
title: Markdown 语法展示
date: 2026-05-26
tags: [markdown, 随笔]
description: 一篇展示各种 Markdown 语法的示例文章。
pinned: true
---

## 文本样式

这是**加粗**，这是*斜体*，这是~~删除线~~，这是`行内代码`。

## 列表

### 无序列表

- React
- Vue
- Svelte

### 有序列表

1. 安装依赖
2. 编写代码
3. 部署上线

## 代码块

### JavaScript

```javascript
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

### CSS

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
```

### Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## 引用

> 编程不是关于你知道什么，而是关于你如何思考。
>
> — 某位程序员

## 图片

![React logo](/src/assets/react.svg)

## 任务列表

- [x] 搭建项目
- [x] 配置路由
- [ ] 添加评论功能
- [ ] 添加搜索功能
