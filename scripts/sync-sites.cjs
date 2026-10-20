'use strict';
const fs = require('node:fs');
const {validateNews, beijingDay} = require('./news-policy.cjs');
const {validateSources} = require('./source-policy.cjs');
const SOURCE = 'https://xinwen-global-brief.zyanlo903.chatgpt.site/news.json';
function selectUpdate(candidate, current, now = new Date()) {
  if (Date.parse(current.updatedAt) > Date.parse(candidate.updatedAt)) {
    validateNews(current, now);
    validateSources(current, now);
    return null;
  }
  validateNews(candidate, now);
  validateSources(candidate, now);
  const today = beijingDay(now);
  const stamp = Date.parse(candidate.updatedAt);
  if (candidate.updated !== today || !Number.isFinite(stamp) || stamp > now.getTime()) throw Error('来源尚无当天有效更新');
  const existing = new Map(current.stories.map(s => [s.id, s]));
  for (const s of candidate.stories) {
    if (existing.has(s.id) && existing.get(s.id).url !== s.url) throw Error(`条目 ${s.id} 的来源变更，须人工核对`);
  }
  if (JSON.stringify(candidate) === JSON.stringify(current)) return null;
  return candidate;
}
async function main() {
  const response = await fetch(SOURCE, {signal: AbortSignal.timeout(30000), cache: 'no-store', redirect: 'error'});
  if (!response.ok) throw Error(`来源请求失败：${response.status}`);
  const body = await response.text();
  if (Buffer.byteLength(body) > 2000000) throw Error('来源数据过大');
  const path = 'dist/news.json';
  const next = selectUpdate(JSON.parse(body), JSON.parse(fs.readFileSync(path, 'utf8')));
  if (!next) { console.log('GitHub 已是最新版本，无需覆盖。'); return; }
  fs.writeFileSync(path + '.tmp', JSON.stringify(next, null, 2) + '\n');
  fs.renameSync(path + '.tmp', path);
  console.log(`已同步 ${next.updated}，今日 ${next.stories.filter(s => s.date === next.updated).length} 条。`);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = {selectUpdate};
