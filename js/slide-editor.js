// ---------------------------------------------------------------
// Builder: Sidebar (Sprache, Folienliste) und Bearbeiten direkt auf
// der Folie. Jede bearbeitbare Stelle auf der Folie hat data-src =
// ihre Zeilennummer im Text. Eine Änderung auf der Folie ändert genau
// diese Zeile im Text. Speichern, PDF und Übersetzen laufen dadurch
// weiter wie bisher über den Text.
// ---------------------------------------------------------------

const ed = {
  mode: "slide",     // slide | all | text
  index: 0,          // aktuelle Folie
  parsed: null,      // letzter Stand des Parsers
  active: null,      // Element, das gerade bearbeitet wird
  original: "",      // Text vor dem Bearbeiten (für Esc)
  deleteArmed: false
};

const ex = {
  stageWrap: $("stage-wrap"), stage: $("stage"), scaler: $("stage-scaler"), pop: $("edit-pop"),
  list: $("slide-list"), count: $("slide-count"), langs: $("lang-buttons"),
  addLine: $("btn-add-line"), delSlide: $("btn-del-slide"),
  modes: { slide: $("mode-slide"), all: $("mode-all"), text: $("mode-text") }
};

const PREFIX = { bullet: "- ", warn: "! ", tip: "> ", text: "" };
const MODE_KEY = "sb.builderMode";

// ---------- Text ändern ----------

function sourceLines() { return els.editor.value.replace(/\r/g, "").split("\n"); }

// Neuen Text übernehmen, so als hätte man im Texteditor getippt
// (damit Übersetzungen und Speichern mitbekommen, was sich geändert hat)
function applySource(lines, focus) {
  els.editor.value = lines.join("\n");
  els.editor.dispatchEvent(new Event("input"));
  clearTimeout(renderTimer);
  store.set(STORAGE.source, els.editor.value);
  render();
  if (focus) focusLine(focus.line, focus.selectAll);
}

// Text eines Elements zurück in die Schreibweise mit **fett** bringen
function readEditable(el) {
  let out = "";
  el.childNodes.forEach(n => {
    if (n.nodeName === "STRONG" || n.nodeName === "B") out += `**${n.textContent}**`;
    else out += n.textContent;
  });
  return out.replace(/\s+/g, " ").trim();
}

function lineInfo(no) { return ed.parsed && ed.parsed.srcLines[no]; }

// Änderung einer Zeile speichern. Leere Zeile = löschen (außer Titel)
function commit(el, then, original = ed.original) {
  const no = Number(el.dataset.src);
  const info = lineInfo(no);
  const text = readEditable(el);
  const lines = sourceLines();
  if (!info || lines[no] === undefined) return;
  const changed = text !== original;

  if (!text && ["bullet", "warn", "tip", "text", "answer"].includes(info.kind)) {
    lines.splice(no, 1);
    applySource(lines, then && then(lines, no, true));
    return;
  }
  if (changed && text) lines[no] = info.prefix + text;
  if (changed || then) applySource(lines, then && then(lines, no, false));
}

function focusLine(no, selectAll) {
  const el = ex.scaler.querySelector(`[data-src="${no}"]`);
  if (!el) return;
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  if (!selectAll) range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// ---------- Folie anzeigen und bearbeitbar machen ----------

function slideLabel(slide) {
  if (!slide) return "Abschluss";
  if (slide.type === "quiz") return slide.title || "Wissenscheck";
  return slide.title || "Ohne Titel";
}

function renderStage() {
  const total = deck.html.length;
  if (!total) {
    ex.scaler.innerHTML = "";
    ex.stage.classList.add("is-empty");
    ex.addLine.disabled = ex.delSlide.disabled = true;
    return;
  }
  ex.stage.classList.remove("is-empty");
  ed.index = Math.max(0, Math.min(total - 1, ed.index));
  ex.scaler.innerHTML = deck.html[ed.index];

  const slide = ed.parsed.slides[ed.index]; // undefined = Abschlussfolie
  ex.scaler.querySelectorAll("[data-src]").forEach(el => {
    el.setAttribute("contenteditable", "plaintext-only");
    if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "true");
    el.classList.add("is-editable");
  });

  ex.addLine.disabled = !slide || slide.type === "title";
  ex.addLine.textContent = slide && slide.type === "quiz" ? "＋ Antwort hinzufügen" : "＋ Zeile hinzufügen";
  ex.delSlide.disabled = !slide;
  ed.deleteArmed = false;
  ex.delSlide.textContent = "Folie löschen";
  ex.delSlide.classList.remove("is-armed");
  hidePop();
  fitStage();
}

function fitStage() {
  const w = ex.stage.clientWidth;
  if (!w) return;
  ex.scaler.style.transform = `scale(${w / 1280})`;
}

function renderSlideList() {
  const total = deck.html.length;
  ex.count.textContent = total ? `· ${total}` : "";
  ex.list.innerHTML = deck.html.map((html, i) => {
    const slide = ed.parsed.slides[i];
    return `<li><div role="button" tabindex="0" class="b-item${i === ed.index ? " is-on" : ""}${slide ? "" : " is-end"}" data-index="${i}" aria-label="Folie ${i + 1}: ${escapeHtml(slideLabel(slide))}">
      <span class="b-num">${i + 1}</span>
      <span class="b-thumb"><span class="b-thumb-in">${html}</span></span>
      <span class="b-name">${escapeHtml(slideLabel(slide))}</span>
    </div></li>`;
  }).join("");
  // Vorschaubilder sollen nichts anklicken oder vorlesen lassen
  ex.list.querySelectorAll(".b-thumb-in").forEach(t => t.setAttribute("inert", ""));
  const on = ex.list.querySelector(".is-on");
  if (on) on.scrollIntoView({ block: "nearest" });
}

function renderLangButtons() {
  ex.langs.innerHTML = LANGUAGES.map(l =>
    `<button type="button" data-lang="${l.code}" class="${l.code === translation.current ? "is-on" : ""}"${langSelect.disabled ? " disabled" : ""}>${l.de}</button>`
  ).join("");
}

// Wird von render() in app.js aufgerufen
function renderBuilder(parsed) {
  ed.parsed = parsed;
  const total = deck.html.length;
  if (ed.index > total - 1) ed.index = Math.max(0, total - 1);
  els.stats.textContent = total
    ? `Folie ${ed.index + 1} von ${total} · ${parsed.stepCount} Schritte`
    : "Noch keine Folien";
  renderSlideList();
  renderLangButtons();
  if (ed.mode === "slide") renderStage();
}

function selectSlide(i) {
  ed.index = i;
  if (ed.mode !== "slide") setMode("slide");
  else render();
}

// ---------- Ansicht wechseln ----------

function setMode(mode) {
  ed.mode = mode;
  store.set(MODE_KEY, mode);
  Object.entries(ex.modes).forEach(([k, el]) => { el.hidden = k !== mode; });
  document.querySelectorAll(".seg [data-mode]").forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-selected", on);
  });
  render();
  if (mode === "all") requestAnimationFrame(fitPreview);
  if (mode === "text") els.editor.focus();
}

// ---------- Leiste über der Zeile ----------

function showPop(el) {
  const info = lineInfo(Number(el.dataset.src));
  const kinds = ["bullet", "warn", "tip", "text"];
  if (!info || !kinds.includes(info.kind)) { hidePop(); return; }
  ex.pop.hidden = false;
  ex.pop.querySelectorAll("[data-kind]").forEach(b => b.classList.toggle("is-on", b.dataset.kind === info.kind));
}

function hidePop() { ex.pop.hidden = true; }

ex.pop.addEventListener("mousedown", e => e.preventDefault()); // Fokus bleibt in der Zeile
ex.pop.addEventListener("click", e => {
  const btn = e.target.closest("[data-kind]");
  if (!btn || !ed.active) return;
  const el = ed.active;
  const no = Number(el.dataset.src);
  const info = lineInfo(no);
  const lines = sourceLines();
  ed.active = null;
  if (btn.dataset.kind === "delete") {
    lines.splice(no, 1);
    applySource(lines);
    return;
  }
  const text = readEditable(el) || "Neuer Punkt";
  // Einrückung vor dem Präfix behalten
  const indent = info.prefix.match(/^\s*/)[0];
  lines[no] = indent + PREFIX[btn.dataset.kind] + text;
  applySource(lines, { line: no });
});

// ---------- Tippen auf der Folie ----------

ex.scaler.addEventListener("focusin", e => {
  const el = e.target.closest("[data-src]");
  if (!el) return;
  ed.active = el;
  ed.original = readEditable(el);
  showPop(el);
});

ex.scaler.addEventListener("focusout", e => {
  const el = e.target.closest("[data-src]");
  if (!el || ed.active !== el) return;
  ed.active = null;
  const original = ed.original;
  // Kurz warten: ein Klick auf eine andere Zeile soll erst ankommen
  setTimeout(() => {
    if (!ex.scaler.contains(document.activeElement)) hidePop();
    if (readEditable(el) === original) return;
    // Wurde schon eine andere Zeile angeklickt? Nach dem Speichern dort weitermachen
    const next = document.activeElement && document.activeElement.closest ? document.activeElement.closest("[data-src]") : null;
    const nextNo = next && next !== el ? Number(next.dataset.src) : null;
    commit(el, (lines, no, removed) => nextNo === null ? null : { line: removed && nextNo > no ? nextNo - 1 : nextNo }, original);
  }, 0);
});

ex.scaler.addEventListener("keydown", e => {
  const el = e.target.closest("[data-src]");
  if (!el) return;
  if (e.key === "Escape") {
    e.preventDefault();
    ed.active = null;
    render(); // Änderung verwerfen
    return;
  }
  if (e.key !== "Enter") return;
  e.preventDefault();
  const info = lineInfo(Number(el.dataset.src));
  ed.active = null;
  // Bei Punkten, Hinweisen und Antworten: neue Zeile darunter
  if (info && ["bullet", "warn", "tip", "text", "answer"].includes(info.kind)) {
    commit(el, (lines, no, removed) => {
      if (removed) return null;
      const indent = info.prefix.match(/^\s*/)[0];
      const prefix = info.kind === "answer" ? indent + "[ ] " : info.kind === "text" ? indent : indent + PREFIX[info.kind];
      lines.splice(no + 1, 0, prefix + (info.kind === "answer" ? "Neue Antwort" : "Neuer Punkt"));
      return { line: no + 1, selectAll: true };
    });
  } else {
    commit(el, () => null);
    el.blur();
  }
});

// Fett per Tastatur (Cmd/Strg + B) ist nicht nötig: **fett** bleibt erhalten

// ---------- Zeile, Folie hinzufügen und löschen ----------

ex.addLine.addEventListener("click", () => {
  const slide = ed.parsed.slides[ed.index];
  if (!slide) return;
  const lines = sourceLines();
  const isQuiz = slide.type === "quiz";
  const at = slide.lastLine + 1;
  lines.splice(at, 0, isQuiz ? "[ ] Neue Antwort" : "- Neuer Punkt");
  applySource(lines, { line: at, selectAll: true });
});

$("btn-add-slide").addEventListener("click", () => {
  const lines = sourceLines();
  const slide = ed.parsed.slides[Math.min(ed.index, ed.parsed.slides.length - 1)];
  const at = slide ? slide.lastLine + 1 : lines.length;
  lines.splice(at, 0, "---", "## Schritt: Neuer Schritt", "- Neuer Punkt");
  ed.index = slide ? Math.min(ed.index, ed.parsed.slides.length - 1) + 1 : 0;
  if (ed.mode !== "slide") setMode("slide");
  applySource(lines, { line: at + 1, selectAll: true });
});

ex.delSlide.addEventListener("click", () => {
  const slide = ed.parsed.slides[ed.index];
  if (!slide) return;
  if (!ed.deleteArmed) {
    ed.deleteArmed = true;
    ex.delSlide.textContent = "Wirklich löschen?";
    ex.delSlide.classList.add("is-armed");
    setTimeout(() => {
      if (!ed.deleteArmed) return;
      ed.deleteArmed = false;
      ex.delSlide.textContent = "Folie löschen";
      ex.delSlide.classList.remove("is-armed");
    }, 3000);
    return;
  }
  const lines = sourceLines();
  let from = slide.firstLine;
  let to = slide.lastLine;
  // Trennlinie davor mitnehmen (bei der ersten Folie die danach)
  let sep = from - 1;
  while (sep >= 0 && !lines[sep].trim()) sep--;
  if (sep >= 0 && /^\s*---\s*$/.test(lines[sep])) from = sep;
  else {
    let after = to + 1;
    while (after < lines.length && !lines[after].trim()) after++;
    if (after < lines.length && /^\s*---\s*$/.test(lines[after])) to = after;
  }
  undoSource = els.editor.value; // für "Rückgängig" in der Meldung
  lines.splice(from, to - from + 1);
  ed.index = Math.max(0, ed.index - 1);
  applySource(lines);
  showToast("Folie gelöscht.", true);
});

// ---------- Navigation ----------

ex.list.addEventListener("click", e => {
  const item = e.target.closest("[data-index]");
  if (item) selectSlide(Number(item.dataset.index));
});
ex.list.addEventListener("keydown", e => {
  const item = e.target.closest("[data-index]");
  if (item && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); selectSlide(Number(item.dataset.index)); }
});

$("btn-prev-slide").addEventListener("click", () => selectSlide(ed.index - 1));
$("btn-next-slide").addEventListener("click", () => selectSlide(ed.index + 1));

document.addEventListener("keydown", e => {
  if (!els.present.hidden || $("view-builder").hidden || ed.mode !== "slide") return;
  if (e.target.closest("input, textarea, select, [contenteditable], dialog")) return;
  if (e.key === "ArrowRight") { e.preventDefault(); selectSlide(ed.index + 1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); selectSlide(ed.index - 1); }
});

document.querySelectorAll(".seg [data-mode]").forEach(b =>
  b.addEventListener("click", () => setMode(b.dataset.mode)));

// In "Alle Folien" öffnet ein Klick die Folie zum Bearbeiten
els.preview.addEventListener("click", e => {
  const frame = e.target.closest(".frame");
  if (!frame) return;
  e.stopImmediatePropagation();
  selectSlide(Number(frame.dataset.index));
}, true);

ex.langs.addEventListener("click", async e => {
  const btn = e.target.closest("[data-lang]");
  if (!btn || btn.dataset.lang === translation.current) return;
  langSelect.value = btn.dataset.lang;
  btn.classList.add("is-loading");
  ex.langs.querySelectorAll("button").forEach(b => { b.disabled = true; });
  await switchLanguage(btn.dataset.lang);
  renderLangButtons();
});

new ResizeObserver(fitStage).observe(ex.stage);

// Start: zuletzt benutzte Ansicht
setMode(["slide", "all", "text"].includes(store.get(MODE_KEY)) ? store.get(MODE_KEY) : "slide");
