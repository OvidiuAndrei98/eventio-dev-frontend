'use client';
import { Button } from 'antd';
import './MobileNav.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PlanyviteLogo from '@/public/planyvite_logo.svg';
import Image from 'next/image';

const MobileNav = () => {
  const [scroll, setScroll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    const handleBodyClick = (event) => {
      const menuContainer = document.getElementById('hamburger-menu-container');
      const bar = document.querySelector('.bar');
      const mobileMenu = document.querySelector('.mobile-menu');

      // If click is outside the hamburger menu and nav items, close menu
      if (
        !menuContainer.contains(event.target) &&
        !event.target.closest('.nav-item')
      ) {
        bar?.classList.remove('animate');
        mobileMenu?.classList.remove('active');
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.body.addEventListener('click', handleBodyClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent body click from firing
    document.querySelector('.bar').classList.toggle('animate');
    document.querySelector('.mobile-menu').classList.toggle('active');
  };

  return (
    <>
      <div
        className={`hamburger-menu ${
          scroll ? 'fixed' : ''
        } flex items-center gap-2`}
        id="hamburger-menu-container"
        onClick={toggleMenu}
      >
        <div className="bar z-[1103] ml-[20px]"></div>
        <Image
          src={PlanyviteLogo}
          alt="Planyvite Logo"
          className="logo"
          width={120}
          height={50}
        />
      </div>

      <nav className="mobile-menu z-[1001]">
        <ul className="homepage-nav-menu">
          <li className="nav-item">
            <Link href="#first-section">Acasa</Link>
          </li>
          <li className="nav-item">
            <Link scroll={false} href="#concept-section">
              Concept
            </Link>
          </li>
          <li className="nav-item">
            <Link scroll={false} href="#how-it-works-section">
              Cum functioneaza
            </Link>
          </li>
          <li className="nav-item">
            <Link scroll={false} href="#prices-section">
              Preturi
            </Link>
          </li>
          <li className="nav-item">
            <Link scroll={false} href="#models-section">
              Modele
            </Link>
          </li>
        </ul>
        <Button
          className="login-button"
          size="large"
          type="primary"
          onClick={() => router.push('/login')}
        >
          Intra in cont
        </Button>
      </nav>
    </>
  );
};

export default MobileNav;
