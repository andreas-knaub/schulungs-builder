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

function renderContentSlide(slide, theme, meta, index, total) {
  const isStep = slide.type === "step";
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
  const html = parsed.slides.map((slide, i) => {
    if (slide.type === "title") return renderTitleSlide(slide, theme, meta, parsed.stepCount);
    if (slide.type === "quiz") return renderQuizSlide(slide, theme, meta, i, total);
    return renderContentSlide(slide, theme, meta, i, total);
  });
  html.push(renderEndSlide(parsed, theme, meta, total - 1, total, makeQr(meta.link || qrLink)));
  return { html, meta };
}
