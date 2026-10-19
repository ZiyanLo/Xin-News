'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {windowFor,prepareNews,validateNews}=require('./news-policy.cjs');
const now=new Date('2026-10-19T05:00:00Z');
function fixture(n=15){return {stories:Array.from({length:n},(_,i)=>({id:i+1,date:'2026-10-19',title:'测试标题',summary:'测试摘要。',source:'测试来源',url:'https://example.com/'+i}))}}
test('北京时间跨日与月末的30天范围',()=>{assert.deepEqual(windowFor(now),{from:'2026-09-20',to:'2026-10-19'});assert.equal(windowFor(new Date('2026-10-19T16:00:00Z')).to,'2026-10-20');assert.deepEqual(windowFor(new Date('2026-03-01T01:00:00Z')),{from:'2026-01-31',to:'2026-03-01'})});
test('保留第30天，删除第31天，清理选编记录',()=>{const candidate=fixture();candidate.stories.push({...candidate.stories[0],id:100,date:'2026-09-20'},{...candidate.stories[0],id:101,date:'2026-09-19'});candidate.dailyEdition={ids:[101]};const {data,removed}=prepareNews(candidate,now);assert.equal(removed,1);assert(data.stories.some(s=>s.id===100));assert(!data.stories.some(s=>s.id===101));assert.equal(data.dailyEdition.ids.length,15);assert.equal(candidate.stories.length,17);validateNews(data,now)});
test('更新不足10条或超过20条时失败，原数据不变',()=>{for(const n of [9,21]){const c=fixture(n),before=JSON.stringify(c);assert.throws(()=>prepareNews(c,now),/10—20/);assert.equal(JSON.stringify(c),before)}for(const n of [10,20])assert.equal(prepareNews(fixture(n),now).data.stories.length,n)});
test('重复ID和时区不一致的时间被拒绝',()=>{const c=fixture();c.stories[1].id=1;assert.throws(()=>prepareNews(c,now),/ID/);const d=fixture();d.stories[0].publishedAt='2026-10-18T12:00:00Z';assert.throws(()=>prepareNews(d,now),/时间/)});
test('检查器拒绝遗漏清理的旧记录',()=>{const {data}=prepareNews(fixture(),now);data.stories.push({...data.stories[0],id:100,date:'2026-09-19'});assert.throws(()=>validateNews(data,now),/30天/)});
