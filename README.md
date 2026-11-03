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
- 五行攻防推演：金木水火土五个阵眼，支持选择、单步、自动推演、暂停、复位与实时日志。
- 错误码数据流：24 FPS 的五行、八卦与 HTTP 错误码字符雨，可通过悬浮控制区或终端关闭。
- 本地模拟终端 v2：支持信息查询、模拟侦察、Base64 编解码、阵法控制、站内导航、每日心法与 404 指令；支持方向键历史、Tab 补全和 Ctrl+L 清屏。
- 玄算器：真实执行 Base64、URL 编解码与 Web Crypto SHA-256，支持复制、清空和结果回送，输入不上传。
- 404 天雷：闪电、故障字、错误堆栈与可选 Web Audio 合成雷音；雷音默认关闭，支持 Escape、关闭按钮和归位按钮退出。
- 攻击链复盘：四个授权实验案例可切换，展示方法、防御与复盘笔记。
- 八门工具谱：按侦察、Web、权限分类筛选。
- Ctrl+K 聚焦终端，另含响应式导航、滚动进度、键盘焦点与 `prefers-reduced-motion` 支持。

## 技术

React 19 · TypeScript · Vite · Tailwind CSS · Lucide Icons · Canvas 2D · Web Crypto · Web Audio

所有视觉与声音素材均由代码生成，无外部图片、字体、音频或数据请求。终端仅解析预设文本，模拟侦察不发起网络请求，不执行系统命令。安全工具信息仅用于授权学习、漏洞验证与防御研究。
