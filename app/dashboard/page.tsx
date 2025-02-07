'use client'

import MenuItem from 'antd/es/menu/MenuItem'
import '../../styles/globals.css'
import {
  ContainerOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { Button, Menu, MenuProps } from 'antd'
import { useState } from 'react'

type MenuItem = Required<MenuProps>['items'][number]

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: 'Option 1' },
    { key: '2', icon: <DesktopOutlined />, label: 'Option 2' },
    { key: '3', icon: <ContainerOutlined />, label: 'Option 3' },
  ]

  return (
    <div className="dashboard-container">
      <div>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ marginBottom: 16 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>
      <div className="dashboard-content">
        <h1>Bine ai venit</h1>
        <div className="dashboard-content-container"></div>
      </div>
    </div>
  )
}

export default DashboardPage
