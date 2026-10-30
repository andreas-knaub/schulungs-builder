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

const META_KEYS = ["untertitel", "bereich", "dauer", "version", "autor", "link"];

function parseTraining(source) {
  const blocks = source.replace(/\r/g, "").split(/^\s*---\s*$/m);
  const slides = [];
  const meta = {};
  let stepCount = 0;

  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const slide = {
      type: "content",   // title | content | step | quiz
      title: "",
      stepNumber: null,
      items: [],         // Reihenfolge der Inhalte: {kind, text}
      image: null,
      question: null,
      answers: []
    };

    for (const line of lines) {
      const metaMatch = line.match(/^([a-zäöü]+):\s*(.+)$/i);

      if (line.startsWith("# ")) {
        slide.type = "title";
        slide.title = line.slice(2).trim();
      } else if (line.startsWith("## ")) {
        const heading = line.slice(3).trim();
        const step = heading.match(/^schritt:\s*(.+)$/i);
        if (step) {
          stepCount += 1;
          slide.type = "step";
          slide.stepNumber = stepCount;
          slide.title = step[1];
        } else {
          slide.title = heading;
        }
      } else if (line.startsWith("? ")) {
        slide.type = "quiz";
        slide.question = line.slice(2).trim();
      } else if (/^\[(x|X| )\]/.test(line)) {
        slide.answers.push({
          text: line.slice(3).trim(),
          correct: line[1].toLowerCase() === "x"
        });
      } else if (line.startsWith("- ")) {
        slide.items.push({ kind: "bullet", text: line.slice(2).trim() });
      } else if (line.startsWith("! ")) {
        slide.items.push({ kind: "warn", text: line.slice(2).trim() });
      } else if (line.startsWith("> ")) {
        slide.items.push({ kind: "tip", text: line.slice(2).trim() });
      } else if (metaMatch && metaMatch[1].toLowerCase() === "bild") {
        slide.image = metaMatch[2].trim();
      } else if (metaMatch && META_KEYS.includes(metaMatch[1].toLowerCase())) {
        meta[metaMatch[1].toLowerCase()] = metaMatch[2].trim();
      } else {
        slide.items.push({ kind: "text", text: line });
      }
    }

    // Ein Block nur mit Metadaten ergibt keine eigene Folie
    if (!slide.title && !slide.question && slide.items.length === 0 && !slide.image) continue;
    slides.push(slide);
  }

  return { slides, meta, stepCount };
}
