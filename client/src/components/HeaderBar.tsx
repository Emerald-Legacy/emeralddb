import { AppBar, Container, makeStyles, Toolbar, Typography } from '@material-ui/core'
import { UserMenu } from './usermenu/UserMenu'
import { useQuery } from 'react-query'
import { publicApi } from '../api'
import { UiStoreContext } from '../providers/UiStoreProvider'
import { useContext } from 'react'

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
