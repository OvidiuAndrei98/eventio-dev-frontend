import { Button } from 'antd';
import './InvitationCard.css';
import Link from 'next/link';

interface InvitationCardProps {
  image: string;
  text: string;
  templateId: string;
  type: string;
  onTemplateSelect: (templateId: string, type: string) => void;
}

const InvitationCard = ({
  image,
  text,
  templateId,
  type,
  onTemplateSelect,
}: InvitationCardProps) => {
  return (
    <div
      className="invitation-card max-w-[300px] max-h-[400px]"
      style={{ '--background-image': `url("${image}")` } as React.CSSProperties}
    >
      <span className="title">{text}</span>
      <div className="controls">
        <Button
          type="primary"
          size="middle"
          onClick={() => onTemplateSelect(templateId, type)}
        >
          Alege
        </Button>
        <Button size="middle">
          <Link
            href={`/invitation/${type}/preview/${templateId}`}
            target="_blank"
          >
            Demo
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InvitationCard;
