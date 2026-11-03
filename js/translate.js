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
