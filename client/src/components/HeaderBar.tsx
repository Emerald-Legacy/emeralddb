import { AppBar, Button, Container, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { UserMenu } from './usermenu/UserMenu'
import { useQuery } from 'react-query'
import { privateApi, publicApi } from "../api";
import { UiStoreContext, UiStoreProvider } from '../providers/UiStoreProvider';
import { useContext } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export enum Queries {
  USER = 'USER',
  CARDS = 'CARDS',
  PACKS = 'PACKS',
  CYCLES = 'CYCLES',
}

export function HeaderBar(props: {audience: string, scope: string}) {
  const classes = useStyles()
  const uiStore = useContext(UiStoreContext)
  useQuery(Queries.CARDS, () => publicApi.Card.findAll().then((cards) => uiStore.setCards(cards.data())))
  useQuery(Queries.PACKS, () => publicApi.Pack.findAll().then((packs) => uiStore.setPacks(packs.data())))
  useQuery(Queries.CYCLES, () => publicApi.Cycle.findAll().then((cycles) => uiStore.setCycles(cycles.data())))
  
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
              FiveRingsDB
            </Typography>
            <UserMenu audience={props.audience} scope={props.scope} />
        </Toolbar>
      </Container>
    </AppBar>
  )
}
