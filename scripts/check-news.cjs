'use strict';
const fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('dist/news.json','utf8'));
const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const todays=data.stories.filter(s=>s.date===day),ids=new Set();
if(todays.length<10||todays.length>20)throw Error(`北京时间 ${day} 只有 ${todays.length} 条，必须补齐并精选为10—20条后发布。`);
for(const s of data.stories){if(ids.has(s.id))throw Error(`重复ID ${s.id}`);ids.add(s.id);if(!s.title||!s.summary||!s.source)throw Error(`条目${s.id}缺少必要信息`);const url=new URL(s.url);if(url.protocol!=='https:')throw Error(`条目${s.id}来源不是HTTPS`);if(s.publishedAt){const dt=new Date(s.publishedAt);if(Number.isNaN(dt.getTime()))throw Error(`条目${s.id}时间无效`);const local=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(dt);if(local!==s.date)throw Error(`条目${s.id}日期与北京时间不符`);if(dt>new Date())throw Error(`条目${s.id}不能填入未来发布时间`);}}
console.log(`通过：北京时间 ${day} ${todays.length} 条，合计 ${data.stories.length} 条；无重复ID，已核对时间格式与日期。`);
