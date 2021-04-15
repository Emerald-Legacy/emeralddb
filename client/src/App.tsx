import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'bootstrap/dist/css/bootstrap.min.css'

import { CardsView } from './views/CardsView'
import { CardDetailView } from './views/CardDetailView'
import { HeaderBar } from './components/HeaderBar'
import { MainPage } from './views/MainPage'
import { Auth0ProviderWithHistory } from './providers/Auth0ProviderWithHistory'
import { UiStoreProvider } from './providers/UiStoreProvider'
import { Container } from '@material-ui/core'

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

export default function App(): JSX.Element {
  const audience = 'http://fiveringsdb.com'
  const scope = 'read:current_user'
  const queryClient = new QueryClient()

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Auth0ProviderWithHistory audience={audience} scope={scope}>
            <UiStoreProvider>
              <HeaderBar audience={audience} scope={scope} />
              <Container>
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
              </Container>
            </UiStoreProvider>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
