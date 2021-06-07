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
import { CardTypeIcon } from '../components/CardTypeIcon'
import { useUiStore } from '../providers/UiStoreProvider'
import { convertTraitList } from '../utils/cardTextUtils'
import { capitalize } from '../utils/stringUtils'
import { useState } from 'react'
import { applyFilters, CardFilter, FilterState } from '../components/CardFilter'
import { CardWithVersions, Pack } from '@5rdb/api'
import { CardInformation } from '../components/card/CardInformation'
import { Loading } from '../components/Loading'

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(1),
  },
}))

interface NameProps {
  name: string
  faction: string
  type: string
}

interface TableCard {
  id: string
  name: NameProps
  faction: string
  type: string
  traits: string
  deck: string
  cost: string
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
    packs: packs,
    cycles: cycle ? [cycle] : [],
    restricted: '',
    banned: '',
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

  if (packs.length === 0) {
    return <Loading />
  }
  let filteredCards = cards

  if (location.search !== urlParams) {
    const urlSearchParams = new URLSearchParams(location.search)
    setFilter(createFilterFromUrlSearchParams(urlSearchParams, packs))
    setUrlParams(location.search)
  }
  console.log(filter)
  if (filter) {
    filteredCards = applyFilters(cards, filter)
  }

  const tableCards: TableCard[] = filteredCards.map((card) => {
    return {
      id: card.id,
      name: { name: card.name, faction: card.faction, type: card.type },
      faction: capitalize(card.faction),
      type: capitalize(card.type),
      traits: convertTraitList(card.traits || [], traits),
      deck: capitalize(card.side),
      cost: card.cost || '',
    }
  })

  const goToCardPage = (id: string) => {
    history.push(`/card/${id}`)
  }

  const columns: GridColumns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 3,
      disableColumnMenu: true,
      renderCell: (params) => {
        const nameProps = params.value as NameProps
        return (
          <span style={{ marginLeft: -10, cursor: 'pointer' }}>
            <CardTypeIcon type={nameProps.type} faction={nameProps.faction} /> {nameProps.name}
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
      flex: 2,
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
      flex: 1,
      hide: !isMdOrBigger,
    },
    { field: 'deck', headerName: 'Deck', disableColumnMenu: true, flex: 1, hide: !isMdOrBigger },
    { field: 'cost', headerName: 'Cost', disableColumnMenu: true, flex: 1, hide: !isMdOrBigger },
  ]

  return (
    <>
      <CardFilter onFilterChanged={setFilter} fullWidth filterState={filter} />
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
