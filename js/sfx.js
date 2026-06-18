/* =====================================================================
   sfx.js — a big pile of playful sound effects, all synthesised live
   with the Web Audio API. No files, works offline, never blocks the page.

   Volumes are kept gentle and child-friendly. Everything is tied to the
   same on/off as the voices (the 🔊 button).
   ===================================================================== */

const SFX = (() => {
  let ctx = null;
  let master = null;
  let enabled = true;

  function ensure() {
    if (!enabled) return false;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  const now = () => ctx.currentTime;

  /* --- tiny building blocks --- */
  function tone(freq, t0, dur, { type = 'sine', gain = 0.25, glideTo = null, attack = 0.005 } = {}) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(t0, dur, { type = 'bandpass', freq = 1200, q = 0.8, gain = 0.2, glideTo = null } = {}) {
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t0); f.Q.value = q;
    if (glideTo) f.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur);
  }
  const N = (lo, hi) => lo + Math.random() * (hi - lo);

  /* --- the effects --- */
  const FX = {
    click()  { if (!ensure()) return; const t = now(); tone(680, t, 0.09, { type: 'triangle', gain: 0.18, glideTo: 920 }); },
    back()   { if (!ensure()) return; const t = now(); tone(520, t, 0.10, { type: 'triangle', gain: 0.18, glideTo: 360 }); },
    pop()    { if (!ensure()) return; const t = now(); tone(420, t, 0.10, { type: 'sine', gain: 0.22, glideTo: 840 }); },
    blip(f = 1600) { if (!ensure()) return; tone(f, now(), 0.06, { type: 'sine', gain: 0.10 }); },

    turn() { // page flip "fwip"
      if (!ensure()) return; const t = now();
      noise(t, 0.26, { type: 'bandpass', freq: 800, q: 0.7, gain: 0.16, glideTo: 2600 });
      tone(300, t, 0.18, { type: 'sine', gain: 0.08, glideTo: 600 });
    },
    sparkle() {
      if (!ensure()) return; const t = now();
      for (let i = 0; i < 4; i++) tone(N(1400, 2600), t + i * 0.06, 0.18, { type: 'sine', gain: 0.10 });
    },
    chime() { // gentle ascending arpeggio
      if (!ensure()) return; const t = now();
      [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.10, 0.5, { type: 'triangle', gain: 0.14 }));
    },
    start() {
      if (!ensure()) return; const t = now();
      [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.08, 0.5, { type: 'triangle', gain: 0.16 }));
      this.sparkle();
    },
    cheer() { // finale: big happy arpeggio + sparkles
      if (!ensure()) return; const t = now();
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, t + i * 0.07, 0.6, { type: 'triangle', gain: 0.16 }));
      for (let i = 0; i < 10; i++) tone(N(1500, 3000), t + 0.3 + i * 0.05, 0.25, { type: 'sine', gain: 0.08 });
    },
    kick() { // jujitsu thud + hi-ya zip
      if (!ensure()) return; const t = now();
      tone(150, t, 0.16, { type: 'sine', gain: 0.3, glideTo: 60 });
      noise(t, 0.12, { type: 'lowpass', freq: 400, gain: 0.22 });
      tone(900, t + 0.08, 0.12, { type: 'square', gain: 0.10, glideTo: 1500 });
    },
    chomp() { // nom nom
      if (!ensure()) return; const t = now();
      noise(t,        0.10, { type: 'lowpass', freq: 500, gain: 0.22 });
      noise(t + 0.16, 0.10, { type: 'lowpass', freq: 420, gain: 0.22 });
    },
    boing() {
      if (!ensure()) return; const t = now();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(600, t);
      o.frequency.setValueAtTime(300, t + 0.08);
      o.frequency.setValueAtTime(520, t + 0.16);
      o.frequency.setValueAtTime(260, t + 0.24);
      g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.42);
    },
    dreamy() { // bedtime shimmer
      if (!ensure()) return; const t = now();
      [784, 988, 1175].forEach((f, i) => tone(f, t + i * 0.18, 0.9, { type: 'sine', gain: 0.10 }));
    },
    yum() { this.chomp(); setTimeout(() => this.sparkle(), 320); },
  };

  /* themed sound when a page opens */
  const SCENE = {
    cover: 'chime', best: 'sparkle', jujitsu: 'kick', pizza: 'chomp',
    reading: 'chime', sleep: 'dreamy', gym: 'boing', end: 'cheer',
  };
  function scene(key) { const fn = SCENE[key]; if (fn && FX[fn]) FX[fn](); }

  function setEnabled(v) { enabled = v; if (!v && ctx) master.gain.value = 0; else if (master) master.gain.value = 0.5; }
  function isEnabled() { return enabled; }
  function unlock() { ensure(); } // call on first user gesture

  return Object.assign(FX, { scene, setEnabled, isEnabled, unlock });
})();
