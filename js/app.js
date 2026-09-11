/* Game logic. City data lives in js/data/route.js (global ROUTE). */
let currentId = ROUTE[0].id;
let currentView = 'city'; // city | map | passport | journal
let justArrivedId = null;
let ceremonyCityId = null;
let flightPair = null;
let clockTimer = null;
let exploreTimers = {};
let audioCtx = null;

/* ---------------- UNLOCK LOGIC ----------------
   Stop 0 is always unlocked. Every later stop unlocks only once the
   previous stop (a) has a built City Experience Map and (b) that map's
   core experiences are all marked complete. A stop can be "unlocked"
   before it has map content — that just means it's next in line to be
   built, and the app will offer a ready-made prompt for building it. */
function emptyProgress(){
  return { core:{}, optional:{}, tasks:{}, notes:{}, arrivedAt:{}, explored:{}, optionalAt:{} };
}
function normalizeProgress(data){
  const base = emptyProgress();
  if (!data || typeof data !== 'object') return base;
  return {
    ...base,
    ...data,
    core: data.core || {},
    optional: data.optional || {},
    tasks: data.tasks || {},
    notes: data.notes || {},
    arrivedAt: data.arrivedAt || {},
    explored: data.explored || {},
    optionalAt: data.optionalAt || {}
  };
}
function isCityComplete(city, prog){
  if (!city.map || !prog) return false;
  return city.map.core.every(exp => !!prog.core[exp.id]);
}
async function isUnlocked(index){
  if (index === 0) return true;
  const prev = ROUTE[index - 1];
  if (!prev.map) return false;
  const prevProg = await loadProgress(prev.id);
  return isCityComplete(prev, prevProg);
}
function buildCityPrompt(city){
  return `Build the City Experience Map for ${city.city}, ${city.country} — same format as the Kathmandu one: one-line city identity, one line on why it's next on the route (geography/flight logic), a top/iconic hotel pick with a one-line reason, 5 core experiences (each with name, category tag, 2-line description, and a 15-30 min virtual exploration idea), 6 optional side experiences (name + 1-line description), and a suggested next capital with routing reason.`;
}
let progressCache = {};

/* ---------------- HELPERS ---------------- */
function esc(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
function shortCity(city){
  return city.city.split(' (')[0];
}
function hotelShort(city){
  return city.map ? city.map.hotel.name.split(',')[0] : '';
}
function formatDate(iso){
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function formatLocalTime(tz){
  try{
    const d = new Date();
    const time = d.toLocaleTimeString('en-GB', { timeZone: tz, hour:'2-digit', minute:'2-digit' });
    const day = d.toLocaleDateString('en-GB', { timeZone: tz, weekday:'short', day:'numeric', month:'short' });
    return `${time} · ${day} local`;
  }catch(e){ return ''; }
}
function startClock(tz){
  clearInterval(clockTimer);
  const tick = () => {
    const el = document.getElementById('localTime');
    if (!el){ clearInterval(clockTimer); return; }
    el.textContent = formatLocalTime(tz);
  };
  tick();
  clockTimer = setInterval(tick, 1000);
}
function haversine(a, b){
  if (!a || !b || a.lat == null || b.lat == null) return 0;
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
function exploreLinks(exp, city){
  const q = encodeURIComponent(`${exp.name} ${city.city} ${city.country}`);
  const maps = encodeURIComponent(`${exp.name}, ${city.city}`);
  const links = [
    { id:'maps', label:'Maps', href:`https://www.google.com/maps/search/?api=1&query=${maps}` },
    { id:'wiki', label:'Wikipedia', href:`https://en.wikipedia.org/wiki/Special:Search?search=${q}` },
    { id:'watch', label:'Watch', href:`https://www.youtube.com/results?search_query=${q}` }
  ];
  if (/food|cuisine|market/i.test(`${exp.tag} ${exp.name}`)){
    links.push({ id:'recipe', label:'Recipe', href:`https://www.google.com/search?q=${encodeURIComponent(exp.name + ' recipe')}` });
  }
  return links;
}
function playTone(freq, dur, type, vol){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * 0.45), audioCtx.currentTime + dur);
    gain.gain.setValueAtTime(vol || 0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  }catch(e){ /* autoplay / unsupported */ }
}
function playStamp(){ playTone(90, 0.16, 'triangle', 0.14); }
function playCeremony(){
  playTone(220, 0.18, 'sine', 0.1);
  setTimeout(() => playTone(330, 0.22, 'sine', 0.09), 120);
}

/* ---------------- STORAGE HELPERS ---------------- */
async function storageGet(key){
  try{
    if (window.storage && typeof window.storage.get === 'function'){
      const res = await window.storage.get(key);
      if (res && res.value) return res.value;
    }
  }catch(e){ /* fall through */ }
  try{ return localStorage.getItem(key); }catch(e){ return null; }
}
async function storageSet(key, value){
  try{
    if (window.storage && typeof window.storage.set === 'function'){
      await window.storage.set(key, value);
    }
  }catch(e){ /* fall through */ }
  try{ localStorage.setItem(key, value); }catch(e){ console.error('Could not save progress', e); }
}
async function loadProgress(id){
  if (progressCache[id]) return progressCache[id];
  let data = emptyProgress();
  try{
    const raw = await storageGet('progress:' + id);
    if (raw) data = normalizeProgress(JSON.parse(raw));
  }catch(e){ /* no saved progress yet */ }
  progressCache[id] = data;
  return data;
}
async function saveProgress(id){
  await storageSet('progress:' + id, JSON.stringify(progressCache[id]));
}

/* ---------------- JOURNEY STATS ---------------- */
async function journeyStats(){
  let cities = 0, arrivals = 0, journal = 0, km = 0;
  let lastComplete = null;
  for (const city of ROUTE){
    const prog = await loadProgress(city.id);
    if (city.map){
      const done = city.map.core.filter(exp => prog.core[exp.id]).length;
      arrivals += done;
      journal += city.map.core.filter(exp => prog.notes[exp.id] || prog.tasks[exp.id]).length;
      if (isCityComplete(city, prog)){
        cities += 1;
        if (lastComplete) km += haversine(lastComplete, city);
        lastComplete = city;
      }
    }
  }
  return { cities, arrivals, journal, km: Math.round(km) };
}

/* ---------------- RENDER: NAV + SIDEBAR ---------------- */
function renderNav(){
  const nav = document.getElementById('viewNav');
  const views = [
    ['city', 'Route'],
    ['map', 'Map'],
    ['passport', 'Passport'],
    ['journal', 'Journal']
  ];
  nav.innerHTML = views.map(([id, label]) =>
    `<button type="button" data-view="${id}" class="${currentView===id?'active':''}">${label}</button>`
  ).join('');
  nav.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      renderAll();
    });
  });
}

async function renderSidebar(){
  const list = document.getElementById('routeList');
  list.innerHTML = '';
  const stats = await journeyStats();
  const statsEl = document.getElementById('journeyStats');
  statsEl.textContent = `${stats.cities} ${stats.cities===1?'city':'cities'} · ${stats.arrivals} arrivals · ${stats.km.toLocaleString()} km`;

  for (let i = 0; i < ROUTE.length; i++){
    const c = ROUTE[i];
    const unlocked = await isUnlocked(i);
    const div = document.createElement('div');
    div.className = 'route-item' + (c.id === currentId && currentView === 'city' ? ' active' : '') + (!unlocked ? ' locked' : '');

    let statusIcon = '';
    if (!unlocked){
      statusIcon = '🔒';
    } else if (c.map){
      const prog = await loadProgress(c.id);
      const total = c.map.core.length;
      const done = Object.values(prog.core).filter(Boolean).length;
      statusIcon = done === total ? '<span class="status-check">✓</span>' : `${done}/${total}`;
    } else {
      statusIcon = '📝';
    }

    div.innerHTML = `
      <div class="route-num">${String(i+1).padStart(2,'0')}</div>
      <div class="route-info">
        <div class="route-city">${c.flag} ${esc(shortCity(c))}</div>
        <div class="route-country">${esc(c.country)}</div>
      </div>
      <div class="route-status">${statusIcon}</div>
    `;
    if (unlocked){
      div.addEventListener('click', () => {
        currentId = c.id;
        currentView = 'city';
        renderAll();
      });
    }
    list.appendChild(div);
  }
}

/* ---------------- RENDER: MAIN ---------------- */
async function renderMain(){
  const panel = document.getElementById('mainPanel');
  panel.classList.toggle('wide', currentView === 'map');
  const el = document.getElementById('mainContent');

  if (currentView === 'map'){ await renderMap(el); return; }
  if (currentView === 'passport'){ await renderPassport(el); return; }
  if (currentView === 'journal'){ await renderJournal(el); return; }
  await renderCity(el);
}

async function renderCity(el){
  const cityIndex = ROUTE.findIndex(c => c.id === currentId);
  const city = ROUTE[cityIndex];
  const unlocked = await isUnlocked(cityIndex);

  if (!unlocked){
    const prev = ROUTE[cityIndex - 1];
    el.innerHTML = `
      <div class="locked-state">
        <h2>🔒 Locked</h2>
        <p>${esc(shortCity(prev))} isn't complete yet. Finish all of its core experiences to unlock ${esc(shortCity(city))}.</p>
      </div>`;
    return;
  }

  if (!city.map){
    el.innerHTML = `
      <div class="locked-state" style="max-width:600px;">
        <h2>${city.flag} ${esc(city.city)} is unlocked</h2>
        <p>Its City Experience Map hasn't been built yet. Paste this prompt to Claude to build it in the same format as the others — then drop the returned data into the ROUTE array in this file.</p>
        <div class="task-input-row" style="margin-top:18px; flex-direction:column; align-items:stretch;">
          <textarea id="promptBox" readonly style="font-family:var(--mono); font-size:12.5px; padding:12px; border:1px solid var(--line); border-radius:4px; min-height:110px; background:#fff; color:var(--ink);">${esc(buildCityPrompt(city))}</textarea>
          <button id="copyPromptBtn" style="margin-top:10px; align-self:flex-start;">Copy prompt</button>
        </div>
      </div>`;
    const btn = document.getElementById('copyPromptBtn');
    btn.addEventListener('click', () => {
      const box = document.getElementById('promptBox');
      box.select();
      navigator.clipboard?.writeText(box.value).then(() => {
        btn.textContent = 'Copied';
        setTimeout(() => btn.textContent = 'Copy prompt', 1500);
      }).catch(() => {});
    });
    return;
  }

  const prog = await loadProgress(city.id);
  if (!prog.checkedInAt){
    prog.checkedInAt = new Date().toISOString();
    await saveProgress(city.id);
  }

  const m = city.map;
  const totalDone = m.core.filter(exp => prog.core[exp.id]).length;
  const pct = Math.round((totalDone / m.core.length) * 100);
  const complete = totalDone === m.core.length;
  const nextCity = ROUTE[cityIndex + 1];
  const nextOpen = nextCity && complete;
  const nextExp = m.core.find(exp => !prog.core[exp.id]);
  const hotelState = complete
    ? `Checked out ${formatDate(prog.completedAt) || 'today'}`
    : `In residence · checked in ${formatDate(prog.checkedInAt)}`;

  el.innerHTML = `
    <div class="city-page" style="--city-accent:${city.accent || 'var(--stamp-red)'}">
      <div class="city-hero">
        <p class="city-flag-line">${city.flag} ${esc(city.country)} — Stop ${cityIndex+1} of ${ROUTE.length}</p>
        <div class="city-title-row">
          <h2>${esc(city.city)}</h2>
          <div class="local-time" id="localTime">${esc(formatLocalTime(city.tz))}</div>
        </div>
        <p class="city-identity">${esc(m.identity)}</p>
      </div>

      ${nextExp ? `
        <div class="boarding-today">
          <div>
            <div class="k">Today's boarding pass</div>
            <div class="n">${esc(nextExp.name)}</div>
          </div>
          <button type="button" id="jumpToday">Open stop</button>
        </div>` : ''}

      <div class="hotel-card">
        <div class="icon">🏨</div>
        <div>
          <h4>${esc(m.hotel.name)}</h4>
          <p>${esc(m.hotel.note)}</p>
          <div class="hotel-meta">${esc(hotelState)}</div>
        </div>
      </div>

      <div class="progress-row">
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="progress-label">${totalDone} / ${m.core.length} core experiences</div>
      </div>

      <p class="section-label">Core Experiences</p>
      <div id="coreList"></div>

      <p class="section-label" style="margin-top:32px;">Optional Side Experiences</p>
      <div id="optionalList"></div>

      <div id="completeBanner"></div>
    </div>
  `;
  startClock(city.tz);

  if (nextExp){
    document.getElementById('jumpToday').addEventListener('click', () => {
      document.getElementById('exp-' + nextExp.id)?.scrollIntoView({ behavior:'smooth', block:'center' });
    });
  }

  const coreList = document.getElementById('coreList');
  m.core.forEach(exp => {
    const isDone = !!prog.core[exp.id];
    const savedTask = prog.tasks[exp.id] || '';
    const savedNote = prog.notes[exp.id] || '';
    const links = exploreLinks(exp, city);
    const used = prog.explored[exp.id] || {};
    const pop = justArrivedId === exp.id ? ' stamp-pop' : '';
    const div = document.createElement('div');
    div.className = 'experience' + (isDone ? ' done' : '');
    div.id = 'exp-' + exp.id;
    div.innerHTML = `
      <div class="experience-head">
        <div class="checkbox${pop}">${isDone ? '✓' : ''}</div>
        <div class="experience-body">
          <div class="experience-title-row">
            <div class="experience-title">${esc(exp.name)}</div>
            <div class="experience-tag">${esc(exp.tag)}</div>
          </div>
          <p class="experience-desc">${esc(exp.desc)}</p>
          <p class="experience-task"><strong>15–30 min exploration:</strong> ${esc(exp.explore)}</p>
          <div class="explore-row">
            ${links.map(link => `<a class="explore-link${used[link.id]?' used':''}" data-link="${link.id}" href="${link.href}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join('')}
          </div>
          ${!isDone ? `
            <div class="timer-row">
              <button type="button" data-timer="${exp.id}">${exploreTimers[exp.id] ? 'Stop timer' : 'Start 15 min'}</button>
              <span class="timer-display" id="timer-${exp.id}"></span>
            </div>
            <div class="arrive-fields">
              <input type="text" placeholder="What real task gets you here?" value="${esc(savedTask)}" data-exp="${exp.id}">
              <input type="text" placeholder="Optional: what did this place feel like?" value="${esc(savedNote)}" data-note="${exp.id}">
              <div class="arrive-actions">
                <button type="button" data-arrive="${exp.id}">Arrive</button>
              </div>
            </div>` : `
            <p class="experience-task">Reached via: “${esc(savedTask || 'task not recorded')}”</p>
            ${savedNote ? `<p class="journal-line">“${esc(savedNote)}”</p>` : ''}
            <div class="arrived-date">${esc(formatDate(prog.arrivedAt[exp.id]) || 'Arrived')}</div>
          `}
        </div>
      </div>
    `;
    coreList.appendChild(div);

    div.querySelectorAll('.explore-link').forEach(a => {
      a.addEventListener('click', async () => {
        prog.explored[exp.id] = prog.explored[exp.id] || {};
        prog.explored[exp.id][a.dataset.link] = true;
        a.classList.add('used');
        await saveProgress(city.id);
      });
    });

    if (!isDone){
      const timerBtn = div.querySelector('[data-timer]');
      timerBtn.addEventListener('click', () => startExploreTimer(exp.id, timerBtn));
      div.querySelector('[data-arrive]').addEventListener('click', async () => {
        const input = div.querySelector(`input[data-exp="${exp.id}"]`);
        const note = div.querySelector(`input[data-note="${exp.id}"]`);
        const wasComplete = isCityComplete(city, prog);
        prog.tasks[exp.id] = input.value.trim();
        prog.notes[exp.id] = note.value.trim();
        prog.core[exp.id] = true;
        prog.arrivedAt[exp.id] = new Date().toISOString();
        justArrivedId = exp.id;
        const nowComplete = isCityComplete(city, prog);
        if (nowComplete && !wasComplete){
          prog.completedAt = new Date().toISOString();
          ceremonyCityId = city.id;
        }
        await saveProgress(city.id);
        playStamp();
        if (nowComplete && !wasComplete) playCeremony();
        renderAll();
      });
    } else {
      div.querySelector('.checkbox').addEventListener('click', async () => {
        prog.core[exp.id] = false;
        if (prog.completedAt) delete prog.completedAt;
        await saveProgress(city.id);
        renderAll();
      });
    }
  });
  if (justArrivedId) justArrivedId = null;

  const optList = document.getElementById('optionalList');
  m.optional.forEach(opt => {
    const isDone = !!prog.optional[opt.name];
    const q = encodeURIComponent(`${opt.name} ${city.city}`);
    const div = document.createElement('div');
    div.className = 'optional' + (isDone ? ' done' : '');
    div.innerHTML = `
      <div class="opt-check">${isDone ? '✓' : ''}</div>
      <div>
        <div class="optional-name">${esc(opt.name)}</div>
        <div class="optional-desc">${esc(opt.desc)}</div>
        <div class="explore-row">
          <a class="explore-link" href="https://www.google.com/search?q=${q}" target="_blank" rel="noopener noreferrer">Look up</a>
        </div>
      </div>
    `;
    div.querySelector('.opt-check').addEventListener('click', async () => {
      prog.optional[opt.name] = !isDone;
      if (!isDone) prog.optionalAt[opt.name] = new Date().toISOString();
      else delete prog.optionalAt[opt.name];
      await saveProgress(city.id);
      renderAll();
    });
    optList.appendChild(div);
  });

  const banner = document.getElementById('completeBanner');
  if (complete){
    banner.innerHTML = `
      <div class="complete-banner">
        <h3>${esc(shortCity(city))} is complete</h3>
        <p>Checked out of ${esc(hotelShort(city))}. Passport stamped ${esc(formatDate(prog.completedAt) || 'today')}.</p>
        <p>Suggested next stop: ${esc(m.next)}</p>
        <div class="banner-actions">
          ${nextOpen ? `<button type="button" class="btn-primary" id="flyNext">Board the next flight</button>` : ''}
          <button type="button" class="btn-ghost" id="seePassport">View passport</button>
        </div>
      </div>`;
    document.getElementById('seePassport')?.addEventListener('click', () => {
      currentView = 'passport';
      renderAll();
    });
    document.getElementById('flyNext')?.addEventListener('click', () => startFlight(city, nextCity));
  }
}

function startExploreTimer(expId, btn){
  if (exploreTimers[expId]){
    clearInterval(exploreTimers[expId].id);
    delete exploreTimers[expId];
    btn.textContent = 'Start 15 min';
    const display = document.getElementById('timer-' + expId);
    if (display) display.textContent = '';
    return;
  }
  let left = 15 * 60;
  const display = document.getElementById('timer-' + expId);
  const tick = () => {
    const el = document.getElementById('timer-' + expId);
    if (!el){ clearInterval(exploreTimers[expId]?.id); delete exploreTimers[expId]; return; }
    const m = Math.floor(left / 60);
    const s = String(left % 60).padStart(2, '0');
    el.textContent = left <= 0 ? 'Time’s up — arrive when ready' : `${m}:${s}`;
    if (left <= 0){
      clearInterval(exploreTimers[expId].id);
      delete exploreTimers[expId];
      btn.textContent = 'Start 15 min';
      return;
    }
    left -= 1;
  };
  btn.textContent = 'Stop timer';
  tick();
  exploreTimers[expId] = { id: setInterval(tick, 1000) };
}

async function renderMap(el){
  const W = 860, H = 520, pad = 56;
  const lats = ROUTE.map(c => c.lat);
  const lngs = ROUTE.map(c => c.lng);
  const minLat = Math.min(...lats) - 3, maxLat = Math.max(...lats) + 3;
  const minLng = Math.min(...lngs) - 4, maxLng = Math.max(...lngs) + 4;
  const project = (city) => ({
    x: pad + ((city.lng - minLng) / (maxLng - minLng)) * (W - pad * 2),
    y: pad + ((maxLat - city.lat) / (maxLat - minLat)) * (H - pad * 2)
  });

  const pts = [];
  for (let i = 0; i < ROUTE.length; i++){
    const city = ROUTE[i];
    const unlocked = await isUnlocked(i);
    const prog = await loadProgress(city.id);
    const complete = isCityComplete(city, prog);
    pts.push({ city, unlocked, complete, p: project(city) });
  }

  let path = '';
  let flown = '';
  pts.forEach((pt, i) => {
    const cmd = `${i===0?'M':'L'}${pt.p.x.toFixed(1)},${pt.p.y.toFixed(1)} `;
    path += cmd;
    if (i === 0 || pts[i-1].complete) flown += cmd;
  });

  const grid = [];
  for (let lat = Math.ceil(minLat/5)*5; lat <= maxLat; lat += 5){
    const y = pad + ((maxLat - lat) / (maxLat - minLat)) * (H - pad * 2);
    grid.push(`<line x1="${pad}" y1="${y.toFixed(1)}" x2="${W-pad}" y2="${y.toFixed(1)}" stroke="rgba(233,225,205,0.08)"/>`);
    grid.push(`<text x="10" y="${(y+4).toFixed(1)}" fill="rgba(233,225,205,0.28)" font-size="10" font-family="IBM Plex Mono, monospace">${lat}°</text>`);
  }
  for (let lng = Math.ceil(minLng/5)*5; lng <= maxLng; lng += 5){
    const x = pad + ((lng - minLng) / (maxLng - minLng)) * (W - pad * 2);
    grid.push(`<line x1="${x.toFixed(1)}" y1="${pad}" x2="${x.toFixed(1)}" y2="${H-pad}" stroke="rgba(233,225,205,0.08)"/>`);
    grid.push(`<text x="${(x-8).toFixed(1)}" y="${H-18}" fill="rgba(233,225,205,0.28)" font-size="10" font-family="IBM Plex Mono, monospace">${lng}°</text>`);
  }

  const markers = pts.map(pt => {
    const fill = pt.complete ? '#8a3b2e' : pt.unlocked ? '#b6862c' : 'rgba(233,225,205,0.25)';
    const r = pt.city.id === currentId ? 8 : 5.5;
    const labelY = pt.p.y < 80 ? pt.p.y + 18 : pt.p.y - 12;
    return `
      <g class="map-node" data-id="${pt.city.id}" data-open="${pt.unlocked?1:0}" style="cursor:${pt.unlocked?'pointer':'default'}">
        <circle cx="${pt.p.x.toFixed(1)}" cy="${pt.p.y.toFixed(1)}" r="${r}" fill="${fill}" stroke="${pt.city.id===currentId?'#f3eee0':'rgba(14,33,48,0.4)'}" stroke-width="2"/>
        <text x="${pt.p.x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" fill="#f3eee0" font-size="11" font-family="Fraunces, serif">${esc(shortCity(pt.city))}</text>
      </g>`;
  }).join('');

  el.innerHTML = `
    <p class="page-kicker">Flight chart</p>
    <h2 class="page-title">The route so far</h2>
    <p class="page-lead">A working chart of the capitals already on the board. Completed legs are inked; the rest of the path is still a planned heading.</p>
    <div class="chart-wrap">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Route map of capitals">
        <rect width="${W}" height="${H}" fill="#0e2130"/>
        ${grid.join('')}
        <path d="${path.trim()}" fill="none" stroke="rgba(182,134,44,0.28)" stroke-width="1.5" stroke-dasharray="5 6"/>
        <path d="${flown.trim()}" fill="none" stroke="#b6862c" stroke-width="2.2"/>
        ${markers}
      </svg>
      <p class="chart-caption">South &amp; Central Asia · geographic / flight-cluster routing from Delhi outward</p>
    </div>
    <div class="chart-legend">
      <span><i style="background:#8a3b2e"></i>Completed</span>
      <span><i style="background:#b6862c"></i>Unlocked</span>
      <span><i style="background:rgba(22,35,43,0.35)"></i>Locked</span>
    </div>
  `;
  el.querySelectorAll('.map-node').forEach(g => {
    g.addEventListener('click', () => {
      if (g.dataset.open !== '1') return;
      currentId = g.dataset.id;
      currentView = 'city';
      renderAll();
    });
  });
}

async function renderPassport(el){
  const stats = await journeyStats();
  const cards = [];
  for (let i = 0; i < ROUTE.length; i++){
    const city = ROUTE[i];
    const unlocked = await isUnlocked(i);
    const prog = await loadProgress(city.id);
    const complete = isCityComplete(city, prog);
    const here = city.id === currentId && unlocked && !complete;
    let cls = 'stamp-card';
    let label = 'Locked';
    if (complete){ cls += ' inked'; label = formatDate(prog.completedAt) || 'Stamped'; }
    else if (here){ cls += ' here'; label = 'In residence'; }
    else if (unlocked){ cls += ' here'; label = city.map ? 'Open' : 'Awaiting map'; }
    else cls += ' locked';
    cards.push(`
      <div class="${cls}" data-id="${city.id}" data-open="${unlocked?1:0}">
        <div class="stamp-badge">${complete || here || unlocked ? city.flag : '—'}</div>
        <div class="stamp-city">${esc(shortCity(city))}</div>
        <div class="stamp-date">${esc(label)}</div>
      </div>`);
  }
  el.innerHTML = `
    <p class="page-kicker">Travel document</p>
    <h2 class="page-title">Passport</h2>
    <p class="page-lead">One inked stamp per finished capital. The current city stays open until you check out.</p>
    <div class="stat-row">
      <div class="stat"><b>${stats.cities}</b><span>Cities stamped</span></div>
      <div class="stat"><b>${stats.arrivals}</b><span>Arrivals</span></div>
      <div class="stat"><b>${stats.km.toLocaleString()}</b><span>Km flown</span></div>
    </div>
    <div class="stamp-grid">${cards.join('')}</div>
  `;
  el.querySelectorAll('.stamp-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.open !== '1') return;
      currentId = card.dataset.id;
      currentView = 'city';
      renderAll();
    });
  });
}

async function renderJournal(el){
  const entries = [];
  for (const city of ROUTE){
    if (!city.map) continue;
    const prog = await loadProgress(city.id);
    city.map.core.forEach(exp => {
      if (!prog.core[exp.id] && !prog.notes[exp.id] && !prog.tasks[exp.id]) return;
      if (!prog.core[exp.id]) return;
      entries.push({
        city,
        exp,
        task: prog.tasks[exp.id] || '',
        note: prog.notes[exp.id] || '',
        when: prog.arrivedAt[exp.id] || ''
      });
    });
    city.map.optional.forEach(opt => {
      if (!prog.optional[opt.name]) return;
      entries.push({
        city,
        exp: { name: opt.name, tag: 'Postcard' },
        task: 'Optional side experience',
        note: opt.desc,
        when: prog.optionalAt[opt.name] || ''
      });
    });
  }
  entries.sort((a, b) => String(b.when).localeCompare(String(a.when)));

  el.innerHTML = `
    <p class="page-kicker">Field notes</p>
    <h2 class="page-title">Journal</h2>
    <p class="page-lead">Every arrival is a line in the same story: the real task that got you there, and whatever the place left behind.</p>
    ${entries.length === 0 ? `
      <div class="empty-state">
        <p>No entries yet. Arrive at a core experience and optionally write how it felt — it will land here.</p>
      </div>` : entries.map(e => `
      <article class="journal-entry">
        <div class="when">${esc(e.city.flag)} ${esc(shortCity(e.city))} · ${esc(formatDate(e.when) || 'Undated')}</div>
        <h4>${esc(e.exp.name)}</h4>
        <p class="via">${e.task ? `Reached via: ${esc(e.task)}` : ''}</p>
        ${e.note ? `<p class="note">“${esc(e.note)}”</p>` : ''}
      </article>`).join('')}
  `;
}

function startFlight(from, to){
  if (!to) return;
  flightPair = { from, to };
  renderOverlays();
  setTimeout(() => {
    currentId = to.id;
    currentView = 'city';
    flightPair = null;
    renderAll();
  }, 2200);
}

function renderOverlays(){
  const root = document.getElementById('overlays');
  if (ceremonyCityId){
    const city = ROUTE.find(c => c.id === ceremonyCityId);
    const idx = ROUTE.findIndex(c => c.id === ceremonyCityId);
    const next = ROUTE[idx + 1];
    root.innerHTML = `
      <div class="overlay" id="ceremonyOverlay">
        <div class="ceremony-card">
          <div class="ceremony-stamp">${city.flag}</div>
          <h2>${esc(shortCity(city))} stamped</h2>
          <p>Checked out of ${esc(hotelShort(city))}. All five core experiences are done. The next capital is waiting on the route.</p>
          <div class="btn-row">
            ${next ? `<button type="button" class="btn-primary" id="ceremonyFly">Board the next flight</button>` : ''}
            <button type="button" class="btn-ghost" id="ceremonyPass">View passport</button>
            <button type="button" class="btn-ghost" id="ceremonyClose">Stay a little longer</button>
          </div>
        </div>
      </div>`;
    document.getElementById('ceremonyClose').addEventListener('click', () => {
      ceremonyCityId = null;
      renderOverlays();
    });
    document.getElementById('ceremonyPass').addEventListener('click', () => {
      ceremonyCityId = null;
      currentView = 'passport';
      renderAll();
    });
    document.getElementById('ceremonyFly')?.addEventListener('click', () => {
      ceremonyCityId = null;
      startFlight(city, next);
    });
    return;
  }
  if (flightPair){
    root.innerHTML = `
      <div class="overlay">
        <div class="flight-card">
          <p class="page-kicker" style="margin-bottom:8px">Now boarding</p>
          <div class="flight-route">
            <div class="end">${flightPair.from.flag} ${esc(shortCity(flightPair.from))}</div>
            <div class="flight-plane">✈</div>
            <div class="end">${flightPair.to.flag} ${esc(shortCity(flightPair.to))}</div>
          </div>
          <p>${esc(flightPair.from.map?.next || `Continuing on to ${shortCity(flightPair.to)}.`)}</p>
        </div>
      </div>`;
    return;
  }
  root.innerHTML = '';
}

async function renderAll(){
  renderNav();
  await renderSidebar();
  await renderMain();
  await renderSidebar();
  renderOverlays();
}

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea')) return;
  const idx = ROUTE.findIndex(c => c.id === currentId);
  if (e.key === 'j' || e.key === 'ArrowDown'){
    const next = ROUTE[idx + 1];
    if (!next) return;
    isUnlocked(idx + 1).then(ok => {
      if (!ok) return;
      currentId = next.id;
      currentView = 'city';
      renderAll();
    });
  }
  if (e.key === 'k' || e.key === 'ArrowUp'){
    const prev = ROUTE[idx - 1];
    if (!prev) return;
    currentId = prev.id;
    currentView = 'city';
    renderAll();
  }
});

renderAll();
