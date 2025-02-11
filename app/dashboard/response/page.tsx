'use client'

import { Tabs, TabsProps } from 'antd'
import './page.css'
import SummaryTable from './components/SummaryTable'

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
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ]

  return (
    <div className="response-container">
      <div>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  )
}

export default ResponsePage
