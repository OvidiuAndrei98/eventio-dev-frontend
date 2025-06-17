'use client';

import { Divider } from 'antd';
import './Footer.css';
import {
  FacebookOutlined,
  InstagramOutlined,
  TikTokOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import PlanyviteLogo from '@/public/planyvite_logo.svg';

const Footer = () => {
  return (
    <div
      className="flex flex-col items-center py-8 mx-auto my-8 rounded-2xl shadow-lg"
      style={{
        backgroundColor: '#E5CFE6',
        color: 'white',
        width: '95%',
      }}
    >
      <Image
        src={PlanyviteLogo}
        alt="Planyvite Logo"
        width={200}
        height={80}
        className="mb-6"
      />
      <div className="flex flex-col md:flex-row justify-around w-full max-w-4xl mb-6 gap-6">
        <ul className="text-center space-y-1">
          <li
            className="font-semibold text-lg md:text-xl"
            style={{ color: 'white' }}
          >
            Contactează-ne
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors">
            PLANYVITE S.R.L.
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors">
            contact@planyvite.ro
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors">
            +40741448739
          </li>
        </ul>
        <ul className="text-center space-y-1">
          <li
            className="font-semibold text-lg md:text-xl"
            style={{ color: 'white' }}
          >
            Link-uri
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors cursor-pointer">
            Acasa
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors cursor-pointer">
            Modele
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors cursor-pointer">
            Preturi
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors cursor-pointer">
            Cum functioneaza
          </li>
        </ul>
        <ul className="text-center space-y-1">
          <li
            className="font-semibold text-lg md:text-xl"
            style={{ color: 'white' }}
          >
            Legal
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors cursor-pointer">
            Termeni și condiții
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors cursor-pointer">
            Politica de confidențialitate
          </li>
          <li className="text-[#797687] hover:text-[var(--primary-color)] transition-colors cursor-pointer">
            Politica de cookies
          </li>
        </ul>
      </div>
      <Divider
        className="w-full"
        style={{ borderColor: 'rgba(255,255,255,0.3)' }}
      />
      <div
        className="flex justify-center items-center gap-4 text-2xl my-4"
        style={{ color: 'black', cursor: 'pointer' }}
      >
        <InstagramOutlined />
        <FacebookOutlined />
        <TikTokOutlined />
        <WhatsAppOutlined />
      </div>
      <Divider
        className="w-full"
        style={{ borderColor: 'rgba(255,255,255,0.3)' }}
      />
      <div className="flex flex-row items-center mt-4 text-sm">
        <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="nofollow">
          <Image
            src="/anpc-sal.png"
            alt="Solutionarea Alternativa a Litigiilor"
            className="w-[100px] h-[30px] md:w-[200px] md:h-[50px]"
            width={200}
            height={50}
          />
        </a>
        <br />
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="nofollow"
        >
          <Image
            className="w-[100px] h-[30px] md:w-[200px] md:h-[50px]"
            src="/anpc-sol.png"
            alt="Solutionarea Online a Litigiilor"
            width={200}
            height={50}
          />
        </a>
      </div>
      <div
        className="flex flex-col items-center mt-2 text-sm"
        style={{ color: 'white' }}
      >
        <span>Copyrights © 2025. Toate drepturile rezervate.</span>
        <span>
          Made by{' '}
          <a
            href="https://www.code-lab.ro/"
            className="font-bold !text-[var(--secondary-color)] !hover:text-[var(--primary-color)] transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            CodeLab
          </a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
