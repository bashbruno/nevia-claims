import NiceModal from '@ebay/nice-modal-react'
import { Ellipsis } from 'lucide-react'
import { HighlitableBySearch } from '~/components/highlitable-by-search'
import type { Reservation } from '~/lib/api/types'
import { useIsMarkedAsMine } from '~/lib/state'
import { cn, formatDate, formatTime, getIsAdvanceClaim } from '~/utils'
import { ReservationActionsModal } from './reservation-actions-modal'

type Props = {
  reservation: Reservation
  spawnName: string
}

export function ReservationDisplay({ reservation, spawnName }: Props) {
  const isAdvanceClaim = getIsAdvanceClaim(reservation.startDate)
  const isMarkedAsMine = useIsMarkedAsMine(reservation.id)
  const startTime = formatTime(reservation.startDate)
  const endTime = formatTime(reservation.endDate)
  const startDate = formatDate(reservation.startDate)

  return (
    <div
      className={cn(
        'bg-neutral p-2 rounded-md flex flex-col gap-2 md:items-center md:justify-between md:flex-row',
        {
          'bg-purple-900/80 border border-purple-700': isAdvanceClaim,
          'bg-green-900/80 border border-green-700': isMarkedAsMine,
        },
      )}
    >
      <div>
        <p className="font-medium">
          {startTime} - {endTime}
        </p>
        <p className="font-light text-xs">{startDate}</p>
      </div>
      <p className="font-semibold flex flex-col items-center text-sm md:text-base">
        {isAdvanceClaim && <span className="text-xs">(In Advance)</span>}
        <span>
          <HighlitableBySearch text={reservation.characterName} />
        </span>
      </p>
      <div>
        <button
          type="button"
          className="btn btn-square bg-transparent border-none hover:bg-white/5"
          onClick={(e) => {
            e.stopPropagation()
            NiceModal.show(ReservationActionsModal, { spawnName, reservation })
          }}
        >
          <Ellipsis size={18} />
        </button>
      </div>
    </div>
  )
}
