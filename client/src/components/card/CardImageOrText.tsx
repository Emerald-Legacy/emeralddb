import { Fab, Popover, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react'
import { useUiStore } from '../../providers/UiStoreProvider'
import { CardInformation } from './CardInformation'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import { CardInPack } from "@5rdb/api";

const PREFIX = 'CardImageOrText';

const classes = {
  popover: `${PREFIX}-popover`,
  popoverText: `${PREFIX}-popoverText`,
  fab: `${PREFIX}-fab`
};

const Root = styled('div')(({
  theme
}) => ({
  [`& .${classes.popover}`]: {
    pointerEvents: 'none',
  },

  [`& .${classes.popoverText}`]: {
    padding: theme.spacing(1),
  },

  [`& .${classes.fab}`]: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(0.5),
  }
}));

export function CardImageOrText(props: {
  cardId: string
  onClick?: (id: string) => void
  cardVersion: Omit<CardInPack, "card_id"> | undefined
}): JSX.Element {
  const { cards } = useUiStore()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)


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
  const cardVersion = props.cardVersion || card.versions[0]
  const cardImage = cardVersion && cardVersion.image_url
  return (
    <Root style={{ position: 'relative', height: '95%' }}>
      {cardImage ? (
        <img src={cardImage} height={'90%'} width={'100%'} />
      ) : (
        <CardInformation cardWithVersions={card} currentVersion={cardVersion} />
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
          <CardInformation cardWithVersions={card} currentVersion={cardVersion} />
        )}
      </Popover>
    </Root>
  );
}
