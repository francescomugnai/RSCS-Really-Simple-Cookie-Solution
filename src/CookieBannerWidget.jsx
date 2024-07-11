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
      desktopWidth: '380px',
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
      // googleAnalytics: {
      //   enabled: false,
      //   id: '',
      //   category: 'marketing'
      // },
      analytics: {
        enabled: false,
        provider: null, // 'googleAnalytics', 'fathom', etc.
        config: {},
        category: 'analytics'
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
    const t = translations[lang];

    const translatedConfig = {
      ...finalConfig,
      bannerTitle: finalConfig.bannerTitle !== defaultConfig.bannerTitle ? finalConfig.bannerTitle : t.bannerTitle,
      bannerDescription: finalConfig.bannerDescription !== defaultConfig.bannerDescription ? finalConfig.bannerDescription : t.bannerDescription,
      acceptAllButtonText: finalConfig.acceptAllButtonText !== defaultConfig.acceptAllButtonText ? finalConfig.acceptAllButtonText : t.acceptAllButtonText,
      rejectAllButtonText: finalConfig.rejectAllButtonText !== defaultConfig.rejectAllButtonText ? finalConfig.rejectAllButtonText : t.rejectAllButtonText,
      saveButtonText: finalConfig.saveButtonText !== defaultConfig.saveButtonText ? finalConfig.saveButtonText : t.saveButtonText,
      closeButtonText: finalConfig.closeButtonText !== defaultConfig.closeButtonText ? finalConfig.closeButtonText : t.closeButtonText,
      detailsLinkText: finalConfig.detailsLinkText !== defaultConfig.detailsLinkText ? finalConfig.detailsLinkText : t.detailsLinkText,
      hideDetailsLinkText: finalConfig.hideDetailsLinkText !== defaultConfig.hideDetailsLinkText ? finalConfig.hideDetailsLinkText : t.hideDetailsLinkText,
      cookieTypes: Object.fromEntries(
        Object.entries(finalConfig.cookieTypes).map(([type, value]) => [
          type,
          {
            title: value.title !== defaultConfig.cookieTypes[type]?.title 
              ? value.title 
              : (t.cookieTypes?.[type]?.title ?? defaultConfig.cookieTypes[type]?.title ?? value.title),
            description: value.description !== defaultConfig.cookieTypes[type]?.description 
              ? value.description 
              : (t.cookieTypes?.[type]?.description ?? defaultConfig.cookieTypes[type]?.description ?? value.description)
          }
        ])
      ),
    };

    initializeCookieManager(translatedConfig);

    const WidgetWrapper = () => {
      const [showBanner, setShowBanner] = useState(false);
      const [showPreferencesButton, setShowPreferencesButton] = useState(false);
      const [expandedBanner, setExpandedBanner] = useState(finalConfig.initiallyExpanded);

      useEffect(() => {
        const preferences = getCookiePreferences();
        setShowBanner(!preferences);
        setShowPreferencesButton(!!preferences || CookieBannerWidget.showPreferencesButton);
    
        if (finalConfig.analytics.enabled && preferences && preferences[finalConfig.analytics.category]) {
          loadAnalytics(finalConfig.analytics.provider, finalConfig.analytics.config);
        }
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
              defaultConfig={defaultConfig}
              onClose={handleCloseBanner}
              initiallyExpanded={expandedBanner}
              onAccept={finalConfig.onAccept}
              onReject={finalConfig.onReject}
              onPreferenceChange={finalConfig.onPreferenceChange}
              language={lang}
              analytics={finalConfig.analytics}
            />
          )}
          {showPreferencesButton && !document.getElementById(finalConfig.preferencesButtonId) &&
            <PreferencesButton
              onClick={handleTogglePreferences}
              color={finalConfig.preferencesButtonColor}
              language={lang}
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