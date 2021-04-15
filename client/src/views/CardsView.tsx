import { Card } from '@5rdb/api'
import {
  Paper,
  makeStyles,
  colors,
} from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import { DataGrid, GridColumns } from '@material-ui/data-grid';
import { useContext } from 'react'
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import { CardTypeIcon } from '../components/CardTypeIcon';
import { UiStoreContext } from '../providers/UiStoreProvider'

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
  const { cards, traits } = useContext(UiStoreContext)

  const capitalize = (input: string) => {
    return input ? input.charAt(0).toUpperCase() + input.slice(1) : ''
  }

  const convertTraitList = (stringTraits: string[]) => {
    return stringTraits.map(stringTrait => (traits.find(trait => stringTrait === trait.id)?.name || stringTrait) + '.').join(' ');
  }

  const getValue = (card: Card) => {
    return ''
  }

  const tableCards: TableCard[] = cards.map(card => { return {
    id: card.id,
    name: {name: card.name, faction: card.clan, type: card.type},
    faction: capitalize(card.clan),
    type: capitalize(card.type),
    traits: convertTraitList(card.traits || []),
    deck: capitalize(card.side),
    cost: card.cost || '',
    value: getValue(card) 
  }})

  const columns: GridColumns = [
    {field: 'name', headerName: 'Name', width: 300, renderCell: (params) => {
      const nameProps = params.value as NameProps
      return (<span><CardTypeIcon type={nameProps.type} faction={nameProps.faction} /> {nameProps.name}</span>)
    }},
    {field: 'faction', headerName: 'Faction', width: 120 },
    {field: 'type', headerName: 'Type', width: 120 },
    {field: 'traits', headerName: 'Traits', width: 300, renderCell: (params) => (
      <em><b>{params.value}</b></em>)},
    {field: 'deck', headerName: 'Deck', width: 100 },
    {field: 'cost', headerName: 'Cost', width: 90 },
    {field: 'value', headerName: 'Value', width: 150 },
  ]

  return (
    <Paper className={classes.table}>
      <DataGrid columns={columns} rows={tableCards} pageSize={50} autoHeight density="compact"></DataGrid>
    </Paper>
  )
}
