import { useEffect, useReducer, useState } from 'react'
import { CardWithVersions, Trait, RoleRestriction } from '@5rdb/api'
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
import { factions, cardTypes, sides, formats, elements, roleRestrictions } from '../utils/enums'
import { CardTypeIcon } from './card/CardTypeIcon'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useUiStore } from '../providers/UiStoreProvider'
import { CycleList } from './CycleList'
import useDebounce from '../hooks/useDebounce'
import { isEqual } from 'lodash'
import { CardValueFilter, ValueFilterType } from './CardValueFilter'
import { ElementSymbol } from './card/ElementSymbol'

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
  filterGridItemBuilder: {
    height: 40,
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
  elements: string[]
  roleRestrictions: string[]
  packs: string[]
  cycles: string[]
  numericValues: NumericValueFilter[]
  restricted: string
  banned: string
  isUnique: string
}

enum FilterType {
  FILTER_ALL,
  FILTER_TEXT,
  FILTER_FACTIONS,
  FILTER_CARD_TYPES,
  FILTER_SIDES,
  FILTER_TRAITS,
  FILTER_ELEMENTS,
  FILTER_ROLE_RESTRICTIONS,
  FILTER_PACKS,
  FILTER_CYCLES,
  FILTER_PACKS_AND_CYCLES,
  FILTER_RESTRICTED,
  FILTER_BANNED,
  FILTER_IS_UNIQUE,
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
  | { type: FilterType.FILTER_ELEMENTS; elements: string[] }
  | { type: FilterType.FILTER_ROLE_RESTRICTIONS; restrictions: string[] }
  | { type: FilterType.FILTER_PACKS; packs: string[] }
  | { type: FilterType.FILTER_CYCLES; cycles: string[] }
  | { type: FilterType.FILTER_PACKS_AND_CYCLES; packs: string[]; cycles: string[] }
  | { type: FilterType.FILTER_RESTRICTED; format: string }
  | { type: FilterType.FILTER_BANNED; format: string }
  | { type: FilterType.FILTER_IS_UNIQUE; isUnique: string }
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
        case NumericCardValue.MILITARY: {
          let military = card.military
          if (card.type === 'character' && !military) {
            military = '-'
          }
          return checkMultipleValues([military, card.military_bonus], filter.typeAndValue)
        }
        case NumericCardValue.POLITICAL: {
          let political = card.political
          if (card.type === 'character' && !political) {
            political = '-'
          }
          return checkMultipleValues([political, card.political_bonus], filter.typeAndValue)
        }
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
  if (filter.elements && filter.elements.length > 0) {
    filteredCards = filteredCards.filter((c) =>
      filter.elements?.find((element) => c.elements?.includes(element))
    )
  }
  if (filter.roleRestrictions && filter.roleRestrictions.length > 0) {
    filteredCards = filteredCards.filter((c) =>
      filter.roleRestrictions?.find((restriction) => c.role_restrictions.includes(restriction))
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
  if (filter.isUnique) {
    filteredCards = filteredCards.filter((c) => c.is_unique === (filter.isUnique === 'true'))
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
        c.text?.toLocaleLowerCase().includes(query) ||
        c.traits?.some((trait) => trait.toLowerCase().includes(query))
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
  elements: [],
  roleRestrictions: [],
  cycles: [],
  numericValues: [],
  restricted: '',
  banned: '',
  isUnique: '',
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case FilterType.FILTER_ALL:
      return { ...action.filter }
    case FilterType.FILTER_TEXT:
      return { ...state, text: action.text }
    case FilterType.FILTER_FACTIONS:
      return { ...state, factions: action.factions }
    case FilterType.FILTER_CARD_TYPES: {
      const elements = action.cardTypes.includes('province') ? state.elements : []
      return { ...state, cardTypes: action.cardTypes, elements: elements }
    }
    case FilterType.FILTER_SIDES:
      return { ...state, sides: action.sides }
    case FilterType.FILTER_TRAITS:
      return { ...state, traits: action.traits }
    case FilterType.FILTER_ELEMENTS:
      return { ...state, elements: action.elements }
    case FilterType.FILTER_ROLE_RESTRICTIONS:
      return { ...state, roleRestrictions: action.restrictions }
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
    case FilterType.FILTER_IS_UNIQUE:
      return { ...state, isUnique: action.isUnique }
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

  const uniqueOptions = [
    { id: 'true', name: 'Yes' },
    { id: 'false', name: 'No' },
  ]

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

  function toggleElementFilter(id: string) {
    const newElements = toggleItemInArray(filterState.elements, id)
    dispatchFilter({ type: FilterType.FILTER_ELEMENTS, elements: newElements })
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

  const findRoleRestrictions = (stringRestrictions?: string[]) => {
    const result: RoleRestriction[] = []
    if (stringRestrictions) {
      stringRestrictions.forEach((stringRestriction) => {
        const restrictionItem = roleRestrictions.find((item) => item.id === stringRestriction)
        if (restrictionItem) {
          result.push(restrictionItem)
        }
      })
    }
    return result
  }

  return (
    <Paper className={classes.filter}>
      <Grid container spacing={1} justify="flex-end">
        <Grid item xs={12} sm={8} md={!props.fullWidth ? 6 : 10}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label={props.deckbuilder ? 'Search...' : 'Search for card name, ability text...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={!props.fullWidth ? 6 : 2}>
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
          <Grid container spacing={1}>
            <Grid item xs={12} md={props.fullWidth ? 6 : 12}>
              <Collapse in={props.deckbuilder || showFilters}>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    className={
                      props.deckbuilder ? classes.filterGridItemBuilder : classes.filterGridItem
                    }
                  >
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
                  <Grid
                    item
                    xs={12}
                    className={
                      props.deckbuilder ? classes.filterGridItemBuilder : classes.filterGridItem
                    }
                  >
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
                  {filterState.cardTypes.includes('province') && (
                    <Grid
                      item
                      xs={12}
                      className={
                        props.deckbuilder ? classes.filterGridItemBuilder : classes.filterGridItem
                      }
                    >
                      <ButtonGroup fullWidth>
                        {elements.map((element) => (
                          <Tooltip key={element.id} title={element.name}>
                            <Button
                              disableTouchRipple
                              onClick={() => toggleElementFilter(element.id)}
                              style={{
                                backgroundColor: filterState.elements.includes(element.id)
                                  ? 'dimgrey'
                                  : 'white',
                              }}
                              className={classes.button}
                            >
                              <span
                                style={{
                                  color: filterState.elements.includes(element.id)
                                    ? 'white'
                                    : 'black',
                                }}
                              >
                                <ElementSymbol
                                  element={element.id}
                                  withoutName={props.deckbuilder || false}
                                />
                              </span>
                            </Button>
                          </Tooltip>
                        ))}
                      </ButtonGroup>
                    </Grid>
                  )}
                  <Grid
                    item
                    xs={12}
                    className={
                      props.deckbuilder ? classes.filterGridItemBuilder : classes.filterGridItem
                    }
                  >
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
              </Collapse>
            </Grid>
            <Grid item xs={12} md={props.fullWidth ? 6 : 12}>
              <Collapse in={showFilters}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Autocomplete
                      id="combo-box-traits"
                      autoHighlight
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
                      id="combo-box-is-unique"
                      autoHighlight
                      options={uniqueOptions}
                      getOptionLabel={(option) => option?.name || ''}
                      value={uniqueOptions.find((option) => option.id === filterState.isUnique)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" label="Is Unique" variant="outlined" />
                      )}
                      onChange={(e, value) =>
                        dispatchFilter({
                          type: FilterType.FILTER_IS_UNIQUE,
                          isUnique: value?.id || '',
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="combo-box-restricted-in"
                      autoHighlight
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
                      autoHighlight
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
                  <Grid item xs={6}>
                    <Autocomplete
                      id="combo-box-role-restriction-in"
                      autoHighlight
                      options={roleRestrictions}
                      multiple
                      getOptionLabel={(option) => option?.name || ''}
                      value={findRoleRestrictions(filterState.roleRestrictions)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Role Restriction"
                          variant="outlined"
                        />
                      )}
                      onChange={(e, value) =>
                        dispatchFilter({
                          type: FilterType.FILTER_ROLE_RESTRICTIONS,
                          restrictions: value.map((item) => item.id),
                        })
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
              </Collapse>
            </Grid>
            <Grid item xs={12}>
              <Collapse in={showFilters}>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    sm={props.deckbuilder ? 12 : 6}
                    md={props.deckbuilder ? 12 : 4}
                  >
                    <CardValueFilter
                      valueLabel={<span className={`icon icon-conflict-military`} />}
                      onFilterChange={(type, value) =>
                        updateNumericFilter(NumericCardValue.MILITARY, type, value)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={props.deckbuilder ? 12 : 6}
                    md={props.deckbuilder ? 12 : 4}
                  >
                    <CardValueFilter
                      valueLabel={<span className={`icon icon-conflict-political`} />}
                      onFilterChange={(type, value) =>
                        updateNumericFilter(NumericCardValue.POLITICAL, type, value)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={props.deckbuilder ? 12 : 6}
                    md={props.deckbuilder ? 12 : 4}
                  >
                    <CardValueFilter
                      valueLabel={<span>Cost:</span>}
                      onFilterChange={(type, value) =>
                        updateNumericFilter(NumericCardValue.COST, type, value)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={props.deckbuilder ? 12 : 6}
                    md={props.deckbuilder ? 12 : 4}
                  >
                    <CardValueFilter
                      valueLabel={<span>Inf:</span>}
                      onFilterChange={(type, value) =>
                        updateNumericFilter(NumericCardValue.INFLUENCE, type, value)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={props.deckbuilder ? 12 : 6}
                    md={props.deckbuilder ? 12 : 4}
                  >
                    <CardValueFilter
                      valueLabel={<span>Glory:</span>}
                      onFilterChange={(type, value) =>
                        updateNumericFilter(NumericCardValue.GLORY, type, value)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={props.deckbuilder ? 12 : 6}
                    md={props.deckbuilder ? 12 : 4}
                  >
                    <CardValueFilter
                      valueLabel={<span>Str:</span>}
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
