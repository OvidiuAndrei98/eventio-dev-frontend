import { Guest } from '@/core/types';
import './ConfirmationCardHeader.css';

interface ConfirmationCardHeaderProps {
  guest: Guest;
}

const ConfirmationCardHeader = ({ guest }: ConfirmationCardHeaderProps) => {
  return (
    <div className="card-header-container">
      <span>{guest.name}</span>
      <span>
        {new Date(guest.date).toLocaleString('RO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    </div>
  );
};

export default ConfirmationCardHeader;
