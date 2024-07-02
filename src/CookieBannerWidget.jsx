import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import CookieBanner from './components/CookieBanner';
import './styles/CookieBanner.css';
import { initializeCookieManager, getCookiePreferences } from './utils/cookieManager';
import translations from './locales/translation';

const PreferencesButton = ({ onClick, text }) => (
  <div 
    className="preferences-button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
  >
    {text || 'Gestisci preferenze cookie'}
  </div>
);

const CookieBannerWidget = {
  initialized: false,
  init(config = {}) {
    if (this.initialized) {
      console.warn('CookieBannerWidget è già stato inizializzato.');
      return;
    }


    const defaultConfig = {
      containerId: 'cookie-banner-container',
      preferencesButtonId: 'cookie-preferences-button', // Nuovo ID per il pulsante personalizzato
      language: 'en', // Default language
      preferencesButtonText: 'Gestisci preferenze cookie',
      bannerTitle: 'Impostazioni Cookie',
      bannerDescription: 'Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito.',
      saveButtonText: 'Salva preferenze',
      acceptAllButtonText: 'Accetta tutti',
      closeButtonText: 'Chiudi',
      scrollTopButton: "Back to Top",

      autoBlock: true, // Default to true
      logoUrl: "https://www.indire.it/wp-content/uploads/2015/07/logo-indire.png", // Nuovo campo per l'URL del logo
      logoDarkUrl: "https://www.indire.it/wp-content/uploads/2015/07/logo-indire.png", // Nuovo campo per l'URL del logo
      cookieTypes: {
        necessary: {
          title: 'Necessari',
          description: 'Cookie essenziali per il funzionamento del sito.'
        },
        functional: {
          title: 'Funzionalità',
          description: 'Cookie per migliorare la funzionalità del sito.'
        },
        analytics: {
          title: 'Analitici',
          description: 'Cookie per analizzare l\'utilizzo del sito.'
        },
        marketing: {
          title: 'Marketing',
          description: 'Cookie per mostrare annunci personalizzati.'
        }
      }
    };

    const finalConfig = { ...defaultConfig, ...config };
    const container = document.getElementById(finalConfig.containerId);
    
    if (container) {
      const lang = finalConfig.language in translations ? finalConfig.language : 'en';
      const translatedConfig = {
        ...finalConfig,
        ...translations[lang],
        cookieTypes: Object.fromEntries(
          Object.entries(translations[lang])
            .filter(([key]) => ['necessary', 'functional', 'analytics', 'marketing'].includes(key))
        )
      };

      const initializedConfig = initializeCookieManager({
        ...translatedConfig,
        googleAnalytics: finalConfig.googleAnalytics // Assicurati che questa riga sia presente
      });
      
      const WidgetWrapper = () => {
        const [showBanner, setShowBanner] = useState(false);
        const [showPreferencesButton, setShowPreferencesButton] = useState(false);

        useEffect(() => {
          const preferences = getCookiePreferences();
          if (preferences) {
            setShowBanner(false);
            setShowPreferencesButton(true);
          } else {
            setShowBanner(true);
          }
        }, []);

        const handleTogglePreferences = () => {
          setShowBanner(true);
          setShowPreferencesButton(false);
        };

        const handleCloseBanner = () => {
          setShowBanner(false);
          setShowPreferencesButton(true);
        };

        useEffect(() => {
          // Cerca un elemento personalizzato per il pulsante delle preferenze
          const customPreferencesButton = document.getElementById(finalConfig.preferencesButtonId);
          if (customPreferencesButton) {
            customPreferencesButton.addEventListener('click', handleTogglePreferences);
            setShowPreferencesButton(false); // Non mostrare il pulsante predefinito
          }

          return () => {
            if (customPreferencesButton) {
              customPreferencesButton.removeEventListener('click', handleTogglePreferences);
            }
          };
        }, []);

        return (
          <div>
            {showBanner && <CookieBanner config={initializedConfig} onClose={handleCloseBanner} />}
            {showPreferencesButton && !document.getElementById(finalConfig.preferencesButtonId) && 
              <PreferencesButton onClick={handleTogglePreferences} text={finalConfig.preferencesButtonText} />
            }
          </div>
        );
      };

      render(<WidgetWrapper />, container);
      this.initialized = true;
    } else {
      console.error(`Container con id '${finalConfig.containerId}' non trovato`);
    }
  }
};

export default CookieBannerWidget;

if (typeof window !== 'undefined') {
  window.CookieBannerWidget = CookieBannerWidget;
}