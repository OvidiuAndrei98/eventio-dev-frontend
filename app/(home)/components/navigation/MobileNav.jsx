'use client';
import { Button } from 'antd';
import './MobileNav.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlanyviteLogo from '@/public/planyvite_logo.svg';
import Image from 'next/image';

const MobileNav = () => {
  const [scroll, setScroll] = useState(false);

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

      // Dacă click-ul este în afara meniului hamburger și a elementelor de navigație, închide meniul
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
    e.stopPropagation(); // Previne declanșarea click-ului pe body
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
          alt="Sigla Planyvite"
          className="logo"
          width={120}
          height={50}
        />
      </div>

      <nav className="mobile-menu z-[1001]">
        <ul className="homepage-nav-menu">
          <li className="nav-item">
            <Link className="w-full block" href="#first-section">
              Acasă
            </Link>
          </li>
          <li className="nav-item">
            <Link className="w-full block" href="#planner-section">
              Planificator
            </Link>
          </li>
          <li className="nav-item">
            <Link className="w-full block" href="#features-section">
              Funcționalități
            </Link>
          </li>
          <li className="nav-item">
            <Link href="#how-it-works-section-id">Cum funcționează</Link>
          </li>
          <li className="nav-item">
            <Link className="w-full block" href="#prices-section">
              Prețuri
            </Link>
          </li>
          <li className="nav-item">
            <Link className="w-full block" href="#models-section">
              Modele
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="w-full block"
              href="https://expo.planyvite.ro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Furnizori
            </Link>
          </li>
        </ul>
        <Button
          className="login-button"
          size="large"
          type="primary"
          onClick={() => {
            window.location.href = '/login';
          }}
        >
          Intră în cont
        </Button>
      </nav>
    </>
  );
};

export default MobileNav;
