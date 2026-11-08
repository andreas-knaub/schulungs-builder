// ---------------------------------------------------------------
// Weitere Beispiel-Schulungen, damit jede Abteilung 3 Schulungen hat.
// Kurzform: [id, Bereich, Abteilung, Station, Titel, Untertitel,
//            Minuten, Schritte, Quiz, Status]
// Schritt: [Titel, [Punkte], Sicherheitshinweis, Tipp]
// Quiz:    [Frage, richtige Antwort, falsche Antwort, falsche Antwort]
// Alle Inhalte sind ausgedachte Demo-Daten.
// Station L-06 (Spot-Repair) bleibt bewusst leer, für die Live-Demo.
// ---------------------------------------------------------------

const SEED_VERSION = 2;

const SEED_EXTRA = [
  // ---------- Montage ----------
  ["x-fensterheber", "montage", "tueren", "t-07", "Fensterheber einbauen", "Fensterheber links und rechts sicher montieren und prüfen", 12, [
    ["Teil vorbereiten", ["Fensterheber auf Beschädigung prüfen", "Teilenummer mit dem Auftrag vergleichen"], "", ""],
    ["Einsetzen und verschrauben", ["Fensterheber in die Tür einführen", "4 Muttern mit **6 Nm** anziehen"], "Finger nicht zwischen Schiene und Türblech bringen", ""],
    ["Funktion prüfen", ["Stecker anschließen", "Scheibe einmal ganz hoch und runter fahren"], "", "Ruckelt die Scheibe, die Führung nachstellen"]
  ], ["Mit welchem Drehmoment werden die Muttern angezogen?", "6 Nm", "2 Nm", "15 Nm"]],
  ["x-tuerdichtung", "montage", "tueren", "alle", "Türdichtung aufziehen", "Dichtung ohne Falten und Lücken aufbringen", 8, [
    ["Vorbereiten", ["Dichtung auf Länge und Typ prüfen", "Flansch auf Grat und Schmutz prüfen"], "", ""],
    ["Aufziehen", ["Am Markierungspunkt unten beginnen", "Dichtung mit dem Roller andrücken"], "", "Nicht ziehen, sonst wird die Dichtung zu kurz"],
    ["Kontrolle", ["Stoßstelle auf Spalt prüfen", "Tür schließen und Schließkraft testen"], "", ""]
  ], ["Wo wird mit dem Aufziehen begonnen?", "Am Markierungspunkt unten", "Oben an der Scheibe", "An einer beliebigen Stelle"]],

  ["x-cockpit", "montage", "innenausstattung", "i-03", "Cockpit einsetzen", "Cockpitmodul mit dem Handhabungsgerät einsetzen", 15, [
    ["Handhabungsgerät vorbereiten", ["Greifer auf Sitz am Cockpit prüfen", "Freigabe am Bedienteil quittieren"], "Nie unter das angehobene Cockpit greifen", ""],
    ["Einfahren", ["Cockpit langsam durch die Türöffnung führen", "Auf die Führungsstifte setzen"], "", "Kabelstränge vorher nach oben legen"],
    ["Befestigen", ["6 Schrauben über Kreuz mit **22 Nm** anziehen", "Stecker für Kabelbaum verbinden"], "", ""]
  ], ["Wie werden die Schrauben angezogen?", "Über Kreuz mit 22 Nm", "Reihum mit 10 Nm", "Nur handfest"]],
  ["x-sitze", "montage", "innenausstattung", "i-09", "Sitze montieren", "Vordersitze sicher einbauen und anschließen", 10, [
    ["Sitz einsetzen", ["Sitz mit der Hebehilfe in den Innenraum heben", "Auf die Gewindebolzen setzen"], "Hebehilfe benutzen, nicht von Hand heben", ""],
    ["Verschrauben", ["4 Muttern mit dem EC-Schrauber, Programm 7", "Grüne Anzeige abwarten"], "", ""],
    ["Anschließen", ["Stecker für Airbag und Sitzheizung verbinden", "Sitz einmal ganz vor und zurück fahren"], "Airbag-Stecker nur bei ausgeschalteter Zündung stecken", ""]
  ], ["Wann darf der Airbag-Stecker gesteckt werden?", "Nur bei ausgeschalteter Zündung", "Jederzeit", "Nur bei laufendem Motor"]],
  ["x-himmel", "montage", "innenausstattung", "alle", "Himmel einbauen", "Dachhimmel ohne Knicke und Flecken montieren", 10, [
    ["Vorbereiten", ["Saubere Baumwollhandschuhe anziehen", "Himmel auf Flecken prüfen"], "", ""],
    ["Einsetzen", ["Himmel zu zweit durch die Heckklappe einführen", "Clips vorne zuerst einrasten"], "", "Nicht knicken, Knicke bleiben sichtbar"],
    ["Prüfen", ["Alle Clips einmal andrücken", "Sichtprüfung bei Innenbeleuchtung"], "", ""]
  ], ["Warum werden Baumwollhandschuhe getragen?", "Damit keine Flecken entstehen", "Wegen scharfer Kanten", "Gegen Kälte"]],

  ["x-hochzeit", "montage", "fahrwerk", "f-01", "Hochzeit: Fahrwerk und Karosse", "Fahrwerk sicher mit der Karosserie verbinden", 15, [
    ["Vor dem Absenken", ["Fahrwerk auf dem Träger auf Position prüfen", "Freigabe erst bei grüner Lampe"], "Nicht im Bereich unter der Karosse aufhalten", ""],
    ["Verschrauben", ["Schrauber an den 8 Verschraubpunkten ansetzen", "Reihenfolge laut Bildschirm einhalten"], "", ""],
    ["Kontrolle", ["Alle Punkte auf grüne Rückmeldung prüfen", "Nacharbeit bei Rot sofort melden"], "", "Bei zweimal Rot nicht erneut schrauben"]
  ], ["Wann darf abgesenkt werden?", "Wenn die Lampe grün leuchtet", "Sobald das Fahrwerk steht", "Nach Rücksprache mit dem Kollegen"]],
  ["x-raeder", "montage", "fahrwerk", "f-05", "Räder montieren", "Räder mit dem Mehrfachschrauber anziehen", 8, [
    ["Rad ansetzen", ["Rad mit der Radhebehilfe ansetzen", "Radmuttern von Hand vorschrauben"], "", ""],
    ["Anziehen", ["Mehrfachschrauber ansetzen", "Alle Muttern gleichzeitig mit **140 Nm**"], "Hände weg vom Schrauber, solange er dreht", ""],
    ["Prüfen", ["Anzeige auf Grün prüfen", "Radkappe aufsetzen"], "", ""]
  ], ["Mit welchem Drehmoment werden die Radmuttern angezogen?", "140 Nm", "40 Nm", "300 Nm"]],
  ["x-bremsleitung", "montage", "fahrwerk", "alle", "Bremsleitungen verlegen", "Bremsleitungen knickfrei verlegen und sichern", 10, [
    ["Leitung prüfen", ["Leitung auf Knicke und Beschädigung prüfen", "Schutzkappen erst kurz vor dem Anschluss entfernen"], "", ""],
    ["Verlegen", ["Leitung in alle Halteclips drücken", "Abstand zu heißen Teilen einhalten"], "Beschädigte Leitungen nie einbauen", ""],
    ["Anschließen", ["Überwurfmutter von Hand ansetzen", "Mit **16 Nm** anziehen"], "", ""]
  ], ["Was tun mit einer geknickten Bremsleitung?", "Nicht einbauen und melden", "Gerade biegen", "Trotzdem einbauen"]],

  ["x-stossfaenger", "montage", "frontend", "m-15", "Stoßfänger montieren", "Frontstoßfänger passgenau anbringen", 12, [
    ["Vorbereiten", ["Stoßfänger auf Lackschäden prüfen", "Sensoren für Parkhilfe einclipsen"], "", ""],
    ["Anbringen", ["Zu zweit an die Führungen setzen", "Seitliche Clips einrasten"], "", "Nicht auf die Sensoren drücken"],
    ["Prüfen", ["Spaltmaß zu den Kotflügeln messen", "Sollwert **3 bis 5 mm**"], "", ""]
  ], ["Wie groß soll das Spaltmaß sein?", "3 bis 5 mm", "0 bis 1 mm", "10 bis 12 mm"]],
  ["x-kuehler", "montage", "frontend", "alle", "Kühlermodul einsetzen", "Kühlermodul ohne Beschädigung einbauen", 10, [
    ["Vorbereiten", ["Lamellen auf Beschädigung prüfen", "Schläuche bereitlegen"], "Lamellen sind scharfkantig: Handschuhe tragen", ""],
    ["Einsetzen", ["Modul in die unteren Aufnahmen setzen", "Oben mit 2 Schrauben befestigen"], "", ""],
    ["Anschließen", ["Schläuche aufstecken bis zum Anschlag", "Schlauchschellen einrasten lassen"], "", "Hörbares Klicken zeigt den richtigen Sitz"]
  ], ["Woran erkennen Sie, dass die Schelle richtig sitzt?", "Am hörbaren Klicken", "An der Farbe", "Gar nicht"]],

  ["x-befuellung", "montage", "endmontage", "e-02", "Fahrzeug befüllen", "Betriebsstoffe mit der Befüllanlage einfüllen", 10, [
    ["Adapter ansetzen", ["Richtigen Adapter laut Bildschirm wählen", "Adapter dicht aufsetzen"], "Schutzbrille tragen, Flüssigkeiten können spritzen", ""],
    ["Befüllen", ["Befüllung am Bedienteil starten", "Warten, bis die Anlage fertig meldet"], "", ""],
    ["Abschließen", ["Adapter abnehmen und ablegen", "Deckel verschließen"], "", "Tropfen sofort mit dem Tuch aufnehmen"]
  ], ["Was tragen Sie beim Befüllen?", "Schutzbrille", "Gehörschutz", "Atemschutz"]],
  ["x-rollenpruefstand", "montage", "endmontage", "e-08", "Rollenprüfstand", "Fahrzeug sicher auf dem Rollenprüfstand testen", 15, [
    ["Auffahren", ["Langsam und gerade auf die Rollen fahren", "Fahrzeug mit den Haltern sichern"], "Niemand darf vor oder hinter dem Fahrzeug stehen", ""],
    ["Prüfen", ["Prüfprogramm am Terminal starten", "Anweisungen auf dem Bildschirm folgen"], "", ""],
    ["Abfahren", ["Ergebnis prüfen: grün = i.O.", "Halter lösen und langsam abfahren"], "", ""]
  ], ["Wo darf während des Tests niemand stehen?", "Vor und hinter dem Fahrzeug", "Neben dem Terminal", "Am Hallentor"]],

  // ---------- Karosseriebau ----------
  ["x-bodengruppe", "karosserie", "unterbau", "u-02", "Bodengruppe einlegen", "Bleche lagerichtig in die Vorrichtung einlegen", 10, [
    ["Prüfen", ["Bleche auf Beulen und Rost prüfen", "Teilenummer mit Stückliste vergleichen"], "Schnittschutzhandschuhe tragen", ""],
    ["Einlegen", ["Bleche auf die Aufnahmestifte setzen", "Spanner schließen"], "", ""],
    ["Freigeben", ["Lichtgitter verlassen", "Zyklus am Bedienpult starten"], "Nie in die Zelle greifen, wenn der Roboter läuft", ""]
  ], ["Was tun Sie vor dem Start des Zyklus?", "Den Bereich des Lichtgitters verlassen", "Die Spanner öffnen", "Den Roboter anfassen"]],
  ["x-vorderwagen", "karosserie", "unterbau", "u-05", "Vorderwagen schweißen", "Punktschweißen am Vorderwagen kontrollieren", 12, [
    ["Vorbereiten", ["Elektrodenkappen auf Verschleiß prüfen", "Kappen bei Bedarf fräsen"], "", ""],
    ["Schweißen", ["Programm laut Typ wählen", "Schweißpunkte in fester Reihenfolge setzen"], "Schweißschutzbrille tragen", ""],
    ["Prüfen", ["Stichprobe mit dem Meißeltest", "Ergebnis im Prüfblatt eintragen"], "", ""]
  ], ["Womit wird die Qualität der Schweißpunkte geprüft?", "Mit dem Meißeltest", "Mit Wasser", "Mit dem Magneten"]],
  ["x-dichtheit", "karosserie", "unterbau", "alle", "Dichtheit Unterboden", "Unterboden auf offene Stellen prüfen", 8, [
    ["Vorbereiten", ["Prüflampe einschalten", "Karosse auf dem Drehgestell sichern"], "", ""],
    ["Prüfen", ["Unterboden von innen ableuchten", "Lichtpunkte von unten markieren"], "", "Lichtpunkt = offene Stelle"],
    ["Melden", ["Markierte Stellen im Terminal erfassen", "Karosse zur Nacharbeit freigeben"], "", ""]
  ], ["Was zeigt ein Lichtpunkt beim Ableuchten?", "Eine offene Stelle", "Einen Lackfehler", "Nichts"]],

  ["x-kleben", "karosserie", "seitenwand", "k-09", "Kleben Seitenwand", "Klebstoffraupe richtig auftragen", 10, [
    ["Vorbereiten", ["Klebstofftemperatur prüfen", "Düse auf Rückstände prüfen"], "", ""],
    ["Auftragen", ["Roboterprogramm starten", "Raupe auf Lücken beobachten"], "Nicht in die Zelle greifen", ""],
    ["Prüfen", ["Raupenbreite mit der Lehre messen", "Sollwert **4 mm**"], "", "Lücken sofort melden, nicht von Hand ergänzen"]
  ], ["Wie breit soll die Klebstoffraupe sein?", "4 mm", "1 mm", "10 mm"]],
  ["x-elektroden", "karosserie", "seitenwand", "alle", "Elektroden wechseln", "Elektrodenkappen sicher wechseln", 8, [
    ["Zelle sichern", ["Zelle in den Modus Wartung schalten", "Persönliches Schloss setzen"], "Ohne eigenes Schloss nie die Zelle betreten", ""],
    ["Wechseln", ["Alte Kappen mit dem Abzieher lösen", "Neue Kappen bis zum Anschlag aufsetzen"], "", ""],
    ["Abschließen", ["Zählerstand am Panel zurücksetzen", "Schloss abnehmen und quittieren"], "", ""]
  ], ["Was ist vor dem Betreten der Zelle Pflicht?", "Persönliches Schloss setzen", "Licht einschalten", "Kollegen rufen"]],

  ["x-framing", "karosserie", "aufbau", "a-01", "Framing-Station", "Karosserie in der Framing-Station ausrichten", 12, [
    ["Prüfen", ["Seitenwände auf richtigen Typ prüfen", "Spanntechnik auf Freigabe prüfen"], "", ""],
    ["Starten", ["Station am Bedienpult freigeben", "Ablauf auf dem Bildschirm verfolgen"], "Nicht in den Schutzbereich treten", ""],
    ["Kontrolle", ["Messprotokoll prüfen", "Abweichung über **0,5 mm** melden"], "", ""]
  ], ["Ab welcher Abweichung wird gemeldet?", "Über 0,5 mm", "Über 5 mm", "Nie"]],
  ["x-dach", "karosserie", "aufbau", "a-04", "Dach fügen", "Dach lagerichtig auflegen und fügen", 10, [
    ["Auflegen", ["Dach mit dem Vakuumgreifer aufnehmen", "Auf die Aufnahmen legen"], "Nicht unter das Dach treten", ""],
    ["Fügen", ["Laserlöten automatisch starten", "Naht über die Kamera beobachten"], "Nie direkt in den Laser schauen", ""],
    ["Prüfen", ["Naht auf Poren prüfen", "Fehler im Terminal erfassen"], "", ""]
  ], ["Was gilt beim Laserlöten?", "Nie direkt in den Laser schauen", "Schutzbrille ist nicht nötig", "Naht von Hand nachlöten"]],
  ["x-geometrie", "karosserie", "aufbau", "alle", "Geometrie prüfen", "Messpunkte an der Rohkarosse kontrollieren", 8, [
    ["Vorbereiten", ["Messgerät kalibrieren", "Karosse in Messposition fahren"], "", ""],
    ["Messen", ["Messpunkte laut Plan antasten", "Werte automatisch übertragen"], "", "Taster immer senkrecht ansetzen"],
    ["Auswerten", ["Rote Werte markieren", "Bericht an die Schichtleitung"], "", ""]
  ], ["Wie wird der Taster angesetzt?", "Immer senkrecht", "Schräg", "Beliebig"]],

  ["x-tueren-anbau", "karosserie", "anbauteile", "at-03", "Türen anbauen", "Türen an der Rohkarosse anschrauben", 10, [
    ["Ansetzen", ["Tür mit der Hebehilfe an die Scharniere führen", "Bolzen einstecken"], "Hebehilfe nutzen, Tür nicht allein tragen", ""],
    ["Verschrauben", ["Scharnierschrauben mit **28 Nm**", "Reihenfolge oben, dann unten"], "", ""],
    ["Prüfen", ["Tür öffnen und schließen", "Spalt zur B-Säule prüfen"], "", ""]
  ], ["In welcher Reihenfolge wird geschraubt?", "Erst oben, dann unten", "Erst unten, dann oben", "Egal"]],
  ["x-klappen", "karosserie", "anbauteile", "at-06", "Klappen einstellen", "Motorhaube und Heckklappe einstellen", 12, [
    ["Vorbereiten", ["Einstelllehre bereitlegen", "Puffer auf richtigen Typ prüfen"], "", ""],
    ["Einstellen", ["Klappe mit Lehre auf Spaltmaß bringen", "Scharniere anziehen"], "Klappe beim Lösen der Scharniere festhalten", ""],
    ["Prüfen", ["Flucht zu den Kotflügeln prüfen", "Schließgeräusch testen"], "", ""]
  ], ["Was tun beim Lösen der Scharniere?", "Klappe festhalten", "Klappe offen lassen", "Nichts Besonderes"]],
  ["x-anbau-sicherheit", "karosserie", "anbauteile", "alle", "Sicher arbeiten an der Anbaulinie", "Grundregeln für die Anbaulinie", 6, [
    ["Schutzausrüstung", ["Schnittschutzhandschuhe und Sicherheitsschuhe tragen", "Schutzbrille beim Schrauben"], "", ""],
    ["Hebehilfen", ["Teile über 15 kg nur mit Hebehilfe", "Hebehilfe vor Schichtbeginn prüfen"], "Defekte Hebehilfe sperren und melden", ""],
    ["Band", ["Bei Gefahr Reißleine ziehen", "Danach Teamleitung informieren"], "", ""]
  ], ["Ab welchem Gewicht ist die Hebehilfe Pflicht?", "Über 15 kg", "Über 50 kg", "Nie"]],

  ["x-messraum", "karosserie", "finish-karosserie", "fk-01", "Messraum: Karosse vermessen", "Ablauf im Messraum", 15, [
    ["Vorbereiten", ["Karosse 2 Stunden temperieren", "Auf den Messtisch setzen"], "", ""],
    ["Messen", ["Messprogramm laut Typ starten", "Messung nicht unterbrechen"], "", ""],
    ["Auswerten", ["Abweichungen im Bericht markieren", "Bericht an Fertigung senden"], "", "Temperatur beeinflusst das Ergebnis"]
  ], ["Warum wird die Karosse temperiert?", "Temperatur beeinflusst das Messergebnis", "Damit sie trocknet", "Aus Gewohnheit"]],
  ["x-finishlinie", "karosserie", "finish-karosserie", "fk-04", "Finish-Linie Rohbau", "Oberflächen vor der Lackiererei prüfen", 10, [
    ["Ableuchten", ["Flächen unter der Lichtwand prüfen", "Beulen mit Stift markieren"], "", ""],
    ["Nacharbeiten", ["Kleine Beulen mit dem Ausbeulwerkzeug", "Nicht schleifen, nur drücken"], "Schutzbrille tragen", ""],
    ["Freigeben", ["Karosse im Terminal freigeben", "Nacharbeit dokumentieren"], "", ""]
  ], ["Womit werden Beulen gefunden?", "Mit der Lichtwand", "Mit dem Magneten", "Mit Wasser"]],
  ["x-oberflaeche", "karosserie", "finish-karosserie", "alle", "Oberflächenfehler erkennen", "Typische Fehler im Rohbau", 8, [
    ["Fehlerarten", ["Beulen und Dellen", "Kratzer und Riefen", "Schweißspritzer"], "", ""],
    ["Vorgehen", ["Fehler markieren", "Fehlerart im Terminal wählen"], "", "Unsicher? Kollegin oder Meister fragen"],
    ["Ziel", ["Kein Fehler darf in die Lackiererei", "Jeder Fehler dort kostet ein Vielfaches"], "", ""]
  ], ["Warum ist die Prüfung im Rohbau so wichtig?", "Fehler später kosten ein Vielfaches", "Weil es Vorschrift ist", "Sie ist nicht wichtig"]],

  // ---------- Lackiererei ----------
  ["x-tauchbecken", "lack", "vorbehandlung", "vk-01", "Tauchbecken überwachen", "Badwerte der Vorbehandlung kontrollieren", 10, [
    ["Werte ablesen", ["Temperatur und pH-Wert am Display ablesen", "Werte ins Schichtbuch eintragen"], "", ""],
    ["Probe nehmen", ["Schutzbrille und Chemiehandschuhe anlegen", "Probe mit dem Schöpfer nehmen"], "Chemikalien: nie ohne Schutzausrüstung", ""],
    ["Reagieren", ["Abweichung sofort an die Leitstelle", "Nicht selbst nachdosieren"], "", ""]
  ], ["Was tun bei abweichenden Badwerten?", "Sofort an die Leitstelle melden", "Selbst nachdosieren", "Abwarten"]],
  ["x-ktl", "lack", "vorbehandlung", "vk-03", "KTL-Ofen", "Einbrennen der Grundierung kontrollieren", 8, [
    ["Prüfen", ["Ofentemperatur am Leitstand prüfen", "Bandgeschwindigkeit kontrollieren"], "Ofenbereich nur mit Freigabe betreten", ""],
    ["Messen", ["Schichtdicke an 5 Punkten messen", "Werte ins System eintragen"], "", ""],
    ["Melden", ["Abweichungen an die Schichtleitung", "Betroffene Karossen sperren"], "", ""]
  ], ["An wie vielen Punkten wird die Schichtdicke gemessen?", "An 5 Punkten", "An 1 Punkt", "Gar nicht"]],
  ["x-chemie", "lack", "vorbehandlung", "alle", "Umgang mit Chemikalien", "Sicheres Arbeiten in der Vorbehandlung", 8, [
    ["Schutzausrüstung", ["Schutzbrille, Chemiehandschuhe und Schürze", "Sicherheitsschuhe S3"], "", ""],
    ["Im Notfall", ["Augendusche und Notdusche kennen", "Bei Spritzern sofort spülen"], "Mindestens 10 Minuten spülen", ""],
    ["Melden", ["Jeden Unfall der Teamleitung melden", "Sicherheitsdatenblatt beachten"], "", ""]
  ], ["Wie lange wird nach einem Spritzer gespült?", "Mindestens 10 Minuten", "10 Sekunden", "Gar nicht"]],

  ["x-naht-roboter", "lack", "nahtabdichtung", "na-02", "Nahtabdichtung Roboter", "Dichtnähte vom Roboter kontrollieren", 10, [
    ["Vor Schichtbeginn", ["Düsen auf Verstopfung prüfen", "Materialdruck ablesen"], "", ""],
    ["Kontrolle", ["Nähte an 3 Karossen pro Stunde prüfen", "Lücken markieren"], "Nicht in die Zelle greifen", ""],
    ["Nacharbeit", ["Kleine Lücken mit der Handpistole schließen", "Im Terminal dokumentieren"], "", ""]
  ], ["Wie oft werden die Nähte geprüft?", "An 3 Karossen pro Stunde", "Einmal pro Woche", "Nie"]],
  ["x-ubs", "lack", "nahtabdichtung", "na-05", "Unterbodenschutz", "Unterbodenschutz gleichmäßig auftragen", 10, [
    ["Abkleben", ["Gewinde und Aufnahmen mit Kappen schützen", "Kappenplan beachten"], "", ""],
    ["Auftragen", ["Roboterprogramm starten", "Ergebnis per Sichtprüfung kontrollieren"], "Atemschutz in der Kabine tragen", ""],
    ["Kappen entfernen", ["Alle Kappen abziehen", "Anzahl mit dem Plan vergleichen"], "", "Vergessene Kappen fallen erst in der Montage auf"]
  ], ["Was wird vor dem Auftragen geschützt?", "Gewinde und Aufnahmen", "Die Scheiben", "Nichts"]],
  ["x-handpistole", "lack", "nahtabdichtung", "alle", "Handpistole richtig nutzen", "Nacharbeit mit der Dichtstoffpistole", 6, [
    ["Vorbereiten", ["Kartusche einsetzen", "Probe auf Pappe spritzen"], "", ""],
    ["Auftragen", ["Pistole im 45-Grad-Winkel halten", "Gleichmäßig ziehen, nicht drücken"], "", ""],
    ["Glätten", ["Naht mit dem Spachtel glätten", "Werkzeug sofort reinigen"], "Handschuhe tragen", ""]
  ], ["In welchem Winkel wird die Pistole gehalten?", "45 Grad", "90 Grad", "10 Grad"]],

  ["x-fuellerkabine", "lack", "fueller", "fl-01", "Füllerkabine betreten", "Regeln für die Füllerkabine", 8, [
    ["Vor dem Betreten", ["Lackieranzug und Atemschutz anlegen", "Staubbindetuch bereitlegen"], "Kabine nur bei gestopptem Roboter betreten", ""],
    ["In der Kabine", ["Nichts an der Karosse ablegen", "Wege auf dem Gitterrost nutzen"], "", ""],
    ["Verlassen", ["Freigabe am Panel quittieren", "Anzug in den Spind"], "", ""]
  ], ["Wann darf die Kabine betreten werden?", "Nur bei gestopptem Roboter", "Jederzeit", "Wenn es eilt"]],
  ["x-schleifen", "lack", "fueller", "fl-04", "Füller schleifen", "Füllerfehler schleifen ohne Durchschliff", 10, [
    ["Vorbereiten", ["Exzenterschleifer mit **P800** bestücken", "Absaugung einschalten"], "", ""],
    ["Schleifen", ["Nur die Fehlerstelle schleifen", "Wenig Druck, flach führen"], "Staubmaske tragen", ""],
    ["Prüfen", ["Fläche mit Staubbindetuch reinigen", "Auf Durchschliff prüfen"], "", "Grundierung sichtbar = Durchschliff, melden"]
  ], ["Welches Schleifpapier wird verwendet?", "P800", "P40", "P5000"]],
  ["x-staub", "lack", "fueller", "alle", "Staubfrei arbeiten", "Warum Sauberkeit im Lack so wichtig ist", 6, [
    ["Ursachen", ["Fusseln von Kleidung", "Haare und Hautschuppen", "Schleifstaub"], "", ""],
    ["Regeln", ["Nur fusselfreie Kleidung", "Haarnetz in allen Kabinen"], "", ""],
    ["Folgen", ["Jeder Staubeinschluss braucht Nacharbeit", "Viele Fehler führen zu Neulackierung"], "", ""]
  ], ["Was ist in allen Kabinen Pflicht?", "Haarnetz", "Mütze", "Nichts"]],

  ["x-basislack", "lack", "decklack", "dl-01", "Basislack: Farbwechsel", "Farbwechsel an der Lackieranlage begleiten", 10, [
    ["Vorbereiten", ["Farbcode im Auftrag prüfen", "Farbwechsel am Leitstand freigeben"], "", ""],
    ["Spülen", ["Spülprogramm vollständig laufen lassen", "Spülmittel ordnungsgemäß entsorgen"], "Lösemittel: Atemschutz tragen", ""],
    ["Prüfen", ["Erste Karosse auf Farbton prüfen", "Mit dem Farbmuster vergleichen"], "", ""]
  ], ["Womit wird der Farbton verglichen?", "Mit dem Farbmuster", "Mit dem Vorgänger", "Gar nicht"]],
  ["x-klarlack", "lack", "decklack", "dl-03", "Klarlack prüfen", "Klarlackschicht auf Läufer und Kocher prüfen", 8, [
    ["Ableuchten", ["Karosse im Lichttunnel prüfen", "Waagerechte Flächen zuerst"], "", ""],
    ["Fehler erkennen", ["Läufer: Tropfenform an senkrechten Flächen", "Kocher: kleine Bläschen"], "", ""],
    ["Melden", ["Fehler im Terminal mit Position erfassen", "Häufung sofort an die Leitstelle"], "", "Häufung deutet auf Anlagenproblem"]
  ], ["Was sind Kocher?", "Kleine Bläschen im Lack", "Tropfen an senkrechten Flächen", "Kratzer"]],
  ["x-farbton", "lack", "decklack", "alle", "Farbtonabweichung erkennen", "Farbunterschiede richtig bewerten", 6, [
    ["Prüflicht", ["Unter Normlicht prüfen", "Nicht unter Hallenlicht"], "", ""],
    ["Vergleich", ["Tür und Kotflügel nebeneinander betrachten", "Aus verschiedenen Winkeln schauen"], "", ""],
    ["Entscheidung", ["Unsicher: Muster holen", "Abweichung im Terminal erfassen"], "", ""]
  ], ["Unter welchem Licht wird der Farbton geprüft?", "Unter Normlicht", "Unter Hallenlicht", "Bei Tageslicht am Fenster"]],

  ["x-politurfinish", "lack", "finish-lack", "alle", "Finish-Bereich: Grundregeln", "Ordnung und Sauberkeit im Finish", 6, [
    ["Arbeitsplatz", ["Werkzeug nach Gebrauch zurück an den Platz", "Pads und Tücher sauber lagern"], "", ""],
    ["Kleidung", ["Keine Gürtelschnallen und Reißverschlüsse", "Ärmel geschlossen"], "Metall an der Kleidung zerkratzt den Lack", ""],
    ["Übergabe", ["Offene Nacharbeiten an die nächste Schicht", "Im Schichtbuch eintragen"], "", ""]
  ], ["Warum keine Gürtelschnallen?", "Sie zerkratzen den Lack", "Sie sind unbequem", "Wegen der Optik"]],
  ["x-fehlerkatalog", "lack", "finish-lack", "alle", "Lackfehler-Katalog", "Die häufigsten Lackfehler und ihre Ursache", 10, [
    ["Einschlüsse", ["Staub oder Fusseln im Lack", "Ursache: Sauberkeit in der Kabine"], "", ""],
    ["Läufer", ["Tropfen an senkrechten Flächen", "Ursache: zu viel Lack"], "", ""],
    ["Krater", ["Kleine Vertiefungen", "Ursache: Silikon oder Fett"], "Kein Silikon in die Lackiererei bringen", ""]
  ], ["Was verursacht Krater im Lack?", "Silikon oder Fett", "Zu viel Lack", "Kälte"]],

  // ---------- Logistik ----------
  ["x-entladung", "logistik", "wareneingang", "we-1", "LKW entladen", "Sicher entladen an der Rampe", 10, [
    ["Vorbereiten", ["Unterlegkeile am LKW anlegen", "Rampenampel auf Rot"], "LKW nie ohne Unterlegkeile entladen", ""],
    ["Entladen", ["Ladung auf Beschädigung prüfen", "Paletten mit dem Stapler entnehmen"], "", ""],
    ["Abschließen", ["Rampenampel auf Grün", "Lieferschein abzeichnen"], "", ""]
  ], ["Was ist vor dem Entladen Pflicht?", "Unterlegkeile anlegen", "Motor laufen lassen", "Nichts"]],
  ["x-eingangsbuchung", "logistik", "wareneingang", "we-3", "Wareneingang buchen", "Lieferung im System erfassen", 8, [
    ["Prüfen", ["Lieferschein mit Bestellung vergleichen", "Anzahl der Packstücke zählen"], "", ""],
    ["Buchen", ["Barcode am Ladungsträger scannen", "Menge bestätigen"], "", "Abweichungen nie einfach überschreiben"],
    ["Einlagern", ["Lagerplatz auf dem Etikett notieren", "Ware zum Lagerplatz bringen"], "", ""]
  ], ["Was tun bei einer Mengenabweichung?", "Abweichung melden, nicht überschreiben", "Einfach die bestellte Menge buchen", "Lieferung zurückschicken"]],
  ["x-gefahrgut", "logistik", "wareneingang", "alle", "Gefahrgut erkennen", "Gefahrzettel lesen und richtig handeln", 8, [
    ["Erkennen", ["Rautenförmige Gefahrzettel beachten", "Nummer auf der orangen Tafel"], "", ""],
    ["Handeln", ["Gefahrgut nur in den markierten Bereich", "Beschädigte Gebinde nicht anfassen"], "Bei Auslaufen Bereich räumen und melden", ""],
    ["Dokumentieren", ["Gefahrgut gesondert buchen", "Begleitpapiere aufbewahren"], "", ""]
  ], ["Was tun bei auslaufendem Gefahrgut?", "Bereich räumen und melden", "Selbst aufwischen", "Weiterarbeiten"]],

  ["x-supermarkt", "logistik", "lager", "lk-2", "Supermarkt befüllen", "Behälter im Supermarkt richtig nachfüllen", 8, [
    ["Leerbehälter", ["Kanban-Karte am Leerbehälter lesen", "Teil und Menge prüfen"], "", ""],
    ["Befüllen", ["Volle Behälter von hinten einschieben", "First in, first out beachten"], "", ""],
    ["Kontrolle", ["Etikett zeigt nach vorne", "Fach nicht überfüllen"], "Schwere Behälter unten lagern", ""]
  ], ["Welches Prinzip gilt beim Nachfüllen?", "First in, first out", "Last in, first out", "Kein Prinzip"]],
  ["x-kleinteile", "logistik", "lager", "lk-5", "Kleinteile kommissionieren", "Kleinteile mit Pick-by-Light greifen", 8, [
    ["Auftrag starten", ["Auftrag am Terminal scannen", "Leuchtendes Fach suchen"], "", ""],
    ["Greifen", ["Angezeigte Menge entnehmen", "Taste am Fach drücken"], "", "Falsches Fach? Sofort am Terminal korrigieren"],
    ["Abschließen", ["Behälter auf Vollständigkeit prüfen", "Auftrag abschließen"], "", ""]
  ], ["Was tun Sie nach dem Greifen?", "Taste am Fach drücken", "Nichts", "Fach zukleben"]],
  ["x-lagerordnung", "logistik", "lager", "alle", "Ordnung im Lager", "5S im Lager umsetzen", 6, [
    ["Sortieren", ["Nicht Benötigtes entfernen", "Leergut sofort zurück"], "", ""],
    ["Kennzeichnen", ["Jeder Platz hat ein Etikett", "Fahrwege frei halten"], "Fahrwege nie zustellen", ""],
    ["Halten", ["Am Schichtende kurzer Rundgang", "Abweichungen melden"], "", ""]
  ], ["Was gilt für Fahrwege?", "Immer frei halten", "Für Leergut nutzen", "Nur nachts frei"]],

  ["x-stapler", "logistik", "intralogistik", "lg-4", "Stapler sicher fahren", "Grundregeln für Staplerfahrer", 12, [
    ["Vor der Fahrt", ["Täglicher Check: Bremsen, Hupe, Gabeln", "Mängel sofort melden"], "Nur mit gültigem Staplerschein fahren", ""],
    ["Fahren", ["Last tief und nach hinten geneigt", "Bei schlechter Sicht rückwärts fahren"], "", ""],
    ["Abstellen", ["Gabeln ganz absenken", "Schlüssel abziehen"], "", ""]
  ], ["Wie wird die Last transportiert?", "Tief und nach hinten geneigt", "Hoch für bessere Sicht", "Nach vorne geneigt"]],
  ["x-fahrwege", "logistik", "intralogistik", "alle", "Fußgänger und Fahrzeuge", "Sicher unterwegs in der Halle", 6, [
    ["Fußgänger", ["Nur markierte Gehwege benutzen", "An Kreuzungen stehen bleiben und schauen"], "", ""],
    ["Fahrzeuge", ["Fußgänger haben Vorrang an Übergängen", "Schrittgeschwindigkeit in engen Bereichen"], "Blickkontakt suchen, bevor Sie queren", ""],
    ["Sichtbarkeit", ["Warnweste in der Logistik tragen", "Keine Kopfhörer"], "", ""]
  ], ["Was tun Sie, bevor Sie einen Fahrweg queren?", "Blickkontakt mit dem Fahrer suchen", "Schnell rennen", "Nichts"]],

  ["x-sitze-sequenz", "logistik", "sequenz", "sq-1", "Sitze in Sequenz", "Sitze in der richtigen Reihenfolge bereitstellen", 10, [
    ["Abruf", ["Sequenzliste am Bildschirm prüfen", "Erste Position suchen"], "", ""],
    ["Beladen", ["Sitze laut Liste auf das Gestell", "Jeden Sitz scannen"], "Sitze nur zu zweit oder mit Hebehilfe", ""],
    ["Prüfen", ["Reihenfolge am Ende vergleichen", "Gestell zur Linie freigeben"], "", "Ein falscher Sitz stoppt die Linie"]
  ], ["Was passiert bei einem falschen Sitz?", "Die Linie kann stoppen", "Nichts", "Der Sitz wird umlackiert"]],
  ["x-cockpit-sequenz", "logistik", "sequenz", "sq-2", "Cockpit in Sequenz", "Cockpitmodule bereitstellen", 8, [
    ["Abruf", ["Nächste Fahrzeugnummer lesen", "Passendes Cockpit im Puffer suchen"], "", ""],
    ["Bereitstellen", ["Cockpit scannen", "Auf den Sequenzwagen setzen"], "Kanten der Module nicht anfassen", ""],
    ["Übergabe", ["Wagen an die Linie bringen", "Leerwagen mitnehmen"], "", ""]
  ], ["Was wird vor dem Aufsetzen gemacht?", "Cockpit scannen", "Cockpit reinigen", "Nichts"]],
  ["x-sequenz-grundlagen", "logistik", "sequenz", "alle", "Was ist Sequenz?", "Grundlagen der Just-in-Sequence-Versorgung", 6, [
    ["Prinzip", ["Teile kommen in der Reihenfolge der Fahrzeuge", "Jedes Fahrzeug ist anders"], "", ""],
    ["Vorteil", ["Weniger Platz an der Linie", "Keine Suche nach dem richtigen Teil"], "", ""],
    ["Risiko", ["Ein Fehler wirkt sofort auf die Linie", "Deshalb jeden Schritt scannen"], "", ""]
  ], ["Warum wird jeder Schritt gescannt?", "Ein Fehler wirkt sofort auf die Linie", "Für die Statistik", "Aus Gewohnheit"]],

  ["x-uebergabe", "logistik", "versand", "vs-1", "Fahrzeugübergabe", "Fertige Fahrzeuge an den Versand übergeben", 8, [
    ["Prüfen", ["Fahrzeug auf Schäden umrunden", "Schäden im Protokoll markieren"], "", ""],
    ["Übergeben", ["Fahrzeug im System auf Versand buchen", "Schlüssel in den Schlüsselkasten"], "", ""],
    ["Parken", ["Auf zugewiesenem Platz abstellen", "Handbremse anziehen"], "Langsam fahren auf dem Gelände", ""]
  ], ["Was wird vor der Übergabe gemacht?", "Fahrzeug auf Schäden prüfen", "Fahrzeug waschen", "Tanken"]],
  ["x-verladung", "logistik", "versand", "vs-2", "Fahrzeuge verladen", "Fahrzeuge sicher auf den Transporter fahren", 10, [
    ["Vorbereiten", ["Rampen auf Sitz prüfen", "Einweiser bereitstehen"], "Nur mit Einweiser auffahren", ""],
    ["Verladen", ["Langsam auffahren", "Fahrzeug mit Gurten sichern"], "", ""],
    ["Kontrolle", ["Gurte nachspannen", "Ladeliste abzeichnen"], "", ""]
  ], ["Wie wird aufgefahren?", "Langsam und nur mit Einweiser", "Schnell", "Ohne Einweiser"]],
  ["x-versand-schaden", "logistik", "versand", "alle", "Transportschäden vermeiden", "Typische Schäden im Versand", 6, [
    ["Ursachen", ["Türen gegen Nachbarfahrzeug geöffnet", "Zu wenig Abstand beim Parken"], "", ""],
    ["Vorbeugen", ["Mindestens 60 cm Abstand", "Türen vorsichtig öffnen"], "", ""],
    ["Melden", ["Jeden Schaden sofort melden", "Foto im System anhängen"], "", ""]
  ], ["Wie viel Abstand halten Sie beim Parken?", "Mindestens 60 cm", "10 cm", "Kein Abstand nötig"]],

  // ---------- Qualität ----------
  ["x-stichprobe", "qualitaet", "eingangspruefung", "qe-1", "Stichprobe ziehen", "Zulieferteile nach Prüfplan prüfen", 10, [
    ["Vorbereiten", ["Prüfplan zum Teil aufrufen", "Stichprobenumfang ablesen"], "", ""],
    ["Prüfen", ["Teile zufällig aus verschiedenen Kisten", "Merkmale laut Plan messen"], "", "Nie nur oben aus einer Kiste nehmen"],
    ["Entscheiden", ["Alle i.O.: Lieferung freigeben", "Fehler: Lieferung sperren"], "", ""]
  ], ["Woher werden die Teile genommen?", "Zufällig aus verschiedenen Kisten", "Nur von oben", "Aus der ersten Kiste"]],
  ["x-sperrlager", "qualitaet", "eingangspruefung", "qe-2", "Sperrlager", "Gesperrte Ware richtig behandeln", 8, [
    ["Kennzeichnen", ["Roten Sperrzettel anbringen", "Grund und Datum eintragen"], "", ""],
    ["Einlagern", ["Nur in den Sperrbereich", "Im System auf gesperrt buchen"], "Gesperrte Ware nie in die Fertigung", ""],
    ["Klären", ["Entscheidung durch die Qualität", "Ergebnis dokumentieren"], "", ""]
  ], ["Darf gesperrte Ware in die Fertigung?", "Nein, nie", "Ja, wenn es eilt", "Ja, nach Rücksprache mit dem Kollegen"]],
  ["x-eingang-grundlagen", "qualitaet", "eingangspruefung", "alle", "Warum Eingangsprüfung?", "Fehler früh finden, bevor sie verbaut werden", 6, [
    ["Ziel", ["Fehlerhafte Teile vor dem Einbau finden", "Lieferanten Rückmeldung geben"], "", ""],
    ["Kosten", ["Fehler im Eingang: wenige Euro", "Fehler am Fahrzeug: ein Vielfaches"], "", ""],
    ["Ihre Rolle", ["Genau prüfen", "Auffälligkeiten immer melden"], "", ""]
  ], ["Wann ist ein Fehler am günstigsten?", "Wenn er im Eingang gefunden wird", "Am fertigen Fahrzeug", "Beim Kunden"]],

  ["x-koordinaten", "qualitaet", "messtechnik", "qm-1", "Koordinatenmessgerät", "Bauteile auf dem Messgerät vermessen", 12, [
    ["Vorbereiten", ["Bauteil 1 Stunde im Messraum lagern", "Taster kalibrieren"], "", ""],
    ["Messen", ["Bauteil in die Vorrichtung spannen", "Messprogramm starten"], "Hände weg vom Messbereich während der Messung", ""],
    ["Auswerten", ["Protokoll auf rote Werte prüfen", "Ergebnis an den Auftraggeber"], "", ""]
  ], ["Warum wird das Bauteil vorher gelagert?", "Damit es Raumtemperatur hat", "Damit es trocknet", "Ohne Grund"]],
  ["x-spaltmass", "qualitaet", "messtechnik", "qm-3", "Spaltmaß messen", "Spalt und Versatz an Fahrzeugen messen", 8, [
    ["Messpunkte", ["Messpunkte laut Plan anfahren", "Lehre senkrecht ansetzen"], "", ""],
    ["Messen", ["Spalt und Versatz ablesen", "Wert sofort eintragen"], "", "Nicht drücken, sonst ändert sich der Spalt"],
    ["Bewerten", ["Grenzwerte im Plan vergleichen", "Abweichung an die Fertigung"], "", ""]
  ], ["Wie wird die Lehre angesetzt?", "Senkrecht und ohne Druck", "Schräg mit Druck", "Beliebig"]],
  ["x-messmittel", "qualitaet", "messtechnik", "alle", "Messmittel richtig nutzen", "Prüfmittel pflegen und prüfen", 6, [
    ["Vor Gebrauch", ["Prüfplakette auf Gültigkeit prüfen", "Messmittel auf Schäden prüfen"], "", ""],
    ["Gebrauch", ["Nur für den vorgesehenen Zweck", "Nicht fallen lassen"], "", ""],
    ["Nach Gebrauch", ["Reinigen und in den Koffer", "Defekte sofort melden"], "Abgelaufene Messmittel nicht verwenden", ""]
  ], ["Was prüfen Sie vor dem Gebrauch?", "Die Prüfplakette", "Die Farbe", "Nichts"]],

  ["x-finishaudit", "qualitaet", "audit", "q-01", "Finish-Audit", "Fahrzeuge am Bandende im Lichttunnel bewerten", 12, [
    ["Vorbereiten", ["Lichttunnel einschalten", "Auditliste für den Typ öffnen"], "", ""],
    ["Prüfen", ["Lack, Spaltmaße und Anbauteile prüfen", "Feste Reihenfolge rund ums Fahrzeug"], "", "Immer im Uhrzeigersinn, so wird nichts vergessen"],
    ["Bewerten", ["Fehler mit Gewichtung erfassen", "Kritische Fehler sofort an die Linie"], "", ""]
  ], ["In welcher Reihenfolge wird geprüft?", "Immer im Uhrzeigersinn ums Fahrzeug", "Zufällig", "Nur die Motorhaube"]],
  ["x-produktaudit", "qualitaet", "audit", "q-04", "Produktaudit", "Fahrzeuge aus Kundensicht prüfen", 15, [
    ["Auswahl", ["Fahrzeug zufällig vom Band nehmen", "Auditplan aufrufen"], "", ""],
    ["Prüfen", ["Außen, Innen und Funktion prüfen", "Mit den Augen des Kunden schauen"], "", ""],
    ["Bewerten", ["Fehler nach Gewichtung erfassen", "Ergebnis in der Runde vorstellen"], "", ""]
  ], ["Aus welcher Sicht wird geprüft?", "Aus Sicht des Kunden", "Aus Sicht der Montage", "Aus Sicht des Lieferanten"]],
  ["x-auditregeln", "qualitaet", "audit", "alle", "Regeln im Audit", "Faire und neutrale Bewertung", 6, [
    ["Neutral bleiben", ["Nur bewerten, was sichtbar ist", "Keine Schuldzuweisung"], "", ""],
    ["Gleich bewerten", ["Fehlerkatalog nutzen", "Im Zweifel zweite Person fragen"], "", ""],
    ["Transparent", ["Ergebnisse offen teilen", "Maßnahmen gemeinsam festlegen"], "", ""]
  ], ["Was nutzen Sie für eine gleiche Bewertung?", "Den Fehlerkatalog", "Das Bauchgefühl", "Die Meinung des Kollegen"]],

  ["x-8d", "qualitaet", "reklamation", "qr-1", "8D-Bericht", "Reklamationen mit der 8D-Methode bearbeiten", 15, [
    ["Team und Problem", ["Team zusammenstellen", "Problem genau beschreiben: was, wo, wann"], "", ""],
    ["Sofortmaßnahme", ["Kunden schützen, z. B. Bestand prüfen", "Ursache mit 5x Warum suchen"], "", ""],
    ["Abstellen", ["Dauerhafte Maßnahme umsetzen", "Wirksamkeit prüfen und Bericht abschließen"], "", "Ohne Wirksamkeitsprüfung ist der 8D nicht fertig"]
  ], ["Womit wird die Ursache gesucht?", "Mit der 5x-Warum-Methode", "Durch Raten", "Gar nicht"]],
  ["x-fehleranalyse", "qualitaet", "reklamation", "qr-2", "Fehleranalyse", "Rückläufer systematisch untersuchen", 10, [
    ["Aufnehmen", ["Teil fotografieren", "Fehlerbild beschreiben"], "", ""],
    ["Untersuchen", ["Mit einem i.O.-Teil vergleichen", "Messen und testen"], "Elektrische Teile nur spannungsfrei öffnen", ""],
    ["Berichten", ["Ergebnis im System dokumentieren", "Teil 3 Monate aufbewahren"], "", ""]
  ], ["Womit wird das Fehlerteil verglichen?", "Mit einem i.O.-Teil", "Mit einem Foto aus dem Internet", "Mit nichts"]],
  ["x-reklamation-grundlagen", "qualitaet", "reklamation", "alle", "Reklamation: der Ablauf", "Vom Kundenproblem zur Lösung", 6, [
    ["Eingang", ["Reklamation wird im System angelegt", "Verantwortliche Person wird benannt"], "", ""],
    ["Bearbeitung", ["Sofortmaßnahme innerhalb von 24 Stunden", "Ursache und Maßnahme im 8D"], "", ""],
    ["Abschluss", ["Kunde erhält den Bericht", "Erkenntnisse ins Team tragen"], "", ""]
  ], ["Wann muss die Sofortmaßnahme stehen?", "Innerhalb von 24 Stunden", "Nach einem Monat", "Gar nicht"]],

  ["x-pruefplan", "qualitaet", "pruefplanung", "qp-1", "Prüfplan erstellen", "Merkmale, Prüfmittel und Häufigkeit festlegen", 12, [
    ["Merkmale", ["Wichtige Merkmale aus der Zeichnung", "Sicherheitsmerkmale markieren"], "", ""],
    ["Festlegen", ["Prüfmittel pro Merkmal wählen", "Häufigkeit festlegen"], "", ""],
    ["Freigeben", ["Plan mit der Fertigung abstimmen", "Im System freigeben"], "", "Sicherheitsmerkmale immer zu 100 % prüfen"]
  ], ["Wie oft werden Sicherheitsmerkmale geprüft?", "Zu 100 %", "Gar nicht", "Einmal im Jahr"]],
  ["x-pruefmittel", "qualitaet", "pruefplanung", "qp-2", "Prüfmittelüberwachung", "Prüfmittel regelmäßig kalibrieren", 8, [
    ["Erfassen", ["Jedes Prüfmittel bekommt eine Nummer", "Kalibrierintervall festlegen"], "", ""],
    ["Kalibrieren", ["Fällige Prüfmittel einsammeln", "Ergebnis eintragen, neue Plakette"], "", ""],
    ["Sperren", ["Nicht bestandene Prüfmittel sperren", "Betroffene Messungen prüfen"], "Gesperrte Prüfmittel sofort aus der Fertigung", ""]
  ], ["Was passiert mit einem nicht bestandenen Prüfmittel?", "Es wird gesperrt", "Es wird weiter genutzt", "Es wird verschenkt"]],
  ["x-pruefplanung-grundlagen", "qualitaet", "pruefplanung", "alle", "Was ist Prüfplanung?", "Grundlagen für neue Mitarbeitende", 6, [
    ["Aufgabe", ["Festlegen, was wie oft geprüft wird", "Grundlage für alle Prüfungen"], "", ""],
    ["Zusammenarbeit", ["Mit Entwicklung, Fertigung und Lieferanten", "Änderungen immer abstimmen"], "", ""],
    ["Werkzeuge", ["Zeichnungen und Stücklisten", "Prüfplan im System"], "", ""]
  ], ["Mit wem wird der Prüfplan abgestimmt?", "Mit Entwicklung, Fertigung und Lieferanten", "Mit niemandem", "Nur mit dem Kunden"]],

  // ---------- Instandhaltung ----------
  ["x-getriebe", "instandhaltung", "mechanik", "im-1", "Getriebe warten", "Ölwechsel und Sichtprüfung am Antrieb", 12, [
    ["Freischalten", ["Anlage abschalten und Schloss setzen", "Spannungsfreiheit prüfen"], "Nie ohne eigenes Schloss arbeiten", ""],
    ["Ölwechsel", ["Altöl ablassen und auffangen", "Neues Öl bis zur Markierung"], "", ""],
    ["Prüfen", ["Auf Leckagen prüfen", "Wartung im System quittieren"], "", "Altöl immer getrennt entsorgen"]
  ], ["Was ist vor der Wartung Pflicht?", "Eigenes Schloss setzen", "Anlage laufen lassen", "Kollegen fragen"]],
  ["x-pneumatik", "instandhaltung", "mechanik", "im-2", "Pneumatik: Leckagen finden", "Druckluftverluste aufspüren", 8, [
    ["Vorbereiten", ["Ultraschall-Lecksuchgerät mitnehmen", "Anlage im Stillstand unter Druck"], "", ""],
    ["Suchen", ["Leitungen und Anschlüsse abfahren", "Lecks mit Anhänger markieren"], "Druck ablassen, bevor Sie Leitungen öffnen", ""],
    ["Beheben", ["Undichte Verschraubungen tauschen", "Ergebnis dokumentieren"], "", ""]
  ], ["Was tun Sie vor dem Öffnen einer Leitung?", "Druck ablassen", "Druck erhöhen", "Nichts"]],
  ["x-lockout", "instandhaltung", "mechanik", "alle", "Lockout-Tagout", "Anlagen sicher freischalten", 8, [
    ["Abschalten", ["Anlage am Bedienpult stoppen", "Hauptschalter aus"], "", ""],
    ["Sichern", ["Persönliches Schloss und Anhänger anbringen", "Alle Energien sichern: Strom, Druckluft, Hydraulik"], "Jede Person setzt ihr eigenes Schloss", ""],
    ["Prüfen", ["Startversuch: Anlage darf nicht anlaufen", "Erst dann arbeiten"], "", ""]
  ], ["Wer setzt ein Schloss?", "Jede Person, die arbeitet", "Nur der Meister", "Niemand"]],

  ["x-schaltschrank", "instandhaltung", "elektrik", "ie-1", "Arbeiten am Schaltschrank", "Sicher arbeiten nach den 5 Sicherheitsregeln", 12, [
    ["Freischalten", ["Freischalten und gegen Wiedereinschalten sichern", "Spannungsfreiheit feststellen"], "Nur Elektrofachkräfte arbeiten am Schaltschrank", ""],
    ["Absichern", ["Erden und kurzschließen", "Benachbarte Teile abdecken"], "", ""],
    ["Abschließen", ["Werkzeug vollständig entfernen", "Schrank schließen, Freigabe erteilen"], "", ""]
  ], ["Wer darf am Schaltschrank arbeiten?", "Nur Elektrofachkräfte", "Jeder", "Alle mit Handschuhen"]],
  ["x-sensorik", "instandhaltung", "elektrik", "ie-3", "Sensor tauschen", "Induktive Sensoren tauschen und einstellen", 8, [
    ["Vorbereiten", ["Typ des Sensors prüfen", "Anlage freischalten"], "", ""],
    ["Tauschen", ["Stecker lösen, Sensor ausbauen", "Neuen Sensor auf Schaltabstand einstellen"], "", "Schaltabstand steht im Datenblatt"],
    ["Testen", ["LED am Sensor prüfen", "Testlauf mit Freigabe"], "", ""]
  ], ["Wo steht der Schaltabstand?", "Im Datenblatt", "Auf der Verpackung", "Nirgends"]],
  ["x-elektro-grundlagen", "instandhaltung", "elektrik", "alle", "Elektrische Gefahren", "Was jeder in der Halle wissen muss", 6, [
    ["Gefahren", ["Beschädigte Kabel und Stecker", "Offene Schaltschränke"], "", ""],
    ["Verhalten", ["Beschädigtes nicht benutzen", "Sofort an die Instandhaltung melden"], "Nie selbst reparieren", ""],
    ["Notfall", ["Not-Aus kennen", "Erste Hilfe erst nach dem Abschalten"], "", ""]
  ], ["Was tun mit einem beschädigten Kabel?", "Nicht benutzen und melden", "Mit Klebeband flicken", "Weiter benutzen"]],

  ["x-teachen", "instandhaltung", "robotik", "ir-1", "Roboter teachen", "Bahnpunkte sicher nachteachen", 15, [
    ["Vorbereiten", ["Betriebsart T1 wählen", "Zustimmtaster testen"], "Im Automatikbetrieb nie die Zelle betreten", ""],
    ["Teachen", ["Mit reduzierter Geschwindigkeit verfahren", "Punkt speichern und kommentieren"], "", ""],
    ["Testen", ["Programm schrittweise testen", "Erst dann in Automatik"], "", "Programmstand vorher sichern"]
  ], ["Welche Betriebsart gilt beim Teachen?", "T1 mit reduzierter Geschwindigkeit", "Automatik", "Egal"]],
  ["x-werkzeugwechsel", "instandhaltung", "robotik", "ir-2", "Werkzeugwechsel am Roboter", "Greifer und Schweißzangen wechseln", 10, [
    ["Sichern", ["Roboter in Wartungsposition fahren", "Zelle freischalten"], "Eigenes Schloss setzen", ""],
    ["Wechseln", ["Medien abkoppeln: Luft, Strom, Wasser", "Werkzeug mit dem Kran abnehmen"], "", ""],
    ["Prüfen", ["Neues Werkzeug kalibrieren", "Testlauf mit Freigabe"], "", ""]
  ], ["Womit wird das Werkzeug abgenommen?", "Mit dem Kran", "Von Hand", "Mit dem Stapler"]],
  ["x-roboter-sicherheit", "instandhaltung", "robotik", "alle", "Sicherheit an Roboterzellen", "Grundregeln für alle", 6, [
    ["Schutzeinrichtungen", ["Lichtgitter und Türen nie überbrücken", "Defekte sofort melden"], "Überbrückte Schutzeinrichtungen sind lebensgefährlich", ""],
    ["Betreten", ["Nur im Wartungsmodus", "Nur mit eigenem Schloss"], "", ""],
    ["Verlassen", ["Alle Personen raus", "Erst dann Freigabe"], "", ""]
  ], ["Dürfen Schutzeinrichtungen überbrückt werden?", "Nein, nie", "Ja, kurz", "Ja, wenn es eilt"]],

  ["x-haengebahn", "instandhaltung", "foerdertechnik", "if-1", "Hängebahn warten", "Gehänge und Fahrwerke prüfen", 10, [
    ["Sichern", ["Abschnitt stillsetzen", "Schloss am Schalter setzen"], "Nie unter einem Gehänge arbeiten", ""],
    ["Prüfen", ["Laufrollen auf Verschleiß", "Stromschiene auf Abbrand"], "", ""],
    ["Freigeben", ["Testfahrt mit leerem Gehänge", "Wartung quittieren"], "", ""]
  ], ["Wo dürfen Sie nicht arbeiten?", "Unter einem Gehänge", "Am Bedienpult", "In der Pause"]],
  ["x-skid", "instandhaltung", "foerdertechnik", "if-2", "Skidförderer", "Rollenbahnen und Hubtische instand halten", 10, [
    ["Sichern", ["Abschnitt freischalten", "Hubtisch mechanisch sichern"], "Hubtisch nie nur elektrisch sichern", ""],
    ["Prüfen", ["Rollen auf Leichtgängigkeit", "Ketten schmieren"], "", ""],
    ["Testen", ["Leeren Skid durchfahren lassen", "Sensoren prüfen"], "", ""]
  ], ["Wie wird der Hubtisch gesichert?", "Mechanisch", "Nur elektrisch", "Gar nicht"]],
  ["x-foerder-stoerung", "instandhaltung", "foerdertechnik", "alle", "Störung am Förderer", "Richtig reagieren bei Stau und Stopp", 6, [
    ["Erkennen", ["Meldung am Leitstand lesen", "Ort der Störung finden"], "", ""],
    ["Beheben", ["Nur nach Freischalten eingreifen", "Verklemmte Teile mit Werkzeug lösen"], "Nie in laufende Förderer greifen", ""],
    ["Melden", ["Ursache im System eintragen", "Wiederholungen an die Instandhaltung"], "", ""]
  ], ["Wann darf eingegriffen werden?", "Nur nach dem Freischalten", "Sofort", "Während der Förderer läuft"]],

  ["x-stoerungsannahme", "instandhaltung", "anlagenbetreuung", "ia-1", "Störungsannahme", "Störmeldungen richtig aufnehmen", 8, [
    ["Aufnehmen", ["Anlage, Fehlerbild und Uhrzeit erfassen", "Priorität festlegen"], "", ""],
    ["Verteilen", ["Passende Fachkraft zuweisen", "Rückmeldung an die Linie"], "", ""],
    ["Abschließen", ["Ursache und Maßnahme dokumentieren", "Störung schließen"], "", "Gute Doku hilft beim nächsten Mal"]
  ], ["Was wird bei der Annahme erfasst?", "Anlage, Fehlerbild und Uhrzeit", "Nur der Name", "Nichts"]],
  ["x-wartungsplan", "instandhaltung", "anlagenbetreuung", "ia-2", "Wartungsplan abarbeiten", "Vorbeugende Wartung nach Plan", 10, [
    ["Planen", ["Fällige Aufträge im System öffnen", "Material und Werkzeug bereitlegen"], "", ""],
    ["Durchführen", ["Checkliste Punkt für Punkt", "Messwerte eintragen"], "Vor jeder Wartung freischalten", ""],
    ["Rückmelden", ["Auftrag abschließen", "Auffälligkeiten als neuen Auftrag anlegen"], "", ""]
  ], ["Was tun mit Auffälligkeiten?", "Als neuen Auftrag anlegen", "Ignorieren", "Mündlich weitersagen"]]
];

// Kurzform in den Schulungstext umwandeln
function seedSource(def) {
  const [, , , , title, sub, minutes, steps, quiz] = def;
  const lines = [`# ${title}`, `untertitel: ${sub}`, `dauer: ${minutes} Minuten`, "version: 1.0", "autor: Andreas Knaub"];
  steps.forEach(([name, bullets, warn, tip]) => {
    lines.push("---", `## Schritt: ${name}`, ...bullets.map(b => `- ${b}`));
    if (warn) lines.push(`! ${warn}`);
    if (tip) lines.push(`> ${tip}`);
  });
  const [q, right, ...wrong] = quiz;
  // Richtige Antwort an wechselnde Stelle setzen
  const answers = wrong.map(w => `[ ] ${w}`);
  answers.splice(title.length % (answers.length + 1), 0, `[x] ${right}`);
  lines.push("---", "## Wissenscheck", `? ${q}`, ...answers);
  return lines.join("\n");
}

function seedExtraTrainings() {
  return SEED_EXTRA.map((def, i) => ({
    id: def[0], department: def[1], unit: def[2], station: def[3],
    status: def[9] || "freigegeben", source: seedSource(def), themeId: "", translations: {},
    updatedAt: libDate(3 + (i % 40))
  }));
}
