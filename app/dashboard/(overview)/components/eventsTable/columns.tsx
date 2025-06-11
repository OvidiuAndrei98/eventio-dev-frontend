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
import { EventInstance } from '@/core/types';
import { deleteEventById } from '@/service/event/deleteEventById';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export const getColumns = ({
  handleEventDelete,
}: {
  handleEventDelete: (eventId: string) => void;
}): ColumnDef<EventInstance>[] => {
  const columns: ColumnDef<EventInstance>[] = [
    {
      accessorKey: 'eventName',
      header: ({ column }) => {
        return (
          <Button
            className="hover:bg-purple-50 cursor-pointer"
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
              window.location.href = `/dashboard/${row.original.eventId}`;
            }}
          >
            <Image
              src={event.eventTemplateThumbnailUrl}
              alt="Event Thumbnail"
              width={40}
              height={40}
              className="rounded-md"
            />
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
      accessorKey: 'eventType',
      header: 'Eveniment',
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
      accessorKey: 'eventActive',
      header: 'Status',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <span>
            {event.eventActive ? (
              <Badge
                variant="default"
                className="text-[#B46ACB] bg-[#F8E5FD] rounded-md px-2 py-1 text-xs font-medium"
              >
                Activ
              </Badge>
            ) : (
              <Badge
                variant="default"
                className="text-[grey] bg-[#F5F8FA] rounded-md px-2 py-1 text-xs font-medium"
              >
                Draft
              </Badge>
            )}
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
              <DropdownMenuLabel>Actiuni</DropdownMenuLabel>
              <DropdownMenuItem className="hover:!bg-[#f8e5fd] active:!bg-[#f8e5fd] focus:!bg-[#f8e5fd]">
                Administreaza invitatia
                <span className="hidden">{event.eventName}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:!bg-[#f8e5fd] active:!bg-[#f8e5fd] focus:!bg-[#f8e5fd]">
                Previzualizeaza invitația
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:!bg-[#f8e5fd] active:!bg-[#f8e5fd] focus:!bg-[#f8e5fd]"
                onClick={async () => {
                  try {
                    await deleteEventById(event);
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
                Sterge invitația
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (window.innerWidth < 767) {
    // Remove the 'eventType' column for mobile view
    return columns.filter((column) => {
      return (
        (column as ColumnDef<EventInstance> & { accesorKey: string })
          .accesorKey !== 'eventType'
      );
    });
  }

  return columns;
};
