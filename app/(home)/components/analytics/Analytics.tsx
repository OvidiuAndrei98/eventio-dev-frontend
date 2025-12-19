'use client';
import { useEffect } from 'react';
import { addWebVisitLog } from '@/service/logs/addWebVisitLog';

export default function Analytics() {
  useEffect(() => {
    addWebVisitLog(crypto.randomUUID(), {
      source: 'homepage',
      referrer: document.referrer,
    }).catch((error) => {
      console.error('Error logging visit:', error);
    });
  }, []);

  return null;
}
