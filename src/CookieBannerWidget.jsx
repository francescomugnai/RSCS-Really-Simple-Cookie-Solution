import { render } from 'preact';
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
    {text}
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
      preferencesButtonId: 'cookie-preferences-button',
      language: 'en',
      preferencesButtonText: 'Gestisci preferenze cookie',
      bannerTitle: 'Impostazioni Cookie',
      bannerDescription: 'Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito.',
      saveButtonText: 'Salva preferenze',
      acceptAllButtonText: 'Accetta tutti',
      closeButtonText: 'Chiudi',
      scrollTopButton: "Back to Top",
      useDefaultBlockedDomains: true,
      blockedDomains: null,
      autoBlock: true,
      logoUrl: "https://www.indire.it/wp-content/uploads/2015/07/logo-indire.png",
      logoDarkUrl: "https://www.indire.it/wp-content/uploads/2015/07/logo-indire.png",
      googleAnalytics: {
        enabled: false,
        id: '',
        category: 'marketing'
      },
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
    
    if (!container) {
      console.error(`Container con id '${finalConfig.containerId}' non trovato`);
      return;
    }

    const lang = finalConfig.language in translations ? finalConfig.language : 'en';
    const translatedConfig = {
      ...finalConfig,
      ...translations[lang],
      cookieTypes: {
        ...translations[lang].cookieTypes,
        ...finalConfig.cookieTypes
      }
    };

    const initializedConfig = initializeCookieManager(translatedConfig);
    
    const WidgetWrapper = () => {
      const [showBanner, setShowBanner] = useState(false);
      const [showPreferencesButton, setShowPreferencesButton] = useState(false);

      useEffect(() => {
        const preferences = getCookiePreferences();
        setShowBanner(!preferences);
        setShowPreferencesButton(!!preferences);
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
        const customPreferencesButton = document.getElementById(finalConfig.preferencesButtonId);
        if (customPreferencesButton) {
          customPreferencesButton.addEventListener('click', handleTogglePreferences);
          setShowPreferencesButton(false);
        }

        return () => {
          if (customPreferencesButton) {
            customPreferencesButton.removeEventListener('click', handleTogglePreferences);
          }
        };
      }, []);

      return (
        <>
          {showBanner && <CookieBanner config={initializedConfig} onClose={handleCloseBanner} />}
          {showPreferencesButton && !document.getElementById(finalConfig.preferencesButtonId) && 
            <PreferencesButton onClick={handleTogglePreferences} text={finalConfig.preferencesButtonText} />
          }
        </>
      );
    };

    render(<WidgetWrapper />, container);
    this.initialized = true;
  }
};

export default CookieBannerWidget;

if (typeof window !== 'undefined') {
  window.CookieBannerWidget = CookieBannerWidget;
}