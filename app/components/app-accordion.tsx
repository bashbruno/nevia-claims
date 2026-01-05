import type { PropsWithChildren } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  type AccordionItemProps,
  AccordionTrigger,
} from '~/components/ui/accordion'

export const AppAccordion = {
  Container,
  Item,
  Trigger,
  Content,
}

function Container({ children }: PropsWithChildren) {
  return <Accordion type="multiple">{children}</Accordion>
}

type ItemProps = AccordionItemProps & {
  forceOpen?: boolean
}

function Item({ forceOpen, children, ...props }: ItemProps) {
  // const persistedOpen = useIsAccordionOpen(value)
  // const { toggleAccordion } = useAppStoreActions()
  //
  // // If forceOpen is true, accordion is open (transient, not persisted)
  // // Otherwise, use the persisted state
  // const open = forceOpen || persistedOpen

  return <AccordionItem {...props}>{children}</AccordionItem>
}

function Trigger({ children }: PropsWithChildren) {
  return <AccordionTrigger>{children}</AccordionTrigger>
}

function Content({ children }: PropsWithChildren) {
  return <AccordionContent>{children}</AccordionContent>
}
