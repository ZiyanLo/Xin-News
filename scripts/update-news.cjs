'use strict';
const fs=require('node:fs');
const {prepareNews}=require('./news-policy.cjs');
const input=process.argv[2]||'dist/news.json',output='dist/news.json';
const {data,removed}=prepareNews(JSON.parse(fs.readFileSync(input,'utf8')));
const temp=output+'.tmp-'+process.pid;
try{fs.writeFileSync(temp,JSON.stringify(data,null,2)+'\n');fs.renameSync(temp,output)}finally{if(fs.existsSync(temp))fs.unlinkSync(temp)}
console.log(`更新完成：${data.dailyEdition.date} ${data.dailyEdition.ids.length} 条；删除超期记录 ${removed} 条；保留 ${data.from} 至 ${data.to}。`);
