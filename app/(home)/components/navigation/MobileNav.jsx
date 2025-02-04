'use client'
import { Button } from 'antd'
import './MobileNav.css'
import { useEffect, useState } from 'react'

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
          <li className="nav-item">Acasa</li>
          <li className="nav-item">Concept</li>
          <li className="nav-item">Cum functioneaza</li>
          <li className="nav-item">Preturi</li>
          <li className="nav-item">Modele</li>
        </ul>
        <Button className="login-button" size="large" type="primary">
          Intra in cont
        </Button>
      </nav>
    </>
  )
}

export default MobileNav
