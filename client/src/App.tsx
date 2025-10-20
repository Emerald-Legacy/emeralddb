import { Theme } from '@mui/material/styles';
import { ThemeProvider, createTheme, responsiveFontSizes, StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HeaderBar } from './components/HeaderBar'
import { Auth0ProviderWithHistory } from './providers/Auth0ProviderWithHistory'
import { UiStoreProvider } from './providers/UiStoreProvider'
import { Container, Grid, Toolbar, useMediaQuery } from '@mui/material'
import { UserProvider } from './providers/UserProvider'
import { ConfirmProvider } from 'material-ui-confirm'
import { Routes } from './Routes'
import { SnackbarProvider } from 'notistack'

// create our material ui theme using up to date typography variables
let theme = createTheme({
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Auth0ProviderWithHistory audience={audience} scope={scope}>
              <UiStoreProvider>
                <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
                  <ConfirmProvider
                    defaultOptions={{
                      dialogProps: {
                        maxWidth: 'md',
                      },
                    }}
                  >
                    <UserProvider>
                      <HeaderBar audience={audience} scope={scope} />
                      <Toolbar variant="dense" />
                      <Container maxWidth={false} style={{ paddingTop: 15 }}>
                        <Grid container justifyContent="center">
                          <Grid size={{ xs: 12, md: 12, lg: is1440PxOrBigger ? 10 : 12, xl: 10 }}>
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
    </StyledEngineProvider>
  );
}
