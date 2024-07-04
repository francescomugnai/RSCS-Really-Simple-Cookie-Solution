// main.jsx
import { render } from 'preact';
import App from './App';
import CookieBannerWidget from './CookieBannerWidget';

// Render the main app
render(<App />, document.getElementById('app'));

// Initialize the cookie banner widget
document.addEventListener('DOMContentLoaded', () => {
  CookieBannerWidget.init({
    containerId: 'cookie-banner-container',
    language: 'it', 
    preferencesButtonText: 'Custom Preferences Button Text',
    bannerTitle: 'Informativa',
    bannerDescription: `Noi e terze parti selezionate utilizziamo cookie o tecnologie simili per finalità tecniche e, con il tuo consenso, anche per altre finalità come specificato nella cookie policy.
    Usa il pulsante “Accetta” per acconsentire. Usa il pulsante “Rifiuta” o chiudi questa informativa per continuare senza accettare.`,
    saveButtonText: 'Custom Save Preferences',
    acceptAllButtonText: 'Custom Accept All',
    closeButtonText: 'Custom Close',
    googleAnalytics: {
      enabled: false,
      id: 'G-3CM830HKN7',
      category: 'marketing' 
    },
    autoBlock: true,
    cookieTypes: {
      necessary: {
        title: 'Necessari',
        description: 'Custom Description for Necessary Cookies'
      },
      functional: {
        title: 'Funzionalità',
        description: 'Custom Description for Functional Cookies'
      },
      analytics: {
        title: 'Analitici',
        description: 'Custom Description for Analytical Cookies'
      },
      marketing: {
        title: 'Marketing',
        description: 'Custom Description for Marketing Cookies'
      }
    }
  });
});
