/* =====================================================================
   voices.js — character voices via the Web Audio API.

   MOBILE-SAFE DESIGN (esp. iOS Safari):
   - The AudioContext is created ONLY inside the first user tap. Creating
     it earlier (at page load) can leave it permanently silent on iOS.
   - At load we only PREFETCH the raw mp3 bytes (fetch needs no context).
   - The tap unlocks the context (resume + a silent blip) and then decodes
     the prefetched bytes into AudioBuffers.
   - After that one tap, every clip plays via Web Audio with no further
     gesture, so the whole book narrates itself page-to-page.

   Falls back to Web Speech if Web Audio is unavailable.
   Re-render clips after editing the story:  node tools/generate-audio.js
   ===================================================================== */

const Voices = (() => {
  const DIR = 'assets/audio/';
  let enabled = true;
  let manifest = null;

  let ctx = null, master = null;
  const raw = {};                // id -> ArrayBuffer (prefetched, undecoded)
  const buffers = {};            // id -> AudioBuffer (decoded after unlock)
  let src = null;                // current BufferSource
  let playing = false, paused = false;
  let token = 0;
  let fbTimer = null;

  /* ---- prefetch raw bytes at load (NO AudioContext yet) ---- */
  function prefetch(id) {
    if (raw[id] || buffers[id]) return;
    fetch(DIR + id + '.mp3').then(r => r.arrayBuffer()).then(ab => { raw[id] = ab; }).catch(() => {});
  }
  fetch(DIR + 'manifest.json')
    .then(r => r.ok ? r.json() : [])
    .then(list => { manifest = new Set(list); list.forEach(prefetch); })
    .catch(() => { manifest = new Set(); });

  /* ---- context is created ONLY here, inside a user gesture ---- */
  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 1;
      master.connect(ctx.destination);
    }
    return ctx;
  }
  function unlock() {
    const c = getCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    try {                                  // silent blip fully unlocks iOS audio
      const b = c.createBuffer(1, 1, 22050);
      const s = c.createBufferSource();
      s.buffer = b; s.connect(c.destination); s.start(0);
    } catch (e) {}
    // now that we have a (gesture-created) context, decode everything
    if (manifest) manifest.forEach(id => load(id).catch(() => {}));
  }

  /* ---- decode (needs the context; only after unlock) ---- */
  function load(id) {
    if (buffers[id]) return Promise.resolve(buffers[id]);
    const c = getCtx();
    if (!c) return Promise.reject('no ctx');
    const decode = (ab) => new Promise((res, rej) => {
      const ok = (buf) => { buffers[id] = buf; delete raw[id]; res(buf); };
      const p = c.decodeAudioData(ab, ok, rej);          // callback form for old Safari
      if (p && p.then) p.then(ok, rej);
    });
    if (raw[id]) return decode(raw[id].slice(0));         // copy: decode detaches the buffer
    return fetch(DIR + id + '.mp3').then(r => r.arrayBuffer()).then(ab => decode(ab));
  }

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
    ted:      { hints: ['david', 'mark', 'male', 'daniel', 'guy', 'george'],     pitch: 0.5, rate: 1.0 },
    narrator: { hints: ['aria', 'jenny', 'samantha', 'zira', 'hazel'],           pitch: 1.05, rate: 0.96 },
  };
  function speakSys(line, onEnd) {
    if (!window.speechSynthesis) { onEnd && onEnd(); return; }
    const p = SYS[line.who] || SYS.narrator;
    const en = sysVoices.filter(v => /^en/i.test(v.lang));
    const pool = en.length ? en : sysVoices;
    const u = new SpeechSynthesisUtterance(
      line.text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').replace(/\([^)]*\)/g, ' ').trim());
    for (const h of p.hints) { const m = pool.find(v => v.name.toLowerCase().includes(h)); if (m) { u.voice = m; break; } }
    u.pitch = p.pitch; u.rate = p.rate;
    u.onend = u.onerror = () => onEnd && onEnd();
    speechSynthesis.speak(u);
  }

  /* ---------- main entry ---------- */
  function play(id, line, { onStart, onEnd } = {}) {
    const my = ++token;
    stopInternal();
    if (!enabled) { onStart && onStart(); fbTimer = setTimeout(() => onEnd && onEnd(), 50); return; }
    if (manifest && manifest.size && !manifest.has(id)) { onStart && onStart(); return speakSys(line, onEnd); }

    const c = getCtx();
    if (!c) { onStart && onStart(); return speakSys(line, onEnd); }
    if (c.state === 'suspended') c.resume();

    load(id).then(buf => {
      if (my !== token) return;
      const s = c.createBufferSource();
      s.buffer = buf;
      const g = c.createGain(); g.gain.value = 1;
      s.connect(g); g.connect(master);
      let done = false;
      const finish = () => { if (done || my !== token) return; done = true; playing = false; src = null; onEnd && onEnd(); };
      s.onended = finish;
      src = s; playing = true; paused = false;
      onStart && onStart();
      try { s.start(0); } catch (e) { finish(); }
    }).catch(() => {
      if (my !== token) return;
      onStart && onStart(); speakSys(line, onEnd);
    });
  }

  function stopInternal() {
    clearTimeout(fbTimer);
    if (src) { try { src.onended = null; src.stop(0); } catch (e) {} src = null; }
    playing = false; paused = false;
    if (window.speechSynthesis) speechSynthesis.cancel();
  }
  function stop() { token++; stopInternal(); }

  function pause() {
    if (playing && !paused && ctx) { ctx.suspend(); paused = true; }
    else if (window.speechSynthesis && speechSynthesis.speaking) { speechSynthesis.pause(); paused = true; }
  }
  function resume() {
    if (playing && paused && ctx) { ctx.resume(); paused = false; }
    else if (window.speechSynthesis && speechSynthesis.paused) { speechSynthesis.resume(); paused = false; }
  }
  function isPaused() { return paused; }
  function isActive() {
    if (playing && !paused) return true;
    return !!(window.speechSynthesis && speechSynthesis.speaking && !speechSynthesis.paused);
  }

  function setEnabled(v) { enabled = v; if (!v) stop(); else if (master) master.gain.value = 1; }
  function isEnabled() { return enabled; }
  function isSupported() { return true; }

  return { play, stop, pause, resume, isPaused, isActive, unlock, setEnabled, isEnabled, isSupported };
})();
