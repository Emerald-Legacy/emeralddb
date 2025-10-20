import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'

export function EmeraldDBLink(props: {
  href: string
  onClick?: () => void
  children: React.ReactNode
  notClickable?: boolean
  openInNewTab?: boolean
}): JSX.Element {
  const navigate = useNavigate()

  function goTo(route: string) {
    navigate(route)
  }

  function onLinkClick(
    event:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
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
      href={props.href}
      onClick={onLinkClick}
      target={props.openInNewTab ? '_blank' : '_self'}
      color="inherit"
      underline="none"
    >
      {props.children}
    </Link>
  )
}
