import { Guest } from '@/core/types';
import './ConfirmationCardContent.css';

interface ConfirmationCardContentProps {
  guest: Guest;
}

const ConfirmationCardContent = ({ guest }: ConfirmationCardContentProps) => {
  return (
    <div className="card-content-container">
      <div className="card-row">
        <span className="secondary-text-color-light title">Nume</span>
        <span className="value">{guest.fullName}</span>
      </div>
      {guest.primaryContactPhone && guest.primaryContactPhone !== '' && (
        <div className="card-row">
          <span className="secondary-text-color-light title">
            Numar telefon
          </span>
          <span className="value">{guest.primaryContactPhone}</span>
        </div>
      )}
      {guest.dietaryRestrictions && guest.dietaryRestrictions !== '' && (
        <div className="card-row">
          <span className="secondary-text-color-light title">
            Preferinte meniu
          </span>
          <span className="value">{guest.dietaryRestrictions}</span>
        </div>
      )}
      {guest.eventAditionalQuestions?.map((q, index) => (
        <div className="card-row" key={index}>
          <span className="secondary-text-color-light title">
            {q.key.replace(/_/g, ' ')}
          </span>
          <span className="value">{q.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ConfirmationCardContent;
