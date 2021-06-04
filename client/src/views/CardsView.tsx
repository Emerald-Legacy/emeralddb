import { Card } from '@5rdb/api'
import {
  Paper,
  makeStyles,
} from '@material-ui/core'
import { DataGrid, GridColumns } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import { CardTypeIcon } from '../components/CardTypeIcon';
import { useUiStore } from '../providers/UiStoreProvider'
import { convertTraitList } from '../utils/cardTextUtils';
import { capitalize } from '../utils/stringUtils';

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(2)
  },
}))

interface NameProps {
  name: string, 
  faction: string,
  type: string,
}

interface TableCard {
  id: string,
  name: NameProps,
  faction: string,
  type: string,
  traits: string,
  deck: string,
  cost: string,
  value: string,
}

export function CardsView(): JSX.Element {
  const classes = useStyles()
  const { cards, traits } = useUiStore()
  const history = useHistory()

  const getValue = (card: Card) => {
    return ''
  }

  const tableCards: TableCard[] = cards.map(card => { return {
    id: card.id,
    name: {name: card.name, faction: card.faction, type: card.type},
    faction: capitalize(card.faction),
    type: capitalize(card.type),
    traits: convertTraitList(card.traits || [], traits),
    deck: capitalize(card.side),
    cost: card.cost || '',
    value: getValue(card) 
  }})

  const goToCardPage = (id: string) => {
    history.push(`/card/${id}`)
  }

  const columns: GridColumns = [
    {
      field: 'name', 
      headerName: 'Name',
      width: 300,
      disableColumnMenu: true,
      renderCell: (params) => {
        const nameProps = params.value as NameProps
        return (<span style={{marginLeft: -10}}><CardTypeIcon type={nameProps.type} faction={nameProps.faction} /> {nameProps.name}</span>)
      },
      sortComparator: (v1, v2, param1, param2) => param1.row.name.name.localeCompare(param2.row.name.name),
    },
    {field: 'faction', headerName: 'Faction', disableColumnMenu: true, width: 120 },
    {field: 'type', headerName: 'Type', disableColumnMenu: true, width: 120 },
    {field: 'traits', headerName: 'Traits', disableColumnMenu: true, width: 300, renderCell: (params) => (
      <em><b>{params.value}</b></em>)},
    {field: 'deck', headerName: 'Deck', disableColumnMenu: true, width: 100 },
    {field: 'cost', headerName: 'Cost', disableColumnMenu: true, width: 90 }
  ]

  return (
    <Paper className={classes.table}>
      <DataGrid disableColumnResize columns={columns} rows={tableCards} pageSize={50} autoHeight density="compact" onRowClick={(param) => {goToCardPage(param.row.id)}}></DataGrid>
    </Paper>
  )
}
