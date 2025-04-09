import { clsx, type ClassValue } from 'clsx'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleSideMenuNavigation = (
  info: { title: string; url: string },
  router: AppRouterInstance
) => {
  router.push(info.url)
}
