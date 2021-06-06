import { useEffect, useReducer, useState } from 'react'
import { CardWithVersions, Trait } from '@5rdb/api/index'
import {
  Button,
  ButtonGroup,
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
} from '@material-ui/core'
import { factions, cardTypes, sides, formats } from '../utils/enums'
import { CardTypeIcon } from './CardTypeIcon'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useUiStore } from '../providers/UiStoreProvider'
import { CycleList } from './CycleList'
import useDebounce from '../hooks/useDebounce';

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
}))

export interface FilterState {
  text: string
  factions: string[]
  cardTypes: string[]
  sides: string[]
  traits: string[]
  packs: string[]
  cycles: string[]
  restricted: string
  banned: string
}

enum FilterType {
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
  FILTER_RESET
}

type FilterAction =
  | { type: FilterType.FILTER_TEXT, text: string }
  | { type: FilterType.FILTER_FACTIONS, factions: string[] }
  | { type: FilterType.FILTER_CARD_TYPES, cardTypes: string[] }
  | { type: FilterType.FILTER_SIDES, sides: string[] }
  | { type: FilterType.FILTER_TRAITS, traits: string[] }
  | { type: FilterType.FILTER_PACKS, packs: string[] }
  | { type: FilterType.FILTER_CYCLES, cycles: string[] }
  | { type: FilterType.FILTER_PACKS_AND_CYCLES, packs: string[], cycles: string[] }
  | { type: FilterType.FILTER_RESTRICTED, format: string }
  | { type: FilterType.FILTER_BANNED, format: string }
  | { type: FilterType.FILTER_RESET };


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
    filteredCards = filteredCards.filter(
      (c) => c.versions?.some((version) => filter.packs?.includes(version.pack_id))
    )
  }
  if (filter.restricted) {
    filteredCards = filteredCards.filter(
      (c) => c.restricted_in?.includes(filter.restricted)
    )
  }
  if (filter.banned) {
    filteredCards = filteredCards.filter(
      (c) => c.banned_in?.includes(filter.banned)
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

const initialState: FilterState = {
  cardTypes: [],
  factions: [],
  packs: [],
  sides: [],
  text: '',
  traits: [],
  cycles: [],
  restricted: '',
  banned: ''
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch(action.type) {
    case FilterType.FILTER_TEXT:
      return { ...state, text: action.text };
    case FilterType.FILTER_FACTIONS:
      return { ...state, factions: action.factions };
    case FilterType.FILTER_CARD_TYPES:
      return { ...state, cardTypes: action.cardTypes };
    case FilterType.FILTER_SIDES:
      return { ...state, sides: action.sides };
    case FilterType.FILTER_TRAITS:
      return { ...state, traits: action.traits };
    case FilterType.FILTER_PACKS:
      return { ...state, packs: action.packs };
    case FilterType.FILTER_CYCLES:
      return { ...state, cycles: action.cycles };
    case FilterType.FILTER_PACKS_AND_CYCLES:
      return { ...state, packs: action.packs, cycles: action.cycles };
    case FilterType.FILTER_RESTRICTED:
      return { ...state, restricted: action.format };
    case FilterType.FILTER_BANNED:
      return { ...state, banned: action.format };
    case FilterType.FILTER_RESET:
      return initialState;
  }
}

export function CardFilter(props: {
  initialFilterState?: FilterState | undefined,
  onFilterChanged: (filter: FilterState) => void
  fullWidth?: boolean
  deckbuilder?: boolean
}): JSX.Element {
  const classes = useStyles()
  const { traits } = useUiStore()
  const [ filterState, dispatchFilter ] = useReducer(filterReducer, props.initialFilterState || initialState);
  useEffect(() => props.onFilterChanged(filterState), [filterState]);

  const [ searchTerm, setSearchTerm ] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    dispatchFilter({ type: FilterType.FILTER_TEXT, text: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  const [packModalOpen, setPackModalOpen] = useState(false)

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
      cycles: newCycleIds
    });
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
    const newFactions = toggleItemInArray(filterState.factions, id);
    dispatchFilter({ type: FilterType.FILTER_FACTIONS, factions: newFactions });
  }

  function toggleCardTypeFilter(id: string) {
    const newCardTypes = toggleItemInArray(filterState.cardTypes, id);
    dispatchFilter({ type: FilterType.FILTER_CARD_TYPES, cardTypes: newCardTypes });
  }

  function toggleSideFilter(id: string) {
    const newSides = toggleItemInArray(filterState.sides, id);
    dispatchFilter({ type: FilterType.FILTER_SIDES, sides: newSides });
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
            label="Seach for card name, ability text..."
            value={ searchTerm }
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
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
                        backgroundColor: filterState.factions.includes(faction.id) ? faction.color : '',
                      }}
                      className={classes.button}
                    >
                      <span
                        className={`icon icon-clan-${faction.id}`}
                        style={{
                          color: filterState.factions.includes(faction.id) ? 'white' : faction.color,
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
                        backgroundColor: filterState.cardTypes.includes(type.id) ? 'dimgrey' : 'white',
                      }}
                      className={classes.button}
                    >
                      <CardTypeIcon
                        type={type.id}
                        defaultColor={ filterState.cardTypes.includes(type.id) ? 'white' : 'black' }
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
                        backgroundColor: filterState.sides.includes(side.id) ? 'dimgrey' : 'white',
                      }}
                    >
                      <Typography
                        variant="inherit"
                        style={{ color: filterState.sides.includes(side.id) ? 'white' : 'black' }}
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
                  dispatchFilter({ type: FilterType.FILTER_TRAITS, traits: value.map((item) => item.id) })}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="combo-box-restricted-in"
                options={formats}
                getOptionLabel={(option) => option?.name || ''}
                value={formats.find(format => format.id === filterState.restricted)}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Restricted In" variant="outlined" />
                )}
                onChange={(e, value) =>
                  dispatchFilter({ type: FilterType.FILTER_RESTRICTED, format: value?.id || '' })}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="combo-box-banned-in"
                options={formats}
                getOptionLabel={(option) => option?.name || ''}
                value={formats.find(format => format.id === filterState.banned)}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Banned In" variant="outlined" />
                )}
                onChange={(e, value) =>
                  dispatchFilter({ type: FilterType.FILTER_BANNED, format: value?.id || '' })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="secondary" onClick={() => setPackModalOpen(true)}>
                Filter Packs{ filterState.packs.length > 0 && ` (Selected: ${filterState.packs.length})`}
              </Button>
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
          <CycleList
            withCheckbox
            rootLabel="All Packs"
            onSelection={updateFilteredPacksAndCycles}
            selectedPacks={filterState.packs}
            selectedCycles={filterState.cycles}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPackModalOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
