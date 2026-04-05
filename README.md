# Donder Assistant

一个面向太鼓达人玩家的纯前端工具站，包含谱面定数计算、谱面详情查看、练习模式和出勤小工具。

项目基于 Vite + React + Fluent UI，算法在浏览器中通过 Pyodide 执行：

- 不依赖后端服务
- 不要求本地安装 Python
- 可部署为静态网站

## 功能概览

### 1. 谱面定数计算

- 支持导入 .tja / .zip（拖拽或文件选择）
- 自动解析并计算多维度指标：体力、复合、节奏、手速、爆发等
- 支持搜索、筛选、排序
- 结果可导出为 CSV
- 收藏按歌曲维度管理（同曲多分支统一）

### 2. 谱面详情与可视化

- 谱面基础信息与定数明细
- 音符间隔统计
- 谱面预览与全屏查看
- 定数详情雷达图

### 3. 练习模式

- TJA 本地导入后可直接开练
- 键盘 / 触摸输入统一逻辑
- 暂停后可恢复，支持按小节跳转
- 未加载谱面时可自由敲击（有鼓面反馈和打击音）
- 可调节判定补偿、鼓面位置/缩放、卷速与整体变速

### 4. 出勤工具

- 单曲价格速算
- 目标成绩速算

### 5. 离线与缓存

- PWA manifest 与离线页面
- 本地缓存与持久化（localStorage / IndexedDB）

## 技术栈

- React 19
- React Router
- Fluent UI React v9
- Vite 5
- Pyodide
- JavaScript + TypeScript 混合工程

## 快速开始

### 环境要求

- Node.js 18+
- 推荐 pnpm

### 安装依赖

使用 pnpm：

```bash
pnpm install
```

使用 npm：

```bash
npm install
```

### 启动开发环境

```bash
pnpm dev
```

默认地址：

http://localhost:5173/

### 构建生产版本

```bash
pnpm build
```

产物目录：

dist/

### 本地预览生产包

```bash
pnpm preview
```

## 常用命令

```bash
pnpm dev      # 开发模式
pnpm build    # 构建
pnpm preview  # 预览构建产物
```

## 项目结构（核心）

```text
src/
  main.jsx
  PracticeModePage.jsx
  practice-mode/
    PracticeToolbar.jsx
    PracticeStage.jsx
    PracticeBreadcrumb.jsx
  practice-mode-core.js
  data-engine.js
  tjs-analyzer.ts
  constants-csv.worker.js
  ChartDetailPage.jsx
  ConstantsTablePage.jsx
  ConstantsDetailPage.jsx
  SingleSongPricePage.jsx
  TargetScorePage.jsx
  assets/py/
    calculator.py
    constants.csv
    体力.py
    复合.py
    节奏.py
    手速.py
    爆发.py

public/
  manifest.webmanifest
  offline.html
  coi-serviceworker.js
  pyodide/
```

## 部署说明

本项目为静态站点，可部署到：

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

在 GitHub Actions 环境下，vite 配置会使用 /donder-assistant/ 作为 base 路径。

## 常见问题

### 1. 首次进入加载慢

首次会下载 Pyodide 与相关资源，属于正常现象，后续会利用浏览器缓存加速。

### 2. 为什么没有后端

计算与解析都在浏览器完成，项目目标是本地可用、部署简单、隐私友好。

### 3. 触摸判定不准怎么办

可在系统设置中调节：

- 判定补偿
- 鼓面偏移（X/Y）
- 鼓面缩放
- 底部防误触高度

## 许可证

MIT
