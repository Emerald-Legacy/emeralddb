import {
  Paper,
  makeStyles,
  useMediaQuery,
  Button,
  Dialog,
  DialogActions,
  DialogContent, Grid, Select, MenuItem, Box,
} from '@material-ui/core'
import { DataGrid, GridColumns } from '@material-ui/data-grid'
import { useHistory, useLocation } from 'react-router-dom'
import { useUiStore } from '../providers/UiStoreProvider'
import { convertTraitList } from '../utils/cardTextUtils'
import { capitalize } from '../utils/stringUtils'
import { useState } from 'react'
import { applyFilters, CardFilter, FilterState } from '../components/CardFilter'
import { CardWithVersions, Pack } from '@5rdb/api'
import { CardInformation } from '../components/card/CardInformation'
import { Loading } from '../components/Loading'
import { CardLink } from '../components/card/CardLink'
import {CardImageOrText} from "../components/card/CardImageOrText";
import {Pagination} from "@material-ui/lab";

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
  PACK_POSITION = 'pack_position'
}

function createFilterFromUrlSearchParams(params: URLSearchParams, allPacks: Pack[]): FilterState {
  const cycle = params.get('cycle')
  const pack = params.get('pack')
  const query = params.get('query') || ''
  const packs = cycle
    ? allPacks.filter((p) => p.cycle_id === cycle).map((p) => p.id)
    : pack
    ? [pack]
    : []

  return {
    text: decodeURIComponent(query),
    factions: [],
    cardTypes: [],
    sides: [],
    traits: [],
    elements: [],
    roleRestrictions: [],
    packs: packs,
    cycles: cycle ? [cycle] : [],
    numericValues: [],
    restricted: '',
    banned: '',
    isUnique: '',
  }
}

export function CardsView(): JSX.Element {
  const PAGE_SIZE = 60;

  const classes = useStyles()
  const { cards, packs, cycles, traits } = useUiStore()
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
    urlParamFilter = createFilterFromUrlSearchParams(urlSearchParams, packs)
    setFilter(urlParamFilter)
    setUrlParams(location.search)
    // Only 1 result => Go to card page
    const urlFilteredCards = applyFilters(cards, urlParamFilter)
    if (urlFilteredCards.length === 1) {
      history.push(`/card/${urlFilteredCards[0].id}`)
    }
  }
  if (filter) {
    filteredCards = applyFilters(cards, filter)
  }

  const goToCardPage = (id: string) => {
    history.push(`/card/${id}`)
  }

  function CardModal(): JSX.Element {
    if (!modalCard) {
      return (<div />)
    }
    return (<Dialog open={cardModalOpen} onClose={() => setCardModalOpen(false)}>
      <DialogContent>
        <CardInformation cardWithVersions={modalCard} clickable />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCardModalOpen(false)} variant="contained">
          Close
        </Button>
        <Button
          onClick={() => goToCardPage(modalCard.id)}
          color="secondary"
          variant="contained"
        >
          Go To Card Page
        </Button>
      </DialogActions>
    </Dialog>)
  }

  function Selectors(): JSX.Element {
    const sortOptions = [
      {
        option: SortMode.NAME,
        label: "Sort by Name"
      },
      {
        option: SortMode.PACK_POSITION,
        label: "Sort by Pack Position"
      }
    ]

    const displayOptions = [
      {
        option: DisplayMode.LIST,
        label: "Table View"
      },
      {
        option: DisplayMode.IMAGES,
        label: "Image View"
      },
      {
        option: DisplayMode.FULL,
        label: "Text + Image View"
      }
    ]

    let pageCount = Math.ceil(filteredCards.length / PAGE_SIZE);

    return (
      <Box paddingBottom={'5px'}>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={3}>
            <Select
              value={displayMode}
              label="Display Mode"
              onChange={(event) => setDisplayMode(event.target.value as DisplayMode || DisplayMode.LIST)}
              variant={"outlined"}
              fullWidth
            >
              {displayOptions.map(option => (
                <MenuItem key={option.option} value={option.option}>{option.label}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sm={3} hidden={displayMode === DisplayMode.LIST}>
            <Select
              value={sortMode}
              label="Sort Mode"
              onChange={(event) => setSortMode(event.target.value as SortMode || SortMode.NAME)}
              variant={"outlined"}
              fullWidth
            >
              {sortOptions.map(option => (
                <MenuItem key={option.option} value={option.option}>{option.label}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} hidden={displayMode === DisplayMode.LIST}>
            <Box style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
              <Pagination
                count={pageCount}
                page={page + 1}
                onChange={(e, value) => setPage(value - 1)}
                color={'secondary'}
                shape={'rounded'}
                size={'large'}
                style={{padding: '7px 0'}}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const onFilterChanged = (filter: FilterState) => {
    setFilter(filter)
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

    const columns: GridColumns = [
      {
        field: 'name',
        headerName: 'Name',
        flex: isMdOrBigger ? 5 : 10,
        disableColumnMenu: true,
        renderCell: (params) => {
          const nameProps = params.value as NameProps
          return (
            <span style={{ marginLeft: -10, cursor: 'pointer' }}>
            <CardLink cardId={nameProps.id} sameTab />
          </span>
          )
        },
        sortComparator: (v1, v2, param1, param2) =>
          param1.row.name.name.localeCompare(param2.row.name.name),
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
      { field: 'type', headerName: 'Type', disableColumnMenu: true, flex: 2, hide: !isMdOrBigger },
      {
        field: 'faction',
        headerName: 'Faction',
        disableColumnMenu: true,
        flex: 2,
        hide: !isMdOrBigger,
      },
      { field: 'deck', headerName: 'Deck', disableColumnMenu: true, flex: 1, hide: !isMdOrBigger },
      { field: 'cost', headerName: 'Cost', disableColumnMenu: true, flex: 1, hide: !isMdOrBigger },
      { field: 'military', headerName: 'Mil', disableColumnMenu: true, flex: 1, hide: !isMdOrBigger },
      {
        field: 'political',
        headerName: 'Pol',
        disableColumnMenu: true,
        flex: 1,
        hide: !isMdOrBigger,
      },
      { field: 'glory', headerName: 'Glory', disableColumnMenu: true, flex: 1, hide: !isMdOrBigger },
      { field: 'strength', headerName: 'Str', disableColumnMenu: true, flex: 1, hide: !isMdOrBigger },
    ]

    return (
      <>
        <CardFilter onFilterChanged={onFilterChanged} fullWidth filterState={urlParamFilter || filter} />
        <Paper className={classes.table}>
          <Selectors />
          <DataGrid
            disableColumnResize
            disableSelectionOnClick
            columns={columns}
            rows={tableCards}
            pageSize={50}
            autoHeight
            density="compact"
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

  function calculatePackIndex (card: CardWithVersions): { packIndex: string, cardIndex: string } {
    let dummy = {
      packIndex: "9999",
      cardIndex: "999"
    }
    // TODO check for rotation
    let cardVersion = card.versions.filter(() => true)[0]
    if (!cardVersion) {
      return dummy
    }
    let pack = packs.filter(pack => pack.id === cardVersion.pack_id)[0]
    if (!pack) {
      return dummy
    }
    let cycle = cycles.filter(cycle => cycle.id === pack.cycle_id)[0]
    let cyclePosition = (cycle?.position || 99) * 100
    let packPosition = pack.position
    let cardPosition = cardVersion.position || '999';
    while (cardPosition.length < 3) {
      cardPosition = '0' + cardPosition
    }
    return {
      packIndex: (cyclePosition + packPosition).toString(),
      cardIndex: cardPosition
    }
  }

  const sortCardsByPackIndex = (cardA: CardWithVersions, cardB: CardWithVersions) => {
    let aIndex = calculatePackIndex(cardA);
    let bIndex = calculatePackIndex(cardB);

    let indexCompare = aIndex.packIndex.localeCompare(bIndex.packIndex);
    return indexCompare === 0 ?
      aIndex.cardIndex.localeCompare(bIndex.cardIndex) :
      indexCompare
  }

  let sortedCards = sortMode === SortMode.NAME ?
    filteredCards.sort((a, b) => a.id.localeCompare(b.id)) :
    filteredCards.sort(sortCardsByPackIndex)

  let startIndexInclusive = page * PAGE_SIZE
  let endIndexExclusive = startIndexInclusive + PAGE_SIZE

  let currentCards = sortedCards.slice(startIndexInclusive, endIndexExclusive)

  if (displayMode === DisplayMode.IMAGES) {
    return (
      <>
        <CardFilter onFilterChanged={onFilterChanged} fullWidth filterState={urlParamFilter || filter} />
        <Paper className={classes.table}>
          <Selectors />
          <Grid container spacing={1}>
            {currentCards.map(card => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={card.id}>
                  <Box maxWidth={'240px'} margin={"0 auto"}>
                    <CardImageOrText
                      cardId={card.id}
                      onClick={cardId => {
                        setModalCard(cards.find((card) => card.id === cardId))
                        setCardModalOpen(true)
                      }}
                      packId={card.versions.length > 0 ? card.versions[0].pack_id : ''}
                    />
                  </Box>
                </Grid>
              )
            )}
          </Grid>
          <Selectors />
          <CardModal />
        </Paper>
      </>
    )
  }

  return (
    <>
      <CardFilter onFilterChanged={onFilterChanged} fullWidth filterState={urlParamFilter || filter} />
      <Paper className={classes.table}>
        <Selectors />
        <Grid container spacing={1}>
          {currentCards.map(card => (
            <Grid item xs={12} key={card.id} container spacing={4}>
              <Grid item xs={12} sm={6}>
                <CardInformation cardWithVersions={card} clickable currentVersionPackId={card.versions.length > 0 ? card.versions[0].pack_id : ''}/>
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
                    onClick={cardId => {
                      setModalCard(cards.find((card) => card.id === cardId))
                      setCardModalOpen(true)
                    }}
                    packId={card.versions.length > 0 ? card.versions[0].pack_id : ''}
                  />
                </Box>
              </Grid>
            </Grid>
            )
          )}
        </Grid>
        <Selectors />
        <CardModal />
      </Paper>
    </>
  )
}
