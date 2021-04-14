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
import { useAuth0Config } from './hooks/useAuth0Config'
import { Typography } from '@material-ui/core'
import { Auth0ProviderWithHistory } from './providers/Auth0ProviderWithHistory'

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
});

export default function App(): JSX.Element {

  const audience = 'http://fiveringsdb.com'
  const scope = 'read:current_user'
  
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Auth0ProviderWithHistory audience={audience} scope={scope} >
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
        </Auth0ProviderWithHistory>    
      </BrowserRouter>
    </ThemeProvider>
  )
}
