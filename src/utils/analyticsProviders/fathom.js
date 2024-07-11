// utils/analyticsProviders/fathom.js

let fathomLoaded = false;

export const load = (config) => {
  if (fathomLoaded) return;
  
  const { siteId, url = 'https://cdn.usefathom.com/script.js' } = config;

  if (!siteId) {
    console.warn('Fathom Analytics siteId is required');
    return;
  }

  const script = document.createElement('script');
  script.src = url;
  script.setAttribute('data-site', siteId);
  script.defer = true;

  script.onload = () => {
    fathomLoaded = true;
    console.log('Fathom Analytics loaded successfully');
  };

  document.head.appendChild(script);
};

export const remove = () => {
  const scripts = document.querySelectorAll('script[src*="usefathom.com"]');
  scripts.forEach(script => script.remove());

  delete window.fathom;
  fathomLoaded = false;
  console.log('Fathom Analytics removed');
};

export const updateConsent = (consentOptions) => {
  // Fathom doesn't have a specific consent update mechanism
  // It respects Do Not Track settings by default
  console.log('Fathom Analytics consent updated:', consentOptions);
};

export const trackPageView = (path) => {
  if (window.fathom) {
    window.fathom.trackPageview({
      url: path || window.location.pathname
    });
  } else {
    console.warn('Fathom Analytics not loaded, cannot track page view');
  }
};

export const trackGoal = (eventId, value = 0) => {
  if (window.fathom) {
    window.fathom.trackGoal(eventId, value);
  } else {
    console.warn('Fathom Analytics not loaded, cannot track goal');
  }
};

export const isLoaded = () => fathomLoaded;