"""
Build words.js by combining raw extracted entries (raw_entries.json)
with Hebrew translations (translations.py).
Run from /home/user/my-project: python3 scripts/build_words.py
"""
import json
import re
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'scripts' / 'raw_entries.json'
OUT = ROOT / 'words.js'

# Import translations
import sys
sys.path.insert(0, str(ROOT / 'scripts'))
from translations import TRANSLATIONS

def normalize_key(s):
    if not s:
        return ''
    s = s.lower().strip()
    s = re.sub(r'\s+', ' ', s)
    return s

def get_hebrew(en, meaning_en=None):
    key = normalize_key(en)
    if key in TRANSLATIONS:
        v = TRANSLATIONS[key]
        # If translation is dict, try to disambiguate by meaning
        if isinstance(v, dict):
            if meaning_en:
                mkey = normalize_key(meaning_en)
                for sense, heb in v.items():
                    if normalize_key(sense) in mkey or mkey in normalize_key(sense):
                        return heb
            # fallback: first value
            return next(iter(v.values()))
        return v
    return None

def js_escape(s):
    if s is None:
        return 'null'
    s = s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
    return f'"{s}"'

with open(RAW, 'r', encoding='utf-8') as f:
    entries = json.load(f)

# Build word list
out_entries = []
for e in entries:
    he = get_hebrew(e['en'], e.get('meaning_en'))
    out_entries.append({
        'en': e['en'],
        'he': he,
        'pos': e.get('pos'),
        'def_en': e.get('meaning_en'),
        'family': e.get('family'),
        'family_pos': e.get('family_pos'),
        'band': e.get('band'),
        'rec_prod': e.get('rec_prod'),
    })

# Generate words.js
lines = [
    "// ===================================================================",
    "// רשימת המילים של לני - בגרות אנגלית 4 יחידות",
    "// מבוסס על Lexical Bands הרשמיים של משרד החינוך",
    "// ===================================================================",
    "",
    f"// סה\"כ {len(out_entries)} ערכים",
    "",
    "const WORDS = [",
]

translated = 0
for e in out_entries:
    if e['he']:
        translated += 1
    parts = []
    parts.append(f'en: {js_escape(e["en"])}')
    parts.append(f'he: {js_escape(e["he"])}')
    if e['pos']: parts.append(f'pos: {js_escape(e["pos"])}')
    if e['def_en']: parts.append(f'def_en: {js_escape(e["def_en"])}')
    if e['family']: parts.append(f'family: {js_escape(e["family"])}')
    if e['family_pos']: parts.append(f'family_pos: {js_escape(e["family_pos"])}')
    if e['band']: parts.append(f'band: {js_escape(e["band"])}')
    if e['rec_prod']: parts.append(f'rec_prod: {js_escape(e["rec_prod"])}')
    lines.append('  { ' + ', '.join(parts) + ' },')

lines.append("];")
lines.append("")

with open(OUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Wrote {OUT}")
print(f"Total entries: {len(out_entries)}")
print(f"Translated to Hebrew: {translated} ({translated*100//len(out_entries)}%)")
print(f"With English definition: {sum(1 for e in out_entries if e['def_en'])}")
