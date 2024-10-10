import { Format } from '@5rdb/api'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { makeStyles, Popover, Theme, Typography } from '@material-ui/core'
import React, { useState } from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  popoverText: {
    padding: theme.spacing(1),
  }
}))

export function FormatWithInfo(props: {
  format: Format
}): JSX.Element {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  const hasInfo = props.format.description || props.format.maintainer

  return (
    <>
      <span>{props.format.name} {hasInfo && (
        <span onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
          <InfoOutlinedIcon />
        </span>
      )}</span>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className={classes.popoverText}>
          {props.format.description && (
            <Typography>
              <b>Description: </b>
              {props.format.description}
            </Typography>
          )}
          {props.format.maintainer && (
            <Typography>
              <b>Maintainer: </b> {props.format.maintainer}
            </Typography>
          )}
        </div>
      </Popover>
    </>
  )
}
