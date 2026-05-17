// ===================================================================
// Bagrut Module C reading-comprehension practice
// ===================================================================

const STORAGE_KEY = 'leni-bagrut-practice-v1';

const state = {
  view: 'home',          // 'home' | 'reading'
  current: null,         // index of current passage being read
  answers: {},           // { passageIdx: { qIdx: 'a'|'b'|'c'|'d' } }
  graded: {},            // { passageIdx: true } (already submitted)
  scores: {}             // { passageIdx: { right, total, ts } }
};

// ----- Storage -----
function lsGet() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } }
function lsSet(v) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {} }

function save() {
  lsSet({
    answers: state.answers,
    graded: state.graded,
    scores: state.scores
  });
}

function load() {
  const s = lsGet();
  if (!s) return;
  if (s.answers) state.answers = s.answers;
  if (s.graded) state.graded = s.graded;
  if (s.scores) state.scores = s.scores;
}

// ----- Helpers -----
function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch {}
}

let toastTimer = null;
function toast(m) {
  const el = document.getElementById('toast');
  el.textContent = m;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

// ----- Home screen -----
function renderHome() {
  state.view = 'home';
  state.current = null;
  document.getElementById('backBtn').style.display = 'none';

  const cards = PASSAGES.map((p, idx) => {
    const score = state.scores[idx];
    const scoreHtml = score
      ? `<div class="pc-score">
           <span>הציון הקודם שלך</span>
           <strong>${score.right} / ${score.total} (${Math.round(score.right * 100 / score.total)}%)</strong>
         </div>`
      : '';
    const actionText = score ? 'תרגלי שוב 🔄' : 'התחילי 🚀';
    return `
      <div class="passage-card" onclick="openPassage(${idx})">
        <span class="pc-topic">${escapeHtml(p.topic || 'Reading')}</span>
        <div class="pc-title">${escapeHtml(p.title)}</div>
        <div class="pc-meta">
          <span>📝 ${p.word_count} words</span>
          <span class="dot">•</span>
          <span>❓ ${p.questions.length} questions</span>
        </div>
        ${scoreHtml}
        <button class="pc-action" onclick="event.stopPropagation(); openPassage(${idx});">${actionText}</button>
      </div>
    `;
  }).join('');

  document.getElementById('screen').innerHTML = `
    <div style="color:white; padding: 4px; margin-bottom: 4px;">
      <div style="font-size: 14px; opacity: 0.9; line-height: 1.5;">
        בחרי קטע, קראי אותו, וענו על 6 השאלות. בסוף לחצי <strong>"בדקי תשובות"</strong> ותראי איזה ענית נכון.
      </div>
    </div>
    <div class="home-grid">${cards}</div>
  `;
}

// ----- Reading screen -----
function openPassage(idx) {
  state.current = idx;
  state.view = 'reading';
  if (state.graded[idx]) {
    // Allow re-doing — clear graded state so questions are interactive again
    state.graded[idx] = false;
    state.answers[idx] = {};
    save();
  } else if (!state.answers[idx]) {
    state.answers[idx] = {};
  }
  document.getElementById('backBtn').style.display = 'inline-flex';
  renderReading();
  window.scrollTo(0, 0);
}

function renderReading() {
  const p = PASSAGES[state.current];
  const idx = state.current;

  // Build paragraph HTML from text (split on double newline)
  const paragraphs = p.text.split(/\n\n+/).map(par => `<p>${escapeHtml(par)}</p>`).join('');

  const questionsHtml = p.questions.map((q, qi) => renderQuestion(q, qi, idx)).join('');

  const allAnswered = p.questions.every((_, qi) => state.answers[idx][qi]);
  const isGraded = !!state.graded[idx];

  let bottomBar = '';
  if (!isGraded) {
    bottomBar = `
      <div class="submit-bar">
        <button class="submit-btn" id="submitBtn" ${allAnswered ? '' : 'disabled'} onclick="submitAnswers()">
          ${allAnswered ? '✓ בדקי תשובות' : `ענתה על ${Object.keys(state.answers[idx]).length} מתוך ${p.questions.length}`}
        </button>
      </div>
    `;
  } else {
    const sc = state.scores[idx];
    bottomBar = `
      <div class="submit-bar">
        <button class="submit-btn" onclick="openPassage(${idx})">
          🔄 נסי שוב
        </button>
      </div>
    `;
  }

  let resultsBanner = '';
  if (isGraded && state.scores[idx]) {
    const sc = state.scores[idx];
    const pct = Math.round(sc.right * 100 / sc.total);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : '💪';
    const msg = pct >= 80 ? 'מצוין!' : pct >= 60 ? 'יפה! עוד קצת ותגיעי לשם' : 'אל תוותרי - עברי על הטעויות';
    resultsBanner = `
      <div class="results">
        <div style="font-size: 38px;">${emoji}</div>
        <div class="score-big">${sc.right}<span class="total"> / ${sc.total}</span></div>
        <div class="score-label">${msg}</div>
        <div class="score-pct">${pct}%</div>
      </div>
    `;
  }

  document.getElementById('screen').innerHTML = `
    ${resultsBanner}
    <div class="read-card">
      <button class="read-speaker-btn" onclick="speak(${JSON.stringify(p.text).replace(/"/g, '&quot;')})">🔊</button>
      <div class="read-title">${escapeHtml(p.title)}</div>
      <div class="read-meta">${escapeHtml(p.topic || '')} · ${p.word_count} words</div>
      <div class="read-text">${paragraphs}</div>
    </div>
    <div class="questions">${questionsHtml}</div>
    ${bottomBar}
  `;
}

function renderQuestion(q, qi, idx) {
  const isGraded = !!state.graded[idx];
  const selected = state.answers[idx][qi];
  const opts = Object.entries(q.options).map(([letter, text]) => {
    const isSelected = selected === letter;
    const isCorrect = letter === q.correct;
    let cls = 'q-opt';
    if (isSelected && !isGraded) cls += ' selected';
    if (isGraded) {
      if (isCorrect) cls += ' correct';
      else if (isSelected) cls += ' wrong';
    }
    return `
      <button class="${cls}" onclick="selectAnswer(${qi}, '${letter}')">
        <span class="q-opt-letter">${letter}</span>
        <span class="q-opt-text">${escapeHtml(text)}</span>
      </button>
    `;
  }).join('');

  let resultLine = '';
  if (isGraded) {
    const right = selected === q.correct;
    resultLine = `<div class="q-result ${right ? 'right' : 'wrong-r'}">${right ? '✓ נכון!' : '✗ לא נכון - התשובה הנכונה: ' + q.correct.toUpperCase()}</div>`;
  }

  return `
    <div class="q-card ${isGraded ? 'graded' : ''}">
      <div class="q-text"><span class="q-num">${qi + 1}</span>${escapeHtml(q.q)}</div>
      <div class="q-opts">${opts}</div>
      ${resultLine}
    </div>
  `;
}

function selectAnswer(qi, letter) {
  const idx = state.current;
  if (state.graded[idx]) return;
  if (!state.answers[idx]) state.answers[idx] = {};
  state.answers[idx][qi] = letter;
  save();
  renderReading();
}

function submitAnswers() {
  const idx = state.current;
  const p = PASSAGES[idx];
  let right = 0;
  p.questions.forEach((q, qi) => {
    if (state.answers[idx][qi] === q.correct) right++;
  });
  state.graded[idx] = true;
  state.scores[idx] = { right, total: p.questions.length, ts: Date.now() };
  save();
  renderReading();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const pct = Math.round(right * 100 / p.questions.length);
  toast(`${right}/${p.questions.length} (${pct}%)`);
}

// ----- Init -----
load();
document.getElementById('backBtn').addEventListener('click', renderHome);
renderHome();
