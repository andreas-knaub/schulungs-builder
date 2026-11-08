// ---------------------------------------------------------------
// Bibliothek: Bereiche → Abteilungen → Stationen → Schulungen.
// Im Code heißt ein Bereich "department" (z. B. Lackiererei) und
// eine Abteilung darin "unit" (z. B. Decklack).
// Gespeichert im Browser (localStorage). Beim ersten Start wird sie
// mit Beispielen gefüllt, damit sie nicht leer ist.
// Im echten Einsatz käme dieselbe Struktur in eine zentrale Datenbank.
// ---------------------------------------------------------------

const LIBRARY_KEY = "sb.library.v2";
const LIBRARY_KEY_V1 = "sb.library.v1"; // alte Struktur ohne Abteilungen, wird übernommen

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
const WHOLE_AREA = "alle"; // unit-Wert für Schulungen, die im ganzen Bereich gelten

// Kurzschreibweise für die Beispieldaten: unit("id", "Name", ["CODE", "Bezeichnung"], ...)
function seedUnit(id, name, ...stations) {
  return { id, name, stations: [...stations.map(([code, sname]) => ({ id: code.toLowerCase(), code, name: sname })), { ...ALL_STATIONS }] };
}

const SEED_DEPARTMENTS = [
  { id: "montage", name: "Montage", icon: "montage", units: [
    seedUnit("tueren", "Türenvormontage", ["T-04", "Türverkleidung"], ["T-07", "Fensterheber"]),
    seedUnit("innenausstattung", "Innenausstattung", ["I-03", "Cockpit einsetzen"], ["I-09", "Sitze montieren"]),
    seedUnit("fahrwerk", "Fahrwerk und Hochzeit", ["F-01", "Hochzeit"], ["F-05", "Räder montieren"]),
    seedUnit("frontend", "Frontend", ["M-12", "Frontscheinwerfer"], ["M-15", "Stoßfänger"]),
    seedUnit("endmontage", "Endmontage und Inbetriebnahme", ["E-02", "Befüllung"], ["E-08", "Rollenprüfstand"])] },
  { id: "karosserie", name: "Karosseriebau", icon: "karosserie", units: [
    seedUnit("unterbau", "Unterbau", ["U-02", "Bodengruppe"], ["U-05", "Vorderwagen"]),
    seedUnit("seitenwand", "Seitenwand", ["K-07", "Schweißzelle Seitenwand"], ["K-09", "Kleben Seitenwand"]),
    seedUnit("aufbau", "Aufbau und Framing", ["A-01", "Framing-Station"], ["A-04", "Dach fügen"]),
    seedUnit("anbauteile", "Anbauteile", ["AT-03", "Türen anbauen"], ["AT-06", "Klappen einstellen"]),
    seedUnit("finish-karosserie", "Finish Karosserie", ["FK-01", "Messraum"], ["FK-04", "Finish-Linie"])] },
  { id: "lack", name: "Lackiererei", icon: "lack", units: [
    seedUnit("vorbehandlung", "Vorbehandlung und KTL", ["VK-01", "Tauchbecken"], ["VK-03", "KTL-Ofen"]),
    seedUnit("nahtabdichtung", "Nahtabdichtung und UBS", ["NA-02", "Nahtabdichtung Roboter"], ["NA-05", "Unterbodenschutz"]),
    seedUnit("fueller", "Füller", ["FL-01", "Füllerkabine"], ["FL-04", "Schleifen"]),
    seedUnit("decklack", "Decklack", ["DL-01", "Basislack"], ["DL-03", "Klarlack"]),
    seedUnit("finish-lack", "Finish und Prüfung", ["L-02", "Sichtprüfung Decklack"], ["L-06", "Spot-Repair"])] },
  { id: "logistik", name: "Logistik", icon: "logistik", units: [
    seedUnit("wareneingang", "Wareneingang", ["WE-1", "Entladung"], ["WE-3", "Eingangsbuchung"]),
    seedUnit("lager", "Lager und Kommissionierung", ["LK-2", "Supermarkt"], ["LK-5", "Kleinteilelager"]),
    seedUnit("intralogistik", "Intralogistik", ["LG-2", "Routenzug Montage"], ["LG-4", "Stapler"]),
    seedUnit("sequenz", "Sequenzierung", ["SQ-1", "Sitze in Sequenz"], ["SQ-2", "Cockpit in Sequenz"]),
    seedUnit("versand", "Versand", ["VS-1", "Fahrzeugübergabe"], ["VS-2", "Verladung"])] },
  { id: "qualitaet", name: "Qualität", icon: "qualitaet", units: [
    seedUnit("eingangspruefung", "Wareneingangsprüfung", ["QE-1", "Stichprobe"], ["QE-2", "Sperrlager"]),
    seedUnit("messtechnik", "Messtechnik", ["QM-1", "Koordinatenmessung"], ["QM-3", "Spaltmaß"]),
    seedUnit("audit", "Audit", ["Q-01", "Finish-Audit"], ["Q-04", "Produktaudit"]),
    seedUnit("reklamation", "Reklamation", ["QR-1", "8D-Bericht"], ["QR-2", "Fehleranalyse"]),
    seedUnit("pruefplanung", "Prüfplanung", ["QP-1", "Prüfplan erstellen"], ["QP-2", "Prüfmittel"])] },
  { id: "instandhaltung", name: "Instandhaltung", icon: "instandhaltung", units: [
    seedUnit("mechanik", "Mechanik", ["IM-1", "Getriebe"], ["IM-2", "Pneumatik"]),
    seedUnit("elektrik", "Elektrik", ["IE-1", "Schaltschrank"], ["IE-3", "Sensorik"]),
    seedUnit("robotik", "Robotik", ["IR-1", "Roboter teachen"], ["IR-2", "Werkzeugwechsel"]),
    seedUnit("foerdertechnik", "Fördertechnik", ["IF-1", "Hängebahn"], ["IF-2", "Skidförderer"]),
    seedUnit("anlagenbetreuung", "Anlagenbetreuung", ["IA-1", "Störungsannahme"], ["IA-2", "Wartungsplan"])] }
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
  const t = (id, department, unit, station, status, source, daysAgo) =>
    ({ id, department, unit, station, status, source, themeId: "", translations: {}, updatedAt: libDate(daysAgo) });
  return {
    version: 2,
    seed: SEED_VERSION,
    departments: JSON.parse(JSON.stringify(SEED_DEPARTMENTS)),
    trainings: [
      ...seedExtraTrainings(),
      t("tr-tuer", "montage", "tueren", "t-04", "freigegeben", SAMPLE_TRAINING, 3),
      t("tr-scheinwerfer", "montage", "frontend", "m-12", "freigegeben", SEED_SOURCES.scheinwerfer, 1),
      t("tr-qualiscan", "montage", "endmontage", "alle", "freigegeben", SAMPLE_SOFTWARE, 0),
      t("tr-uebergabe", "montage", WHOLE_AREA, "alle", "freigegeben", SEED_SOURCES.schichtuebergabe, 5),
      t("tr-unterweisung", "montage", WHOLE_AREA, "alle", "freigegeben", SEED_SOURCES.unterweisung, 12),
      t("tr-schweiss", "karosserie", "seitenwand", "k-07", "freigegeben", SEED_SOURCES.schweisszelle, 8),
      t("tr-lack", "lack", "finish-lack", "l-02", "freigegeben", SEED_SOURCES.lackpruefung, 20),
      t("tr-routenzug", "logistik", "intralogistik", "lg-2", "freigegeben", SEED_SOURCES.routenzug, 6),
      t("tr-wartung", "instandhaltung", "anlagenbetreuung", "alle", "entwurf", SEED_SOURCES.wartungsapp, 2)
    ]
  };
}

// Alte Bibliothek (Bereich → Station) in die neue Struktur übernehmen.
// Stationen, die es in den Beispieldaten gibt, landen in ihrer Abteilung,
// alle anderen in der Abteilung "Weitere Stationen". Nichts geht verloren.
function upgradeLibrary(old, base) {
  const lib = base || { version: 2, departments: JSON.parse(JSON.stringify(SEED_DEPARTMENTS)), trainings: [] };
  const unitOf = {}; // "dep/station" → unit
  (old.departments || []).forEach(od => {
    let dep = lib.departments.find(d => d.id === od.id);
    if (!dep) { dep = { id: od.id, name: od.name, icon: od.icon || "standard", units: [] }; lib.departments.push(dep); }
    (od.stations || []).forEach(s => {
      if (s.id === "alle") return;
      const known = dep.units.find(u => u.stations.some(x => x.id === s.id));
      if (known) { unitOf[`${od.id}/${s.id}`] = known.id; return; }
      let extra = dep.units.find(u => u.id === "weitere");
      if (!extra) { extra = { id: "weitere", name: "Weitere Stationen", stations: [{ ...ALL_STATIONS }] }; dep.units.push(extra); }
      extra.stations.splice(extra.stations.length - 1, 0, s);
      unitOf[`${od.id}/${s.id}`] = "weitere";
    });
  });
  (old.trainings || []).forEach(t => {
    const unit = t.unit || (t.station === "alle" ? WHOLE_AREA : unitOf[`${t.department}/${t.station}`] || WHOLE_AREA);
    const record = { ...t, unit, station: unit === WHOLE_AREA ? "alle" : t.station };
    const i = lib.trainings.findIndex(x => x.id === t.id);
    if (i >= 0) lib.trainings[i] = record; else lib.trainings.push(record);
  });
  return lib;
}

function isOldLibrary(data) {
  return data.departments.some(d => Array.isArray(d.stations) && !Array.isArray(d.units));
}

function loadLibrary() {
  try {
    const data = JSON.parse(localStorage.getItem(LIBRARY_KEY));
    if (data && Array.isArray(data.departments) && Array.isArray(data.trainings)) {
      // Neue Beispiel-Schulungen einmalig ergänzen (eigene Schulungen bleiben)
      if ((data.seed || 1) < SEED_VERSION) {
        const known = new Set(data.trainings.map(t => t.id));
        seedExtraTrainings().forEach(t => { if (!known.has(t.id)) data.trainings.push(t); });
        data.seed = SEED_VERSION;
        saveLibrary(data);
      }
      return data;
    }
  } catch (e) { /* ignorieren */ }
  let lib = seedLibrary();
  try {
    const old = JSON.parse(localStorage.getItem(LIBRARY_KEY_V1));
    if (old && Array.isArray(old.departments) && Array.isArray(old.trainings)) lib = upgradeLibrary(old, lib);
  } catch (e) { /* ignorieren */ }
  saveLibrary(lib);
  return lib;
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
function findUnit(dep, id) { return dep ? dep.units.find(u => u.id === id) : null; }
function findStation(unit, id) { return unit ? unit.stations.find(s => s.id === id) : null; }
function stationCount(dep) { return dep.units.reduce((n, u) => n + u.stations.filter(s => s.id !== "alle").length, 0); }
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
