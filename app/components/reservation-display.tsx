import type { Reservation } from '~/lib/api/types'
import { cn, formatDate, formatTime, getIsAdvanceClaim } from '~/utils'

type Props = {
  reservation: Reservation
}

export function ReservationDisplay({ reservation }: Props) {
  const isAdvanceClaim = getIsAdvanceClaim(reservation.startDate)
  const startTime = formatTime(reservation.startDate)
  const endTime = formatTime(reservation.endDate)
  const startDate = formatDate(reservation.startDate)

  return (
    <div
      className={cn(
        'bg-neutral p-2 rounded-md flex items-center justify-between',
        {
          'bg-purple-900/80 border border-purple-700': isAdvanceClaim,
        },
      )}
    >
      <div>
        <p className="font-medium">
          {startTime} - {endTime}
        </p>
        <p className="font-light text-xs">{startDate}</p>
      </div>
      <p className="font-semibold flex flex-col items-center text-base">
        {isAdvanceClaim && <span className="text-xs">(In Advance)</span>}
        {reservation.characterName}
      </p>
      <div />
    </div>
  )
}
