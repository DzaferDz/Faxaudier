# Faxaudier — Personal Study Workspace

**Faxaudier** ist deine persönliche, elegante Studien- und Lernplattform mit einem modernen **Dark Olive Green / Forest Sage**-Design.

---

## 🌟 Kernfunktionen

1. **Dashboard**
   - Überblick über aktive Studienfächer, Gesamtkarten, heute fällige Wiederholungen und geschätzte Wissensretention.
   - Zuletzt geöffnete Dokumente und Schnellaktionen (Karteikarte anlegen, neues Fach, Upload).

2. **Karteikarten & Intelligentes Spaced Repetition (SM-2)**
   - Erstellung, Bearbeitung und Löschung von Karteikarten mit Fach- und Themenzuordnung.
   - Interaktiver Lernmodus mit Tastatursteuerung (`Space` zum Aufdecken, `1-4` für die Bewertung: Nochmal, Schwer, Gut, Einfach).
   - Automatische Berechnung von Wiederholungsintervallen und Ease-Faktoren.

3. **Fächer & Dokumenten-Workspace**
   - Verwaltung universitärer Module (Modulkürzel, Farbakzente, Semester, Beschreibungen).
   - Ordner- und Unterordnerstruktur für Vorlesungsfolien, Übungsblätter, Zusammenfassungen und Klausurmaterial.
   - Drag & Drop Dokumenten-Upload.

4. **Lokale Dateiverwaltung & Vorschau**
   - Unterstützung für PDF, DOCX, PPTX, TXT und Bilder.
   - Integrierter Dokumentenbetrachter mit Zoom- und Download-Funktion.
   - Dauerhafte Offline-Persistenz im Browser über **IndexedDB** und **LocalStorage**.

5. **Dreisprachige Benutzeroberfläche (Multilingual)**
   - **Deutsch** (Standard)
   - **Bosnisch** (Maternji jezik)
   - **Englisch** (International)
   - Sofortiges Umschalten mit persistenter Speicherung.

6. **Datensicherung & Export**
   - 1-Klick JSON-Backup aller Fächer, Ordner, Karteikarten und Datei-Metadaten.
   - Import & Wiederherstellung von Backups.
   - Option zum Zurücksetzen auf die reichhaltigen Beispieldatensätze.

---

## 🚀 Entwicklung & Start

Der Server läuft unter:
```bash
http://127.0.0.1:5173/
```

Für spätere Starts:
```bash
npm run dev
```

Oder Produktionsbuild:
```bash
npm run build
npm run preview
```
