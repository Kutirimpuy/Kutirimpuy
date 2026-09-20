import { writeFileSync, mkdirSync } from "fs";
import * as si from "simple-icons";

const OUT = "assets";
mkdirSync(OUT, { recursive: true });

/* ---------- paleta ---------- */
const C = {
  bg0: "#070B18",
  bg1: "#0B1020",
  card: "#101830",
  card2: "#0D1426",
  border: "#1E2A4A",
  text: "#E6EDF7",
  muted: "#8FA3C0",
  dim: "#64748B",
  purple: "#8B5CF6",
  cyan: "#22D3EE",
  teal: "#2DD4BF",
  green: "#4ADE80",
  amber: "#F59E0B",
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SANS = "'Segoe UI',Ubuntu,'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Fira Code','DejaVu Sans Mono',Consolas,monospace";

/* ---------- 1. BANNER (con pulsos de luz animados) ---------- */
// PRNG determinista: el archivo generado no cambia entre ejecuciones
let _s = 20260920;
const rnd = () => ((_s = (_s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

function banner() {
  const W = 1000, H = 230;

  // Cada traza: puntos del recorrido + retardo del pulso + duración
  const seed = [
    { p: [0, 40, 180, 40, 220, 80, 380, 80], d: 0.0, dur: 3.4 },
    { p: [1000, 60, 860, 60, 820, 100, 680, 100], d: 0.9, dur: 3.8 },
    { p: [0, 190, 140, 190, 190, 150, 340, 150], d: 1.8, dur: 3.2 },
    { p: [1000, 175, 880, 175, 840, 140, 700, 140], d: 0.45, dur: 3.6 },
    { p: [0, 115, 90, 115, 120, 90, 250, 90], d: 2.4, dur: 3.0 },
    { p: [1000, 120, 920, 120, 890, 195, 760, 195], d: 1.35, dur: 4.0 },
  ];

  let traces = "", pulses = "", nodes = "";
  seed.forEach((t, i) => {
    const p = t.p;
    const d = `M${p[0]} ${p[1]} L${p[2]} ${p[3]} L${p[4]} ${p[5]} L${p[6]} ${p[7]}`;
    const id = `t${i}`;
    // 1. la pista, tenue y fija
    traces += `<path id="${id}" d="${d}" fill="none" stroke="#24345C" stroke-width="1.5"/>`;
    // 2. el segmento luminoso que la recorre
    traces += `<path d="${d}" fill="none" stroke="url(#pulse)" stroke-width="2.2" stroke-linecap="round"
      pathLength="100" stroke-dasharray="16 100" stroke-dashoffset="116">
      <animate attributeName="stroke-dashoffset" values="116;0" dur="${t.dur}s" begin="${t.d}s" repeatCount="indefinite"/>
    </path>`;
    // 3. la chispa que viaja por delante
    pulses += `<circle r="2.6" fill="#FFFFFF" filter="url(#spark)" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.85;1" dur="${t.dur}s" begin="${t.d}s" repeatCount="indefinite"/>
      <animateMotion dur="${t.dur}s" begin="${t.d}s" repeatCount="indefinite" rotate="auto">
        <mpath href="#${id}" xlink:href="#${id}"/>
      </animateMotion>
    </circle>`;
    // 4. el nodo del final destella cuando llega el pulso
    nodes += `<circle cx="${p[6]}" cy="${p[7]}" r="3.5" fill="${C.cyan}" opacity=".35">
      <animate attributeName="opacity" values=".35;.35;1;.35" keyTimes="0;.9;.95;1" dur="${t.dur}s" begin="${t.d}s" repeatCount="indefinite"/>
      <animate attributeName="r" values="3.5;3.5;6;3.5" keyTimes="0;.9;.95;1" dur="${t.dur}s" begin="${t.d}s" repeatCount="indefinite"/>
    </circle>`;
  });

  let dots = "";
  for (let i = 0; i < 46; i++) {
    const x = Math.round(rnd() * W);
    const y = Math.round(rnd() * H);
    const r = (rnd() * 1.4 + 0.6).toFixed(1);
    dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.purple}" opacity="${(rnd() * 0.4 + 0.15).toFixed(2)}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="¡Hola, soy Renato! Mechatronics Engineer, Robotics and Automation">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#0A0F22"/>
    <stop offset="45%" stop-color="#141B3A"/>
    <stop offset="100%" stop-color="#1B1235"/>
  </linearGradient>
  <linearGradient id="pulse" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${C.cyan}" stop-opacity="0"/>
    <stop offset="50%" stop-color="#9BF6FF"/>
    <stop offset="100%" stop-color="${C.purple}"/>
  </linearGradient>
  <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#FFFFFF"/>
    <stop offset="55%" stop-color="#C7D9FF"/>
    <stop offset="100%" stop-color="${C.cyan}"/>
  </linearGradient>
  <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${C.cyan}" stop-opacity="0"/>
    <stop offset="50%" stop-color="${C.cyan}"/>
    <stop offset="100%" stop-color="${C.purple}" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="glow" cx="50%" cy="45%" r="55%">
    <stop offset="0%" stop-color="${C.purple}" stop-opacity=".45"/>
    <stop offset="100%" stop-color="${C.purple}" stop-opacity="0"/>
  </radialGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="spark" x="-300%" y="-300%" width="700%" height="700%">
    <feGaussianBlur stdDeviation="2.4" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>

<rect width="${W}" height="${H}" rx="14" fill="url(#bg)"/>
<rect width="${W}" height="${H}" rx="14" fill="url(#glow)"/>
${dots}
${traces}
${nodes}
${pulses}
<g opacity=".2" filter="url(#soft)">
  <circle cx="880" cy="56" r="38" fill="${C.cyan}"/>
  <circle cx="150" cy="180" r="40" fill="${C.purple}"/>
</g>

<text x="500" y="108" text-anchor="middle" font-family="${SANS}" font-size="44" font-weight="700" fill="url(#title)">¡Hola, soy Renato!</text>
<text x="500" y="142" text-anchor="middle" font-family="${SANS}" font-size="17" fill="${C.muted}">Mechatronics Engineer  |  Robotics ${esc("&")} Automation</text>
<rect x="420" y="160" width="160" height="2" rx="1" fill="url(#rule)">
  <animate attributeName="opacity" values=".45;1;.45" dur="3.2s" repeatCount="indefinite"/>
</rect>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${C.border}"/>
</svg>`;
}

/* ---------- 2. ABOUT CARD ---------- */
function about() {
  const W = 700, H = 250;
  const lines = [
    "Soy estudiante de Ingeniería Mecatrónica con gran pasión por la robótica,",
    "la automatización y la innovación tecnológica. Siempre estoy buscando",
    "nuevas tecnologías y desafíos que me permitan seguir aprendiendo y",
    "creciendo en mi campo.",
  ];
  const pills = [
    { t: "Robótica y automatización", i: "robot", c: C.cyan },
    { t: "Sistemas embebidos", i: "chip", c: C.purple },
    { t: "Programación", i: "code", c: C.teal },
    { t: "Innovación tecnológica", i: "bulb", c: C.amber },
  ];
  const icon = (kind, color) => {
    switch (kind) {
      case "robot":
        return `<g stroke="${color}" stroke-width="1.6" fill="none" stroke-linecap="round"><rect x="4" y="7" width="12" height="9" rx="2.5"/><path d="M10 4v3"/><circle cx="10" cy="3" r="1.2" fill="${color}" stroke="none"/><circle cx="7.5" cy="11" r="1.1" fill="${color}" stroke="none"/><circle cx="12.5" cy="11" r="1.1" fill="${color}" stroke="none"/><path d="M2 10v3M18 10v3"/></g>`;
      case "chip":
        return `<g stroke="${color}" stroke-width="1.6" fill="none" stroke-linecap="round"><rect x="5" y="5" width="10" height="10" rx="2"/><rect x="8" y="8" width="4" height="4" rx="1"/><path d="M8 2v3M12 2v3M8 15v3M12 15v3M2 8h3M2 12h3M15 8h3M15 12h3"/></g>`;
      case "code":
        return `<g stroke="${color}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6l-4 4 4 4M13 6l4 4-4 4"/></g>`;
      default:
        return `<g stroke="${color}" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9z"/><path d="M8 17h4"/></g>`;
    }
  };

  let pillSvg = "";
  pills.forEach((p, idx) => {
    const col = idx % 2;
    const row = (idx / 2) | 0;
    const x = 28 + col * 330;
    const y = 158 + row * 44;
    pillSvg += `<g transform="translate(${x},${y})">
      <rect width="308" height="34" rx="9" fill="${C.card2}" stroke="${C.border}"/>
      <g transform="translate(9,7)">${icon(p.i, p.c)}</g>
      <text x="40" y="22" font-family="${SANS}" font-size="13.5" fill="${C.text}">${esc(p.t)}</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Sobre mí">
<defs>
  <linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#121B33"/><stop offset="100%" stop-color="#0C1226"/>
  </linearGradient>
</defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="url(#cbg)" stroke="${C.border}"/>
<text x="28" y="44" font-family="${SANS}" font-size="20" font-weight="600" fill="${C.cyan}">A Passionate Mechatronics Mind</text>
${lines
  .map((l, i) => `<text x="28" y="${78 + i * 22}" font-family="${SANS}" font-size="13.5" fill="${C.muted}">${esc(l)}</text>`)
  .join("")}
${pillSvg}
</svg>`;
}

/* ---------- 3. TECH STACK ---------- */
function stack() {
  const groups = [
    { label: "HARDWARE", items: [si.siArduino, si.siRaspberrypi] },
    { label: "LENGUAJES", items: [si.siC, si.siCplusplus, si.siPython] },
    { label: "WEB Y DATOS", items: [si.siHtml5, si.siCss, si.siSqlite] },
  ];
  const TILE = 74, GAP = 12, PAD = 20, PERROW = 3;
  const SHORT = { "Raspberry Pi": "RASPBERRY PI", "C++": "C++", "CSS": "CSS3" };
  let y = 46, body = "";
  for (const g of groups) {
    body += `<text x="${PAD}" y="${y}" font-family="${SANS}" font-size="11" font-weight="700" letter-spacing="1.4" fill="${C.dim}">${g.label}</text>`;
    y += 12;
    g.items.forEach((it, i) => {
      const col = i % PERROW;
      const x = PAD + col * (TILE + GAP);
      const ty = y + ((i / PERROW) | 0) * (TILE + GAP);
      const hex = "#" + it.hex;
      const label = (SHORT[it.title] || it.title).toUpperCase();
      body += `<g transform="translate(${x},${ty})">
        <rect width="${TILE}" height="${TILE}" rx="12" fill="${C.card2}" stroke="${C.border}"/>
        <g transform="translate(${TILE / 2 - 13},14) scale(1.083)"><path d="${it.path}" fill="${hex}"/></g>
        <text x="${TILE / 2}" y="63" text-anchor="middle" font-family="${SANS}" font-size="${label.length > 8 ? 7.5 : 9.5}" font-weight="600" letter-spacing=".4" fill="${C.muted}">${esc(label)}</text>
      </g>`;
    });
    y += Math.ceil(g.items.length / PERROW) * (TILE + GAP) + 24;
  }
  const W = PAD * 2 + PERROW * TILE + (PERROW - 1) * GAP;
  const H = y - 4;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Tech stack">
<defs><linearGradient id="sbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#121B33"/><stop offset="100%" stop-color="#0C1226"/></linearGradient></defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="url(#sbg)" stroke="${C.border}"/>
${body}
</svg>`;
}

/* ---------- 4. TERMINAL ---------- */
function terminal() {
  const rows = [
    [["$ ", C.green], ["whoami", C.text]],
    [[">> ", C.dim], ["kutirimpuy (Renato R.)", C.muted]],
    [],
    [["$ ", C.green], ["current_status", C.cyan]],
    [[">> ", C.dim], ["Explorando sistemas embebidos", C.muted]],
    [],
    [["$ ", C.green], ["current_focus", C.cyan]],
    [["  - ", C.dim], ["Robótica y automatización", C.muted]],
    [["  - ", C.dim], ["Programación y control", C.muted]],
    [["  - ", C.dim], ["Innovación tecnológica", C.muted]],
    [],
    [["$ ", C.green], ["ping real_world", C.cyan]],
    [[">> ", C.dim], [".. PONG .. Learning and Growing!", C.teal]],
    [],
    [["$ ", C.green], ["status", C.cyan]],
    [[">> ", C.dim], ["Aprendiendo y creciendo 🚀", C.amber]],
  ];
  const W = 560, TOP = 40, LH = 19;
  const H = TOP + rows.length * LH + 34;
  let body = "";
  rows.forEach((r, i) => {
    if (!r.length) return;
    const y = TOP + 14 + i * LH;
    const spans = r
      .map(([txt, col]) => `<tspan fill="${col}">${esc(txt)}</tspan>`)
      .join("");
    body += `<text x="20" y="${y}" font-family="${MONO}" font-size="12.5" xml:space="preserve">${spans}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Panel de actividad">
<defs><linearGradient id="tbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0C1326"/><stop offset="100%" stop-color="#080D1C"/></linearGradient></defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="url(#tbg)" stroke="${C.border}"/>
<path d="M0 12a12 12 0 0 1 12-12h536a12 12 0 0 1 12 12v18H0z" fill="#151E38"/>
<circle cx="22" cy="16" r="5" fill="#FF5F57"/><circle cx="40" cy="16" r="5" fill="#FEBC2E"/><circle cx="58" cy="16" r="5" fill="#28C840"/>
<text x="${W / 2}" y="20" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${C.dim}">kutirimpuy — bash</text>
${body}
<rect x="20" y="${H - 24}" width="8" height="14" fill="${C.green}" opacity=".9">
  <animate attributeName="opacity" values="0;.9;0" dur="1.1s" repeatCount="indefinite"/>
</rect>
</svg>`;
}

/* ---------- 5. QUOTE ---------- */
function quote() {
  const W = 1000, H = 62;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Cita">
<defs><linearGradient id="qbg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#0C1226"/><stop offset="50%" stop-color="#121B33"/><stop offset="100%" stop-color="#0C1226"/></linearGradient></defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="url(#qbg)" stroke="${C.border}"/>
<text x="${W / 2}" y="30" text-anchor="middle" font-family="${SANS}" font-size="13.5" font-style="italic" fill="${C.muted}">"El código es como el humor. Cuando tienes que explicarlo, es malo."</text>
<text x="${W / 2}" y="48" text-anchor="middle" font-family="${SANS}" font-size="11.5" fill="${C.dim}">— Cory House</text>
</svg>`;
}

/* ---------- 6. FOOTER ---------- */
function footer() {
  const W = 1000, H = 90;
  let nodes = "";
  for (let i = 0; i < 16; i++) {
    const x = 30 + i * 62;
    nodes += `<circle cx="${x}" cy="${40 + (i % 3) * 12}" r="3" fill="${i % 2 ? C.cyan : C.purple}" opacity=".8"><animate attributeName="opacity" values=".2;.85;.2" dur="${(2.5 + (i % 5) * 0.4).toFixed(1)}s" repeatCount="indefinite"/></circle>
    <path d="M${x} ${40 + (i % 3) * 12} L${x + 62} ${40 + ((i + 1) % 3) * 12}" stroke="${C.border}" stroke-width="1.2"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="footer">
<defs><linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0A0F22"/><stop offset="100%" stop-color="#1B1235"/></linearGradient></defs>
<rect width="${W}" height="${H}" rx="12" fill="url(#fbg)"/>
${nodes}
<text x="${W / 2}" y="78" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${C.dim}">github.com/kutirimpuy</text>
</svg>`;
}

const files = {
  "banner.svg": banner(),
  "about.svg": about(),
  "tech-stack.svg": stack(),
  "terminal.svg": terminal(),
  "quote.svg": quote(),
  "footer.svg": footer(),
};
for (const [name, content] of Object.entries(files)) {
  writeFileSync(`${OUT}/${name}`, content);
  console.log(name, content.length, "bytes");
}
