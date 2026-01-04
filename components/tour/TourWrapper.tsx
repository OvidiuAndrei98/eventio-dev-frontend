'use client';

import { TourService } from '@/lib/tour/tour-service';
import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface Props {
  tourId: string;
  steps: Step[];
  forceRun?: boolean; // Prop nou pentru pornire manuală
  onTourEnd?: () => void; // Callback pentru a reseta starea butonului din pagină
}

export const TourWrapper = ({ tourId, steps, forceRun, onTourEnd }: Props) => {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Verificăm dacă pornim automat SAU dacă s-a apăsat butonul de restart
    if (!TourService.isCompleted(tourId) || forceRun) {
      setRun(true);
    }
  }, [tourId, forceRun]); // Re-execută dacă forceRun se schimbă

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      TourService.setCompleted(tourId);
      setRun(false);
      if (onTourEnd) onTourEnd(); // Anunțăm pagina că turul s-a oprit
    }
  };

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps.map((s, i) => ({
        ...s,
        disableBeacon: i === 0 ? true : s.disableBeacon,
      }))}
      run={run}
      continuous
      showSkipButton
      callback={handleCallback}
      styles={{ options: { primaryColor: '#CB92D9', zIndex: 10000 } }}
      locale={{
        back: 'Inapoi',
        close: 'Inchide',
        last: 'Finalizare',
        next: 'Inainte',
        skip: 'Omite',
      }}
    />
  );
};
