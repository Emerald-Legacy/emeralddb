import { DeckWithVersions } from '@5rdb/api'
import { makeStyles, Box, Typography, Button, Grid, useMediaQuery } from '@material-ui/core'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { privateApi } from '../../api'
import { formats } from '../../utils/enums'
import { CardFactionIcon } from '../card/CardFactionIcon'
import { DecklistTabs, latestDecklistForDeck } from './DecklistTabs'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import LinkIcon from '@material-ui/icons/Link'
import { EmeraldDBLink } from '../EmeraldDBLink'

const useStyles = makeStyles((theme) => ({
  unselectedDeck: {
    borderColor: 'lightgrey',
  },
  selectedDeck: {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
    borderRightWidth: '3px',
  },
  newDeckButton: {
    marginBottom: 3,
  },
  format: {
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}))

export function DeckTabs(props: {
  decks: DeckWithVersions[]
  onDeckUpdated: () => void
}): JSX.Element {
  const { decks } = props
  const classes = useStyles()
  const confirm = useConfirm()
  const { enqueueSnackbar } = useSnackbar()
  const [currentDeckId, setCurrentDeckId] = useState<string | undefined>()
  const isSmOrBigger = useMediaQuery('(min-width:600px)')

  function chooseDeck(deckId: string) {
    if (deckId === currentDeckId) {
      setCurrentDeckId(undefined)
    } else {
      setCurrentDeckId(deckId)
    }
  }

  function confirmDeletion(deckId: string) {
    confirm({ description: 'Do you really want to delete this deck and all of its decklists?' })
      .then(() => {
        privateApi.Deck.delete({ deckId: deckId })
          .then(() => {
            props.onDeckUpdated()
            setCurrentDeckId(undefined)
            enqueueSnackbar('The deck was deleted successfully!', { variant: 'success' })
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The deck couldn't be deleted!", { variant: 'error' })
          })
      })
      .catch(() => {
        // Cancel confirmation dialog => do nothing
      })
  }

  const sortedDecks = decks.sort(
    (a, b) =>
      new Date(latestDecklistForDeck(b)?.created_at || Date.now()).getTime() -
      new Date(latestDecklistForDeck(a)?.created_at || Date.now()).getTime()
  )

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} lg={3} xl={4}>
        <Grid container>
          <Grid item xs={12}>
            <EmeraldDBLink href={`/builder/create/new`}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                className={classes.newDeckButton}
              >
                Create New Deck
              </Button>
            </EmeraldDBLink>
          </Grid>
          {sortedDecks.map((deck) => {
            const latestList = latestDecklistForDeck(deck)
            return (
              <Grid key={deck.id} item xs={12}>
                <Box
                  padding={1}
                  borderRadius={3}
                  border="1px solid"
                  hidden={!isSmOrBigger && currentDeckId !== undefined && deck.id !== currentDeckId}
                  className={
                    deck.id === currentDeckId ? classes.selectedDeck : classes.unselectedDeck
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => chooseDeck(deck.id)}
                >
                  <Typography>
                    {latestList?.name || 'Empty Deck'}{' '}
                    {latestList?.primary_clan && (
                      <CardFactionIcon faction={latestList.primary_clan} />
                    )}
                    {latestList?.secondary_clan && (
                      <CardFactionIcon faction={latestList.secondary_clan} />
                    )}
                  </Typography>
                  <Typography className={classes.format}>
                    Format:{' '}
                    {formats.find((format) => latestList?.format === format.id)?.name || 'N/A'}
                  </Typography>
                  <Typography className={classes.format}>
                    Last Updated:{' '}
                    {latestList?.created_at
                      ? new Date(latestList?.created_at).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
      <Grid item xs={12} lg={9} xl={8}>
        <Grid container>
          {currentDeckId && (
            <Grid item xs={12}>
              <Grid container spacing={1} justify="flex-end">
                <Grid item xs={4}>
                  <EmeraldDBLink href={`/builder/${currentDeckId}/edit`}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      className={classes.newDeckButton}
                      startIcon={<EditIcon />}
                    >
                      Edit Deck
                    </Button>
                  </EmeraldDBLink>
                </Grid>
                <Grid item xs={4}>
                  <EmeraldDBLink href={`/decks/${currentDeckId}/`}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      className={classes.newDeckButton}
                      startIcon={<LinkIcon />}
                    >
                      Link (Latest Version)
                    </Button>
                  </EmeraldDBLink>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    className={classes.deleteButton}
                    fullWidth
                    onClick={() => confirmDeletion(currentDeckId)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete This Deck
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            {sortedDecks.map((deck) => (
              <DecklistTabs
                key={deck.id}
                deck={deck}
                currentDeckId={currentDeckId || ''}
                onDecklistUpdated={props.onDeckUpdated}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
