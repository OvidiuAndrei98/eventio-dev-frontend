'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EventInstance } from '@/core/types'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, IceCream2, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const columns: ColumnDef<EventInstance>[] = [
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
      )
    },
    cell: ({ row }) => {
      const event = row.original
      return (
        <div
          className="flex items-center gap-2 hover:text-[#B46ACB] cursor-pointer"
          onClick={() => {
            window.location.href = `/dashboard/${row.original.eventId}`
          }}
        >
          <IceCream2 />
          <span>{event.eventName}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'eventType',
    header: 'Eveniment',
  },
  {
    accessorKey: 'eventPlan',
    header: 'Plan',
  },
  {
    accessorKey: 'eventActive',
    header: 'Status',
    cell: ({ row }) => {
      const event = row.original
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
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // const event = row.original

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
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:!bg-[#f8e5fd] active:!bg-[#f8e5fd] focus:!bg-[#f8e5fd]">
              Previzualizeaza invitatia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
