// main.jsx
import { render } from 'preact';
import App from './App';
import CookieBannerWidget from './CookieBannerWidget';

// Renderizza l'app principale
render(<App />, document.getElementById('app'));

// Inizializza il widget del banner dei cookie
document.addEventListener('DOMContentLoaded', () => {
  CookieBannerWidget.init({
    containerId: 'cookie-banner-container',
    language: 'en', // o 'en' per l'inglese
    preferencesButtonText: 'Custom Preferences Button Text',
    bannerTitle: 'Informativa',
    bannerDescription: `Noi e terze parti selezionate utilizziamo cookie o tecnologie simili per finalità tecniche e, con il tuo consenso, anche per altre finalità come specificato nella cookie policy.
    Usa il pulsante “Accetta” per acconsentire. Usa il pulsante “Rifiuta” o chiudi questa informativa per continuare senza accettare.`,
    saveButtonText: 'Custom Save Preferences',
    acceptAllButtonText: 'Custom Accept All',
    closeButtonText: 'Custom Close',
    googleAnalytics: {
      enabled: true,
      id: 'G-3CM830HKN7',
      category: 'marketing' // o 'analytics', a seconda di come vuoi classificarlo
    },
    autoBlock: true, // Set to true or false as needed
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
