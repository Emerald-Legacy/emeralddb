import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HeaderBar } from './components/HeaderBar'
import { Auth0ProviderWithHistory } from './providers/Auth0ProviderWithHistory'
import { UiStoreProvider } from './providers/UiStoreProvider'
import { Container } from '@material-ui/core'
import { UserProvider } from './providers/UserProvider'
import { ConfirmProvider } from 'material-ui-confirm'
import { Routes } from './Routes'

// create our material ui theme using up to date typography variables
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#263238',
    },
    secondary: {
      main: '#da532c',
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
              <ConfirmProvider
                defaultOptions={{
                  dialogProps: {
                    open: true,
                    maxWidth: 'md',
                  },
                }}
              >
                <UserProvider>
                  <HeaderBar audience={audience} scope={scope} />
                  <Container style={{ paddingTop: 15 }}>
                    <Routes />
                  </Container>
                </UserProvider>
              </ConfirmProvider>
            </UiStoreProvider>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
