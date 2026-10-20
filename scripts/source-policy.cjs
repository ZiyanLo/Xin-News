'use strict';
const {beijingDay} = require('./news-policy.cjs');
function sourceFamily(story) {
  if (story.sourceFamily) return story.sourceFamily;
  const source = story.source || '';
  if (/路透|Reuters/i.test(source)) return 'Reuters';
  if (/Bloomberg|彭博/i.test(source)) return 'Bloomberg';
  if (/爱范儿|APPSO|AppSo|董车会/i.test(source)) return 'ifanr';
  if (/李老师/.test(source)) return 'whyyoutouzhele';
  return new URL(story.url).hostname.replace(/^www\./, '');
}
function validateSources(data, now = new Date()) {
  const today = data.stories.filter(s => s.date === beijingDay(now));
  const counts = new Map();
  for (const story of today) { const key = sourceFamily(story); counts.set(key, (counts.get(key) || 0) + 1); }
  if (counts.size < 5) throw Error('当天须至少有5个原始来源，转述同一通讯社不算多来源');
  for (const [key, count] of counts) if (count > Math.floor(today.length / 3)) throw Error(`${key} 占 ${count}/${today.length}，超过三分之一`);
  return Object.fromEntries(counts);
}
module.exports = {sourceFamily, validateSources};
