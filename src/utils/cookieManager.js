import Cookies from 'js-cookie';
import { DEFAULT_BLOCKED_DOMAINS } from './blockedDomains';

const COOKIE_CATEGORIES = {
  necessary: {
    title: 'Necessari',
    description: 'Cookie essenziali per il funzionamento del sito.',
  },
  functional: {
    title: 'Funzionalità',
    description: 'Cookie per migliorare la funzionalità del sito.',
  },
  analytics: {
    title: 'Analitici',
    description: 'Cookie per analizzare l\'utilizzo del sito.',
  },
  marketing: {
    title: 'Marketing',
    description: 'Cookie per mostrare annunci personalizzati.',
  }
};

let blockedDomains = [...DEFAULT_BLOCKED_DOMAINS];

export const setBlockedDomains = (customDomains) => {
  if (Array.isArray(customDomains)) {
    blockedDomains = customDomains;
  } else {
    console.warn('setBlockedDomains: customDomains deve essere un array');
  }
};

export const useDefaultBlockedDomains = () => {
  blockedDomains = [...DEFAULT_BLOCKED_DOMAINS];
};

export const getBlockedDomains = () => {
  return [...blockedDomains];
};

export const getCookiePreferences = () => {
  const preferences = Cookies.get('cookiePreferences');
  return preferences ? JSON.parse(preferences) : null;
};

export const canLoadResource = (resourceType) => {
  const preferences = getCookiePreferences();
  if (!preferences) return false;
  return preferences[resourceType] || false;
};

export const unblockResources = () => {
  document.querySelectorAll('[data-cookie-type]').forEach(el => {
    const type = el.getAttribute('data-cookie-type');
    const preferences = getCookiePreferences();
    if (preferences && preferences[type]) {
      if (el.tagName === 'IFRAME') {
        if (!el.src) el.src = el.getAttribute('data-src');
      } else if (el.tagName === 'SCRIPT') {
        if (el.type === 'text/plain') {
          const newScript = document.createElement('script');
          Array.from(el.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = el.textContent;
          el.parentNode.replaceChild(newScript, el);
        }
      }
    }
  });
};

export const blockResources = () => {
  document.querySelectorAll('[data-cookie-type]').forEach(el => {
    const type = el.getAttribute('data-cookie-type');
    const preferences = getCookiePreferences();
    if (!preferences || !preferences[type]) {
      if (el.tagName === 'IFRAME') {
        el.removeAttribute('src');
      } else if (el.tagName === 'SCRIPT') {
        el.type = 'text/plain';
      }
    }
  });
};

export const getCookieTypes = () => {
  return COOKIE_CATEGORIES;
};

export const setCookiePreferences = (preferences) => {
  Cookies.set('cookiePreferences', JSON.stringify(preferences), { expires: 365 });
};

export const autoBlockResources = () => {
  const scripts = document.getElementsByTagName('script');
  const iframes = document.getElementsByTagName('iframe');

  [...scripts, ...iframes].forEach(el => {
    const src = el.src || el.getAttribute('data-src');
    if (src && blockedDomains.some(domain => src.includes(domain))) {
      el.setAttribute('data-cookie-type', 'marketing');
      if (el.tagName === 'SCRIPT') {
        el.type = 'text/plain';
      } else if (el.tagName === 'IFRAME') {
        el.setAttribute('data-src', src);
        el.removeAttribute('src');
      }
    }
  });
};

export const initializeCookieManager = (config) => {
  const customCookieTypes = config.cookieTypes || {};
  Object.assign(COOKIE_CATEGORIES, customCookieTypes);

  if (config.blockedDomains) {
    setBlockedDomains(config.blockedDomains);
  } else if (config.useDefaultBlockedDomains === false) {
    setBlockedDomains([]);
  }

  if (config.autoBlock) {
    autoBlockResources();
  }

  const preferences = getCookiePreferences();
  if (preferences) {
    unblockResources();
  }
  return config;
};