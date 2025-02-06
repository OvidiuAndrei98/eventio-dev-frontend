'use client'

import './InvitationsModal.css'
import { RedEnvelopeOutlined } from '@ant-design/icons'
import { Menu, MenuProps, Modal } from 'antd'
import { useEffect, useState } from 'react'

type MenuItem = Required<MenuProps>['items'][number]

const InvitationModal = ({
  open,
  onOk,
  onClose,
}: {
  open: boolean
  onOk: () => void
  onClose: () => void
}) => {
  const [innerWidth, setInnerWidth] = useState(0)

  useEffect(() => {
    if (typeof window == 'undefined') {
      return
    }

    const updateWindowWidth = () => {
      setInnerWidth(window.innerWidth)
    }

    window.addEventListener('resize', updateWindowWidth)
  }, [])

  const items: MenuItem[] = [
    { key: '1', icon: <RedEnvelopeOutlined />, label: 'Charm' },
    { key: '2', icon: <RedEnvelopeOutlined />, label: 'Bliss' },
    { key: '3', icon: <RedEnvelopeOutlined />, label: 'Super long name' },
  ]

  return (
    <Modal
      className="invitations-modal"
      title="Invitații pentru nuntă"
      centered
      open={open}
      onOk={onOk}
      onCancel={onClose}
      maskClosable
      width={{
        xs: '90%',
        sm: '80%',
        md: '80%',
        lg: '80%',
        xl: '80%',
        xxl: '90%',
      }}
      footer={false}
    >
      <div
        className="invitations-modal-content"
        style={{
          display: 'flex',
          flexDirection: innerWidth < 600 ? 'column' : 'row',
        }}
      >
        <Menu
          defaultSelectedKeys={['1']}
          mode={innerWidth < 600 ? 'horizontal' : 'inline'}
          items={items}
          style={{
            maxWidth: innerWidth < 600 ? 'auto' : '200px',
          }}
        />
        <div className="invitations-container">
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
          <div className="invitation-card">invitation</div>
        </div>
      </div>
    </Modal>
  )
}

export default InvitationModal
