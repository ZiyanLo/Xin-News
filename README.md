# Xin News

Xin News 是一个极简新闻聚合网站，采用 Hacker News 式编号列表。

线上网站：https://xinwen-global-brief.zyanlo903.chatgpt.site/

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

GitHub 保存代码，网站继续由现有 Sites 托管；首次同步本身不会启用 GitHub 自动部署或双向同步。
