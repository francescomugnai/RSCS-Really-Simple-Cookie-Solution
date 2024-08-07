import { render } from 'preact';
import App from './App';
import CookieBannerWidget from './CookieBannerWidget';

// Render the main app
render(<App />, document.getElementById('app'));

// Initialize the cookie banner widget
document.addEventListener('DOMContentLoaded', () => {
  CookieBannerWidget.init({
    language: 'it', 
    position: 'bottom-right',
    // bannerTitle: 'Informativa',
    // bannerDescription: `Noi e terze parti selezionate utilizziamo cookie o tecnologie simili per finalità tecniche e, con il tuo consenso, anche per altre finalità come specificato nella cookie policy.
    // Usa il pulsante “Accetta” per acconsentire. Usa il pulsante “Rifiuta” o chiudi questa informativa per continuare senza accettare.`,
    // saveButtonText: 'Custom Save Preferences',
    // acceptAllButtonText: 'Custom Accept All',
    // closeButtonText: 'Custom Close',
    preferencesButtonColor: '#FF5733', // Imposta un colore personalizzato
    colorMode: 'dark',
    placeholders: false,
    // privacyPolicyUrl: 'https://www.example.com/privacy-policy',
    autoBlock: true,
    // analytics: {
    //   enabled: true,
    //   provider: 'fathom',
    //   config: { 
    //     siteId: 'ABCDEFGH' 
    //   },
    //   category: 'analytics'
    // },
    onAccept: (preferences) => {
      console.log('Cookies accepted:', preferences);
    },
    onReject: (preferences) => {
      console.log('Cookies rejected:', preferences);
    },
    onPreferenceChange: (preferences) => {
      console.log('Cookie preferences changed:', preferences);
    }
  });
});
