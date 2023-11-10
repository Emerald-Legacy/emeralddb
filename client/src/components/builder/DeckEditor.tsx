import { DecklistViewModel, Decklist as DecklistType, Deck, CardWithVersions } from '@5rdb/api'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core'
import { useState } from 'react'
import { useUiStore } from '../../providers/UiStoreProvider'
import { BuilderCardList } from './BuilderCardList'
import { Decklist } from '../deck/Decklist'
import { privateApi } from '../../api'
import { DeckBuilderWizard } from './DeckBuilderWizard'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'
import { createDeckStatistics } from '../deck/DeckValidator'
import { Loading } from '../Loading'
import { VersionPicker } from './VersionPicker'
import { EmeraldDBLink } from '../EmeraldDBLink'

const useStyles = makeStyles((theme) => ({
  unselectedList: {
    borderColor: 'lightgrey',
  },
  selectedList: {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  },
}))

function getEmptyDeckList(): DecklistViewModel {
  return {
    id: '',
    format: '',
    name: 'New Deck',
    primary_clan: undefined,
    secondary_clan: undefined,
    description: '',
    version_number: '0.1',
    cards: {},
  }
}

function getNextVersionNumber(versionNumber: string): string {
  const versionParts = versionNumber.split('.')
  if (versionParts.length < 2) {
    throw Error('Invalid Version number')
  }
  const minorVersion = Number.parseInt(versionParts[1])
  const nextMinorVersion = isNaN(minorVersion) ? 1 : minorVersion + 1
  versionParts[1] = nextMinorVersion.toString()
  return versionParts.join('.')
}

function prefilterCards(cards: CardWithVersions[], decklist: DecklistViewModel) {
  const stats = createDeckStatistics(decklist.cards, decklist.format, cards)
  let filteredCards = decklist.primary_clan
    ? cards.filter((card) => card.allowed_clans?.includes(decklist.primary_clan || ''))
    : cards
  filteredCards = filteredCards.filter((c) => c.faction !== 'shadowlands')
  filteredCards = filteredCards.filter((c) => !c.text || !c.text.includes('Draft format only.'))
  if (decklist.format === 'skirmish') {
    filteredCards = filteredCards.filter(
      (c) =>
        c.type === 'character' ||
        c.type === 'event' ||
        c.type === 'attachment' ||
        c.type === 'holding'
    )
  }
  filteredCards = filteredCards.filter(
    (c) =>
      c.role_restrictions.length === 0 ||
      stats.role?.traits?.some((trait) => c.role_restrictions.includes(trait))
  )
  if (decklist.format === 'emerald') {
    filteredCards = filteredCards.filter(
      (c) =>
        !c.splash_banned_in || c.splash_banned_in.length === 0 || c.faction === stats.primaryClan
    )
  }
  filteredCards = filteredCards.filter((c) => !c.banned_in?.includes(decklist.format))

  return filteredCards
}

enum ViewTypes {
  EDITOR,
  DESCRIPTION,
  STATISTICS,
}

export function DeckEditor(props: { existingDecklist?: DecklistType | undefined }): JSX.Element {
  const { cards, relevantFormats } = useUiStore()
  const classes = useStyles()
  const [decklist, setDecklist] = useState(props.existingDecklist || getEmptyDeckList())
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()
  const [versionModalOpen, setVersionModalOpen] = useState(false)
  const [description, setDescription] = useState(props.existingDecklist?.description || '')
  const [newVersion, setNewVersion] = useState(decklist.version_number || '0.1')
  const [currentView, setCurrentView] = useState(ViewTypes.EDITOR)
  const [showAllCards, setShowAllCards] = useState(false)

  if (props.existingDecklist && decklist.version_number === props.existingDecklist.version_number) {
    const nextVersionNumber = getNextVersionNumber(props.existingDecklist.version_number)
    setDecklist({
      ...decklist,
      version_number: nextVersionNumber,
    })
    setNewVersion(nextVersionNumber)
  }
  if (!cards) {
    return <Loading />
  }

  const setWizardResult = (
    format: string,
    primaryClan: string,
    strongholdAndRole: Record<string, number>
  ) => {
    setDecklist({
      ...decklist,
      format: format,
      primary_clan: primaryClan,
      cards: strongholdAndRole,
    })
  }

  function setDeckListFromNewCards(newCards: Record<string, number>) {
    const stats = createDeckStatistics(newCards, decklist.format, cards)
    setDecklist({
      ...decklist,
      cards: newCards,
      primary_clan: stats.primaryClan,
      secondary_clan: stats.secondaryClan,
    })
  }

  if (!props.existingDecklist && decklist.format === '') {
    return (
      <DeckBuilderWizard
        onComplete={setWizardResult}
        onImport={(decklist: DecklistViewModel) => {
          const stats = createDeckStatistics(decklist.cards, decklist.format, cards)
          setDecklist({
            ...decklist,
            primary_clan: stats.primaryClan,
            secondary_clan: stats.secondaryClan,
          })
          setDescription(decklist.description || '')
        }}
      />
    )
  }

  const filteredCards = showAllCards ? cards : prefilterCards(cards, decklist)

  function updateDeck(decklist: DecklistViewModel, deckId: string) {
    privateApi.Decklist.create({
      body: {
        ...decklist,
        deck_id: deckId,
        published_date: undefined,
      },
    }).then(() => {
      setDecklist({ ...decklist, version_number: getNextVersionNumber(decklist.version_number) })
      history.push(`/builder/${deckId}/edit`)
      enqueueSnackbar('Successfully created deck', { variant: 'success' })
      setVersionModalOpen(false)
    })
  }

  function createOrUpdateDeck(decklist: DecklistViewModel) {
    if (props.existingDecklist) {
      updateDeck(decklist, props.existingDecklist.deck_id)
    } else {
      privateApi.Deck.create()
        .then((response) => {
          const newDeck = response.data() as Deck
          updateDeck(decklist, newDeck.id)
        })
        .catch((error) => {
          console.log(error)
          enqueueSnackbar('Error while creating deck: ' + error, { variant: 'error' })
        })
    }
  }

  function changeCardQuantity(cardId: string, quantity: number) {
    const selectedCards = decklist.cards
    if (quantity > 0) {
      selectedCards[cardId] = quantity
    } else {
      delete selectedCards[cardId]
    }
    setDecklist({ ...decklist, cards: selectedCards })
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <TextField
              value={decklist.name}
              fullWidth
              label="Deck Name"
              size="small"
              variant="outlined"
              onChange={(e) => setDecklist({ ...decklist, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={decklist.version_number}
              fullWidth
              disabled
              size="small"
              label="Version"
              variant="outlined"
              onChange={(e) => setDecklist({ ...decklist, version_number: e.target.value })}
            />
          </Grid>
          <Grid item xs={6} lg={9}>
            <Autocomplete
              id="combo-box-format"
              autoHighlight
              options={relevantFormats}
              getOptionLabel={(option) => option.name}
              value={relevantFormats.find((item) => item.id === decklist.format) || null}
              renderInput={(params) => (
                <TextField {...params} label="Format" variant="outlined" size="small" />
              )}
              onChange={(e, value) => {
                setDecklist({ ...decklist, format: value?.id || '' })
              }}
            />
          </Grid>
          <Grid item xs={6} lg={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setVersionModalOpen(true)}
              fullWidth
            >
              Custom Version
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box border="1px solid" padding={3}>
              <Decklist decklist={decklist} withoutHeader onQuantityChange={changeCardQuantity} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              {props.existingDecklist && (
                <EmeraldDBLink href={`/decks/${props.existingDecklist?.deck_id}/`}>
                  <Button variant="contained" fullWidth>
                    Link to Decklist
                  </Button>
                </EmeraldDBLink>
              )}
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => createOrUpdateDeck(decklist)}
                fullWidth
              >
                Save Deck
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Tabs
                value={currentView}
                onChange={(e, newValue) => setCurrentView(newValue)}
                variant="fullWidth"
              >
                <Tab
                  label="Editor"
                  value={ViewTypes.EDITOR}
                  className={
                    currentView === ViewTypes.EDITOR ? classes.selectedList : classes.unselectedList
                  }
                />
                <Tab
                  label="Description"
                  value={ViewTypes.DESCRIPTION}
                  className={
                    currentView === ViewTypes.DESCRIPTION
                      ? classes.selectedList
                      : classes.unselectedList
                  }
                />
                <Tab
                  label="Statistics"
                  value={ViewTypes.STATISTICS}
                  className={
                    currentView === ViewTypes.STATISTICS
                      ? classes.selectedList
                      : classes.unselectedList
                  }
                />
              </Tabs>
              <Box hidden={currentView !== ViewTypes.EDITOR}>
                {cards.length > 0 && (
                  <BuilderCardList
                    prefilteredCards={filteredCards}
                    selectedCards={decklist.cards}
                    onCardChange={(newCards: Record<string, number>) =>
                      setDeckListFromNewCards(newCards)
                    }
                    showAllCards={showAllCards}
                    setShowAllCards={setShowAllCards}
                    format={decklist.format}
                    primaryClan={decklist.primary_clan}
                  />
                )}
              </Box>
              <Box hidden={currentView !== ViewTypes.DESCRIPTION} p={1}>
                <TextField
                  value={description}
                  multiline
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => setDecklist({ ...decklist, description: description })}
                  label="Deck Description"
                />
              </Box>
              <Box hidden={currentView !== ViewTypes.STATISTICS} p={1}>
                <Typography align="center" variant="h6">
                  Coming Soon
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Dialog open={versionModalOpen} onClose={() => setVersionModalOpen(false)}>
        <DialogTitle>Specify Version</DialogTitle>
        <DialogContent>
          <VersionPicker
            version={newVersion}
            onVersionChange={(version) => setNewVersion(version)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVersionModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setDecklist({ ...decklist, version_number: newVersion })
              setVersionModalOpen(false)
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
