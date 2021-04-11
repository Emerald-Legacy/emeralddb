import { useAuth0 } from '@auth0/auth0-react'
import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { Http2ServerRequest } from 'http2'
import { useEffect } from 'react'
import { setToken, unsetToken } from '../utils/auth'
import { UserMenu } from './UserMenu'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export function HeaderBar(props: {audience: string, scope: string}) {
  const classes = useStyles()
  const { getAccessTokenSilently, user } = useAuth0()

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: props.audience,
          scope: props.scope,
        });
        console.log("Setting token...")
        setToken(accessToken);
        console.log(user)
      } catch (e) {
        unsetToken();
      }
    };
    getToken()
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          FiveRingsDB
        </Typography>
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}
