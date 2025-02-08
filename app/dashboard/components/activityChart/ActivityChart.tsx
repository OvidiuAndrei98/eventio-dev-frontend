'use client'

import { Area, AreaConfig } from '@ant-design/charts'

const ActivityChart = () => {
  const mockData = [
    {
      date: new Date(2025, 0, 1),
      value: Math.random() * 10,
      valueType: 'raspunsuri',
    },
    {
      date: new Date(2025, 0, 1),
      value: Math.random() * 10,
      valueType: 'vizualizari',
    },
    {
      date: new Date(2025, 0, 2),
      value: Math.random() * 10,
      valueType: 'raspunsuri',
    },
    {
      date: new Date(2025, 0, 2),
      value: Math.random() * 10,
      valueType: 'vizualizari',
    },
    {
      date: new Date(2025, 0, 3),
      value: Math.random() * 10,
      valueType: 'raspunsuri',
    },
    {
      date: new Date(2025, 0, 3),
      value: Math.random() * 10,
      valueType: 'vizualizari',
    },
    {
      date: new Date(2025, 0, 4),
      value: Math.random() * 10,
      valueType: 'raspunsuri',
    },
    {
      date: new Date(2025, 0, 4),
      value: Math.random() * 10,
      valueType: 'vizualizari',
    },
    {
      date: new Date(2025, 0, 5),
      value: Math.random() * 10,
      valueType: 'raspunsuri',
    },
    {
      date: new Date(2025, 0, 5),
      value: Math.random() * 10,
      valueType: 'vizualizari',
    },
    {
      date: new Date(2025, 0, 6),
      value: Math.random() * 10,
      valueType: 'raspunsuri',
    },
    {
      date: new Date(2025, 0, 6),
      value: Math.random() * 10,
      valueType: 'vizualizari',
    },
  ]

  const config: AreaConfig = {
    data: mockData,
    height: 300,
    xField: 'date',
    yField: 'value',
    seriesField: 'valueType',
    colorField: 'valueType',
    scale: {
      color: {
        range: ['#2f97b7', '#ff87cd'],
      },
    },
    autoFit: true,
    legend: {
      position: 'top',
    },
    shapeField: 'smooth',
    style: {
      opacity: 0.5,
    },
    stack: true,
  }

  return <Area {...config} />
}

export default ActivityChart
