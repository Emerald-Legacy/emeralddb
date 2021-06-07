import {
  AppBar,
  IconButton,
  Collapse,
  Grid,
  InputAdornment,
  ListItem,
  ListItemText,
  makeStyles,
  Menu,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core'
import { UserMenu } from './usermenu/UserMenu'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '../providers/UserProvider'
import { useState } from 'react'
import { CycleList } from './CycleList'
import SearchIcon from '@material-ui/icons/Search'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import MenuIcon from '@material-ui/icons/Menu'

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
  },
  searchField: {
    backgroundColor: 'white',
    minWidth: 50,
    maxWidth: 200,
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
  const { isDataAdmin } = useCurrentUser()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const isMdOrSmaller = useMediaQuery('(max-width:960px)')

  const host = window.location.host
  const prefix = host.includes('localhost') ? 'LOCAL' : host.includes('beta-') ? 'BETA' : ''
  const title = `${prefix} EmeraldDB`
  document.title = title

  const handleCardMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const goTo = (route: string) => {
    history.push(route)
    setIsMobileOpen(false)
  }

  const listenToEnterDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const encodedString = encodeURIComponent(searchValue)
      goTo(`/cards?query=${encodedString}`)
    }
  }

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Grid container>
          <Grid item xs={11} sm={11} md={2} lg={3} xl={2}>
            <Typography
              variant="h6"
              style={{ cursor: 'pointer' }}
              onClick={() => goTo('/cards')}
            >
              <span>{prefix}</span>
              <img src="/static/logo.png" className={classes.logo} />
            </Typography>
            <Typography className={classes.title}></Typography>
          </Grid>
          {isMdOrSmaller && (
            <Grid item xs={1} sm={1}>
              <IconButton color="inherit" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                <MenuIcon />
              </IconButton>
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={10} lg={9} xl={10}>
            <Collapse in={!isMdOrSmaller || isMobileOpen}>
              <Grid
                direction={isMdOrSmaller ? 'column' : 'row'}
                container
                justify="center"
                alignItems={isMdOrSmaller ? 'flex-end' : 'center'}
              >
                <Grid item>
                  <ListItem button onClick={handleCardMenuClick} dense={isMdOrSmaller}>
                    <ListItemText
                      primary="Cards"
                    />
                    {anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItem>
                  <Menu
                    anchorEl={anchorEl}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <div>
                      <CycleList
                        onRootClick={() => {
                          goTo('/cards')
                          setAnchorEl(null)
                        }}
                        onCycleClick={(cycleId: string) => {
                          goTo(`/cards?cycle=${cycleId}`)
                          setAnchorEl(null)
                        }}
                        onPackClick={(packId: string) => {
                          goTo(`/cards?pack=${packId}`)
                          setAnchorEl(null)
                        }}
                        rootLabel="View All Cards"
                      />
                    </div>
                  </Menu>
                </Grid>
                <Grid item>
                  <ListItem button dense={isMdOrSmaller}>
                    <ListItemText
                      primary="Decks"
                      onClick={() => {
                        goTo('/decks')
                      }}
                    />
                  </ListItem>
                </Grid>
                <Grid item>
                  <ListItem button dense={isMdOrSmaller}>
                    <ListItemText
                      primary="Builder"
                      onClick={() => {
                        goTo('/builder')
                      }}
                    />
                  </ListItem>
                </Grid>
                <Grid item>
                  <ListItem button dense={isMdOrSmaller}>
                    <ListItemText
                      primary="Rules"
                      onClick={() => {
                        goTo('/rules')
                      }}
                    />
                  </ListItem>
                </Grid>
                {isDataAdmin() && (
                  <Grid item>
                    <ListItem button dense={isMdOrSmaller}>
                      <ListItemText
                        primary="Admin"
                        onClick={() => {
                          goTo('/admin')
                        }}
                      />
                    </ListItem>
                  </Grid>
                )}
                <Grid item>
                  <ListItem dense={isMdOrSmaller}>
                    <TextField
                      className={classes.searchField}
                      placeholder="Search Card..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={listenToEnterDown}
                    />
                  </ListItem>
                </Grid>
                <Grid item>
                  <UserMenu audience={props.audience} scope={props.scope} />
                </Grid>
                <Grid item></Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
