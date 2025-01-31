'use client'

import { Button } from 'antd'
import './HomeNavBar.css'
import { useEffect, useState } from 'react'

const HomeNavBar = () => {
  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 50)
    })
  }, [])

  return (
    <div className={`home-page-navigation ${scroll ? 'fixed' : ''}`}>
      <div className="logo">EVENTIO</div>
      <ul className="homepage-nav-menu">
        <li className="nav-item">Acasa</li>
        <li className="nav-item">Concept</li>
        <li className="nav-item">Cum functioneaza</li>
        <li className="nav-item">Preutri</li>
        <li className="nav-item">Modele</li>
      </ul>
      <Button className="login-button" size="large" type="primary">
        Intra in cont
      </Button>
    </div>
  )
}

export default HomeNavBar
