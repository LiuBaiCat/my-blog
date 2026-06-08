---
title: screen常见指令
date: 2026-06-08
tags: ["screen", "指令"]
description: "screen常见指令"
---

screen常见指令

会话管理:

```bash
  screen -S <name>      # 启动命名会话
  screen -ls            # 查看所有会话
  screen -r             # 恢复会话
  Ctrl+a d              # 分离会话
```

窗口管理:

```bash
  Ctrl+a c              # 创建新窗口
  Ctrl+a n / p          # 下一个/上一个窗口
  Ctrl+a "              # 列出所有窗口
  Ctrl+a A              # 重命名窗口
  Ctrl+a k              # 关闭窗口
```

滚动与复制:

```bash
  Ctrl+a [              # 进入复制模式（用于滚动历史输出）
  ↑ / ↓ / PageUp / PageDown   # 在复制模式中移动
  空格开始/结束选择     # 复制文本
  Ctrl+a ]              # 粘贴文本
```

分屏:

```bash
  Ctrl+a S              # 水平分屏
  Ctrl+a |              # 垂直分屏
  Ctrl+a tab            # 切换分屏区域
  Ctrl+a Q              # 关闭除当前区域外的所有分屏
```
