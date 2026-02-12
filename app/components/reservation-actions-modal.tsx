import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { CalendarClock, Star } from 'lucide-react'
import { useModalEscapeKey } from '~/hooks/use-modal-escape-key'
import type { Reservation } from '~/lib/api/types'
import { useAppStoreActions, useIsMarkedAsMine } from '~/lib/state'
import { cn, getCalendarUrl } from '~/utils'

const CLAIM_SPAWN_MODAL_ID = 'reservation-actions-modal'

type Props = {
  spawnName: string
  reservation: Reservation
  startDate: string
  endDate: string
}

export const ReservationActionsModal = NiceModal.create(
  ({ spawnName, reservation }: Props) => {
    const modal = useModal()
    const { toggleMarkedAsMine } = useAppStoreActions()
    const isMarkedAsMine = useIsMarkedAsMine(reservation.id)

    useModalEscapeKey(modal)

    const googleCalendarUrl = getCalendarUrl('google', spawnName, reservation)
    const outlookCalendarUrl = getCalendarUrl('outlook', spawnName, reservation)
    const officeCalendarUrl = getCalendarUrl('office', spawnName, reservation)

    const handleToggleMarkedAsMine = () => {
      toggleMarkedAsMine(reservation.id, reservation.endDate)
    }

    return (
      <dialog
        id={CLAIM_SPAWN_MODAL_ID}
        className={cn('modal modal-bottom sm:modal-middle', {
          'modal-open': modal.visible,
        })}
      >
        <div className="modal-box border border-white/5">
          <div className="space-y-5">
            <h3 className="font-bold text-lg">Extras</h3>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleToggleMarkedAsMine}
                className={cn(
                  'btn text-white',
                  isMarkedAsMine
                    ? 'bg-green-700 border border-green-600 hover:bg-green-700/80'
                    : 'bg-green-700/70 border border-green-600/70 hover:bg-green-700',
                )}
              >
                <Star
                  size={18}
                  fill={isMarkedAsMine ? 'currentColor' : 'none'}
                />
                {isMarkedAsMine ? 'Unmark as mine' : 'Mark as mine'}
              </button>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#4187F3] text-white hover:bg-[#4187F3]/80"
              >
                <CalendarClock size={18} />
                Add to Google Calendar
              </a>

              <a
                href={outlookCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#54DAFF] text-black hover:bg-[#54DAFF]/80"
              >
                <CalendarClock size={18} />
                Add to Outlook Calendar
              </a>

              <a
                href={officeCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#D94211] text-white hover:bg-[#D94211]/80"
              >
                <CalendarClock size={18} />
                Add to Office365 Calendar
              </a>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit" onClick={modal.remove}>
            Close
          </button>
        </form>
      </dialog>
    )
  },
)
