// ===================================================================
// אפליקציית כרטיסיות - בגרות אנגלית 4 יחידות
// ===================================================================

const STORAGE_KEY = 'leni-vocab-v2';

// Default band filter — Band III is most critical for 4-point bagrut
const BAND_ORDER = ['Pre-Band I', 'Band I.1', 'Band I.2', 'Band II.1', 'Band II.2',
                    'Band III - A', 'Band III - B', 'Band III - C', 'Band III - D'];
const DEFAULT_BAND = 'Band III - A';

const state = {
  progress: {},
  filter: 'all',
  band: DEFAULT_BAND,
  deck: [],
  index: 0,
  flipped: false,
  autospeak: true
};

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  state.progress = saved.progress || {};
  state.filter = saved.filter || 'all';
  state.band = saved.band || DEFAULT_BAND;
  if (typeof saved.autospeak === 'boolean') state.autospeak = saved.autospeak;
} catch (e) {
  state.progress = {};
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    progress: state.progress,
    filter: state.filter,
    band: state.band,
    autospeak: state.autospeak
  }));
}

function wordKey(w) {
  return (w.en + '|' + (w.def_en || '')).toLowerCase();
}

function getStatus(word) {
  const p = state.progress[wordKey(word)];
  if (!p) return 'new';
  if (p.score >= 3) return 'learned';
  return 'learning';
}

function getBands() {
  const set = new Set();
  WORDS.forEach(w => { if (w.band) set.add(w.band); });
  return BAND_ORDER.filter(b => set.has(b));
}

function buildDeck() {
  let words = WORDS.slice();
  if (state.band !== 'all') {
    words = words.filter(w => w.band === state.band);
  }
  if (state.filter !== 'all') {
    words = words.filter(w => getStatus(w) === state.filter);
  }
  state.deck = words;
  state.index = 0;
  state.flipped = false;
}

function getCurrentScopeWords() {
  if (state.band === 'all') return WORDS;
  return WORDS.filter(w => w.band === state.band);
}

function updateStats() {
  const scope = getCurrentScopeWords();
  let nNew = 0, nLearning = 0, nLearned = 0;
  scope.forEach(w => {
    const s = getStatus(w);
    if (s === 'new') nNew++;
    else if (s === 'learning') nLearning++;
    else nLearned++;
  });
  document.getElementById('statTotal').textContent = scope.length;
  document.getElementById('statNew').textContent = nNew;
  document.getElementById('statLearning').textContent = nLearning;
  document.getElementById('statLearned').textContent = nLearned;
  const pct = scope.length ? Math.round((nLearned / scope.length) * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('bandLabel').textContent = state.band === 'all' ? 'הכל' : state.band;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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

  // Front: English word + (optional) PoS + definition hint
  const defHint = word.def_en ? `<div class="def-hint">💡 ${escapeHtml(word.def_en)}</div>` : '';

  // Back: Hebrew + English word small + def + family + PoS info
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

  // Swipe support
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
  if (state.index >= state.deck.length) return;
  const word = state.deck[state.index];
  const key = wordKey(word);
  if (!state.progress[key]) state.progress[key] = { score: 0, seen: 0 };
  state.progress[key].seen++;

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
    renderCard();
  }, 350);
}

function shuffle() {
  for (let i = state.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
  }
  state.index = 0;
  state.flipped = false;
  renderCard();
  toast('ערבבתי! 🔀');
}

function restartDeck() {
  buildDeck();
  shuffle();
}

function setFilter(filter) {
  state.filter = filter;
  buildDeck();
  shuffle();
  save();
  closeModal();
  renderFilterList();
  updateStats();
}

function setBand(band) {
  state.band = band;
  buildDeck();
  shuffle();
  save();
  closeModal();
  renderBandList();
  updateStats();
}

function countByFilter(filter) {
  let words = getCurrentScopeWords();
  if (filter === 'all') return words.length;
  return words.filter(w => getStatus(w) === filter).length;
}

function countByBand(band) {
  if (band === 'all') return WORDS.length;
  return WORDS.filter(w => w.band === band).length;
}

function renderFilterList() {
  const filters = [
    { id: 'all', label: 'כל המילים', sub: 'תרגלי הכל' },
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
  if (band === 'Band III - A' || band === 'Band III - B' || band === 'Band III - C' || band === 'Band III - D') {
    return 'רמה גבוהה - חשוב ל-4 יחידות';
  }
  if (band === 'Band II.1' || band === 'Band II.2') {
    return 'רמת ביניים';
  }
  if (band === 'Band I.1' || band === 'Band I.2') {
    return 'רמה בסיסית';
  }
  if (band === 'Pre-Band I') {
    return 'מילים יסודיות';
  }
  return '';
}

function renderBandList() {
  const bands = ['all', ...getBands()];
  document.getElementById('bandList').innerHTML = bands.map(b => {
    const label = b === 'all' ? 'כל ה-Bands' : b;
    const sub = b === 'all' ? '4251 מילים בסך הכל' : bandRecommendation(b);
    return `
      <div class="option ${state.band === b ? 'active' : ''}" onclick="setBand('${b}')">
        <div class="option-info"><strong>${label}</strong><small>${sub}</small></div>
        <div class="option-count">${countByBand(b)}</div>
      </div>
    `;
  }).join('');
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
  renderCard();
  closeModal();
  toast('התקדמות אופסה ✨');
}

// Init
document.getElementById('menuBtn').addEventListener('click', openModal);
document.getElementById('closeBtn').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', e => {
  if (e.target.id === 'modal') closeModal();
});
document.getElementById('resetBtn').addEventListener('click', resetProgress);
document.getElementById('shuffleBtn').addEventListener('click', shuffle);
document.getElementById('flipBtn').addEventListener('click', flipCard);
document.getElementById('autospeakToggle').addEventListener('change', e => {
  state.autospeak = e.target.checked;
  save();
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

buildDeck();
shuffle();
updateStats();
