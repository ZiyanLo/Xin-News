'use strict';
const DAY=86400000;
function beijingDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
function windowFor(now=new Date()){const to=beijingDay(now);return {from:new Date(Date.parse(to+'T00:00:00Z')-29*DAY).toISOString().slice(0,10),to}}
function validateNews(data,now=new Date()){
 const {from,to}=windowFor(now),ids=new Set();
 if(!Array.isArray(data.stories))throw Error('stories必须为数组');
 const count=data.stories.filter(s=>s.date===to).length;
 if(count<10||count>20)throw Error(`北京时间 ${to} 有 ${count} 条，必须为10—20条后才能更新。`);
 if(data.from!==from||data.to!==to)throw Error(`资料范围必须为 ${from} 至 ${to}`);
 for(const s of data.stories){
  if(!Number.isInteger(s.id)||ids.has(s.id))throw Error('ID必须为不重复的整数');ids.add(s.id);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s.date)||s.date<from||s.date>to)throw Error(`条目${s.id}不在最近30天内`);
  if(!s.title||!s.summary||!s.source)throw Error(`条目${s.id}缺少必要信息`);
  if(new URL(s.url).protocol!=='https:')throw Error(`条目${s.id}来源必须为HTTPS`);
  if(s.publishedAt){const time=new Date(s.publishedAt);if(Number.isNaN(time.getTime())||beijingDay(time)!==s.date||time>now)throw Error(`条目${s.id}发布时间或北京时间日期不正确`)}
 }
 return {from,to,count,total:data.stories.length};
}
function prepareNews(candidate,now=new Date()){
 const data=structuredClone(candidate),{from,to}=windowFor(now);
 if(!Array.isArray(data.stories))throw Error('stories必须为数组');
 const previous=data.stories.length;
 data.stories=data.stories.filter(s=>s.date>=from&&s.date<=to);
 data.from=from;data.to=to;data.updated=to;data.updatedAt=now.toISOString();
 const today=data.stories.filter(s=>s.date===to).sort((a,b)=>(Date.parse(b.publishedAt)||0)-(Date.parse(a.publishedAt)||0)||b.id-a.id);
 data.dailyEdition={date:to,ids:today.map(s=>s.id)};
 validateNews(data,now);
 return {data,removed:previous-data.stories.length};
}
module.exports={beijingDay,windowFor,validateNews,prepareNews};
