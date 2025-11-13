/**
 * 37.3-Prüfungsassistent - Haupt-JavaScript-Datei
 * Enthält alle Funktionalitäten für API-Integration, PDF-Handling und UI-Interaktionen
 */

class PruefungsAssistent {
    constructor() {
        this.customers = [];
        this.filteredCustomers = [];
        this.selectedCustomer = null;
        this.currentForm = null;
        this.isLoading = false;
        
        // Initialize the application
        this.init();
    }
    
    async init() {
        try {
            this.showLoading('Initialisiere Anwendung...');
            
            // Load configuration
            await this.loadConfig();
            
            // Setup Airtable connection
            await this.setupAirtable();
            
            // Load initial data
            await this.loadInitialData();
            
            this.hideLoading();
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showNotification('Fehler bei der Initialisierung: ' + error.message, 'error');
            this.hideLoading();
        }
    }
    
    async loadConfig() {
        // Configuration will be loaded from config.js
        if (typeof window.APP_CONFIG === 'undefined') {
            // Fallback configuration
            window.APP_CONFIG = {
                airtableBaseId: 'your-airtable-base-id',
                airtableApiKey: 'your-airtable-api-key',
                airtableTableName: 'Kunden'
            };
        }
    }
    
    async setupAirtable() {
        // Check if Airtable credentials are available
        if (!APP_CONFIG.airtableApiKey || !APP_CONFIG.airtableBaseId) {
            throw new Error('Airtable-Konfiguration nicht gefunden. Bitte API-Key und Base-ID in den Einstellungen eingeben.');
        }
        
        // Setup Airtable API endpoint
        this.airtableEndpoint = `https://api.airtable.com/v0/${APP_CONFIG.airtableBaseId}/${APP_CONFIG.airtableTableName}`;
        this.headers = {
            'Authorization': `Bearer ${APP_CONFIG.airtableApiKey}`,
            'Content-Type': 'application/json'
        };
    }
    
    async loadInitialData() {
        try {
            await this.loadCustomers();
            this.updateStatistics();
        } catch (error) {
            console.error('Error loading initial data:', error);
            // Show demo data if API fails
            this.loadDemoData();
        }
    }
    
    async loadCustomers() {
        try {
            this.showLoading('Lade Kundendaten...');
            
            const response = await fetch(this.airtableEndpoint, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Airtable API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Transform Airtable data to our format
            this.customers = data.records.map(record => ({
                id: record.id,
                name: record.fields.Name || 'Unbekannt',
                firstName: record.fields.Vorname || '',
                lastName: record.fields.Nachname || '',
                birthDate: record.fields.Geburtsdatum || '',
                address: record.fields.Adresse || '',
                zipCode: record.fields.PLZ || '',
                city: record.fields.Ort || '',
                insuranceNumber: record.fields.Versicherungsnummer || '',
                careLevel: record.fields.Pflegegrad || '',
                status: record.fields.Status || 'aktiv',
                region: record.fields.Region || '',
                phone: record.fields.Telefon || '',
                email: record.fields.Email || '',
                lastReview: record.fields['Letzte Prüfung'] || '',
                nextReview: record.fields['Nächste Prüfung'] || ''
            }));
            
            this.filteredCustomers = [...this.customers];
            this.renderCustomers();
            
        } catch (error) {
            console.error('Error loading customers:', error);
            this.loadDemoData();
        } finally {
            this.hideLoading();
        }
    }
    
    loadDemoData() {
        // Demo data for testing when API is not available
        this.customers = [
            {
                id: 'demo1',
                name: 'Anna Müller',
                firstName: 'Anna',
                lastName: 'Müller',
                birthDate: '15.03.1945',
                address: 'Hauptstraße 123',
                zipCode: '10115',
                city: 'Berlin',
                insuranceNumber: '123456789A',
                careLevel: 'Pflegegrad 2',
                status: 'aktiv',
                region: 'nord',
                phone: '030 12345678',
                email: 'anna.mueller@email.de',
                lastReview: '2024-01-15',
                nextReview: '2024-07-15'
            },
            {
                id: 'demo2',
                name: 'Hans Schmidt',
                firstName: 'Hans',
                lastName: 'Schmidt',
                birthDate: '22.08.1938',
                address: 'Bahnhofstraße 45',
                zipCode: '80331',
                city: 'München',
                insuranceNumber: '987654321B',
                careLevel: 'Pflegegrad 3',
                status: 'aktiv',
                region: 'sued',
                phone: '089 98765432',
                email: 'hans.schmidt@email.de',
                lastReview: '2024-02-20',
                nextReview: '2024-08-20'
            },
            {
                id: 'demo3',
                name: 'Gerda Wagner',
                firstName: 'Gerda',
                lastName: 'Wagner',
                birthDate: '10.11.1942',
                address: 'Marktplatz 7',
                zipCode: '20095',
                city: 'Hamburg',
                insuranceNumber: '456789123C',
                careLevel: 'Pflegegrad 1',
                status: 'aktiv',
                region: 'nord',
                phone: '040 45678912',
                email: 'gerda.wagner@email.de',
                lastReview: '2024-03-10',
                nextReview: '2024-09-10'
            }
        ];
        
        this.filteredCustomers = [...this.customers];
        this.renderCustomers();
        
        this.showNotification('Demo-Daten geladen. Für Live-Daten bitte Airtable-Konfiguration eingeben.', 'info');
    }
    
    renderCustomers() {
        const grid = document.getElementById('customer-grid');
        if (!grid) return;
        
        if (this.filteredCustomers.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Keine Kunden gefunden</h3>
                    <p class="text-gray-500">Versuchen Sie es mit anderen Suchkriterien</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.filteredCustomers.map(customer => `
            <div class="customer-card rounded-xl p-6 card-hover cursor-pointer" data-customer-id="${customer.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-1">${customer.name}</h3>
                        <p class="text-sm text-gray-600">${customer.insuranceNumber}</p>
                    </div>
                    <div class="flex flex-col items-end space-y-1">
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusColor(customer.status)}">
                            ${customer.status}
                        </span>
                        <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${customer.careLevel}
                        </span>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        ${customer.address}, ${customer.zipCode} ${customer.city}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        ${customer.phone}
                    </div>
                    ${customer.lastReview ? `
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Letzte Prüfung: ${this.formatDate(customer.lastReview)}
                        </div>
                    ` : ''}
                </div>
                
                <div class="flex gap-2">
                    <button class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors start-review-btn">
                        Neue Prüfung
                    </button>
                    <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors view-details-btn">
                        Details
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to customer cards
        this.addCustomerCardListeners();
    }
    
    addCustomerCardListeners() {
        const customerCards = document.querySelectorAll('[data-customer-id]');
        
        customerCards.forEach(card => {
            const customerId = card.dataset.customerId;
            const customer = this.customers.find(c => c.id === customerId);
            
            if (!customer) return;
            
            // Start review button
            const startBtn = card.querySelector('.start-review-btn');
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startNewReview(customer);
            });
            
            // View details button
            const detailsBtn = card.querySelector('.view-details-btn');
            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showCustomerDetails(customer);
            });
            
            // Card click
            card.addEventListener('click', () => {
                this.selectCustomer(customer);
            });
        });
    }
    
    startNewReview(customer) {
        this.selectedCustomer = customer;
        
        // Store selected customer in sessionStorage for the form page
        sessionStorage.setItem('selectedCustomer', JSON.stringify(customer));
        
        // Navigate to form page
        window.location.href = 'formular.html';
    }
    
    selectCustomer(customer) {
        // Highlight selected customer
        document.querySelectorAll('[data-customer-id]').forEach(card => {
            card.classList.remove('ring-2', 'ring-blue-500');
        });
        
        const selectedCard = document.querySelector(`[data-customer-id="${customer.id}"]`);
        if (selectedCard) {
            selectedCard.classList.add('ring-2', 'ring-blue-500');
        }
        
        this.selectedCustomer = customer;
        
        // Enable the start new review button in hero section
        const startBtn = document.getElementById('start-new-btn');
        if (startBtn) {
            startBtn.textContent = `Prüfung für ${customer.name} starten`;
            startBtn.onclick = () => this.startNewReview(customer);
        }
    }
    
    showCustomerDetails(customer) {
        // Create modal for customer details
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Kundendetails</h2>
                    <button class="text-gray-500 hover:text-gray-700 close-modal">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">Persönliche Daten</h3>
                        <div class="space-y-2">
                            <div><strong>Name:</strong> ${customer.name}</div>
                            <div><strong>Geburtsdatum:</strong> ${customer.birthDate}</div>
                            <div><strong>Versicherungsnummer:</strong> ${customer.insuranceNumber}</div>
                            <div><strong>Pflegegrad:</strong> ${customer.careLevel}</div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">Kontaktdaten</h3>
                        <div class="space-y-2">
                            <div><strong>Adresse:</strong><br>${customer.address}<br>${customer.zipCode} ${customer.city}</div>
                            <div><strong>Telefon:</strong> ${customer.phone}</div>
                            <div><strong>Email:</strong> ${customer.email}</div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Prüfungs-Historie</h3>
                    <div class="space-y-2">
                        <div><strong>Letzte Prüfung:</strong> ${customer.lastReview ? this.formatDate(customer.lastReview) : 'Noch keine'}</div>
                        <div><strong>Nächste Prüfung:</strong> ${customer.nextReview ? this.formatDate(customer.nextReview) : 'Keine geplant'}</div>
                        <div><strong>Status:</strong> <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusColor(customer.status)}">${customer.status}</span></div>
                    </div>
                </div>
                
                <div class="flex gap-3 mt-6">
                    <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors start-review-modal-btn">
                        Neue Prüfung starten
                    </button>
                    <button class="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors close-modal">
                        Schließen
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
        
        modal.querySelector('.start-review-modal-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.startNewReview(customer);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    filterCustomers() {
        const searchTerm = document.getElementById('customer-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('status-filter')?.value || '';
        const regionFilter = document.getElementById('region-filter')?.value || '';
        
        this.filteredCustomers = this.customers.filter(customer => {
            const matchesSearch = !searchTerm || 
                customer.name.toLowerCase().includes(searchTerm) ||
                customer.insuranceNumber.toLowerCase().includes(searchTerm) ||
                customer.city.toLowerCase().includes(searchTerm) ||
                customer.address.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || customer.status === statusFilter;
            const matchesRegion = !regionFilter || customer.region === regionFilter;
            
            return matchesSearch && matchesStatus && matchesRegion;
        });
        
        this.renderCustomers();
    }
    
    updateStatistics() {
        const completed = this.customers.filter(c => c.lastReview && this.isDateWithinMonths(c.lastReview, 6)).length;
        const pending = this.customers.filter(c => !c.lastReview || !this.isDateWithinMonths(c.lastReview, 6)).length;
        const total = this.customers.length;
        
        const completedEl = document.getElementById('completed-count');
        const pendingEl = document.getElementById('pending-count');
        const totalEl = document.getElementById('total-customers');
        
        if (completedEl) completedEl.textContent = completed;
        if (pendingEl) pendingEl.textContent = pending;
        if (totalEl) totalEl.textContent = total;
    }
    
    isDateWithinMonths(dateString, months) {
        if (!dateString) return false;
        
        const date = new Date(dateString);
        const now = new Date();
        const monthsDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
        
        return monthsDiff <= months;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE');
    }
    
    getStatusColor(status) {
        switch (status) {
            case 'aktiv': return 'bg-green-100 text-green-800';
            case 'inaktiv': return 'bg-red-100 text-red-800';
            case 'neu': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    showLoading(message = 'Laden...') {
        this.isLoading = true;
        const overlay = document.getElementById('loading-overlay');
        const messageEl = overlay?.querySelector('p');
        
        if (overlay) {
            overlay.classList.remove('hidden');
            if (messageEl) messageEl.textContent = message;
        }
    }
    
    hideLoading() {
        this.isLoading = false;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
        
        // Set colors based on type
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-500', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-500', 'text-white');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-500', 'text-white');
                break;
            default:
                notification.classList.add('bg-blue-500', 'text-white');
        }
        
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="flex-1 mr-4">${message}</span>
                <button class="text-white hover:text-gray-200 close-notification">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Add close event
        notification.querySelector('.close-notification').addEventListener('click', () => {
            closeNotification();
        });
        
        // Auto close after 5 seconds
        const autoClose = setTimeout(() => {
            closeNotification();
        }, 5000);
        
        function closeNotification() {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
            clearTimeout(autoClose);
        }
    }
}

// PDF-Handling Functions
class PDFManager {
    constructor() {
        this.pdfTemplate = null;
    }
    
    async loadTemplate(templateUrl) {
        try {
            const response = await fetch(templateUrl);
            const arrayBuffer = await response.arrayBuffer();
            this.pdfTemplate = await PDFLib.PDFDocument.load(arrayBuffer);
            return this.pdfTemplate;
        } catch (error) {
            console.error('Error loading PDF template:', error);
            throw new Error('Fehler beim Laden der PDF-Vorlage');
        }
    }
    
    async fillForm(customerData, formData) {
        if (!this.pdfTemplate) {
            throw new Error('Keine PDF-Vorlage geladen');
        }
        
        const pdfDoc = await this.pdfTemplate.copy();
        const form = pdfDoc.getForm();
        
        // Fill form fields with customer data
        const fields = form.getFields();
        
        // Map customer data to form fields
        const fieldMappings = {
            'name': customerData.name,
            'vorname': customerData.firstName,
            'nachname': customerData.lastName,
            'geburtsdatum': customerData.birthDate,
            'adresse': customerData.address,
            'plz': customerData.zipCode,
            'ort': customerData.city,
            'versicherungsnummer': customerData.insuranceNumber,
            'pflegegrad': customerData.careLevel,
            'telefon': customerData.phone,
            'email': customerData.email
        };
        
        // Fill the form fields
        fields.forEach(field => {
            const fieldName = field.getName().toLowerCase();
            
            Object.keys(fieldMappings).forEach(key => {
                if (fieldName.includes(key) && fieldMappings[key]) {
                    try {
                        field.setText(fieldMappings[key]);
                    } catch (error) {
                        console.warn(`Could not set field ${fieldName}:`, error);
                    }
                }
            });
        });
        
        // Add additional form data
        Object.keys(formData).forEach(key => {
            try {
                const field = form.getTextField(key);
                if (field && formData[key]) {
                    field.setText(formData[key]);
                }
            } catch (error) {
                console.warn(`Could not set form field ${key}:`, error);
            }
        });
        
        return pdfDoc;
    }
    
    async generatePDF(customerData, formData) {
        try {
            const pdfDoc = await this.fillForm(customerData, formData);
            const pdfBytes = await pdfDoc.save();
            
            // Create download link
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `37.3-Prüfung-${customerData.lastName}-${new Date().toISOString().split('T')[0]}.pdf`;
            link.click();
            
            // Cleanup
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error('Fehler beim Generieren des PDFs');
        }
    }
}

// Initialize the application
let app;
let pdfManager;

document.addEventListener('DOMContentLoaded', function() {
    app = new PruefungsAssistent();
    pdfManager = new PDFManager();
    
    // Make functions globally available for other pages
    window.app = app;
    window.pdfManager = pdfManager;
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PruefungsAssistent, PDFManager };
}