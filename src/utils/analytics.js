// utils/analytics.js

import * as googleAnalytics from './analyticsProviders/googleAnalytics';
import * as fathom from './analyticsProviders/fathom';
// import * as matomo from './analyticsProviders/matomo';
// import * as plausible from './analyticsProviders/plausible';

const providers = {
  googleAnalytics,
  fathom
  // matomo,
  // plausible,
};

export const loadAnalytics = (provider, config) => {
  if (providers[provider] && providers[provider].load) {
    providers[provider].load(config);
  } else {
    console.warn(`Analytics provider '${provider}' not found or doesn't have a load method.`);
  }
};

export const removeAnalytics = (provider) => {
  if (providers[provider] && providers[provider].remove) {
    providers[provider].remove();
  } else {
    console.warn(`Analytics provider '${provider}' not found or doesn't have a remove method.`);
  }
};

export const updateConsent = (provider, consentOptions) => {
  if (providers[provider] && providers[provider].updateConsent) {
    providers[provider].updateConsent(consentOptions);
  } else {
    console.warn(`Analytics provider '${provider}' not found or doesn't have an updateConsent method.`);
  }
};