# 0r41n · 网络安全个人主页

一个适合 GitHub Pages 的纯静态个人站。内容提炼自授权靶场学习笔记，以“道教美学 × 网络安全”呈现真实学习方向、攻击链复盘、常用工具与安全资源。

## 本地运行

```bash
npm install
npm run dev
```

开发服务器基于 Vite，可通过 `npm run dev -- --host 0.0.0.0 --port 7100` 指定监听地址和端口。

## 构建

```bash
npm run build
npm run preview
```

构建结果位于 `dist/`，无服务端、数据库或运行时密钥。

## GitHub Pages

仓库包含 `.github/workflows/deploy.yml`。将代码推送到 `main` 分支后，在仓库 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。工作流会安装依赖、构建 `dist/` 并部署。

Vite 使用相对资源路径 `base: './'`，因此用户站与项目站均可使用。公开内容已主动省略实验 IP、凭据与 Flag；请勿将私人 Obsidian 笔记目录直接放入本仓库。

## 主要交互

- Canvas 太极网络阵：轨道节点、连线、扫描指针与鼠标响应，支持阴/阳模式与暂停。
- 本地模拟终端：支持 `help`、`whoami`、`skills`、`labs`、`ethics`、`github`、`clear`，不执行系统命令。
- 攻击链复盘：四个授权实验案例可切换，展示方法、防御与复盘笔记。
- 八门工具谱：按侦察、Web、权限分类筛选。
- 响应式导航、滚动进度、键盘焦点与 `prefers-reduced-motion` 支持。

## 技术

React 19 · TypeScript · Vite · Tailwind CSS · Lucide Icons · Canvas 2D

所有视觉素材均由代码绘制，无外部图片、字体或数据请求。安全工具信息仅用于授权学习、漏洞验证与防御研究。
