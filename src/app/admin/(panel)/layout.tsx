import { PageHeader } from '@/components/layout/PageHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader
        title="Admin Panel"
        description="Manage demo accounts for client pitches"
      />
      {children}
    </div>
  )
}
