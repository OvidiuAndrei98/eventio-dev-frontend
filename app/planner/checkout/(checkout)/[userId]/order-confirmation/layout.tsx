import React from 'react';
import Image from 'next/image';
import Logo from '@/public/planyvite_logo.svg';
import '@/styles/globals.css';

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutPage = ({ children }: LayoutContentProps) => {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow z-50 flex items-center px-4">
        <div className="flex-1 flex justify-center">
          <div className="font-bold text-2xl tracking-wide cursor-pointer">
            <Image src={Logo} alt="Planyvite Logo" width={140} height={40} />
          </div>
        </div>
      </nav>
      {children}
    </>
  );
};

export default LayoutPage;
