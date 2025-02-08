import { Tag } from 'antd'
import './ConfirmationCard.css'

const ConfirmationCard = () => {
  return (
    <div className="preview-confirmation-card">
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Nume</span>
        <span className="field-content">Penica</span>
      </div>
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Partener</span>
        <span className="field-content">Teo</span>
      </div>
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Data</span>
        <span className="field-content">2 Februarie 2025, 19:32</span>
      </div>
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Status</span>
        <Tag bordered={false} color="green">
          Confirmat
        </Tag>
      </div>
    </div>
  )
}

export default ConfirmationCard
