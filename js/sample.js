// Beispielschulung (fiktiv), die beim ersten Start geladen wird
const SAMPLE_TRAINING = `# Montage Türverkleidung vorne links
untertitel: Arbeitsschritte, Sicherheit und Qualitätsprüfung an Station T-04
bereich: Montage Tür
dauer: 20 Minuten
version: 1.2
autor: Andreas Knaub
---
## Lernziele
- Sie montieren die Türverkleidung in der richtigen Reihenfolge
- Sie kennen die Sicherheitsregeln an Station T-04
- Sie erkennen typische Qualitätsfehler, bevor das Fahrzeug weiterläuft
---
## Schritt: Arbeitsplatz vorbereiten
- Schutzhandschuhe und Schutzbrille anlegen
- Clips, Schrauben und Verkleidung auf Vollständigkeit prüfen
- Akkuschrauber auf **2,5 Nm** einstellen
! Ohne Schutzhandschuhe nicht an der scharfkantigen Türinnenseite arbeiten
---
## Schritt: Kabelstrang anschließen
- Stecker für Fensterheber und Spiegel einstecken, bis er hörbar einrastet
- Kabel in die Führung legen, nicht knicken
> Ein fehlendes Klick-Geräusch ist der häufigste Grund für Nacharbeit
---
## Schritt: Verkleidung einsetzen
- Verkleidung oben an der Fensterleiste einhängen
- Von oben nach unten andrücken, bis alle Clips sitzen
- Zwei Schrauben im Türgriff mit dem Akkuschrauber festziehen
! Nicht mit dem Knie gegen die Verkleidung drücken, Clips können brechen
---
## Schritt: Qualität prüfen
- Spaltmaße oben und an der Seite per Sichtprüfung kontrollieren
- Fensterheber und Spiegel einmal bedienen
- Prüfung im Terminal mit **OK** bestätigen
> Bei Auffälligkeiten sofort die Teamleitung informieren, nicht selbst nacharbeiten
---
## Wissenscheck
? Auf welches Drehmoment wird der Akkuschrauber eingestellt?
[ ] 1,5 Nm
[x] 2,5 Nm
[ ] 4,0 Nm
[ ] 6,0 Nm
`;

// Zweites Beispiel: Einführung einer (fiktiven) Software mit gezeichneten App-Bildschirmen
const SAMPLE_SOFTWARE = `# Einführung QualiScan
untertitel: Fehler direkt am Tablet erfassen statt auf dem Nacharbeitszettel
bereich: Montage, alle Stationen
dauer: 10 Minuten
version: 1.0
autor: Andreas Knaub
---
## Lernziele
- Sie melden sich in QualiScan an
- Sie erfassen einen Fehler vollständig mit Foto
- Sie wissen, was bei einer Störung zu tun ist
---
## Schritt: Anmelden
- Tablet entsperren und die App QualiScan öffnen
- Mitarbeiterausweis an das Lesegerät halten, ein Passwort ist nicht nötig
> Nach 10 Minuten ohne Eingabe meldet sich die App automatisch ab
handy: QualiScan | Anmelden
hinweis-app: Bitte Mitarbeiterausweis an das Lesegerät halten
feld: Station | M-12 Frontend
button!: Mit Ausweis anmelden
---
## Schritt: Fehler erfassen
- Fahrzeug-Barcode an der Karosse scannen
- Bauteil und Fehlerart aus der Liste wählen
- Foto mit der Tablet-Kamera aufnehmen
- Auf **Senden** tippen, die Meldung geht direkt an die Nacharbeit
! Auf Fotos dürfen keine Personen zu sehen sein (Datenschutz)
handy: QualiScan | Fehler erfassen
feld: Fahrzeug | 5UX-48213
liste: Bauteil | Tür vorne links
auswahl: Fehlerart | *Kratzer, Spalt, Fehlteil, Funktion
foto: Foto aufnehmen
button!: Senden
---
## Schritt: Status prüfen
- Unter **Meine Meldungen** sehen Sie alle eigenen Fehlermeldungen
- Der Status zeigt: offen, in Bearbeitung oder erledigt
handy: QualiScan | Meine Meldungen
feld: 5UX-48213 · Tür vorne links | offen
feld: 5UX-47990 · Stoßfänger | in Bearbeitung
feld: 5UX-47852 · Spiegel rechts | erledigt
button!: Meldung öffnen
---
## Schritt: Bei Störungen
- App einmal schließen und neu öffnen
- Hilft das nicht: IT-Hotline **4711** anrufen
- Bis dahin den Fehler auf dem Notfall-Zettel notieren
---
## Wissenscheck
? Was tun Sie als Erstes, bevor Sie einen Fehler erfassen?
[ ] Ein Foto aufnehmen
[x] Den Fahrzeug-Barcode scannen
[ ] Die IT-Hotline anrufen
`;
