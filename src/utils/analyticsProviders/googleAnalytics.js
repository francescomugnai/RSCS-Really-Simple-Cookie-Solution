// utils/analyticsProviders/googleAnalytics.js

export const load = (config) => {
  const { id } = config;
  if (!id) {
    console.warn('Google Analytics ID is required');
    return;
  }
  
  remove();
  
  const scriptTag = document.createElement('script');
  scriptTag.async = true;
  scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  
  scriptTag.onload = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);}
    window.gtag('js', new Date());
    window.gtag('config', id);
  };

  document.head.appendChild(scriptTag);
};

const removeCookies = () => {
  const allCookies = document.cookie.split(';');
  allCookies.forEach(cookie => {
    const [name, _] = cookie.split('=').map(c => c.trim());
    
    if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
      const domains = [window.location.hostname, '.' + window.location.hostname, ''];
      const paths = ['/', '', window.location.pathname];
      
      domains.forEach(domain => {
        paths.forEach(path => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=strict`;
        });
      });
    }
  });
};

export const remove = () => {
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.src.includes('googletagmanager.com/gtag/js')) {
      script.remove();
    }
  });

  delete window.dataLayer;
  delete window.gtag;

  removeCookies();
  // Double-check after a short delay to ensure cookies are removed
  setTimeout(removeCookies, 100);
};

export const updateConsent = (consentOptions) => {
  if (window.gtag) {
    window.gtag('consent', 'update', consentOptions);
  } else {
    console.warn('Google Analytics not loaded, cannot update consent');
  }
};

export const isLoaded = () => {
  return typeof window.gtag === 'function';
};

export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path
    });
  } else {
    console.warn('Google Analytics not loaded, cannot track page view');
  }
};

export const trackEvent = (category, action, label, value) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  } else {
    console.warn('Google Analytics not loaded, cannot track event');
  }
};