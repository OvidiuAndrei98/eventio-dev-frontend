'use client'
import '../../styles/globals.css'
import './mock.css'

import {
  ContainerOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Button, ConfigProvider, Menu, MenuProps } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type MenuItem = Required<MenuProps>['items'][number]

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [activePath, setActivePath] = useState('dashboard')
  const router = useRouter()
  const pathname = usePathname()
  const BASEPATH = '/dashboard'

  useEffect(() => {
    const pathList = pathname.split('/')
    // Get the last path element
    setActivePath(pathList.pop() ?? 'dashboard')
  }, [pathname])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const handleSideMenuNavigation = (info: any) => {
    // eslint-disable-line
    if (info.key === 'dashboard') {
      router.push(BASEPATH)
    } else {
      router.push(BASEPATH + `/${info.key}`)
    }
  }

  const items: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <PieChartOutlined />,
      label: 'Panou de control',
      onClick: handleSideMenuNavigation,
    },
    {
      key: 'response',
      icon: <DesktopOutlined />,
      label: 'Raspunsuri',
      onClick: handleSideMenuNavigation,
    },
    { key: '3', icon: <ContainerOutlined />, label: 'Statistici' },
    { key: '4', icon: <ContainerOutlined />, label: 'Organizare' },
    {
      key: '5',
      icon: <ContainerOutlined />,
      label: 'Iesi din cont',
      onClick: () => {
        router.push('/')
      },
    },
  ]

  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: { colorPrimary: '#b46acb' },
              components: {
                Button: {
                  colorPrimary: '#b46acb',
                  colorPrimaryBorderHover: '#b46acb',
                  colorTextLightSolid: 'white',
                },
              },
            }}
          >
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
                    selectedKeys={[activePath]}
                    defaultSelectedKeys={[activePath]}
                    mode="inline"
                    inlineCollapsed={collapsed}
                    items={items}
                  />
                </div>
                <div className="dashboard-content">
                  <h1>Bine ai venit</h1>
                  <div className="dashboard-content-container">{children}</div>
                </div>
              </div>
            </div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default DashboardLayout
