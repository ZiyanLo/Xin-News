# Xin News

Xin News 是一个极简新闻聚合网站，采用 Hacker News 式编号列表。

GitHub Pages 地址（启用 Pages 并部署成功后）：https://ziyanlo.github.io/Xin-News/\n\n原 Sites 地址：https://xinwen-global-brief.zyanlo903.chatgpt.site/

## 本地运行

这是无需构建的静态站。可在项目目录运行：

```sh
python3 -m http.server 5173 --directory dist
```

然后访问 http://localhost:5173。

## 文件

- `dist/index.html`：页面结构
- `dist/style.css`：样式与响应式布局
- `dist/app.js`：分类、筛选和时间显示
- `dist/news.json`：近30天资讯数据
- `EDITORIAL.md`：采集、核实与日更规则
- `scripts/check-news.cjs`：发布时间、资讯数量和数据检查
- `.openai/hosting.json`：现有 Sites 托管配置

## 更新资讯

按 `EDITORIAL.md` 编辑数据，使用稳定递增ID，每天精选10—20条，目标15条；来源日期及时间必须真实，使用北京时间显示。发布前执行：

```sh
node scripts/check-news.cjs
```

该检查根据当前北京时间统计当天资讯；旧快照在未来日期执行时需要先补充当日资讯。

## GitHub Pages 部署\n\n仓库已提供 `.github/workflows/pages.yml`。在仓库 Settings → Pages → Build and deployment 中，将 Source 设为 **GitHub Actions**。之后每次推送 `main` 分支的 `dist/` 文件，都会自动发布静态网站。\n\n网站资源均为本站相对路径，不依赖外部字体或脚本。GitHub Pages 无需 ChatGPT 登录，但实际访问稳定性取决于地区与网络；未验证中国大陆所有运营商的连通情况。\n\nPages 自动发布只负责把仓库已有文件上线，不会自动采集新闻；日更任务仍需将更新提交到本仓库。
