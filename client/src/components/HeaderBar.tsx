import { AppBar, Container, makeStyles, Toolbar, Typography } from '@material-ui/core'
import { UserMenu } from './usermenu/UserMenu'
import { useQuery } from 'react-query'
import { publicApi } from '../api'
import { UiStoreContext } from '../providers/UiStoreProvider'
import { forwardRef, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

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
  TRAITS = 'TRAITS',
}

export function HeaderBar(props: { audience: string; scope: string }): JSX.Element {
  const classes = useStyles()
  const uiStore = useContext(UiStoreContext)
  const history = useHistory()

  useQuery(Queries.CARDS, () =>
    publicApi.Card.findAll().then((cards) => uiStore.setCards(cards.data()))
  )
  useQuery(Queries.PACKS, () =>
    publicApi.Pack.findAll().then((packs) => uiStore.setPacks(packs.data()))
  )
  useQuery(Queries.CYCLES, () =>
    publicApi.Cycle.findAll().then((cycles) => uiStore.setCycles(cycles.data()))
  )
  useQuery(Queries.TRAITS, () =>
    publicApi.Trait.findAll().then((traits) => uiStore.setTraits(traits.data()))
  )

  const host = window.location.host;
  const title = host.includes('localhost') ? 'LOCAL FiveRingsDB' : host.includes('beta-') ? "BETA FiveRingsDB" : "FiveRingsDB"
  document.title = title;

  return (
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{cursor: 'pointer'}} onClick={() => history.push('/cards')}>
            {title}
          </Typography>
          <Typography className={classes.title}></Typography>
          <UserMenu audience={props.audience} scope={props.scope} />
        </Toolbar>
    </AppBar>
  )
}
