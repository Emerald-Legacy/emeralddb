import { PublishedDecklist } from '@5rdb/api'
import { makeStyles, Paper, useMediaQuery } from '@material-ui/core'
import { DataGrid, GridColumns } from '@material-ui/data-grid'
import { useEffect, useState } from 'react'
import { publicApi } from '../api'
import { applyDeckFilters, DeckFilter, DeckFilterState } from '../components/DeckFilter'
import { getColorForFactionId } from '../utils/factionUtils'
import { capitalize } from '../utils/stringUtils'
import { EmeraldDBLink } from '../components/EmeraldDBLink'
import { useUiStore } from "../providers/UiStoreProvider";

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(1),
  },
}))

export function DecksView(): JSX.Element {
  const classes = useStyles()
  const { formats } = useUiStore()
  const [decks, setDecks] = useState<PublishedDecklist[]>([])
  const [filter, setFilter] = useState<DeckFilterState | undefined>(undefined)
  const isMdOrBigger = useMediaQuery('(min-width:600px)')

  useEffect(() => {
    publicApi.Decklist.findPublished().then((response) => setDecks(response.data()))
  }, [])

  let sortedDecks = decks.sort(
    (a, b) => new Date(b.published_date!).getTime() - new Date(a.published_date!).getTime()
  )

  if (filter) {
    sortedDecks = applyDeckFilters(sortedDecks, filter)
  }

  const columns: GridColumns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 3,
      disableColumnMenu: true,
      renderCell: (params) => (
        <span>
          <EmeraldDBLink href={`/decks/${params.row.id}`}>
            {params.row.name} (v{params.row.version_number})
          </EmeraldDBLink>
        </span>
      ),
    },
    {
      field: 'primary_clan',
      headerName: 'Clan',
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => (
        <span>
          <span
            className={`icon icon-clan-${params.row.primary_clan}`}
            style={{ color: getColorForFactionId(params.row.primary_clan) }}
          />{' '}
          {isMdOrBigger ? capitalize(params.row.primary_clan) : ''}
        </span>
      ),
    },
    {
      field: 'secondary_clan',
      headerName: 'Splash',
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => (
        <span>
          <span
            className={`icon icon-clan-${params.row.secondary_clan}`}
            style={{ color: getColorForFactionId(params.row.secondary_clan) }}
          />{' '}
          {isMdOrBigger ? capitalize(params.row.secondary_clan) : ''}
        </span>
      ),
    },
    {
      field: 'format',
      headerName: 'Format',
      disableColumnMenu: true,
      flex: 2,
      hide: !isMdOrBigger,
      renderCell: (params) => (
        <span>{formats.find((format) => format.id === params.row.format)?.name}</span>
      ),
    },
    {
      field: 'username',
      headerName: 'Creator',
      disableColumnMenu: true,
      flex: 2,
      hide: !isMdOrBigger,
    },
    {
      field: 'published_date',
      headerName: 'Published',
      disableColumnMenu: true,
      flex: 2,
      hide: !isMdOrBigger,
      renderCell: (params) => <span>{new Date(params.row.published_date).toLocaleString()}</span>,
    },
  ]

  return (
    <>
      <DeckFilter onFilterChanged={setFilter} filterState={filter} />
      <Paper className={classes.table}>
        <DataGrid
          disableColumnResize
          disableSelectionOnClick
          columns={columns}
          rows={sortedDecks}
          pageSize={50}
          autoHeight
          density="compact"
        />
      </Paper>
    </>
  )
}
