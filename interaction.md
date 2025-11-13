# Interaction Design für 37.3-Prüfungsformular Webanwendung

## Hauptfunktionalitäten

### 1. Kundenauswahl und Datenabfrage
- **Such- und Filterfunktion**: Live-Suche nach Kundennamen, ID oder Adresse
- **Kundenkarteikarte**: Anzeige von Name, Adresse, Geburtsdatum, Versicherungsnummer
- **Schnellauswahl**: Dropdown mit allen aktiven Kunden aus Airtable
- **Datenabfrage**: Automatisches Laden der Kundendaten bei Auswahl

### 2. PDF-Formular-Verwaltung
- **Formularauswahl**: Dropdown mit verschiedenen 37.3-Vorlagen
- **Vorausfüllung**: Automatisches Eintragen der Kundendaten in PDF-Felder
- **Manuelle Bearbeitung**: Möglichkeit zur manuellen Ergänzung fehlender Daten
- **Vorschau**: Live-Vorschau des ausgefüllten PDFs

### 3. Formular-Ausfüll-Workflow
- **Schritt-für-Schritt-Modus**: Geführte Eingabe durch die einzelnen Formularabschnitte
- **Validierung**: Echtzeit-Validierung der eingegebenen Daten
- **Zwischenspeicherung**: Automatisches Speichern des Fortschritts
- **Fehleranzeige**: Klare Markierung fehlender oder falscher Angaben

### 4. Export und Speicherung
- **PDF-Generierung**: Erstellung des finalen PDF-Dokuments
- **Download**: Direkter Download des ausgefüllten Formulars
- **Speicherung**: Abspeicherung in der Airtable-Datenbank
- **Druckoption**: Optimierte Druckansicht

## User Interface Flow

### Startbildschirm
1. **Header**: Logo, Titel "37.3-Prüfungsassistent", Benutzerinfo
2. **Hauptbereich**: 
   - Linke Seite: Kunden-Suchleiste und -liste
   - Rechte Seite: Formularauswahl und Vorschau
3. **Schnellaktionen**: "Neue Prüfung erstellen", "Letzte Prüfungen"

### Formular-Ansicht
1. **Kunden-Info-Panel**: Fixierte Anzeige der Kundendaten
2. **Formular-Bereich**: Aufklappbare Abschnitte des 37.3-Formulars
3. **Navigation**: Fortschrittsbalken, Zurück/Weiter-Buttons
4. **Hilfebereich**: Kontext-sensitive Hilfetexte und Erklärungen

### Abschluss-Bildschirm
1. **Zusammenfassung**: Alle eingegebenen Daten übersichtlich
2. **Validierungsergebnis**: Liste der geprüften Punkte
3. **Export-Optionen**: PDF-Download, Speichern, Versenden
4. **Neustart**: Button für neue Prüfung

## Interaktive Elemente

### Suchfunktion
- Live-Suche mit Autocomplete
- Filter nach Status, Region oder Pflegegrad
- Sortieroptionen nach verschiedenen Kriterien

### Formular-Interaktionen
- Dropdown-Menüs für standardisierte Angaben
- Datepicker für Datumsfelder
- Checkboxen und Radio-Buttons für Ja/Nein-Fragen
- Textareas für Bemerkungen mit Zeichenzähler

### Navigation
- Breadcrumb-Navigation
- Schnellzugriffs-Tastenkombinationen
- Responsive Design für Tablet-Nutzung

## Datenfluss
1. **Initialisierung**: Laden der Airtable-Konfiguration
2. **Kundenabfrage**: API-Call zu Airtable mit Caching
3. **Formularzuordnung**: Mapping der Kundendaten zu PDF-Feldern
4. **Validierung**: Client-seitige und server-seitige Prüfung
5. **Export**: PDF-Generierung und Speicherung

## Fehlerbehandlung
- Netzwerkfehler: Wiederholungs-Logik mit Timeout
- Validierungsfehler: Klare Fehlermeldungen mit Korrekturhinweisen
- API-Fehler: Fallback-Modus mit manueller Eingabe
- PDF-Fehler: Alternative Export-Formate