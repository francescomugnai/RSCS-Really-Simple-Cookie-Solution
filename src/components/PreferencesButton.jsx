// PreferencesButton.jsx
import { useState, useEffect } from 'preact/hooks';
import { getCookiePreferences } from '../utils/cookieManager';

const PreferencesButton = ({ onTogglePreferences }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const preferences = getCookiePreferences();
    setShowButton(!!preferences);
  }, []);

  if (!showButton) return null;

  return (
    <div 
      className="preferences-button"
      onClick={(e) => {
        e.preventDefault();
        onTogglePreferences();
      }}
    >
      Gestisci preferenze cookie
    </div>
  );
};

export default PreferencesButton;
