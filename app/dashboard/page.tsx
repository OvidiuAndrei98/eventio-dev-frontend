'use client'

import '../../styles/globals.css'
import './mock.css'
import {
  FileExcelFilled,
  SendOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmationCard from './components/confirmationCard/ConfirmationCard'
import ActivityChart from './components/activityChart/ActivityChart'
import Image from 'next/image'
import DemoImage from '../../public/landing-image.svg'
import TodoModal from '../../components/todoList/TodoModal'

// Varianta abonomant

const DashboardPage = () => {
  const router = useRouter()
  const [todoOpen, setTodoOpen] = useState(false)

  const onModalOk = () => {
    setTodoOpen(false)
  }

  const onModalClose = () => {
    setTodoOpen(false)
  }

  return (
    <>
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
              <span className="text secondary-text-color-light">Refuzuri</span>
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
            <Button
              type="default"
              onClick={() => router.push('/dashboard/response')}
            >
              Vezi tot
            </Button>
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
      <TodoModal onClose={onModalClose} onOk={onModalOk} open={todoOpen} />
    </>
  )
}

export default DashboardPage
