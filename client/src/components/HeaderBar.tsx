import { AppBar, Button, makeStyles, Toolbar, Typography } from '@material-ui/core'
import { UserMenu } from './usermenu/UserMenu'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '../providers/UserProvider'

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
  },
  adminButton: {
    marginRight: 10,
  },
  logo: {
    height: 45,
    marginRight: 5,
  }
}))

export enum Queries {
  USER = 'USER',
  CARDS = 'CARDS',
  PACKS = 'PACKS',
  CYCLES = 'CYCLES',
  TRAITS = 'TRAITS',
}

export function HeaderBar(props: { audience: string; scope: string }): JSX.Element {
  const classes = useStyles()
  const history = useHistory()
  const { isDataAdmin } = useCurrentUser()

  const host = window.location.host
  const prefix = host.includes('localhost')
  ? 'LOCAL'
  : host.includes('beta-')
  ? 'BETA'
  : ''
  const title = `${prefix} EmeraldDB`
  document.title = title

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography
          variant="h6"
          style={{ cursor: 'pointer' }}
          onClick={() => history.push('/cards')}
        >
          {prefix}<img src='/static/logo.png' className={classes.logo}/>
        </Typography>
        <Typography className={classes.title}></Typography>
        {isDataAdmin() && (
          <Button
            variant="contained"
            color="secondary"
            className={classes.adminButton}
            onClick={() => history.push('/admin')}
          >
            Admin Page
          </Button>
        )}
        <UserMenu audience={props.audience} scope={props.scope} />
      </Toolbar>
    </AppBar>
  )
}
