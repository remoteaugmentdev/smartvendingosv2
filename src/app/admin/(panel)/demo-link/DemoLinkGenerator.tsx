'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Link as LinkIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const FIELD_CLS =
  'h-11 w-full rounded-xl border-0 bg-slate-100 px-4 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all'

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function DemoLinkGenerator() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [origin, setOrigin] = useState('')
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  useEffect(() => setOrigin(window.location.origin), [])

  const slug = slugify(name)
  const trimmedMessage = message.trim()
  const url = slug ? `${origin}/${slug}` : ''

  function onNameChange(v: string) {
    setName(v)
    setGenerated(false)
  }

  function onMessageChange(v: string) {
    setMessage(v)
    setGenerated(false)
  }

  async function generate() {
    if (!slug || generating) return
    setGenerating(true)
    try {
      await fetch('/api/leads/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: name.trim(), slug, message: trimmedMessage }),
      })
      router.refresh()
      setGenerated(true)
    } finally {
      setGenerating(false)
    }
  }

  async function copy() {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card hover={false} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="block text-[13px] font-medium text-slate-700">Company name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Peak Vending Solutions"
          className={FIELD_CLS}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="block text-[13px] font-medium text-slate-700">
          Custom message (optional)
        </span>
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          maxLength={100}
          rows={2}
          placeholder="We built this for your 40-machine fleet in Austin"
          className={`${FIELD_CLS} h-auto resize-none py-2.5`}
        />
        <span className="block text-right text-xs text-slate-400">{message.length}/100</span>
      </label>

      <Button type="button" onClick={generate} disabled={!slug || generating} className="w-full">
        {generating ? 'Generating…' : 'Generate URL'}
      </Button>

      {generated && (
        <div
          key={url}
          className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3"
          style={{ animation: 'tour-fade-up 0.35s ease-out both' }}
        >
          <LinkIcon size={15} className="shrink-0 text-slate-400" />
          <span className="flex-1 truncate text-sm text-slate-700">{url}</span>
          <Button type="button" variant="secondary" size="sm" onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      )}
    </Card>
  )
}
