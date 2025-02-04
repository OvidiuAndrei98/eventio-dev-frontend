'use client'
import { Button } from 'antd'
import './MobileNav.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const MobileNav = () => {
  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 50)
    })
  }, [])

  const toggleMenu = () => {
    document.querySelector('.bar').classList.toggle('animate')
    document.querySelector('.mobile-menu').classList.toggle('active')
  }

  return (
    <>
      <div
        className={`hamburger-menu ${scroll ? 'fixed' : ''}`}
        onClick={toggleMenu}
      >
        <div className="bar"></div>
        <div className="logo">EVENTIO</div>
      </div>

      <nav className="mobile-menu">
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
        <Button className="login-button" size="large" type="primary">
          Intra in cont
        </Button>
      </nav>
    </>
  )
}

export default MobileNav
