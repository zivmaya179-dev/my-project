// ===================================================================
// אפליקציית כרטיסיות לימוד אנגלית
// ===================================================================

const STORAGE_KEY = 'leni-vocab-v1';

const state = {
  progress: {},
  filter: 'all',
  unit: 'all',
  deck: [],
  index: 0,
  flipped: false
};

// Load saved progress
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  state.progress = saved.progress || {};
  state.filter = saved.filter || 'all';
  state.unit = saved.unit || 'all';
} catch (e) {
  state.progress = {};
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    progress: state.progress,
    filter: state.filter,
    unit: state.unit
  }));
}

function getStatus(word) {
  const p = state.progress[word.en];
  if (!p) return 'new';
  if (p.score >= 3) return 'learned';
  return 'learning';
}

function buildDeck() {
  let words = WORDS.slice();
  if (state.unit !== 'all') {
    words = words.filter(w => w.unit === state.unit);
  }
  if (state.filter !== 'all') {
    words = words.filter(w => getStatus(w) === state.filter);
  }
  state.deck = words;
  state.index = 0;
  state.flipped = false;
}

function getUnits() {
  const set = new Set();
  WORDS.forEach(w => { if (w.unit) set.add(w.unit); });
  return Array.from(set);
}

function updateStats() {
  let nNew = 0, nLearning = 0, nLearned = 0;
  WORDS.forEach(w => {
    const s = getStatus(w);
    if (s === 'new') nNew++;
    else if (s === 'learning') nLearning++;
    else nLearned++;
  });
  document.getElementById('statTotal').textContent = WORDS.length;
  document.getElementById('statNew').textContent = nNew;
  document.getElementById('statLearning').textContent = nLearning;
  document.getElementById('statLearned').textContent = nLearned;
  const pct = WORDS.length ? Math.round((nLearned / WORDS.length) * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
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
        <div class="emoji">🎉</div>
        <h2>כל הכבוד!</h2>
        <p>אין מילים בקטגוריה הזו.<br>נסי לבחור סינון אחר או להתחיל מחדש.</p>
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
        <p>עברת על כל המילים. רוצה לעבור עליהן שוב?</p>
        <button onclick="restartDeck()">סבב חדש 🔄</button>
      </div>
    `;
    return;
  }

  actions.style.display = 'grid';
  const word = state.deck[state.index];
  counter.textContent = `${state.index + 1} / ${state.deck.length}`;

  const badgeHtml = word.unit ? `<div class="badge">${word.unit}</div>` : '';
  const exFront = word.example ? `<div class="example">${word.example}</div>` : '';
  const exBack = word.example ? `<div class="example">${word.example}</div>` : '';

  stage.innerHTML = `
    <div class="card ${state.flipped ? 'flipped' : ''}" id="card">
      <div class="face front">
        ${badgeHtml}
        <button class="speaker" id="speakerFront" aria-label="השמע">🔊</button>
        <div class="word">${word.en}</div>
        ${exFront}
        <div class="hint">לחצי להפוך • Tap to flip</div>
      </div>
      <div class="face back">
        ${badgeHtml}
        <button class="speaker" id="speakerBack" aria-label="השמע">🔊</button>
        <div class="translation">${word.he}</div>
        <div class="word" style="font-size: 22px; opacity: 0.6;">${word.en}</div>
        ${exBack}
        <div class="hint">לחצי על "יודעת!" אם זכרת</div>
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
      if (dx > 0) handleAction('yes');   // swipe right (RTL: positive = right)
      else handleAction('no');
    }
  });

  document.getElementById('speakerFront').addEventListener('click', e => { e.stopPropagation(); speak(word.en); });
  document.getElementById('speakerBack').addEventListener('click', e => { e.stopPropagation(); speak(word.en); });

  // Auto-speak when card appears
  setTimeout(() => speak(word.en, true), 200);
}

function flipCard() {
  state.flipped = !state.flipped;
  const card = document.getElementById('card');
  if (card) card.classList.toggle('flipped', state.flipped);
}

function handleAction(action) {
  if (state.index >= state.deck.length) return;
  const word = state.deck[state.index];
  if (!state.progress[word.en]) state.progress[word.en] = { score: 0, seen: 0 };
  state.progress[word.en].seen++;

  const card = document.getElementById('card');

  if (action === 'yes') {
    state.progress[word.en].score = Math.min(5, state.progress[word.en].score + 1);
    if (card) card.classList.add('swipe-right');
    toast('כל הכבוד! 🎯');
  } else if (action === 'no') {
    state.progress[word.en].score = Math.max(0, state.progress[word.en].score - 1);
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
  closeModal();
  renderFilterList();
}

function setUnit(unit) {
  state.unit = unit;
  buildDeck();
  shuffle();
  closeModal();
  renderUnitList();
}

function countByFilter(filter) {
  let words = WORDS;
  if (state.unit !== 'all') words = words.filter(w => w.unit === state.unit);
  if (filter === 'all') return words.length;
  return words.filter(w => getStatus(w) === filter).length;
}

function countByUnit(unit) {
  if (unit === 'all') return WORDS.length;
  return WORDS.filter(w => w.unit === unit).length;
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

function renderUnitList() {
  const units = ['all', ...getUnits()];
  document.getElementById('unitList').innerHTML = units.map(u => `
    <div class="option ${state.unit === u ? 'active' : ''}" onclick="setUnit('${u}')">
      <div class="option-info"><strong>${u === 'all' ? 'כל היחידות' : u}</strong></div>
      <div class="option-count">${countByUnit(u)}</div>
    </div>
  `).join('');
}

function openModal() {
  renderFilterList();
  renderUnitList();
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
document.querySelectorAll('.btn[data-action]').forEach(btn => {
  btn.addEventListener('click', () => handleAction(btn.dataset.action));
});

// Keyboard shortcuts (for desktop testing)
document.addEventListener('keydown', e => {
  if (e.key === ' ') { e.preventDefault(); flipCard(); }
  else if (e.key === 'ArrowRight' || e.key === '1') handleAction('no');
  else if (e.key === 'ArrowLeft' || e.key === '3') handleAction('yes');
  else if (e.key === 'ArrowDown' || e.key === '2') handleAction('skip');
});

buildDeck();
shuffle();
updateStats();
