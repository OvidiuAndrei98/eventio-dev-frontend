'use client'

import { Divider } from 'antd'
import './Footer.css'
import {
  FacebookOutlined,
  InstagramOutlined,
  TikTokOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'

const Footer = () => {
  return (
    <div className="footer-section">
      <span className="footer-title">EVENTIO</span>
      <div className="items-container">
        <ul>
          <li className="sectio-title">Contactează-ne</li>
          <li>contact@eventio.ro</li>
          <li>0741448733</li>
        </ul>
        <ul>
          <li className="sectio-title">Contactează-ne</li>
          <li>contact@eventio.ro</li>
          <li>0741448733</li>
        </ul>
        <ul>
          <li className="sectio-title">Contactează-ne</li>
          <li>contact@eventio.ro</li>
          <li>0741448733</li>
        </ul>
      </div>
      <Divider />
      <div className="socials">
        <InstagramOutlined />
        <FacebookOutlined />
        <TikTokOutlined />
        <WhatsAppOutlined />
      </div>
      <Divider />
      <span className="credits">
        Copyrights © 2025. Toate drepturile rezervate
      </span>
    </div>
  )
}

export default Footer
