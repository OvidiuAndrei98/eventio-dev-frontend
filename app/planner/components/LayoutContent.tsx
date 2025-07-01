'use client';

import React, { useEffect, useState } from 'react';
import HeaderNav from './HeaderNav';

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
          <HeaderNav />
          {children}
        </>
      )}
    </>
  );
};

export default LayoutContent;
