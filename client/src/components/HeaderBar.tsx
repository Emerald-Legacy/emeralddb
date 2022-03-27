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
  useMediaQuery,
  Container,
  List,
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
import { EmeraldDBLink } from './EmeraldDBLink'

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
  const [cardAnchorEl, setCardAnchorEl] = useState<null | HTMLElement>(null)
  const [rulesAnchorEl, setRulesAnchorEl] = useState<null | HTMLElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const isMdOrSmaller = useMediaQuery('(max-width:960px)')
  const is1440PxOrBigger = useMediaQuery('(min-width:1440px)')

  const host = window.location.host
  const prefix = host.includes('localhost') ? 'LOCAL' : host.includes('beta-') ? 'BETA' : ''
  const title = `${prefix} EmeraldDB`
  document.title = title

  const handleCardMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setCardAnchorEl(event.currentTarget)
  }

  const handleRulesMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setRulesAnchorEl(event.currentTarget)
  }

  const closeModalsAndPopUps = () => {
    setCardAnchorEl(null)
    setRulesAnchorEl(null)
    setIsMobileOpen(false)
  }

  const goTo = (route: string) => {
    closeModalsAndPopUps()
    history.push(route)
  }

  const listenToEnterDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const encodedString = encodeURIComponent(searchValue)
      goTo(`/cards?query=${encodedString}`)
    }
  }

  return (
    <AppBar position="sticky">
      <Toolbar variant="dense">
        <Container maxWidth={false}>
          <Grid container justify={'center'}>
            <Grid item xs={12} lg={is1440PxOrBigger ? 10 : 12} xl={10}>
              <Grid container>
                <Grid item xs={11} sm={11} md={2} lg={3} xl={2}>
                  <EmeraldDBLink href={'/cards'} onClick={() => closeModalsAndPopUps()}>
                    <img src="/static/logo.png" className={classes.logo} />
                  </EmeraldDBLink>
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
                      justify="flex-end"
                      alignItems={isMdOrSmaller ? 'flex-end' : 'center'}
                    >
                      <Grid item>
                        <ListItem button dense={isMdOrSmaller}>
                          <ListItemText
                            primary={
                              <EmeraldDBLink href="/cards" onClick={closeModalsAndPopUps}>
                                Cards
                              </EmeraldDBLink>
                            }
                          />
                          <span onClick={handleCardMenuClick}>
                            {cardAnchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </span>
                        </ListItem>
                        <Menu
                          anchorEl={cardAnchorEl}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          keepMounted
                          open={Boolean(cardAnchorEl)}
                          onClose={() => setCardAnchorEl(null)}
                        >
                          <div>
                            <CycleList
                              rootUrl="/cards"
                              cycleUrl="/cards?cycle="
                              packUrl="/cards?pack="
                              onClick={closeModalsAndPopUps}
                              rootLabel="View All Cards"
                            />
                          </div>
                        </Menu>
                      </Grid>
                      <Grid item>
                        <ListItem button dense={isMdOrSmaller}>
                          <ListItemText
                            primary={
                              <EmeraldDBLink href="/decks" onClick={closeModalsAndPopUps}>
                                Decks
                              </EmeraldDBLink>
                            }
                          />
                        </ListItem>
                      </Grid>
                      <Grid item>
                        <ListItem button dense={isMdOrSmaller}>
                          <ListItemText
                            primary={
                              <EmeraldDBLink href="/builder" onClick={closeModalsAndPopUps}>
                                Builder
                              </EmeraldDBLink>
                            }
                          />
                        </ListItem>
                      </Grid>
                      <Grid item>
                        <ListItem button dense={isMdOrSmaller} onClick={handleRulesMenuClick}>
                          <ListItemText
                            primary={
                              <EmeraldDBLink href="/rules" onClick={closeModalsAndPopUps}>
                                Rules
                              </EmeraldDBLink>
                            }
                          />
                          <span>{rulesAnchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
                        </ListItem>
                        <Menu
                          anchorEl={rulesAnchorEl}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          keepMounted
                          open={Boolean(rulesAnchorEl)}
                          onClose={() => setRulesAnchorEl(null)}
                        >
                          <div>
                            <List dense>
                              <ListItem>
                                <EmeraldDBLink
                                  href="/rules/organized-play"
                                  onClick={closeModalsAndPopUps}
                                >
                                  <b>Restricted and Banned Lists</b>
                                </EmeraldDBLink>
                              </ListItem>
                              <ListItem>
                                <EmeraldDBLink
                                  href="/rules/organized-play/emerald"
                                  onClick={closeModalsAndPopUps}
                                >
                                  - Emerald Legacy
                                </EmeraldDBLink>
                              </ListItem>
                              <ListItem>
                                <EmeraldDBLink
                                  href="/rules/organized-play/standard"
                                  onClick={closeModalsAndPopUps}
                                >
                                  - Fantasy Flight Games
                                </EmeraldDBLink>
                              </ListItem>
                              <ListItem>
                                <EmeraldDBLink href="/rules/emerald" onClick={closeModalsAndPopUps}>
                                  <b>Emerald Legacy's RRG</b>
                                </EmeraldDBLink>
                              </ListItem>
                              <ListItem>
                                <EmeraldDBLink
                                  href="/rules/imperial"
                                  onClick={closeModalsAndPopUps}
                                >
                                  <b>Fantasy Flight Games' RRG</b>
                                </EmeraldDBLink>
                              </ListItem>
                            </List>
                          </div>
                        </Menu>
                      </Grid>
                      {isDataAdmin() && (
                        <Grid item>
                          <ListItem button dense={isMdOrSmaller}>
                            <ListItemText
                              primary={
                                <EmeraldDBLink href="/admin" onClick={closeModalsAndPopUps}>
                                  Admin
                                </EmeraldDBLink>
                              }
                            />
                          </ListItem>
                        </Grid>
                      )}
                      <Grid item>
                        <ListItem button dense={isMdOrSmaller}>
                          <ListItemText
                            primary={
                              <EmeraldDBLink href="/faq" onClick={closeModalsAndPopUps}>
                                FAQ
                              </EmeraldDBLink>
                            }
                          />
                        </ListItem>
                      </Grid>
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
                      <Grid item />
                    </Grid>
                  </Collapse>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  )
}
