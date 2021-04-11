import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { createContext, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { captureToken, setToken, unsetToken } from './utils/auth'
import { CardsView } from './views/CardsView'
import { CardDetailView } from './views/CardDetailView'
import { HeaderBar } from './components/HeaderBar'
import { MainPage } from './views/MainPage'
import { User } from '@5rdb/api'
import { useCurrentUser } from './hooks/useCurrentUser'

// create our material ui theme using up to date typography variables
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#558b2f',
    },
    secondary: {
      main: '#263238',
    },
  },
})

export const UserContext = createContext<User | undefined>(undefined)

export default function App(): JSX.Element {
  captureToken()
  const auth0Domain: string = process.env.REACT_APP_AUTH0_DOMAIN || 'undefined'
  const auth0ClientId: string = process.env.REACT_APP_AUTH0_CLIENT_ID || 'undefined'
  const audience = `http://fiveringsdb.com`
  const scope = 'read:current_user'
  const [user] = useCurrentUser()

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      redirectUri={window.location.origin}
      audience={audience}
      scope={scope}
    >
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={user.data}>
        <BrowserRouter>
            <HeaderBar audience={audience} scope={scope} />
            <Switch>
              <Route path="/cards">
                <CardsView />
              </Route>
              <Route path="/card/:id">
                <CardDetailView />
              </Route>
              <Route path="/">
                <MainPage />
              </Route>
            </Switch>
          </BrowserRouter>
        </UserContext.Provider>
      </ThemeProvider>
    </Auth0Provider>
  )
}
