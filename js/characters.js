/* =====================================================================
   characters.js — reusable SVG art for Lana (a little girl) and
   Ted (her teddy bear). Drawn in a soft chibi / picture-book style.
   Each builder draws in a LOCAL space with feet at y=0, centred on x=0,
   then is placed with translate()+scale() so the same characters stay
   perfectly consistent on every page.
   ===================================================================== */

const SKIN      = '#B97A45';
const SKIN_DK   = '#9C6334';
const CHEEK     = '#E78A86';
const HAIR      = '#2B2230';
const HAIR_HI   = '#473A52';
const MOUTH     = '#7A3B3B';

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
                top = '#FF6FA5', bottom = '#6C5CE7', belt = null, deco = null } = {}) {
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
    ${belt ? `<rect x="-40" y="-122" width="80" height="11" rx="5" fill="${belt}"/>` : ''}
    ${deco || ''}

    <!-- arms -->
    <rect x="-58" y="-148" width="18" height="54" rx="9" fill="${top}" transform="rotate(14 -49 -130)"/>
    <rect x="40"  y="-148" width="18" height="54" rx="9" fill="${top}" transform="rotate(-14 49 -130)"/>
    <circle cx="-56" cy="-96" r="11" fill="${SKIN}"/>
    <circle cx="56"  cy="-96" r="11" fill="${SKIN}"/>

    <!-- neck + head -->
    <rect x="-9" y="-176" width="18" height="22" rx="8" fill="${SKIN_DK}"/>
    <!-- back hair puffs -->
    <circle cx="-46" cy="-238" r="30" fill="${HAIR}"/>
    <circle cx="46"  cy="-238" r="30" fill="${HAIR}"/>
    <circle cx="-46" cy="-244" r="12" fill="${HAIR_HI}" opacity=".5"/>
    <circle cx="46"  cy="-244" r="12" fill="${HAIR_HI}" opacity=".5"/>
    <!-- face -->
    <circle cx="0" cy="-208" r="58" fill="${SKIN}"/>
    <ellipse cx="0" cy="-198" rx="58" ry="50" fill="${SKIN}"/>
    <!-- hairline / fringe -->
    <path d="M-58 -214 Q-40 -266 0 -262 Q40 -266 58 -214 Q40 -240 0 -236 Q-40 -240 -58 -214 Z" fill="${HAIR}"/>
    <circle cx="-58" cy="-208" r="13" fill="${SKIN}"/>
    <circle cx="58"  cy="-208" r="13" fill="${SKIN}"/>
    ${eyes(eyesOpen)}
    <circle cx="-34" cy="-188" r="9" fill="${CHEEK}" opacity=".55"/>
    <circle cx="34"  cy="-188" r="9" fill="${CHEEK}" opacity=".55"/>
    ${smile()}
    <!-- little hair bobbles -->
    <circle cx="-46" cy="-262" r="7" fill="#FFD23F"/>
    <circle cx="46"  cy="-262" r="7" fill="#FF7E91"/>
  </g>`;
}

/**
 * Ted — a friendly honey-brown teddy bear.
 * shirt: optional striped pyjama top (matches the real Ted in the photos)
 */
function ted({ x = 0, y = 0, s = 1, eyesOpen = true, shirt = null, arms = 'down' } = {}) {
  const FUR = '#C98A4B', FUR_DK = '#A66A30', TAN = '#EBCB92', NOSE = '#4A342A';
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
    <ellipse cx="0" cy="-96" rx="58" ry="62" fill="${FUR}"/>
    <ellipse cx="0" cy="-86" rx="38" ry="44" fill="${TAN}"/>
    ${shirt ? `
      <path d="M-56 -118 Q0 -132 56 -118 L52 -70 Q0 -58 -52 -70 Z" fill="${shirt.base}"/>
      <path d="M-55 -110 h110 M-54 -98 h108 M-52 -86 h104 M-50 -74 h100"
            stroke="${shirt.stripe}" stroke-width="6" opacity=".85"/>` : ''}
    ${armL}${armR}

    <!-- head -->
    <circle cx="0" cy="-178" r="56" fill="${FUR}"/>
    <!-- ears -->
    <circle cx="-42" cy="-216" r="22" fill="${FUR}"/>
    <circle cx="42"  cy="-216" r="22" fill="${FUR}"/>
    <circle cx="-42" cy="-216" r="11" fill="${TAN}"/>
    <circle cx="42"  cy="-216" r="11" fill="${TAN}"/>
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
