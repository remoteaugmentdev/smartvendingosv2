'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

// Full page navigation (server does a DB lookup before redirecting), so the
// spinner just needs to appear on click and stay until the browser unloads.
export function ResumeDashboardLink({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false)

  return (
    <a
      href={`/api/leads/resume?slug=${slug}`}
      onClick={() => setLoading(true)}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:from-blue-600 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </>
      ) : (
        'Go to dashboard'
      )}
    </a>
  )
}
