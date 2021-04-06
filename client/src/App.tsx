import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { createContext } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import { captureToken } from './utils/auth'
import { CardsView } from './views/CardsView'
import { CardDetailView } from './views/CardDetailView'

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

export const UserContext = createContext<any | undefined>(undefined)

export default function App(): JSX.Element {
  captureToken()
  const user = {data: undefined}

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={user.data}>
        <BrowserRouter>
          <Switch>
            <Route path="/cards">
              <CardsView />
            </Route>
            <Route path="/card/:id">
              <CardDetailView />
            </Route>
            <Redirect from="/" exact to="/cards" />
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  )
}
