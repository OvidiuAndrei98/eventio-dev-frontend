'use client';

import React, { useEffect, useState } from 'react';
import HomeNavBar from '../navigation/HomeNavBar';
import MobileNav from '../navigation/MobileNav';
import { FloatButton } from 'antd';
import Footer from '../navigation/Footer';

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutContentProps) => {
  const [windowSize, setWindowSize] = useState<number>(0);

  const menuItems = [
    { label: 'Acasa', link: '/' },
    { label: 'Planificator', link: '/planner', showOnlyOn: '/' },
    {
      label: 'Functionalitati',
      link: '#features-section',
      showOnlyOn: '/',
    },
    {
      label: 'Cum functioneaza',
      link: '#how-it-works-section-id',
      showOnlyOn: '/',
    },
    { label: 'Preturi', link: '#prices-section', showOnlyOn: '/' },
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

export default LayoutContent;
