/* =====================================================================
   characters.js — reusable SVG art for Lana (a little girl) and
   Ted (her teddy bear). Drawn in a soft chibi / picture-book style.
   Each builder draws in a LOCAL space with feet at y=0, centred on x=0,
   then is placed with translate()+scale() so the same characters stay
   perfectly consistent on every page.
   ===================================================================== */

const SKIN      = '#E8BD92';   /* light, warm Middle-Eastern tan */
const SKIN_DK   = '#D2A271';
const CHEEK     = '#E89A8E';
const HAIR      = '#241C22';   /* dark brown-black curls */
const HAIR_HI   = '#3D3340';
const MOUTH     = '#8A4A45';

/* tiny helper */
const t = (x, y, s = 1) => `translate(${x} ${y}) scale(${s})`;

/* ---------- faces ---------- */
function eyes(open = true) {
  if (!open) {
    return `
      <path d="M-30 -206 q8 8 16 0" stroke="${HAIR}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M14 -206 q8 8 16 0" stroke="${HAIR}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  }
  return `
    <ellipse cx="-22" cy="-204" rx="9" ry="11" fill="#2A2230"/>
    <ellipse cx="22"  cy="-204" rx="9" ry="11" fill="#2A2230"/>
    <circle cx="-19" cy="-208" r="3.2" fill="#fff"/>
    <circle cx="25"  cy="-208" r="3.2" fill="#fff"/>`;
}

function smile() {
  return `<path d="M-16 -184 q16 16 32 0" stroke="${MOUTH}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
}

/**
 * Lana — a cheerful little girl with two afro puffs.
 * outfit: {top, bottom, belt, deco} let us dress her per scene.
 */
function lana({ x = 0, y = 0, s = 1, eyesOpen = true,
                top = '#FF6FA5', bottom = '#6C5CE7', belt = null, stripes = 0, deco = null } = {}) {
  return `
  <g transform="${t(x, y, s)}">
    <!-- soft ground shadow -->
    <ellipse cx="0" cy="6" rx="78" ry="16" fill="rgba(70,40,90,.16)"/>

    <!-- legs + shoes -->
    <rect x="-26" y="-72" width="20" height="62" rx="10" fill="${SKIN}"/>
    <rect x="6"   y="-72" width="20" height="62" rx="10" fill="${SKIN}"/>
    <ellipse cx="-16" cy="-6" rx="18" ry="11" fill="#fff" stroke="#E7DCF0" stroke-width="2"/>
    <ellipse cx="16"  cy="-6" rx="18" ry="11" fill="#fff" stroke="#E7DCF0" stroke-width="2"/>

    <!-- body / outfit -->
    <path d="M-44 -150 Q0 -168 44 -150 L36 -70 Q0 -58 -36 -70 Z" fill="${bottom}"/>
    <path d="M-46 -150 Q0 -172 46 -150 L40 -116 Q0 -128 -40 -116 Z" fill="${top}"/>
    ${belt ? `<rect x="-42" y="-123" width="84" height="13" rx="6" fill="${belt}" stroke="#C9C9D6" stroke-width="1.5"/>
      ${Array.from({ length: stripes }, (_, k) => `<rect x="${16 + k * 7}" y="-123" width="3.6" height="13" fill="#241C22"/>`).join('')}` : ''}
    ${deco || ''}

    <!-- arms -->
    <rect x="-58" y="-148" width="18" height="54" rx="9" fill="${top}" transform="rotate(14 -49 -130)"/>
    <rect x="40"  y="-148" width="18" height="54" rx="9" fill="${top}" transform="rotate(-14 49 -130)"/>
    <circle cx="-56" cy="-96" r="11" fill="${SKIN}"/>
    <circle cx="56"  cy="-96" r="11" fill="${SKIN}"/>

    <!-- neck -->
    <rect x="-9" y="-176" width="18" height="22" rx="8" fill="${SKIN_DK}"/>

    <!-- BIG curly hair (behind the face) -->
    <g fill="${HAIR}">
      <circle cx="0"   cy="-262" r="54"/>
      <circle cx="-34" cy="-290" r="34"/><circle cx="34" cy="-290" r="34"/>
      <circle cx="-58" cy="-272" r="32"/><circle cx="58" cy="-272" r="32"/>
      <circle cx="-48" cy="-242" r="40"/><circle cx="48" cy="-242" r="40"/>
      <circle cx="-76" cy="-218" r="34"/><circle cx="76" cy="-218" r="34"/>
      <circle cx="-82" cy="-186" r="28"/><circle cx="82" cy="-186" r="28"/>
      <circle cx="-70" cy="-158" r="22"/><circle cx="70" cy="-158" r="22"/>
      <circle cx="0"   cy="-300" r="28"/>
    </g>
    <!-- curl shine -->
    <g fill="${HAIR_HI}" opacity=".55">
      <circle cx="0" cy="-296" r="11"/><circle cx="-38" cy="-286" r="9"/><circle cx="38" cy="-286" r="9"/>
      <circle cx="-66" cy="-238" r="9"/><circle cx="66" cy="-238" r="9"/>
      <circle cx="-78" cy="-196" r="8"/><circle cx="78" cy="-196" r="8"/>
    </g>

    <!-- face -->
    <circle cx="0" cy="-208" r="56" fill="${SKIN}"/>
    <ellipse cx="0" cy="-198" rx="56" ry="49" fill="${SKIN}"/>

    <!-- front curl fringe framing the face -->
    <g fill="${HAIR}">
      <circle cx="-46" cy="-238" r="17"/><circle cx="-24" cy="-250" r="17"/>
      <circle cx="0"   cy="-253" r="17"/><circle cx="24" cy="-250" r="17"/>
      <circle cx="46"  cy="-238" r="17"/>
    </g>

    ${eyes(eyesOpen)}
    <circle cx="-33" cy="-188" r="9" fill="${CHEEK}" opacity=".55"/>
    <circle cx="33"  cy="-188" r="9" fill="${CHEEK}" opacity=".55"/>
    ${smile()}

    <!-- cute flower clip -->
    <g transform="translate(-60 -252)">
      ${[0,72,144,216,288].map(a=>`<circle cx="${12*Math.cos(a*Math.PI/180)}" cy="${12*Math.sin(a*Math.PI/180)}" r="7" fill="#FF7EA8"/>`).join('')}
      <circle cx="0" cy="0" r="6" fill="#FFD23F"/>
    </g>
  </g>`;
}

/**
 * Ted — a friendly honey-brown teddy bear.
 * shirt: optional striped pyjama top (matches the real Ted in the photos)
 */
function ted({ x = 0, y = 0, s = 1, eyesOpen = true, shirt = null, bow = true, arms = 'down' } = {}) {
  const FUR = '#F0E6D2', FUR_DK = '#DFD0B4', TAN = '#FCF7EC', NOSE = '#5A4636';
  const armL = arms === 'up'
    ? `<ellipse cx="-66" cy="-150" rx="16" ry="30" fill="${FUR}" transform="rotate(-40 -66 -150)"/>`
    : `<ellipse cx="-60" cy="-104" rx="16" ry="30" fill="${FUR}" transform="rotate(18 -60 -104)"/>`;
  const armR = arms === 'up'
    ? `<ellipse cx="66" cy="-150" rx="16" ry="30" fill="${FUR}" transform="rotate(40 66 -150)"/>`
    : `<ellipse cx="60" cy="-104" rx="16" ry="30" fill="${FUR}" transform="rotate(-18 60 -104)"/>`;
  return `
  <g transform="${t(x, y, s)}">
    <ellipse cx="0" cy="6" rx="70" ry="15" fill="rgba(70,40,90,.16)"/>

    <!-- legs -->
    <ellipse cx="-30" cy="-18" rx="22" ry="20" fill="${FUR}"/>
    <ellipse cx="30"  cy="-18" rx="22" ry="20" fill="${FUR}"/>
    <ellipse cx="-30" cy="-12" rx="11" ry="8" fill="${TAN}"/>
    <ellipse cx="30"  cy="-12" rx="11" ry="8" fill="${TAN}"/>

    <!-- body -->
    <ellipse cx="0" cy="-96" rx="58" ry="62" fill="${FUR}" stroke="${FUR_DK}" stroke-width="2.5"/>
    <ellipse cx="0" cy="-86" rx="38" ry="44" fill="${TAN}"/>
    ${shirt ? `
      <path d="M-56 -118 Q0 -132 56 -118 L52 -70 Q0 -58 -52 -70 Z" fill="${shirt.base}"/>
      <path d="M-55 -110 h110 M-54 -98 h108 M-52 -86 h104 M-50 -74 h100"
            stroke="${shirt.stripe}" stroke-width="6" opacity=".85"/>` : ''}
    ${armL}${armR}

    <!-- little red bow at the neck -->
    ${bow ? `<g transform="translate(0 -134)">
      <path d="M0 0 L-24 -11 L-24 11 Z" fill="#D8495E"/>
      <path d="M0 0 L24 -11 L24 11 Z" fill="#D8495E"/>
      <circle cx="0" cy="0" r="7" fill="#B83A4C"/>
    </g>` : ''}
    <!-- head -->
    <circle cx="0" cy="-178" r="56" fill="${FUR}" stroke="${FUR_DK}" stroke-width="2.5"/>
    <!-- ears -->
    <circle cx="-42" cy="-216" r="22" fill="${FUR}" stroke="${FUR_DK}" stroke-width="2.5"/>
    <circle cx="42"  cy="-216" r="22" fill="${FUR}" stroke="${FUR_DK}" stroke-width="2.5"/>
    <circle cx="-42" cy="-216" r="11" fill="#F3C9C0"/>
    <circle cx="42"  cy="-216" r="11" fill="#F3C9C0"/>
    <!-- muzzle -->
    <ellipse cx="0" cy="-158" rx="34" ry="27" fill="${TAN}"/>
    <ellipse cx="0" cy="-170" rx="11" ry="8.5" fill="${NOSE}"/>
    <path d="M0 -162 v9 M0 -153 q-9 7 -16 4 M0 -153 q9 7 16 4"
          stroke="${NOSE}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <!-- eyes -->
    ${eyesOpen
      ? `<circle cx="-22" cy="-188" r="8.5" fill="#2A2230"/><circle cx="22" cy="-188" r="8.5" fill="#2A2230"/>
         <circle cx="-19" cy="-191" r="3" fill="#fff"/><circle cx="25" cy="-191" r="3" fill="#fff"/>`
      : `<path d="M-30 -188 q8 7 16 0" stroke="#2A2230" stroke-width="4" fill="none" stroke-linecap="round"/>
         <path d="M14 -188 q8 7 16 0" stroke="#2A2230" stroke-width="4" fill="none" stroke-linecap="round"/>`}
    <circle cx="-32" cy="-172" r="7" fill="#E78A86" opacity=".4"/>
    <circle cx="32"  cy="-172" r="7" fill="#E78A86" opacity=".4"/>
  </g>`;
}

/* a sparkle / star used to decorate scenes */
function star(x, y, r, fill = '#FFD23F') {
  return `<path transform="${t(x, y, r / 10)}"
    d="M0 -10 L2.8 -3 L10 -3 L4 1.6 L6.4 9 L0 4.4 L-6.4 9 L-4 1.6 L-10 -3 L-2.8 -3 Z"
    fill="${fill}" opacity=".9"/>`;
}
function heart(x, y, r, fill = '#FF7E91') {
  return `<path transform="${t(x, y, r / 10)}"
    d="M0 6 C-9 -3 -9 -12 -4 -12 C-1 -12 0 -9 0 -8 C0 -9 1 -12 4 -12 C9 -12 9 -3 0 6 Z"
    fill="${fill}"/>`;
}
