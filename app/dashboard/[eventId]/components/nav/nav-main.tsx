'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { MenuItem } from './app-sidebar'
import { useContext } from 'react'
import { EventContext } from '../../layout'

export function NavMain({ items }: { items: MenuItem[] }) {
  const eventContext = useContext(EventContext)
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Invitatie - {eventContext?.eventName}
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
