// Wir warten, bis die gesamte HTML-Seite geladen ist, bevor wir unser Skript ausführen.
document.addEventListener('DOMContentLoaded', () => {

    // 1. Unsere HTML-Elemente holen, damit wir mit ihnen arbeiten können
    const clientDropdown = document.getElementById('client-dropdown');
    const generatePdfBtn = document.getElementById('generate-pdf-btn');
    const statusMessage = document.getElementById('status-message');

    // Pfade zu unseren Netlify-Funktionen (so wie Netlify sie bereitstellt)
    const GET_CLIENTS_URL = '/.netlify/functions/getClients';
    const GENERATE_PDF_URL = '/.netlify/functions/generatePdf';

    /**
     * Setzt eine Nachricht im Status-Element und legt optional fest,
     * ob es sich um eine Fehlermeldung handelt (wird dann rot).
     */
    function setStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? '#d9534f' : '#555'; // Rot für Fehler, sonst grau
    }

    /**
     * Diese Funktion wird beim Laden der Seite aufgerufen.
     * Sie holt die Klientenliste von unserer Netlify-Funktion
     * und füllt das Dropdown-Menü.
     */
    async function populateClientDropdown() {
        setStatus('Lade Klientenliste...');
        
        try {
            // Rufe unsere Funktion auf, die Airtable-Daten holt
            const response = await fetch(GET_CLIENTS_URL);
            
            if (!response.ok) {
                // Falls der Server einen Fehler meldet (z.B. 500)
                throw new Error('Server-Antwort war nicht erfolgreich.');
            }

            const clients = await response.json();

            // Entferne die "Lade..."-Option
            clientDropdown.innerHTML = ''; 

            // Füge eine Standard-Auswahl-Option hinzu
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Bitte Klient auswählen...';
            clientDropdown.appendChild(defaultOption);

            // Füge jeden Klienten aus der Airtable-Liste hinzu
            clients.forEach(client => {
                const option = document.createElement('option');
                // 'client.id' ist die Airtable Record ID (z.B. 'rec12345')
                // 'client.name' ist der Name, den der Nutzer sieht
                option.value = client.id; 
                option.textContent = client.name;
                clientDropdown.appendChild(option);
            });

            setStatus(''); // Lösche die Statusmeldung nach Erfolg

        } catch (error) {
            console.error('Fehler beim Laden der Klienten:', error);
            setStatus('Fehler beim Laden der Klientenliste.', true);
            clientDropdown.innerHTML = '<option value="">Fehler</option>';
        }
    }

    /**
     * Diese Funktion wird aufgerufen, wenn der "Generieren"-Button geklickt wird.
     * Sie holt das PDF von unserer zweiten Netlify-Funktion.
     */
    async function handleGeneratePdf() {
        const selectedClientId = clientDropdown.value;
        if (!selectedClientId) {
            setStatus('Bitte zuerst einen Klienten auswählen.', true);
            return;
        }

        // Visuelles Feedback für den Nutzer
        setStatus('PDF wird erstellt... Bitte warten.');
        generatePdfBtn.disabled = true; // Button deaktivieren, um Doppelklicks zu verhindern

        try {
            // Rufe die PDF-Funktion auf und übergebe die ID des Klienten als Query-Parameter
            const response = await fetch(`${GENERATE_PDF_URL}?clientId=${selectedClientId}`);

            if (!response.ok) {
                // Falls die PDF-Generierung fehlschlägt
                const errorText = await response.text(); // Versuche, mehr Details zum Fehler zu bekommen
                console.error('Fehlerdetails:', errorText);
                throw new Error('PDF-Generierung fehlgeschlagen.');
            }

            // Die Antwort ist eine Datei (ein "blob")
            const pdfBlob = await response.blob();

            // Erzeuge einen Dateinamen (optional, aber schöner)
            const clientName = clientDropdown.options[clientDropdown.selectedIndex].text;
            const fileName = `37.3_Pruefung_${clientName.replace(/ /g, '_')}.pdf`;

            // Trick, um einen Download im Browser auszulösen:
            // 1. Erstelle eine unsichtbare URL für die Datei
            const downloadUrl = URL.createObjectURL(pdfBlob);
            // 2. Erstelle einen unsichtbaren Link
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName; // Sag dem Browser, wie die Datei heißen soll
            // 3. Klicke den Link per Code
            document.body.appendChild(link);
            link.click();
            // 4. Räume hinter uns auf
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl); // Gib den Speicher frei

            setStatus('Download gestartet.');

        } catch (error) {
            console.error('Fehler beim Erstellen des PDF:', error);
            setStatus('Fehler beim Erstellen des PDF.', true);
        } finally {
            // Egal ob Erfolg oder Fehler, reaktiviere den Button wieder
            // (außer es ist kein Klient mehr ausgewählt)
            generatePdfBtn.disabled = !clientDropdown.value;
            
            // Lösche die Statusmeldung nach 3 Sekunden
            setTimeout(() => {
                if (statusMessage.textContent === 'Download gestartet.') {
                   setStatus(''); 
                }
            }, 3000);
        }
    }

    // --- Event Listener (Die "Kleber") ---

    // 1. Wenn der Nutzer einen Klienten im Dropdown auswählt
    clientDropdown.addEventListener('change', () => {
        // Aktiviere den Button nur, wenn ein echter Klient (kein "Bitte auswählen") gewählt ist
        if (clientDropdown.value) {
            generatePdfBtn.disabled = false;
            setStatus(''); // Lösche evtl. Fehlermeldungen
        } else {
            generatePdfBtn.disabled = true;
        }
    });

    // 2. Wenn der Nutzer auf den Button klickt
    generatePdfBtn.addEventListener('click', handleGeneratePdf);

    // 3. Die Seite ist geladen? Dann hole jetzt die Klienten.
    populateClientDropdown();

});