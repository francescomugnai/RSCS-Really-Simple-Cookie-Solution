// CookieBanner.jsx
import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { loadGoogleAnalytics, removeGoogleAnalytics } from '../utils/analytics';
import { 
  setCookiePreferences as saveCookiePreferences, 
  unblockResources, 
  blockResources,
  getCookiePreferences 
} from '../utils/cookieManager';
import '../styles/CookieBanner.css';

const CookieBanner = ({ config = {}, onClose }) => {
  const bannerRef = useRef(null);
  const detailsRef = useRef(null);

  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    const savedPreferences = getCookiePreferences();
    if (savedPreferences) {
      setCookiePreferences(savedPreferences);
      unblockResources();
      
      // Controlla se i cookie di marketing/analytics sono disattivati
      if (!savedPreferences[config.googleAnalytics.category]) {
        removeGoogleAnalyticsCookies();
      }
    }
  }, []);

  const removeGoogleAnalyticsCookies = () => {
    const removeCookies = () => {
      const allCookies = document.cookie.split(';');
      let cookiesRemoved = false;
      
      allCookies.forEach(cookie => {
        const [name, _] = cookie.split('=').map(c => c.trim());
        
        if (name.startsWith('_ga')) {
          console.log('Removing Google Analytics cookie:', name);
          
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

    // Tenta di rimuovere i cookie più volte
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
    
    // Carica Google Analytics se abilitato
    if (config.googleAnalytics && config.googleAnalytics.enabled) {
      loadGoogleAnalytics(config.googleAnalytics.id);
    }
  
    onClose();
  };
  
  const handleSavePreferences = () => {
    saveCookiePreferences(cookiePreferences);
    unblockResources();
    blockResources();
    
    // Gestione di Google Analytics
    if (config.googleAnalytics && config.googleAnalytics.enabled) {
      if (cookiePreferences[config.googleAnalytics.category]) {
        loadGoogleAnalytics(config.googleAnalytics.id);
      } else {
        removeGoogleAnalytics();
      }
    }
  
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

    // Delay closing and reloading to ensure cookies are removed
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 500);
  
    onClose();
  };

  if (!Object.keys(config.cookieTypes).length) return null;

  return (
    <div className={`cookie-banner ${showDetails ? 'show-details' : ''}`}>
      <div className="cookie-banner-content">
        <button onClick={onClose} className="close-button">{config.closeButton}</button>
        
        {(config.logoUrl || config.logoDarkUrl) && (
          <div className="logo-container">
            {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="banner-logo light-logo" />}
            {config.logoDarkUrl && <img src={config.logoDarkUrl} alt="Logo" className="banner-logo dark-logo" />}
          </div>
        )}
        <h2>{config.bannerTitle}</h2>
        <p>{config.bannerDescription}</p>

        <div className="cookie-buttons">
          <button 
            onClick={handleAcceptAll}
            className="cookie-button accept-button"
          >
            {config.acceptAllButton}
          </button>
          <button 
            onClick={handleReject}
            className="cookie-button reject-button"
          >
            {config.rejectAllButton}
          </button>
        </div>

        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="details-link"
        >
          {showDetails ? config.hideDetailsLink : config.detailsLink}
        </button>

        {showDetails && (
          <div className="cookie-options">
            {Object.entries(config.cookieTypes).map(([type, { title, description }]) => (
              <div key={type} className="cookie-option">
                <input
                  type="checkbox"
                  id={type}
                  checked={cookiePreferences[type]}
                  onChange={() => handleToggle(type)}
                  disabled={type === 'necessary'}
                />
                <div>
                  <label htmlFor={type}>{title}</label>
                  <p>{description}</p>
                </div>
              </div>
            ))}
            <button 
              onClick={handleSavePreferences}
              className="cookie-button save-button"
            >
              {config.savePreferencesButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;
