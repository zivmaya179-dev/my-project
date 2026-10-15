// Generates assets/siren.wav: a two-second, seamlessly looping two-tone siren.
// Run with: node tools/make-siren.js
const fs = require('fs');
const path = require('path');

const RATE = 22050;
const SECONDS = 2;
const SWEEP = 0.5; // seconds per rise-and-fall cycle
const LO = 700;
const HI = 1300;

const frames = RATE * SECONDS;
const pcm = Buffer.alloc(frames * 2);

let phase = 0;
for (let i = 0; i < frames; i++) {
  const t = i / RATE;
  // Triangle wave between 0 and 1 over each SWEEP, so the loop point matches.
  const x = (t % SWEEP) / SWEEP;
  const tri = x < 0.5 ? x * 2 : (1 - x) * 2;
  const freq = LO + (HI - LO) * tri;
  phase += (2 * Math.PI * freq) / RATE;
  // Soft-clipped sine reads louder than a pure sine at the same peak level.
  const s = Math.tanh(Math.sin(phase) * 1.8) / Math.tanh(1.8);
  pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(s * 32000))), i * 2);
}

const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16); // fmt chunk size
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(1, 22); // mono
header.writeUInt32LE(RATE, 24);
header.writeUInt32LE(RATE * 2, 28); // byte rate
header.writeUInt16LE(2, 32); // block align
header.writeUInt16LE(16, 34); // bits per sample
header.write('data', 36);
header.writeUInt32LE(pcm.length, 40);

const out = path.join(__dirname, '..', 'assets', 'siren.wav');
fs.writeFileSync(out, Buffer.concat([header, pcm]));
console.log('wrote', out, Buffer.concat([header, pcm]).length, 'bytes');
