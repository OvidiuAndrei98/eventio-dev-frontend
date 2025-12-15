'use client';
import { useState, useEffect } from 'react';
import { denyConsent, grantConsent } from '@/lib/google/gtag';
import { Button } from 'antd';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'granted' && consent !== 'denied') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    grantConsent();
    setIsVisible(false);
  };

  const handleRefuse = () => {
    denyConsent();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-[var(--primary-color)]/90 p-4 rounded shadow-lg flex flex-row gap-4 z-50 justify-center items-center color-white max-w-lg">
      <p>
        Folosim cookie-uri pentru a îmbunătăți experiența. Prin acceptare, ne
        permiteți să colectăm date de analiză.
      </p>
      <Button onClick={handleAccept}>Accept</Button>
      <Button onClick={handleRefuse}>Refuz</Button>
    </div>
  );
}
