import {
  Paper,
  makeStyles,
  useMediaQuery,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
  const classes = useStyles()
  const { cards, packs, traits } = useUiStore()
  const history = useHistory()
  const location = useLocation()
  const [filter, setFilter] = useState<FilterState | undefined>(undefined)
  const [modalCard, setModalCard] = useState<CardWithVersions | undefined>(undefined)
  const [urlParams, setUrlParams] = useState<string>('')
  const [cardModalOpen, setCardModalOpen] = useState(false)
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

  const goToCardPage = (id: string) => {
    history.push(`/card/${id}`)
  }

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
      <CardFilter onFilterChanged={setFilter} fullWidth filterState={urlParamFilter || filter} />
      <Paper className={classes.table}>
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
      {modalCard && (
        <Dialog open={cardModalOpen} onClose={() => setCardModalOpen(false)}>
          <DialogContent>
            <CardInformation cardWithVersions={modalCard} />
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
        </Dialog>
      )}
    </>
  )
}
