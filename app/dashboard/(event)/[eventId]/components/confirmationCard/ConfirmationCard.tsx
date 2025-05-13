import { Tag } from 'antd';
import './ConfirmationCard.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Guest } from '@/core/types';

const ConfirmationCard = ({ guest }: { guest: Guest }) => {
  return (
    <div className="preview-confirmation-card">
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Nume</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="field-content">{guest.guestInfo.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span className="field-content">{guest.guestInfo.name}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">
          Nr. invitati
        </span>
        <span className="field-content">
          {guest.guestInfo.numberOfGuests ?? '-'}
        </span>
      </div>
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Data</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="field-content">
                {new Date(guest.date).toLocaleString('RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span className="field-content">
                {new Date(guest.date).toLocaleString('RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Status</span>
        {guest.isAttending ? (
          <Tag bordered={false} color="green">
            Confirmat
          </Tag>
        ) : (
          <Tag bordered={false} color="red">
            Refuzat
          </Tag>
        )}
      </div>
    </div>
  );
};

export default ConfirmationCard;
