'use client'

import { useMemo } from 'react'
import { useDateRange } from '@/context/DateRangeContext'
import { filterByDateRange } from '@/utils/filterByDateRange'

export function useFilteredData<T extends { date: string }>(records: T[]): T[] {
  const { startDate, endDate } = useDateRange()

  return useMemo(
    () => filterByDateRange(records, startDate, endDate),
    [records, startDate, endDate]
  )
}
