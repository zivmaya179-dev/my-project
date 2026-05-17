// ===================================================================
// אפליקציית כרטיסיות - בגרות אנגלית 4 יחידות
// ===================================================================

const STORAGE_KEY = 'leni-vocab-v2';
const DB_NAME = 'leni-vocab-db';
const DB_VERSION = 1;
const STORE = 'state';

const BAND_ORDER = ['Pre-Band I', 'Band I.1', 'Band I.2', 'Band II.1', 'Band II.2',
                    'Band III - A', 'Band III - B', 'Band III - C', 'Band III - D'];
const DEFAULT_BAND = 'Band III - A';

const state = {
  progress: {},
  filter: 'all',
  bands: [DEFAULT_BAND],
  deck: [],
  index: 0,
  flipped: false,
  autospeak: true,
  viewMode: 'cards'
};

// =================================================================
// Storage layer: localStorage (sync) + IndexedDB (durable backup)
// Both are written on every save. On load we take whichever is newer.
// =================================================================
function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('No IndexedDB'));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGet(key) {
  try {
    const db = await openDB();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) { return null; }
}

async function dbSet(key, value) {
  try {
    const db = await openDB();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (e) {}
}

function lsGet() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { return null; }
}
function lsSet(v) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch (e) {}
}

function snapshot() {
  return {
    progress: state.progress,
    filter: state.filter,
    bands: state.bands,
    autospeak: state.autospeak,
    viewMode: state.viewMode,
    savedAt: Date.now()
  };
}

function applySnapshot(s) {
  if (!s || typeof s !== 'object') return;
  if (s.progress && typeof s.progress === 'object') state.progress = s.progress;
  if (typeof s.filter === 'string') state.filter = s.filter;
  // bands: new multi-select; migrate from legacy single-string s.band
  if (Array.isArray(s.bands) && s.bands.length) {
    state.bands = s.bands.filter(b => typeof b === 'string');
    if (!state.bands.length) state.bands = [DEFAULT_BAND];
  } else if (typeof s.band === 'string') {
    state.bands = s.band === 'all' ? getBands() : [s.band];
  }
  if (typeof s.autospeak === 'boolean') state.autospeak = s.autospeak;
  if (s.viewMode === 'list' || s.viewMode === 'cards' || s.viewMode === 'quiz') state.viewMode = s.viewMode;
}

let saveTimer = null;
function save() {
  const data = snapshot();
  lsSet(data);
  // debounce IndexedDB write to avoid spamming on rapid actions
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { dbSet('state', data); }, 200);
  flashSaved();
}

// Initial load: take whichever store has the newer savedAt
async function loadInitial() {
  const ls = lsGet();
  const idb = await dbGet('state');
  let best = null;
  if (ls && idb) {
    best = (idb.savedAt || 0) > (ls.savedAt || 0) ? idb : ls;
  } else {
    best = idb || ls;
  }
  // Migrate from old v1 key if present and no v2 data
  if (!best) {
    try {
      const old = JSON.parse(localStorage.getItem('leni-vocab-v1') || 'null');
      if (old && old.progress) best = { progress: old.progress };
    } catch (e) {}
  }
  applySnapshot(best);
}

let savedFlashTimer = null;
function flashSaved() {
  const el = document.getElementById('saveDot');
  if (!el) return;
  el.classList.add('show');
  clearTimeout(savedFlashTimer);
  savedFlashTimer = setTimeout(() => el.classList.remove('show'), 800);
}

// =================================================================
// Word key + status
// =================================================================
function wordKey(w) {
  return (w.en + '|' + (w.def_en || '')).toLowerCase();
}

function getStatus(word) {
  const p = state.progress[wordKey(word)];
  if (!p) return 'new';
  if (p.score >= 3) return 'learned';
  return 'learning';
}

function isUnknown(word) {
  const p = state.progress[wordKey(word)];
  return !!(p && p.last_action === 'no');
}

function getBands() {
  const set = new Set();
  WORDS.forEach(w => { if (w.band) set.add(w.band); });
  return BAND_ORDER.filter(b => set.has(b));
}

// =================================================================
// Deck building (band + filter)
// =================================================================
function buildDeck() {
  const bandSet = new Set(state.bands);
  let words = WORDS.filter(w => bandSet.has(w.band));
  if (state.filter === 'new') {
    words = words.filter(w => getStatus(w) === 'new');
  } else if (state.filter === 'learning') {
    words = words.filter(w => getStatus(w) === 'learning');
  } else if (state.filter === 'learned') {
    words = words.filter(w => getStatus(w) === 'learned');
  } else if (state.filter === 'unknown') {
    words = words.filter(w => isUnknown(w));
  }
  state.deck = words;
  state.index = 0;
  state.flipped = false;
}

function getCurrentScopeWords() {
  const bandSet = new Set(state.bands);
  return WORDS.filter(w => bandSet.has(w.band));
}

function bandLabelText() {
  const allBands = getBands();
  if (state.bands.length === allBands.length) return 'הכל';
  if (state.bands.length === 1) return state.bands[0];
  if (state.bands.length === 0) return 'לא נבחר';
  // Show short form: if all selected are Band III - X, say "Band III ×N"
  const prefix = state.bands[0].split(' - ')[0];
  const allSamePrefix = state.bands.every(b => b.split(' - ')[0] === prefix);
  if (allSamePrefix) return `${prefix} × ${state.bands.length}`;
  return `${state.bands.length} רמות`;
}

function updateStats() {
  const scope = getCurrentScopeWords();
  let nNew = 0, nLearning = 0, nLearned = 0, nUnknown = 0;
  scope.forEach(w => {
    const s = getStatus(w);
    if (s === 'new') nNew++;
    else if (s === 'learning') nLearning++;
    else nLearned++;
    if (isUnknown(w)) nUnknown++;
  });
  document.getElementById('statTotal').textContent = scope.length;
  document.getElementById('statNew').textContent = nNew;
  document.getElementById('statLearning').textContent = nLearning;
  document.getElementById('statLearned').textContent = nLearned;
  const pct = scope.length ? Math.round((nLearned / scope.length) * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('bandLabel').textContent = bandLabelText();
  // Store unknown count for modal use
  state.unknownCount = nUnknown;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// =================================================================
// Rendering — cards mode + list mode
// =================================================================
function render() {
  document.body.classList.toggle('list-mode', state.viewMode === 'list');
  document.body.classList.toggle('quiz-mode', state.viewMode === 'quiz');
  if (state.viewMode === 'list') {
    renderList();
  } else if (state.viewMode === 'quiz') {
    renderQuiz();
  } else {
    renderCard();
  }
}

function renderList() {
  const stage = document.getElementById('stage');
  document.getElementById('actions').style.display = 'none';
  const counter = document.getElementById('counter');
  counter.textContent = `${state.deck.length} מילים`;

  if (!state.deck.length) {
    stage.innerHTML = `
      <div class="empty">
        <div class="emoji">📋</div>
        <h2>אין מילים להצגה</h2>
        <p>נסי לבחור סינון אחר.</p>
        <button onclick="setFilter('all')">הצג את כל המילים</button>
      </div>
    `;
    return;
  }

  const items = state.deck.map((w, i) => {
    const status = getStatus(w);
    const dot = status === 'learned' ? 'green' : status === 'learning' ? 'amber' : 'gray';
    const unknownTag = isUnknown(w) ? '<span class="row-tag no">לא ידעתי</span>' : '';
    return `
      <div class="row" onclick="speak('${escapeHtml(w.en).replace(/'/g,"\\'")}')">
        <div class="row-dot ${dot}"></div>
        <div class="row-en">${escapeHtml(w.en)}</div>
        <div class="row-he">${escapeHtml(w.he || '')}</div>
        ${unknownTag}
      </div>
    `;
  }).join('');

  stage.innerHTML = `<div class="word-list">${items}</div>`;
}

// =================================================================
// Quiz mode — multiple choice (English -> 4 Hebrew options)
// =================================================================
function pickDistractors(correct, count) {
  // Prefer wrong answers from the same band, fall back to any band
  const sameBand = WORDS.filter(w => w.band === correct.band && w.he && w.he !== correct.he);
  const pool = sameBand.length >= count * 3 ? sameBand : WORDS.filter(w => w.he && w.he !== correct.he);
  const picked = [];
  const usedHe = new Set([correct.he]);
  let tries = 0;
  while (picked.length < count && tries < pool.length * 3) {
    const w = pool[Math.floor(Math.random() * pool.length)];
    if (!usedHe.has(w.he)) {
      usedHe.add(w.he);
      picked.push(w);
    }
    tries++;
  }
  return picked;
}

function renderQuiz() {
  const stage = document.getElementById('stage');
  const actions = document.getElementById('actions');
  const counter = document.getElementById('counter');
  actions.style.display = 'none';

  // Filter to deck words that have a Hebrew translation
  const quizable = state.deck.filter(w => w.he);

  if (!quizable.length) {
    counter.textContent = '0 / 0';
    stage.innerHTML = `
      <div class="empty">
        <div class="emoji">🎯</div>
        <h2>אין מילים למבחן</h2>
        <p>נסי לבחור סינון אחר.</p>
        <button onclick="setFilter('all')">הצג את כל המילים</button>
      </div>
    `;
    return;
  }

  if (state.index >= quizable.length) {
    counter.textContent = `${quizable.length} / ${quizable.length}`;
    celebrate();
    stage.innerHTML = `
      <div class="empty">
        <div class="emoji">🏆</div>
        <h2>סיימת את המבחן!</h2>
        <p>עברת על ${quizable.length} מילים.</p>
        <button onclick="restartDeck()">סבב חדש 🔄</button>
      </div>
    `;
    return;
  }

  const word = quizable[state.index];
  counter.textContent = `${state.index + 1} / ${quizable.length}`;

  const distractors = pickDistractors(word, 3);
  const options = [word, ...distractors];
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const optionsHtml = options.map((o, idx) => `
    <button class="quiz-option" data-correct="${o.he === word.he ? '1' : '0'}" data-idx="${idx}">
      <span class="opt-letter">${['א','ב','ג','ד'][idx]}</span>
      <span class="opt-text">${escapeHtml(o.he)}</span>
    </button>
  `).join('');

  const bandBadge = word.band ? `<div class="badge">${escapeHtml(word.band)}</div>` : '';
  const posBadge = word.pos ? `<span class="pos-inline">${escapeHtml(word.pos)}</span>` : '';

  stage.innerHTML = `
    <div class="quiz-card">
      ${bandBadge}
      <button class="speaker" id="quizSpeaker" aria-label="השמע">🔊</button>
      <div class="quiz-label">איך אומרים בעברית?</div>
      <div class="quiz-word">${escapeHtml(word.en)}${posBadge}</div>
      <div class="quiz-options">${optionsHtml}</div>
    </div>
  `;

  document.getElementById('quizSpeaker').addEventListener('click', e => { e.stopPropagation(); speak(word.en); });

  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleQuizAnswer(btn, word));
  });

  if (state.autospeak) {
    setTimeout(() => speak(word.en, true), 200);
  }
}

function handleQuizAnswer(btn, word) {
  // Already answered?
  if (btn.closest('.quiz-card').dataset.answered) return;
  btn.closest('.quiz-card').dataset.answered = '1';

  const isCorrect = btn.dataset.correct === '1';
  const key = wordKey(word);
  if (!state.progress[key]) state.progress[key] = { score: 0, seen: 0 };
  state.progress[key].seen++;
  state.progress[key].last_at = Date.now();

  if (isCorrect) {
    btn.classList.add('correct');
    state.progress[key].score = Math.min(5, state.progress[key].score + 1);
    state.progress[key].last_action = 'yes';
    toast('נכון! 🎯');
  } else {
    btn.classList.add('wrong');
    state.progress[key].score = Math.max(0, state.progress[key].score - 1);
    state.progress[key].last_action = 'no';
    // Highlight the correct option
    document.querySelectorAll('.quiz-option').forEach(b => {
      if (b.dataset.correct === '1') b.classList.add('correct');
    });
    toast('כמעט - נחזור על זה 💪');
  }

  save();
  setTimeout(() => {
    state.index++;
    updateStats();
    render();
  }, isCorrect ? 700 : 1500);
}

function renderCard() {
  const stage = document.getElementById('stage');
  const actions = document.getElementById('actions');
  const counter = document.getElementById('counter');

  if (!state.deck.length) {
    actions.style.display = 'none';
    counter.textContent = '0 / 0';
    stage.innerHTML = `
      <div class="empty">
        <div class="emoji">🎯</div>
        <h2>אין מילים כאן</h2>
        <p>אין מילים בקטגוריה הנוכחית.<br>נסי לבחור סינון אחר.</p>
        <button onclick="setFilter('all')">הצג את כל המילים</button>
      </div>
    `;
    return;
  }

  if (state.index >= state.deck.length) {
    actions.style.display = 'none';
    counter.textContent = `${state.deck.length} / ${state.deck.length}`;
    celebrate();
    stage.innerHTML = `
      <div class="empty">
        <div class="emoji">🏆</div>
        <h2>וואו, סיימת את הסבב!</h2>
        <p>עברת על כל ${state.deck.length} המילים. רוצה לעבור עליהן שוב?</p>
        <button onclick="restartDeck()">סבב חדש 🔄</button>
      </div>
    `;
    return;
  }

  actions.style.display = 'grid';
  const word = state.deck[state.index];
  counter.textContent = `${state.index + 1} / ${state.deck.length}`;

  const bandBadge = word.band ? `<div class="badge">${escapeHtml(word.band)}</div>` : '';
  const posBadge = word.pos ? `<div class="badge pos-badge">${escapeHtml(word.pos)}</div>` : '';
  const recProd = word.rec_prod ? `<div class="rp-badge ${word.rec_prod === 'Prod' ? 'prod' : 'rec'}">${word.rec_prod === 'Prod' ? 'P' : 'R'}</div>` : '';

  const defHint = word.def_en ? `<div class="def-hint">💡 ${escapeHtml(word.def_en)}</div>` : '';
  const familyHtml = word.family ? `<div class="family-info"><span class="label">מילים קרובות:</span> <span class="value">${escapeHtml(word.family)}${word.family_pos ? ' <em>('+escapeHtml(word.family_pos)+')</em>' : ''}</span></div>` : '';
  const defHtml = word.def_en ? `<div class="def-info"><span class="label">EN:</span> <span class="value">${escapeHtml(word.def_en)}</span></div>` : '';
  const posHtml = word.pos ? `<div class="pos-info"><span class="label">סוג:</span> <span class="value">${escapeHtml(word.pos)}</span></div>` : '';

  stage.innerHTML = `
    <div class="card ${state.flipped ? 'flipped' : ''}" id="card">
      <div class="face front">
        ${bandBadge}
        ${recProd}
        <button class="speaker" id="speakerFront" aria-label="השמע">🔊</button>
        <div class="word">${escapeHtml(word.en)}</div>
        ${posBadge ? `<div class="pos-row">${posBadge}</div>` : ''}
        ${defHint}
        <div class="hint">לחצי להפוך • Tap to flip</div>
      </div>
      <div class="face back">
        ${bandBadge}
        ${recProd}
        <button class="speaker" id="speakerBack" aria-label="השמע">🔊</button>
        <div class="translation">${escapeHtml(word.he || '—')}</div>
        <div class="en-small">${escapeHtml(word.en)}</div>
        <div class="info-list">
          ${posHtml}
          ${defHtml}
          ${familyHtml}
        </div>
        <div class="hint">החליקי ימינה אם זכרת ✓</div>
      </div>
    </div>
  `;

  const card = document.getElementById('card');
  card.addEventListener('click', (e) => {
    if (e.target.closest('.speaker')) return;
    flipCard();
  });

  let startX = 0, startY = 0, moving = false;
  card.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    moving = true;
  }, { passive: true });
  card.addEventListener('touchend', e => {
    if (!moving) return;
    moving = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) handleAction('yes');
      else handleAction('no');
    }
  });

  document.getElementById('speakerFront').addEventListener('click', e => { e.stopPropagation(); speak(word.en); });
  document.getElementById('speakerBack').addEventListener('click', e => { e.stopPropagation(); speak(word.en); });

  if (state.autospeak) {
    setTimeout(() => speak(word.en, true), 200);
  }
}

function flipCard() {
  state.flipped = !state.flipped;
  const card = document.getElementById('card');
  if (card) card.classList.toggle('flipped', state.flipped);
}

function handleAction(action) {
  if (state.viewMode !== 'cards') return;
  if (state.index >= state.deck.length) return;
  const word = state.deck[state.index];
  const key = wordKey(word);
  if (!state.progress[key]) state.progress[key] = { score: 0, seen: 0 };
  state.progress[key].seen++;
  state.progress[key].last_action = action;
  state.progress[key].last_at = Date.now();

  const card = document.getElementById('card');

  if (action === 'yes') {
    state.progress[key].score = Math.min(5, state.progress[key].score + 1);
    if (card) card.classList.add('swipe-right');
    toast('כל הכבוד! 🎯');
  } else if (action === 'no') {
    state.progress[key].score = Math.max(0, state.progress[key].score - 1);
    if (card) card.classList.add('swipe-left');
    toast('נחזור על זה 💪');
  } else {
    if (card) card.classList.add('swipe-left');
  }

  save();
  setTimeout(() => {
    state.index++;
    state.flipped = false;
    updateStats();
    render();
  }, 350);
}

function shuffle() {
  for (let i = state.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
  }
  state.index = 0;
  state.flipped = false;
  render();
  toast('ערבבתי! 🔀');
}

function restartDeck() {
  buildDeck();
  shuffle();
}

function setFilter(filter) {
  state.filter = filter;
  buildDeck();
  if (state.viewMode === 'cards') shuffle(); else render();
  save();
  closeModal();
  renderFilterList();
  updateStats();
}

function toggleBand(band) {
  const i = state.bands.indexOf(band);
  if (i >= 0) {
    if (state.bands.length === 1) return; // don't allow zero bands
    state.bands.splice(i, 1);
  } else {
    state.bands.push(band);
  }
  buildDeck();
  if (state.viewMode === 'cards') shuffle(); else render();
  save();
  renderBandList();
  updateStats();
}

function setAllBands(selectAll) {
  if (selectAll) {
    state.bands = getBands();
  } else {
    state.bands = [DEFAULT_BAND];
  }
  buildDeck();
  if (state.viewMode === 'cards') shuffle(); else render();
  save();
  renderBandList();
  updateStats();
}

function setViewMode(mode) {
  state.viewMode = mode;
  save();
  updateViewModeUI();
  render();
}

function toggleViewMode() {
  // legacy cycle (no longer used by UI but kept for keyboard shortcut)
  const next = state.viewMode === 'cards' ? 'list'
             : state.viewMode === 'list' ? 'quiz'
             : 'cards';
  setViewMode(next);
}

function updateViewModeUI() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === state.viewMode);
  });
}

function countByFilter(filter) {
  let words = getCurrentScopeWords();
  if (filter === 'all') return words.length;
  if (filter === 'unknown') return words.filter(w => isUnknown(w)).length;
  return words.filter(w => getStatus(w) === filter).length;
}

function countByBand(band) {
  return WORDS.filter(w => w.band === band).length;
}

function renderFilterList() {
  const filters = [
    { id: 'all', label: 'כל המילים', sub: 'תרגלי הכל' },
    { id: 'unknown', label: '⚠️ סימנתי "לא ידעתי"', sub: 'מילים שטעיתי בהן' },
    { id: 'new', label: 'מילים חדשות', sub: 'עוד לא נראו' },
    { id: 'learning', label: 'בלימוד', sub: 'צריך עוד תרגול' },
    { id: 'learned', label: 'ידועות', sub: 'עברו בהצלחה' }
  ];
  document.getElementById('filterList').innerHTML = filters.map(f => `
    <div class="option ${state.filter === f.id ? 'active' : ''}" onclick="setFilter('${f.id}')">
      <div class="option-info"><strong>${f.label}</strong><small>${f.sub}</small></div>
      <div class="option-count">${countByFilter(f.id)}</div>
    </div>
  `).join('');
}

function bandRecommendation(band) {
  if (band && band.startsWith('Band III')) return 'רמה גבוהה - חשוב ל-4 יחידות';
  if (band === 'Band II.1' || band === 'Band II.2') return 'רמת ביניים';
  if (band === 'Band I.1' || band === 'Band I.2') return 'רמה בסיסית';
  if (band === 'Pre-Band I') return 'מילים יסודיות';
  return '';
}

function renderBandList() {
  const bands = getBands();
  const selected = new Set(state.bands);
  const totalSelected = state.bands.reduce((sum, b) => sum + countByBand(b), 0);
  const allBandsCount = bands.length;
  const isAll = selected.size === allBandsCount;
  const header = `
    <div class="band-instr">סמני כמה רמות שתרצי - לני תתאמן על כולן יחד</div>
    <div class="band-actions">
      <span class="band-summary"><strong>${state.bands.length}</strong> רמות · <strong>${totalSelected}</strong> מילים</span>
      <div class="band-quick">
        <button class="chip" onclick="setAllBands(false)">רמה אחת</button>
        <button class="chip ${isAll ? 'active' : ''}" onclick="setAllBands(true)">סמני הכל</button>
      </div>
    </div>`;
  const rows = bands.map(b => {
    const checked = selected.has(b);
    return `
      <button class="band-pick ${checked ? 'on' : ''}" onclick="toggleBand('${b}')">
        <span class="band-check">${checked ? '✓' : ''}</span>
        <span class="band-info">
          <span class="band-name">${b}</span>
          <span class="band-sub">${bandRecommendation(b)}</span>
        </span>
        <span class="band-num">${countByBand(b)}</span>
      </button>
    `;
  }).join('');
  document.getElementById('bandList').innerHTML = header + rows;
}

function openModal() {
  renderFilterList();
  renderBandList();
  document.getElementById('autospeakToggle').checked = state.autospeak;
  document.getElementById('modal').classList.add('open');
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

function speak(text, soft = false) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = soft ? 0.85 : 0.9;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1500);
}

function celebrate() {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
  const box = document.getElementById('celebrate');
  box.innerHTML = '';
  for (let i = 0; i < 60; i++) {
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
  if (!confirm('לאפס את כל ההתקדמות? אי אפשר לבטל.')) return;
  state.progress = {};
  save();
  buildDeck();
  updateStats();
  render();
  closeModal();
  toast('התקדמות אופסה ✨');
}

// =================================================================
// Backup / Restore — download JSON, import JSON
// =================================================================
function exportProgress() {
  const data = snapshot();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `leni-vocab-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('הגיבוי הורד 💾');
}

function importProgressFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || typeof data !== 'object' || !data.progress) {
        alert('הקובץ לא תקין - חסר שדה progress');
        return;
      }
      const n = Object.keys(data.progress).length;
      if (!confirm(`לייבא ${n} מילים מהגיבוי? זה ידרוס את ההתקדמות הנוכחית.`)) return;
      applySnapshot(data);
      save();
      buildDeck();
      updateStats();
      render();
      closeModal();
      toast(`שוחזר! ${n} מילים ✨`);
    } catch (err) {
      alert('שגיאה בקריאת הקובץ: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// =================================================================
// Init
// =================================================================
async function init() {
  await loadInitial();
  buildDeck();
  shuffle();
  updateStats();
  updateViewModeUI();

  document.getElementById('menuBtn').addEventListener('click', openModal);
  document.getElementById('closeBtn').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') closeModal();
  });
  document.getElementById('resetBtn').addEventListener('click', resetProgress);
  document.getElementById('shuffleBtn').addEventListener('click', shuffle);
  document.getElementById('flipBtn').addEventListener('click', flipCard);
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === state.viewMode) return;
      state.index = 0;
      setViewMode(mode);
      toast(mode === 'cards' ? 'כרטיסיות 🎴' : mode === 'list' ? 'רשימה 📋' : 'מבחן אמריקאי 🎯');
    });
  });
  document.getElementById('autospeakToggle').addEventListener('change', e => {
    state.autospeak = e.target.checked;
    save();
  });
  document.getElementById('exportBtn').addEventListener('click', exportProgress);
  document.getElementById('importFile').addEventListener('change', e => {
    if (e.target.files[0]) importProgressFromFile(e.target.files[0]);
  });
  document.querySelectorAll('.btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset.action));
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ') { e.preventDefault(); flipCard(); }
    else if (e.key === 'ArrowRight' || e.key === '1') handleAction('no');
    else if (e.key === 'ArrowLeft' || e.key === '3') handleAction('yes');
    else if (e.key === 'ArrowDown' || e.key === '2') handleAction('skip');
  });

  // Save when tab is hidden (most reliable trigger across browsers)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      lsSet(snapshot());
      dbSet('state', snapshot());
    }
  });
  window.addEventListener('pagehide', () => {
    lsSet(snapshot());
    dbSet('state', snapshot());
  });
}

init();
