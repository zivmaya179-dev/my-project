// ===================================================================
// Band III description-to-word quiz
// ===================================================================
const STORAGE_KEY = 'leni-band3-quiz-v1';
const DB_NAME = 'leni-band3-quiz-db';
const DB_VERSION = 1;
const STORE = 'state';
const LIST_ORDER = ['Band III - A', 'Band III - B', 'Band III - C', 'Band III - D'];

const state = {
  progress: {},
  lists: LIST_ORDER.slice(),
  filter: 'all',
  deck: [],
  index: 0,
  right: 0,
  wrong: 0,
  answered: false
};

// ----- Storage -----
function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('No IndexedDB'));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbGet(k) {
  try {
    const db = await openDB();
    return await new Promise(r => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(k);
      req.onsuccess = () => r(req.result || null);
      req.onerror = () => r(null);
    });
  } catch { return null; }
}
async function dbSet(k, v) {
  try {
    const db = await openDB();
    return await new Promise(r => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(v, k);
      tx.oncomplete = () => r();
      tx.onerror = () => r();
    });
  } catch {}
}
function lsGet() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } }
function lsSet(v) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {} }

function snapshot() {
  return {
    progress: state.progress,
    lists: state.lists,
    filter: state.filter,
    right: state.right,
    wrong: state.wrong,
    savedAt: Date.now()
  };
}
function applySnapshot(s) {
  if (!s) return;
  if (s.progress && typeof s.progress === 'object') state.progress = s.progress;
  if (Array.isArray(s.lists) && s.lists.length) state.lists = s.lists.filter(b => LIST_ORDER.includes(b));
  if (!state.lists.length) state.lists = LIST_ORDER.slice();
  if (typeof s.filter === 'string') state.filter = s.filter;
  if (typeof s.right === 'number') state.right = s.right;
  if (typeof s.wrong === 'number') state.wrong = s.wrong;
}
let saveTimer = null;
function save() {
  const data = snapshot();
  lsSet(data);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => dbSet('state', data), 200);
  flashSaved();
}
async function loadInitial() {
  const ls = lsGet();
  const idb = await dbGet('state');
  let best = (ls && idb) ? ((idb.savedAt || 0) > (ls.savedAt || 0) ? idb : ls) : (idb || ls);
  applySnapshot(best);
}
let saveDotTimer = null;
function flashSaved() {
  const el = document.getElementById('saveDot');
  el.classList.add('show');
  clearTimeout(saveDotTimer);
  saveDotTimer = setTimeout(() => el.classList.remove('show'), 700);
}

// ----- Word logic -----
function wordKey(w) { return w.en.toLowerCase() + '|' + (w.band || ''); }

function getStatus(w) {
  const p = state.progress[wordKey(w)];
  if (!p) return 'new';
  if (p.score >= 2) return 'learned';
  if (p.last === 'no') return 'wrong';
  return 'learning';
}

function getScopeWords() {
  const set = new Set(state.lists);
  return WORDS.filter(w => set.has(w.band));
}

function buildDeck() {
  let words = getScopeWords();
  if (state.filter === 'wrong') {
    words = words.filter(w => getStatus(w) === 'wrong');
  } else if (state.filter === 'new') {
    words = words.filter(w => getStatus(w) === 'new');
  } else if (state.filter === 'learned') {
    words = words.filter(w => getStatus(w) === 'learned');
  }
  // shuffle
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  state.deck = words;
  state.index = 0;
  state.answered = false;
}

function listsLabel() {
  if (state.lists.length === LIST_ORDER.length) return 'A·B·C·D';
  return state.lists.map(b => b.slice(-1)).sort().join('·');
}

function updateStats() {
  document.getElementById('statTotal').textContent = state.deck.length;
  document.getElementById('statRight').textContent = state.right;
  document.getElementById('statWrong').textContent = state.wrong;
  const total = state.right + state.wrong;
  const pct = total ? Math.round((state.right / total) * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('listsLabel').textContent = listsLabel();
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ----- Distractor selection -----
function pickDistractors(correct, count) {
  // Prefer same list, then same pos, then same band
  const sameList = WORDS.filter(w => w.band === correct.band && w.en !== correct.en);
  const samePos = correct.pos
    ? WORDS.filter(w => w.pos === correct.pos && w.en !== correct.en)
    : [];
  const all = WORDS.filter(w => w.en !== correct.en);
  const pools = [sameList, samePos, all];
  const picked = [];
  const used = new Set([correct.en]);
  for (const pool of pools) {
    if (picked.length >= count) break;
    // shuffle pool indices
    const idxs = Array.from(pool.keys());
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    for (const i of idxs) {
      if (picked.length >= count) break;
      const w = pool[i];
      if (!used.has(w.en)) {
        used.add(w.en);
        picked.push(w);
      }
    }
  }
  return picked;
}

// ----- Render -----
function render() {
  const stage = document.getElementById('stage');
  const counter = document.getElementById('counter');

  if (!state.deck.length) {
    counter.textContent = '0 / 0';
    stage.innerHTML = `
      <div class="empty">
        <div class="emoji">📋</div>
        <h2>אין שאלות במצב הזה</h2>
        <p>נסי לבחור סינון אחר או רשימות אחרות.</p>
        <button onclick="resetFilter()">הצג הכל</button>
      </div>
    `;
    return;
  }

  if (state.index >= state.deck.length) {
    counter.textContent = `${state.deck.length} / ${state.deck.length}`;
    celebrate();
    const total = state.right + state.wrong;
    const pct = total ? Math.round((state.right / total) * 100) : 0;
    stage.innerHTML = `
      <div class="empty">
        <div class="emoji">🏆</div>
        <h2>סיימת!</h2>
        <p>${state.right} נכון מתוך ${state.right + state.wrong} (${pct}%)</p>
        <button onclick="restart()">סבב חדש 🔄</button>
      </div>
    `;
    return;
  }

  const word = state.deck[state.index];
  counter.textContent = `${state.index + 1} / ${state.deck.length}`;

  const distractors = pickDistractors(word, 3);
  const options = [word, ...distractors];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const optsHtml = options.map((o, idx) => `
    <button class="opt" data-correct="${o.en === word.en ? '1' : '0'}" data-en="${escapeHtml(o.en)}">
      <span class="opt-letter">${['A','B','C','D'][idx]}</span>
      <span class="opt-text">${escapeHtml(o.en)}</span>
      <button class="opt-speaker" onclick="event.stopPropagation(); speak('${escapeHtml(o.en).replace(/'/g, "\\'")}');">🔊</button>
    </button>
  `).join('');

  const posTag = word.pos ? `<span class="pos-tag">${escapeHtml(word.pos)}</span>` : '';

  stage.innerHTML = `
    <div class="quiz-card">
      <div class="badge">${escapeHtml(word.band)}</div>
      <div class="desc-label">Definition${posTag}:</div>
      <div class="desc-text">${escapeHtml(word.desc)}</div>
      <div class="desc-label" style="margin-top:6px;">Which word matches?</div>
      <div class="options">${optsHtml}</div>
      <div class="reveal" id="reveal"></div>
    </div>
  `;

  state.answered = false;
  document.querySelectorAll('.opt').forEach(btn => {
    btn.addEventListener('click', e => {
      // ignore clicks on the speaker
      if (e.target.closest('.opt-speaker')) return;
      handleAnswer(btn, word);
    });
  });
}

function handleAnswer(btn, word) {
  if (state.answered) return;
  state.answered = true;

  const isCorrect = btn.dataset.correct === '1';
  const key = wordKey(word);
  if (!state.progress[key]) state.progress[key] = { score: 0, seen: 0 };
  state.progress[key].seen++;
  state.progress[key].last = isCorrect ? 'yes' : 'no';
  state.progress[key].at = Date.now();

  if (isCorrect) {
    btn.classList.add('correct');
    state.progress[key].score = Math.min(5, state.progress[key].score + 1);
    state.right++;
    toast('כל הכבוד! ✓');
  } else {
    btn.classList.add('wrong');
    state.progress[key].score = Math.max(0, state.progress[key].score - 1);
    state.wrong++;
    document.querySelectorAll('.opt').forEach(b => {
      if (b.dataset.correct === '1') b.classList.add('correct');
    });
    toast('כמעט - נחזור על זה 💪');
  }

  // Show Hebrew reveal
  const reveal = document.getElementById('reveal');
  if (reveal) {
    reveal.innerHTML = `<strong>${escapeHtml(word.en)}</strong><span class="he">= ${escapeHtml(word.he || '')}</span>`;
    reveal.classList.add('show');
  }

  save();
  updateStats();
  setTimeout(() => speak(word.en), 150);

  setTimeout(() => {
    state.index++;
    updateStats();
    render();
  }, isCorrect ? 1100 : 1900);
}

function skip() {
  if (state.index >= state.deck.length) return;
  state.index++;
  render();
  updateStats();
}

function restart() {
  state.right = 0;
  state.wrong = 0;
  buildDeck();
  updateStats();
  render();
  save();
}

function resetFilter() {
  state.filter = 'all';
  buildDeck();
  updateStats();
  render();
  save();
  renderFilterPicker();
}

// ----- Lists multi-select -----
function toggleList(b) {
  const i = state.lists.indexOf(b);
  if (i >= 0) {
    if (state.lists.length === 1) return;
    state.lists.splice(i, 1);
  } else {
    state.lists.push(b);
  }
  buildDeck();
  updateStats();
  render();
  save();
  renderListsPicker();
}

function setAllLists(all) {
  state.lists = all ? LIST_ORDER.slice() : ['Band III - A'];
  buildDeck();
  updateStats();
  render();
  save();
  renderListsPicker();
}

function renderListsPicker() {
  const selected = new Set(state.lists);
  document.getElementById('listsPicker').innerHTML = LIST_ORDER.map(b => {
    const count = WORDS.filter(w => w.band === b).length;
    const checked = selected.has(b);
    return `
      <button class="pick ${checked ? 'on' : ''}" onclick="toggleList('${b}')">
        <span class="pick-check">${checked ? '✓' : ''}</span>
        <span class="pick-info">${b}</span>
        <span class="pick-num">${count}</span>
      </button>
    `;
  }).join('');
}

function setFilter(f) {
  state.filter = f;
  buildDeck();
  updateStats();
  render();
  save();
  renderFilterPicker();
}

function countByFilter(f) {
  const scope = getScopeWords();
  if (f === 'all') return scope.length;
  return scope.filter(w => getStatus(w) === f).length;
}

function renderFilterPicker() {
  const filters = [
    { id: 'all', label: 'כל המילים', sub: 'תרגלי הכל' },
    { id: 'wrong', label: '⚠️ טעיתי בהן', sub: 'לחזור עליהן' },
    { id: 'new', label: 'חדשות', sub: 'עוד לא נראו' },
    { id: 'learned', label: 'ידועות', sub: 'ענית נכון 2+ פעמים' }
  ];
  document.getElementById('filterPicker').innerHTML = filters.map(f => `
    <button class="pick ${state.filter === f.id ? 'on' : ''}" onclick="setFilter('${f.id}')">
      <span class="pick-check">${state.filter === f.id ? '✓' : ''}</span>
      <span class="pick-info">${f.label}<br><small style="color:var(--muted);font-weight:500;font-size:11px;">${f.sub}</small></span>
      <span class="pick-num">${countByFilter(f.id)}</span>
    </button>
  `).join('');
}

// ----- Misc -----
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch {}
}

let toastTimer = null;
function toast(m) {
  const el = document.getElementById('toast');
  el.textContent = m;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1400);
}

function celebrate() {
  const colors = ['#0ea5e9', '#6366f1', '#ec4899', '#10b981', '#f59e0b'];
  const box = document.getElementById('celebrate');
  box.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = '-20px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    box.appendChild(piece);
  }
  setTimeout(() => { box.innerHTML = ''; }, 3000);
}

function resetProgress() {
  if (!confirm('לאפס את כל התוצאות? אי אפשר לבטל.')) return;
  state.progress = {};
  state.right = 0;
  state.wrong = 0;
  buildDeck();
  updateStats();
  render();
  save();
  closeModal();
  toast('אופס ✨');
}

function openModal() {
  renderListsPicker();
  renderFilterPicker();
  document.getElementById('modal').classList.add('open');
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }

// ----- Init -----
async function init() {
  await loadInitial();
  buildDeck();
  updateStats();
  render();

  document.getElementById('menuBtn').addEventListener('click', openModal);
  document.getElementById('closeBtn').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') closeModal();
  });
  document.getElementById('resetBtn').addEventListener('click', resetProgress);
  document.getElementById('shuffleBtn').addEventListener('click', () => { buildDeck(); render(); toast('ערבבתי 🔀'); });
  document.getElementById('skipBtn').addEventListener('click', skip);

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    const k = e.key.toLowerCase();
    if (k === '1' || k === 'a') document.querySelectorAll('.opt')[0]?.click();
    else if (k === '2' || k === 'b') document.querySelectorAll('.opt')[1]?.click();
    else if (k === '3' || k === 'c') document.querySelectorAll('.opt')[2]?.click();
    else if (k === '4' || k === 'd') document.querySelectorAll('.opt')[3]?.click();
    else if (e.key === ' ') { e.preventDefault(); skip(); }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { lsSet(snapshot()); dbSet('state', snapshot()); }
  });
  window.addEventListener('pagehide', () => { lsSet(snapshot()); dbSet('state', snapshot()); });
}

init();
