import { Button } from 'antd'
import './InvitationCard.css'

const InvitationCard = () => {
  return (
    <div className="invitation-card">
      <span className="title">Title</span>
      <div className="controls">
        <Button type="primary" size="middle">
          Alege
        </Button>
        <Button size="middle">Demo</Button>
      </div>
    </div>
  )
}

export default InvitationCard
