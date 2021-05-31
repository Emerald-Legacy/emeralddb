import { Card, CardWithVersions } from "@5rdb/api"
import { Box, Typography, Grid, makeStyles } from "@material-ui/core"
import { useUiStore } from "../../providers/UiStoreProvider"
import { convertTraitList } from "../../utils/cardTextUtils"
import { getColorForFactionId } from "../../utils/factionUtils"
import { capitalize } from "../../utils/stringUtils"
import { CardText } from "./CardText"

const useStyles = makeStyles(() => ({
  clanMon: {
    width: 60,
    height: 60,
    float: 'right'
  },
  deckLabel: {
    float: 'right',
    fontSize: 14
  },
  stats: {
    fontSize: 14
  },
  packInfo: {
    fontSize: 12
  },
  crossedOutStats: {
    fontSize: 14,
    textDecoration: 'line-through'
  },
  block: {
    marginBottom: 10 
  }
}))

export const FormattedValueOrCrossedOut = (props: {value: string | undefined, label: string, icon?: string}) => {
  const classes = useStyles()
  if (props.value === undefined || props.value === null) {
    return (<Typography className={classes.crossedOutStats}><b>{props.label}</b></Typography>)
    } else {
    return (<Typography className={classes.stats}><b>{props.label}:</b> {props.value}{props.icon && <span className={`icon icon-${props.icon}`}></span>}</Typography>)
  }
}

const CostElement = (props: {cost: string | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.cost} label="Cost"/>
}

const MilitaryElement = (props: {military: string | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.military} label="Military" icon="conflict-military"/>
}

const PoliticalElement = (props: {political: string | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.political} label="Political" icon="conflict-political"/>
}

const MilitaryBonusElement = (props: {militaryBonus: string | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.militaryBonus} label="Military Bonus" icon="conflict-military"/>
}

const PoliticalBonusElement = (props: {politicalBonus: string | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.politicalBonus} label="Political Bonus" icon="conflict-political"/>
}

const GloryElement = (props: {glory: number | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.glory?.toString()} label="Glory"/>
}

const StrengthBonusElement = (props: {strengthBonus: string | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.strengthBonus} label="Strength Bonus"/>
}

const StrengthElement = (props: {strength: string | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.strength} label="Strength"/>
}

const HonorElement = (props: {honor: number | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.honor?.toString()} label="Honor"/>
}

const FateElement = (props: {fate: number | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.fate?.toString()} label="Fate"/>
}

const InfluenceElement = (props: {influence: number | undefined}) => {
  return <FormattedValueOrCrossedOut value={props.influence?.toString()} label="Influence"/>
}

const ElementsElement = (props: {elements: string[]}) => {
  const classes = useStyles()
  return <Typography className={classes.stats}>
      <b>Elements: </b>
      {props.elements.map(element => (
        <span key={element}>
          <span className={`icon icon-element-${element}`} />
          <span> {capitalize(element)}. </span>
        </span>))}
    </Typography>
}

export const CardInformation = (props: {cardWithVersions: CardWithVersions, currentVersionPackId?: string}) => {
  const classes = useStyles()
  const { traits, packs } = useUiStore()
  const card = props.cardWithVersions
  const version = props.currentVersionPackId && props.cardWithVersions.versions.find(version => version.pack_id === props.currentVersionPackId)
  const packName = props.currentVersionPackId && packs.find(pack => pack.id === props.currentVersionPackId)?.name

  const textLines = card.text?.split('\n') || []
  const color = getColorForFactionId(card.clan)
  
  const getCardStatInfo = (card: Card) => {
    if (card.type === 'event') {
      return <CostElement cost={card.cost} />
    }
    if (card.type === 'character') {
      return <span>
        <CostElement cost={card.cost} />
        <MilitaryElement military={card.military} />
        <PoliticalElement political={card.political} />
        <GloryElement glory={card.glory} />
      </span>
    }
    if (card.type === 'attachment') {
      return <span>
        <CostElement cost={card.cost} />
        <MilitaryBonusElement militaryBonus={card.military_bonus} />
        <PoliticalBonusElement politicalBonus={card.political_bonus} />
      </span>
    }
    if (card.type === 'province') {
      return <span>
        <ElementsElement elements={card.elements || []} />
        <StrengthElement strength={card.strength} />
      </span>
    }
    if (card.type === 'stronghold') {
      return <span>
        <StrengthBonusElement strengthBonus={card.strength_bonus} />
        <HonorElement honor={card.honor} />
        <FateElement fate={card.fate} />
        <InfluenceElement influence={card.influence_pool} />
      </span>
    }
    if (card.type === 'holding') {
      return <StrengthBonusElement strengthBonus={card.strength_bonus} />
    }
    return <span/>
  }

  return (<Box border="solid 1px" padding="15px" borderRadius="3px">
  <Grid container className={classes.block}>
    <Grid item xs={10}>
      <Typography variant='h5'style={{color: color}}>
        {card.is_unique && (<span className="icon icon-unique"/>)}{card.name}
      </Typography>
      <Typography variant='subtitle1'>
          <em><b>{capitalize(card.clan)} {capitalize(card.type)}. {convertTraitList(card.traits || [], traits)}</b></em>
      </Typography>
    </Grid>
    <Grid item xs={2}>
      <img src={`/static/svg/clan/${card.clan}.svg`} className={classes.clanMon}/>
    </Grid>
  </Grid>
  <Grid container className={classes.block}>
    <Grid item xs={12}>
      {getCardStatInfo(card)}
    </Grid>
  </Grid>
  <Grid container>
    <Grid item xs={12}>
      <Box
          borderColor={color}
          borderLeft={5}
          paddingLeft='10px'
      >
          {textLines.map((line, idx) => <p key={idx}><CardText text={line}/></p>)}
      </Box>
    </Grid>
  </Grid>
  <Grid container className={classes.block}>
    <Grid item xs={12}>
      <Typography className={classes.deckLabel}>
        <span>{capitalize(card.side)} Deck</span>
        {card.side === 'conflict' && <span>
          {card.influence_cost === null ? ' - No Influence Cost' : ` - Influence Cost: ${card.influence_cost}`}
        </span>}
      </Typography>
    </Grid>
  </Grid>
  {version && version.flavor && (<Grid container className={classes.block}>
    <Grid item xs={12} >
      <Typography align='center' className={classes.stats}><i>{version.flavor}</i></Typography>
    </Grid>
  </Grid>)}
  {version && (<Grid container className={classes.block}>
    <Grid item xs={12} >
      <Typography className={classes.packInfo}>{packName} #{version.position} - Illustrator: {version.illustrator || 'N/A'}</Typography>
    </Grid>
  </Grid>)}
</Box>)
}