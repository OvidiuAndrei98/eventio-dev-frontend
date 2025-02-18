'use client'

import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
    onClick: (info: { title: string; url: string }) => void
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Invitatie - Andu si Narci</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            key={item.title + item.url}
            onClick={() => item.onClick({ title: item.title, url: item.url })}
          >
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
