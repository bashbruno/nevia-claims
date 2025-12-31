import type { ComponentProps } from 'react'
import { useAppStoreActions, useIsAccordionOpen } from '~/lib/state'
import { cn } from '~/utils'

export const Accordion = {
  Container,
  Title,
  Content,
}

type ContainerProps = ComponentProps<'details'> & {
  forceOpen?: boolean
}

function Container({ forceOpen, ...props }: ContainerProps) {
  const name = props.name
  if (!name) throw new Error('Accordion must have a name')
  const persistedOpen = useIsAccordionOpen(name)
  const { toggleAccordion } = useAppStoreActions()

  // If forceOpen is true, accordion is open (transient, not persisted)
  // Otherwise, use the persisted state
  const open = forceOpen || persistedOpen

  return (
    <details
      {...props}
      open={open}
      onToggle={(e) => {
        // Don't persist state changes when forceOpen is active
        if (forceOpen) return

        // Only toggle if the DOM state actually changed (user interaction)
        const newOpenState = e.currentTarget.open
        if (newOpenState !== persistedOpen) {
          toggleAccordion(name)
        }
      }}
      className={cn(
        'collapse collapse-arrow bg-secondary/10 border border-secondary/30 rounded-lg',
        props.className,
      )}
    />
  )
}

function Title(props: ComponentProps<'summary'>) {
  return (
    <summary
      {...props}
      className={cn('collapse-title font-semibold', props.className)}
    />
  )
}

function Content(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'collapse-content text-sm bg-secondary/5 pt-4',
        props.className,
      )}
    />
  )
}
