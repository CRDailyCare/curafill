/**
 * Configuration file for 37.3-Prüfungsassistent
 * This file handles environment variables and application settings
 */

// Configuration object
const APP_CONFIG = {
    // Airtable Configuration
    airtableApiKey: '',
    airtableBaseId: '',
    airtableTableName: 'Kunden',
    
    // Application Settings
    appName: '37.3-Prüfungsassistent',
    appVersion: '1.0.0',
    
    // Feature Flags
    features: {
        demoMode: false,
        debugMode: false,
        enableAnalytics: false
    },
    
    // PDF Templates
    pdfTemplates: {
        '37.3-standard': {
            name: '37.3 Standard Formular',
            url: '/templates/37.3-standard.pdf'
        }
    },
    
    // Validation Rules
    validation: {
        requiredFields: ['name', 'geburtsdatum', 'adresse'],
        dateFormat: 'DD.MM.YYYY',
        maxFileSize: 10 * 1024 * 1024 // 10MB
    },
    
    // UI Settings
    ui: {
        itemsPerPage: 12,
        searchDebounceMs: 300,
        autoSaveIntervalMs: 30000,
        notificationDurationMs: 5000
    }
};

// Environment-specific configurations
const ENV_CONFIGS = {
    development: {
        features: {
            demoMode: true,
            debugMode: true,
            enableAnalytics: false
        },
        airtableTableName: 'Kunden-Dev'
    },
    
    staging: {
        features: {
            demoMode: false,
            debugMode: true,
            enableAnalytics: true
        }
    },
    
    production: {
        features: {
            demoMode: false,
            debugMode: false,
            enableAnalytics: true
        }
    }
};

// Load configuration from environment variables
function loadConfig() {
    // Detect environment
    const hostname = window.location.hostname;
    let environment = 'production';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        environment = 'development';
    } else if (hostname.includes('staging') || hostname.includes('preview')) {
        environment = 'staging';
    }
    
    // Load environment-specific config
    const envConfig = ENV_CONFIGS[environment] || {};
    
    // Merge configurations
    const finalConfig = {
        ...APP_CONFIG,
        ...envConfig,
        environment,
        
        // Override with environment variables from Netlify
        airtableApiKey: window.env?.AIRTABLE_API_KEY || '',
        airtableBaseId: window.env?.AIRTABLE_BASE_ID || '',
        airtableTableName: window.env?.AIRTABLE_TABLE_NAME || APP_CONFIG.airtableTableName,
        
        // Feature flags from environment
        features: {
            ...APP_CONFIG.features,
            ...envConfig.features,
            ...(window.env?.DEMO_MODE === 'true' ? { demoMode: true } : {}),
            ...(window.env?.DEBUG_MODE === 'true' ? { debugMode: true } : {})
        }
    };
    
    return finalConfig;
}

// Configuration validation
function validateConfig(config) {
    const errors = [];
    
    // Check required Airtable configuration
    if (!config.airtableApiKey) {
        errors.push('AIRTABLE_API_KEY ist nicht konfiguriert');
    }
    
    if (!config.airtableBaseId) {
        errors.push('AIRTABLE_BASE_ID ist nicht konfiguriert');
    }
    
    // Check if we're in demo mode
    if (config.features.demoMode) {
        console.warn('Anwendung läuft im Demo-Modus. Einige Funktionen sind eingeschränkt.');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Configuration helper functions
const ConfigHelpers = {
    // Get a configuration value
    get(key) {
        return window.APP_CONFIG?.[key];
    },
    
    // Get feature flag
    getFeature(flag) {
        return window.APP_CONFIG?.features?.[flag] || false;
    },
    
    // Check if demo mode is enabled
    isDemoMode() {
        return this.getFeature('demoMode');
    },
    
    // Check if debug mode is enabled
    isDebugMode() {
        return this.getFeature('debugMode');
    },
    
    // Get Airtable configuration
    getAirtableConfig() {
        return {
            apiKey: this.get('airtableApiKey'),
            baseId: this.get('airtableBaseId'),
            tableName: this.get('airtableTableName')
        };
    },
    
    // Validate Airtable configuration
    isAirtableConfigured() {
        const config = this.getAirtableConfig();
        return config.apiKey && config.baseId;
    }
};

// Initialize configuration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load configuration
    window.APP_CONFIG = loadConfig();
    
    // Validate configuration
    const validation = validateConfig(window.APP_CONFIG);
    
    if (!validation.isValid) {
        console.warn('Konfigurationsfehler:', validation.errors);
        
        // Show configuration errors in UI
        if (window.app && window.app.showNotification) {
            window.app.showNotification(
                'Konfigurationsfehler: ' + validation.errors.join(', '),
                'warning'
            );
        }
    }
    
    // Log configuration in debug mode
    if (ConfigHelpers.isDebugMode()) {
        console.log('App Configuration:', window.APP_CONFIG);
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG, ConfigHelpers };
}

// Make ConfigHelpers globally available
window.ConfigHelpers = ConfigHelpers;