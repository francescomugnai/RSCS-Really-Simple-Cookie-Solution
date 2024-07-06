// utils/analytics.js
export const loadGoogleAnalytics = (id) => {
  if (!id) return;
  removeGoogleAnalytics();
  const scriptTag = document.createElement('script');
  scriptTag.async = true;
  scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  
  scriptTag.onload = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', id);
  };

  document.head.appendChild(scriptTag);
};

const removeGoogleAnalyticsCookies = () => {
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

export const removeGoogleAnalytics = () => {
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.src.includes('googletagmanager.com/gtag/js')) {
      script.remove();
    }
  });

  delete window.dataLayer;
  delete window.gtag;

  removeGoogleAnalyticsCookies();
  setTimeout(removeGoogleAnalyticsCookies, 100);
};