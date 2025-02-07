'use client'

import MenuItem from 'antd/es/menu/MenuItem'
import '../../styles/globals.css'
import './mock.css'
import {
  ContainerOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { Button, Menu, MenuProps } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type MenuItem = Required<MenuProps>['items'][number]

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false)

  const router = useRouter()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: 'Option 1' },
    { key: '2', icon: <DesktopOutlined />, label: 'Option 2' },
    { key: '3', icon: <ContainerOutlined />, label: 'Option 3' },
    {
      key: '4',
      icon: <ContainerOutlined />,
      label: 'Iesi din cont',
      onClick: () => {
        router.push('/')
      },
    },
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">Dashboard &gt; menu</div>
      <div className="dashboard-inner-container">
        <div className="nav-container">
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
          <div className="dashboard-content-container">
            <div className="content-left">
              <div className="left-card"></div>
            </div>
            <div className="content-right">
              <div className="dashboard-card"></div>
              <div className="dashboard-card"></div>
              <div className="dashboard-card"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
