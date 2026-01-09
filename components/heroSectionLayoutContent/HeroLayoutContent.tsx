'use client';

import React, { useEffect, useState } from 'react';
import { FloatButton } from 'antd';
import HomeNavBar from '@/app/(home)/components/navigation/HomeNavBar';
import MobileNav from '@/app/(home)/components/navigation/MobileNav';
import Footer from '@/app/(home)/components/navigation/Footer';

interface HeroLayoutContentProps {
  children: React.ReactNode;
}

const HeroLayoutContent = ({ children }: HeroLayoutContentProps) => {
  const [windowSize, setWindowSize] = useState<number>(0);

  const menuItems = [
    { label: 'Acasa', link: '/' },
    {
      label: 'Functionalitati',
      link: '#features-section',
      showOnlyOn: '/invitatii-digitale',
    },
    {
      label: 'Preview',
      link: '#templates-section',
      showOnlyOn: '/invitatii-digitale',
    },
    {
      label: 'Preturi',
      link: '#prices-section',
      showOnlyOn: '/invitatii-digitale',
    },
    { label: 'Modele', link: '/modele' },
  ];

  useEffect(() => {
    if (typeof window != 'undefined') {
      // Set initial value of window witth
      setWindowSize(window.innerWidth);

      window.addEventListener('resize', () => {
        setWindowSize(window.innerWidth);
      });
    }
  }, []);

  return (
    <>
      {!windowSize ? (
        <div className="loader"></div>
      ) : (
        <>
          {windowSize > 1024 ? (
            <HomeNavBar menuItems={menuItems} />
          ) : (
            <MobileNav menuItems={menuItems} />
          )}
          {children}
          <Footer menuItems={menuItems} />
          <FloatButton.BackTop />
        </>
      )}
    </>
  );
};

export default HeroLayoutContent;
