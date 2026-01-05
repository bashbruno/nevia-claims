import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AppModal } from '~/components/app-modal'
import { ClaimTimeInput } from '~/components/claim-time-input'
import { useAreas } from '~/hooks/use-areas'
import { useAppStoreActions, useCharacterName } from '~/lib/state'
import { buildClaimCommand, copyToClipboard } from '~/utils'

type Props = {
  spawnName: string
  areaId: number
}

export const ClaimSpawnModal = NiceModal.create(
  ({ spawnName, areaId }: Props) => {
    const modal = useModal()
    const areas = useAreas()

    const targetArea = areas.find((a) => a.id === areaId)

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
      <AppModal.Container
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) modal.remove()
        }}
      >
        <AppModal.Content>
          {!targetArea ? (
            <ErrorState />
          ) : (
            <ClaimForm
              onConfirm={handleCopyClaim}
              areaName={targetArea.name}
              spawnName={spawnName}
            />
          )}
        </AppModal.Content>
      </AppModal.Container>
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
  const startInputRef = useRef<HTMLInputElement>(null)
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
    if (modal.visible && startInputRef.current) {
      startInputRef.current.focus()
    }
  }, [modal.visible])

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
      <AppModal.Header>
        <AppModal.Title>
          <h3 className="font-bold text-lg">Claim Spawn</h3>
        </AppModal.Title>
      </AppModal.Header>
      <ClaimTimeInput
        placeholder="Start"
        name="start"
        ref={startInputRef}
        required
        value={timeValues.start}
        onChange={(e) =>
          setTimeValues((prev) => ({ ...prev, start: e.target.value }))
        }
      />
      <ClaimTimeInput
        placeholder="End"
        name="end"
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

      <AppModal.Footer>
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
      </AppModal.Footer>
    </form>
  )
}

function ErrorState() {
  return (
    <AppModal.Header>
      <AppModal.Title>
        <h3 className="font-bold text-lg">Failed to determine target area.</h3>
      </AppModal.Title>
    </AppModal.Header>
  )
}
