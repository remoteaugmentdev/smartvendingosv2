'use client'

import { useApp } from '@/context/AppContext'
import { translations } from '@/locales/translations'

export function useTranslation() {
  const { lang } = useApp()
  return translations[lang]
}
