import { Redirect, Route, Switch } from 'react-router-dom'
import { useCurrentUser } from './providers/UserProvider'
import { AdminView } from './views/AdminView'
import { BuilderView } from './views/BuilderView'
import { CardDetailView } from './views/CardDetailView'
import { CardsView } from './views/CardsView'
import { CreateCardView } from './views/CreateCardView'
import { DecksView } from './views/DecksView'
import { EditCardView } from './views/EditCardView'
import { NotLoggedIn } from './views/NotLoggedIn'
import { NotPermitted } from './views/NotPermitted'
import { RulesView } from './views/RulesView'

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
  return (
    <Switch>
      <Route path="/cards">
        <CardsView />
      </Route>
      <Route path="/decks">
        <DecksView />
      </Route>
      <Route path="/rules">
        <RulesView />
      </Route>
      <AuthenticatedRoute path="/builder">
        <BuilderView />
      </AuthenticatedRoute>
      <DataAdminRoute path="/card/:id/edit">
        <EditCardView />
      </DataAdminRoute>
      <DataAdminRoute path="/card/create/new">
        <CreateCardView />
      </DataAdminRoute>
      <DataAdminRoute path="/admin">
        <AdminView />
      </DataAdminRoute>
      <Route path="/card/:id">
        <CardDetailView />
      </Route>
      <Route path="/">
        <Redirect to="/cards" />
      </Route>
    </Switch>
  )
}
