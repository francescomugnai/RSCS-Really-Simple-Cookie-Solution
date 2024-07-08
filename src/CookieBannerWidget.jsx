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
import PreferencesButton from './components/PreferencesButton';

const CookieBannerWidget = {
  initialized: false,
  callbacks: {},
  showPreferencesButton: false,

  init(config = {}) {
    if (this.initialized) {
      console.warn('CookieBannerWidget è già stato inizializzato.');
      return;
    }

    const defaultConfig = {
      containerId: 'cookie-banner-container-' + Math.random().toString(36).substr(2, 9),
      preferencesButtonId: 'cookie-preferences-button',
      language: 'en',
      useAnimations: true,
      bannerTitle: 'Cookie Settings',
      bannerDescription: 'We use cookies to enhance your browsing experience, personalize content and ads, analyze our traffic, and provide social media features. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences by clicking "Manage Cookies".',
      colorMode: 'auto', 
      saveButtonText: 'Save Preferences',
      acceptAllButtonText: 'Accept All',
      closeButtonText: 'Close',
      scrollTopButton: "Back to Top",
      initiallyExpanded: false,
      useDefaultBlockedDomains: true,
      blockedDomains: null,
      autoBlock: true,
      logoUrl: null,
      logoDarkUrl: null,
      position: 'bottom-right', 
      placeholders: false,
      placeholdersText: 'This content is blocked. Accept cookies to view it.',
      preferencesButtonColor: '#4299e1', 
      privacyPolicyUrl: null,
      showPreferencesButton: true,
      googleAnalytics: {
        enabled: false,
        id: '',
        category: 'marketing'
      },
      cookieTypes: {
        necessary: {
          title: 'Necessary',
          description: 'Essential cookies for the site to function.'
        },
        functional: {
          title: 'Functionality',
          description: 'Cookies to improve site functionality.'
        },
        analytics: {
          title: 'Analytics',
          description: 'Cookies to analyze site usage.'
        },
        marketing: {
          title: 'Marketing',
          description: 'Cookies to show personalized ads.'
        }
      }
    };

    const finalConfig = { ...defaultConfig, ...config };

    this.callbacks = {
      onAccept: finalConfig.onAccept || (() => {}),
      onReject: finalConfig.onReject || (() => {}),
      onPreferenceChange: finalConfig.onPreferenceChange || (() => {})
    };

    let container = document.getElementById(finalConfig.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = finalConfig.containerId;
      document.body.appendChild(container);
    }

    if (!container) {
      console.error(`Container con id '${finalConfig.containerId}' non trovato`);
      return;
    }

    const lang = finalConfig.language in translations ? finalConfig.language : 'en';

    let translatedConfig = { ...finalConfig };
    if (finalConfig.language && finalConfig.language in translations) {
      const baseTranslations = translations[finalConfig.language];
      translatedConfig = {
        ...finalConfig,
        bannerTitle: finalConfig.bannerTitle || baseTranslations.bannerTitle,
        bannerDescription: finalConfig.bannerDescription || baseTranslations.bannerDescription,
        acceptAllButtonText: finalConfig.acceptAllButtonText || baseTranslations.acceptAllButtonText,
        rejectAllButtonText: finalConfig.rejectAllButtonText || baseTranslations.rejectAllButtonText,
        saveButtonText: finalConfig.saveButtonText || baseTranslations.saveButtonText,
        closeButtonText: finalConfig.closeButtonText || baseTranslations.closeButtonText,
        detailsLinkText: finalConfig.detailsLinkText || baseTranslations.detailsLinkText,
        hideDetailsLinkText: finalConfig.hideDetailsLinkText || baseTranslations.hideDetailsLinkText,
        cookieTypes: { ...finalConfig.cookieTypes },
      };

      if (baseTranslations.cookieTypes) {
        Object.keys(baseTranslations.cookieTypes).forEach(type => {
          if (translatedConfig.cookieTypes[type]) {
            translatedConfig.cookieTypes[type] = {
              title: finalConfig.cookieTypes[type].title || baseTranslations.cookieTypes[type].title,
              description: finalConfig.cookieTypes[type].description || baseTranslations.cookieTypes[type].description
            };
          } else {
            translatedConfig.cookieTypes[type] = baseTranslations.cookieTypes[type];
          }
        });
      }
    } else {
      const defaultEnglishTranslations = translations['en'];
      translatedConfig = {
        ...finalConfig,
        bannerTitle: defaultEnglishTranslations.bannerTitle || finalConfig.bannerTitle,
        bannerDescription: defaultEnglishTranslations.bannerDescription || finalConfig.bannerDescription,
        acceptAllButtonText: defaultEnglishTranslations.acceptAllButtonText || finalConfig.acceptAllButtonText,
        rejectAllButtonText: defaultEnglishTranslations.rejectAllButtonText || finalConfig.rejectAllButtonText,
        saveButtonText: defaultEnglishTranslations.saveButtonText || finalConfig.saveButtonText,
        closeButtonText: defaultEnglishTranslations.closeButtonText || finalConfig.closeButtonText,
        detailsLinkText: defaultEnglishTranslations.detailsLinkText || finalConfig.detailsLinkText,
        hideDetailsLinkText: defaultEnglishTranslations.hideDetailsLinkText || finalConfig.hideDetailsLinkText,
        cookieTypes: { ...finalConfig.cookieTypes },
      };

      if (defaultEnglishTranslations.cookieTypes) {
        Object.keys(defaultEnglishTranslations.cookieTypes).forEach(type => {
          if (translatedConfig.cookieTypes[type]) {
            translatedConfig.cookieTypes[type] = {
              ...defaultEnglishTranslations.cookieTypes[type],
              ...translatedConfig.cookieTypes[type]
            };
          } else {
            translatedConfig.cookieTypes[type] = defaultEnglishTranslations.cookieTypes[type];
          }
        });
      }
    }

    const initializedConfig = initializeCookieManager({
      ...translatedConfig,
      cookieTypes: {
        ...translatedConfig.cookieTypes,
        ...finalConfig.cookieTypes
      }
    });

    const WidgetWrapper = () => {
      const [showBanner, setShowBanner] = useState(false);
      const [showPreferencesButton, setShowPreferencesButton] = useState(false);
      const [expandedBanner, setExpandedBanner] = useState(finalConfig.initiallyExpanded);

      useEffect(() => {
        const preferences = getCookiePreferences();
        setShowBanner(!preferences);
        setShowPreferencesButton(!!preferences || CookieBannerWidget.showPreferencesButton);
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
        CookieBannerWidget.showPreferencesButton = true;
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
        <div data-cookie-banner-widget>
          {showBanner && (
            <CookieBanner
              config={translatedConfig}
              onClose={handleCloseBanner}
              initiallyExpanded={expandedBanner}
              onAccept={finalConfig.onAccept}
              onReject={finalConfig.onReject}
              onPreferenceChange={finalConfig.onPreferenceChange}
            />
          )}
          {showPreferencesButton && !document.getElementById(finalConfig.preferencesButtonId) &&
            <PreferencesButton
              onClick={handleTogglePreferences}
              color={finalConfig.preferencesButtonColor}
            />
          }
        </div>
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
  },
  reset() {
    this.initialized = false;
    this.callbacks = {};
    const container = document.getElementById('cookie-banner-container');
    if (container) {
      container.innerHTML = '';
    }
  },
};

if (typeof window !== 'undefined') {
  window.CookieBannerWidget = CookieBannerWidget;
}

export default CookieBannerWidget;
