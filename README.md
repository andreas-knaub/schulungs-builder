# Schulungs-Builder

Erstellt aus einfachem Text automatisch Schulungsunterlagen im Corporate Design. Gedacht für Arbeitsanweisungen in der Produktion: Arbeitsschritte, Sicherheitshinweise und Wissensfragen werden in einheitliche, druckfertige Folien umgewandelt. Mit KI-Assistent (Google Gemini), der aus einem Rohtext eine komplette Schulung erzeugt.

## Funktionen

- **Text rein, Schulung raus:** einfache Syntax, Live-Vorschau aller Folien
- **Corporate Design per Klick:** Logo, Farben und Schrift kommen aus einer Vorlage (`js/themes.js`)
- **Arbeitsschritte automatisch nummeriert**, mit Fortschrittsbalken und „Schritt 2 von 4“
- **Sicherheits- und Qualitätshinweise** als hervorgehobene Boxen
- **Wissenscheck:** interaktive Quizfragen mit Richtig/Falsch-Anzeige
- **Abschlussfolie** mit Zusammenfassung und QR-Code zum Aufruf am Arbeitsplatz
- **KI-Assistent:** Arbeitsanweisung einfügen, Gemini erstellt die Schulung
- **Export:** Präsentationsmodus, PDF und eigenständige HTML-Datei (läuft offline, z. B. auf dem Tablet an der Station)

## Starten

Keine Installation nötig. Entweder `index.html` im Browser öffnen oder einen kleinen lokalen Server starten:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Syntax

```text
# Titel der Schulung
untertitel: Kurzbeschreibung
bereich: Montage Tür
dauer: 15 Minuten
version: 1.0
link: https://...        (wird zum QR-Code auf der Abschlussfolie)
---
## Schritt: Arbeitsplatz vorbereiten
- Schutzhandschuhe anlegen
- Akkuschrauber auf **2,5 Nm** einstellen
! Sicherheitshinweis
> Tipp oder Qualitätshinweis
bild: bilder/schritt1.jpg
---
## Wissenscheck
? Welches Drehmoment ist richtig?
[x] 2,5 Nm
[ ] 4,0 Nm
```

## Aufbau

| Datei | Aufgabe |
|---|---|
| `js/parser.js` | Wandelt den Text in Folien-Objekte um |
| `js/render.js` | Baut aus den Folien-Objekten HTML im gewählten Design |
| `js/themes.js` | Corporate-Design-Vorlagen (Farben, Schrift, Logo) |
| `js/slide-styles.js` | Layout der Folien (1280 × 720 px) |
| `js/exporter.js` | Export als eigenständige HTML-Datei |
| `js/gemini.js` | Anbindung an die Gemini API |
| `js/app.js` | Verbindet Editor, Vorschau, Präsentation und Export |

Inhalt und Design sind bewusst getrennt: Fachleute schreiben nur den Inhalt, das Design kommt automatisch aus der Vorlage.

## KI-Assistent

Für die KI-Funktion wird ein eigener Gemini API-Key benötigt (kostenlos in Google AI Studio). Der Key wird nur im eigenen Browser verwendet und gespeichert, nicht im Code. Für einen produktiven Einsatz würde die Anfrage über ein eigenes Backend laufen, damit der Key nie im Browser liegt.

## Technik

HTML, CSS und JavaScript ohne Framework. Bewusst schlank gehalten, damit das Tool überall läuft und ohne Build-Schritt auf GitHub Pages veröffentlicht werden kann.

Die Unternehmen und Logos in den Vorlagen sind frei erfunden.
