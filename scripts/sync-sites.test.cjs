'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {selectUpdate} = require('./sync-sites.cjs');
const now = new Date('2026-10-20T01:10:00Z');
function edition() { return {from:'2026-09-21',to:'2026-10-20',updated:'2026-10-20',updatedAt:'2026-10-20T01:01:00Z',stories:Array.from({length:15},(_,i)=>({id:i+1,date:'2026-10-20',title:'新闻',summary:'摘要',source:'媒体',sourceFamily:`source-${i%5}`,url:`https://example.com/${i}`,publishedAt:'2026-10-20T00:00:00Z'}))}; }
test('accepts a complete current edition; skips identical data',()=>{ const next=edition(); assert.deepEqual(selectUpdate(next,{updatedAt:'2026-10-19T01:00:00Z',stories:[]},now),next);assert.equal(selectUpdate(next,next,now),null); });
test('rejects stale or incomplete source without writing',()=>{const stale=edition();stale.stories.forEach(s=>s.date='2026-10-19');assert.throws(()=>selectUpdate(stale,edition(),now)); const short=edition();short.stories.length=6;assert.throws(()=>selectUpdate(short,edition(),now));});
test('never overwrites newer GitHub curation or reassigns IDs',()=>{const newer=edition();newer.updatedAt='2026-10-20T01:05:00Z';assert.equal(selectUpdate(edition(),newer,now),null);const changed=edition();changed.stories[0].url='https://example.com/changed';assert.throws(()=>selectUpdate(changed,edition(),now));});

test('counts Reuters syndication as one source and rejects concentrated editions',()=>{const bad=edition();bad.stories.forEach(s=>{delete s.sourceFamily;s.source='路透社 · 转述';});assert.throws(()=>selectUpdate(bad,edition(),now),/5个原始来源/);const concentrated=edition();concentrated.stories.slice(0,6).forEach(s=>s.sourceFamily='one');assert.throws(()=>selectUpdate(concentrated,edition(),now),/三分之一/);});

test("a newer valid GitHub edition survives an older concentrated Sites edition",()=>{const current=edition();current.updatedAt="2026-10-20T01:05:00Z";const old=edition();old.stories.forEach(s=>s.sourceFamily="one");assert.equal(selectUpdate(old,current,now),null);});
