# Projekt-Struktur: 37.3-Prüfungsassistent

## Dateiübersicht

### Hauptdateien
- **index.html** - Startseite mit Kunden-Auswahl und Dashboard
- **formular.html** - Formular-Ausfüll-Seite mit PDF-Vorschau
- **einstellungen.html** - Einstellungen und Konfiguration
- **hilfe.html** - Hilfe-Seite mit Anleitungen

### JavaScript-Dateien
- **main.js** - Hauptlogik, API-Integration, PDF-Handling
- **config.js** - Konfiguration und Environment-Variablen

### Ressourcen
- **resources/** - Bilder, Icons und statische Dateien
  - **logo.png** - Pflegedienst-Logo
  - **hero-bg.jpg** - Hero-Bild für Startseite
  - **icons/** - SVG-Icons für UI-Elemente

### Konfigurationsdateien
- **netlify.toml** - Netlify-Deployment-Konfiguration
- **package.json** - NPM-Abhängigkeiten (falls benötigt)

## Seiten-Struktur

### Index.html (Startseite)
**Zweck**: Übersicht und Kunden-Auswahl
**Layout**:
- Header mit Navigation und Logo
- Hero-Bereich mit Kurz-Beschreibung
- Hauptbereich:
  - Linke Spalte: Kunden-Suchleiste und Filter
  - Rechte Spalte: Kunden-Liste mit Karteikarten
- Footer mit minimalen Informationen

**Interaktive Elemente**:
- Live-Suche nach Kundendaten
- Filter nach Status, Region, Pflegegrad
- Kundenkarten mit Hover-Effekten
- "Neue Prüfung starten"-Button

### Formular.html (Hauptarbeitsseite)
**Zweck**: PDF-Formular ausfüllen und bearbeiten
**Layout**:
- Header mit Fortschrittsanzeige
- Hauptbereich:
  - Linke Hälfte: Formular-Eingabefelder
  - Rechte Hälfte: PDF-Vorschau
- Navigation: Zurück/Weiter-Buttons
- Footer: Aktionen (Speichern, Exportieren)

**Interaktive Elemente**:
- Progressive Formularabschnitte
- Echtzeit-PDF-Vorschau
- Validierung der Eingaben
- Autosave-Funktionalität

### Einstellungen.html (Konfiguration)
**Zweck**: API-Konfiguration und Anwendungseinstellungen
**Layout**:
- Header mit Navigation
- Hauptbereich:
  - Airtable-Konfiguration
  - PDF-Vorlagen-Verwaltung
  - Benutzereinstellungen
- Footer: Speichern-Button

**Interaktive Elemente**:
- API-Token-Eingabe
- Datenbank-Verbindung testen
- Vorlagen-Upload und -Verwaltung
- Einstellungen importieren/exportieren

### Hilfe.html (Dokumentation)
**Zweck**: Bedienungsanleitung und Support
**Layout**:
- Header mit Navigation
- Hauptbereich:
  - FAQ-Bereich
  - Schritt-für-Schritt-Anleitung
  - Kontaktinformationen
- Footer: Support-Links

**Interaktive Elemente**:
- Suchfunktion in der Hilfe
- Kollabierbare FAQ-Abschnitte
- Video-Tutorials (optional)
- Kontaktformular

## JavaScript-Architektur

### main.js - Module

#### API-Manager
- Airtable-Integration
- Datenabfrage und -manipulation
- Fehlerbehandlung und Caching

#### PDF-Manager
- PDF-Vorlagen laden
- Formularfelder füllen
- PDF-Generierung und -Export

#### UI-Manager
- Navigation zwischen Seiten
- Formular-Validierung
- Benutzer-Interaktionen
- Loading-States und Feedback

#### Data-Manager
- Lokale Speicherung (LocalStorage)
- Daten-Transformation
- Validierungs-Logik

### config.js - Konfiguration
- Environment-Variablen (Netlify)
- API-Endpunkte
- Standard-Einstellungen
- Fehler-Meldungen

## Datenfluss

### 1. Initialisierung
- Laden der Konfiguration
- Prüfung der API-Verbindung
- Laden der Benutzereinstellungen

### 2. Kunden-Auswahl
- API-Call zu Airtable
- Anzeige der Kundenliste
- Auswahl eines Kunden
- Laden der Kundendaten

### 3. Formular-Ausfüllung
- Vorausfüllen mit Kundendaten
- Manuelle Ergänzung
- Live-Validierung
- Zwischenspeicherung

### 4. PDF-Generierung
- Zusammenstellen aller Daten
- PDF-Vorlage laden
- Felder befüllen
- Export/ Download

## Deployment-Struktur

### Netlify-Konfiguration
- Build-Einstellungen
- Environment-Variablen
- Redirects für SPA-Routing
- Security-Headers

### GitHub-Integration
- Repository-Struktur
- Branch-Strategie
- CI/CD-Pipeline
- Versionierung

## Erweiterbarkeit

### Zukünftige Features
- Multi-User-Support
- Erweiterte Statistiken
- E-Mail-Benachrichtigungen
- Backup-Funktionalität

### Plugin-System
- Modulare Erweiterungen
- Custom PDF-Vorlagen
- Integration mit anderen Systemen
- API-Erweiterungen