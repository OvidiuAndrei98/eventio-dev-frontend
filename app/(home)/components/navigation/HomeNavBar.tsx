'use client';

import { Button } from 'antd';
import './HomeNavBar.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlanyviteLogo from '@/public/planyvite_logo.svg';
import Image from 'next/image';

const HomeNavBar = () => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 50);
    });
  }, []);

  return (
    <div className={`home-page-navigation ${scroll ? 'fixed' : ''}`}>
      <div>
        <Image src={PlanyviteLogo} alt="logo" width={140} height={140} />
      </div>
      <ul className="homepage-nav-menu">
        <li className="nav-item">
          <Link href="#first-section">Acasă</Link>
        </li>
        <li className="nav-item">
          <Link href="#planner-section">Planificator</Link>
        </li>
        <li className="nav-item">
          <Link href="#features-section">Funcționalități</Link>
        </li>
        <li className="nav-item">
          <Link href="#how-it-works-section-id">Cum funcționează</Link>
        </li>
        <li className="nav-item">
          <Link href="#prices-section">Prețuri</Link>
        </li>
        <li className="nav-item">
          <Link href="#models-section">Modele</Link>
        </li>
        <li className="nav-item">
          <Link href="https://expo.planyvite.ro">Furnizori</Link>
        </li>
      </ul>
      <Button
        className="login-button !p-5 !text-md !font-bold !rounded-full !text-white"
        size="large"
        type="primary"
        onClick={() => {
          window.location.href = '/login';
        }}
      >
        Intră în cont
      </Button>
    </div>
  );
};

export default HomeNavBar;
