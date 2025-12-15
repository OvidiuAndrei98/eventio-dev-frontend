import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PlanEventInstance } from '@/core/types';
import { deletePlanEventById } from '@/service/event/deletePlanEventById';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export const getPlanColumns = ({
  handleEventDelete,
}: {
  handleEventDelete: (eventId: string) => void;
}): ColumnDef<PlanEventInstance>[] => {
  const columns: ColumnDef<PlanEventInstance>[] = [
    {
      accessorKey: 'eventName',
      header: ({ column }) => {
        return (
          <Button
            className="hover:bg-purple-50 cursor-pointer w-[200px]"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nume
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div
            className="flex items-center gap-2 hover:text-[#B46ACB] cursor-pointer"
            onClick={() => {
              window.location.href = `/dashboard/plan/${row.original.eventId}`;
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block  whitespace-nowrap overflow-hidden text-ellipsis">
                    {event.eventName}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{event.eventName}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: 'eventPlan',
      header: 'Plan',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <span>
            {event.eventPlan === 'premium' && (
              <Badge
                variant="default"
                className="text-[#1E88E5] bg-[#E3F2FD] rounded-md text-xs font-medium"
              >
                {event.eventPlan.charAt(0).toUpperCase() +
                  event.eventPlan.slice(1)}
              </Badge>
            )}
            {event.eventPlan === 'ultimate' && (
              <Badge
                variant="default"
                className="text-[#B46ACB] bg-[#F8E5FD] rounded-md text-xs font-medium"
              >
                {event.eventPlan.charAt(0).toUpperCase() +
                  event.eventPlan.slice(1)}
              </Badge>
            )}
            {event.eventPlan === 'basic' && (
              <Badge
                variant="default"
                className="text-[grey] bg-[#F5F8FA] rounded-md text-xs font-medium"
              >
                {event.eventPlan.charAt(0).toUpperCase() +
                  event.eventPlan.slice(1)}
              </Badge>
            )}
          </span>
        );
      },
    },
    {
      accessorKey: 'eventDate',
      header: 'Data',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <span>
            {new Date(event.eventDate).toLocaleDateString('ro-RO', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-[#f8e5fd] data-[state=open]:bg-[#f8e5fd] cursor-pointer"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
              <DropdownMenuItem className="hover:!bg-[#f8e5fd] active:!bg-[#f8e5fd] focus:!bg-[#f8e5fd]">
                <Link href={`/dashboard/${event?.eventId}/tables`}>
                  Administrează planul
                </Link>
                <span className="hidden">{event.eventName}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:!bg-[#f8e5fd] active:!bg-[#f8e5fd] focus:!bg-[#f8e5fd]"
                onClick={async () => {
                  try {
                    await deletePlanEventById(event.eventId);
                    handleEventDelete(event.eventId);
                    toast.success(
                      `Invitația ${event.eventName} a fost ștearsă cu succes!`
                    );
                  } catch (error) {
                    toast.error(
                      `A apărut o eroare la ștergerea invitației ${event.eventName}. Vă rugăm să încercați din nou.`
                    );
                  }
                }}
              >
                Șterge planul
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
