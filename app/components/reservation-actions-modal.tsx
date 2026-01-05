import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { CalendarClock } from 'lucide-react'
import { AppModal } from '~/components/app-modal'
import type { Reservation } from '~/lib/api/types'
import { getCalendarUrl } from '~/utils'

type Props = {
  spawnName: string
  reservation: Reservation
  startDate: string
  endDate: string
}

export const ReservationActionsModal = NiceModal.create(
  ({ spawnName, reservation }: Props) => {
    const modal = useModal()

    const googleCalendarUrl = getCalendarUrl('google', spawnName, reservation)
    const outlookCalendarUrl = getCalendarUrl('outlook', spawnName, reservation)
    const officeCalendarUrl = getCalendarUrl('office', spawnName, reservation)

    return (
      <AppModal.Container
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) modal.remove()
        }}
      >
        <AppModal.Content>
          <AppModal.Header>
            <AppModal.Title>
              <h3 className="font-bold text-lg">Extras</h3>
            </AppModal.Title>
          </AppModal.Header>
          <div className="flex flex-col gap-3">
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
        </AppModal.Content>
      </AppModal.Container>
    )
  },
)
