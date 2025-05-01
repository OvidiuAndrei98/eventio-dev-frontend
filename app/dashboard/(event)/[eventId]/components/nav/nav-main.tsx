'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { MenuItem } from './app-sidebar'
import { useEventContext } from '@/core/context/EventContext'

export function NavMain({ items }: { items: MenuItem[] }) {
  const { eventInstance } = useEventContext()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Invitatie - {eventInstance?.eventName}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            key={item.title + item.url}
            onClick={() =>
              item.onClick && item.onClick({ title: item.title, url: item.url })
            }
          >
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
