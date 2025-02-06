'use client'
import { Button } from 'antd'
import './MobileNav.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const MobileNav = () => {
  const [scroll, setScroll] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window == 'undefined') {
      return
    }

    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 50)
    })

    document.body.addEventListener('click', (event) => {
      if (
        !['hamburger-menu ', 'bar', 'logo'].includes(event.target.className) &&
        !event.target.closest('.nav-item')
      ) {
        document.querySelector('.bar').classList.remove('animate')
        document.querySelector('.mobile-menu').classList.remove('active')
      }
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
        id="hamburger-menu-container"
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
  )
}

export default MobileNav
