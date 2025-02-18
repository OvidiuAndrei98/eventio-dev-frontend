'use client'

import './Statistics.css'
import ActivityChart from '../components/activityChart/ActivityChart'
import AreaCustomChart from './components/AreaCustomChart'
import { PieCustomChart } from './components/PieCustomChart'
import { useEffect, useState } from 'react'

const StatisticsPage = () => {
  const [shrinkElement, setShrinkElement] = useState(false)

  useEffect(() => {
    const element = document.querySelector('.dashboard-statistics-container')
    if (element) {
      const observer = new ResizeObserver((entries) => {
        const e = entries[0] // should be only one
        if (e.contentRect.width < 1024) {
          setShrinkElement(true)
        } else {
          setShrinkElement(false)
        }
      })

      // start listening for size changes
      observer.observe(element)
    }
  }, [])

  return (
    <div className="dashboard-statistics-container">
      <div
        className={`flex w-full gap-4 flex-${shrinkElement ? 'col' : 'row'}`}
      >
        <div className="w-full">
          <AreaCustomChart
            xAxisKey={'month'}
            yAxisKey={'value'}
            color="blue"
            label="Raspunsuri"
            title="Raspunsuri"
            description="Raspunsuri pe ultima saptamana"
          />
        </div>
        <div className="w-full">
          <AreaCustomChart
            xAxisKey={'month'}
            yAxisKey={'value'}
            color="green"
            label="Confirmari"
            title="Confirmari"
            description="Confirmari pe ultima saptamana"
          />
        </div>
        <div className="w-full">
          <AreaCustomChart
            xAxisKey={'month'}
            yAxisKey={'value'}
            color="red"
            label="Refuzuri"
            title="Refuzuri"
            description="Refuzuri pe ultima saptamana"
          />
        </div>
        <div className="w-full">
          <AreaCustomChart
            xAxisKey={'month'}
            yAxisKey={'value'}
            color="yellow"
            label="Vizualizari"
            title="Vizualizari"
            description="Vizualizari pe ultima saptamana"
          />
        </div>
      </div>
      <ActivityChart />
      <div>
        <div>
          <PieCustomChart />
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage
