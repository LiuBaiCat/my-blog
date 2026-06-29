---
title: 错误原因
date: 2026-06-29
updatetime: 2026-06-29
tags: [前端, 错误原因]
description: 解析前端开发中常见的错误原因，帮助开发者快速定位问题。
pinned: false
---

# 01. 项目启动失败

## 错误信息

启动 Vite 开发服务器时端口被占用：

```text
vite-project@0.0.0 dev
> vite

error when starting dev server:
Error: listen EACCES: permission denied ::1:5173
    at Server.setupListenHandle [as _listen2] (node:net:1886:21)
    at listenInCluster (node:net:1965:12)
    at GetAddrInfoReqWrap.doListen [as callback] (node:net:2139:7)
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:113:8) {
  code: 'EACCES',
  errno: -4092,
  syscall: 'listen',
  address: '::1',
  port: 5173
}
```

## 原因分析

Windows 系统会为 TCP 协议预留一段端口范围，这些端口不能被普通应用程序使用。Vite 默认端口 `5173` 可能恰好落在这个范围内。

> [!NOTE]
> 这通常发生在系统更新、Docker 或 Hyper-V 重置了端口排除范围之后。

## 排查方法

查看 Windows 当前 TCP 端口排除范围：

```bash
netsh int ipv4 show excludedportrange protocol=tcp
```

输出示例：

```
协议 tcp 端口排除范围

开始端口    结束端口
----------    --------
     5141        5240
     50000       50059     *

* - 管理的端口排除。
```

## 解决方案

以**管理员身份**打开终端，重启 Windows NAT 服务：

```bash
net stop winnat
net start winnat
```

> [!TIP]
> 重启后，之前被占用的 `5173` 端口即可释放。如果问题依旧，也可以在 `vite.config.ts` 中指定其他端口。

> [!WARNING]
> 必须以管理员身份运行终端，否则 `net stop winnat` 会因权限不足而失败。
