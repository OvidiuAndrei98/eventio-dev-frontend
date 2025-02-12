'use client'

import { Tabs, TabsProps } from 'antd'
import './page.css'
import SummaryTable from './components/SummaryTable'
import ConfirmationsTable from './components/confirmationsTable/ConfirmationsTable'
import RefusalsTable from './components/refusalsTable/RefusalsTable'

const ResponsePage = () => {
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Sumar',
      children: <SummaryTable />,
    },
    {
      key: '2',
      label: 'Confirmari',
      children: <ConfirmationsTable />,
    },
    {
      key: '3',
      label: 'Refuzuri',
      children: <RefusalsTable />,
    },
  ]

  return (
    <div className="response-container">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default ResponsePage
