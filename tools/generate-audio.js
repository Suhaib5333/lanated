/* =====================================================================
   generate-audio.js  —  render every line of the storybook to an MP3
   with ElevenLabs, then apply a gentle character pitch nudge with
   ffmpeg (Lana -> a touch higher / younger, Ted -> deeper teddy-bear).

   Run:  node tools/generate-audio.js
   Key:  read from env ELEVENLABS_API_KEY, or from tools/.key  (git-ignored)

   Output: assets/audio/<sceneKey>-<lineIndex>.mp3
   ===================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'audio');
fs.mkdirSync(OUT, { recursive: true });

/* --- API key (never committed) --- */
const KEY = process.env.ELEVENLABS_API_KEY ||
  (fs.existsSync(path.join(__dirname, '.key'))
    ? fs.readFileSync(path.join(__dirname, '.key'), 'utf8').trim() : '');
if (!KEY) { console.error('No API key. Set ELEVENLABS_API_KEY or create tools/.key'); process.exit(1); }

/* --- load SCENES out of the browser scripts --- */
function loadScenes() {
  const code =
    fs.readFileSync(path.join(ROOT, 'js', 'characters.js'), 'utf8') + '\n' +
    fs.readFileSync(path.join(ROOT, 'js', 'story.js'), 'utf8') + '\n' +
    'this.__SCENES = SCENES;';
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return ctx.__SCENES;
}

/* --- voice casting --- */
const VOICES = {
  lana:     { id: 'cgSgspJ2msm6clMCkdW9', stability: 0.32, similarity: 0.80, style: 0.50, pitch: 1.15 }, // Jessica
  ted:      { id: 'nPczCjzI2devNBz1zQrb', stability: 0.55, similarity: 0.85, style: 0.18, pitch: 0.84 }, // Brian
  narrator: { id: 'JBFqnCBsd6RMkjVDRZzb', stability: 0.50, similarity: 0.80, style: 0.30, pitch: 1.00 }, // George
};
const MODEL = 'eleven_multilingual_v2';

/* tidy the text for natural speech (drop emoji + stage directions) */
function clean(text) {
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\bz{2,}\b/gi, ' ')   // strip standalone "zzz" sleepy sounds, NOT the zz in "pizza"
    .replace(/\.{3,}/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function tts(voice, text, rawPath) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({
      text, model_id: MODEL,
      voice_settings: { stability: voice.stability, similarity_boost: voice.similarity, style: voice.style, use_speaker_boost: true }
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf[0] === 0x7b) throw new Error('got JSON not audio: ' + buf.toString('utf8').slice(0, 200));
  fs.writeFileSync(rawPath, buf);
  return buf.length;
}

function pitchAndPolish(voice, rawPath, finalPath) {
  const filters = [];
  if (Math.abs(voice.pitch - 1) > 0.001) filters.push(`rubberband=pitch=${voice.pitch}`);
  filters.push('loudnorm=I=-16:TP=-1.5:LRA=11');   // even, comfortable volume
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y',
    '-i', rawPath, '-af', filters.join(','), '-codec:a', 'libmp3lame', '-q:a', '4', finalPath]);
}

(async () => {
  const SCENES = loadScenes();
  let total = 0, ok = 0;
  const manifest = [];
  for (const sc of SCENES) {
    sc.lines.forEach((l, idx) => manifest.push({ key: sc.key, idx, who: l.who, text: l.text }));
  }
  total = manifest.length;
  console.log(`Rendering ${total} lines...\n`);

  // optional CLI filter: `node generate-audio.js pizza end-0` renders only those
  const only = process.argv.slice(2);
  const force = process.env.FORCE === '1' || only.length > 0;

  for (const m of manifest) {
    const id = `${m.key}-${m.idx}`;
    if (only.length && !only.some(o => id === o || m.key === o)) continue;
    const voice = VOICES[m.who] || VOICES.narrator;
    const txt = clean(m.text);
    const raw = path.join(OUT, `_raw_${id}.mp3`);
    const out = path.join(OUT, `${id}.mp3`);
    if (!force && fs.existsSync(out)) { ok++; continue; }
    process.stdout.write(`  ${m.key}-${m.idx} [${m.who}]  "${txt.slice(0, 42)}..."  `);
    try {
      await tts(voice, txt, raw);
      pitchAndPolish(voice, raw, out);
      fs.unlinkSync(raw);
      const kb = (fs.statSync(out).size / 1024).toFixed(0);
      console.log(`OK ${kb}kb`);
      ok++;
    } catch (e) {
      console.log('FAIL ' + e.message);
    }
    await new Promise(r => setTimeout(r, 250)); // be polite to the API
  }

  // write a manifest the app can use to know which audio exists
  fs.writeFileSync(path.join(OUT, 'manifest.json'),
    JSON.stringify(manifest.map(m => `${m.key}-${m.idx}`), null, 0));
  console.log(`\nDone: ${ok}/${total} clips in assets/audio/`);
})();
