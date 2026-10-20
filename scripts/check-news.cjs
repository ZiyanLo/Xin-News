'use strict';
const fs=require('node:fs');
const {validateNews}=require('./news-policy.cjs');
const data=JSON.parse(fs.readFileSync('dist/news.json','utf8'));
const result=validateNews(data);
const sources=require('./source-policy.cjs').validateSources(data);
console.log('原始来源分布：'+JSON.stringify(sources));
console.log(`通过：北京时间 ${result.to} ${result.count} 条，保留 ${result.from} 至 ${result.to}，共 ${result.total} 条。`);
