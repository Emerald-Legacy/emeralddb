import { useEffect, useReducer, useState } from 'react'
import { CardWithVersions, Trait } from '@5rdb/api/index'
import {
  Button,
  ButtonGroup,
  lighten,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Collapse,
} from '@material-ui/core'
import { factions, cardTypes, sides, formats } from '../utils/enums'
import { CardTypeIcon } from './CardTypeIcon'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useUiStore } from '../providers/UiStoreProvider'
import { CycleList } from './CycleList'
import useDebounce from '../hooks/useDebounce'
import { isEqual } from 'lodash'
import { CardValueFilter, ValueFilterType } from './CardValueFilter'

const useStyles = makeStyles((theme) => ({
  filter: {
    padding: theme.spacing(1),
  },
  clearIcon: {
    color: 'black',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: theme.palette.error.light,
    '&:hover': {
      backgroundColor: lighten(theme.palette.error.light, 0.1),
    },
  },
  button: {
    height: 32,
    minWidth: 16,
  },
  filterGridItem: {
    height: 40,
    margin: '4px 0',
  },
  traitTextField: {
    maxHeight: 32,
  },
  packDialog: {
    padding: theme.spacing(2),
  },
  packFilter: {
    minWidth: '60%',
  },
}))

enum NumericCardValue {
  COST,
  MILITARY,
  POLITICAL,
  STRENGTH,
  GLORY,
  INFLUENCE,
}

interface NumericFilterTypeAndValue {
  type: ValueFilterType
  value: string
}

interface NumericValueFilter {
  name: NumericCardValue
  typeAndValue: NumericFilterTypeAndValue
}

export interface FilterState {
  text: string
  factions: string[]
  cardTypes: string[]
  sides: string[]
  traits: string[]
  packs: string[]
  cycles: string[]
  numericValues: NumericValueFilter[]
  restricted: string
  banned: string
}

enum FilterType {
  FILTER_ALL,
  FILTER_TEXT,
  FILTER_FACTIONS,
  FILTER_CARD_TYPES,
  FILTER_SIDES,
  FILTER_TRAITS,
  FILTER_PACKS,
  FILTER_CYCLES,
  FILTER_PACKS_AND_CYCLES,
  FILTER_RESTRICTED,
  FILTER_BANNED,
  FILTER_NUMERIC_VALUES,
  FILTER_RESET,
}

type FilterAction =
  | { type: FilterType.FILTER_ALL; filter: FilterState }
  | { type: FilterType.FILTER_TEXT; text: string }
  | { type: FilterType.FILTER_FACTIONS; factions: string[] }
  | { type: FilterType.FILTER_CARD_TYPES; cardTypes: string[] }
  | { type: FilterType.FILTER_SIDES; sides: string[] }
  | { type: FilterType.FILTER_TRAITS; traits: string[] }
  | { type: FilterType.FILTER_PACKS; packs: string[] }
  | { type: FilterType.FILTER_CYCLES; cycles: string[] }
  | { type: FilterType.FILTER_PACKS_AND_CYCLES; packs: string[]; cycles: string[] }
  | { type: FilterType.FILTER_RESTRICTED; format: string }
  | { type: FilterType.FILTER_BANNED; format: string }
  | { type: FilterType.FILTER_NUMERIC_VALUES; numericValues: NumericValueFilter[] }
  | { type: FilterType.FILTER_RESET }

function checkSingleValue(value: string | undefined, filter: NumericFilterTypeAndValue): boolean {
  if (!value) {
    return false
  }
  switch (filter.type) {
    case ValueFilterType.EQUAL: {
      return value === filter.value
    }
    case ValueFilterType.GREATER: {
      const inputNumber = Number.parseInt(value)
      const filterNumber = Number.parseInt(filter.value)
      if (isNaN(inputNumber) || isNaN(filterNumber)) {
        return false
      }
      return inputNumber > filterNumber
    }
    case ValueFilterType.LOWER: {
      const inputNumber = Number.parseInt(value)
      const filterNumber = Number.parseInt(filter.value)
      if (isNaN(inputNumber) || isNaN(filterNumber)) {
        return false
      }
      return inputNumber < filterNumber
    }
  }
}

function checkMultipleValues(
  values: (string | undefined)[],
  filter: NumericFilterTypeAndValue
): boolean {
  return values?.some((value) => checkSingleValue(value, filter))
}

function filterNumericCardValues(card: CardWithVersions, filters: NumericValueFilter[]): boolean {
  return filters.every((filter) => {
    if (filter.typeAndValue === undefined) {
      return true
    } else {
      switch (filter.name) {
        case NumericCardValue.COST:
          return checkSingleValue(card.cost, filter.typeAndValue)
        case NumericCardValue.INFLUENCE:
          return checkSingleValue('' + card.influence_cost, filter.typeAndValue)
        case NumericCardValue.MILITARY:
          return checkMultipleValues([card.military, card.military_bonus], filter.typeAndValue)
        case NumericCardValue.POLITICAL:
          return checkMultipleValues([card.political, card.political_bonus], filter.typeAndValue)
        case NumericCardValue.GLORY:
          return checkSingleValue('' + card.glory, filter.typeAndValue)
        case NumericCardValue.STRENGTH:
          return checkMultipleValues([card.strength, card.strength_bonus], filter.typeAndValue)
      }
    }
    // Needed for eslint /shrug
    return true
  })
}

export function applyFilters(cards: CardWithVersions[], filter: FilterState): CardWithVersions[] {
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
  if (filter.packs && filter.packs.length > 0) {
    filteredCards = filteredCards.filter((c) =>
      c.versions?.some((version) => filter.packs?.includes(version.pack_id))
    )
  }
  if (filter.restricted) {
    filteredCards = filteredCards.filter((c) => c.restricted_in?.includes(filter.restricted))
  }
  if (filter.banned) {
    filteredCards = filteredCards.filter((c) => c.banned_in?.includes(filter.banned))
  }
  if (filter.numericValues) {
    filteredCards = filteredCards.filter((c) => filterNumericCardValues(c, filter.numericValues))
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

const initialState: FilterState = {
  cardTypes: [],
  factions: [],
  packs: [],
  sides: [],
  text: '',
  traits: [],
  cycles: [],
  numericValues: [],
  restricted: '',
  banned: '',
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case FilterType.FILTER_ALL:
      return { ...action.filter }
    case FilterType.FILTER_TEXT:
      return { ...state, text: action.text }
    case FilterType.FILTER_FACTIONS:
      return { ...state, factions: action.factions }
    case FilterType.FILTER_CARD_TYPES:
      return { ...state, cardTypes: action.cardTypes }
    case FilterType.FILTER_SIDES:
      return { ...state, sides: action.sides }
    case FilterType.FILTER_TRAITS:
      return { ...state, traits: action.traits }
    case FilterType.FILTER_PACKS:
      return { ...state, packs: action.packs }
    case FilterType.FILTER_CYCLES:
      return { ...state, cycles: action.cycles }
    case FilterType.FILTER_PACKS_AND_CYCLES:
      return { ...state, packs: action.packs, cycles: action.cycles }
    case FilterType.FILTER_RESTRICTED:
      return { ...state, restricted: action.format }
    case FilterType.FILTER_BANNED:
      return { ...state, banned: action.format }
    case FilterType.FILTER_NUMERIC_VALUES:
      return { ...state, numericValues: [...action.numericValues] }
    case FilterType.FILTER_RESET:
      return initialState
  }
}

export function CardFilter(props: {
  filterState: FilterState | undefined
  onFilterChanged: (filter: FilterState) => void
  fullWidth?: boolean
  deckbuilder?: boolean
}): JSX.Element {
  const classes = useStyles()
  const { traits } = useUiStore()
  const [initialFilterState, setInitialFilterState] = useState<FilterState>(
    props.filterState || initialState
  )
  const [filterState, dispatchFilter] = useReducer(filterReducer, initialFilterState)
  const [searchTerm, setSearchTerm] = useState(props.filterState?.text || '')
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  useEffect(() => {
    dispatchFilter({ type: FilterType.FILTER_TEXT, text: debouncedSearchTerm })
  }, [debouncedSearchTerm])

  const [packModalOpen, setPackModalOpen] = useState(false)

  if (props.filterState && !isEqual(initialFilterState, props.filterState)) {
    if (props.filterState.text) {
      setSearchTerm(props.filterState.text)
    }
    dispatchFilter({ type: FilterType.FILTER_ALL, filter: props.filterState })
    setInitialFilterState(props.filterState)
  }

  useEffect(() => props.onFilterChanged(filterState), [filterState])

  const visibleFactions = props.deckbuilder
    ? factions.filter((faction) => faction.id !== 'shadowlands')
    : factions
  const visibleCardtypes = props.deckbuilder
    ? cardTypes.filter((cardType) => cardType.id !== 'treaty' && cardType.id !== 'warlord')
    : cardTypes
  const visibleSides = props.deckbuilder
    ? sides.filter((side) => side.id !== 'treaty')
    : sides.filter((side) => side.id !== 'treaty' && side.id !== 'role')

  function updateFilteredPacksAndCycles(newPackIds: string[], newCycleIds: string[]) {
    dispatchFilter({
      type: FilterType.FILTER_PACKS_AND_CYCLES,
      packs: newPackIds,
      cycles: newCycleIds,
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
    const newFactions = toggleItemInArray(filterState.factions, id)
    dispatchFilter({ type: FilterType.FILTER_FACTIONS, factions: newFactions })
  }

  function toggleCardTypeFilter(id: string) {
    const newCardTypes = toggleItemInArray(filterState.cardTypes, id)
    dispatchFilter({ type: FilterType.FILTER_CARD_TYPES, cardTypes: newCardTypes })
  }

  function toggleSideFilter(id: string) {
    const newSides = toggleItemInArray(filterState.sides, id)
    dispatchFilter({ type: FilterType.FILTER_SIDES, sides: newSides })
  }

  function updateNumericFilter(
    valueType: NumericCardValue,
    filterType: ValueFilterType,
    value: string
  ) {
    const newFilters = [...filterState.numericValues]
    const index = newFilters.findIndex((filter) => filter.name === valueType)
    if (index >= 0) {
      newFilters.splice(index, 1)
    }
    if (value) {
      newFilters.push({ name: valueType, typeAndValue: { type: filterType, value: value } })
    }
    dispatchFilter({ type: FilterType.FILTER_NUMERIC_VALUES, numericValues: newFilters })
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
      <Grid container spacing={1} justify="flex-end">
        <Grid item xs={12} sm={8} md={10}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Seach for card name, ability text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Collapse in={showFilters}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={props.fullWidth ? 6 : 12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} className={classes.filterGridItem}>
                    <ButtonGroup fullWidth>
                      {visibleFactions.map((faction) => (
                        <Tooltip key={faction.id} title={faction.name}>
                          <Button
                            disableTouchRipple
                            onClick={() => toggleFactionFilter(faction.id)}
                            style={{
                              backgroundColor: filterState.factions.includes(faction.id)
                                ? faction.color
                                : '',
                            }}
                            className={classes.button}
                          >
                            <span
                              className={`icon icon-clan-${faction.id}`}
                              style={{
                                color: filterState.factions.includes(faction.id)
                                  ? 'white'
                                  : faction.color,
                              }}
                            />
                          </Button>
                        </Tooltip>
                      ))}
                    </ButtonGroup>
                  </Grid>
                  <Grid item xs={12} className={classes.filterGridItem}>
                    <ButtonGroup fullWidth>
                      {visibleCardtypes.map((type) => (
                        <Tooltip key={type.id} title={type.name}>
                          <Button
                            disableTouchRipple
                            onClick={() => toggleCardTypeFilter(type.id)}
                            style={{
                              backgroundColor: filterState.cardTypes.includes(type.id)
                                ? 'dimgrey'
                                : 'white',
                            }}
                            className={classes.button}
                          >
                            <CardTypeIcon
                              type={type.id}
                              defaultColor={
                                filterState.cardTypes.includes(type.id) ? 'white' : 'black'
                              }
                            />
                          </Button>
                        </Tooltip>
                      ))}
                    </ButtonGroup>
                  </Grid>
                  <Grid item xs={12} className={classes.filterGridItem}>
                    <ButtonGroup size="small" fullWidth>
                      {visibleSides.map((side) => (
                        <Tooltip key={side.id} title={side.name}>
                          <Button
                            disableTouchRipple
                            onClick={() => toggleSideFilter(side.id)}
                            style={{
                              backgroundColor: filterState.sides.includes(side.id)
                                ? 'dimgrey'
                                : 'white',
                            }}
                          >
                            <Typography
                              variant="inherit"
                              style={{
                                color: filterState.sides.includes(side.id) ? 'white' : 'black',
                              }}
                            >
                              {side.name}
                            </Typography>
                          </Button>
                        </Tooltip>
                      ))}
                    </ButtonGroup>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={props.fullWidth ? 6 : 12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Autocomplete
                      id="combo-box-traits"
                      multiple
                      options={traits}
                      getOptionLabel={(option) => option.name}
                      value={findTraits(filterState.traits)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" label="Traits" variant="outlined" />
                      )}
                      onChange={(e, value) =>
                        dispatchFilter({
                          type: FilterType.FILTER_TRAITS,
                          traits: value.map((item) => item.id),
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="combo-box-restricted-in"
                      options={formats}
                      getOptionLabel={(option) => option?.name || ''}
                      value={formats.find((format) => format.id === filterState.restricted)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Restricted In"
                          variant="outlined"
                        />
                      )}
                      onChange={(e, value) =>
                        dispatchFilter({
                          type: FilterType.FILTER_RESTRICTED,
                          format: value?.id || '',
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="combo-box-banned-in"
                      options={formats}
                      getOptionLabel={(option) => option?.name || ''}
                      value={formats.find((format) => format.id === filterState.banned)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" label="Banned In" variant="outlined" />
                      )}
                      onChange={(e, value) =>
                        dispatchFilter({ type: FilterType.FILTER_BANNED, format: value?.id || '' })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => setPackModalOpen(true)}
                    >
                      Filter Packs
                      {filterState.packs.length > 0 && ` (Selected: ${filterState.packs.length})`}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CardValueFilter
                  valueLabel={<span className={`icon icon-conflict-military`} />}
                  onFilterChange={(type, value) =>
                    updateNumericFilter(NumericCardValue.MILITARY, type, value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CardValueFilter
                  valueLabel={<span className={`icon icon-conflict-political`} />}
                  onFilterChange={(type, value) =>
                    updateNumericFilter(NumericCardValue.POLITICAL, type, value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CardValueFilter
                  valueLabel={<span>Cost:</span>}
                  onFilterChange={(type, value) =>
                    updateNumericFilter(NumericCardValue.COST, type, value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CardValueFilter
                  valueLabel={<span>Influence:</span>}
                  onFilterChange={(type, value) =>
                    updateNumericFilter(NumericCardValue.INFLUENCE, type, value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CardValueFilter
                  valueLabel={<span>Glory:</span>}
                  onFilterChange={(type, value) =>
                    updateNumericFilter(NumericCardValue.GLORY, type, value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CardValueFilter
                  valueLabel={<span>Strength:</span>}
                  onFilterChange={(type, value) =>
                    updateNumericFilter(NumericCardValue.STRENGTH, type, value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  fullWidth
                  variant="contained"
                  className={`${classes.button} ${classes.clearButton}`}
                  onClick={() => dispatchFilter({ type: FilterType.FILTER_RESET })}
                >
                  Reset filters
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
      <Dialog
        open={packModalOpen}
        onClose={() => setPackModalOpen(false)}
        className={classes.packDialog}
      >
        <DialogTitle id="form-dialog-title">Filter Packs</DialogTitle>
        <DialogContent>
          <div className={classes.packFilter}>
            <CycleList
              withCheckbox
              rootLabel="All Packs"
              onSelection={updateFilteredPacksAndCycles}
              selectedPacks={filterState.packs}
              selectedCycles={filterState.cycles}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPackModalOpen(false)} variant="contained" fullWidth>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
