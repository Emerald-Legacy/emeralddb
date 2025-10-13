import React, { createContext, ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { useAuth0Config } from '../hooks/useAuth0Config'
import { Paper, Typography } from '@material-ui/core'

export const Auth0Context = createContext<{ domain: string; clientId: string }>({
  domain: 'undefined',
  clientId: 'undefined',
})

export function Auth0ProviderWithHistory(props: {
  audience: string
  scope: string
  children: ReactNode
}): JSX.Element {
  const history = useHistory()
  const [auth0Config] = useAuth0Config()
  if (auth0Config.loading) {
    return <Typography>Loading ...</Typography>
  }
  const auth0Domain: string = auth0Config.data?.domain || 'undefined'
  const auth0ClientId: string = auth0Config.data?.clientId || 'undefined'

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    console.log(window.location.pathname)
    history.push(appState?.returnTo || window.location.pathname)
  }

  const redirectUri = window.location.origin.includes('localhost')
    ? window.location.origin
    : window.location.origin.replace('http://', 'https://')
  return (
    <Paper>
      {auth0Domain && auth0ClientId && (
        <Auth0Context.Provider value={{ domain: auth0Domain, clientId: auth0ClientId }}>
          <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            authorizationParams={{
              redirect_uri: redirectUri,
              audience: props.audience,
              scope: props.scope,
            }}
            onRedirectCallback={onRedirectCallback}
          >
            {props.children}
          </Auth0Provider>
        </Auth0Context.Provider>
      )}
    </Paper>
  )
}
