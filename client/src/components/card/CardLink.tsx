import { Popover, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react'
import { useUiStore } from '../../providers/UiStoreProvider'
import { CardInformation } from './CardInformation'
import { CardTypeIcon } from './CardTypeIcon'
import BlockIcon from '@mui/icons-material/Block'
import WarningIcon from '@mui/icons-material/Warning'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import Looks5Icon from '@mui/icons-material/Looks5'
import CachedIcon from '@mui/icons-material/Cached'
import { ElementSymbol } from './ElementSymbol'
import { EmeraldDBLink } from '../EmeraldDBLink'
import { CardInPack } from "@5rdb/api";

const PREFIX = 'CardLink';

const classes = {
  popover: `${PREFIX}-popover`,
  popoverText: `${PREFIX}-popoverText`
};

const Root = styled('span')(({
  theme
}) => ({
  [`& .${classes.popover}`]: {
    pointerEvents: 'none',
  },

  [`& .${classes.popoverText}`]: {
    padding: theme.spacing(1),
  }
}));

export function DeckbuildingRestrictionIcon(props: {
  label: string
  inFormats: string[]
  icon: JSX.Element
}): JSX.Element {
  const { relevantFormats } = useUiStore()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const open = Boolean(anchorEl)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const formatString = props.inFormats
    .map((inFormat) => relevantFormats.find((format) => format.id === inFormat)?.name || '')
    .join(', ')

  return (
    <>
      <Root onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        {props.icon}
      </Root>
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
          {props.label}: {formatString}
        </div>
      </Popover>
    </>
  );
}

export function RallyIcon(props: { formats: string[] }): JSX.Element {
  const icon = <Looks5Icon style={{ color: 'green', fontSize: 16 }} />
  return (
    <DeckbuildingRestrictionIcon
      label="Rally cards don't count towards the deck minimum in"
      inFormats={props.formats}
      icon={icon}
    />
  )
}

export function RotatedIcon(props: { formats: string[] }): JSX.Element {
  const icon = <CachedIcon style={{ color: 'red', fontSize: 16 }} />
  return (
    <DeckbuildingRestrictionIcon label="Not Legal in" inFormats={props.formats} icon={icon} />
  )
}

export function BannedIcon(props: { formats: string[] }): JSX.Element {
  const icon = <BlockIcon style={{ color: 'red', fontSize: 16 }} />
  return <DeckbuildingRestrictionIcon label="Banned in" inFormats={props.formats} icon={icon} />
}

export function RestrictedIcon(props: { formats: string[] }): JSX.Element {
  const icon = <WarningIcon style={{ color: 'orange', fontSize: 16 }} />
  return <DeckbuildingRestrictionIcon label="Restricted in" inFormats={props.formats} icon={icon} />
}

export function SplashBannedIcon(props: { formats: string[] }): JSX.Element {
  const icon = <LinkOffIcon style={{ color: 'blue', fontSize: 16 }} />
  return (
    <DeckbuildingRestrictionIcon
      label="Influence Removed in"
      inFormats={props.formats}
      icon={icon}
    />
  )
}

export function CardLink(props: {
  cardId: string
  sameTab?: boolean
  format?: string
  notClickable?: boolean
}): JSX.Element {
  const { cards, relevantFormats, validCardVersionForFormat } = useUiStore()
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
  let legalVersion: Omit<CardInPack, 'card_id'> | undefined = card.versions[0]
  const format = relevantFormats.find(f => f.id === props.format)
  if (format) {
    legalVersion = validCardVersionForFormat(card.id, format.id)
    if (legalVersion && format.id === 'emerald' && legalVersion.rotated) {
      legalVersion = undefined
    }
  }

  const open = Boolean(anchorEl)
  const cardImage = legalVersion?.image_url

  let bannedFormats = card.banned_in?.filter(f => relevantFormats.some(rf => rf.id === f)) || []
  let restrictedFormats = card.restricted_in?.filter(f => relevantFormats.some(rf => rf.id === f)) || []
  let splashBannedFormats = card.splash_banned_in?.filter(f => relevantFormats.some(rf => rf.id === f)) || []
  let rallyFormats: string[] = []


  if (props.format) {
    bannedFormats = bannedFormats.filter((format) => format === props.format)
    restrictedFormats = restrictedFormats.filter((format) => format === props.format)
    splashBannedFormats = splashBannedFormats.filter((format) => format === props.format)
  }
  if (
    (props.format === 'emerald' || props.format === 'obsidian') &&
    card.text?.includes('Rally.')
  ) {
    rallyFormats = ['emerald', 'obsidian']
  }

  return (
    <span>
      <EmeraldDBLink
        href={`/card/${card.id}`}
        notClickable={props.notClickable}
        openInNewTab={!props.sameTab}
      >
        <span onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
          <CardTypeIcon type={card.type} faction={card.faction} />
          {card.is_unique && (
            <>
              {' '}
              <span className={`icon icon-unique`} style={{ fontSize: 12 }} />
            </>
          )}{' '}
          {card.name}{' '}
          {card.elements?.map((element) => (
            <ElementSymbol element={element} key={element} withoutName />
          ))}
        </span>
        <span>
          {bannedFormats.length > 0 && <BannedIcon formats={bannedFormats} />}
          {restrictedFormats.length > 0 && <RestrictedIcon formats={restrictedFormats} />}
          {splashBannedFormats.length > 0 && <SplashBannedIcon formats={splashBannedFormats} />}
          {rallyFormats.length > 0 && <RallyIcon formats={rallyFormats} />}
          {format && !legalVersion && (
            <RotatedIcon formats={[format.id]} />
          )}
        </span>
      </EmeraldDBLink>
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
          <CardInformation cardWithVersions={card} currentVersion={legalVersion}/>
        )}
      </Popover>
    </span>
  )
}
