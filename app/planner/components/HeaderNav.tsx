import React, { useEffect, useState } from 'react';
import Logo from '@/public/planyvite_logo.svg'; // Adjust the path as necessary
import Image from 'next/image';

const HeaderNav: React.FC = () => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <nav
      className={`absolute top-0 z-20 w-full flex items-center h-16 px-6 transition-all duration-300 ${
        scroll
          ? 'fixed top-0 left-0 w-full shadow-lg z-50 bg-white/30 backdrop-blur-md'
          : 'bg-[#B36BCB]'
      }`}
    >
      <div className="flex-1 flex justify-center">
        <div className="font-bold text-2xl tracking-wide cursor-pointer">
          <Image src={Logo} alt="Planyvite Logo" width={140} height={40} />
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
