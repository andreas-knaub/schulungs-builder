// ---------------------------------------------------------------
// KI-Assistent: schickt einen Rohtext (z. B. eine Arbeitsanweisung)
// an die Gemini API und bekommt eine fertige Schulung im
// Builder-Format zurück.
//
// Hinweis: Der API-Key wird direkt aus dem Browser verwendet und nur
// im Browser des Nutzers gespeichert. Für einen echten Betrieb würde
// man die Anfrage über ein eigenes Backend leiten (siehe Roadmap).
// ---------------------------------------------------------------

function buildPrompt(rawText) {
  return `Du bist Experte für Schulungsunterlagen in der Fahrzeugmontage.
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

Rohtext:
"""
${rawText}
"""`;
}

async function generateWithGemini({ apiKey, model, rawText }) {
  if (!apiKey) throw new Error("Bitte einen Gemini API-Key eingeben.");
  if (!rawText.trim()) throw new Error("Bitte einen Rohtext eingeben.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(rawText) }] }],
      generationConfig: { temperature: 0.4 }
    })
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
