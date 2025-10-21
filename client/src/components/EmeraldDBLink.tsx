import type { ReactNode, MouseEvent } from 'react'
import { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'

export const EmeraldDBLink = forwardRef<HTMLAnchorElement, {
  href: string
  onClick?: () => void
  children: ReactNode
  notClickable?: boolean
  openInNewTab?: boolean
}>(function EmeraldDBLink(props, ref) {
  const navigate = useNavigate()

  function goTo(route: string) {
    navigate(route)
  }

  function onLinkClick(
    event:
      | MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
      | MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) {
    if (!props.openInNewTab) {
      event.preventDefault()
    }
    event.stopPropagation()
    if (props.onClick) {
      props.onClick()
    }
    if (!props.notClickable && !props.openInNewTab) {
      goTo(props.href)
    }
  }

  return (
    <Link
      ref={ref}
      component="a"
      href={props.href}
      onClick={onLinkClick}
      target={props.openInNewTab ? '_blank' : '_self'}
      color="inherit"
      underline="none"
      sx={{
        display: 'inline',
        width: 'auto',
        padding: 0,
        margin: 0
      }}
    >
      {props.children}
    </Link>
  )
})
