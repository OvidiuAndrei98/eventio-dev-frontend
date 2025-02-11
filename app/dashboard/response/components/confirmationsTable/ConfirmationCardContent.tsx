import './ConfirmationCardContent.css'

const ConfirmationCardContent = () => {
  return (
    <div className="card-content-container">
      <div className="card-row">
        <span className="secondary-text-color-light title">Numar persoane</span>
        <span className="value">2</span>
      </div>
      <div className="card-row">
        <span className="secondary-text-color-light title">Nume</span>
        <span className="value">Andu</span>
      </div>
      <div className="card-row">
        <span className="secondary-text-color-light title">Partener</span>
        <span className="value">Teo</span>
      </div>
    </div>
  )
}

export default ConfirmationCardContent
