'use client'
import { MutableRefObject, useRef } from 'react'
import './SpotlightCard.css'

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.25)',
}: {
  children: JSX.Element
  className: string
  spotlightColor: string
}) => {
  const divRef = useRef<HTMLDivElement>(
    null
  ) as MutableRefObject<HTMLDivElement>

  const handleMouseMove = (e: MouseEvent) => {
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    divRef.current.style.setProperty('--mouse-x', `${x}px`)
    divRef.current.style.setProperty('--mouse-y', `${y}px`)
    divRef.current.style.setProperty('--spotlight-color', spotlightColor)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
      className={`card-spotlight ${className}`}
    >
      {children}
    </div>
  )
}

export default SpotlightCard
