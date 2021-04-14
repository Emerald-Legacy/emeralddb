import React, { createContext } from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0Config } from '../hooks/useAuth0Config'
import { Typography } from "@material-ui/core";

export const Auth0Context = createContext<{domain: string, clientId: string}>({domain: 'undefined', clientId: 'undefined'})

export const Auth0ProviderWithHistory = (props: { audience: string, scope: string, children: any}) => {
  const history = useHistory();
  const [auth0Config] = useAuth0Config()
  if (auth0Config.loading) {
    return <Typography>Loading ...</Typography>
  }
  const auth0Domain: string = auth0Config.data?.domain || 'undefined'
  const auth0ClientId: string = auth0Config.data?.clientId || 'undefined'

  const onRedirectCallback = (appState: { returnTo?: string }) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Context.Provider value={ {domain: auth0Domain, clientId: auth0ClientId} }>
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
        audience={props.audience}
        scope={props.scope}
      >
        {props.children}
      </Auth0Provider>
    </Auth0Context.Provider>
  );
};