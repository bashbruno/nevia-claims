import { ClaimTimeInput } from '~/components/claim-time-input'
import { useAppStoreActions, useCharacterName } from '~/lib/state'

export const CLAIM_SPAWN_MODAL_ID = 'spawn-actions-modal'

// /claim area:(Ingol) Ingol -1 start:21 end:22 character:Very Pog

export function ClaimSpawnModal() {
  const characterName = useCharacterName()
  const { setCharacterName } = useAppStoreActions()

  return (
    <dialog
      id={CLAIM_SPAWN_MODAL_ID}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box space-y-5 border border-white/5">
        <h3 className="font-bold text-lg">Claim Spawn</h3>
        <ClaimTimeInput placeholder="Start" />

        <ClaimTimeInput placeholder="End" />

        <ClaimTimeInput
          placeholder="Character"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />

        <div className="flex justify-end">
          <button type="button" className="btn btn-neutral">
            Copy Claim Command
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">Close</button>
      </form>
    </dialog>
  )
}
