'use client';

import { Button } from 'antd';
import './HomeNavBar.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PlanyviteLogo from '@/public/planyvite_logo.svg';
import Image from 'next/image';

const HomeNavBar = () => {
  const [scroll, setScroll] = useState(false);
  const router = useRouter();

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
          <Link href="#first-section">Acasa</Link>
        </li>
        <li className="nav-item">
          <Link href="#planner-section">Planificator</Link>
        </li>
        <li className="nav-item">
          <Link href="#features-section">Functionalitati</Link>
        </li>
        <li className="nav-item">
          <Link href="#how-it-works-section-id">Cum functioneaza</Link>
        </li>
        <li className="nav-item">
          <Link href="#prices-section">Preturi</Link>
        </li>
        <li className="nav-item">
          <Link href="#models-section">Modele</Link>
        </li>
      </ul>
      <Button
        className="login-button !p-5 !text-md !font-bold !rounded-full !text-white"
        size="large"
        type="primary"
        onClick={() => router.push('/login')}
      >
        Intra in cont
      </Button>
    </div>
  );
};

export default HomeNavBar;
