'use strict';
const fs=require('node:fs');
const {validateNews}=require('./news-policy.cjs');
const result=validateNews(JSON.parse(fs.readFileSync('dist/news.json','utf8')));
console.log(`通过：北京时间 ${result.to} ${result.count} 条，保留 ${result.from} 至 ${result.to}，共 ${result.total} 条。`);
