// ---------------------------------------------------------------
// Parser: wandelt den Schulungstext in Folien-Objekte um.
//
// Syntax:
//   ---                 neue Folie
//   # Titel             Titelfolie
//   ## Titel            normale Inhaltsfolie
//   ## Schritt: Titel   Arbeitsschritt (wird automatisch nummeriert)
//   - Text              Aufzählungspunkt
//   ! Text              Sicherheitshinweis
//   > Text              Tipp / Qualitätshinweis
//   bild: URL           Bild auf der Folie
//   ? Frage             Quizfrage, danach Antworten:
//   [x] Antwort         richtige Antwort
//   [ ] Antwort         falsche Antwort
//   schlüssel: wert     Metadaten auf der Titelfolie
//                       (untertitel, bereich, dauer, version, autor, link)
//   sonstiger Text      normaler Absatz
// ---------------------------------------------------------------

const META_KEYS = ["untertitel", "bereich", "dauer", "version", "autor", "link", "sprache"];

// Jede bearbeitbare Stelle merkt sich ihre Zeilennummer im Text (line)
// und alles, was vor dem eigentlichen Inhalt steht (prefix, z. B. "- ").
// So kann man direkt auf der Folie tippen und der Text ändert sich mit.
function parseTraining(source) {
  const allLines = source.replace(/\r/g, "").split("\n");
  const slides = [];
  const meta = {};
  const srcLines = {}; // Zeilennummer -> { prefix, kind }
  let stepCount = 0;

  // Präfix = alles vor dem Inhalt (der Inhalt ist immer das Ende der Zeile)
  const remember = (no, raw, content, kind) => {
    const full = raw.trimEnd();
    srcLines[no] = { prefix: full.slice(0, full.length - content.length), kind };
    return no;
  };

  // Text in Blöcke zerlegen (--- trennt Folien), Zeilennummern behalten
  const blocks = [[]];
  allLines.forEach((raw, no) => {
    if (/^\s*---\s*$/.test(raw)) blocks.push([]);
    else if (raw.trim()) blocks[blocks.length - 1].push({ raw, no, line: raw.trim() });
  });

  for (const block of blocks) {
    if (block.length === 0) continue;

    const slide = {
      type: "content",   // title | content | step | quiz
      title: "",
      titleLine: null,
      stepNumber: null,
      items: [],         // Reihenfolge der Inhalte: {kind, text, line}
      image: null,
      question: null,
      questionLine: null,
      answers: [],
      firstLine: block[0].no,
      lastLine: block[block.length - 1].no
    };

    for (const { raw, no, line } of block) {
      const metaMatch = line.match(/^([a-zäöü]+):\s*(.+)$/i);
      const screenMatch = line.match(/^(handy|feld|liste|auswahl|foto|button!?|hinweis-app):\s*(.+)$/i);

      if (screenMatch) {
        // Zeilen für den gezeichneten App-Bildschirm
        if (!slide.screen) slide.screen = { app: "", title: "", elements: [] };
        const key = screenMatch[1].toLowerCase();
        const [left, right] = screenMatch[2].split("|").map(s => s.trim());
        if (key === "handy") {
          slide.screen.app = right !== undefined ? left : "";
          slide.screen.title = right !== undefined ? right : left;
        } else if (key === "auswahl") {
          const options = (right !== undefined ? right : left).split(",").map(o => o.trim()).filter(Boolean)
            .map(o => ({ text: o.replace(/^\*/, "").trim(), selected: o.startsWith("*") }));
          slide.screen.elements.push({ kind: "auswahl", label: right !== undefined ? left : "", options });
        } else if (key === "feld" || key === "liste") {
          slide.screen.elements.push({ kind: key, label: right !== undefined ? left : "", value: right !== undefined ? right : left });
        } else if (key === "button" || key === "button!") {
          slide.screen.elements.push({ kind: "button", text: left, highlight: key === "button!" });
        } else {
          slide.screen.elements.push({ kind: key, text: left });
        }
      } else if (line.startsWith("# ")) {
        slide.type = "title";
        slide.title = line.slice(2).trim();
        slide.titleLine = remember(no, raw, slide.title, "title");
      } else if (line.startsWith("## ")) {
        const heading = line.slice(3).trim();
        const step = heading.match(/^schritt:\s*(.+)$/i);
        if (step) {
          stepCount += 1;
          slide.type = "step";
          slide.stepNumber = stepCount;
          slide.title = step[1].trim();
        } else {
          slide.title = heading;
        }
        slide.titleLine = remember(no, raw, slide.title, "title");
      } else if (line.startsWith("? ")) {
        slide.type = "quiz";
        slide.question = line.slice(2).trim();
        slide.questionLine = remember(no, raw, slide.question, "question");
      } else if (/^\[(x|X| )\]/.test(line)) {
        const text = line.slice(3).trim();
        slide.answers.push({ text, correct: line[1].toLowerCase() === "x", line: remember(no, raw, text, "answer") });
      } else if (line.startsWith("- ")) {
        const text = line.slice(2).trim();
        slide.items.push({ kind: "bullet", text, line: remember(no, raw, text, "bullet") });
      } else if (line.startsWith("! ")) {
        const text = line.slice(2).trim();
        slide.items.push({ kind: "warn", text, line: remember(no, raw, text, "warn") });
      } else if (line.startsWith("> ")) {
        const text = line.slice(2).trim();
        slide.items.push({ kind: "tip", text, line: remember(no, raw, text, "tip") });
      } else if (metaMatch && metaMatch[1].toLowerCase() === "bild") {
        slide.image = metaMatch[2].trim();
      } else if (metaMatch && META_KEYS.includes(metaMatch[1].toLowerCase())) {
        const key = metaMatch[1].toLowerCase();
        meta[key] = metaMatch[2].trim();
        if (key === "untertitel") meta.untertitelLine = remember(no, raw, meta[key], "meta");
      } else {
        slide.items.push({ kind: "text", text: line, line: remember(no, raw, line, "text") });
      }
    }

    // Ein Block nur mit Metadaten ergibt keine eigene Folie
    if (!slide.title && !slide.question && slide.items.length === 0 && !slide.image && !slide.screen) continue;
    slides.push(slide);
  }

  return { slides, meta, stepCount, srcLines, lineCount: allLines.length };
}
