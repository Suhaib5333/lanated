/* =====================================================================
   voices.js — plays the characters' voices.

   PRIMARY:  pre-rendered ElevenLabs clips in assets/audio/<id>.mp3
             (Lana = Jessica, pitched up a touch / Ted = Brian, deepened
             into a teddy-bear rumble / Storyteller = George).
             Pre-rendered means: no API key in the app, instant playback,
             works offline.

   FALLBACK: if a clip is missing or won't load, we use the browser's
             built-in Web Speech voices, shaped to match each character.

   To re-render after editing the story:  node tools/generate-audio.js
   ===================================================================== */

const Voices = (() => {
  const AUDIO_DIR = 'assets/audio/';
  let enabled = true;
  let current = null;          // current HTMLAudioElement
  let manifest = null;         // Set of available ids (optional)

  // load the manifest so we know which clips exist (best-effort)
  fetch(AUDIO_DIR + 'manifest.json')
    .then(r => r.ok ? r.json() : [])
    .then(list => { manifest = new Set(list); })
    .catch(() => { manifest = new Set(); });

  /* ---------- Web Speech fallback ---------- */
  let sysVoices = [];
  function refreshSys() { sysVoices = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
  if (window.speechSynthesis) {
    refreshSys();
    speechSynthesis.onvoiceschanged = refreshSys;
    setTimeout(refreshSys, 600);
  }
  const SYS = {
    lana:     { hints: ['zira', 'samantha', 'female', 'aria', 'jenny', 'hazel'], pitch: 2.0, rate: 1.12 },
    ted:      { hints: ['david', 'mark', 'male', 'daniel', 'guy', 'george'],     pitch: 0.35, rate: 0.82 },
    narrator: { hints: ['aria', 'jenny', 'samantha', 'zira', 'hazel'],           pitch: 1.05, rate: 0.96 },
  };
  function pickSys(hints) {
    const en = sysVoices.filter(v => /^en/i.test(v.lang));
    const pool = en.length ? en : sysVoices;
    for (const h of hints) { const m = pool.find(v => v.name.toLowerCase().includes(h)); if (m) return m; }
    return pool[0] || null;
  }
  function speakSys(line, onEnd) {
    if (!window.speechSynthesis) { onEnd && onEnd(); return; }
    const p = SYS[line.who] || SYS.narrator;
    const u = new SpeechSynthesisUtterance(
      line.text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').replace(/\([^)]*\)/g, ' ').trim());
    const v = pickSys(p.hints); if (v) u.voice = v;
    u.pitch = p.pitch; u.rate = p.rate;
    u.onend = u.onerror = () => onEnd && onEnd();
    speechSynthesis.speak(u);
  }

  /* ---------- main entry ---------- */
  function play(id, line, { onStart, onEnd } = {}) {
    stop();
    if (!enabled) { onStart && onStart(); setTimeout(() => onEnd && onEnd(), 50); return; }

    // if we know the clip is absent, skip straight to the fallback
    if (manifest && manifest.size && !manifest.has(id)) {
      onStart && onStart(); return speakSys(line, onEnd);
    }

    const a = new Audio(AUDIO_DIR + id + '.mp3');
    current = a;
    let started = false, done = false;
    const finish = () => { if (done || current !== a) return; done = true; current = null; onEnd && onEnd(); };
    a.onplay  = () => { started = true; onStart && onStart(); };
    a.onended = finish;
    a.onerror = () => {                       // file truly missing -> speech fallback
      if (started) return finish();
      if (current === a) current = null;
      onStart && onStart(); speakSys(line, onEnd);
    };
    const pr = a.play();
    if (pr && pr.then) pr.then(() => {}).catch(() => {
      // autoplay blocked by the browser: keep the story flowing on a timer
      // (sound will join in the moment any interaction unlocks it)
      if (started || done) return;
      onStart && onStart();
      const dur = (isFinite(a.duration) && a.duration > 0.2) ? a.duration : 3.2;
      fbTimer = setTimeout(finish, dur * 1000 + 200);
    });
  }

  let fbTimer = null;
  function stop() {
    paused = false;
    clearTimeout(fbTimer);
    if (current) { try { current.pause(); current.currentTime = 0; } catch (e) {} current = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  let paused = false;
  function pause() {
    if (current && !current.paused) { try { current.pause(); } catch (e) {} paused = true; }
    else if (window.speechSynthesis && speechSynthesis.speaking) { speechSynthesis.pause(); paused = true; }
  }
  function resume() {
    if (current && current.paused) { current.play().catch(() => {}); paused = false; }
    else if (window.speechSynthesis && speechSynthesis.paused) { speechSynthesis.resume(); paused = false; }
  }
  function isPaused() { return paused; }
  function isActive() {
    if (current && !current.paused) return true;
    return !!(window.speechSynthesis && speechSynthesis.speaking && !speechSynthesis.paused);
  }

  function setEnabled(v) { enabled = v; if (!v) stop(); }
  function isEnabled() { return enabled; }
  function isSupported() { return true; }   // audio always available

  return { play, stop, pause, resume, isPaused, isActive, setEnabled, isEnabled, isSupported };
})();
