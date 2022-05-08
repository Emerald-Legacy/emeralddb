import { Fab, makeStyles, Popover, Theme } from '@material-ui/core'
import { useState } from 'react'
import { useUiStore } from '../../providers/UiStoreProvider'
import { CardInformation } from './CardInformation'
import ZoomInIcon from '@material-ui/icons/ZoomIn'

const useStyles = makeStyles((theme: Theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  popoverText: {
    padding: theme.spacing(1),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(0.5),
  },
}))

export function CardImageOrText(props: {
  cardId: string
  onClick?: (id: string) => void
  packId?: string
}): JSX.Element {
  const { cards } = useUiStore()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const classes = useStyles()

  const card = cards.find((card) => card.id === props.cardId)
  if (!card) {
    return <span>Unknown Card ID</span>
  }

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const cardImage = card.versions.length > 0 && card.versions[0].image_url
  return (
    <div style={{ position: 'relative', height: '95%' }}>
      {cardImage ? (
        <img src={cardImage} height={'90%'} width={'100%'} />
      ) : (
        <CardInformation cardWithVersions={card} currentVersionPackId={props.packId} />
      )}
      <Fab
        className={classes.fab}
        color={'secondary'}
        size="small"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        onClick={() => (props.onClick ? props.onClick(props.cardId) : {})}
      >
        <ZoomInIcon />
      </Fab>
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
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {cardImage ? (
          <img src={cardImage} style={{ width: 300, height: 420 }} />
        ) : (
          <CardInformation cardWithVersions={card} currentVersionPackId={props.packId} />
        )}
      </Popover>
    </div>
  )
}
