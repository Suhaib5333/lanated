/* =====================================================================
   app.js — the storybook engine.
   Renders scenes, plays the dialogue with character voices, handles
   Next/Back navigation, the cover, the finale confetti, and the
   "real photos" reveal.
   ===================================================================== */

const $ = (sel) => document.querySelector(sel);

const App = {
  i: 0,                 // current scene index
  lineIdx: -1,          // current spoken line
  playing: false,
  started: false,
  autoAdvance: true,    // default: read & turn pages automatically
  _autoTimer: null,

  els: {},

  init() {
    this.els = {
      scene:   $('#scene'),
      art:     $('#art'),
      talk:    $('#talk'),
      dots:    $('#dots'),
      next:    $('#btnNext'),
      back:    $('#btnBack'),
      replay:  $('#btnReplay'),
      play:    $('#btnPlay'),
      auto:    $('#btnAuto'),
      sound:   $('#btnSound'),
      photos:  $('#btnPhotos'),
      cover:   $('#cover'),
      sky:     $('#sky'),
    };

    this.buildSky();
    this.buildDots();

    // charming mini portrait on the cover
    const cov = $('#coverArt');
    if (cov) cov.innerHTML =
      `<g class="idle-bob">${lana({ x: 130, y: 290, s: 0.85, top: '#FF6FA5', bottom: '#6CC4F5' })}</g>
       <g class="idle-bob slow">${ted({ x: 250, y: 290, s: 0.8, arms: 'up' })}</g>`;

    this.els.next.addEventListener('click', () => { SFX.click(); this.go(this.i + 1); });
    this.els.back.addEventListener('click', () => { SFX.back(); this.go(this.i - 1); });
    this.els.replay.addEventListener('click', () => { SFX.click(); this.playScene(); });
    this.els.play.addEventListener('click', () => { SFX.click(); this.togglePlay(); });
    this.els.auto.addEventListener('click', () => { SFX.click(); this.toggleAuto(); });
    this.els.sound.addEventListener('click', () => this.toggleSound());
    this.els.photos.addEventListener('click', () => { SFX.sparkle(); this.showPhotos(); });
    $('#startBtn').addEventListener('click', () => this.start());
    $('#photoClose').addEventListener('click', () => { SFX.click(); $('#photoModal').style.display = 'none'; });

    // keyboard for grown-ups
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.go(this.i + 1);
      if (e.key === 'ArrowLeft')  this.go(this.i - 1);
      if (e.key === ' ')          { e.preventDefault(); this.playScene(); }
    });

    if (!Voices.isSupported()) this.els.sound.classList.add('is-off');

    this.render(false);   // render cover behind overlay

    // ONE-TAP-THEN-HANDS-FREE: one tap anywhere on the cover unlocks audio
    // and starts the fully automatic, narrated flow to the end.
    const begin = () => this.userBegin();
    this.els.cover.addEventListener('click', begin);
    document.addEventListener('keydown', (e) => { if (!this.started) begin(); });

    // If the browser happens to allow gesture-free autoplay, start with
    // ZERO clicks. If it blocks autoplay (most phones/laptops do), we wait
    // on the cover for that one tap — we never run the story silently.
    setTimeout(() => this.tryAutoBegin(), 300);
  },

  buildSky() {
    const items = ['⭐','💛','🌸','☁️','🩷','✨','🌈','🧸','💫','🩵'];
    let html = '';
    for (let i = 0; i < 16; i++) {
      const left = Math.round((i * 61) % 100);
      const d = 16 + (i % 6) * 4;
      const delay = -(i * 2.3).toFixed(1);
      const s = 22 + (i % 4) * 12;
      html += `<span style="left:${left}%;--d:${d}s;--delay:${delay}s;--s:${s}px">${items[i % items.length]}</span>`;
    }
    this.els.sky.innerHTML = html;
  },

  buildDots() {
    this.els.dots.innerHTML = SCENES.map((_, n) =>
      `<b data-n="${n}" title="Page ${n + 1}"></b>`).join('');
    this.els.dots.querySelectorAll('b').forEach(b =>
      b.addEventListener('click', () => this.go(+b.dataset.n)));
  },

  // Probe whether the browser will let us play audio without a tap.
  // If yes -> start hands-free. If no -> stay on the cover and wait (no
  // silent page-flipping).
  tryAutoBegin() {
    if (this.started) return;
    const a = new Audio('assets/audio/cover-0.mp3');
    const p = a.play();
    if (!p || !p.then) return;                 // can't probe -> wait for a tap
    p.then(() => {                             // autoplay allowed -> just start
      try { a.pause(); } catch (e) {}
      SFX.unlock(); Voices.unlock();
      this.beginStory();
    }).catch(() => {                           // blocked -> invite the one tap
      this.els.cover.classList.add('awaiting-tap');
    });
  },

  // The single user tap: unlock BOTH audio engines (inside the gesture, so
  // every later page can play with no further taps), then start.
  userBegin() {
    SFX.unlock(); Voices.unlock();
    if (this.started) return;
    SFX.start();
    this.beginStory();
  },

  // Closes the cover immediately and rolls the story to the end on its own.
  beginStory() {
    if (this._begun) return;
    this._begun = true;
    this.started = true;
    clearTimeout(this._coverTimer);
    if (this._coverAudio) { try { this._coverAudio.pause(); } catch (e) {} this._coverAudio = null; }
    this.els.cover.style.display = 'none';     // <- popup closes right away
    this.go(1);                                // -> auto-reads & auto-advances to the end
  },

  start() { this.userBegin(); },               // legacy alias

  go(n) {
    n = Math.max(0, Math.min(SCENES.length - 1, n));
    if (n === this.i && this.started) return;
    clearTimeout(this._autoTimer);
    Voices.stop();
    if (this.started) SFX.turn();          // page-flip whoosh
    const forward = n >= this.i;
    this.els.scene.classList.remove('flip-in');
    this.els.scene.classList.add('flip-out');
    setTimeout(() => {
      this.i = n;
      this.render(true);
    }, forward ? 170 : 90);
  },

  render(animate) {
    const sc = SCENES[this.i];

    // illustration (tap it to hear the page again)
    this.els.art.innerHTML =
      `<svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">${sc.art()}</svg>`;
    this.els.art.onclick = () => this.playScene();

    // the Next button stops glowing until this page is finished reading
    this.els.next.classList.remove('ready');

    // dialogue (rendered hidden; revealed as spoken)
    this.els.talk.innerHTML =
      (sc.heading ? `<h2 class="scene-heading">${sc.heading}</h2>` : '') +
      sc.lines.map((l, idx) => `
        <div class="bubble ${l.who}" data-idx="${idx}" style="animation-delay:${idx * 90}ms">
          <div class="avatar">${this.face(l.who)}<div class="eq"><i></i><i></i><i></i></div></div>
          <div class="body"><span class="who">${this.name(l.who)}</span>${l.text}</div>
        </div>`).join('');

    // let parents tap a bubble to hear that line again
    this.els.talk.querySelectorAll('.bubble').forEach(b =>
      b.addEventListener('click', () => this.speakOne(+b.dataset.idx)));

    // dots + buttons
    this.els.dots.querySelectorAll('b').forEach((b, n) => b.classList.toggle('on', n === this.i));
    this.els.back.disabled = this.i <= 0;
    this.els.next.disabled = this.i >= SCENES.length - 1;
    this.els.next.innerHTML = this.i >= SCENES.length - 1 ? 'The End 🎉' : 'Next ▶';

    if (animate) {
      this.els.scene.classList.remove('flip-out');
      this.els.scene.classList.add('flip-in');
    }

    if (sc.finale) this.confetti();

    // themed sound as the page opens, then auto-read it aloud
    if (this.started) {
      setTimeout(() => SFX.scene(sc.key), animate ? 180 : 90);
      setTimeout(() => this.playScene(), animate ? 340 : 220);
    }
  },

  face(who) { return who === 'ted' ? '🧸' : who === 'narrator' ? '📖' : '🌟'; },
  name(who) { return who === 'ted' ? 'Ted' : who === 'narrator' ? 'Story' : 'Lana'; },

  /* play every line of the current scene in order */
  playScene() {
    Voices.stop();
    this.clearSpeaking();
    const sc = SCENES[this.i];
    let k = 0;
    const next = () => {
      if (this.i !== this._playingScene) return;
      if (k >= sc.lines.length) {            // finished reading the page
        this.clearSpeaking();
        const isLast = this.i >= SCENES.length - 1;
        if (!isLast) this.els.next.classList.add('ready');
        if (this.autoAdvance && !isLast) {
          // keep the story rolling page-to-page — stays "playing", no pause
          const finished = this.i;
          clearTimeout(this._autoTimer);
          this._autoTimer = setTimeout(() => {
            if (this.autoAdvance && this.i === finished && !Voices.isPaused())
              this.go(this.i + 1);          // -> render() auto-reads the next page
          }, 450);
        } else {
          this.setPlayBtn(false);           // manual mode, or the book is finished
        }
        return;
      }
      this.highlight(k);
      Voices.play(`${sc.key}-${k}`, sc.lines[k], {
        onEnd: () => { this.clearSpeaking(); k++; setTimeout(next, 280); }
      });
    };
    this._playingScene = this.i;
    this.setPlayBtn(true);
    next();
  },

  togglePlay() {
    if (Voices.isPaused())  { Voices.resume(); this.setPlayBtn(true);  return; }
    if (Voices.isActive())  { clearTimeout(this._autoTimer); Voices.pause(); this.setPlayBtn(false); return; }
    this.playScene();       // nothing playing → start this page
  },

  toggleAuto() {
    this.autoAdvance = !this.autoAdvance;
    this.els.auto.classList.toggle('is-off', !this.autoAdvance);
    document.getElementById('autoLabel').innerHTML = this.autoAdvance ? 'Auto&nbsp;On' : 'Auto&nbsp;Off';
    clearTimeout(this._autoTimer);
    // if turning it on while a finished page is just sitting there, keep going
    if (this.autoAdvance && this.started && this.i < SCENES.length - 1
        && !Voices.isActive() && !Voices.isPaused()) {
      this._autoTimer = setTimeout(() => {
        if (this.autoAdvance && !Voices.isActive()) this.go(this.i + 1);
      }, 700);
    }
  },
  setPlayBtn(playing) {
    if (!this.els.play) return;
    this.els.play.classList.toggle('paused', !playing);
    this.els.play.innerHTML = playing ? '⏸ Pause' : '▶ Play';
  },

  /* speak a single tapped line */
  speakOne(idx) {
    Voices.stop();
    this.clearSpeaking();
    this.highlight(idx);
    const sc = SCENES[this.i];
    Voices.play(`${sc.key}-${idx}`, sc.lines[idx], { onEnd: () => this.clearSpeaking() });
  },

  highlight(idx) {
    this.clearSpeaking();
    SFX.pop();   // little pop as each speech bubble lights up
    const b = this.els.talk.querySelector(`.bubble[data-idx="${idx}"]`);
    if (b) { b.classList.add('speaking'); b.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  },
  clearSpeaking() {
    this.els.talk.querySelectorAll('.bubble.speaking').forEach(b => b.classList.remove('speaking'));
  },

  toggleSound() {
    const on = !Voices.isEnabled();
    Voices.setEnabled(on);
    SFX.setEnabled(on);
    this.els.sound.classList.toggle('is-off', !on);
    this.els.sound.textContent = on ? '🔊' : '🔇';
    if (on) { SFX.unlock(); SFX.blip(1200); this.playScene(); }
    else    { this.clearSpeaking(); this.setPlayBtn(false); }
  },

  showPhotos() {
    $('#photoModal').style.display = 'grid';
  },

  confetti() {
    const c = $('#confetti');
    const colors = ['#FF7E91','#FFD23F','#54D6A6','#79C2FF','#B79CED','#FF9CC9'];
    let html = '';
    for (let i = 0; i < 90; i++) {
      const left = Math.random ? 0 : 0; // Math.random is unavailable in some sandboxes; use deterministic spread
      const x = (i * 37) % 100;
      const cd = 2.4 + (i % 5) * 0.5;
      const delay = (i % 10) * 0.12;
      const col = colors[i % colors.length];
      const rot = (i * 23) % 360;
      html += `<i style="left:${x}%;background:${col};--cd:${cd}s;--cdelay:${delay}s;transform:rotate(${rot}deg)"></i>`;
    }
    c.innerHTML = html;
    setTimeout(() => { c.innerHTML = ''; }, 6000);
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
