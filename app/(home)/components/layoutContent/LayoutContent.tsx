'use client';

import React, { useEffect, useState } from 'react';
import HomeNavBar from '../navigation/HomeNavBar';
import MobileNav from '../navigation/MobileNav';
import { FloatButton } from 'antd';

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutContentProps) => {
  const [windowSize, setWindowSize] = useState<number>(0);

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
          {windowSize > 1024 ? <HomeNavBar /> : <MobileNav />}
          {children}
          <FloatButton.BackTop />
        </>
      )}
    </>
  );
};

export default LayoutContent;
