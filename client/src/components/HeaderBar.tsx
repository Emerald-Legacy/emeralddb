import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { UserMenu } from './usermenu/UserMenu'

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
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          FiveRingsDB
        </Typography>
        <UserMenu audience={props.audience} scope={props.scope} />
      </Toolbar>
    </AppBar>
  )
}
