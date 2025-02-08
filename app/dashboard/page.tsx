'use client'

import MenuItem from 'antd/es/menu/MenuItem'
import '../../styles/globals.css'
import './mock.css'
import {
  ContainerOutlined,
  DesktopOutlined,
  FileExcelFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SendOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Menu, MenuProps } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmationCard from './components/confirmationCard/ConfirmationCard'
import ActivityChart from './components/activityChart/ActivityChart'
import Image from 'next/image'
import DemoImage from '../../public/landing-image.svg'
import TodoModal from '../../components/todoList/TodoModal'

type MenuItem = Required<MenuProps>['items'][number]

// Varianta abonomant

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [todoOpen, setTodoOpen] = useState(false)

  const router = useRouter()

  const onModalOk = () => {
    setTodoOpen(false)
  }

  const onModalClose = () => {
    setTodoOpen(false)
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: 'Panou de control' },
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
              <div className="left-card">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <h2>Andu si Narci</h2>
                  <span className="primary-color-text">Premium</span>
                </div>
                <Image alt="" src={DemoImage} width={150} />
                <Button icon={<SendOutlined />} type="primary">
                  Trimite Invitatia
                </Button>
                <div className="confirmations-left">
                  <div className="accepted dotted-card">
                    <span className="number">3</span>
                    <span className="text secondary-text-color-light">
                      Confirmari
                    </span>
                  </div>
                  <div className="declined dotted-card">
                    <span className="number">1</span>
                    <span className="text secondary-text-color-light">
                      Refuzuri
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-right">
              <div className="dashboard-card confirmations">
                <div className="card-header">
                  <div>
                    <h3>Raspunsuri</h3>
                    <span>Ultimele 5 rezultate</span>
                  </div>
                  <Button type="default">Vezi tot</Button>
                </div>
                <ConfirmationCard />
                <ConfirmationCard />
                <ConfirmationCard />
                <ConfirmationCard />
                <ConfirmationCard />
              </div>
              <div className="dashboard-card">
                <div className="card-header">
                  <div>
                    <h3>Activitate</h3>
                  </div>
                  <Button type="default">Vezi tot</Button>
                </div>
                <ActivityChart />
              </div>
              <div className="dashboard-card quick-actions">
                <h3>Actiuni rapide</h3>
                <div className="quick-actions-container">
                  <div className="dotted-card quick-card">
                    <span>Planificator Excel</span>
                    <Button icon={<FileExcelFilled />} />
                  </div>
                  <div className="dotted-card quick-card">
                    <span>Todo list</span>
                    <Button
                      icon={<UnorderedListOutlined />}
                      onClick={() => setTodoOpen(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TodoModal onClose={onModalClose} onOk={onModalOk} open={todoOpen} />
    </div>
  )
}

export default DashboardPage
