// utils/analytics.js

export const loadGoogleAnalytics = (id) => {
  if (!id) return;

  // Rimuovi script esistenti se presenti
  removeGoogleAnalytics();

  // Crea e aggiungi lo script del tag manager
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
      console.log('Attempting to remove Google Analytics cookie:', name);
      
      // Tenta di rimuovere il cookie con vari domini e percorsi
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
  // Rimuovi gli script di Google Analytics
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.src.includes('googletagmanager.com/gtag/js')) {
      script.remove();
    }
  });

  // Rimuovi l'oggetto dataLayer e la funzione gtag
  delete window.dataLayer;
  delete window.gtag;

  // Rimuovi i cookie di Google Analytics
  removeGoogleAnalyticsCookies();
  
  // Esegui nuovamente la rimozione dopo un breve ritardo
  setTimeout(removeGoogleAnalyticsCookies, 100);
};