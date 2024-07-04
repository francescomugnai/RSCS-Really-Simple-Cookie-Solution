# RSCS - Really Simple Cookie Solution 🍪

RSCS is a lightweight, easy-to-use cookie consent management solution for your web projects. It's designed to be flexible, customizable, and compliant with GDPR and other cookie regulations.

## Features 🚀

- 🎨 Customizable banner and preference UI
- 🌐 Multi-language support
- 🔒 Automatic resource blocking for popular tracking and analytics services
- 🖼️ Placeholder for blocked content (e.g., YouTube videos)
- 🔧 Easy integration with Google Analytics
- 📱 Responsive design
- 🔍 Granular cookie type control

## Installation 📦

Install via npm:

```bash
npm install rscs

Alternatively, include via CDN:


<script src="https://unpkg.com/rscs@latest/dist/rscs.min.js"></script>

## Quick start 🏃‍♂️

import CookieBannerWidget from 'rscs';

CookieBannerWidget.init({
  containerId: 'cookie-banner-container',
  language: 'en',
  autoBlock: true,
  googleAnalytics: {
    enabled: true,
    id: 'UA-XXXXXXXXX-X',
    category: 'analytics'
  }
});

Configuration Options 🛠️
OptionTypeDefaultDescriptioncontainerIdstring'cookie-banner-container'ID of the container where the banner will be renderedlanguagestring'en'Language for the banner textautoBlockbooleantrueAutomatically block known tracking domainslogoUrlstringnullURL for the logo to display in the bannercookieTypesobject{...}Define custom cookie categories
... (add more options as needed)
Customizing Blocked Domains 🚫
RSCS comes with a predefined list of domains to block. You can customize this list:
javascriptCopyimport { setBlockedDomains } from 'rscs';

setBlockedDomains(['youtube.com', 'facebook.com', 'your-custom-domain.com']);
Placeholders for Blocked Content 🖼️
RSCS automatically creates placeholders for blocked content like YouTube videos. These placeholders inform users about the blocked content and how to enable it.
Contributing 🤝
We welcome contributions to make RSCS even better. If you have any ideas or find any bugs, please open an issue or submit a pull request.
License 📄
RSCS is MIT licensed.

Use RSCS responsibly to manage cookie consent on your websites.

