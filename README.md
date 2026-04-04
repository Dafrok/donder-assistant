# Donder Assistant

一个专注太鼓达人谱面分析的纯前端工具集。

项目基于 Vite + React + Fluent UI，使用 Pyodide 在浏览器内运行 Python 算法；不依赖后端服务，也不要求本地安装 Python。

## 主要功能

### 1) 谱面分析

- 支持导入 `.tja` 文件或文件夹（拖拽 / 点击上传均可）
- 自动解析谱面并计算多维度定数：体力、复合、复合难占比、节奏、节奏难占比、手速、爆发
- 表格支持搜索、难度过滤、列排序
- 支持 CSV 导出当前计算结果
- 支持歌曲级收藏（同曲多分歧会统一收藏）

### 2) 谱面详情

- 展示谱面基础信息、间隔统计、定数明细
- 展示音符间隔分布（按小节）
- 内置谱面预览，可进入全屏查看
- 全屏预览支持缩放、拖动，并可保存预览图

### 3) 定数表

- 内置 `constants.csv` 并在 Web Worker 中解析，避免阻塞主线程
- 支持关键字搜索、列排序
- 详情页提供五维雷达图展示

### 4) 出勤工具

- 单曲价格速算
- 目标成绩速算（基于当前成绩反推判定分值）

### 5) 离线与缓存

- PWA manifest 与 service worker（生产环境）
- 收藏数据本地持久化（localStorage + IndexedDB）
- 网络可达性检测与状态提示

## 技术栈

- React 19
- React Router
- Fluent UI React v9
- Vite 5
- Pyodide（浏览器端 Python 运行时）
- TypeScript + JavaScript 混合工程

## 快速开始

### 环境要求

- Node.js >= 18

### 安装依赖

```bash
pnpm install
```

如果你使用 npm：

```bash
npm install
```

### 本地开发

```bash
pnpm dev
```

默认地址：`http://localhost:5173/`

### 构建

```bash
pnpm build
```

构建产物输出到 `dist/`。

### 预览构建结果

```bash
pnpm preview
```

## 使用说明

1. 打开“谱面分析”页。
2. 点击“上传谱面”或直接拖拽包含 `.tja` 的文件/文件夹到页面。
3. 等待解析与计算完成后，在表格中查看结果。
4. 使用搜索、难度过滤与排序定位目标谱面。
5. 点击行进入谱面详情，可查看间隔明细与谱面预览。
6. 需要留档时点击“导出定数”导出 CSV。

## 项目结构（核心目录）

```text
src/
  main.jsx                 应用入口与主路由
  data-engine.js           Pyodide 加载与批量计算调度
  tjs-analyzer.ts          TJA 解析后数据转换
  constants-csv.worker.js  定数表 CSV 解析 Worker
  AboutPage.jsx            关于页面
  ChartDetailPage.jsx      谱面详情与预览
  ConstantsTablePage.jsx   定数表页面
  ConstantsDetailPage.jsx  定数表详情与雷达图
  SingleSongPricePage.jsx  单曲价格速算
  TargetScorePage.jsx      目标成绩速算
  assets/py/
    calculator.py          Python 计算入口
    体力.py / 复合.py / 节奏.py / 手速.py / 爆发.py

public/
  manifest.webmanifest
  coi-serviceworker.js
  pyodide/
```

## 部署

本项目为静态站点，构建后可直接部署到任意静态托管平台：

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

默认 `vite.config.js` 会在 GitHub Actions 环境下使用 `/donder-assistant/` 作为 `base`。

## 许可证

MIT
