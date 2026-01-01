import { TZDate, tz } from '@date-fns/tz'
import { type ClassValue, clsx } from 'clsx'
import { format, isAfter, parseISO } from 'date-fns'
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
  // Parse startDate and treat it as Berlin time
  // Since the string is already in Berlin timezone, we parse it and use those exact values
  const parsed = parseISO(startDate)
  const year = parsed.getFullYear()
  const month = parsed.getMonth()
  const date = parsed.getDate()
  const hours = parsed.getHours()
  const minutes = parsed.getMinutes()
  const seconds = parsed.getSeconds()

  // Create TZDate with explicit Berlin timezone using the parsed components
  const startDateCET = new TZDate(
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
    0,
    'Europe/Berlin',
  )
  const nowCET = new TZDate(new Date(), 'Europe/Berlin')

  // Determine the next 10:00 AM
  const next10AM = new TZDate(nowCET, 'Europe/Berlin')

  // If we're currently at or after 10:00 AM, next 10:00 AM is tomorrow
  if (nowCET.getHours() >= 10) {
    next10AM.setDate(next10AM.getDate() + 1)
  }

  // Set to 10:00:00.000
  next10AM.setHours(10, 0, 0, 0)

  // Return true if startDate is at or after next 10:00 AM
  return (
    isAfter(startDateCET, next10AM) ||
    startDateCET.getTime() === next10AM.getTime()
  )
}

/**
 * @returns the ok status of the clipboard action
 */
export async function copyToClipboard(val: string) {
  try {
    await navigator.clipboard.writeText(val)
    return true
  } catch (err) {
    console.error('Failed to copy: ', err)
    return false
  }
}

export function buildClaimCommand(
  areaName: string,
  spawnName: string,
  start: string | undefined,
  end: string | undefined,
  character: string | undefined,
) {
  // /claim area:(Ingol) Ingol -1 start:21 end:22 character:Very Pog
  const cmd = `/claim area:(${areaName}) ${spawnName} start:${start} end:${end} character:${character}`
  return cmd
}
