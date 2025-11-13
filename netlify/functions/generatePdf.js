// Benötigte Bibliotheken
const Airtable = require('airtable');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises; // Zum Lesen der PDF-Datei
const path = require('path');     // Zum Erstellen des Dateipfads

exports.handler = async (event, context) => {

    try {
        // 1. Klienten-ID aus der URL holen
        //    (aus dem Aufruf von app.js: ...?clientId=rec12345)
        const { clientId } = event.queryStringParameters;

        if (!clientId) {
            return { statusCode: 400, body: 'Fehlende clientId' };
        }

        // 2. Geheime Schlüssel aus Netlify holen
        const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, KUNDEN_TABLE_NAME } = process.env;

        // 3. Den *einen* spezifischen Klienten von Airtable holen
        const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
        const record = await base(KUNDEN_TABLE_NAME).find(clientId);
        
        // 'clientData' enthält jetzt alle Spalten als Objekt
        // z.B.: { "Name": "Erika Mustermann", "Geburtstag": "1945-10-20", ... }
        const clientData = record.fields;

        // 4. PDF-Template-Datei laden
        //    Wir gehen davon aus, dass 'vorlage_37_3.pdf' im Root-Verzeichnis liegt.
        //    path.join() baut den Pfad sicher zusammen.
        const templatePath = path.join(__dirname, '..', '..', 'Beratungsbesuch_37.3_NEU');
        const pdfTemplateBytes = await fs.readFile(templatePath);
        
        // PDF-Dokument mit pdf-lib laden
        const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

        // Das Formular im PDF holen
        const form = pdfDoc.getForm();
        
        // 5. --- !!! DEIN MAPPING: HIER MUSST DU ARBEITEN !!! ---
        //    Trage hier ein, welches Airtable-Feld in welches PDF-Feld soll.
        //
        //    - 'PDF_Feld_Name': Der exakte Name des Feldes in deinem PDF.
        //    - clientData['Airtable_Spalten_Name']: Die Daten aus Airtable.
        //
        //    Du musst die Feldnamen aus deinem PDF kennen!
        //    (z.B. mit Adobe Acrobat Pro auslesen)

        const mapping = {
            // --- Beispiel-Mapping ---
            'Name_des_Klienten': clientData['Name'],
            'Geburtsdatum_im_PDF': clientData['Geburtstag'],
            'Kassennummer': clientData['KV_Nummer'],
            'Adresse_Zeile_1': clientData['Straße'] + ' ' + clientData['Hausnummer'],
            'Adresse_Zeile_2': clientData['PLZ'] + ' ' + clientData['Ort'],
            'Pflegegrad': clientData['Pflegegrad'],
            
            // --- Füge hier all deine weiteren Felder hinzu ---
            // 'PDF_Feld_X': clientData['Airtable_Spalte_Y'],
            // 'PDF_Feld_Z': clientData['Airtable_Spalte_A'],
        };
        
        // Gehe durch das Mapping und fülle die Felder
        for (const [pdfField, airtableValue] of Object.entries(mapping)) {
            try {
                const field = form.getTextField(pdfField);
                // Nur füllen, wenn das Feld existiert und ein Wert vorhanden ist
                if (field && airtableValue) {
                    field.setText(airtableValue.toString());
                }
            } catch (e) {
                console.warn(`Konnte Feld "${pdfField}" nicht finden oder füllen.`, e.message);
            }
        }
        
        // Optional: Macht die Felder uneditierbar (flachdrücken)
        // form.flatten();

        // 6. Das neue PDF als Byte-Array speichern
        const pdfBytes = await pdfDoc.save();

        // 7. Das fertige PDF an den Browser zurücksenden
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/pdf',
            },
            // WICHTIG: Die Antwort muss Base64-kodiert sein
            // und 'isBase64Encoded: true' muss gesetzt sein.
            body: Buffer.from(pdfBytes).toString('base64'),
            isBase64Encoded: true,
        };

    } catch (error) {
        // 8. Fehlerbehandlung
        console.error('Fehler beim Erstellen des PDF:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'PDF-Generierung fehlgeschlagen', 
                details: error.message 
            }),
        };
    }
};

