// ---------------------------------------------------------------
// Bibliothek: Abteilungen, Stationen und Schulungen.
// Gespeichert im Browser (localStorage). Beim ersten Start wird sie
// mit Beispielen gefüllt, damit sie nicht leer ist.
// Im echten Einsatz käme dieselbe Struktur in eine zentrale Datenbank.
// ---------------------------------------------------------------

const LIBRARY_KEY = "sb.library.v1";

// Symbole für die Abteilungskacheln
const DEPARTMENT_ICONS = {
  montage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/></svg>`,
  karosserie: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 16v-3l2-5h10l4 5h2v3"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6M6 13h14"/></svg>`,
  lack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h10v6H5z"/><path d="M10 9v3M8 12h4v9H8z"/><path d="M18 5h2M18 8h3M18 2h1"/></svg>`,
  logistik: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h11v10H2zM13 10h4l4 4v2h-8"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
  qualitaet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>`,
  instandhaltung: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
  standard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21V8l6-4v4l6-4v4l6-4v17z"/><path d="M7 17h2M11 17h2M15 17h2"/></svg>`
};

const ALL_STATIONS = { id: "alle", code: "Alle Stationen", name: "Gilt für die ganze Abteilung" };

const SEED_DEPARTMENTS = [
  { id: "montage", name: "Montage", icon: "montage", stations: [
    { id: "t-04", code: "T-04", name: "Türverkleidung" },
    { id: "m-12", code: "M-12", name: "Frontscheinwerfer" }, ALL_STATIONS] },
  { id: "karosserie", name: "Karosseriebau", icon: "karosserie", stations: [
    { id: "k-07", code: "K-07", name: "Schweißzelle Seitenwand" }, ALL_STATIONS] },
  { id: "lack", name: "Lackiererei", icon: "lack", stations: [
    { id: "l-02", code: "L-02", name: "Sichtprüfung Decklack" }, ALL_STATIONS] },
  { id: "logistik", name: "Logistik", icon: "logistik", stations: [
    { id: "lg-2", code: "LG-2", name: "Routenzug Montage" }, ALL_STATIONS] },
  { id: "qualitaet", name: "Qualität", icon: "qualitaet", stations: [
    { id: "q-01", code: "Q-01", name: "Finish-Audit" }, ALL_STATIONS] },
  { id: "instandhaltung", name: "Instandhaltung", icon: "instandhaltung", stations: [ALL_STATIONS] }
];

const SEED_SOURCES = {
  scheinwerfer: `# Montage Frontscheinwerfer
untertitel: Scheinwerfer links und rechts sicher und prozessgerecht verbauen
bereich: Montage Front
dauer: 10 Minuten
version: 2.0
autor: Andreas Knaub
---
## Schritt: Teil prüfen
- Schnittschutzhandschuhe anziehen
- Teilenummer auf dem Etikett mit dem Auftrag im Terminal vergleichen
! Bei Abweichung nicht verbauen, sondern die Teamleitung rufen
---
## Schritt: Elektrisch anschließen
- Stecker in den Scheinwerfer stecken, bis er hörbar einrastet
- Sicherungsbügel umlegen
> Häufigster Fehler: vergessener Sicherungsbügel, das Licht fällt später aus
---
## Schritt: Verschrauben
- Scheinwerfer auf die zwei Führungsstifte setzen
- 3 Schrauben M6 mit dem EC-Schrauber, Programm 4, mit **8 Nm** anziehen
- Bei roter Anzeige erneut ansetzen, nach zweimal Rot Nacharbeitskarte ausfüllen
---
## Schritt: Prüfen
- Spaltmaß zur Motorhaube mit der Lehre prüfen: **3 bis 5 mm**
- Lichttest am Prüfstand: Abblend- und Fernlicht müssen angehen
---
## Wissenscheck
? Was tun Sie, wenn die Teilenummer nicht zum Auftrag passt?
[ ] Trotzdem verbauen und notieren
[x] Nicht verbauen und die Teamleitung rufen
[ ] Den Scheinwerfer zurück ins Regal legen
`,
  schichtuebergabe: `# Digitale Schichtübergabe
untertitel: Übergabe im Shopfloor-Board statt im Übergabebuch
bereich: Montage, alle Linien
dauer: 8 Minuten
version: 1.0
autor: Andreas Knaub
---
## Schritt: Übergabe anlegen
- Im Shopfloor-Board auf **Neue Übergabe** tippen
- Linie und Schicht sind bereits vorausgefüllt
handy: Shopfloor-Board | Neue Übergabe
feld: Linie | Montage 2
feld: Schicht | Frühschicht 06:00–14:00
button!: Übergabe starten
---
## Schritt: Kennzahlen und Störungen eintragen
- Stückzahl Soll und Ist eintragen
- Störungen mit Dauer erfassen, ab 15 Minuten eine Ursache wählen
! Keine Namen von Mitarbeitenden eintragen, nur die Station
handy: Shopfloor-Board | Störung erfassen
feld: Station | M-12
feld: Dauer | 22 Minuten
auswahl: Ursache | *Material, Technik, Personal, Qualität
button!: Speichern
---
## Schritt: Übergabe bestätigen
- Die nächste Schicht liest die Übergabe zu Schichtbeginn
- Mit **Gelesen** bestätigen, sonst bleibt sie rot markiert
handy: Shopfloor-Board | Übergabe Frühschicht
hinweis-app: 2 Störungen, 1 offenes Qualitätsthema
feld: Stückzahl | 412 von 420
button!: Gelesen
---
## Wissenscheck
? Ab welcher Dauer muss bei einer Störung eine Ursache gewählt werden?
[ ] Ab 5 Minuten
[x] Ab 15 Minuten
[ ] Ab 60 Minuten
`,
  unterweisung: `# Sicherheitsunterweisung Montage
untertitel: Pflichtunterweisung vor dem ersten Einsatz am Band
bereich: Montage
dauer: 12 Minuten
version: 3.1
autor: Andreas Knaub
---
## Schritt: Schutzausrüstung
- Sicherheitsschuhe S3 sind immer Pflicht
- Schnittschutzhandschuhe bei Blechteilen tragen
- Schutzbrille beim Clipsen von Verkleidungen
! Clips können beim Einsetzen wegspringen
---
## Schritt: Akkuschrauber
- Nur mit dem Programm vom Arbeitsplatzblatt arbeiten
- Akku zu Schichtbeginn tauschen, leere Akkus in die Ladestation
- Defekte Schrauber rot markieren und beim Instandhalter abgeben
---
## Schritt: Im Notfall
- Bei Unfall oder Gefahr die Reißleine ziehen oder Not-Halt drücken
- Danach die Teamleitung informieren
- Ersthelfer und Verbandskasten an Säule B7
! Nie zwischen Gehänge und Fahrzeug greifen, wenn das Band läuft
---
## Wissenscheck
? Was tun Sie mit einem defekten Akkuschrauber?
[ ] Selbst reparieren
[ ] Weiterarbeiten bis Schichtende
[x] Rot markieren und beim Instandhalter abgeben
`,
  schweisszelle: `# Schweißzelle sicher betreten
untertitel: Zugang zur Roboterzelle K-07 nur mit persönlichem Schloss
bereich: Karosseriebau
dauer: 10 Minuten
version: 1.4
autor: Andreas Knaub
---
## Schritt: Zelle freischalten
- Am Bedienpanel die Zelle in den Modus **Wartung** schalten
- Warten, bis alle Roboter in Grundstellung stehen
! Niemals eine laufende Zelle betreten
---
## Schritt: Persönliches Schloss setzen
- Eigenes Schloss am Hauptschalter der Zelle anbringen
- Schlüssel immer bei sich tragen
- Erst dann die Schutztür öffnen
> Jede Person in der Zelle hat ihr eigenes Schloss am Schalter
---
## Schritt: Zelle verlassen
- Werkzeug und Material vollständig entfernen
- Schloss abnehmen und Zelle am Panel quittieren
---
## Wissenscheck
? Wann dürfen Sie die Schutztür öffnen?
[ ] Sobald die Roboter langsamer werden
[x] Wenn die Zelle in Wartung ist und Ihr Schloss gesetzt ist
[ ] Wenn eine Kollegin bereits in der Zelle ist
`,
  routenzug: `# Routenzug sicher fahren
untertitel: Versorgung der Montagelinie mit dem Routenzug
bereich: Logistik
dauer: 10 Minuten
version: 2.2
autor: Andreas Knaub
---
## Schritt: Abfahrtskontrolle
- Bremse, Hupe und Beleuchtung prüfen
- Anhänger richtig gekoppelt und gesichert
! Mit Mängeln nicht losfahren, Fahrzeug sperren und melden
---
## Schritt: Fahren in der Halle
- Nur auf den markierten Fahrwegen fahren
- Höchstgeschwindigkeit in der Halle **6 km/h**
- An Kreuzungen anhalten und Fußgängern Vorrang geben
---
## Schritt: Bahnhof an der Linie
- Am Bahnhof anhalten, Feststellbremse ziehen
- Volle Behälter abstellen, Leergut mitnehmen
> Die Reihenfolge der Bahnhöfe steht auf dem Fahrplan im Display
---
## Wissenscheck
? Wie schnell dürfen Sie in der Halle fahren?
[x] 6 km/h
[ ] 10 km/h
[ ] 15 km/h
`,
  lackpruefung: `# Sichtprüfung Decklack
untertitel: Lackfehler sicher erkennen und markieren
bereich: Lackiererei
dauer: 15 Minuten
version: 1.1
autor: Andreas Knaub
---
## Schritt: Prüfplatz vorbereiten
- Licht im Prüftunnel einschalten
- Saubere, fusselfreie Handschuhe tragen
---
## Schritt: Karosse prüfen
- Flächen in fester Reihenfolge prüfen: Dach, Haube, Seiten, Heck
- Aus etwa 50 cm Abstand und schräg zum Licht schauen
- Auf Einschlüsse, Läufer und Kratzer achten
> Fehler nie mit dem Finger berühren
---
## Schritt: Fehler markieren
- Fehlerstelle mit dem Prüfpunkt-Aufkleber markieren
- Fehler im Terminal mit Fehlerart erfassen
---
## Wissenscheck
? In welchem Abstand prüfen Sie die Lackfläche?
[ ] Direkt mit dem Auge an der Fläche
[x] Etwa 50 cm, schräg zum Licht
[ ] Etwa 3 Meter
`,
  wartungsapp: `# Störung melden mit der Wartungs-App
untertitel: Störungen direkt am Tablet an die Instandhaltung melden
bereich: Instandhaltung
dauer: 6 Minuten
version: 0.9
autor: Andreas Knaub
---
## Schritt: Störung anlegen
- App öffnen und **Neue Störung** antippen
- Anlage per QR-Code an der Maschine scannen
handy: Wartungs-App | Neue Störung
feld: Anlage | Schrauberstation M-12
liste: Priorität | Hoch, Linie steht
foto: Foto der Störung
button!: Störung melden
---
## Schritt: Status verfolgen
- Unter **Meine Meldungen** sehen Sie, wer die Störung bearbeitet
handy: Wartungs-App | Meine Meldungen
feld: M-12 Schrauber | in Bearbeitung
feld: K-07 Roboter 3 | erledigt
button!: Details ansehen
`
};

function libDate(daysAgo) {
  return new Date(Date.now() - daysAgo * 86400000).toISOString();
}

function seedLibrary() {
  const t = (id, department, station, status, source, daysAgo) =>
    ({ id, department, station, status, source, themeId: "", translations: {}, updatedAt: libDate(daysAgo) });
  return {
    version: 1,
    departments: JSON.parse(JSON.stringify(SEED_DEPARTMENTS)),
    trainings: [
      t("tr-tuer", "montage", "t-04", "freigegeben", SAMPLE_TRAINING, 3),
      t("tr-scheinwerfer", "montage", "m-12", "freigegeben", SEED_SOURCES.scheinwerfer, 1),
      t("tr-qualiscan", "montage", "alle", "freigegeben", SAMPLE_SOFTWARE, 0),
      t("tr-uebergabe", "montage", "alle", "freigegeben", SEED_SOURCES.schichtuebergabe, 5),
      t("tr-unterweisung", "montage", "alle", "freigegeben", SEED_SOURCES.unterweisung, 12),
      t("tr-schweiss", "karosserie", "k-07", "freigegeben", SEED_SOURCES.schweisszelle, 8),
      t("tr-lack", "lack", "l-02", "freigegeben", SEED_SOURCES.lackpruefung, 20),
      t("tr-routenzug", "logistik", "lg-2", "freigegeben", SEED_SOURCES.routenzug, 6),
      t("tr-wartung", "instandhaltung", "alle", "entwurf", SEED_SOURCES.wartungsapp, 2)
    ]
  };
}

function loadLibrary() {
  try {
    const data = JSON.parse(localStorage.getItem(LIBRARY_KEY));
    if (data && Array.isArray(data.departments) && Array.isArray(data.trainings)) return data;
  } catch (e) { /* ignorieren */ }
  const seeded = seedLibrary();
  saveLibrary(seeded);
  return seeded;
}

function saveLibrary(lib) {
  try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib)); return true; }
  catch (e) { return false; } // Speicher voll oder blockiert
}

let library = loadLibrary();

function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function slugId(text) {
  return slugify(text).slice(0, 40) || newId("x");
}

function findDepartment(id) { return library.departments.find(d => d.id === id); }
function findStation(dep, id) { return dep ? dep.stations.find(s => s.id === id) : null; }
function findTraining(id) { return library.trainings.find(t => t.id === id); }

// Kurzinfos einer Schulung aus ihrem Text lesen
function trainingInfo(t) {
  const parsed = parseTraining(t.source);
  const titleSlide = parsed.slides.find(s => s.type === "title");
  const hasScreens = parsed.slides.some(s => s.screen);
  return {
    title: titleSlide ? titleSlide.title : "Ohne Titel",
    subtitle: parsed.meta.untertitel || "",
    dauer: parsed.meta.dauer || "",
    version: parsed.meta.version || "",
    steps: parsed.stepCount,
    languages: ["de", ...Object.keys(t.translations || {})],
    type: hasScreens ? "Software" : "Arbeitsablauf"
  };
}
