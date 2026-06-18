/* =====================================================================
   story.js — the book content.
   Adapted faithfully from Lana's real scrapbook "Ted's Active Week
   with Lana": jujitsu, chicken pizza, bedtime reading, cuddles, and
   gymnastics. Each page = a full illustrated scene + a little
   back-and-forth chat between Lana and Ted.
   ===================================================================== */

/* outfit presets so Lana stays recognisable but changes clothes */
const GI      = { top: '#FFFFFF', bottom: '#EFEFF4', belt: '#E6E6EE', stripes: 3 };   // gi + white belt, 3 stripes
const PJS     = { top: '#FFD7EC', bottom: '#FFC0E0' };                    // pyjamas
const LEO     = { top: '#FF8AB5', bottom: '#FF8AB5' };                    // leotard
const PLAY    = { top: '#FF6FA5', bottom: '#6CC4F5' };                    // everyday
const TED_PJS = { base: '#C24B5E', stripe: '#FBE3DC' };

/* --- shared background helpers (unique gradient ids per scene) --- */
function bg(id, c1, c2) {
  return `
   <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
     <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
   </linearGradient></defs>
   <rect width="1000" height="700" fill="url(#${id})"/>`;
}
const floaties = (kind) => Array.from({ length: 7 }, (_, i) => {
  const x = 70 + i * 130, y = 70 + (i % 3) * 60, r = 14 + (i % 3) * 6;
  return kind === 'heart' ? heart(x, y, r, 'rgba(255,126,145,.55)') : star(x, y, r, 'rgba(255,210,63,.8)');
}).join('');

/* ===================================================================== */
const SCENES = [
  /* ---------- 0 : COVER ---------- */
  {
    key: 'cover', cover: true,
    heading: '',
    art: () => `
      ${bg('g0', '#FFE6F2', '#DCEBFF')}
      <path d="M0 560 Q250 500 500 560 T1000 560 V700 H0 Z" fill="#CFEFD8"/>
      <path d="M0 600 Q250 560 500 600 T1000 600 V700 H0 Z" fill="#B6E6C6"/>
      ${[120, 300, 700, 880].map((x, i) => `
        <g transform="translate(${x} ${600 - (i % 2) * 10})">
          <rect x="-3" y="-34" width="6" height="34" fill="#5BAE6E"/>
          ${heart(0, -42, 16, ['#FF7E91', '#FFD23F', '#B79CED', '#79C2FF'][i])}
        </g>`).join('')}
      <g opacity=".9">
        <path d="M180 240 a190 190 0 0 1 380 0" fill="none" stroke="#FF7E91" stroke-width="22"/>
        <path d="M210 240 a160 160 0 0 1 320 0" fill="none" stroke="#FFD23F" stroke-width="22"/>
        <path d="M240 240 a130 130 0 0 1 260 0" fill="none" stroke="#79C2FF" stroke-width="22"/>
      </g>
      <g class="idle-bob">${lana({ x: 420, y: 600, s: 1.45, ...PLAY })}</g>
      <g class="idle-bob slow">${ted({ x: 620, y: 600, s: 1.35 })}</g>
      ${star(150, 150, 22)} ${star(860, 120, 26)} ${heart(820, 320, 20)} ${star(90, 420, 18)}
    `,
    lines: [
      { who: 'narrator', text: "Ted's Active Week with Lana. A true story about a brave little girl and her very best friend." }
    ]
  },

  /* ---------- 1 : THE BEST WEEK ---------- */
  {
    key: 'best', heading: 'The Best Week Ever!',
    art: () => `
      ${bg('g1', '#FFF1D6', '#FFE0EE')}
      ${floaties('heart')}
      <circle cx="500" cy="250" r="120" fill="#FFE9A8" opacity=".7"/>
      <path d="M0 620 Q500 560 1000 620 V700 H0 Z" fill="#BFE9CC"/>
      <g class="idle-bob">${lana({ x: 400, y: 610, s: 1.45, ...PLAY })}</g>
      <g class="idle-bob slow">${ted({ x: 610, y: 610, s: 1.3, arms: 'up' })}</g>
      ${heart(500, 360, 30)} ${heart(470, 330, 16)} ${heart(540, 340, 18)}
    `,
    lines: [
      { who: 'lana', text: "Ted! Ted! Guess what — this was the BEST week ever!" },
      { who: 'ted',  text: "Hee hee! I had so much fun with you, Lana. What did we do?" },
      { who: 'lana', text: "We did EVERYTHING together. Are you ready to remember it all?" },
      { who: 'ted',  text: "Yes please! Let's turn the page and see!" }
    ]
  },

  /* ---------- 2 : JUJITSU ---------- */
  {
    key: 'jujitsu', heading: 'Tuesday — Jujitsu Class!',
    art: () => `
      ${bg('g2', '#FFE7D6', '#FFD3C2')}
      <rect x="0" y="430" width="1000" height="270" fill="#E7B98E"/>
      <rect x="0" y="430" width="1000" height="16" fill="#D9A472"/>
      <rect x="120" y="470" width="760" height="210" rx="24" fill="#9CD3F0" opacity=".55"/>
      <rect x="120" y="470" width="760" height="210" rx="24" fill="none" stroke="#fff" stroke-width="8"/>
      <!-- banner -->
      <rect x="250" y="66" width="500" height="78" rx="18" fill="#7A4DD0"/>
      <rect x="250" y="66" width="500" height="78" rx="18" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>
      <text x="500" y="117" text-anchor="middle" font-family="Baloo 2, sans-serif"
            font-size="38" font-weight="800" fill="#fff">Jujitsu Academy</text>
      <g class="idle-bob">${lana({ x: 380, y: 600, s: 1.45, ...GI })}</g>
      <g class="idle-bob slow">${ted({ x: 630, y: 600, s: 1.2, arms: 'up' })}</g>
      ${star(180, 220, 20)} ${star(820, 200, 22)}
      <!-- Ted's beginner white belt -->
      <rect x="588" y="494" width="86" height="12" rx="6" fill="#EDEDF3" stroke="#C9C9D6" stroke-width="1.5"/>
    `,
    lines: [
      { who: 'narrator', text: "On Tuesday, Lana took Ted to her jujitsu class and introduced him to her coach." },
      { who: 'lana', text: "This is my coach, Ted! Today I'll teach you some cool moves." },
      { who: 'ted',  text: "Ooh! Will I get a white belt with three stripes like yours? Hi-YA!" },
      { who: 'lana', text: "Hee hee, almost! Practise lots and you'll earn your stripes too!" },
      { who: 'ted',  text: "Look at me! I learned a brand new move! That was tough AND fun!" }
    ]
  },

  /* ---------- 3 : PIZZA ---------- */
  {
    key: 'pizza', heading: 'Yummy Chicken Pizza!',
    art: () => `
      ${bg('g3', '#FFF4DA', '#FFE1B8')}
      ${floaties('star')}
      <rect x="0" y="520" width="1000" height="180" fill="#E2A36B"/>
      <rect x="0" y="500" width="1000" height="26" rx="10" fill="#C9874F"/>
      <!-- pizza on a plate -->
      <g transform="translate(500 470)">
        <ellipse cx="0" cy="14" rx="150" ry="40" fill="rgba(0,0,0,.12)"/>
        <ellipse cx="0" cy="0" rx="150" ry="46" fill="#fff"/>
        <ellipse cx="0" cy="-6" rx="128" ry="40" fill="#F2C063"/>
        <ellipse cx="0" cy="-8" rx="112" ry="34" fill="#E94F37" opacity=".85"/>
        <ellipse cx="0" cy="-10" rx="104" ry="30" fill="#FFD27A"/>
        ${[-70, -20, 35, 80, -45, 15, 60].map((px, i) =>
           `<circle cx="${px}" cy="${-12 + (i % 2) * 14}" r="9" fill="#C0431F"/>`).join('')}
        ${[-50, 10, 55].map(px => `<circle cx="${px}" cy="-4" r="6" fill="#7BB661"/>`).join('')}
      </g>
      <g class="idle-bob">${lana({ x: 280, y: 640, s: 1.3, ...PLAY })}</g>
      <g class="idle-bob slow">${ted({ x: 720, y: 640, s: 1.18 })}</g>
      ${star(160, 160, 22)} ${star(840, 180, 20)}
    `,
    lines: [
      { who: 'narrator', text: "After a tough and fun workout, Lana and Ted shared a chicken pizza!" },
      { who: 'lana', text: "We worked SO hard. I'm super hungry. Pizza time, Ted!" },
      { who: 'ted',  text: "Chicken pizza?! That's my favourite! Can I have the biggest slice?" },
      { who: 'lana', text: "Of course! We can share. One for you, one for me." },
      { who: 'ted',  text: "Mmm... nom nom nom... YUM! Best pizza in the whole world!" }
    ]
  },

  /* ---------- 4 : BEDTIME READING ---------- */
  {
    key: 'reading', heading: 'A Bedtime Story',
    art: () => `
      ${bg('g4', '#EDE3FF', '#FBDDEE')}
      <rect x="0" y="540" width="1000" height="160" fill="#C9A6E8"/>
      <ellipse cx="500" cy="560" rx="360" ry="60" fill="#B98FE0"/>
      <!-- lamp glow -->
      <circle cx="820" cy="230" r="130" fill="#FFE9A8" opacity=".5"/>
      <rect x="812" y="250" width="16" height="290" fill="#9A6BC4"/>
      <path d="M770 250 h100 l-18 -60 h-64 z" fill="#FFC24B"/>
      <!-- bookshelf -->
      <rect x="60" y="300" width="150" height="240" rx="10" fill="#A87DD6"/>
      ${[0, 1, 2].map(r => [0, 1, 2, 3].map(c =>
        `<rect x="${74 + c * 33}" y="${312 + r * 74}" width="26" height="58" rx="4"
               fill="${['#FF7E91','#FFD23F','#54D6A6','#79C2FF'][(r + c) % 4]}"/>`).join('')).join('')}
      <g class="idle-bob">${lana({ x: 400, y: 560, s: 1.4, ...PJS })}</g>
      <g class="idle-bob slow">${ted({ x: 610, y: 560, s: 1.18 })}</g>
      <!-- the favourite book -->
      <g transform="translate(500 470) rotate(-6)">
        <rect x="-46" y="-34" width="92" height="64" rx="6" fill="#fff" stroke="#FFB0C8" stroke-width="4"/>
        <line x1="0" y1="-34" x2="0" y2="30" stroke="#FFB0C8" stroke-width="4"/>
        ${heart(-24, -6, 12)} ${star(24, -4, 12)}
      </g>
      ${star(720, 150, 18)} ${star(160, 180, 16)}
    `,
    lines: [
      { who: 'narrator', text: "Before bedtime, Lana read Ted his favourite book." },
      { who: 'lana', text: "Snuggle in, Ted. I'll read you your favourite story tonight." },
      { who: 'ted',  text: "Yay! The one about the brave little bear? I love that one!" },
      { who: 'lana', text: "'Once upon a time, there was a teddy who was very, very loved...'" },
      { who: 'ted',  text: "That teddy sounds just like me! Thank you for reading, Lana." }
    ]
  },

  /* ---------- 5 : GOODNIGHT CUDDLES ---------- */
  {
    key: 'sleep', heading: 'The Coziest Sleep',
    art: () => `
      ${bg('g5', '#2E2A66', '#5B4E9E')}
      ${Array.from({ length: 18 }, (_, i) =>
        star(60 + (i * 53) % 920, 60 + ((i * 97) % 360), 7 + (i % 3) * 4, 'rgba(255,255,255,.9)')).join('')}
      <!-- moon -->
      <circle cx="840" cy="150" r="64" fill="#FFE9A8"/>
      <circle cx="815" cy="135" r="64" fill="#5B4E9E"/>
      <!-- bed -->
      <rect x="60"  y="560" width="880" height="96" rx="16" fill="#6E5EAE"/>
      <rect x="60"  y="430" width="64" height="180" rx="16" fill="#9A8AD8"/>
      <rect x="876" y="470" width="64" height="140" rx="16" fill="#9A8AD8"/>
      <rect x="110" y="478" width="820" height="120" rx="22" fill="#D7CCF5"/>
      <!-- pillow -->
      <g transform="translate(255 472) rotate(-6)"><rect x="-112" y="-46" width="224" height="94" rx="36" fill="#fff"/></g>

      <!-- Lana's shoulder/body (under the blanket later) -->
      <ellipse cx="305" cy="524" rx="96" ry="50" fill="#FFC0E0"/>

      <!-- Lana lying on the pillow, fast asleep, facing Ted -->
      <g transform="translate(300 452)">
        <g fill="${HAIR}">
          <circle cx="-4" cy="-30" r="48"/>
          <circle cx="-40" cy="-46" r="30"/><circle cx="32" cy="-50" r="28"/>
          <circle cx="-60" cy="-16" r="28"/><circle cx="-30" cy="-60" r="26"/>
          <circle cx="4" cy="-60" r="26"/><circle cx="-60" cy="12" r="22"/>
        </g>
        <circle cx="8" cy="-4" r="43" fill="${SKIN}"/>
        <path d="M16 -10 q9 7 18 0" stroke="${HAIR}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
        <path d="M-14 -8 q7 6 14 0" stroke="${HAIR}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
        <circle cx="24" cy="10" r="7" fill="${CHEEK}" opacity=".55"/>
        <path d="M16 16 q10 7 20 1" stroke="${MOUTH}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      </g>

      <!-- Ted cuddled in her arms (her stuffed animal) -->
      <g transform="translate(498 520) scale(.72)">${ted({ x: 0, y: 0, s: 1, eyesOpen: false })}</g>

      <!-- blanket tucked over them both -->
      <path d="M150 556 Q510 512 894 556 L894 616 Q510 642 150 616 Z" fill="#8E79D8"/>
      <path d="M150 556 Q510 512 894 556 L890 574 Q510 530 154 574 Z" fill="#AC99EC"/>

      <!-- Lana's arm hugging Ted close -->
      <path d="M352 496 Q470 470 556 520" stroke="${SKIN}" stroke-width="26" fill="none" stroke-linecap="round"/>
      <circle cx="560" cy="522" r="15" fill="${SKIN}"/>

      <text x="660" y="320" font-family="Baloo 2, sans-serif" font-size="58" fill="#fff" opacity=".8">z</text>
      <text x="708" y="272" font-family="Baloo 2, sans-serif" font-size="42" fill="#fff" opacity=".7">z</text>
      <text x="746" y="234" font-family="Baloo 2, sans-serif" font-size="30" fill="#fff" opacity=".6">z</text>
    `,
    lines: [
      { who: 'narrator', text: "Lana and Ted cuddled in bed, said goodnight, and had the coziest sleep." },
      { who: 'lana', text: "Goodnight, Ted. Snuggle close so you stay nice and warm." },
      { who: 'ted',  text: "Goodnight, Lana. You're the best friend a teddy could ever have." },
      { who: 'lana', text: "Sweet dreams... I love you, Ted." },
      { who: 'ted',  text: "(yawn) ...zzz... I love you too..." }
    ]
  },

  /* ---------- 6 : GYMNASTICS ---------- */
  {
    key: 'gym', heading: 'Gymnastics Day!',
    art: () => `
      ${bg('g6', '#DFF6E9', '#CDEBFF')}
      <!-- bunting -->
      ${Array.from({ length: 9 }, (_, i) =>
        `<path d="M${60 + i * 105} 60 l40 0 l-20 40 z" fill="${['#FF7E91','#FFD23F','#54D6A6','#79C2FF','#B79CED'][i % 5]}"/>`).join('')}
      <line x1="60" y1="60" x2="960" y2="60" stroke="#fff" stroke-width="4"/>
      <rect x="0" y="540" width="1000" height="160" fill="#F2A6C2"/>
      <!-- big floor mat -->
      <rect x="120" y="560" width="760" height="90" rx="16" fill="#7ECBA0"/>
      <rect x="120" y="560" width="760" height="14" rx="7" fill="#5FB389"/>
      <!-- Ted doing a (wobbly) headstand: feet up, head on the mat -->
      <g class="idle-bob slow" style="transform-origin:660px 470px">
        <g transform="translate(660 348) scale(1.02 -1.02)">${ted({ x: 0, y: 0, s: 1, arms: 'up' })}</g>
      </g>
      <g class="idle-bob">${lana({ x: 330, y: 600, s: 1.4, ...LEO })}</g>
      ${star(180, 180, 18)} ${star(860, 200, 20)}
      <text x="700" y="300" font-family="Baloo 2, sans-serif" font-size="40" fill="#FF5C73" font-weight="800"
            transform="rotate(-8 700 300)">wobble!</text>
    `,
    lines: [
      { who: 'narrator', text: "The next day, Lana and Ted went to gymnastics. Ted tried to do a headstand!" },
      { who: 'lana', text: "Okay Ted, point your toes to the sky! You can do it!" },
      { who: 'ted',  text: "Upside-down! Whoaaa — everything looks so funny up here! Wobble, wobble!" },
      { who: 'lana', text: "Careful! The coach is watching. You're doing great!" },
      { who: 'ted',  text: "Oops, I tipped over! The coach says I need more practice. Hee hee!" },
      { who: 'lana', text: "That's okay, Ted! We'll practice together every day. Don't give up!" }
    ]
  },

  /* ---------- 7 : THE END ---------- */
  {
    key: 'end', finale: true, heading: 'The End',
    art: () => `
      ${bg('g7', '#FFE6F2', '#DCEBFF')}
      <g opacity=".9">
        <path d="M150 320 a200 200 0 0 1 700 0" fill="none" stroke="#FF7E91" stroke-width="24"/>
        <path d="M185 320 a165 165 0 0 1 630 0" fill="none" stroke="#FFD23F" stroke-width="24"/>
        <path d="M220 320 a130 130 0 0 1 560 0" fill="none" stroke="#54D6A6" stroke-width="24"/>
        <path d="M255 320 a95 95 0 0 1 490 0" fill="none" stroke="#79C2FF" stroke-width="24"/>
      </g>
      <path d="M0 600 Q500 540 1000 600 V700 H0 Z" fill="#BFE9CC"/>
      <g class="idle-bob">${lana({ x: 420, y: 610, s: 1.5, ...PLAY })}</g>
      <g class="idle-bob slow">${ted({ x: 620, y: 610, s: 1.35, arms: 'up' })}</g>
      ${heart(500, 430, 34)} ${heart(460, 400, 18)} ${heart(545, 410, 20)}
      ${star(150, 200, 24)} ${star(850, 220, 24)} ${star(120, 460, 16)} ${star(880, 470, 16)}
    `,
    lines: [
      { who: 'lana', text: "What an amazing week, Ted! Jujitsu, pizza, stories and gymnastics!" },
      { who: 'ted',  text: "And the best part was doing it all with YOU, Lana." },
      { who: 'lana', text: "Best friends forever?" },
      { who: 'ted',  text: "Best friends forever! Hee hee! Hug?" },
      { who: 'narrator', text: "And they hugged tight. The End. (Psst — tap the photo button to see the REAL Lana and Ted!)" }
    ]
  }
];
