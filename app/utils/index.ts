import { TZDate } from '@date-fns/tz'
import { type ClassValue, clsx } from 'clsx'
import { format, parseISO } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export const time = Object.freeze({
  millisecond: 1,
  get second() {
    return this.millisecond * 1000
  },
  get minute() {
    return this.second * 60
  },
  get hour() {
    return this.minute * 60
  },
  get day() {
    return this.hour * 24
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(val: string) {
  const date = parseISO(val)
  return format(date, 'HH:mm')
}

export function formatDate(val: string) {
  const date = parseISO(val)
  return format(date, 'dd.MM.yyyy')
}

export function getIsAdvanceClaim(startDate: string) {
  const startDateCET = new TZDate(startDate, 'Europe/Berlin')
  const isSameOrAfter10 = startDateCET.getHours() >= 10

  const nowCET = new TZDate(new Date(), 'Europe/Berlin')
  const isCurrentlyBefore10 = nowCET.getHours() < 10

  return isSameOrAfter10 && isCurrentlyBefore10
}
