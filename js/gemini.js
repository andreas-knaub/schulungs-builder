// ---------------------------------------------------------------
// KI-Assistent: schickt einen Rohtext (z. B. eine Arbeitsanweisung)
// an die Gemini API und bekommt eine fertige Schulung im
// Builder-Format zurück.
//
// Hinweis: Der API-Key wird direkt aus dem Browser verwendet und nur
// im Browser des Nutzers gespeichert. Für einen echten Betrieb würde
// man die Anfrage über ein eigenes Backend leiten (siehe Roadmap).
// ---------------------------------------------------------------

function buildPrompt(rawText, hasFile = false) {
  return `Du bist Experte für Schulungsunterlagen in der Produktion, sowohl für Arbeitsabläufe als auch für die Einführung neuer Software am Shopfloor.
Erstelle aus dem folgenden Rohtext eine klare, praxisnahe Schulung für Mitarbeitende am Band.

Antworte AUSSCHLIESSLICH im folgenden Textformat, ohne Erklärungen und ohne Code-Block:

# <Titel der Schulung>
untertitel: <ein Satz, worum es geht>
bereich: <Bereich, z. B. Montage Tür>
dauer: <geschätzte Dauer, z. B. 15 Minuten>
version: 1.0
---
## Lernziele
- <Lernziel 1>
- <Lernziel 2>
---
## Schritt: <kurzer Titel des Arbeitsschritts>
- <konkrete Handlung, kurz und aktiv formuliert>
- <weitere Handlung>
! <Sicherheitshinweis, nur wenn relevant>
> <Qualitäts- oder Praxistipp, nur wenn relevant>
---
(weitere Schritte im selben Format, ein Schritt pro Folie, maximal 4 Punkte pro Schritt)
---
## Wissenscheck
? <Frage zum Inhalt>
[x] <richtige Antwort>
[ ] <falsche Antwort>
[ ] <falsche Antwort>

Regeln:
- Trenne Folien immer mit einer Zeile, die nur --- enthält.
- Erstelle am Ende 1 bis 2 Wissensfragen mit je 3 bis 4 Antworten, genau eine richtig.
- Schreibe auf Deutsch, in einfacher Sprache, Sie-Form.
- Erfinde keine Fakten, die nicht im Rohtext stehen. Wenn etwas fehlt, lass es weg.

App-Bildschirme (NUR wenn es um eine Software, App oder ein Tablet-/PC-Programm geht):
Füge bei Schritten, die in der Software stattfinden, unter den Punkten einen gezeichneten Bildschirm hinzu:
handy: <App-Name> | <Name der Seite>
feld: <Beschriftung> | <Beispielwert>
liste: <Beschriftung> | <ausgewählter Eintrag>
auswahl: <Beschriftung> | *<gewählte Option>, <Option>, <Option>
foto: <Text auf der Foto-Fläche>
hinweis-app: <kurzer Infotext in der App>
button!: <Button, auf den in diesem Schritt getippt wird>
button: <weiterer Button>
- Nutze pro Bildschirm 2 bis 5 Elemente und genau einen button!.
- Schreibe bei feld: und liste: immer einen konkreten, realistischen Beispielwert (z. B. 5UX-48213 oder Tür vorne links), niemals Platzhalter wie [Symbol], <Wert> oder "Hier eingeben".
- Beispielwerte (z. B. eine Fahrzeugnummer) dürfen erfunden sein, die Bedienschritte müssen zum Rohtext passen.
- Bei reinen Handarbeitsschritten ohne Software lass die Bildschirm-Zeilen weg.

${hasFile ? `Quelle: Die Arbeitsanweisung ist als Bild oder PDF angehängt (z. B. ein Foto einer Papier-Anweisung oder ein altes Dokument).
Lies sie vollständig, auch Tabellen, Skizzen, Nummerierungen, Drehmomente und Warnhinweise, und nutze sie als Rohtext.
${rawText.trim() ? `Zusätzliche Hinweise des Erstellers:\n"""\n${rawText}\n"""` : ""}` : `Rohtext:
"""
${rawText}
"""`}`;
}

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
