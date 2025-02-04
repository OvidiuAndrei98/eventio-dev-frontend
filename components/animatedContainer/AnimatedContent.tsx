'use client'

import { useRef, useEffect, useState, MutableRefObject } from 'react'
import { useSpring, animated } from '@react-spring/web'

const AnimatedContent = ({
  children,
  distance = 100,
  direction,
  reverse = false,
  config = { tension: 50, friction: 25 },
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  classNamme,
}: {
  children: JSX.Element
  distance: number
  direction: 'vertical' | 'horizontal'
  reverse: boolean
  config: { tension: number; friction: number }
  initialOpacity: number
  animateOpacity: boolean
  scale: number
  threshold: number
  classNamme?: string
}) => {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current)
        }
      },
      { threshold }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold])

  const directions = {
    vertical: 'Y',
    horizontal: 'X',
  }

  const springProps = useSpring({
    from: {
      transform: `translate${directions[direction]}(${
        reverse ? `-${distance}px` : `${distance}px`
      }) scale(${scale})`,
      opacity: animateOpacity ? initialOpacity : 1,
    },
    to: inView
      ? { transform: 'translateY(0px) scale(1)', opacity: 1 }
      : undefined,
    config,
  })

  return (
    <animated.div className={classNamme ?? ''} ref={ref} style={springProps}>
      {children}
    </animated.div>
  )
}

export default AnimatedContent
