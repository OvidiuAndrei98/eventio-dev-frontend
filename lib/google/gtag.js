export const grantConsent = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
    console.log('GA Consent Updated: GRANTED.');

    localStorage.setItem('cookie_consent', 'granted');
  }
};

export const denyConsent = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
    localStorage.setItem('cookie_consent', 'denied');
  }
};
