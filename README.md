# Liubai's Blog

一个用 React 捣鼓的个人博客，就想有个地儿写写技术笔记，顺便折腾一下新技术。
A personal blog built with React. Just a place to write tech notes and play around with new stuff.

## 功能 / Features

支持 Markdown 写文章，直接丢 `src/content/` 里就行，不用配数据库。
Write posts in Markdown, drop them into `src/content/`, no database needed.

可以给文章打标签，按主题分类查找很方便。
Tag your posts and browse by topic.

支持全文搜索，搜标题、描述、标签都行。
Full-text search across titles, descriptions, and tags.

按年份归档，看看这一年都写了啥。
Timeline archive grouped by year.

亮色暗色主题随便切换。
Toggle between light and dark mode.

响应式布局，手机电脑都能好好看。
Responsive — works on both desktop and mobile.

页面按需加载，首屏很快。
Lazy loading for fast first paint.

## 技术栈 / Tech Stack

- **框架 / Framework**: React 19 + TypeScript
- **构建 / Build**: Vite 8
- **UI**: Ant Design 6
- **路由 / Router**: React Router 7
- **Markdown**: react-markdown + rehype + remark
- **包管理 / Package Manager**: pnpm

## 本地跑起来 / Get Started

```bash
pnpm install     # 装依赖 / Install dependencies
pnpm dev         # 启动开发 / Start dev server with HMR
pnpm build       # 构建 / Build for production
pnpm preview     # 预览 / Preview production build
```

## 写文章 / Writing Posts

在 `src/content/` 下新建 `.md` 文件，开头写 YAML 头信息。
Create a `.md` file in `src/content/` with YAML front-matter.

```markdown
---
title: 我的新文章 / My New Post
date: 2026-06-04
tags: [React, 前端 / frontend]
description: 随便写写 / Just a test
---

这里是正文...
Content goes here...
```

保存后刷新页面就能看到了。
Save it and refresh — it'll show up automatically.

## 项目结构 / Project Structure

```
src/
├── main.tsx          # 入口 / Entry point
├── App.tsx           # 路由配置 / Route config
├── content/          # Markdown 文章 / Posts
├── components/       # 组件 / Reusable components
├── pages/            # 页面 / Page components
├── utils/            # 工具函数 / Utilities
└── styles/           # 样式变量 / CSS variables
```

## 部署 / Deployment

托管在 GitHub Pages 上，推送 `main` 分支自动部署。
Hosted on GitHub Pages. Push to `main` and it auto-deploys.

👉 [https://liubaicat.github.io/my-blog/](https://liubaicat.github.io/my-blog/)
