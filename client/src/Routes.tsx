import { Typography } from "@material-ui/core/styles/createTypography"
import { Redirect, Route, Switch } from "react-router-dom"
import { useCurrentUser } from "./providers/UserProvider"
import { AdminView } from "./views/AdminView"
import { CardDetailView } from "./views/CardDetailView"
import { CardsView } from "./views/CardsView"
import { CreateCardView } from "./views/CreateCardView"
import { EditCardView } from "./views/EditCardView"
import { MainPage } from "./views/MainPage"

const AuthenticatedRoute = (props: {children: JSX.Element, path: string}) => {
  const { currentUser } = useCurrentUser()
  return <Route
            path={props.path}
            render={({ location }) =>
              currentUser ? (
                props.children
              ) : (
                <Redirect
                  to={{
                    pathname: "/not-logged-in",
                    state: { from: location }
                  }}
                />
              )
            }
          />
}

const DataAdminRoute = (props: {children: JSX.Element, path: string}) => {
  const { currentUser } = useCurrentUser()
  return <Route
            path={props.path}
            render={({ location }) =>
              currentUser?.roles.includes('data_admin') ? (
                props.children
              ) : (
                <Redirect
                  to={{
                    pathname: "/not-permitted",
                    state: { from: location }
                  }}
                />
              )
            }
          />
}

export const Routes = () => {
  return (<Switch>
        <Route path="/cards">
          <CardsView />
        </Route>
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
          <MainPage />
        </Route>
      </Switch>)
}