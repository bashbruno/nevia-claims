import type { ComponentProps } from 'react'
import { cn } from '~/utils'

export const Accordion = {
  Container,
  Title,
  Content,
}

function Container(props: ComponentProps<'details'>) {
  return (
    <details
      {...props}
      className={cn('collapse bg-secondary/20', props.className)}
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
      className={cn('collapse-content text-sm', props.className)}
    />
  )
}
