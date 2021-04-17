import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core'
import { UserMenu } from './usermenu/UserMenu'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
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

  const host = window.location.host;
  const title = host.includes('localhost') ? 'LOCAL FiveRingsDB' : host.includes('beta-') ? "BETA FiveRingsDB" : "FiveRingsDB"
  document.title = title;

  return (
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{cursor: 'pointer'}} onClick={() => history.push('/cards')}>
            {title}
          </Typography>
          <Typography className={classes.title}></Typography>
          <UserMenu audience={props.audience} scope={props.scope} />
        </Toolbar>
    </AppBar>
  )
}
