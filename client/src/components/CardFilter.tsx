import { useState } from 'react'
import { Card, Trait } from '@5rdb/api/index'
import {
  Button,
  ButtonGroup,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { factions, cardTypes, sides } from '../utils/enums'
import { CardTypeIcon } from './CardTypeIcon'
import ClearIcon from '@material-ui/icons/Clear'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useUiStore } from '../providers/UiStoreProvider'

const useStyles = makeStyles((theme) => ({
  filter: {
    padding: theme.spacing(1),
  },
  clearIcon: {
    color: 'dimgrey',
    fontSize: 16,
  },
  button: {
    width: 40,
    height: 40,
  },
  filterGridItem: {
    height: 40,
    margin: '4px 0',
  },
  traitTextField: {
    maxHeight: 32,
  },
}))

export interface Filter {
  text?: string
  factions?: string[]
  cardTypes?: string[]
  sides?: string[]
  traits?: string[]
}

export function applyFilters(cards: Card[], filter: Filter): Card[] {
  let filteredCards = cards
  if (filter.factions && filter.factions.length > 0) {
    filteredCards = filteredCards.filter((c) => filter.factions?.includes(c.faction))
  }
  if (filter.cardTypes && filter.cardTypes.length > 0) {
    filteredCards = filteredCards.filter((c) => filter.cardTypes?.includes(c.type))
  }
  if (filter.sides && filter.sides.length > 0) {
    filteredCards = filteredCards.filter((c) => filter.sides?.includes(c.side))
  }
  if (filter.traits && filter.traits.length > 0) {
    filteredCards = filteredCards.filter((c) =>
      filter.traits?.every((trait) => c.traits?.includes(trait))
    )
  }
  if (filter.text) {
    const query = filter.text.toLocaleLowerCase().trim()
    filteredCards = filteredCards.filter(
      (c) =>
        c.name.toLocaleLowerCase().includes(query) ||
        c.id.toLocaleLowerCase().includes(query) ||
        c.text?.toLocaleLowerCase().includes(query)
    )
  }
  return filteredCards
}

export function CardFilter(props: {
  onFilterChanged: (filter: Filter) => void
  fullWidth?: boolean
}): JSX.Element {
  const classes = useStyles()
  const { traits } = useUiStore()
  const [filterText, setFilterText] = useState('')
  const [filteredFactions, setFilteredFactions] = useState<string[]>([])
  const [filteredCardTypes, setFilteredCardTypes] = useState<string[]>([])
  const [filteredSides, setFilteredSides] = useState<string[]>([])
  const [filteredTraits, setFilteredTraits] = useState<string[]>([])
  const [filter, setFilter] = useState<Filter>()

  function setFilterAndEmitChangeEvent(filter: Filter) {
    setFilter(filter)
    props.onFilterChanged(filter)
  }

  function updateFilteredFactions(newItems: string[]) {
    setFilteredFactions(newItems)
    setFilterAndEmitChangeEvent({
      ...filter,
      factions: newItems,
    })
  }

  function updateFilteredCardTypes(newItems: string[]) {
    setFilteredCardTypes(newItems)
    setFilterAndEmitChangeEvent({
      ...filter,
      cardTypes: newItems,
    })
  }

  function updateFilteredSides(newItems: string[]) {
    setFilteredSides(newItems)
    setFilterAndEmitChangeEvent({
      ...filter,
      sides: newItems,
    })
  }

  function updateFilteredTraits(newItems: string[]) {
    setFilteredTraits(newItems)
    setFilterAndEmitChangeEvent({
      ...filter,
      traits: newItems,
    })
  }

  function updateFilterText(newText: string) {
    setFilterText(newText)
    setFilterAndEmitChangeEvent({
      ...filter,
      text: newText,
    })
  }

  function toggleItemInArray(items: string[], id: string): string[] {
    const newItems = [...items]
    if (newItems.includes(id)) {
      const index = newItems.indexOf(id)
      newItems.splice(index, 1)
    } else {
      newItems.push(id)
    }
    return newItems
  }

  function toggleFactionFilter(id: string) {
    updateFilteredFactions(toggleItemInArray(filteredFactions, id))
  }

  function toggleCardTypeFilter(id: string) {
    updateFilteredCardTypes(toggleItemInArray(filteredCardTypes, id))
  }

  function toggleSideFilter(id: string) {
    updateFilteredSides(toggleItemInArray(filteredSides, id))
  }

  const findTraits = (stringTraits?: string[]) => {
    const result: Trait[] = []
    if (stringTraits) {
      stringTraits.forEach((stringTrait) => {
        const traitItem = traits.find((item) => item.id === stringTrait)
        if (traitItem) {
          result.push(traitItem)
        }
      })
    }
    return result
  }

  return (
    <Paper className={classes.filter}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Seach for card name, ability text... (Press Enter to submit)"
            placeholder="Seach for card name, ability text..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            onBlur={(e) => updateFilterText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && updateFilterText(filterText)}
          />
        </Grid>
        <Grid item xs={12} md={props.fullWidth ? 6 : 12}>
          <Grid container spacing={1}>
            <Grid item xs={12} className={classes.filterGridItem}>
              <ButtonGroup>
                {factions.map((faction) => (
                  <Tooltip key={faction.id} title={faction.name}>
                    <Button
                      disableTouchRipple
                      onClick={() => toggleFactionFilter(faction.id)}
                      style={{
                        backgroundColor: filteredFactions.includes(faction.id) ? faction.color : '',
                      }}
                      className={classes.button}
                    >
                      <span
                        className={`icon icon-clan-${faction.id}`}
                        style={{
                          color: filteredFactions.includes(faction.id) ? 'white' : faction.color,
                        }}
                      />
                    </Button>
                  </Tooltip>
                ))}
                <Tooltip title="Clear Clan Filters">
                  <Button className={classes.button} onClick={() => updateFilteredFactions([])}>
                    <ClearIcon className={classes.clearIcon} />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} className={classes.filterGridItem}>
              <ButtonGroup>
                {cardTypes.map((type) => (
                  <Tooltip key={type.id} title={type.name}>
                    <Button
                      disableTouchRipple
                      onClick={() => toggleCardTypeFilter(type.id)}
                      style={{
                        backgroundColor: filteredCardTypes.includes(type.id) ? 'dimgrey' : 'white',
                      }}
                      className={classes.button}
                    >
                      <CardTypeIcon
                        type={type.id}
                        defaultColor={filteredCardTypes.includes(type.id) ? 'white' : 'black'}
                      />
                    </Button>
                  </Tooltip>
                ))}
                <Tooltip title="Clear Type Filters">
                  <Button className={classes.button} onClick={() => updateFilteredCardTypes([])}>
                    <ClearIcon className={classes.clearIcon} />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} className={classes.filterGridItem}>
              <ButtonGroup size="small">
                {sides.map((side) => (
                  <Tooltip key={side.id} title={side.name}>
                    <Button
                      disableTouchRipple
                      onClick={() => toggleSideFilter(side.id)}
                      style={{
                        backgroundColor: filteredSides.includes(side.id) ? 'dimgrey' : 'white',
                      }}
                    >
                      <Typography
                        variant="inherit"
                        style={{ color: filteredSides.includes(side.id) ? 'white' : 'black' }}
                      >
                        {side.name}
                      </Typography>
                    </Button>
                  </Tooltip>
                ))}
                <Tooltip title="Clear Deck Filters">
                  <Button className={classes.button} onClick={() => updateFilteredSides([])}>
                    <ClearIcon className={classes.clearIcon} />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={props.fullWidth ? 6 : 12}>
          <Grid container spacing={1}>
            <Grid item xs={12} className={classes.filterGridItem}>
              <Autocomplete
                id="combo-box-traits"
                multiple
                options={traits}
                getOptionLabel={(option) => option.name}
                value={findTraits(filteredTraits)}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Traits" variant="outlined" />
                )}
                onChange={(e, value) => updateFilteredTraits(value.map((item) => item.id))}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
