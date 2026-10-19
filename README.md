# Xin News

一个采用 Hacker News 式紧凑列表的中文新闻聚合网站，关注科技、AI 工具、国内外时政与社会事件。

**访问网站：[https://ziyanlo.github.io/Xin-News/](https://ziyanlo.github.io/Xin-News/)**

## 阅读方式

- 标题直接概括事件，点击跳转新闻原文。
- 点击“详情”展开一句摘要，点击来源名称进入媒体或账号主页。
- 按“今日、全部、科技、时政、社会、其他”浏览，也可叠加地区与来源筛选。
- 使用北京时间，按发布时间倒序排列；缺少具体时分的条目标明“时间未提供”。

## 内容维护

每天选编目标为 10–20 条，保留最近 30 天资料。来源包括媒体报道、公开科技讨论及产品体验；投稿、转述与评论分别标注。

每次更新会删除最近30天（含当天）以外的资讯。更新脚本先核对当天有10–20条合格记录，再写入清理后的数据；校验失败时不会覆盖原文件。

数据保存在 `dist/news.json`，选编与核实规则见 [EDITORIAL.md](EDITORIAL.md)。GitHub Actions 负责发布仓库中的静态文件，不负责自动采集新闻。

## 本地预览

无需安装依赖或构建，在项目目录运行：

```sh
python3 -m http.server 5173 --directory dist
```

打开 [http://localhost:5173](http://localhost:5173)。

## 发布

网站已部署到 GitHub Pages，发布配置为 [pages.yml](.github/workflows/pages.yml)。

修改 `dist/` 下的文件并提交到 `main` 分支，会触发自动部署。运行结果可在仓库的 [Actions](https://github.com/ZiyanLo/Xin-News/actions) 页面查看。

更新新闻数据前，请遵循选编规则；提交前运行：

```sh
node scripts/update-news.cjs
node scripts/check-news.cjs
```

该检查按执行时的北京时间核对当天条数、ID 和发布时间。历史快照在之后的日期运行时，需要先补充当天资讯。

## 文件结构

| 路径 | 用途 |
| --- | --- |
| `dist/index.html` | 页面结构 |
| `dist/style.css` | 页面样式 |
| `dist/app.js` | 分类、筛选、时间显示与详情交互 |
| `dist/news.json` | 新闻数据 |
| `EDITORIAL.md` | 选编规则 |
| `scripts/update-news.cjs` | 校验当天数量并删除30天前记录 |
| `scripts/news-policy.cjs` | 统一的北京时间与保留期规则 |
| `scripts/check-news.cjs` | 新闻数据检查 |
| `.github/workflows/pages.yml` | GitHub Pages 自动部署 |
| `.openai/hosting.json` | 原 Sites 托管配置，GitHub Pages 不使用 |

网站无需 ChatGPT 登录。中国大陆不同地区及运营商的访问稳定性尚未全面验证。

## 免责声明

本站提供公开资讯索引与摘要，不代表认同来源观点；投稿、转述和评论不等同于已经核实的事实。内容可能有遗漏或延迟，请以原始来源与后续更正为准，不构成投资、医疗或法律建议。原文版权归相关权利人所有，问题可通过仓库 Issues 反馈。
