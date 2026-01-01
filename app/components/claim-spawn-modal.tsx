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
            <ClaimForm onConfirm={handleCopyClaim} />
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
}

function ClaimForm({ onConfirm }: ClaimFormProps) {
  const [copied, setCopied] = useState(false)
  const modal = useModal()
  const startInputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const characterName = useCharacterName()
  const { setCharacterName } = useAppStoreActions()

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
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    await onConfirm(
      fd.get('start')?.toString(),
      fd.get('end')?.toString(),
      fd.get('character')?.toString(),
    )
    setCopied(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setCopied(false), 2500)
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-5">
      <h3 className="font-bold text-lg">Claim Spawn</h3>
      <ClaimTimeInput placeholder="Start" name="start" ref={startInputRef} />
      <ClaimTimeInput placeholder="End" name="end" />
      <ClaimTimeInput
        name="character"
        placeholder="Character"
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
      />
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
