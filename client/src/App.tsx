import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HeaderBar } from './components/HeaderBar'
import { Auth0ProviderWithHistory } from './providers/Auth0ProviderWithHistory'
import { UiStoreProvider } from './providers/UiStoreProvider'
import { Container, Grid, useMediaQuery } from '@material-ui/core'
import { UserProvider } from './providers/UserProvider'
import { ConfirmProvider } from 'material-ui-confirm'
import { Routes } from './Routes'
import { SnackbarProvider } from 'notistack'

// create our material ui theme using up to date typography variables
let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#1b5e20',
    },
  },
})

theme = responsiveFontSizes(theme)

export default function App(): JSX.Element {
  const audience = 'http://fiveringsdb.com'
  const scope = 'read:current_user'
  const queryClient = new QueryClient()
  const is1440PxOrBigger = useMediaQuery('(min-width:1440px)')

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Auth0ProviderWithHistory audience={audience} scope={scope}>
            <UiStoreProvider>
              <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
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
                    <Container maxWidth={false} style={{ paddingTop: 15, minHeight: '97vh' }}>
                      <Grid container justify="center">
                        <Grid item xs={12} md={12} lg={is1440PxOrBigger ? 10 : 12} xl={10}>
                          <Routes />
                        </Grid>
                      </Grid>
                    </Container>
                  </UserProvider>
                </ConfirmProvider>
              </SnackbarProvider>
            </UiStoreProvider>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
