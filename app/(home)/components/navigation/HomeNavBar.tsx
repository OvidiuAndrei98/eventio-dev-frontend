'use client'

import { Button } from 'antd'
import './HomeNavBar.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const HomeNavBar = () => {
  const [scroll, setScroll] = useState(false)
  const router = useRouter()

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 50)
    })
  }, [])

  return (
    <div className={`home-page-navigation ${scroll ? 'fixed' : ''}`}>
      <div className="logo">EVENTIO</div>
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
          {' '}
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
    </div>
  )
}

export default HomeNavBar
