'use client'

import { type ReactNode } from 'react'

import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/context/session-context'
import { ModeToggle } from '@/components/toggle-dark-mode'

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
      <ModeToggle />
    </ThemeProvider>
  )
}
