# RSCS - Really Simple Cookie Solution 🍪

RSCS is a lightweight, easy-to-use cookie consent management solution for your web projects. 
It's designed to be flexible, customizable, and compliant with GDPR and other cookie regulations.

#### Features 🚀

- 🎨 Customizable banner and preference UI
- 🌐 Multi-language support
- 🔒 Automatic resource blocking for popular tracking and analytics services
- 🔧 Easy integration with Google Analytics
- 📱 Responsive design
- 🔍 Granular cookie type control
- 🎨 Customizable banner and preference UI with light and dark mode support
- 🚀 Lightweight and performant

#### Installation 📦

Install via npm:

```bash
npm install rscs
```

Alternatively, include via CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@mugnai/rscs@latest/dist/cookie-banner-widget.umd.js"></script>
```

#### Quick start 🏃‍♂️

import CookieBannerWidget from 'rscs';

```js
CookieBannerWidget.init({
  containerId: 'cookie-banner-container',
  language: 'en',
  autoBlock: true,
});
```

#### Complete Configuration Example 🛠️

Here's an example of a more comprehensive configuration using many of the available options:

```js
import CookieBannerWidget from 'rscs';

CookieBannerWidget.init({
  containerId: 'cookie-banner-container',
  language: 'en',
  colorMode: 'auto',
  preferencesButtonId: 'custom-preferences-button',
  preferencesButtonText: 'Manage Cookies',
  bannerTitle: 'Privacy Settings',
  bannerDescription: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
  saveButtonText: 'Save Settings',
  acceptAllButtonText: 'Accept All',
  closeButtonText: 'Close',
  scrollTopButton: 'Back to Top',
  logoUrl: 'https://example.com/logo-light.png',
  logoDarkUrl: 'https://example.com/logo-dark.png',
  privacyPolicyUrl: 'https://example.com/privacy-policy',
  useAnimations: true,
  placeholders: true,
  placeholdersText: 'Please accept cookies to view this content.',
  autoBlock: true,
  useDefaultBlockedDomains: true,
  blockedDomains: ['analytics.com', 'tracking.com'],
  googleAnalytics: {
    enabled: true,
    id: 'UA-XXXXXXXXX-X',
    category: 'analytics'
  },
  cookieTypes: {
    necessary: {
      title: 'Necessary',
      description: 'These cookies are essential for the website to function properly.'
    },
    functional: {
      title: 'Functional',
      description: 'These cookies enable personalized features and functionality.'
    },
    analytics: {
      title: 'Analytics',
      description: 'These cookies help us understand how visitors interact with the website.'
    },
    marketing: {
      title: 'Marketing',
      description: 'These cookies are used to deliver relevant ads and marketing campaigns.'
    }
  },
  onAccept: (preferences) => {
    console.log('Cookies accepted:', preferences);
  },
  onReject: (preferences) => {
    console.log('Cookies rejected:', preferences);
  },
  onPreferenceChange: (preferences) => {
    console.log('Cookie preferences changed:', preferences);
  }
});
```

#### Configuration Options 🛠️


| Option                   | Type    | Default                  | Description                                                  |
|--------------------------|---------|--------------------------|--------------------------------------------------------------|
| acceptAllButtonText      | string  | 'Accept All'             | Text for the accept all button in the banner                  |
| autoBlock                | boolean | true                     | Automatically block known tracking domains                    |
| bannerDescription        | string  | 'We use cookies to enhance your experience on our site.' | Description text of the cookie banner                         |
| bannerTitle              | string  | 'Cookie Settings'        | Title of the cookie banner                                   |
| blockedDomains           | array   | null                     | Custom list of domains to block                              |
| closeButtonText          | string  | 'Close'                  | Text for the close button in the banner                       |
| colorMode                | string  | 'auto'                   | Color mode for the banner. Can be 'light', 'dark', or 'auto' |
| containerId              | string  | 'cookie-banner-container' | ID of the container where the banner will be rendered        |
| cookieTypes              | object  | See default below        | Define custom cookie categories and their descriptions        |
| googleAnalytics          | object  | { enabled: false, id: '', category: 'marketing' } | Configuration for Google Analytics integration |
| language                 | string  | 'en'                     | Language for the banner text. Supports multi-language configuration. |
| logoDarkUrl              | string  | null                     | URL for the logo to display in dark mode                      |
| logoUrl                  | string  | null                     | URL for the logo to display in the banner                     |
| preferencesButtonId      | string  | 'cookie-preferences-button' | ID of the preferences button                                 |
| preferencesButtonText    | string  | 'Manage Cookie Preferences' | Text for the preferences button                              |
| saveButtonText           | string  | 'Save Preferences'       | Text for the save button in the banner                       |
| scrollTopButton          | string  | 'Back to Top'            | Text for the scroll-to-top button                            |
| useAnimations            | boolean | true                     | Whether to use animations in the banner                      |
| useDefaultBlockedDomains | boolean | true                     | Whether to use the default list of blocked domains           |
| position                 | string  | 'bottom-right'           |  Position of the banner. Can be 'bottom-right', 'bottom-left', or 'bottom-center'           |


#### Custom Preferences Button 🔘

If you want to provide a custom button to reopen the cookie preferences, you can add an element with the ID "cookie-preferences-button" to your HTML. RSCS will automatically attach the necessary event listener to this button. For example:

```html
<button id="cookie-preferences-button">Manage Cookie Preferences</button>
```

#### Language and Translations 🌐

RSCS supports multiple languages through built-in translations. You can specify a language using the `language` option:

```js
CookieBannerWidget.init({
  language: 'it',
  // ... other options ...
});
```
You can also override specific translation strings while still using a base language. This allows for fine-grained customization:

```js
CookieBannerWidget.init({
  language: 'en', 
  preferencesButtonText: 'Custom Preferences Button Text',
  bannerTitle: 'Custom Banner Title',
  bannerDescription: 'Custom banner description.',
  saveButtonText: 'Custom Save Preferences',
  acceptAllButtonText: 'Custom Accept All',
  closeButtonText: 'Custom Close',
  // ... other options ...
});
```

In this example, the base language is English, but specific text elements are customized. Any text not explicitly overridden will use the default English translation.

#### Manual Resource Blocking 🛑

You can manually block specific resources by adding the data-cookie-type attribute to the HTML element and using data-src instead of src for the resource URL. RSCS will automatically manage the loading of these resources based on user preferences. For example:

```html
<iframe 
  style="border-radius:12px" 
  title="Spotify video player"
  data-cookie-type="marketing" 
  data-src="https://open.spotify.com/embed/track/2MBlKZ8cSN8OmsIhWBH9ci?utm_source=generator" 
  width="100%" 
  height="352" 
  frameBorder="0" 
  allowfullscreen="" 
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
  loading="lazy"
></iframe>
```

In this example, the Spotify embed will only load if the user has accepted marketing cookies.

#### Customizing Blocked Domains 🚫
RSCS comes with a predefined list of domains to block. You can customize this list by setting useDefaultBlockedDomains to false and passing an array of domains to blockedDomains:

```js
import CookieBannerWidget from 'rscs';

CookieBannerWidget.init({
  containerId: 'cookie-banner-container',
  language: 'en',
  autoBlock: true,
  useDefaultBlockedDomains: false,
  blockedDomains: ['youtube.com', 'facebook.com', 'your-custom-domain.com']
});
```

#### Default cookieTypes Configuration

```js
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
```

#### Color Mode Configuration 🎨

RSCS supports light and dark color modes, as well as an automatic mode that follows the user's system preferences. You can configure this in the init options:

```js
CookieBannerWidget.init({
  // ... other options ...
  colorMode: 'light', // 'light', 'dark', or 'auto'
});
```

#### Google Analytics Integration 📊

RSCS provides easy integration with Google Analytics. You can configure this in the init options:

```js
CookieBannerWidget.init({
  // ... other options ...
  googleAnalytics: {
    enabled: true,
    id: 'UA-XXXXXXXXX-X',  // Your Google Analytics ID
    category: 'analytics'  // The cookie category for Google Analytics
  }
});
```

With this configuration, RSCS will automatically handle the loading and unloading of Google Analytics based on user consent for the specified cookie category.

#### Contributing 🤝
We welcome contributions to make RSCS even better. If you have any ideas or find any bugs, please open an issue or submit a pull request.

#### Font 🖋️

RSCS uses the Inter font, which is loaded from Bunny Fonts, a privacy-friendly alternative to Google Fonts. The Inter font is licensed under the SIL Open Font License 1.1.
[OFL-1.1](https://scripts.sil.org/OFL)
Copyright 2020 [The Inter Project Authors](https://github.com/rsms/inter)


#### Testing 🧪

RSCS uses Vitest and Testing Library for unit and integration testing. To run the tests:

1. Ensure you have all dependencies installed.
2. Run the tests:

```bash
npm run test
```

#### License 📄
RSCS is MIT licensed.
RSCS (Really Simple Cookie Solution) is an open-source tool designed to help website owners manage cookie consent and preferences. While RSCS simplifies cookie management, it does not guarantee full compliance with data privacy laws (e.g., GDPR, CCPA). Website owners are responsible for ensuring proper implementation, providing accurate cookie information, obtaining user consent, and maintaining compliance with applicable regulations. RSCS should be used as part of a comprehensive approach to data privacy and not as a substitute for legal advice.
