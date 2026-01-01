import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useEffect } from 'react'

export function useModalEscapeKey(modal: NiceModalHandler) {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && modal.visible) {
        modal.remove()
      }
    }

    if (modal.visible) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [modal])
}
