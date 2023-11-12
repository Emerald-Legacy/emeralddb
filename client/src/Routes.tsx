import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { useCurrentUser } from './providers/UserProvider'
import { AdminView } from './views/AdminView'
import { BuilderView } from './views/BuilderView'
import { CardDetailView } from './views/CardDetailView'
import { CardsView } from './views/CardsView'
import { CreateCardView } from './views/CreateCardView'
import { CreateDeckView } from './views/CreateDeckView'
import { DeckDetailView } from './views/DeckDetailView'
import { DecksView } from './views/DecksView'
import { EditCardView } from './views/EditCardView'
import { EditDeckView } from './views/EditDeckView'
import { EditPackView } from './views/EditPackView'
import { ManageCyclesView } from './views/ManageCyclesView'
import { NotLoggedIn } from './views/NotLoggedIn'
import { NotPermitted } from './views/NotPermitted'
import { FFGRulesReferenceGuide } from './views/FFGRulesReferenceGuide'
import { ELRulesReferenceGuide } from './views/ELRulesReferenceGuide'
import { OpLists } from './views/OpLists'
import { HelpView } from './views/HelpView'
import { EditTraitsView } from './views/EditTraitsView'
import { useEffect } from 'react'
import { EditFormatsView } from "./views/EditFormatsView";

const AuthenticatedRoute = (props: { children: JSX.Element; path: string }) => {
  const { isLoggedIn } = useCurrentUser()
  return (
    <Route path={props.path} render={() => (isLoggedIn() ? props.children : <NotLoggedIn />)} />
  )
}

const DataAdminRoute = (props: { children: JSX.Element; path: string }) => {
  const { isDataAdmin } = useCurrentUser()
  return (
    <Route path={props.path} render={() => (isDataAdmin() ? props.children : <NotPermitted />)} />
  )
}

export function Routes(): JSX.Element {
  const history = useHistory()
  useEffect(() => {
    history.listen(() => {
      const host = window.location.host
      const prefix = host.includes('localhost') ? 'LOCAL' : host.includes('beta-') ? 'BETA' : ''
      const title = `${prefix} EmeraldDB`
      document.title = title
    })
  }, [])
  return (
    <Switch>
      <Route path="/cards">
        <CardsView />
      </Route>
      <Route path="/rules/imperial">
        <FFGRulesReferenceGuide />
      </Route>
      <Route path="/rules/emerald">
        <ELRulesReferenceGuide />
      </Route>
      <Route path="/rules/organized-play/:format">
        <OpLists />
      </Route>
      <Route path="/rules/organized-play">
        <OpLists />
      </Route>
      <Route path="/rules">
        <Redirect to="/rules/emerald" />
      </Route>
      <Route path="/faq">
        <HelpView />
      </Route>
      <Route path="/decks/:id">
        <DeckDetailView />
      </Route>
      <Route path="/decks">
        <DecksView />
      </Route>
      <AuthenticatedRoute path="/builder/create/new">
        <CreateDeckView />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/builder/:id/edit">
        <EditDeckView />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/builder">
        <BuilderView />
      </AuthenticatedRoute>
      <DataAdminRoute path="/card/:id/edit">
        <EditCardView />
      </DataAdminRoute>
      <DataAdminRoute path="/card/create/new">
        <CreateCardView />
      </DataAdminRoute>
      <DataAdminRoute path="/admin/pack/:id">
        <EditPackView />
      </DataAdminRoute>
      <DataAdminRoute path="/admin/cycles">
        <ManageCyclesView />
      </DataAdminRoute>
      <DataAdminRoute path="/admin/traits">
        <EditTraitsView />
      </DataAdminRoute>
      <DataAdminRoute path="/admin/formats">
        <EditFormatsView />
      </DataAdminRoute>
      <DataAdminRoute path="/admin">
        <AdminView />
      </DataAdminRoute>
      <Route path="/card/:id">
        <CardDetailView />
      </Route>
      <Route path="/">
        <Redirect to="/decks" />
      </Route>
    </Switch>
  )
}
