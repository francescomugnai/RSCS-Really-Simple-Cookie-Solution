import { useState, useEffect, useRef } from 'preact/hooks';
import { loadGoogleAnalytics, removeGoogleAnalytics } from '../utils/analytics';
import { 
  setCookiePreferences as saveCookiePreferences, 
  unblockResources, 
  blockResources,
  getCookiePreferences,
  getBlockedElementsTitles
} from '../utils/cookieManager';
import '../styles/CookieBanner.css';
import autoAnimate from '@formkit/auto-animate';
import translations from '../locales/translation';

const CookieBanner = ({ 
  config = {}, 
  defaultConfig = {},
  onClose, 
  initiallyExpanded,
  onAccept,
  onReject,
  onPreferenceChange,
  language
}) => {
  const t = translations[language] || translations['en'];
  
  const [showDetails, setShowDetails] = useState(initiallyExpanded);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [blockedTitles, setBlockedTitles] = useState({});
  const [isClosing, setIsClosing] = useState(false); 
  const bannerRef = useRef(null); 
  const detailsRef = useRef(null); 

  useEffect(() => {
    if (config.useAnimations && detailsRef.current) {
      autoAnimate(detailsRef.current);
    }
  }, [config.useAnimations]);

  useEffect(() => {
    setShowDetails(initiallyExpanded);
    setBlockedTitles(getBlockedElementsTitles());
  }, [initiallyExpanded]);

  useEffect(() => {
    if (config.useAnimations && bannerRef.current) {
      autoAnimate(bannerRef.current);
    }
  }, [config.useAnimations]);

  useEffect(() => {
    const savedPreferences = getCookiePreferences();
    if (savedPreferences) {
      setCookiePreferences(savedPreferences);
      unblockResources();
      
      if (!savedPreferences[config.googleAnalytics.category]) {
        removeGoogleAnalyticsCookies();
      }
    }
  }, []);

  const toggleDetails = () => {
    setTimeout(() => {
      setShowDetails(prev => !prev);
    }, 50);
  };

  const removeGoogleAnalyticsCookies = () => {
    const removeCookies = () => {
      const allCookies = document.cookie.split(';');
      let cookiesRemoved = false;
      
      allCookies.forEach(cookie => {
        const [name, _] = cookie.split('=').map(c => c.trim());
        
        if (name.startsWith('_ga')) {          
          const domains = [window.location.hostname, '.' + window.location.hostname, ''];
          const paths = ['/', '', window.location.pathname];
          
          domains.forEach(domain => {
            paths.forEach(path => {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=strict`;
            });
          });
          
          cookiesRemoved = true;
        }
      });
      
      return cookiesRemoved;
    };

    const maxAttempts = 5;
    let attempt = 0;

    const attemptRemoval = () => {
      if (removeCookies() || attempt >= maxAttempts) {
        console.log('Finished removing Google Analytics cookies');
      } else {
        attempt++;
        setTimeout(attemptRemoval, 100);
      }
    };

    attemptRemoval();
  };

  const handleToggle = (type) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted = Object.keys(config.cookieTypes).reduce((acc, type) => {
      acc[type] = true;
      return acc;
    }, {});
    setCookiePreferences(allAccepted);
    saveCookiePreferences(allAccepted);
    unblockResources();
    
    if (config.googleAnalytics && config.googleAnalytics.enabled) {
      loadGoogleAnalytics(config.googleAnalytics.id);
    }
  
    if (onAccept) onAccept(allAccepted);
    onClose();
  };
  
  const handleSavePreferences = () => {
    saveCookiePreferences(cookiePreferences);
    unblockResources();
    blockResources();

    if (config.googleAnalytics && config.googleAnalytics.enabled) {
      if (cookiePreferences[config.googleAnalytics.category]) {
        loadGoogleAnalytics(config.googleAnalytics.id);
      } else {
        removeGoogleAnalytics();
      }
    }
  
    if (onPreferenceChange) onPreferenceChange(cookiePreferences);
    onClose();
  };

  const handleReject = () => {
    const allRejected = Object.keys(config.cookieTypes).reduce((acc, type) => {
      acc[type] = type === 'necessary';
      return acc;
    }, {});
    setCookiePreferences(allRejected);
    saveCookiePreferences(allRejected);
    blockResources();
    
    if (config.googleAnalytics && config.googleAnalytics.enabled) {
      removeGoogleAnalytics();
      removeGoogleAnalyticsCookies();
    }

    if (onReject) onReject(allRejected);

    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 500);
  };

  const handleCloseBanner = () => {
    if (bannerRef.current) {
      setIsClosing(true); 
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } else {
      if (onClose) onClose();
    }
  };

  const getText = (key, subKey = null) => {
    if (subKey) {
      // Gestione delle chiavi annidate (per cookieTypes)
      const configValue = config.cookieTypes?.[key]?.[subKey];
      const defaultConfigValue = defaultConfig.cookieTypes?.[key]?.[subKey];
      const translationValue = t.cookieTypes?.[key]?.[subKey];
      const fallbackValue = translations['en'].cookieTypes?.[key]?.[subKey];
  
      if (configValue && configValue !== defaultConfigValue && configValue.trim() !== '') {
        return configValue;
      }
      return translationValue || fallbackValue || configValue || defaultConfigValue || '';
    } else {
      // Gestione delle chiavi di primo livello (come prima)
      if (config[key] && config[key] !== defaultConfig[key] && config[key].trim() !== '') {
        return config[key];
      }
      return t[key] || translations['en'][key] || config[key] || defaultConfig[key] || '';
    }
  };
  if (!Object.keys(config.cookieTypes).length) return null;

  return (
    <div 
      ref={bannerRef} 
      className={`cookie-banner ${showDetails ? 'show-details' : ''} ${config.position} ${isClosing ? 'slide-out' : ''}`} 
      data-testid="cookie-banner"
    >
      <div className="cookie-banner-content">
        <button onClick={handleCloseBanner} className="close-button">
          {getText('closeButtonText')}
        </button>
        
        {(config.logoUrl || config.logoDarkUrl) && (
          <div className="logo-container">
            {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="banner-logo light-logo" />}
            {config.logoDarkUrl && <img src={config.logoDarkUrl} alt="Logo" className="banner-logo dark-logo" />}
          </div>
        )}
        <h2>{getText('bannerTitle')}</h2>
        <p>{getText('bannerDescription')}</p>
        {config.privacyPolicyUrl && (
          <p className="privacy-policy-link">
            <a href={config.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
              {t.privacyPolicyLink}
            </a>
          </p>
        )}

<div className="cookie-buttons">
          <button 
            onClick={handleAcceptAll}
            className="cookie-button accept-button"
            data-testid="accept-button"
          >
            {getText('acceptAllButtonText')}
          </button>
          <button 
            onClick={handleReject}
            className="cookie-button reject-button"
            data-testid="reject-button"
          >
            {getText('rejectAllButtonText')}
          </button>
        </div>

        <button 
          onClick={toggleDetails}
          className="details-link"
        >
          {showDetails ? config.hideDetailsLinkText : config.detailsLinkText}
        </button>

        <div ref={detailsRef}>
          {showDetails && (
            <div className="cookie-options" data-testid="cookie-options">
            {config.cookieTypes && Object.entries(config.cookieTypes).map(([type, value]) => (
                  <div key={type} className="cookie-option">
                  <input
                    type="checkbox"
                    id={type}
                    checked={cookiePreferences[type]}
                    onChange={() => handleToggle(type)}
                    disabled={type === 'necessary'}
                  />
                  <div className="cookie-option-text">
                    <label htmlFor={type}>{getText(type, 'title')}</label>
                    <p>{getText(type, 'description')}</p>
                    {blockedTitles[type] && (
                      <ul>
                        {blockedTitles[type].map((title, index) => (
                          <li key={index} className="badge">{title}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                ))}
              <button
                onClick={handleSavePreferences}
                className="cookie-button save-button"
              >
                {config.saveButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;