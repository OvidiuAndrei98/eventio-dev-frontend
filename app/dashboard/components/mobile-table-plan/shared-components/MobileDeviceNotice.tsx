'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Smartphone } from 'lucide-react';

const MobileDeviceNotice = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificăm dacă suntem pe mobil
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    // Verificăm dacă a mai văzut anunțul în această sesiune
    const hasSeenNotice = sessionStorage.getItem('hasSeenMobileNotice');

    if (isMobile && !hasSeenNotice) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenMobileNotice', 'true');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[90%] rounded-xl">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="bg-amber-100 p-3 rounded-full mb-2">
            <Smartphone className="h-8 w-8 text-amber-600" />
          </div>
          <AlertDialogTitle className="text-xl">
            Modul Interactiv Limitat
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Platforma a detectat că ești pe un dispozitiv mobil.
            <br />
            <br />
            Modul <span className="font-bold">Canvas Interactiv</span>{' '}
            (aranjarea meselor prin drag-and-drop) nu este disponibil pe mobil
            (În curând). Pentru experiența completă de design, te rugăm să
            accesezi contul de pe un{' '}
            <span className="font-bold">calculator sau laptop</span>.
            <br />
            <br />
            Poți continua pe mobil folosind{' '}
            <span className="font-bold">Modul Listă</span> pentru a gestiona
            invitații.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleClose}
            className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] h-12 text-lg"
          >
            Am înțeles, continuă
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MobileDeviceNotice;
