import { useAuth0 } from '@auth0/auth0-react'
import { Typography } from '@material-ui/core'
import { useContext, useEffect } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Auth0Context } from '../../providers/Auth0ProviderWithHistory';
import { setToken, unsetToken } from '../../utils/auth';
import { LoginButton } from './LoginButton'
import { LogoutButton } from './LogoutButton';

export function UserMenu(props: {audience: string, scope: string}): JSX.Element {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user} = useAuth0()
  const [currentUser] = useCurrentUser()

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: props.audience,
          scope: props.scope,
        });
        setToken(accessToken);
      } catch (e) {
        console.log(e)
      }
    };
    if (isAuthenticated) {
      fetchToken()
    }
  }, [isAuthenticated]);

  if (isLoading || currentUser.loading) {
    return <Typography>Loading ...</Typography>
  }

  if (!isAuthenticated) {
    return (
      <div>
        <LoginButton />
      </div>
    )
  }
  return (
    <div>
      <Typography>{currentUser.data?.name}</Typography>
      <LogoutButton />
    </div>
  )
}
