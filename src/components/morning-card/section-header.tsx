import type { ReactNode } from 'react'

export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
      {children}
    </h2>
  )
}
