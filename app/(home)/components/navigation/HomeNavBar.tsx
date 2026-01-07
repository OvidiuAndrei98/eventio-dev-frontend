'use client';

import { Button } from 'antd';
import './HomeNavBar.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlanyviteLogo from '@/public/planyvite_logo.svg';
import Image from 'next/image';

interface HomeNavBarProps {
  menuItems: { label: string; link: string }[];
}

const HomeNavBar = ({ menuItems }: HomeNavBarProps) => {
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
        {menuItems?.map((item) => (
          <li key={item.label} className="nav-item">
            <Link href={item.link}>{item.label}</Link>
          </li>
        ))}
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
