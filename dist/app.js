'use strict';
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let stories=[],view='今日',limit=30;
function sourceName(s){if(s.source.startsWith('李老师'))return '李老师不是你老师';if(s.source==='APPSO / 爱范儿')return 'APPSO';return s.source.replace(/ · (转载|分析)$/,'')}
function beijingDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
function newestFirst(a,b){return b.date.localeCompare(a.date)||(Date.parse(b.publishedAt)||0)-(Date.parse(a.publishedAt)||0)||b.id-a.id}
function displayTime(s,now=new Date()){
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 const parts=today.split('-').map(Number),day=Date.UTC(parts[0],parts[1]-1,parts[2]),eventDay=Date.parse(s.date+'T00:00:00Z'),days=Math.round((day-eventDay)/86400000);
 if(days===0){if(s.publishedAt){const timestamp=new Date(s.publishedAt);if(!Number.isNaN(timestamp.getTime())&&new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(timestamp)===today)return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(timestamp)}return '时间未提供'}
 if(days===1)return '昨日';
 const weekday=(new Date(day).getUTCDay()+6)%7;
 if(days>1&&days<=weekday)return ['周日','周一','周二','周三','周四','周五','周六'][new Date(eventDay).getUTCDay()];
 return s.date.slice(5);
}
function sourceHome(s){if(s.sourceHomepage)return s.sourceHomepage;const u=new URL(s.url);if(u.hostname==='x.com'||u.hostname==='twitter.com')return u.origin+'/'+u.pathname.split('/').filter(Boolean)[0];if(s.source.startsWith('路透社'))return 'https://www.reuters.com/';return u.origin+'/'}
function render(){
 const query=$('#search').value.trim().toLowerCase(),region=$('#region').value,source=$('#source').value;
 const list=stories.filter(s=>(view==='今日'?s.date===beijingDate():view==='全部'?true:s.cat===({科技:'科技',时政:'政治',社会:'社会民生',其他:'其他'}[view]))&&(!region||(region==='domestic'?s.area==='中国大陆':s.area!=='中国大陆'))&&(!source||sourceName(s)===source)&&[s.title,s.summary,s.source,s.region,s.company].join(' ').toLowerCase().includes(query));
 list.sort(newestFirst);
 for(const id of ['region','source']){const selected=$('#'+id).value;$('#'+id+'Button').classList.toggle('filtered',!!selected);$('#'+id+'Button').title=selected?(id==='region'?(selected==='domestic'?'国内':'全球'):selected):'全部'+(id==='region'?'地区':'来源');document.querySelectorAll('[data-filter="'+id+'"]').forEach(o=>o.setAttribute('aria-selected',String(o.dataset.value===selected)))}
 $('#regionButton span').textContent=region?(region==='domestic'?'国内':'全球'):'地区';
 document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-current',b.dataset.view===view?'page':'false')});
 $('#news').innerHTML=list.length?list.slice(0,limit).map((s,i)=>{let domain;try{domain=new URL(s.url).hostname.replace(/^www\./,'')}catch{domain='原文'}return `<article class="story"><span class="number">${i+1}.</span><div><div class="headline"><a class="title" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a><span class="domain">(${esc(domain)})</span></div><div class="meta"><time datetime="${esc(s.publishedAt||s.date)}" title="${esc(s.date)}（北京时间）">${esc(displayTime(s))}</time><span class="sep">｜</span><a class="source-link" href="${esc(sourceHome(s))}" title="${esc(s.source)}主页" target="_blank" rel="noopener noreferrer">${esc(s.source)}</a><span class="sep">｜</span>${esc(s.kind)}${s.paywall?'（需订阅）':''}<span class="sep">｜</span><details class="details"><summary>详情</summary><div class="expanded"><p>${esc(s.summary)}</p></div></details></div></div></article>`}).join(''):`<p class="empty">没有找到相关资讯。 <button id="reset">查看全部</button></p>`;
 $('#more').hidden=limit>=list.length;$('#count').textContent=`${list.length} 条${query?' · 搜索结果':view==='今日'?' · 北京时间今日':''}`;
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.view){view=b.dataset.view;limit=30;render()}if(b.id==='reset'){view='全部';$('#search').value='';$('#region').value='';$('#source').value='';limit=30;render()}});
$('#region').onchange=$('#source').onchange=()=>{limit=30;render()};
$('#search').oninput=()=>{limit=30;render()};$('#more').onclick=()=>{limit+=30;render()};$('#about').onclick=()=>$('#dialog').showModal();$('#close').onclick=()=>$('#dialog').close();
document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'&&!$('#dialog').open){e.preventDefault();$('#search').focus()}});

function closeFilters(){for(const id of ['region','source']){$('#'+id+'Menu').hidden=true;$('#'+id+'Button').setAttribute('aria-expanded','false')}}
function openFilter(id){closeFilters();$('#'+id+'Menu').hidden=false;$('#'+id+'Button').setAttribute('aria-expanded','true')}
for(const id of ['region','source']){
 const trigger=$('#'+id+'Button'),menu=$('#'+id+'Menu');
 trigger.onclick=()=>{const wasOpen=!menu.hidden;closeFilters();if(!wasOpen)openFilter(id)};
 trigger.onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();openFilter(id);const choices=[...menu.querySelectorAll('[role="option"]')];(choices.find(o=>o.getAttribute('aria-selected')==='true')||choices[e.key==='ArrowUp'?choices.length-1:0])?.focus()}};
 menu.onclick=e=>{const option=e.target.closest('[data-filter]');if(!option)return;$('#'+id).value=option.dataset.value;closeFilters();limit=30;render();trigger.focus()};
 menu.onkeydown=e=>{const choices=[...menu.querySelectorAll('[role="option"]')],index=choices.indexOf(document.activeElement);let next=index;if(e.key==='ArrowDown')next=(index+1)%choices.length;else if(e.key==='ArrowUp')next=(index-1+choices.length)%choices.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=choices.length-1;else if(e.key==='Escape'){e.preventDefault();closeFilters();trigger.focus();return}else if(e.key==='Tab'){closeFilters();return}else return;e.preventDefault();choices[next]?.focus()};
}
document.addEventListener('click',e=>{if(!e.target.closest('.filter'))closeFilters()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFilters()});
document.addEventListener('focusin',e=>{if(!e.target.closest('.filter'))closeFilters()});

async function init(){try{const response=await fetch('news.json');if(!response.ok)throw Error();const data=await response.json();stories=data.stories.filter(s=>s.date>=data.from&&s.date<=data.to).sort(newestFirst);const names=[...new Set(stories.map(sourceName))].sort((a,b)=>a.localeCompare(b,'zh-CN'));$('#sourceMenu').innerHTML='<button type="button" role="option" data-filter="source" data-value="" aria-selected="true">全部来源</button>'+names.map(n=>`<button type="button" role="option" data-filter="source" data-value="${esc(n)}" aria-selected="false">${esc(n)}</button>`).join('');$('#updated').textContent='更新 '+data.updated;$('#aboutStatus').textContent='今日仅显示北京时间当天发布的资讯，按时间从新到旧排列；来源未提供时分的置于当天末尾。资料范围 '+data.from+' 至 '+data.to+'，日期按来源发布日期；X 帖按北京时间。';render()}catch{$('#news').innerHTML='<p class="empty">资讯载入失败，请刷新重试。</p>'}}init();
