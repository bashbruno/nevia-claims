import type { PropsWithChildren } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  type DialogRootProps,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  type DrawerRootProps,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer'

const desktop = 'hidden md:block' as const
const mobile = 'block md:hidden' as const

export const AppModal = {
  Container,
  Trigger,
  Content,
  Header,
  Title,
  Description,
  Footer,
  Close,
}

type CommonContainerProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type ContainerProps = PropsWithChildren<
  {
    dialogProps?: DialogRootProps
    drawerProps?: DrawerRootProps
  } & CommonContainerProps
>

function Container({
  children,
  open,
  onOpenChange,
  dialogProps,
  drawerProps,
}: ContainerProps) {
  return (
    <>
      <Dialog {...dialogProps} open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
      <Drawer {...drawerProps} open={open} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
    </>
  )
}

function Trigger({ children }: PropsWithChildren) {
  return (
    <>
      <DialogTrigger className={desktop}>{children}</DialogTrigger>
      <DrawerTrigger className={mobile}>{children}</DrawerTrigger>
    </>
  )
}

function Content({ children }: PropsWithChildren) {
  return (
    <>
      <DialogContent className={desktop}>{children}</DialogContent>
      <DrawerContent className={mobile}>{children}</DrawerContent>
    </>
  )
}

function Header({ children }: PropsWithChildren) {
  return (
    <>
      <DialogHeader>{children}</DialogHeader>
      <DrawerHeader>{children}</DrawerHeader>
    </>
  )
}

function Title({ children }: PropsWithChildren) {
  return (
    <>
      <DialogTitle>{children}</DialogTitle>
      <DrawerTitle>{children}</DrawerTitle>
    </>
  )
}

function Description({ children }: PropsWithChildren) {
  return (
    <>
      <DialogDescription>{children}</DialogDescription>
      <DrawerDescription>{children}</DrawerDescription>
    </>
  )
}

function Footer({ children }: PropsWithChildren) {
  return (
    <>
      <DialogFooter>{children}</DialogFooter>
      <DrawerFooter>{children}</DrawerFooter>
    </>
  )
}

function Close({ children }: PropsWithChildren) {
  return (
    <>
      <DialogClose>{children}</DialogClose>
      <DrawerClose>{children}</DrawerClose>
    </>
  )
}
