import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { reedemCodeService } from '@/service/event/reedemCode';
import { GiftIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface ReedemCodeProps {
  eventId: string;
  userId: string;
}

export const ReedemCode: React.FC<ReedemCodeProps> = ({ eventId, userId }) => {
  const [code, setCode] = React.useState('');
  const [successRedeem, setSuccessRedeem] = React.useState(false);

  const reedemCode = async () => {
    try {
      await reedemCodeService(code, userId, eventId);
      toast.success('Codul de reducere a fost aplicat cu succes!');
      setSuccessRedeem(true);
      setTimeout(() => {
        setCode('');
        setSuccessRedeem(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'A apărut o eroare la aplicarea codului de reducere.'
      );
    }
  };

  return (
    <div className="@container w-full p-2 flex flex-row gap-2 justify-center">
      <Input
        className={`hidden @[50px]:flex flex-1 transition-all duration-500 ${
          successRedeem ? 'ring-2 ring-green-500 bg-green-50' : ''
        }`}
        placeholder="Cod reducere"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={successRedeem}
      />
      <Button
        className={`hidden @[50px]:flex cursor-pointer transition-all duration-500 ${
          successRedeem ? 'bg-green-500 hover:bg-green-600' : ''
        }`}
        onClick={reedemCode}
        disabled={successRedeem}
      >
        <span>{successRedeem ? '✓ Aplicat' : 'Aplica'}</span>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          {
            <GiftIcon
              className="block @[50px]:hidden text-[var(--primary-color)] cursor-pointer"
              size={16}
            />
          }
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          Extindeți meniul pentru a introduce un cod de reducere.
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
