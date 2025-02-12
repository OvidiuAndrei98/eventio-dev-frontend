'use client'

// import { Area } from '@ant-design/plots'
import ActivityChart from '../components/activityChart/ActivityChart'

const StatisticsPage = () => {
  const mockData = [
    {
      date: new Date(2025, 0, 1),
      value: Number((Math.random() * 10).toFixed()),
    },
    {
      date: new Date(2025, 0, 1),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 2),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 2),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 3),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 3),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 4),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 4),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 5),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 5),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 6),
      value: Math.random() * 10,
    },
    {
      date: new Date(2025, 0, 6),
      value: Math.random() * 10,
    },
  ]

  //   const config = {
  //     data: mockData,
  //     // xAxis field name
  //     xField: 'date',
  //     // yAxis field name
  //     yField: 'value',
  //     autoFit: true,
  //     smooth: true,
  //     scale: {
  //       color: 'red',
  //     },
  //     meta: {
  //       date: {
  //         range: [0, 1],
  //       },
  //       value: {
  //         min: 0,
  //       },
  //     },
  //     xAxis: {
  //       // Boolean type missing and it don't work with provided options
  //       label: false as any, // eslint-disable-line
  //       line: { style: { lineWidth: 0 } },
  //       grid: {
  //         line: { style: { lineWidth: 0 } },
  //       },
  //     },
  //     yAxis: {
  //       // Boolean type missing and it don't work with provided options
  //       label: false as any, // eslint-disable-line
  //       line: { style: { lineWidth: 0 } },
  //       grid: {
  //         line: { style: { lineWidth: 0 } },
  //       },
  //     },
  //     padding: 2,
  //   }

  return (
    <div>
      <div>
        <div>{/* <Area {...config} /> */}</div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div>
        <ActivityChart />
      </div>
      <div>
        <div></div>
      </div>
    </div>
  )
}

export default StatisticsPage
