'use client'

import './Statistics.css'
import ActivityChart from '../components/activityChart/ActivityChart'
import AreaCustomChart from './components/AreaCustomChart'
import { PieCustomChart } from './components/PieCustomChart'

const StatisticsPage = () => {
  return (
    <div className="dashboard-statistics-container">
      <div className="rscc flex w-full gap-4">
        <div className="w-full">
          <AreaCustomChart />
        </div>
        <div className="w-full">
          <AreaCustomChart />
        </div>
        <div className="w-full">
          <AreaCustomChart />
        </div>
        <div className="w-full">
          <AreaCustomChart />
        </div>
      </div>
      <div className="dashboard-card  max-h-100">
        <div className="card-header mb-4">
          <div>
            <h3>Activitate</h3>
          </div>
        </div>
        <ActivityChart />
      </div>
      <div>
        <div>
          <PieCustomChart />
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage
