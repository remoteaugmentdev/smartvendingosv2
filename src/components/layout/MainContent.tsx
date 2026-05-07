'use client'

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-page)]">
      <div className="p-6">{children}</div>
    </main>
  )
}
