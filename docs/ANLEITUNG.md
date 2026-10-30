# Anleitung und 11-Tage-Plan

## Teil 1: Einrichten (Tag 1)

### 1. Programme installieren

1. **VS Code** von code.visualstudio.com installieren.
2. **Git** prüfen: Terminal öffnen und `git --version` eingeben. Auf dem Mac bietet macOS sonst die Installation an.
3. Git deinen Namen und deine E-Mail sagen (nur einmal nötig):

```bash
git config --global user.name "Andreas Knaub"
git config --global user.email "deine@email.de"
```

### 2. GitHub-Account

1. Auf github.com registrieren, mit einem seriösen Namen (z. B. `andreas-knaub`).
2. Profil ausfüllen: Foto, Name, „Wirtschaftsinformatik @ OTH Regensburg“.
3. **GitHub Desktop** installieren (desktop.github.com). Das ist am Anfang einfacher als das Terminal.

### 3. Projekt auf GitHub bringen

1. Den Ordner `schulungs-builder` an einen festen Ort legen, z. B. `Dokumente/Projekte/`.
2. In GitHub Desktop: **File → Add local repository** → Ordner auswählen → „create a repository“ bestätigen.
3. Unten links eine Commit-Nachricht schreiben, z. B. `Erste Version des Schulungs-Builders`, dann **Commit to main**.
4. Oben **Publish repository**. Haken bei „Keep this code private“ **entfernen**, damit BMW es sehen kann.

### 4. Online stellen mit GitHub Pages

1. Auf github.com dein Repository öffnen → **Settings → Pages**.
2. Bei „Source“: **Deploy from a branch**, Branch **main**, Ordner **/ (root)** → Save.
3. Nach 1–2 Minuten läuft das Tool unter `https://<dein-name>.github.io/schulungs-builder/`.
4. Diesen Link in die README und später in den Lebenslauf unter „Projekte“ schreiben.

Ab jetzt gilt bei jeder Änderung: in GitHub Desktop committen und **Push origin**. GitHub Pages aktualisiert sich automatisch.

### 5. Gemini API-Key

1. aistudio.google.com öffnen → **Get API key** → Key erstellen.
2. Im Builder auf **Mit KI erstellen** klicken und den Key einfügen.
3. **Wichtig:** Den Key niemals in eine Datei im Projekt schreiben. Er liegt nur in deinem Browser.

---

## Teil 2: Der 11-Tage-Plan

| Tag | Ziel | Ergebnis |
|---|---|---|
| 1 | Einrichten (Teil 1) | Tool läuft online unter deinem GitHub-Link |
| 2 | Code verstehen | Du kannst jede Datei in 2 Sätzen erklären |
| 3 | KI-Funktion testen und verbessern | 3 echte Testläufe mit unterschiedlichen Rohtexten |
| 4 | Bilder per Drag & Drop | Fotos direkt auf eine Folie ziehen |
| 5 | Design-Editor | Eigenes Corporate Design per Formular anlegen (Logo hochladen, Farben wählen) |
| 6 | Schulungs-Bibliothek | Mehrere Schulungen speichern, öffnen, duplizieren, mit Änderungsdatum |
| 7 | Mehrsprachigkeit per KI | Schulung mit einem Klick auf Englisch, Türkisch, Rumänisch … übersetzen |
| 8 | Sicherer KI-Zugang (optional) | API-Key über ein kleines Backend statt im Browser |
| 9 | Feinschliff | Tablet-Ansicht, README mit Screenshots, Fehlerfälle |
| 10 | Gesprächsvorbereitung | Demo-Ablauf und Antworten auf typische Fragen |
| 11 | Puffer und Probelauf | Komplette Demo zweimal laut durchspielen |

**Arbeitsweise:** Jeden Tag am Ende committen und pushen. Ein sauberer Commit-Verlauf über 11 Tage zeigt im Gespräch, dass du strukturiert arbeitest.

---

## Teil 3: Die Demo im Gespräch (3–4 Minuten)

1. **Problem (30 Sek.):** Schulungsunterlagen in der Produktion werden oft von Hand in PowerPoint gebaut. Sie sehen jedes Mal anders aus, veralten schnell und sind am Band schlecht abrufbar.
2. **Idee (30 Sek.):** Inhalt und Design trennen. Fachleute schreiben nur den Inhalt, das Corporate Design kommt automatisch.
3. **Live-Demo (2 Min.):**
   - Rohtext einer Arbeitsanweisung einfügen → **Mit KI erstellen**
   - Design wechseln → alles passt sich sofort an
   - Präsentationsmodus mit Quiz zeigen
   - HTML-Export und QR-Code: Schulung direkt am Tablet an der Station
4. **Ausblick (30 Sek.):** Anbindung an bestehende Systeme, Freigabeprozess, Nachweis, wer die Schulung absolviert hat, Übersetzung für mehrsprachige Teams.

### Fragen, auf die du vorbereitet sein solltest

- **Warum ohne Framework?** Läuft überall, kein Build-Schritt, einfach zu warten. Bei mehr Umfang würde ich auf React oder ein Tool wie Oracle APEX wechseln.
- **Wie sicher ist der API-Key?** Im Prototyp liegt er nur im Browser des Nutzers. Produktiv würde die Anfrage über ein eigenes Backend laufen.
- **Was passiert, wenn die KI Unsinn schreibt?** Das Ergebnis ist immer bearbeitbarer Text. Der Mensch prüft und gibt frei. Im Prompt steht ausdrücklich, keine Fakten zu erfinden.
- **Wie würdest du das bei uns einführen?** Mit einer Pilotstation anfangen, Feedback der Mitarbeitenden einholen, dann ausrollen.
- **Was war die größte Schwierigkeit?** Ehrlich antworten, z. B. das Folienlayout so zu bauen, dass es in Vorschau, Präsentation, PDF und Export identisch aussieht.
