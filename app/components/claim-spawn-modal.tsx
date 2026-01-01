import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ClaimTimeInput } from '~/components/claim-time-input'
import { useAreas } from '~/hooks/use-areas'
import { useModalEscapeKey } from '~/hooks/use-modal-escape-key'
import { useAppStoreActions, useCharacterName } from '~/lib/state'
import { buildClaimCommand, cn, copyToClipboard } from '~/utils'

const CLAIM_SPAWN_MODAL_ID = 'claim-spawn-modal'

type Props = {
  spawnName: string
  areaId: number
}

export const ClaimSpawnModal = NiceModal.create(
  ({ spawnName, areaId }: Props) => {
    const modal = useModal()
    const areas = useAreas()

    const targetArea = areas.find((a) => a.id === areaId)

    useModalEscapeKey(modal)

    async function handleCopyClaim(
      start: string | undefined,
      end: string | undefined,
      character: string | undefined,
    ) {
      if (!targetArea) return
      const cmd = buildClaimCommand(
        targetArea.name,
        spawnName,
        start,
        end,
        character,
      )
      const ok = await copyToClipboard(cmd)
      if (!ok) alert('Failed to copy claim command')
    }

    return (
      <dialog
        id={CLAIM_SPAWN_MODAL_ID}
        className={cn('modal modal-bottom sm:modal-middle', {
          'modal-open': modal.visible,
        })}
      >
        <div className="modal-box border border-white/5">
          {!targetArea ? (
            <ErrorState />
          ) : (
            <ClaimForm
              onConfirm={handleCopyClaim}
              areaName={targetArea.name}
              spawnName={spawnName}
            />
          )}
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

type ClaimFormProps = {
  onConfirm: (
    start: string | undefined,
    end: string | undefined,
    character: string | undefined,
  ) => Promise<void>
  areaName: string
  spawnName: string
}

function ClaimForm({ onConfirm, areaName, spawnName }: ClaimFormProps) {
  const [copied, setCopied] = useState(false)
  const [timeValues, setTimeValues] = useState({ start: '', end: '' })

  const modal = useModal()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const characterName = useCharacterName()
  const { setCharacterName } = useAppStoreActions()

  const commandPreview = buildClaimCommand(
    areaName,
    spawnName,
    timeValues.start || undefined,
    timeValues.end || undefined,
    characterName || undefined,
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  async function handleConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Remove trailing colon from time values if present
    const cleanStart = timeValues.start.endsWith(':')
      ? timeValues.start.slice(0, -1)
      : timeValues.start
    const cleanEnd = timeValues.end.endsWith(':')
      ? timeValues.end.slice(0, -1)
      : timeValues.end

    setTimeValues({
      start: cleanStart,
      end: cleanEnd,
    })

    await onConfirm(cleanStart, cleanEnd, characterName)
    setCopied(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setCopied(false), 2500)
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-5">
      <h3 className="font-bold text-lg">Claim Spawn</h3>
      <ClaimTimeInput
        placeholder="Start"
        name="start"
        autoFocus
        inputMode="tel"
        required
        value={timeValues.start}
        onChange={(e) =>
          setTimeValues((prev) => ({ ...prev, start: e.target.value }))
        }
      />
      <ClaimTimeInput
        placeholder="End"
        name="end"
        inputMode="tel"
        required
        value={timeValues.end}
        onChange={(e) =>
          setTimeValues((prev) => ({ ...prev, end: e.target.value }))
        }
      />
      <ClaimTimeInput
        name="character"
        placeholder="Character"
        required
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
      />
      <div className="rounded-lg bg-base-300 p-3">
        <code className="text-sm break-all">{commandPreview}</code>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-neutral">
          {!copied && (
            <span className="flex items-center gap-2">
              Copy Claim Command
              <Copy size={16} strokeWidth={3} />
            </span>
          )}
          {copied && (
            <span className="flex items-center gap-2">
              Copied
              <Check size={16} strokeWidth={3} />
            </span>
          )}
        </button>
      </div>
    </form>
  )
}

function ErrorState() {
  return <h3 className="font-bold text-lg">Failed to determine target area.</h3>
}
