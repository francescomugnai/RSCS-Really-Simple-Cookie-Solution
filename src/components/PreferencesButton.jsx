import { useState, useEffect } from 'preact/hooks';
import { getCookiePreferences } from '../utils/cookieManager';

const PreferencesButton = ({ onClick, color }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const preferences = getCookiePreferences();
    setShowButton(!!preferences);
  }, []);

  if (!showButton) return null;

  const buttonStyle = {
    backgroundColor: color,
  };

  return (
    <div
      className="preferences-button"
      style={buttonStyle}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
    </div>
  );
};

export default PreferencesButton;
