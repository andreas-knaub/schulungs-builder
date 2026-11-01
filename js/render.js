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

function renderItems(items) {
  let html = "";
  let list = [];
  const flush = () => {
    if (list.length) html += `<ul class="s-list">${list.map(t => `<li><span>${inline(t)}</span></li>`).join("")}</ul>`;
    list = [];
  };
  for (const item of items) {
    if (item.kind === "bullet") { list.push(item.text); continue; }
    flush();
    if (item.kind === "text") html += `<p class="s-p">${inline(item.text)}</p>`;
  }
  flush();
  return html;
}

function renderBoxes(items) {
  return items
    .filter(i => i.kind === "warn" || i.kind === "tip")
    .map(i => i.kind === "warn"
      ? `<div class="s-box s-warn">${ICONS.warn}<div><b>Sicherheit</b>${inline(i.text)}</div></div>`
      : `<div class="s-box s-tip">${ICONS.tip}<div><b>Hinweis</b>${inline(i.text)}</div></div>`)
    .join("");
}

function footer(theme, meta, index, total, stepLabel = "") {
  const pct = ((index + 1) / total) * 100;
  if (isLight(theme)) {
    // Kopfleiste oben (per CSS nach oben sortiert): Logo links, Titel und Position rechts
    return `
    <div class="l-top">
      <div class="l-logo">${theme.logo}</div>
      <div class="l-meta"><b>${escapeHtml(meta.trainingTitle || "")}</b>${stepLabel ? escapeHtml(stepLabel) + " · " : ""}Folie ${index + 1} / ${total}</div>
    </div>
    <div class="s-progress" style="width:${pct.toFixed(2)}%"></div>`;
  }
  return `
    <div class="s-foot">
      <div class="s-logo">${theme.logo}</div>
      <div>${escapeHtml(meta.trainingTitle || "")}${meta.version ? " · Version " + escapeHtml(meta.version) : ""}</div>
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
  const dauerZahl = meta.dauer ? meta.dauer.replace(/\s*Minuten?$/i, "") : "";
  const kpis = [
    [stepCount, "Arbeitsschritte"],
    ...(meta.dauer ? [[dauerZahl, /Minute/i.test(meta.dauer) ? "Minuten" : "Dauer"]] : []),
    ...(meta.version ? [[meta.version, "Version"]] : [])
  ].map(([v, l]) => `<div class="tl-kpi"><b>${escapeHtml(v)}</b><span>${l}</span></div>`).join("");

  return `
    <section class="${slideClass(theme, "t-light")}" style="${themeStyle(theme)}">
      <div class="tl-logo-area"><div class="tl-logo">${theme.logo}</div></div>
      <div class="tl-main">
        <div class="s-kicker">Schulungsunterlage${meta.bereich ? " · " + escapeHtml(meta.bereich) : ""}</div>
        <h1>${inline(slide.title)}</h1>
        ${meta.untertitel ? `<p class="t-sub">${inline(meta.untertitel)}</p>` : ""}
        ${renderItems(slide.items)}
        <div class="tl-kpis">${kpis}</div>
        ${chips ? `<div class="t-meta">${chips}</div>` : ""}
      </div>
      <div class="tl-bar"></div>
    </section>`;
}

function renderTitleSlide(slide, theme, meta, stepCount) {
  if (isLight(theme)) {
    const lightChips = [["Erstellt von", meta.autor]].filter(([, v]) => v)
      .map(([k, v]) => `<span class="t-chip"><i>${k}</i>${escapeHtml(v)}</span>`).join("");
    return renderTitleSlideLight(slide, theme, meta, stepCount, lightChips);
  }
  const chips = [
    ["Bereich", meta.bereich], ["Dauer", meta.dauer],
    ["Version", meta.version], ["Erstellt von", meta.autor]
  ].filter(([, v]) => v)
   .map(([k, v]) => `<span class="t-chip"><i>${k}</i>${escapeHtml(v)}</span>`).join("");

  return `
    <section class="slide t-title" style="${themeStyle(theme)}">
      <div class="t-band">
        <div class="s-logo">${theme.logo}</div>
        <div>
          <div class="t-label">Schulungsunterlage</div>
        </div>
        <div class="t-steps">${stepCount}<span>Arbeitsschritte</span></div>
      </div>
      <div class="t-main">
        <h1>${inline(slide.title)}</h1>
        ${meta.untertitel ? `<p class="t-sub">${inline(meta.untertitel)}</p>` : ""}
        ${renderItems(slide.items)}
        ${chips ? `<div class="t-meta">${chips}</div>` : ""}
      </div>
    </section>`;
}

function renderContentSlide(slide, theme, meta, index, total) {
  const isStep = slide.type === "step";
  const main = renderItems(slide.items);
  const boxes = renderBoxes(slide.items);
  const image = slide.image ? `<img class="s-img" src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.title)}">` : "";

  // Mit Bild: Text + Hinweise links, Bild rechts.
  // Ohne Bild: Text links, Hinweise rechts.
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
          <div class="s-kicker">${isStep ? `Schritt ${slide.stepNumber} von ${meta.stepCount}` : escapeHtml(meta.trainingTitle || "")}</div>
          <h2 class="s-title">${inline(slide.title)}</h2>
        </div>
        ${headLogo(theme)}
      </div>
      ${body}
      ${footer(theme, meta, index, total, isStep ? `Schritt ${slide.stepNumber} von ${meta.stepCount}` : "")}
    </section>`;
}

function renderQuizSlide(slide, theme, meta, index, total) {
  const letters = "ABCDEF";
  const opts = slide.answers.map((a, i) => `
    <button type="button" class="q-opt" data-correct="${a.correct}">
      <span class="q-letter">${letters[i] || "•"}</span><span>${inline(a.text)}</span>
    </button>`).join("");

  return `
    <section class="${slideClass(theme)}" style="${themeStyle(theme)}">
      <div class="s-head">
        <div>
          <div class="s-kicker">${escapeHtml(meta.trainingTitle || "Wissenscheck")}</div>
          <h2 class="s-title">${inline(slide.title || "Wissenscheck")}</h2>
        </div>
        ${headLogo(theme)}
      </div>
      <div class="s-body single">
        <div class="s-col">
          <p class="q-question">${inline(slide.question)}</p>
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
          <div class="s-kicker">Zusammenfassung</div>
          <h2 class="s-title">Schulung abgeschlossen</h2>
        </div>
        ${headLogo(theme)}
      </div>
      <div class="e-grid${qrSvg ? "" : " no-qr"}">
        <div>
          <p class="s-p">Sie haben alle Inhalte zu <strong>${escapeHtml(meta.trainingTitle || "dieser Schulung")}</strong> durchgearbeitet. Bei Fragen wenden Sie sich an Ihre Teamleitung.</p>
          <div class="e-stats">
            <div class="e-stat"><b>${parsed.stepCount}</b><span>Arbeitsschritte</span></div>
            <div class="e-stat"><b>${warnCount}</b><span>Sicherheitshinweise</span></div>
            <div class="e-stat"><b>${quizCount}</b><span>Wissensfragen</span></div>
          </div>
        </div>
        ${qrSvg ? `<div class="e-qr">${qrSvg}<span>Schulung am Arbeitsplatz aufrufen</span></div>` : ""}
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
