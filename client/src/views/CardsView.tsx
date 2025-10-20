import {
  Paper,
  useMediaQuery,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useHistory, useLocation } from 'react-router-dom'
import { useUiStore } from '../providers/UiStoreProvider'
import { convertTraitList } from '../utils/cardTextUtils'
import { capitalize } from '../utils/stringUtils'
import { useState } from 'react'
import { applyFilters, CardFilter, FilterState, initialState } from "../components/CardFilter";
import { CardWithVersions, Pack } from '@5rdb/api'
import { CardInformation } from '../components/card/CardInformation'
import { Loading } from '../components/Loading'
import { CardLink } from '../components/card/CardLink'
import { CardImageOrText } from '../components/card/CardImageOrText'
import { Pagination } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(1),
  },
}))

interface NameProps {
  id: string
  name: string
}

interface TableCard {
  id: string
  name: NameProps
  faction: string
  type: string
  traits: string
  deck: string
  cost: string
  military: string
  political: string
  glory: string
  strength: string
}

enum DisplayMode {
  LIST = 'list',
  IMAGES = 'images',
  FULL = 'full',
}

enum SortMode {
  NAME = 'name',
  PACK_POSITION = 'pack_position',
}

function createFilterFromUrlSearchParams(params: URLSearchParams, allPacks: Pack[], initialFilter: FilterState): FilterState {
  const cycle = params.get('cycle')
  const pack = params.get('pack')
  const query = params.get('query') || ''
  const packs = cycle
    ? allPacks.filter((p) => p.cycle_id === cycle).map((p) => p.id)
    : pack
    ? [pack]
    : []

  return {
    ...initialFilter,
    text: decodeURIComponent(query) || initialFilter.text,
    packs: packs || initialFilter.packs,
    cycles: cycle ? [cycle] : initialFilter.cycles
  }
}

export function CardsView(): JSX.Element {
  const PAGE_SIZE = 60

  const classes = useStyles()
  const { cards, packs, cycles, traits, formats, validCardVersionForFormat } = useUiStore()
  const history = useHistory()
  const location = useLocation()
  const [filter, setFilter] = useState<FilterState | undefined>(undefined)
  const [modalCard, setModalCard] = useState<CardWithVersions | undefined>(undefined)
  const [urlParams, setUrlParams] = useState<string>('')
  const [cardModalOpen, setCardModalOpen] = useState(false)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.LIST)
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.NAME)
  const [page, setPage] = useState(0)
  const isMdOrBigger = useMediaQuery('(min-width:600px)')

  if (cards.length === 0) {
    return <Loading />
  }
  let filteredCards = cards

  const urlSearchParams = new URLSearchParams(location.search)
  let urlParamFilter
  if (location.search !== urlParams) {
    const newSearchParams = urlSearchParams
    const previousSearchParams = new URLSearchParams(urlParams)
    if (
      newSearchParams.get('pack') != previousSearchParams.get('pack') ||
      newSearchParams.get('cycle') != previousSearchParams.get('cycle') ||
      newSearchParams.get('query') != previousSearchParams.get('query')
    ){
      console.log('update Filter')
      urlParamFilter = createFilterFromUrlSearchParams(newSearchParams, packs, filter || initialState)
      setFilter(urlParamFilter)

      // Only 1 result => Go to card page
      const urlFilteredCards = applyFilters(cards, formats, urlParamFilter)
      if (urlFilteredCards.length === 1) {
        history.push(`/card/${urlFilteredCards[0].id}`)
      }
    }
    setUrlParams(location.search)

    const displayParam = newSearchParams.get('display') || displayMode
    const sortParam = newSearchParams.get('sort') || sortMode

    setDisplayMode(displayParam as DisplayMode)
    setSortMode(sortParam as SortMode)
  }

  if (filter) {
    filteredCards = applyFilters(cards, formats, filter)
  }

  const goToCardPage = (id: string) => {
    history.push(`/card/${id}`)
  }

  function findCardVersion(card: CardWithVersions) {
    let versionsWithFilteredPacks = filter?.packs ? card.versions.filter(v => filter.packs.includes(v.pack_id)) : card.versions
    let validFormatVersion = filter?.format && validCardVersionForFormat(card.id, filter.format)
    return validFormatVersion || versionsWithFilteredPacks.length > 0 ? versionsWithFilteredPacks[0] : card.versions[0];
  }

  function CardModal(): JSX.Element {
    if (!modalCard) {
      return <div />
    }
    return (
      <Dialog open={cardModalOpen} onClose={() => setCardModalOpen(false)}>
        <DialogContent>
          <CardInformation cardWithVersions={modalCard} clickable currentVersion={findCardVersion(modalCard)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCardModalOpen(false)} variant="contained">
            Close
          </Button>
          <Button onClick={() => goToCardPage(modalCard.id)} color="secondary" variant="contained">
            Go To Card Page
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  function Selectors(): JSX.Element {
    const sortOptions = [
      {
        option: SortMode.NAME,
        label: 'Sort by Name',
      },
      {
        option: SortMode.PACK_POSITION,
        label: 'Sort by Pack Position',
      },
    ]

    const displayOptions = [
      {
        option: DisplayMode.LIST,
        label: 'Table View',
      },
      {
        option: DisplayMode.IMAGES,
        label: 'Image View',
      },
      {
        option: DisplayMode.FULL,
        label: 'Text + Image View',
      },
    ]

    const pageCount = Math.ceil(filteredCards.length / PAGE_SIZE)

    return (
      <Box paddingBottom={'5px'}>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={3}>
            <Select
              value={displayMode}
              label="Display Mode"
              onChange={(event) => {
                const newMode = (event.target.value as DisplayMode) || DisplayMode.LIST
                setDisplayMode(newMode)
                urlSearchParams.set('display', newMode)
                history.push({
                  pathname: '/cards',
                  search: urlSearchParams.toString(),
                })
              }}
              variant={'outlined'}
              fullWidth
            >
              {displayOptions.map((option) => (
                <MenuItem key={option.option} value={option.option}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sm={3} hidden={displayMode === DisplayMode.LIST}>
            <Select
              value={sortMode}
              label="Sort Mode"
              onChange={(event) => {
                const newMode = (event.target.value as SortMode) || SortMode.NAME
                setSortMode(newMode)
                urlSearchParams.set('sort', newMode)
                history.push({
                  pathname: '/cards',
                  search: urlSearchParams.toString(),
                })
              }}
              variant={'outlined'}
              fullWidth
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.option} value={option.option}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} hidden={displayMode === DisplayMode.LIST}>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pagination
                count={pageCount}
                page={page + 1}
                onChange={(e, value) => setPage(value - 1)}
                color={'secondary'}
                shape={'rounded'}
                size={'large'}
                style={{ padding: '7px 0' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const onFilterChanged = (newFilter: FilterState) => {
    setFilter(newFilter)
    setPage(0)
  }

  if (displayMode === DisplayMode.LIST) {
    const tableCards: TableCard[] = filteredCards.map((card) => {
      const mil =
        card.military !== null && card.military !== undefined
          ? card.military
          : card.military_bonus !== null && card.military_bonus !== undefined
          ? card.military_bonus
          : card.type === 'character' || card.type === 'attachment'
          ? '-'
          : ''
      const pol =
        card.political !== null && card.political !== undefined
          ? card.political
          : card.political_bonus !== null && card.political_bonus !== undefined
          ? card.political_bonus
          : card.type === 'character' || card.type === 'attachment'
          ? '-'
          : ''

      return {
        id: card.id,
        name: { id: card.id, name: card.name },
        faction: capitalize(card.faction),
        type: capitalize(card.type),
        traits: convertTraitList(card.traits || [], traits),
        deck: capitalize(card.side),
        cost: card.cost || '',
        military: mil,
        political: pol,
        glory: card.glory !== null ? '' + card.glory : '',
        strength: card.strength || card.strength_bonus || '',
      }
    })

    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Name',
        flex: isMdOrBigger ? 5 : 10,
        disableColumnMenu: true,
        renderCell: (params) => {
          const nameProps = params.value as NameProps
          return (
            <span style={{ marginLeft: -10, cursor: 'pointer' }}>
              <CardLink cardId={nameProps.id} sameTab format={filter?.format} />
            </span>
          )
        },
        sortComparator: (v1, v2) =>
          (v1 as NameProps).name.localeCompare((v2 as NameProps).name),
      },
      {
        field: 'traits',
        headerName: 'Traits',
        disableColumnMenu: true,
        flex: isMdOrBigger ? 3 : 5,
        renderCell: (params) => (
          <em>
            <b>{params.value}</b>
          </em>
        ),
      },
      { field: 'type', headerName: 'Type', disableColumnMenu: true, flex: 2 },
      {
        field: 'faction',
        headerName: 'Faction',
        disableColumnMenu: true,
        flex: 2,
      },
      { field: 'deck', headerName: 'Deck', disableColumnMenu: true, flex: 1 },
      { field: 'cost', headerName: 'Cost', disableColumnMenu: true, flex: 1 },
      {
        field: 'military',
        headerName: 'Mil',
        disableColumnMenu: true,
        flex: 1,
      },
      {
        field: 'political',
        headerName: 'Pol',
        disableColumnMenu: true,
        flex: 1,
      },
      {
        field: 'glory',
        headerName: 'Glory',
        disableColumnMenu: true,
        flex: 1,
      },
      {
        field: 'strength',
        headerName: 'Str',
        disableColumnMenu: true,
        flex: 1,
      },
    ]

    return (
      <>
        <CardFilter
          onFilterChanged={onFilterChanged}
          fullWidth
          filterState={filter || urlParamFilter}
        />
        <Paper className={classes.table}>
          <Selectors />
          <DataGrid
            disableRowSelectionOnClick
            columns={columns}
            rows={tableCards}
            pageSizeOptions={[50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 50 } },
            }}
            autoHeight
            density="compact"
            columnVisibilityModel={{
              type: isMdOrBigger,
              faction: isMdOrBigger,
              deck: isMdOrBigger,
              cost: isMdOrBigger,
              military: isMdOrBigger,
              political: isMdOrBigger,
              glory: isMdOrBigger,
              strength: isMdOrBigger,
            }}
            onRowClick={(param) => {
              setModalCard(cards.find((card) => card.id === param.row.id))
              setCardModalOpen(true)
            }}
          />
        </Paper>
        <CardModal />
      </>
    )
  }

  function calculatePackIndex(card: CardWithVersions): { packIndex: string; cardIndex: string } {
    const dummy = {
      packIndex: '9999',
      cardIndex: '999',
    }
    const cardVersion = card.versions.filter(() => true)[0]
    if (!cardVersion) {
      return dummy
    }
    const pack = packs.filter((pack) => pack.id === cardVersion.pack_id)[0]
    if (!pack) {
      return dummy
    }
    const cycle = cycles.filter((cycle) => cycle.id === pack.cycle_id)[0]
    const cyclePosition = (cycle?.position || 99) * 100
    const packPosition = pack.position
    let cardPosition = cardVersion.position || '999'
    while (cardPosition.length < 3) {
      cardPosition = '0' + cardPosition
    }
    return {
      packIndex: (cyclePosition + packPosition).toString(),
      cardIndex: cardPosition,
    }
  }

  const sortCardsByPackIndex = (cardA: CardWithVersions, cardB: CardWithVersions) => {
    const aIndex = calculatePackIndex(cardA)
    const bIndex = calculatePackIndex(cardB)

    const indexCompare = aIndex.packIndex.localeCompare(bIndex.packIndex)
    return indexCompare === 0 ? aIndex.cardIndex.localeCompare(bIndex.cardIndex) : indexCompare
  }

  const sortedCards =
    sortMode === SortMode.NAME
      ? filteredCards.sort((a, b) => a.id.localeCompare(b.id))
      : filteredCards.sort(sortCardsByPackIndex)

  const startIndexInclusive = page * PAGE_SIZE
  const endIndexExclusive = startIndexInclusive + PAGE_SIZE

  const currentCards = sortedCards.slice(startIndexInclusive, endIndexExclusive)

  if (displayMode === DisplayMode.IMAGES) {
    return (
      <>
        <CardFilter
          onFilterChanged={onFilterChanged}
          fullWidth
          filterState={filter || urlParamFilter}
        />
        <Paper className={classes.table}>
          <Selectors />
          <Grid container spacing={1}>
            {currentCards.map((card) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={card.id}>
                <Box maxWidth={'240px'} margin={'0 auto'}>
                  <CardImageOrText
                    cardId={card.id}
                    onClick={(cardId) => {
                      setModalCard(cards.find((card) => card.id === cardId))
                      setCardModalOpen(true)
                    }}
                    cardVersion={findCardVersion(card)}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Selectors />
          <CardModal />
        </Paper>
      </>
    )
  }

  return (
    <>
      <CardFilter
        onFilterChanged={onFilterChanged}
        fullWidth
        filterState={filter || urlParamFilter}
      />
      <Paper className={classes.table}>
        <Selectors />
        <Grid container spacing={1}>
          {currentCards.map((card) => (
            <Grid item xs={12} key={card.id} container spacing={4}>
              <Grid item xs={12} sm={6}>
                <CardInformation
                  cardWithVersions={card}
                  clickable
                  currentVersion={findCardVersion(card)}
                />
                <Box padding={'5px'} justifyContent={'flex-end'}>
                  <Button
                    onClick={() => goToCardPage(card.id)}
                    color="secondary"
                    variant="contained"
                  >
                    Go To Card Page
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box maxWidth={'300px'}>
                  <CardImageOrText
                    cardId={card.id}
                    onClick={(cardId) => {
                      setModalCard(cards.find((card) => card.id === cardId))
                      setCardModalOpen(true)
                    }}
                    cardVersion={findCardVersion(card)}
                  />
                </Box>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Selectors />
        <CardModal />
      </Paper>
    </>
  )
}
