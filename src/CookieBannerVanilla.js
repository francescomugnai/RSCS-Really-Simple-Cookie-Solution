import { h, render } from 'preact';
import CookieBanner from './components/CookieBanner';
import './index.css';  // Importa il file CSS di Tailwind

const CookieBannerVanilla = {
  init(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      render(h(CookieBanner, {}), container);
    }
  }
};

export default CookieBannerVanilla;