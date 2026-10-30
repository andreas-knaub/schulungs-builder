// ---------------------------------------------------------------
// App: verbindet Editor, Vorschau, Präsentation, Export und KI.
// ---------------------------------------------------------------

const STORAGE = {
  source: "sb.source",
  theme: "sb.theme",
  apiKey: "sb.geminiKey",
  model: "sb.geminiModel"
};

// localStorage kann in manchen Browsern blockiert sein: immer absichern
const store = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignorieren */ } },
  remove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignorieren */ } }
};

const $ = id => document.getElementById(id);
const els = {
  editor: $("editor"), preview: $("preview"), stats: $("stats"),
  themeSelect: $("theme-select"),
  present: $("present"), presentHolder: $("present-holder"), pCount: $("p-count"),
  printRoot: $("print-root"),
  aiDialog: $("ai-dialog"), aiForm: $("ai-form"), aiText: $("ai-text"), aiKey: $("ai-key"),
  aiModel: $("ai-model"), aiRemember: $("ai-remember"), aiStatus: $("ai-status"), aiRun: $("ai-run"),
  toast: $("toast"), toastText: $("toast-text"), toastUndo: $("toast-undo")
};

let deck = { html: [], meta: {} };
let presentIndex = 0;
let undoSource = null;

// Folien-CSS einmalig in die Seite einfügen
(function injectSlideCss() {
  const style = document.createElement("style");
  style.textContent = SLIDE_CSS;
  document.head.appendChild(style);
})();

// ---------- Rendering ----------

function currentQrLink() {
  // Läuft die App online (z. B. GitHub Pages), zeigt der QR-Code auf diese Seite
  return location.protocol.startsWith("http") ? location.href.split("#")[0] : "";
}

function render() {
  const parsed = parseTraining(els.editor.value);
  const theme = getTheme(els.themeSelect.value);
  deck = buildDeck(parsed, theme, currentQrLink());

  if (parsed.slides.length === 0) {
    els.preview.innerHTML = `<p class="empty">Noch kein Inhalt. Schreiben Sie links los, laden Sie das Beispiel oder nutzen Sie „Mit KI erstellen“.</p>`;
  } else {
    els.preview.innerHTML = deck.html.map((html, i) => `
      <div class="frame" tabindex="0" role="button" data-index="${i}" aria-label="Folie ${i + 1} präsentieren">
        <div class="scaler">${html}</div>
        <span class="frame-num">${i + 1}</span>
      </div>`).join("");
  }

  els.stats.textContent = `${deck.html.length} Folien · ${parsed.stepCount} Schritte`;
  fitPreview();
  if (!els.present.hidden) showPresentSlide(presentIndex);
}

function fitPreview() {
  els.preview.querySelectorAll(".frame").forEach(frame => {
    const scale = frame.clientWidth / 1280;
    frame.querySelector(".scaler").style.transform = `scale(${scale})`;
  });
}

let renderTimer = null;
function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    store.set(STORAGE.source, els.editor.value);
    render();
  }, 200);
}

// ---------- Präsentationsmodus ----------

function openPresentation(index = 0) {
  if (deck.html.length === 0) return;
  els.present.hidden = false;
  showPresentSlide(index);
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function closePresentation() {
  els.present.hidden = true;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

function showPresentSlide(index) {
  presentIndex = Math.max(0, Math.min(deck.html.length - 1, index));
  els.presentHolder.innerHTML = deck.html[presentIndex];
  els.pCount.textContent = `${presentIndex + 1} / ${deck.html.length}`;
  fitPresentation();
}

function fitPresentation() {
  const scale = Math.min(window.innerWidth / 1280, (window.innerHeight - 72) / 720);
  els.presentHolder.style.transform = `scale(${scale})`;
}

document.addEventListener("keydown", e => {
  if (els.present.hidden) return;
  if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); showPresentSlide(presentIndex + 1); }
  if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); showPresentSlide(presentIndex - 1); }
  if (e.key === "Escape") closePresentation();
});

// ---------- Quiz: Antwort anklicken zeigt richtig / falsch ----------

document.addEventListener("click", e => {
  const option = e.target.closest(".q-opt");
  if (!option) return;
  e.stopPropagation();
  const group = option.closest(".q-opts");
  group.querySelectorAll(".q-opt").forEach(o => {
    if (o.dataset.correct === "true") o.classList.add("is-correct");
  });
  if (option.dataset.correct !== "true") option.classList.add("is-wrong");
}, true);

// ---------- Export ----------

function exportPdf() {
  if (deck.html.length === 0) return;
  els.printRoot.innerHTML = deck.html.join("");
  window.print();
}

function exportHtml() {
  if (deck.html.length === 0) return;
  const html = buildStandaloneHtml(deck.html, deck.meta.trainingTitle);
  downloadFile(`${slugify(deck.meta.trainingTitle)}.html`, html, "text/html");
  showToast("HTML-Datei wurde heruntergeladen.");
}

// ---------- KI-Assistent ----------

function openAiDialog() {
  els.aiKey.value = store.get(STORAGE.apiKey) || "";
  els.aiRemember.checked = Boolean(store.get(STORAGE.apiKey));
  els.aiModel.value = store.get(STORAGE.model) || els.aiModel.value;
  els.aiStatus.textContent = "";
  els.aiStatus.classList.remove("error");
  els.aiDialog.showModal();
}

async function runAi(e) {
  e.preventDefault();
  const apiKey = els.aiKey.value.trim();
  const model = els.aiModel.value.trim() || "gemini-2.5-flash";

  if (els.aiRemember.checked) store.set(STORAGE.apiKey, apiKey); else store.remove(STORAGE.apiKey);
  store.set(STORAGE.model, model);

  els.aiRun.disabled = true;
  els.aiStatus.classList.remove("error");
  els.aiStatus.textContent = "Gemini erstellt die Schulung …";
  try {
    const result = await generateWithGemini({ apiKey, model, rawText: els.aiText.value });
    undoSource = els.editor.value;
    els.editor.value = result;
    store.set(STORAGE.source, result);
    render();
    els.aiDialog.close();
    showToast("Schulung wurde mit KI erstellt.", true);
  } catch (err) {
    els.aiStatus.classList.add("error");
    els.aiStatus.textContent = err.message;
  } finally {
    els.aiRun.disabled = false;
  }
}

// ---------- Kleine Helfer ----------

let toastTimer = null;
function showToast(text, withUndo = false) {
  els.toastText.textContent = text;
  els.toastUndo.hidden = !withUndo;
  els.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { els.toast.hidden = true; }, 6000);
}

function setSource(text) {
  undoSource = els.editor.value;
  els.editor.value = text;
  store.set(STORAGE.source, text);
  render();
}

// ---------- Start ----------

function init() {
  THEMES.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name;
    els.themeSelect.appendChild(opt);
  });
  els.themeSelect.value = store.get(STORAGE.theme) || THEMES[0].id;
  els.editor.value = store.get(STORAGE.source) ?? SAMPLE_TRAINING;

  els.editor.addEventListener("input", scheduleRender);
  els.themeSelect.addEventListener("change", () => { store.set(STORAGE.theme, els.themeSelect.value); render(); });

  $("btn-present").addEventListener("click", () => openPresentation(0));
  $("btn-pdf").addEventListener("click", exportPdf);
  $("btn-html").addEventListener("click", exportHtml);
  $("btn-ai").addEventListener("click", openAiDialog);
  $("btn-sample").addEventListener("click", () => { setSource(SAMPLE_TRAINING); showToast("Beispiel geladen.", true); });
  $("btn-clear").addEventListener("click", () => { setSource(""); showToast("Inhalt geleert.", true); });

  $("p-prev").addEventListener("click", () => showPresentSlide(presentIndex - 1));
  $("p-next").addEventListener("click", () => showPresentSlide(presentIndex + 1));
  $("p-close").addEventListener("click", closePresentation);

  els.aiForm.addEventListener("submit", runAi);
  $("ai-cancel").addEventListener("click", () => els.aiDialog.close());

  els.toastUndo.addEventListener("click", () => {
    if (undoSource === null) return;
    els.editor.value = undoSource;
    store.set(STORAGE.source, undoSource);
    undoSource = null;
    els.toast.hidden = true;
    render();
  });

  // Klick oder Enter auf eine Vorschau-Folie startet die Präsentation dort
  els.preview.addEventListener("click", e => {
    const frame = e.target.closest(".frame");
    if (frame) openPresentation(Number(frame.dataset.index));
  });
  els.preview.addEventListener("keydown", e => {
    const frame = e.target.closest(".frame");
    if (frame && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openPresentation(Number(frame.dataset.index)); }
  });

  window.addEventListener("resize", () => { fitPreview(); if (!els.present.hidden) fitPresentation(); });
  new ResizeObserver(fitPreview).observe(els.preview);
  window.addEventListener("afterprint", () => { els.printRoot.innerHTML = ""; });

  render();
}

init();
