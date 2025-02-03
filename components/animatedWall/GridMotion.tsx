'use client'

import { MutableRefObject, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './GridMotion.css'

const GridMotion = ({
  items = [],
  gradientColor = 'black',
}: {
  items: any[] // eslint-disable-line
  gradientColor: string
}) => {
  const gridRef = useRef(null)
  const rowRefs = useRef<HTMLDivElement[]>([]) as MutableRefObject<
    HTMLDivElement[]
  > // Array of refs for each row

  const mouseXRef = useRef(1200)

  // Ensure the grid has 28 items (4 rows x 7 columns) by default
  const totalItems = 12
  const defaultItems = Array.from(
    { length: totalItems },
    (_, index) => `Item ${index + 1}`
  )
  const combinedItems =
    items.length > 0 ? items.slice(0, totalItems) : defaultItems

  useEffect(() => {
    if (typeof window == 'undefined') {
      return
    }

    gsap.ticker.lagSmoothing(0)

    mouseXRef.current = window.innerWidth

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX
    }

    const updateMotion = () => {
      const maxMoveAmount = 300
      const baseDuration = 0.8 // Base duration for inertia
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2] // Different inertia for each row, outer rows slower

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1
          const moveAmount =
            ((mouseXRef.current / window.innerWidth) * maxMoveAmount -
              maxMoveAmount / 2) *
            direction

          // Apply inertia and staggered stop
          gsap.to(row, {
            x: moveAmount,
            duration:
              baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      })
    }

    const removeAnimationLoop = gsap.ticker.add(updateMotion)

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      removeAnimationLoop() // Properly remove the ticker listener
    }
  }, [])

  return (
    <div className="noscroll loading" ref={gridRef}>
      <section
        className="intro"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div className="gridMotion-container">
          {[...Array(3)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="row"
              ref={(el: HTMLDivElement) => (rowRefs.current[rowIndex] = el)} // Set each row's ref
            >
              {[...Array(6)].map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex]
                return (
                  <div key={itemIndex} className="row__item">
                    <div
                      className="row__item-inner"
                      style={{ backgroundColor: '#111' }}
                    >
                      {typeof content === 'string' &&
                      content.startsWith('https') ? (
                        <div
                          className="row__item-img"
                          style={{
                            backgroundImage: `url(${content})`,
                          }}
                        ></div>
                      ) : (
                        <div className="row__item-content">{content}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="fullview"></div>
      </section>
    </div>
  )
}

export default GridMotion
