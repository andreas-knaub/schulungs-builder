// ---------------------------------------------------------------
// Renderer: baut aus den Folien-Objekten fertiges HTML im
// gewählten Corporate Design.
// ---------------------------------------------------------------

const ICONS = {
  warn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>`,
  tip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// **fett** im Text erlauben
function inline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// data-src = Zeile im Text, damit man direkt auf der Folie bearbeiten kann
function src(line) { return line === null || line === undefined ? "" : ` data-src="${line}"`; }

function renderItems(items) {
  let html = "";
  let list = [];
  const flush = () => {
    if (list.length) html += `<ul class="s-list">${list.map(i => `<li><span${src(i.line)}>${inline(i.text)}</span></li>`).join("")}</ul>`;
    list = [];
  };
  for (const item of items) {
    if (item.kind === "bullet") { list.push(item); continue; }
    flush();
    if (item.kind === "text") html += `<p class="s-p"${src(item.line)}>${inline(item.text)}</p>`;
  }
  flush();
  return html;
}

function renderBoxes(items) {
  return items
    .filter(i => i.kind === "warn" || i.kind === "tip")
    .map(i => i.kind === "warn"
      ? `<div class="s-box s-warn">${ICONS.warn}<div><b>${L.safety}</b><span${src(i.line)}>${inline(i.text)}</span></div></div>`
      : `<div class="s-box s-tip">${ICONS.tip}<div><b>${L.tip}</b><span${src(i.line)}>${inline(i.text)}</span></div></div>`)
    .join("");
}

function footer(theme, meta, index, total, stepLabel = "") {
  const pct = ((index + 1) / total) * 100;
  if (isLight(theme)) {
    // Kopfleiste oben (per CSS nach oben sortiert): Logo links, Titel und Position rechts
    return `
    <div class="l-top">
      <div class="l-logo">${theme.logo}</div>
      <div class="l-meta"><b>${escapeHtml(meta.trainingTitle || "")}</b>${stepLabel ? escapeHtml(stepLabel) + " · " : ""}${L.slide} ${index + 1} / ${total}</div>
    </div>
    <div class="s-progress" style="width:${pct.toFixed(2)}%"></div>`;
  }
  return `
    <div class="s-foot">
      <div class="s-logo">${theme.logo}</div>
      <div>${escapeHtml(meta.trainingTitle || "")}${meta.version ? " · " + L.version + " " + escapeHtml(meta.version) : ""}</div>
      <div>${index + 1} / ${total}</div>
    </div>
    <div class="s-progress" style="width:${pct.toFixed(2)}%"></div>`;
}

// Helle Variante: Logo steht prominent auf Weiß (ideal für echte Firmenlogos)
function isLight(theme) { return theme.layout === "light"; }
function slideClass(theme, extra = "") { return ["slide", isLight(theme) ? "layout-light" : "", isLight(theme) && theme.headerDark ? "head-dark" : "", extra].filter(Boolean).join(" "); }
function headLogo(theme) { return ""; } // Logo steht im hellen Layout in der Kopfleiste

function renderTitleSlideLight(slide, theme, meta, stepCount, chips) {
  // Kennzahlen unter dem Titel: Schritte, Dauer, Version
  // "20 Minuten" / "20 minutes" -> große Zahl 20 mit Beschriftung "Minuten"
  const dauerMatch = meta.dauer ? meta.dauer.match(/^(\d+(?:[.,]\d+)?)\s*\D*$/) : null;
  const kpis = [
    [stepCount, L.steps],
    ...(meta.dauer ? [dauerMatch ? [dauerMatch[1], L.minutes] : [meta.dauer, L.duration]] : []),
    ...(meta.version ? [[meta.version, L.version]] : [])
  ].map(([v, l]) => `<div class="tl-kpi"><b>${escapeHtml(v)}</b><span>${l}</span></div>`).join("");

  return `
    <section class="${slideClass(theme, "t-light")}" style="${themeStyle(theme)}">
      <div class="tl-logo-area"><div class="tl-logo">${theme.logo}</div></div>
      <div class="tl-main">
        <div class="s-kicker">${L.material}${meta.bereich ? " · " + escapeHtml(meta.bereich) : ""}</div>
        <h1${src(slide.titleLine)}>${inline(slide.title)}</h1>
        ${meta.untertitel ? `<p class="t-sub"${src(meta.untertitelLine)}>${inline(meta.untertitel)}</p>` : ""}
        ${renderItems(slide.items)}
        <div class="tl-kpis">${kpis}</div>
        ${chips ? `<div class="t-meta">${chips}</div>` : ""}
      </div>
      <div class="tl-bar"></div>
    </section>`;
}

function renderTitleSlide(slide, theme, meta, stepCount) {
  if (isLight(theme)) {
    const lightChips = [[L.author, meta.autor]].filter(([, v]) => v)
      .map(([k, v]) => `<span class="t-chip"><i>${k}</i>${escapeHtml(v)}</span>`).join("");
    return renderTitleSlideLight(slide, theme, meta, stepCount, lightChips);
  }
  const chips = [
    [L.area, meta.bereich], [L.duration, meta.dauer],
    [L.version, meta.version], [L.author, meta.autor]
  ].filter(([, v]) => v)
   .map(([k, v]) => `<span class="t-chip"><i>${k}</i>${escapeHtml(v)}</span>`).join("");

  return `
    <section class="slide t-title" style="${themeStyle(theme)}">
      <div class="t-band">
        <div class="s-logo">${theme.logo}</div>
        <div>
          <div class="t-label">${L.material}</div>
        </div>
        <div class="t-steps">${stepCount}<span>${L.steps}</span></div>
      </div>
      <div class="t-main">
        <h1${src(slide.titleLine)}>${inline(slide.title)}</h1>
        ${meta.untertitel ? `<p class="t-sub"${src(meta.untertitelLine)}>${inline(meta.untertitel)}</p>` : ""}
        ${renderItems(slide.items)}
        ${chips ? `<div class="t-meta">${chips}</div>` : ""}
      </div>
    </section>`;
}

// ---------------------------------------------------------------
// Gezeichneter App-Bildschirm in einem Handy-Rahmen.
// Es gibt keine echte App: Das Tool zeichnet die Oberfläche aus den
// Zeilen handy:, feld:, liste:, auswahl:, foto: und button: im Text.
// ---------------------------------------------------------------
const PHONE_ICONS = {
  scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 8v8M11 8v8M15 8v8"/></svg>`,
  down: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="4"/></svg>`
};

function renderPhone(screen) {
  const fields = [];
  const buttons = [];
  for (const el of screen.elements) {
    const label = el.label ? `<div class="ph-lbl">${escapeHtml(el.label)}</div>` : "";
    if (el.kind === "feld") {
      const icon = /barcode|fahrzeug|scan|fin/i.test(el.label) ? PHONE_ICONS.scan : "";
      fields.push(`<div>${label}<div class="ph-field"><span>${escapeHtml(el.value)}</span>${icon}</div></div>`);
    } else if (el.kind === "liste") {
      fields.push(`<div>${label}<div class="ph-field"><span>${escapeHtml(el.value)}</span>${PHONE_ICONS.down}</div></div>`);
    } else if (el.kind === "auswahl") {
      const chips = el.options.map(o => `<span class="ph-chip${o.selected ? " on" : ""}">${escapeHtml(o.text)}</span>`).join("");
      fields.push(`<div>${label}<div class="ph-chips">${chips}</div></div>`);
    } else if (el.kind === "foto") {
      fields.push(`<div class="ph-photo">${PHONE_ICONS.camera}${escapeHtml(el.text)}</div>`);
    } else if (el.kind === "hinweis-app") {
      fields.push(`<div class="ph-note">${escapeHtml(el.text)}</div>`);
    } else if (el.kind === "button") {
      buttons.push(`<div class="ph-btn-wrap${el.highlight ? " is-tap" : ""}"><div class="ph-btn">${escapeHtml(el.text)}</div></div>`);
    }
  }
  return `
    <div class="ph" role="img" aria-label="App-Bildschirm ${escapeHtml(screen.title)}">
      <div class="ph-screen">
        <div class="ph-notch"></div>
        <div class="ph-bar">
          ${screen.app ? `<div class="ph-app">${escapeHtml(screen.app)}</div>` : ""}
          <div class="ph-title">${escapeHtml(screen.title)}</div>
        </div>
        <div class="ph-content">${fields.join("")}</div>
        ${buttons.length ? `<div class="ph-actions">${buttons.join("")}</div>` : ""}
      </div>
    </div>`;
}

// ---------------------------------------------------------------
// Karten-Layout: jeder Punkt wird eine Karte mit passendem Symbol,
// Sicherheitshinweise und Tipps stehen als Leiste darunter.
// Das Symbol wird anhand von Stichwörtern im Text ausgewählt.
// ---------------------------------------------------------------
const CARD_ICONS = [
  [/brille|augen/i, `<circle cx="6.5" cy="13" r="3.5"/><circle cx="17.5" cy="13" r="3.5"/><path d="M10 13h4M3 13 2 9M21 13l1-4"/>`],
  [/gehör|ohr|lärm/i, `<path d="M4 15a8 8 0 0 1 16 0"/><rect x="2.5" y="14" width="4" height="6" rx="1.5"/><rect x="17.5" y="14" width="4" height="6" rx="1.5"/>`],
  [/handschuh|hand/i, `<path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V3.5a1.5 1.5 0 0 1 3 0V10M13 10V4.5a1.5 1.5 0 0 1 3 0V11M16 11V7.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4.5a1.5 1.5 0 0 1 2.5-1.6L7 13"/>`],
  [/schuh|stiefel/i, `<path d="M4 6h5v7l9 2.5a2 2 0 0 1 2 2V19H4z"/><path d="M4 19h16"/>`],
  [/psa|schutz|sicher/i, `<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/><path d="m9 12 2 2 4-4"/>`],
  [/nm\b|drehmoment|schraub|schrauber|werkzeug|anzieh/i, `<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>`],
  [/mm\b|spalt|mess|lehre|abstand/i, `<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>`],
  [/prüf|kontroll|check|sichtprüf|i\.o\.|qualität/i, `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11l2 2 4-4"/>`],
  [/licht|lampe|leuchte|hell/i, `<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>`],
  [/reinig|tuch|sauber|staub/i, `<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>`],
  [/polier|politur|pad|schleif/i, `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>`],
  [/stecker|kabel|elektr|strom/i, `<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>`],
  [/terminal|buch|scan|system|app|tablet|eingeb|melde/i, `<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>`],
  [/sekunde|minute|zeit|warte/i, `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`],
  [/band|förder|karosse|fahrzeug/i, `<path d="M3 16v-3l2-5h10l4 5h2v3"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>`],
  [/teil|clip|einsetz|montier|bauteil|material|behälter/i, `<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>`],
  [/ziel|lernen|verstehen|kennen|wissen/i, `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>`]
];
const CARD_DEFAULT_ICON = `<path d="M5 12h14M13 6l6 6-6 6"/>`;

function cardIcon(text) {
  const hit = CARD_ICONS.find(([re]) => re.test(text));
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${hit ? hit[1] : CARD_DEFAULT_ICON}</svg>`;
}

function renderCardBody(slide) {
  const bullets = slide.items.filter(i => i.kind === "bullet");
  const texts = slide.items.filter(i => i.kind === "text");
  const warns = slide.items.filter(i => i.kind === "warn");
  const tips = slide.items.filter(i => i.kind === "tip");
  const cols = bullets.length <= 4 ? bullets.length : 3;

  const intro = texts.map(i => `<p class="s-p c-intro"${src(i.line)}>${inline(i.text)}</p>`).join("");
  const cards = bullets.map((i, n) => `
    <div class="c-card">
      <div class="c-ic">${cardIcon(i.text)}</div>
      <span class="c-no">${String(n + 1).padStart(2, "0")}</span>
      <p><span${src(i.line)}>${inline(i.text)}</span></p>
    </div>`).join("");
  // Kurze Hinweise nebeneinander, längere untereinander
  const note = (list, cls, label, icon) => list.length ? `
    <div class="c-note ${cls}${list.reduce((n, i) => n + i.text.length, 0) > 70 ? " c-stack" : ""}">
      <div class="c-lbl">${icon}${label}</div>
      <ul>${list.map(i => `<li><span${src(i.line)}>${inline(i.text)}</span></li>`).join("")}</ul>
    </div>` : "";

  return `
    <div class="s-body c-body">
      ${intro}
      ${bullets.length ? `<div class="c-cards${cols === 1 ? " c-one" : ""}" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${cards}</div>` : ""}
      ${note(warns, "c-warn", L.safety, ICONS.warn)}
      ${note(tips, "c-tip", L.tip, ICONS.tip)}
    </div>`;
}

// Karten nur, wenn es passt: kein Bild, kein App-Bildschirm, 1 bis 6 Punkte
function useCards(slide) {
  const bullets = slide.items.filter(i => i.kind === "bullet").length;
  return !slide.screen && !slide.image && bullets >= 1 && bullets <= 6;
}

function renderContentSlide(slide, theme, meta, index, total) {
  const isStep = slide.type === "step";

  if (useCards(slide)) {
    return `
    <section class="${slideClass(theme, "c-slide" + (isStep ? " c-step" : ""))}" style="${themeStyle(theme)}">
      <div class="s-head">
        ${isStep ? `<div class="s-badge">${slide.stepNumber}</div>` : ""}
        <div>
          ${isStep ? `<div class="s-kicker">${stepText(slide.stepNumber, meta.stepCount)}</div>` : ""}
          <h2 class="s-title"${src(slide.titleLine)}>${inline(slide.title)}</h2>
        </div>
      </div>
      ${renderCardBody(slide)}
      ${footer(theme, meta, index, total, isStep ? stepText(slide.stepNumber, meta.stepCount) : "")}
    </section>`;
  }
  const main = renderItems(slide.items);
  const boxes = renderBoxes(slide.items);
  const image = slide.image ? `<img class="s-img" src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.title)}">` : "";

  // Mit Bild: Text + Hinweise links, Bild rechts.
  // Ohne Bild: Text links, Hinweise rechts.
  const head = `
      <div class="s-head">
        ${isStep ? `<div class="s-badge">${slide.stepNumber}</div>` : ""}
        <div>
          <div class="s-kicker">${isStep ? stepText(slide.stepNumber, meta.stepCount) : escapeHtml(meta.trainingTitle || "")}</div>
          <h2 class="s-title"${src(slide.titleLine)}>${inline(slide.title)}</h2>
        </div>
        ${headLogo(theme)}
      </div>`;
  const foot = footer(theme, meta, index, total, isStep ? stepText(slide.stepNumber, meta.stepCount) : "");

  // Mit App-Bildschirm: Text links, gezeichnetes Handy rechts
  if (slide.screen) {
    return `
    <section class="${slideClass(theme, "has-phone")}" style="${themeStyle(theme)}">
      <div class="ph-wrap">
        <div class="ph-left">
          ${head}
          <div class="s-body single"><div class="s-col">${main}${boxes}</div></div>
        </div>
        <div class="ph-right">${renderPhone(slide.screen)}</div>
      </div>
      ${foot}
    </section>`;
  }

  let body;
  if (image) {
    body = `<div class="s-body"><div class="s-col">${main}${boxes}</div><div class="s-col">${image}</div></div>`;
  } else if (boxes && main) {
    body = `<div class="s-body"><div class="s-col">${main}</div><div class="s-col">${boxes}</div></div>`;
  } else {
    body = `<div class="s-body single"><div class="s-col">${main}${boxes}</div></div>`;
  }

  return `
    <section class="${slideClass(theme)}" style="${themeStyle(theme)}">
      <div class="s-head">
        ${isStep ? `<div class="s-badge">${slide.stepNumber}</div>` : ""}
        <div>
          <div class="s-kicker">${isStep ? stepText(slide.stepNumber, meta.stepCount) : escapeHtml(meta.trainingTitle || "")}</div>
          <h2 class="s-title"${src(slide.titleLine)}>${inline(slide.title)}</h2>
        </div>
        ${headLogo(theme)}
      </div>
      ${body}
      ${footer(theme, meta, index, total, isStep ? stepText(slide.stepNumber, meta.stepCount) : "")}
    </section>`;
}

function renderQuizSlide(slide, theme, meta, index, total) {
  const letters = "ABCDEF";
  const opts = slide.answers.map((a, i) => `
    <button type="button" class="q-opt" data-correct="${a.correct}">
      <span class="q-letter">${letters[i] || "•"}</span><span${src(a.line)}>${inline(a.text)}</span>
    </button>`).join("");

  return `
    <section class="${slideClass(theme)}" style="${themeStyle(theme)}">
      <div class="s-head">
        <div>
          <div class="s-kicker">${escapeHtml(meta.trainingTitle || L.quiz)}</div>
          <h2 class="s-title"${src(slide.title ? slide.titleLine : null)}>${inline(slide.title || L.quiz)}</h2>
        </div>
        ${headLogo(theme)}
      </div>
      <div class="s-body single">
        <div class="s-col">
          <p class="q-question"${src(slide.questionLine)}>${inline(slide.question)}</p>
          <div class="q-opts">${opts}</div>
        </div>
      </div>
      ${footer(theme, meta, index, total)}
    </section>`;
}

function renderEndSlide(parsed, theme, meta, index, total, qrSvg) {
  const warnCount = parsed.slides.reduce((n, s) => n + s.items.filter(i => i.kind === "warn").length, 0);
  const quizCount = parsed.slides.filter(s => s.type === "quiz").length;
  return `
    <section class="${slideClass(theme)}" style="${themeStyle(theme)}">
      <div class="s-head">
        <div>
          <div class="s-kicker">${L.summary}</div>
          <h2 class="s-title">${L.done}</h2>
        </div>
        ${headLogo(theme)}
      </div>
      <div class="e-grid${qrSvg ? "" : " no-qr"}">
        <div>
          <p class="s-p">${escapeHtml(L.doneText).replace("{t}", `<strong>${escapeHtml(meta.trainingTitle || "")}</strong>`)}</p>
          <div class="e-stats">
            <div class="e-stat"><b>${parsed.stepCount}</b><span>${L.steps}</span></div>
            <div class="e-stat"><b>${warnCount}</b><span>${L.warnings}</span></div>
            <div class="e-stat"><b>${quizCount}</b><span>${L.questions}</span></div>
          </div>
        </div>
        ${qrSvg ? `<div class="e-qr">${qrSvg}<span>${L.qr}</span></div>` : ""}
      </div>
      ${footer(theme, meta, index, total)}
    </section>`;
}

// QR-Code als SVG (nutzt die Bibliothek qrcode-generator, falls geladen)
function makeQr(text) {
  if (!text || typeof qrcode === "undefined") return "";
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
}

// ---------------------------------------------------------------
// Automatisch einpassen: Ist zu viel Text auf einer Folie, wird der
// Inhaltsbereich schrittweise kleiner gezoomt (bis 60 %), bis alles
// sichtbar ist. Das Ergebnis steht direkt im HTML (style="zoom:…"),
// gilt also überall: Vorschau, Präsentation, PDF und HTML-Export.
// ---------------------------------------------------------------
let fitBox = null;

function fitSlide(html) {
  if (typeof document === "undefined" || !document.body) return html;
  if (!fitBox) {
    fitBox = document.createElement("div");
    fitBox.setAttribute("aria-hidden", "true");
    fitBox.style.cssText = "position:fixed;left:-20000px;top:0;width:1280px;height:720px;visibility:hidden;pointer-events:none;overflow:hidden";
    document.body.appendChild(fitBox);
  }
  fitBox.innerHTML = html;
  const slide = fitBox.firstElementChild;
  const targets = slide ? [...slide.querySelectorAll(".s-body, .tl-main, .e-grid, .tr-mid")] : [];
  if (!targets.length) return html;

  const foot = slide.querySelector(".s-foot");
  const limit = (foot ? foot.getBoundingClientRect().top : slide.getBoundingClientRect().bottom) - 24;
  const top = slide.getBoundingClientRect().top;
  const fits = () => targets.every(t => [...t.querySelectorAll("*")].every(el => {
    const r = el.getBoundingClientRect();
    return r.height === 0 || (r.bottom <= limit && r.top >= top);
  }));

  if (fits()) { fitBox.innerHTML = ""; return html; }
  let zoom = 1;
  while (zoom > 0.6 && !fits()) {
    zoom = Math.round((zoom - 0.05) * 100) / 100;
    targets.forEach(t => { t.style.zoom = zoom; });
  }
  const out = slide.outerHTML;
  fitBox.innerHTML = "";
  return out;
}

// ---------------------------------------------------------------
// Layout "Seitenleiste": links eine dunkle Leiste mit Logo, großer
// Schrittnummer und Fortschritt, rechts der Inhalt. Die Inhaltsfolien
// werden normal gebaut und dann in diese Form umgebaut.
// ---------------------------------------------------------------
const RAIL_ICONS = {
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7M8 11h7"/></svg>`,
  quiz: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/></svg>`,
  done: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>`
};

function isRail(theme) { return theme.layout === "rail"; }

function railHtml(theme, info) {
  const dots = info.dots ? `<div class="r-dots">${Array.from({ length: info.dots.count }, (_, k) =>
    `<i${k < info.dots.filled ? ` class="on"` : ""}></i>`).join("")}</div>` : "";
  return `
    <div class="r-rail">
      <div class="r-logo">${theme.logo}</div>
      <div>
        <div class="r-big">${info.big}</div>
        ${info.kicker ? `<div class="r-kicker">${escapeHtml(info.kicker)}</div>` : ""}
        <div class="r-title">${escapeHtml(info.title || "")}</div>
      </div>
      <div>${dots}<div class="r-num">${escapeHtml(info.num)}</div></div>
    </div>`;
}

function railify(html, theme, info) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  const sec = tpl.content.firstElementChild;
  sec.querySelectorAll(".l-top, .s-progress, .s-foot, .s-badge").forEach(e => e.remove());
  sec.classList.remove("head-dark");
  sec.classList.add("layout-rail");
  const main = document.createElement("div");
  main.className = "r-main";
  while (sec.firstChild) main.appendChild(sec.firstChild);
  sec.insertAdjacentHTML("afterbegin", railHtml(theme, info));
  sec.appendChild(main);
  return sec.outerHTML;
}

function renderTitleSlideRail(slide, theme, meta, stepCount) {
  const dauerMatch = meta.dauer ? meta.dauer.match(/^(\d+(?:[.,]\d+)?)\s*\D*$/) : null;
  const kpis = [
    [stepCount, L.steps],
    ...(meta.dauer ? [dauerMatch ? [dauerMatch[1], L.minutes] : [meta.dauer, L.duration]] : []),
    ...(meta.version ? [[meta.version, L.version]] : [])
  ].map(([v, l]) => `<div class="tr-kpi"><b>${escapeHtml(v)}</b><span>${l}</span></div>`).join("");
  return `
    <section class="slide t-rail" style="${themeStyle(theme)}">
      <div class="tr-ring"></div>
      <div class="tr-top">
        <div class="tr-logo">${theme.logo}</div>
        <div class="s-kicker">${L.material}${meta.bereich ? " · " + escapeHtml(meta.bereich) : ""}</div>
      </div>
      <div class="tr-mid">
        <h1${src(slide.titleLine)}>${inline(slide.title)}</h1>
        ${meta.untertitel ? `<p class="t-sub"${src(meta.untertitelLine)}>${inline(meta.untertitel)}</p>` : ""}
        ${renderItems(slide.items)}
      </div>
      <div class="tr-bottom">
        <div class="tr-kpis">${kpis}</div>
        ${meta.autor ? `<span class="t-chip"><i>${L.author}</i>${escapeHtml(meta.autor)}</span>` : ""}
      </div>
      <div class="tr-bar"></div>
    </section>`;
}

// Baut die komplette Präsentation: Liste von HTML-Strings (eine pro Folie)
function buildDeck(parsed, theme, qrLink) {
  useLabels(parsed.meta.sprache);
  const titleSlide = parsed.slides.find(s => s.type === "title");
  const meta = {
    ...parsed.meta,
    stepCount: parsed.stepCount,
    trainingTitle: titleSlide ? titleSlide.title : ""
  };
  const total = parsed.slides.length + 1; // + Abschlussfolie
  const rail = isRail(theme);
  // Im Seitenleisten-Layout werden die Folien erst im hellen Layout gebaut
  const base = rail ? { ...theme, layout: "light", headerDark: false } : theme;

  // Fortschritt für die Seitenleiste: wie viele Schritte bis zu dieser Folie
  let stepsSoFar = 0;
  const showDots = parsed.stepCount > 0 && parsed.stepCount <= 12;
  const railInfo = (slide, i) => {
    if (slide && slide.type === "step") stepsSoFar = slide.stepNumber;
    const info = {
      title: meta.trainingTitle,
      num: `${L.slide} ${i + 1} / ${total}`,
      dots: showDots ? { count: parsed.stepCount, filled: slide ? stepsSoFar : parsed.stepCount } : null
    };
    if (!slide) return { ...info, big: RAIL_ICONS.done, kicker: L.summary };
    if (slide.type === "step") return { ...info, big: String(slide.stepNumber).padStart(2, "0"), kicker: stepText(slide.stepNumber, parsed.stepCount) };
    if (slide.type === "quiz") return { ...info, big: RAIL_ICONS.quiz, kicker: L.quiz };
    return { ...info, big: RAIL_ICONS.info, kicker: "" };
  };

  const html = parsed.slides.map((slide, i) => {
    if (slide.type === "title") {
      return rail ? renderTitleSlideRail(slide, theme, meta, parsed.stepCount) : renderTitleSlide(slide, theme, meta, parsed.stepCount);
    }
    const out = slide.type === "quiz" ? renderQuizSlide(slide, base, meta, i, total) : renderContentSlide(slide, base, meta, i, total);
    return rail ? railify(out, theme, railInfo(slide, i)) : out;
  });
  const end = renderEndSlide(parsed, base, meta, total - 1, total, makeQr(meta.link || qrLink));
  html.push(rail ? railify(end, theme, railInfo(null, total - 1)) : end);
  return { html: html.map(fitSlide), meta };
}
