import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import CookieBanner from './components/CookieBanner';
import './styles/CookieBanner.css';
import {
  initializeCookieManager,
  getCookiePreferences,
  setBlockedDomains,
  useDefaultBlockedDomains,
  getBlockedDomains,
  unblockResources,
  blockResources,
  autoBlockResources,
  setCookiePreferences,
} from './utils/cookieManager';
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
  callbacks: {},

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
      useAnimations: true,
      bannerTitle: 'Impostazioni Cookie',
      bannerDescription: 'Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito.',
      colorMode: 'auto', // 'auto', 'light', o 'dark'
      saveButtonText: 'Salva preferenze',
      acceptAllButtonText: 'Accetta tutti',
      closeButtonText: 'Chiudi',
      scrollTopButton: "Back to Top",
      useDefaultBlockedDomains: true,
      blockedDomains: null,
      autoBlock: true,
      logoUrl: null,
      logoDarkUrl: null,
      placeholders: true,
      placeholdersText: 'Questo contenuto è bloccato. Accetta i cookie per visualizzarlo.',
      privacyPolicyUrl: null,
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

    this.callbacks = {
      onAccept: finalConfig.onAccept || (() => {}),
      onReject: finalConfig.onReject || (() => {}),
      onPreferenceChange: finalConfig.onPreferenceChange || (() => {})
    };

    const container = document.getElementById(finalConfig.containerId);
    
    if (!container) {
      console.error(`Container con id '${finalConfig.containerId}' non trovato`);
      return;
    }
    
    const lang = finalConfig.language in translations ? finalConfig.language : 'en';
    console.log(finalConfig )

    const translatedConfig = {
      ...finalConfig,
      ...translations[lang],
      cookieTypes: {
        ...translations[lang].cookieTypes,
        ...finalConfig.cookieTypes
      },
      placeholdersText: translations[lang].placeholdersText || finalConfig.placeholdersText,
      privacyPolicyLink: translations[lang].privacyPolicyLink,
    };

    const initializedConfig = initializeCookieManager(translatedConfig);
    
    const WidgetWrapper = () => {
      const [showBanner, setShowBanner] = useState(false);
      const [showPreferencesButton, setShowPreferencesButton] = useState(false);
      const [expandedBanner, setExpandedBanner] = useState(false);

      useEffect(() => {
        const preferences = getCookiePreferences();
        setShowBanner(!preferences);
        setShowPreferencesButton(!!preferences);
      }, []);

      useEffect(() => {
        const container = document.getElementById(finalConfig.containerId);
        if (container) {
          container.classList.remove('force-light', 'force-dark');
          if (finalConfig.colorMode === 'light') {
            container.classList.add('force-light');
          } else if (finalConfig.colorMode === 'dark') {
            container.classList.add('force-dark');
          }
        }
      }, []);

      const handleTogglePreferences = () => {
        setShowBanner(true);
        setShowPreferencesButton(false);
        setExpandedBanner(true);
      };

      const handleCloseBanner = () => {
        setShowBanner(false);
        setShowPreferencesButton(true);
        setExpandedBanner(false);
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
          {showBanner && (
            <CookieBanner 
              config={initializedConfig} 
              onClose={handleCloseBanner} 
              initiallyExpanded={expandedBanner}
              onAccept={config.onAccept}
              onReject={config.onReject}
              onPreferenceChange={config.onPreferenceChange}
            />
          )}
          {showPreferencesButton && !document.getElementById(finalConfig.preferencesButtonId) && 
            <PreferencesButton onClick={handleTogglePreferences} text={finalConfig.preferencesButtonText} />
          }
        </>
      );
    };

    render(<WidgetWrapper />, container);
    this.initialized = true;


  },
  setBlockedDomains,
  useDefaultBlockedDomains,
  getBlockedDomains,
  unblockResources,
  blockResources,
  autoBlockResources,
  setCookiePreferences,
  triggerCallback(type, data) {
    if (this.callbacks[type]) {
      this.callbacks[type](data);
    }
  }
};



if (typeof window !== 'undefined') {
  window.CookieBannerWidget = CookieBannerWidget;
}

export default CookieBannerWidget;
