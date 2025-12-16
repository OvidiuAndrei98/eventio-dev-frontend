'use client';
import { useState, useEffect } from 'react';
import { Button } from 'antd';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'granted' && consent !== 'denied') {
      setIsVisible(true);
    } else if (consent === 'granted') {
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
    <div className="fixed bottom-4 bg-[var(--primary-color)]/90 p-4 rounded shadow-lg flex flex-col md:flex-row gap-4 z-50 justify-center items-center color-white max-w-[90%] left-0 right-0 mx-auto md:right-4 md:mx-4 md:left-4 md:max-w-lg">
      <p>
        Folosim cookie-uri pentru a îmbunătăți experiența. Prin acceptare, ne
        permiteți să colectăm date de analiză.
      </p>
      <div className="flex flex-row gap-4 md:flex-col">
        <Button onClick={handleAccept}>Accept</Button>
        <Button onClick={handleDeny}>Refuz</Button>
      </div>
    </div>
  );
}
