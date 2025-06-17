import { Button } from 'antd';
import './InvitationCard.css';
import Link from 'next/link';
import Image from 'next/image';

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
      className="invitation-card max-w-[400px] h-[400px] bg-[var(--primary-color)]/10 relative overflow-hidden"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: '80% 80%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black/10 z-0" />
      <span className="title z-10">{text}</span>
      <div className="controls relative z-10">
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
