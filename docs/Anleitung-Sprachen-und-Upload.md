# Anleitung: Sprachen und Upload selbst einbauen

**Voraussetzung:** Version 5 ist eingespielt (über dem Editor gibt es den Link „Beispiel Software“).

**So arbeitest du:** Datei in VS Code öffnen, mit **Cmd + F** den Suchtext finden, ersetzen, mit **Cmd + S** speichern. Wenn ein Suchtext nicht gefunden wird: Leerzeichen am Anfang weglassen und nur nach einem eindeutigen Teil suchen.

**Reihenfolge:** Zuerst die drei neuen Dateien anlegen (Teil 1), dann die bestehenden Dateien ändern (Teil 2 bis 8). Erst am Ende testen, vorher funktioniert die Seite eventuell nicht.

---

## Teil 1: Drei neue Dateien anlegen

In VS Code links im Ordner `js` Rechtsklick → **Neue Datei** → Namen eingeben → Code einfügen → speichern.

### 1a) `js/i18n.js`
Was sie macht: Enthält die Sprachen und die festen Beschriftungen auf den Folien („Schritt 1 von 4“, „Sicherheit“ …) in jeder Sprache.

```js
// ---------------------------------------------------------------
// Sprachen: feste Beschriftungen auf den Folien (z. B. "Schritt 2 von 4").
// Den eigentlichen Inhalt übersetzt die KI, diese Texte kommen von hier.
// ---------------------------------------------------------------

const LANGUAGES = [
  { code: "de", target: "Deutsche", name: "Deutsch",     english: "German" },
  { code: "en", target: "Englische", name: "English",     english: "English" },
  { code: "tr", target: "Türkische", name: "Türkçe",      english: "Turkish" },
  { code: "ro", target: "Rumänische", name: "Română",      english: "Romanian" },
  { code: "pl", target: "Polnische", name: "Polski",      english: "Polish" },
  { code: "ru", target: "Russische", name: "Русский",     english: "Russian" },
  { code: "it", target: "Italienische", name: "Italiano",    english: "Italian" }
];

const LABELS = {
  de: { material: "Schulungsunterlage", steps: "Arbeitsschritte", step: "Schritt {n} von {m}", slide: "Folie",
        safety: "Sicherheit", tip: "Hinweis", minutes: "Minuten", duration: "Dauer", version: "Version",
        author: "Erstellt von", area: "Bereich", summary: "Zusammenfassung", done: "Schulung abgeschlossen",
        doneText: "Sie haben alle Inhalte zu {t} durchgearbeitet. Bei Fragen wenden Sie sich an Ihre Teamleitung.",
        warnings: "Sicherheitshinweise", questions: "Wissensfragen", qr: "Schulung am Arbeitsplatz aufrufen",
        quiz: "Wissenscheck" },
  en: { material: "Training material", steps: "Work steps", step: "Step {n} of {m}", slide: "Slide",
        safety: "Safety", tip: "Note", minutes: "Minutes", duration: "Duration", version: "Version",
        author: "Created by", area: "Area", summary: "Summary", done: "Training completed",
        doneText: "You have completed all content of {t}. If you have any questions, please contact your team leader.",
        warnings: "Safety notes", questions: "Quiz questions", qr: "Open this training at the workstation",
        quiz: "Knowledge check" },
  tr: { material: "Eğitim dokümanı", steps: "İş adımları", step: "Adım {n} / {m}", slide: "Slayt",
        safety: "Güvenlik", tip: "Not", minutes: "Dakika", duration: "Süre", version: "Sürüm",
        author: "Hazırlayan", area: "Alan", summary: "Özet", done: "Eğitim tamamlandı",
        doneText: "{t} ile ilgili tüm içerikleri tamamladınız. Sorularınız için ekip liderinize başvurun.",
        warnings: "Güvenlik uyarıları", questions: "Bilgi soruları", qr: "Eğitimi iş istasyonunda açın",
        quiz: "Bilgi kontrolü" },
  ro: { material: "Material de instruire", steps: "Pași de lucru", step: "Pasul {n} din {m}", slide: "Diapozitiv",
        safety: "Siguranță", tip: "Indicație", minutes: "Minute", duration: "Durată", version: "Versiune",
        author: "Creat de", area: "Domeniu", summary: "Rezumat", done: "Instruire finalizată",
        doneText: "Ați parcurs tot conținutul despre {t}. Pentru întrebări, adresați-vă șefului de echipă.",
        warnings: "Instrucțiuni de siguranță", questions: "Întrebări de verificare", qr: "Deschideți instruirea la postul de lucru",
        quiz: "Verificarea cunoștințelor" },
  pl: { material: "Materiał szkoleniowy", steps: "Kroki pracy", step: "Krok {n} z {m}", slide: "Slajd",
        safety: "Bezpieczeństwo", tip: "Wskazówka", minutes: "Minut", duration: "Czas trwania", version: "Wersja",
        author: "Autor", area: "Obszar", summary: "Podsumowanie", done: "Szkolenie zakończone",
        doneText: "Zapoznałeś się z całą treścią szkolenia: {t}. W razie pytań zwróć się do lidera zespołu.",
        warnings: "Wskazówki bezpieczeństwa", questions: "Pytania kontrolne", qr: "Otwórz szkolenie na stanowisku pracy",
        quiz: "Sprawdzenie wiedzy" },
  ru: { material: "Учебный материал", steps: "Рабочие шаги", step: "Шаг {n} из {m}", slide: "Слайд",
        safety: "Безопасность", tip: "Подсказка", minutes: "Минут", duration: "Длительность", version: "Версия",
        author: "Автор", area: "Участок", summary: "Итоги", done: "Обучение завершено",
        doneText: "Вы изучили все материалы по теме «{t}». Если есть вопросы, обратитесь к руководителю бригады.",
        warnings: "Указания по безопасности", questions: "Контрольные вопросы", qr: "Открыть обучение на рабочем месте",
        quiz: "Проверка знаний" },
  it: { material: "Materiale formativo", steps: "Fasi di lavoro", step: "Fase {n} di {m}", slide: "Diapositiva",
        safety: "Sicurezza", tip: "Nota", minutes: "Minuti", duration: "Durata", version: "Versione",
        author: "Creato da", area: "Area", summary: "Riepilogo", done: "Formazione completata",
        doneText: "Hai completato tutti i contenuti di {t}. Per domande rivolgiti al tuo team leader.",
        warnings: "Avvisi di sicurezza", questions: "Domande di verifica", qr: "Apri la formazione alla postazione",
        quiz: "Verifica delle conoscenze" }
};

// Aktuelle Beschriftungen (wird beim Erstellen der Folien gesetzt)
let L = LABELS.de;
function useLabels(code) { L = LABELS[code] || LABELS.de; }
function stepText(n, m) { return L.step.replace("{n}", n).replace("{m}", m); }
```

### 1b) `js/upload.js`
Was sie macht: Steuert die Upload-Fläche im KI-Fenster (Datei auswählen, hineinziehen, prüfen, Vorschau, entfernen) und wandelt die Datei so um, dass sie an Gemini geschickt werden kann.

```js
// ---------------------------------------------------------------
// Upload im KI-Dialog: Foto, Scan oder PDF einer bestehenden
// Arbeitsanweisung. Die Datei geht direkt an Gemini, das sie liest.
// ---------------------------------------------------------------

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif", "application/pdf"];
let uploadedFile = null;

function getUploadedFile() { return uploadedFile; }

(function initUpload() {
  const u = {
    drop: document.getElementById("ai-drop"),
    input: document.getElementById("ai-file"),
    pick: document.getElementById("ai-file-pick"),
    empty: document.getElementById("ai-drop-empty"),
    filled: document.getElementById("ai-drop-file"),
    thumb: document.getElementById("ai-thumb"),
    name: document.getElementById("ai-file-name"),
    meta: document.getElementById("ai-file-meta"),
    remove: document.getElementById("ai-file-remove"),
    textLabel: document.getElementById("ai-text-label")
  };

  function formatSize(bytes) {
    return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
  }

  function showError(text) {
    els.aiStatus.classList.add("error");
    els.aiStatus.textContent = text;
  }

  function clear() {
    uploadedFile = null;
    u.input.value = "";
    u.empty.hidden = false;
    u.filled.hidden = true;
    u.thumb.innerHTML = "";
    u.textLabel.textContent = "Rohtext";
    els.aiText.placeholder = "z. B.: Erst Handschuhe anziehen. Dann Stecker vom Fensterheber einstecken bis er klickt...";
  }

  function handle(file) {
    if (!file) return;
    const type = file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "");
    if (!ALLOWED_TYPES.includes(type)) { showError("Bitte ein Foto (JPG, PNG, WEBP, HEIC) oder ein PDF hochladen."); return; }
    if (file.size > MAX_UPLOAD_BYTES) { showError("Die Datei ist größer als 15 MB."); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      uploadedFile = { mimeType: type, base64: dataUrl.split(",")[1], name: file.name, size: file.size };
      els.aiStatus.textContent = "";
      els.aiStatus.classList.remove("error");
      u.empty.hidden = true;
      u.filled.hidden = false;
      u.name.textContent = file.name;
      u.meta.textContent = `${type === "application/pdf" ? "PDF" : "Bild"} · ${formatSize(file.size)}`;
      u.thumb.innerHTML = type === "application/pdf" || type.includes("hei")
        ? `<span class="drop-pdf">${type === "application/pdf" ? "PDF" : "IMG"}</span>`
        : `<img src="${dataUrl}" alt="">`;
      u.textLabel.textContent = "Zusätzliche Hinweise (optional)";
      els.aiText.placeholder = "z. B.: Bitte Station T-04 nennen und eine Quizfrage zum Drehmoment einbauen.";
    };
    reader.readAsDataURL(file);
  }

  u.pick.addEventListener("click", () => u.input.click());
  u.input.addEventListener("change", () => handle(u.input.files[0]));
  u.remove.addEventListener("click", clear);
  ["dragenter", "dragover"].forEach(ev => u.drop.addEventListener(ev, e => { e.preventDefault(); u.drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach(ev => u.drop.addEventListener(ev, e => { e.preventDefault(); u.drop.classList.remove("is-over"); }));
  u.drop.addEventListener("drop", e => handle(e.dataTransfer.files[0]));
})();
```

### 1c) `js/translate.js`
Was sie macht: Steuert die Auswahl „Sprache“. Sie merkt sich das Original, lässt die KI übersetzen und speichert jede Übersetzung zwischen.

```js
// ---------------------------------------------------------------
// Sprachumschaltung: übersetzt die ganze Schulung per KI.
// Das Original bleibt erhalten, Übersetzungen werden zwischengespeichert,
// damit der Wechsel zwischen Sprachen danach sofort geht.
// ---------------------------------------------------------------

const langSelect = document.getElementById("lang-select");
const translation = { original: null, originalLang: "de", current: "de", cache: {} };

function langOfSource(text) {
  const m = text.match(/^sprache:\s*([a-z]{2})\s*$/mi);
  return m ? m[1].toLowerCase() : "de";
}

// Zeile "sprache: xx" setzen, damit die festen Beschriftungen mitwechseln
function withLangLine(text, code) {
  if (/^sprache:.*$/mi.test(text)) return text.replace(/^sprache:.*$/mi, `sprache: ${code}`);
  return text.replace(/^(# .*)$/m, `$1\nsprache: ${code}`);
}

function resetTranslation() {
  translation.original = null;
  translation.cache = {};
  translation.current = "de";
  translation.originalLang = "de";
  langSelect.value = "de";
}

function showText(text) {
  els.editor.value = text;
  store.set(STORAGE.source, text);
  render();
}

async function switchLanguage(code) {
  if (code === translation.current) return;
  const lang = LANGUAGES.find(l => l.code === code);

  if (translation.original === null) {
    translation.original = els.editor.value;
    translation.originalLang = langOfSource(els.editor.value);
  }

  // Zurück zur Originalsprache oder schon übersetzt: sofort anzeigen
  if (code === translation.originalLang) { showText(translation.original); translation.current = code; return; }
  if (translation.cache[code]) { showText(translation.cache[code]); translation.current = code; return; }

  const apiKey = store.get(STORAGE.apiKey) || els.aiKey.value.trim();
  if (!apiKey) {
    langSelect.value = translation.current;
    showToast("Für die Übersetzung wird ein Gemini API-Key benötigt.");
    openAiDialog();
    return;
  }

  langSelect.disabled = true;
  showToast(`Übersetze nach ${lang.name} …`);
  try {
    const model = store.get(STORAGE.model) || "gemini-2.5-flash";
    let text = await translateWithGemini({ apiKey, model, source: translation.original, languageName: lang.target });
    text = withLangLine(text, code);
    translation.cache[code] = text;
    translation.current = code;
    showText(text);
    showToast(`Schulung auf ${lang.name} übersetzt.`);
  } catch (err) {
    langSelect.value = translation.current;
    showToast(err.message);
  } finally {
    langSelect.disabled = false;
  }
}

(function initLanguages() {
  LANGUAGES.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l.code;
    opt.textContent = l.name;
    langSelect.appendChild(opt);
  });
  const start = langOfSource(els.editor.value);
  langSelect.value = start;
  translation.current = start;
  translation.originalLang = start;

  langSelect.addEventListener("change", () => switchLanguage(langSelect.value));

  // Eigene Änderungen im Editor merken: im Original oder in der Übersetzung
  els.editor.addEventListener("input", () => {
    if (translation.original === null) return;
    if (translation.current === translation.originalLang) {
      translation.original = els.editor.value;
      translation.cache = {}; // Übersetzungen passen nicht mehr zum Original
    } else {
      translation.cache[translation.current] = els.editor.value;
    }
  });
})();
```

---

## Teil 2: `index.html` (4 Änderungen)

**2a) Sprachauswahl in die Kopfzeile.** Suche:

```html
    <button type="button" class="btn" id="btn-design">Design anpassen</button>
```

Füge **direkt darunter** ein:

```html
    <label class="field-inline">
      <span>Sprache</span>
      <select id="lang-select" aria-label="Sprache der Schulung wählen"></select>
    </label>
```

**2b) Upload-Fläche ins KI-Fenster.** Suche diese drei Zeilen (Text beginnt mit „Fügen Sie eine Arbeitsanweisung …“):

```html
    <p class="muted">Fügen Sie eine Arbeitsanweisung, Notizen oder einen Prozessablauf ein. Gemini erstellt daraus eine strukturierte Schulung mit Schritten, Sicherheitshinweisen und Wissensfragen.</p>

    <label class="field">
      <span>Rohtext</span>
```

Ersetze sie durch:

```html
    <p class="muted">Laden Sie eine bestehende Arbeitsanweisung hoch (Foto, Scan oder PDF) oder fügen Sie einen Text ein. Gemini erstellt daraus eine strukturierte Schulung mit Schritten, Sicherheitshinweisen und Wissensfragen.</p>

    <div class="drop" id="ai-drop">
      <input type="file" id="ai-file" accept="image/png,image/jpeg,image/webp,image/heic,application/pdf" hidden>
      <div class="drop-empty" id="ai-drop-empty">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
        <div><b>Arbeitsanweisung hochladen</b><span>Foto, Scan oder PDF hierher ziehen oder <button type="button" class="link-btn" id="ai-file-pick">Datei auswählen</button></span></div>
      </div>
      <div class="drop-file" id="ai-drop-file" hidden>
        <div class="drop-thumb" id="ai-thumb"></div>
        <div class="drop-info"><b id="ai-file-name"></b><span id="ai-file-meta"></span></div>
        <button type="button" class="link-btn" id="ai-file-remove">Entfernen</button>
      </div>
    </div>

    <label class="field">
      <span id="ai-text-label">Rohtext</span>
```

**2c) Neue Sprach-Datei laden.** Suche:

```html
<script src="js/themes.js"></script>
```

Füge **direkt darüber** ein:

```html
<script src="js/i18n.js"></script>
```

**2d) Upload und Übersetzung laden.** Suche:

```html
<script src="js/design-editor.js"></script>
```

Füge **direkt darunter** ein:

```html
<script src="js/upload.js"></script>
<script src="js/translate.js"></script>
```

---

## Teil 3: `js/parser.js` (1 Änderung)

Damit die Zeile `sprache: en` erkannt wird. Suche:

```js
const META_KEYS = ["untertitel", "bereich", "dauer", "version", "autor", "link"];
```

Ersetze durch:

```js
const META_KEYS = ["untertitel", "bereich", "dauer", "version", "autor", "link", "sprache"];
```

---

## Teil 4: `js/render.js` (feste deutsche Texte durch Sprach-Texte ersetzen)

Das Prinzip: Überall, wo bisher ein deutsches Wort fest im Code stand, steht jetzt `L.` plus ein Name, z. B. `L.safety`. `L` kommt aus `i18n.js` und enthält die Wörter in der gewählten Sprache. Bei Nummer 12 bitte mit **Alle ersetzen** arbeiten (in der Suchleiste von VS Code das Symbol rechts neben dem Ersetzen-Feld, oder **Cmd + Option + Enter**), weil der Text viermal vorkommt. Alle anderen Nummern kommen nur einmal vor.

**1.** Suche:

```
<b>Sicherheit</b>
```

Ersetze durch:

```
<b>${L.safety}</b>
```

**2.** Suche:

```
<b>Hinweis</b>
```

Ersetze durch:

```
<b>${L.tip}</b>
```

**3.** Suche:

```
" · " : ""}Folie ${index + 1} / ${total}
```

Ersetze durch:

```
" · " : ""}${L.slide} ${index + 1} / ${total}
```

**4.** Suche:

```
" · Version " + escapeHtml(meta.version)
```

Ersetze durch:

```
" · " + L.version + " " + escapeHtml(meta.version)
```

**5.** Suche:

```
  const dauerZahl = meta.dauer ? meta.dauer.replace(/\s*Minuten?$/i, "") : "";
```

Ersetze durch:

```
  const dauerMatch = meta.dauer ? meta.dauer.match(/^(\d+(?:[.,]\d+)?)\s*\D*$/) : null;
```

**6.** Suche:

```
    [stepCount, "Arbeitsschritte"],
    ...(meta.dauer ? [[dauerZahl, /Minute/i.test(meta.dauer) ? "Minuten" : "Dauer"]] : []),
    ...(meta.version ? [[meta.version, "Version"]] : [])
```

Ersetze durch:

```
    [stepCount, L.steps],
    ...(meta.dauer ? [dauerMatch ? [dauerMatch[1], L.minutes] : [meta.dauer, L.duration]] : []),
    ...(meta.version ? [[meta.version, L.version]] : [])
```

**7.** Suche:

```
<div class="s-kicker">Schulungsunterlage${meta.bereich
```

Ersetze durch:

```
<div class="s-kicker">${L.material}${meta.bereich
```

**8.** Suche:

```
[["Erstellt von", meta.autor]]
```

Ersetze durch:

```
[[L.author, meta.autor]]
```

**9.** Suche:

```
    ["Bereich", meta.bereich], ["Dauer", meta.dauer],
    ["Version", meta.version], ["Erstellt von", meta.autor]
```

Ersetze durch:

```
    [L.area, meta.bereich], [L.duration, meta.dauer],
    [L.version, meta.version], [L.author, meta.autor]
```

**10.** Suche:

```
<div class="t-label">Schulungsunterlage</div>
```

Ersetze durch:

```
<div class="t-label">${L.material}</div>
```

**11.** Suche:

```
<div class="t-steps">${stepCount}<span>Arbeitsschritte</span></div>
```

Ersetze durch:

```
<div class="t-steps">${stepCount}<span>${L.steps}</span></div>
```

**12.** Suche:

```
`Schritt ${slide.stepNumber} von ${meta.stepCount}`
```

Ersetze durch:

```
stepText(slide.stepNumber, meta.stepCount)
```

**13.** Suche:

```
meta.trainingTitle || "Wissenscheck"
```

Ersetze durch:

```
meta.trainingTitle || L.quiz
```

**14.** Suche:

```
slide.title || "Wissenscheck"
```

Ersetze durch:

```
slide.title || L.quiz
```

**15.** Suche:

```
<div class="s-kicker">Zusammenfassung</div>
```

Ersetze durch:

```
<div class="s-kicker">${L.summary}</div>
```

**16.** Suche:

```
<h2 class="s-title">Schulung abgeschlossen</h2>
```

Ersetze durch:

```
<h2 class="s-title">${L.done}</h2>
```

**17.** Suche:

```
<p class="s-p">Sie haben alle Inhalte zu <strong>${escapeHtml(meta.trainingTitle || "dieser Schulung")}</strong> durchgearbeitet. Bei Fragen wenden Sie sich an Ihre Teamleitung.</p>
```

Ersetze durch:

```
<p class="s-p">${escapeHtml(L.doneText).replace("{t}", `<strong>${escapeHtml(meta.trainingTitle || "")}</strong>`)}</p>
```

**18.** Suche:

```
<div class="e-stat"><b>${parsed.stepCount}</b><span>Arbeitsschritte</span></div>
```

Ersetze durch:

```
<div class="e-stat"><b>${parsed.stepCount}</b><span>${L.steps}</span></div>
```

**19.** Suche:

```
<span>Sicherheitshinweise</span>
```

Ersetze durch:

```
<span>${L.warnings}</span>
```

**20.** Suche:

```
<span>Wissensfragen</span>
```

Ersetze durch:

```
<span>${L.questions}</span>
```

**21.** Suche:

```
<span>Schulung am Arbeitsplatz aufrufen</span>
```

Ersetze durch:

```
<span>${L.qr}</span>
```

**22.** Suche:

```
function buildDeck(parsed, theme, qrLink) {
```

Ersetze durch:

```
function buildDeck(parsed, theme, qrLink) {
  useLabels(parsed.meta.sprache);
```


---

## Teil 5: `js/gemini.js` (2 Änderungen)

**5a) Die Funktion `buildPrompt` kann jetzt auch mit einer Datei arbeiten.** Suche:

```js
function buildPrompt(rawText) {
```

Ersetze durch:

```js
function buildPrompt(rawText, hasFile = false) {
```

Suche dann weiter unten in derselben Funktion diese Zeilen (ganz am Ende des Prompts):

```js
Rohtext:
"""
${rawText}
"""`;
}
```

Ersetze sie durch:

```js
${hasFile ? `Quelle: Die Arbeitsanweisung ist als Bild oder PDF angehängt (z. B. ein Foto einer Papier-Anweisung oder ein altes Dokument).
Lies sie vollständig, auch Tabellen, Skizzen, Nummerierungen, Drehmomente und Warnhinweise, und nutze sie als Rohtext.
${rawText.trim() ? `Zusätzliche Hinweise des Erstellers:\n"""\n${rawText}\n"""` : ""}` : `Rohtext:
"""
${rawText}
"""`}`;
}
```

**5b) Neue Funktionen für Anfrage, Datei und Übersetzung.** Markiere alles **ab der Zeile** `async function generateWithGemini` **bis zum Ende der Datei** und ersetze es durch:

```js
// Eine Anfrage an Gemini senden und den Text der Antwort zurückgeben
async function callGemini({ apiKey, model, parts, temperature = 0.4 }) {
  if (!apiKey) throw new Error("Bitte einen Gemini API-Key eingeben.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature } })
  });

  if (!response.ok) {
    let detail = "";
    try { detail = (await response.json()).error?.message || ""; } catch (e) { /* ignorieren */ }
    throw new Error(`Gemini-Fehler ${response.status}${detail ? ": " + detail : ""}`);
  }

  const data = await response.json();
  let text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("");
  // Falls das Modell doch einen Code-Block schickt: entfernen
  text = text.replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/, "").trim();
  if (!text) throw new Error("Die KI hat keinen Text zurückgegeben.");
  return text;
}

// Schulung aus Rohtext und/oder Datei (Foto, Scan, PDF) erstellen
async function generateWithGemini({ apiKey, model, rawText, file }) {
  if (!file && !rawText.trim()) throw new Error("Bitte einen Rohtext eingeben oder eine Datei hochladen.");
  const parts = [];
  if (file) parts.push({ inline_data: { mime_type: file.mimeType, data: file.base64 } });
  parts.push({ text: buildPrompt(rawText, Boolean(file)) });
  return callGemini({ apiKey, model, parts });
}

// Fertige Schulung in eine andere Sprache übersetzen, das Format bleibt erhalten
async function translateWithGemini({ apiKey, model, source, languageName }) {
  const prompt = `Übersetze die folgende Schulung vollständig ins ${languageName}.

Wichtige Regeln:
- Behalte das Format exakt bei: jede Zeile bleibt eine Zeile, Trennlinien --- bleiben stehen.
- Übersetze NICHT die Steuerzeichen und Schlüsselwörter am Zeilenanfang: #, ##, "## Schritt:", -, !, >, ?, [x], [ ], sowie
  untertitel:, bereich:, dauer:, version:, autor:, link:, sprache:, bild:, handy:, feld:, liste:, auswahl:, foto:, hinweis-app:, button:, button!:
- Übersetze den Text NACH diesen Schlüsselwörtern. Trennzeichen | und das Markierungszeichen * bleiben an ihrer Stelle.
- "## Schritt:" bleibt wörtlich so stehen, nur der Titel danach wird übersetzt.
- Zahlen, Einheiten (Nm, mm), Teilenummern, Fahrzeugnummern, Namen und Software-Namen bleiben unverändert.
- Verwende einfache, klare Sprache für Mitarbeitende in der Produktion.
- Antworte nur mit der übersetzten Schulung, ohne Erklärungen und ohne Code-Block.

Schulung:
"""
${source}
"""`;
  return callGemini({ apiKey, model, parts: [{ text: prompt }], temperature: 0.2 });
}
```

---

## Teil 6: `js/app.js` (3 Änderungen)

**6a) Datei an Gemini mitschicken.** Suche:

```js
  els.aiStatus.textContent = "Gemini erstellt die Schulung …";
  try {
    const result = await generateWithGemini({ apiKey, model, rawText: els.aiText.value });
    undoSource = els.editor.value;
```

Ersetze durch:

```js
  const file = getUploadedFile();
  els.aiStatus.textContent = file ? "Gemini liest die Arbeitsanweisung und erstellt die Schulung …" : "Gemini erstellt die Schulung …";
  try {
    const result = await generateWithGemini({ apiKey, model, rawText: els.aiText.value, file });
    undoSource = els.editor.value;
    resetTranslation();
```

**6b) Bei neuem Inhalt die Übersetzungen zurücksetzen.** Suche:

```js
function setSource(text) {
  undoSource = els.editor.value;
```

Ersetze durch:

```js
function setSource(text) {
  undoSource = els.editor.value;
  resetTranslation();
```

**6c) Sprache beim HTML-Export mitgeben.** Suche:

```js
buildStandaloneHtml(deck.html, deck.meta.trainingTitle)
```

Ersetze durch:

```js
buildStandaloneHtml(deck.html, deck.meta.trainingTitle, deck.meta.sprache || "de")
```

---

## Teil 7: `js/exporter.js` (2 Änderungen)

Suche:

```js
function buildStandaloneHtml(deckHtml, title) {
```

Ersetze durch:

```js
function buildStandaloneHtml(deckHtml, title, lang = "de") {
```

Suche ein paar Zeilen darunter:

```html
<html lang="de">
```

Ersetze durch:

```html
<html lang="${escapeHtml(lang)}">
```

---

## Teil 8: `css/app.css` (ans Ende anhängen)

Scrolle ganz nach unten und füge **am Ende** ein:

```css
/* Upload-Fläche im KI-Dialog */
.drop { border: 1.5px dashed #B9BEC7; border-radius: 10px; background: #FAFBFC; padding: 16px; transition: background .15s, border-color .15s; }
.drop.is-over { border-color: var(--ui-ai); background: #F3F0FC; }
.drop-empty { display: flex; align-items: center; gap: 14px; color: var(--ui-muted); }
.drop-empty svg { flex: none; color: var(--ui-ai); }
.drop-empty b, .drop-info b { display: block; color: var(--ui-text); }
.drop-empty .link-btn { padding: 0; }
.drop-file { display: flex; align-items: center; gap: 14px; }
.drop-thumb { width: 56px; height: 56px; flex: none; border-radius: 6px; overflow: hidden; background: #EEF0F3; display: flex; align-items: center; justify-content: center; }
.drop-thumb img { width: 100%; height: 100%; object-fit: cover; }
.drop-pdf { font-weight: 700; font-size: 13px; color: #B3261E; }
.drop-info { flex: 1; min-width: 0; color: var(--ui-muted); }
.drop-info b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Meldungen im Präsentationsmodus oben statt über den Buttons */
.present:not([hidden]) ~ .toast { bottom: auto; top: 24px; }
.drop [hidden] { display: none !important; }
.pane-actions .link-btn { white-space: nowrap; }
.pane-actions { flex-wrap: wrap; justify-content: flex-end; }
```

---

## Testen

1. In GitHub Desktop committen (z. B. `Sprachen und Upload`) und pushen.
2. Seite mit **Cmd + Option + R** neu laden.
3. Oben sollte **„Sprache“** stehen. Auf **English** stellen → die Schulung wird übersetzt.
4. **Mit KI erstellen** → Foto einer Arbeitsanweisung hochladen → **Schulung erzeugen**.

**Wenn die Seite leer bleibt oder nichts reagiert:** In Safari **Entwickler → JavaScript-Konsole einblenden** (oder in Chrome **Cmd + Option + J**). Die rote Fehlermeldung nennt Datei und Zeile. Schick mir einen Screenshot davon.
