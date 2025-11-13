# 37.3-Prüfungsassistent

Eine moderne, webbasierte Lösung für die digitale Verwaltung und Ausfüllung von 37.3-Prüfungsformularen für Pflegedienste.

## 🚀 Funktionen

### Hauptfunktionen
- **Kundenverwaltung**: Integration mit Airtable für Kundendaten
- **Automatische Vorausfüllung**: Bekannte Kundendaten werden automatisch in PDF-Formulare eingefügt
- **Schrittweise Formularbearbeitung**: Geführte Eingabe durch verschiedene Formularabschnitte
- **Live-PDF-Vorschau**: Echtzeit-Vorschau des ausgefüllten Formulars
- **Export & Speicherung**: Generierung von PDF-Dokumenten mit automatischer Benennung

### Technische Features
- **Responsive Design**: Optimiert für Desktop und Tablet
- **Auto-Save**: Automatisches Speichern alle 30 Sekunden
- **Suche & Filter**: Schnelle Kundenfindung durch Live-Suche
- **Validierung**: Echtzeit-Validierung der Formulareingaben
- **Demo-Modus**: Testbetrieb ohne Airtable-Verbindung

## 🛠️ Technologie-Stack

### Frontend
- **HTML5** mit moderner Semantik
- **Tailwind CSS** für Styling und Responsive Design
- **Vanilla JavaScript** für Performance und einfache Wartung

### Libraries & Frameworks
- **Anime.js** - Animationen und Übergänge
- **Splitting.js** - Text-Animationen
- **ECharts.js** - Datenvisualisierung und Statistiken
- **p5.js** - Kreative Hintergrund-Animationen
- **PDF-Lib** - PDF-Generierung und -Manipulation

### Deployment
- **Netlify** - Hosting und Continuous Deployment
- **GitHub** - Versionskontrolle und Source Code Management

## 📁 Projektstruktur

```
/
├── index.html              # Startseite mit Kundenübersicht
├── formular.html           # Formular-Ausfüll-Seite
├── einstellungen.html      # Einstellungen und Konfiguration
├── hilfe.html             # Hilfe-Seite mit Anleitungen
├── main.js                # Haupt-JavaScript-Logik
├── config.js              # Konfiguration und Environment-Variablen
├── netlify.toml           # Netlify-Konfiguration
├── resources/             # Bilder und statische Dateien
└── README.md              # Diese Datei
```

## 🚦 Schnellstart

### 1. Repository klonen
```bash
git clone https://github.com/ihre-organisation/37.3-pruefungsassistent.git
cd 37.3-pruefungsassistent
```

### 2. Lokale Entwicklung
```bash
# Einfachen HTTP-Server starten
python -m http.server 8000
# oder
npx serve .

# Anwendung ist nun unter http://localhost:8000 erreichbar
```

### 3. Airtable-Konfiguration
1. Gehen Sie zu [airtable.com](https://airtable.com) und erstellen Sie einen Account
2. Erstellen Sie eine neue Base mit einer Tabelle "Kunden"
3. Generieren Sie einen API-Key unter "Account" → "API"
4. Notieren Sie sich Base-ID und API-Key

### 4. Deployment auf Netlify
1. Verbinden Sie Ihr GitHub-Repository mit Netlify
2. Setzen Sie die Environment-Variablen:
   - `AIRTABLE_API_KEY`: Ihr Airtable API-Key
   - `AIRTABLE_BASE_ID`: Ihre Base-ID
   - `AIRTABLE_TABLE_NAME`: Name der Kundentabelle (Standard: "Kunden")

## ⚙️ Konfiguration

### Environment-Variablen

| Variable | Beschreibung | Beispiel |
|----------|-------------|----------|
| `AIRTABLE_API_KEY` | Ihr persönlicher Airtable API-Key | `keyXXXXXXXXXXXXXX` |
| `AIRTABLE_BASE_ID` | Die ID Ihrer Airtable-Base | `appXXXXXXXXXXXXXX` |
| `AIRTABLE_TABLE_NAME` | Name der Kundentabelle | `Kunden` |
| `DEMO_MODE` | Aktiviert den Demo-Modus | `true` oder `false` |
| `DEBUG_MODE` | Aktiviert erweiterte Debug-Infos | `true` oder `false` |

### Airtable-Datenstruktur

Erforderliche Felder in Ihrer Kundentabelle:

| Feldname | Typ | Beschreibung |
|----------|-----|-------------|
| `Name` | Single line text | Voller Name des Kunden |
| `Vorname` | Single line text | Vorname |
| `Nachname` | Single line text | Nachname |
| `Geburtsdatum` | Date | Geburtsdatum |
| `Adresse` | Single line text | Straße und Hausnummer |
| `PLZ` | Single line text | Postleitzahl |
| `Ort` | Single line text | Stadt |
| `Versicherungsnummer` | Single line text | Versicherungsnummer |
| `Pflegegrad` | Single select | Pflegegrad (1-5) |
| `Status` | Single select | Aktiv/Inaktiv/Neu |
| `Region` | Single select | Geografische Zuordnung |
| `Telefon` | Phone number | Telefonnummer |
| `Email` | Email | E-Mail-Adresse |
| `Letzte Prüfung` | Date | Datum der letzten Prüfung |
| `Nächste Prüfung` | Date | Datum der nächsten Prüfung |

## 📖 Bedienungsanleitung

### Kundenauswahl
1. **Startseite**: Sehen Sie alle Kunden aus Ihrer Airtable-Datenbank
2. **Suche**: Verwenden Sie die Live-Suche nach Name, ID oder Adresse
3. **Filter**: Filtern Sie nach Status, Region oder Pflegegrad
4. **Auswahl**: Klicken Sie auf "Neue Prüfung" oder wählen Sie einen Kunden aus

### Formular ausfüllen
1. **Automatische Vorausfüllung**: Bekannte Daten werden eingefügt
2. **Schrittweise Navigation**: Füllen Sie das Formular in 4 Schritten aus
3. **Validierung**: Pflichtfelder werden automatisch validiert
4. **PDF-Vorschau**: Sehen Sie live, wie Ihr Formular aussieht

### Export & Speicherung
1. **PDF-Generierung**: Klicken Sie auf "PDF Generieren" im letzten Schritt
2. **Automatische Benennung**: PDFs werden mit Kundendaten und Datum benannt
3. **Download**: Das PDF wird automatisch heruntergeladen
4. **Speicherung**: Formulare werden lokal zwischengespeichert

## 🔧 Entwicklung

### Lokale Entwicklung
```bash
# Repository klonen
git clone https://github.com/ihre-organisation/37.3-pruefungsassistent.git

# In Projektordner wechseln
cd 37.3-pruefungsassistent

# HTTP-Server starten
python -m http.server 8000

# Browser öffnen
open http://localhost:8000
```

### Code-Struktur
- **main.js**: Hauptlogik mit Klassen für App-Management und PDF-Handling
- **config.js**: Konfigurationsmanagement und Environment-Variablen
- **index.html**: Startseite mit Kundenübersicht und Statistiken
- **formular.html**: Formular-Seite mit schrittweiser Eingabe
- **einstellungen.html**: Einstellungen für API-Konfiguration
- **hilfe.html**: Hilfe-Seite mit FAQ und Anleitungen

### Erweiterungen
Die Anwendung ist modular aufgebaut und kann einfach erweitert werden:

- **Neue Formularfelder**: In `formular.html` hinzufügen
- **Zusätzliche Validierung**: In `main.js` ergänzen
- **Weitere PDF-Vorlagen**: In `config.js` konfigurieren
- **Custom CSS**: Über Tailwind CSS-Konfiguration

## 🐛 Fehlerbehebung

### Häufige Probleme

#### Airtable-Verbindung fehlgeschlagen
- **Ursache**: Falsche API-Key oder Base-ID
- **Lösung**: Überprüfen Sie die Credentials in den Einstellungen
- **Test**: Verwenden Sie die "Verbindung testen"-Funktion

#### PDF wird nicht generiert
- **Ursache**: Fehlende Pflichtfelder oder Browser-Kompatibilität
- **Lösung**: Füllen Sie alle Pflichtfelder aus, verwenden Sie einen modernen Browser
- **Test**: Aktivieren Sie den Debug-Modus in den Einstellungen

#### Daten werden nicht geladen
- **Ursache**: Netzwerkprobleme oder API-Limit erreicht
- **Lösung**: Überprüfen Sie die Internetverbindung, prüfen Sie Airtable-Quota
- **Alternative**: Aktivieren Sie den Demo-Modus

### Debug-Modus
Aktivieren Sie den Debug-Modus in den Einstellungen, um:
- Detaillierte Fehlermeldungen im Browser-Console
- Netzwerk-Requests und API-Antworten zu sehen
- Performance-Metriken und Statistiken

## 🔐 Sicherheit

### Datenschutz
- **Lokale Speicherung**: Kundendaten werden nur lokal im Browser gespeichert
- **Keine Cloud-Speicherung**: Keine Übertragung sensibler Daten an Dritte
- **HTTPS**: Alle Datenübertragungen sind verschlüsselt
- **CORS**: Sichere API-Kommunikation mit Airtable

### Best Practices
- **API-Keys**: Niemals in Code einchecken, nur als Environment-Variablen
- **Zugriffsrechte**: Minimal notwendige Rechte für Airtable-API
- **Regelmäßige Updates**: Halten Sie Abhängigkeiten aktuell
- **Monitoring**: Überwachen Sie API-Usage und Error-Logs

## 📄 Lizenz

Dieses Projekt ist für den internen Gebrauch im Pflegedienst konzipiert. Alle Rechte vorbehalten.

## 🤝 Support

Bei Fragen oder Problemen:
- **Technischer Support**: support@pflegedienst.de
- **Schulung & Beratung**: schulung@pflegedienst.de
- **Dokumentation**: Siehe Hilfe-Seite in der Anwendung

## 🔄 Changelog

### Version 1.0.0 (13.11.2024)
- ✨ Erste Version des 37.3-Prüfungsassistenten
- 🎯 Airtable-Integration für Kundendaten
- 📄 PDF-Generierung mit automatischer Vorausfüllung
- 🎨 Modernes UI mit Animationen und Effekten
- 🔧 Konfigurierbare Einstellungen
- 📱 Responsive Design für alle Geräte

---

**Entwickelt mit ❤️ für den Pflegedienst Digital**