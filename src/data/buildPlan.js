// iNTERSKEP Build Plan — Building tasks only (no IP, legal, fundraising)

export const WEEKS_TOTAL = 11;

export const PHASE_COLORS = {
  0: '#8b5cf6',
  1: '#00d4aa',
  2: '#4a90d9',
  3: '#f5b731',
};

export const phases = [
  {
    id: 0,
    name: 'Phase 0 — Architecture & Design',
    nameHe: 'Phase 0 — ארכיטקטורה ועיצוב',
    weekStart: 1,
    weekEnd: 2,
    color: PHASE_COLORS[0],
    tasks: [
      { id: 'p0-1', name: 'Permission Matrix', nameHe: 'מטריצת הרשאות', required: true, weekStart: 1, weekEnd: 2, done: false },
      { id: 'p0-2', name: 'Data Model', nameHe: 'מודל נתונים', required: true, weekStart: 1, weekEnd: 2, done: false },
      { id: 'p0-3', name: 'Deal Flow — 3 Tracks', nameHe: 'Deal Flow — 3 מסלולים', required: true, weekStart: 1, weekEnd: 2, done: false },
      { id: 'p0-4', name: 'Document Type Registry', nameHe: 'רג׳יסטרי סוגי מסמכים', required: true, weekStart: 1, weekEnd: 1, done: false },
      { id: 'p0-5', name: 'CLAUDE.md', nameHe: 'CLAUDE.md', required: true, weekStart: 1, weekEnd: 1, done: false },
      { id: 'p0-6', name: 'Setup Claude Code', nameHe: 'הגדרת Claude Code', required: true, weekStart: 1, weekEnd: 1, done: false },
      { id: 'p0-7', name: 'Testing Checklist', nameHe: 'צ׳קליסט בדיקות', required: false, weekStart: 2, weekEnd: 2, done: false },
    ],
  },
  {
    id: 1,
    name: 'Phase 1 — Foundation',
    nameHe: 'Phase 1 — יסודות',
    weekStart: 3,
    weekEnd: 5,
    color: PHASE_COLORS[1],
    tasks: [
      { id: 'p1-1', name: 'Supabase Project', nameHe: 'פרויקט Supabase', required: true, weekStart: 3, weekEnd: 3, done: false },
      { id: 'p1-2', name: 'Authentication', nameHe: 'אותנטיקציה', required: true, weekStart: 3, weekEnd: 3, done: false },
      { id: 'p1-3', name: 'UI Shell + RTL', nameHe: 'שלד UI + RTL', required: true, weekStart: 3, weekEnd: 4, done: false },
      { id: 'p1-4', name: 'Buyer Portal', nameHe: 'פורטל רוכש', required: true, weekStart: 3, weekEnd: 4, done: false },
      { id: 'p1-5', name: 'Deal CRUD + Status', nameHe: 'Deal CRUD + סטטוס', required: true, weekStart: 4, weekEnd: 4, done: false },
      { id: 'p1-6', name: 'Document Upload', nameHe: 'העלאת מסמכים', required: true, weekStart: 4, weekEnd: 5, done: false },
      { id: 'p1-7', name: 'Seed Data + Empty States', nameHe: 'נתוני דמה + מצבים ריקים', required: false, weekStart: 4, weekEnd: 4, done: false },
      { id: 'p1-8', name: 'WhatsApp Link + Nudges', nameHe: 'קישור WhatsApp + דחיפות', required: false, weekStart: 5, weekEnd: 5, done: false },
      { id: 'p1-9', name: 'Notification System', nameHe: 'מערכת התראות', required: false, weekStart: 5, weekEnd: 5, done: false },
      { id: 'p1-10', name: 'Deploy to Vercel', nameHe: 'העלאה ל-Vercel', required: true, weekStart: 5, weekEnd: 5, done: false },
    ],
  },
  {
    id: 2,
    name: 'Phase 2 — Enforcement',
    nameHe: 'Phase 2 — אכיפה',
    weekStart: 5,
    weekEnd: 9,
    color: PHASE_COLORS[2],
    tasks: [
      { id: 'p2-1', name: 'Rule Library to DB', nameHe: 'ספריית כללים ל-DB', required: true, weekStart: 5, weekEnd: 6, done: false },
      { id: 'p2-2', name: 'Blocker Engine', nameHe: 'מנוע חסימות', required: true, weekStart: 5, weekEnd: 6, done: false },
      { id: 'p2-3', name: 'Ball Owner Tracking', nameHe: 'מעקב בעלות כדור', required: true, weekStart: 6, weekEnd: 6, done: false },
      { id: 'p2-4', name: 'Daily Burn Rate', nameHe: 'קצב שריפה יומי', required: true, weekStart: 6, weekEnd: 7, done: false },
      { id: 'p2-5', name: 'Smart Alerts', nameHe: 'התראות חכמות', required: true, weekStart: 6, weekEnd: 7, done: false },
      { id: 'p2-6', name: 'Legal Loop', nameHe: 'לולאה משפטית', required: true, weekStart: 7, weekEnd: 7, done: false },
      { id: 'p2-7', name: 'Dual Authorization', nameHe: 'אישור כפול', required: true, weekStart: 7, weekEnd: 7, done: false },
      { id: 'p2-8', name: 'Spec + Construction Changes', nameHe: 'שינויי מפרט + בנייה', required: true, weekStart: 7, weekEnd: 8, done: false },
      { id: 'p2-9', name: 'Developer Dashboard', nameHe: 'דשבורד יזם', required: true, weekStart: 7, weekEnd: 8, done: false },
      { id: 'p2-10', name: 'Other Role Dashboards', nameHe: 'דשבורדים לתפקידים נוספים', required: false, weekStart: 8, weekEnd: 8, done: false },
      { id: 'p2-11', name: 'Integrity Log', nameHe: 'לוג שלמות', required: false, weekStart: 8, weekEnd: 8, done: false },
      { id: 'p2-12', name: 'Financial Track', nameHe: 'מסלול פיננסי', required: true, weekStart: 8, weekEnd: 9, done: false },
      { id: 'p2-13', name: 'Contractor Package', nameHe: 'חבילת קבלן', required: false, weekStart: 8, weekEnd: 9, done: false },
      { id: 'p2-14', name: 'DocuSign Sandbox', nameHe: 'DocuSign Sandbox', required: false, weekStart: 9, weekEnd: 9, done: false },
      { id: 'p2-15', name: 'Onboarding Flow', nameHe: 'תהליך Onboarding', required: false, weekStart: 9, weekEnd: 9, done: false },
      { id: 'p2-16', name: 'Basic Analytics', nameHe: 'אנליטיקס בסיסי', required: false, weekStart: 9, weekEnd: 9, done: false },
    ],
  },
  {
    id: 3,
    name: 'Phase 3 — Intelligence',
    nameHe: 'Phase 3 — אינטליגנציה',
    weekStart: 9,
    weekEnd: 11,
    color: PHASE_COLORS[3],
    tasks: [
      { id: 'p3-1', name: 'Claude API Integration', nameHe: 'אינטגרציית Claude API', required: true, weekStart: 9, weekEnd: 10, done: false },
      { id: 'p3-2', name: 'Anonymization Layer', nameHe: 'שכבת אנונימיזציה', required: true, weekStart: 9, weekEnd: 10, done: false },
      { id: 'p3-3', name: 'Contract Upload Flow', nameHe: 'תהליך העלאת חוזה', required: false, weekStart: 10, weekEnd: 10, done: false },
      { id: 'p3-4', name: 'Human-in-the-Loop', nameHe: 'אדם בלולאה', required: true, weekStart: 10, weekEnd: 11, done: false },
      { id: 'p3-5', name: 'Buyer AI Agent', nameHe: 'סוכן AI לרוכש', required: false, weekStart: 10, weekEnd: 11, done: false },
      { id: 'p3-6', name: 'Dependency Graph UI', nameHe: 'UI גרף תלויות', required: false, weekStart: 11, weekEnd: 11, done: false },
    ],
  },
];

export const dependencies = [
  { from: 'Phase 0', to: 'Phase 1', label: 'Architecture → Foundation' },
  { from: 'Phase 1', to: 'Phase 2', label: 'Foundation → Enforcement' },
  { from: 'Phase 2', to: 'Phase 3', label: 'Enforcement → Intelligence' },
];

export function getStats(phasesData) {
  let total = 0, required = 0, done = 0, requiredDone = 0;
  for (const phase of phasesData) {
    for (const task of phase.tasks) {
      total++;
      if (task.required) required++;
      if (task.done) {
        done++;
        if (task.required) requiredDone++;
      }
    }
  }
  return { total, required, done, requiredDone, percent: total ? Math.round((done / total) * 100) : 0 };
}
