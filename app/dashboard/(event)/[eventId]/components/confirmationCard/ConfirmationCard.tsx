import { Tag } from 'antd'
import './ConfirmationCard.css'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const ConfirmationCard = () => {
  return (
    <div className="preview-confirmation-card">
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Nume</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="field-content">Penicanicus</span>
            </TooltipTrigger>
            <TooltipContent>
              <span className="field-content">Penicanicus</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Partener</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="field-content">teolojan</span>
            </TooltipTrigger>
            <TooltipContent>
              <span className="field-content">teolojan</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="confirmation-field">
        <span className="field-title secondary-text-color-light">Data</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="field-content">2 Februarie 2025, 19:32</span>
            </TooltipTrigger>
            <TooltipContent>
              <span className="field-content">2 Februarie 2025, 19:32</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
