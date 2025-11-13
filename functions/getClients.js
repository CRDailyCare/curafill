// Wir laden die offizielle Airtable-Bibliothek
const Airtable = require('airtable');

// Diese Funktion ist der "Handler", den Netlify ausführt, wenn 
// die URL '/.netlify/functions/getClients' aufgerufen wird.
exports.handler = async (event, context) => {

    try {
        // 1. Hole die geheimen Schlüssel aus den Netlify-Umgebungsvariablen
        //    (Genau die, die du im Screenshot gezeigt hast)
        const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, KUNDEN_TABLE_NAME } = process.env;

        // 2. Initialisiere die Airtable-Verbindung
        const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

        // 3. Definiere, welche Daten wir holen wollen
        //    Wir brauchen nur die 'Record ID' (die Airtable automatisch liefert)
        //    und die Spalte, die den Namen des Klienten enthält.
        //
        //    !!! WICHTIG: Ersetze 'Name' mit dem exakten Namen deiner 
        //    !!! Spalte in Airtable, in der der Klientenname steht.
        const clientNameField = 'Name, Vorname'; 

        const records = await base(KUNDEN_TABLE_NAME).select({
            // Wir holen nur die Felder, die wir wirklich brauchen (effizienter)
            fields: [clientNameField],
            // Sortiere die Liste alphabetisch nach dem Namen
            sort: [{ field: clientNameField, direction: 'asc' }],
            // Optional: Filtere leere Einträge raus
            filterByFormula: `NOT({${clientNameField}} = '')` 
        }).all();

        // 4. Formatiere die Daten für unser Frontend
        //    Unser 'app.js' erwartet ein einfaches Array: [{ id: '...', name: '...' }]
        const clients = records.map(record => ({
            id: record.id,  // Die 'rec...' ID von Airtable
            name: record.get(clientNameField)
        }));

        // 5. Sende die saubere Liste als erfolgreiche Antwort zurück
        return {
            statusCode: 200,
            body: JSON.stringify(clients),
            headers: {
                'Content-Type': 'application/json',
            },
        };

    } catch (error) {
        // 6. Falls irgendetwas schiefgeht (API-Key falsch, Tabelle nicht gefunden)
        console.error('Fehler beim Holen der Airtable-Daten:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Fehler beim Laden der Klientendaten' }),
        };
    }
};  
