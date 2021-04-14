import { User } from '@5rdb/api';
import { useAuth0 } from '@auth0/auth0-react'
import { Typography } from '@material-ui/core'
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { privateApi } from '../../api';
import { getToken, setToken } from '../../utils/auth';
import { Queries } from '../HeaderBar';
import { LoginButton } from './LoginButton'
import { LogoutButton } from './LogoutButton';

export function UserMenu(props: {audience: string, scope: string}): JSX.Element {
  const { getAccessTokenSilently } = useAuth0()
  const [currentUser, setCurrentUser] = useState<User | undefined>()
  useQuery(Queries.USER, () => privateApi.User.current().then((user) => setCurrentUser(user.data())), 
  {
    enabled: !!getToken()}
  )
  const queryClient = useQueryClient()

  const fetchToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: props.audience,
        scope: props.scope,
      });
      setToken(accessToken);
      queryClient.invalidateQueries(Queries.USER)
    } catch (e) {
      console.log(e)
    }
  }

  if (currentUser !== undefined) {
    return <div>
      <Typography>{currentUser.name}</Typography>
      <LogoutButton onLogout={() => setCurrentUser(undefined)}/>
    </div>
  }

  return (
    <div>
      <LoginButton onLogin={fetchToken}/>
    </div>
  )
  
}
