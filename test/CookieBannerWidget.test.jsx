import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CookieBannerWidget from '../src/CookieBannerWidget';
import * as cookieManager from '../src/utils/cookieManager';
// import userEvent from '@testing-library/user-event'

describe('CookieBannerWidget', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="cookie-banner-container"></div>';
    CookieBannerWidget.reset();
    vi.spyOn(cookieManager, 'getCookiePreferences').mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize the widget and render the banner', async () => {
    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
    });

    await waitFor(() => {
      const bannerTitle = screen.getByText('Cookie Settings');
      expect(bannerTitle).toBeInTheDocument();
    });
  });

  it('should handle accept all cookies', async () => {
    const onAccept = vi.fn();

    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
      onAccept,
    });

    await waitFor(() => {
      const acceptButton = screen.getByRole('button', { name: 'Accept All' });
      expect(acceptButton).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Accept All' }));

    await waitFor(() => {
      expect(onAccept).toHaveBeenCalled();
    });
  });

  it('should handle reject all cookies', async () => {
    const onReject = vi.fn();

    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
      onReject,
    });

    await waitFor(() => {
      const rejectButton = screen.getByRole('button', { name: 'Reject All' });
      expect(rejectButton).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reject All' }));

    await waitFor(() => {
      expect(onReject).toHaveBeenCalled();
    });
  });

  it('should use custom text for buttons', async () => {
    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
      acceptAllButtonText: 'Custom Accept',
      rejectAllButtonText: 'Custom Reject',
    });

    await waitFor(() => {
      const acceptButton = screen.getByRole('button', { name: 'Custom Accept' });
      const rejectButton = screen.getByRole('button', { name: 'Custom Reject' });
      expect(acceptButton).toBeInTheDocument();
      expect(rejectButton).toBeInTheDocument();
    });
  });

  it('should show preferences button when preferences are set', async () => {
    vi.spyOn(cookieManager, 'getCookiePreferences').mockReturnValue({ necessary: true });

    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
    });

    await waitFor(() => {
      const preferencesButton = screen.getByText('Manage Cookie Preferences');
      expect(preferencesButton).toBeInTheDocument();
    });
  });

  it('should open banner when preferences button is clicked', async () => {
    vi.spyOn(cookieManager, 'getCookiePreferences').mockReturnValue({ necessary: true });

    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
    });

    await waitFor(() => {
      const preferencesButton = screen.getByText('Manage Cookie Preferences');
      expect(preferencesButton).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Manage Cookie Preferences'));

    await waitFor(() => {
      const bannerTitle = screen.getByText('Cookie Settings');
      expect(bannerTitle).toBeInTheDocument();
    });
  });


  it('should toggle details when "Show Details" is clicked', async () => {
    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
    });

    // const user = userEvent.setup()

    await waitFor(() => {
      const banner = screen.getByTestId('cookie-banner');
      expect(banner).toBeInTheDocument();
    });

   waitFor(() => {
      const detailsButton = screen.getByText('Show Details');
      fireEvent.click(detailsButton);
      const detailsButton2 =  screen.findByText('Hide Details');
      fireEvent.click(detailsButton2);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('cookie-options')).not.toBeInTheDocument();
    });
  });


  it('should save preferences when "Save Preferences" is clicked', async () => {
    const onPreferenceChange = vi.fn();
    vi.spyOn(cookieManager, 'setCookiePreferences').mockImplementation(() => {});

    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
      onPreferenceChange,
    });

    const detailsButton = await screen.findByText('Show Details');
    fireEvent.click(detailsButton);

    await waitFor(() => {
      const cookieOptions = screen.getByTestId('cookie-options');
      expect(cookieOptions).toBeInTheDocument();
    });

    const functionalityCheckbox = screen.getByLabelText('Functionality');
    fireEvent.click(functionalityCheckbox);

    const saveButton = screen.getByText('Save Preferences');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(cookieManager.setCookiePreferences).toHaveBeenCalled();
      expect(onPreferenceChange).toHaveBeenCalled();
    });
  });
  


  it('should apply custom color mode', async () => {
    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
      colorMode: 'dark',
    });
  
    await waitFor(() => {
      const container = document.getElementById('cookie-banner-container');
      expect(container.classList.contains('force-dark')).toBe(true);
    });
  });
  
  it('should position the banner correctly', async () => {
    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
      position: 'bottom-left',
    });
  
    await waitFor(() => {
      const banner = screen.getByTestId('cookie-banner');
      expect(banner.classList.contains('bottom-left')).toBe(true);
    });
  });
  
  it('should handle Google Analytics integration', async () => {
    const onAccept = vi.fn();
  
    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
      googleAnalytics: {
        enabled: true,
        id: 'UA-XXXXXXXX-X',
        category: 'analytics',
      },
      onAccept,
    });
  
    await waitFor(() => {
      const acceptButton = screen.getByRole('button', { name: 'Accept All' });
      fireEvent.click(acceptButton);
    });
  
    expect(onAccept).toHaveBeenCalled();
  });
  
  it('should handle custom cookie types', async () => {
    CookieBannerWidget.init({
      containerId: 'cookie-banner-container',
      language: 'en',
      cookieTypes: {
        custom: {
          title: 'Custom Cookies',
          description: 'These are custom cookies',
        },
      },
    });
  
    await waitFor(() => {
      const detailsButton = screen.getByText('Show Details');
      fireEvent.click(detailsButton);
    });
  
    await waitFor(() => {
      const detailsContent = screen.getByTestId('cookie-options');
      expect(detailsContent).toBeInTheDocument();
    }, { timeout: 2000 });
  
    const customCookieTitle = screen.getByText('Custom Cookies');
    expect(customCookieTitle).toBeInTheDocument();
    const customCookieDescription = screen.getByText('These are custom cookies');
    expect(customCookieDescription).toBeInTheDocument();
  }, { timeout: 5000 });

});