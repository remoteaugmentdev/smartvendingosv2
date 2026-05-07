import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { DateRangeProvider } from '@/context/DateRangeContext'
import { AuthProvider } from '@/context/AuthContext'
import { LayoutShell } from '@/components/layout/LayoutShell'

export const metadata: Metadata = {
  title: 'SmartVendingOS',
  description: 'Vending machine management dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AuthProvider>
          <AppProvider>
            <DateRangeProvider>
              <LayoutShell>{children}</LayoutShell>
            </DateRangeProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
