'use client';
import { useState, useEffect } from 'react';
import { denyConsent, grantConsent } from '@/lib/google/gtag';
import { Button } from 'antd';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Verifică dacă utilizatorul a luat deja o decizie
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'granted' && consent !== 'denied') {
      setIsVisible(true);
    } else if (consent === 'granted') {
      // Dacă consimțământul a fost dat, trimite imediat update-ul la GTM
      // la fiecare încărcare a paginii pentru a menține starea.
      sendConsentUpdate('granted');
    }
  }, []);

  const sendConsentUpdate = (status: string) => {
    // Aici trimitem datele către Data Layer
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'consent_update_event', // Numele evenimentului pe care îl vom folosi în GTM
        consent_status: status, // 'granted' sau 'denied'
        ad_storage: status,
        analytics_storage: status,
      });
      console.log(`GTM Consent Update Sent: ${status}`);
    }
    localStorage.setItem('cookie_consent', status);
    setIsVisible(false);
  };

  const handleAccept = () => {
    sendConsentUpdate('granted');
  };

  const handleDeny = () => {
    sendConsentUpdate('denied');
  };

  if (!isVisible) return null;
  return (
    <div className="fixed bottom-4 left-4 bg-[var(--primary-color)]/90 p-4 rounded shadow-lg flex flex-row gap-4 z-50 justify-center items-center color-white max-w-lg">
      <p>
        Folosim cookie-uri pentru a îmbunătăți experiența. Prin acceptare, ne
        permiteți să colectăm date de analiză.
      </p>
      <Button onClick={handleAccept}>Accept</Button>
      <Button onClick={handleDeny}>Refuz</Button>
    </div>
  );
}
