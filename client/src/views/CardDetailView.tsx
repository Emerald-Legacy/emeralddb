import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, makeStyles, Tab, Tabs,
  TextField, Typography
} from "@material-ui/core";
import { useHistory, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { useCard } from '../hooks/useCard'
import { CardInformation } from '../components/card/CardInformation'
import { CardInPack } from '@5rdb/api'
import { useCurrentUser } from '../providers/UserProvider'
import { RulingList } from '../components/RulingList'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useUiStore } from '../providers/UiStoreProvider'
import { privateApi } from '../api'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import { toSlugId } from '../utils/slugIdUtils'

const useStyles = makeStyles((theme) => ({
  unselected: {
    borderColor: 'lightgrey',
  },
  selected: {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  }
}))

export function CardDetailView(): JSX.Element {
  const params = useParams<{ id: string }>()
  const { cards, packs } = useUiStore()
  const [data] = useCard(params.id)
  const [chosenVersionIndex, setChosenVersionIndex] = useState(0)
  const [chosenVersion, setChosenVersion] = useState<Omit<CardInPack, 'card_id'>>()
  const [deletionModalOpen, setDeletionModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [deletionReplacementCardId, setDeletionReplacementCardId] = useState('')
  const [newCardId, setNewCardId] = useState('')
  const [newName, setNewName] = useState('')
  const [newNameExtra, setNewNameExtra] = useState('')
  const { isDataAdmin } = useCurrentUser()
  const confirm = useConfirm()
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const history = useHistory()


  useEffect(() => {
    if (data.data) {
      setChosenVersion(data.data.versions[chosenVersionIndex])
    }
  }, [chosenVersionIndex, data])

  if (data.loading) {
    return <Loading />
  }
  if (data.error) {
    return <RequestError requestError={data.error} />
  }
  if (data.data == null) {
    return <EmptyState />
  }

  const card = data.data

  const imageWidth = card.type === 'treaty' ? 450 : 300

  const setIdFromNameAndExtra = (name: string | undefined, name_extra: string | undefined) => {
    const baseName = name || ''
    const extra = name_extra || ''
    const newId = baseName + (extra.length > 0 ? ' ' + extra : '')
    setNewCardId(toSlugId(newId))
  }

  const setNameAndGenerateId = (name: string) => {
    setNewName(name)
    setIdFromNameAndExtra(name, newNameExtra)
  }

  const setNameExtraAndGenerateId = (nameExtra: string) => {
    setNewNameExtra(nameExtra)
    setIdFromNameAndExtra(newName, nameExtra)
  }

  function confirmDeletion() {
    confirm({ description: 'Do you really want to delete this card?' })
      .then(() => {
        privateApi.Card.delete({
          cardId: card.id,
          body: { replacementCardId: deletionReplacementCardId },
        })
          .then(() => {
            if (deletionReplacementCardId) {
              history.push(`/card/${deletionReplacementCardId}`)
            } else {
              history.push('/cards')
            }
            setDeletionModalOpen(false)
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The card couldn't be deleted!", { variant: 'error' })
          })
      })
      .catch(() => {
        // Cancel confirmation dialog => do nothing
      })
  }

  function confirmRename() {
    confirm({ description: 'Do you really want to delete this card?' })
      .then(() => {
        privateApi.Card.rename({
          cardId: card.id,
          body: {
            existingCardId: card.id,
            newCardId: newCardId,
            name: newName,
            nameExtra: newNameExtra,
          },
        })
          .then(() => {
            history.push(`/card/${newCardId}`)
            setRenameModalOpen(false)
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The card couldn't be renamed!", { variant: 'error' })
          })
      })
      .catch(() => {
        // Cancel confirmation dialog => do nothing
      })
  }

  return (
    <Container style={{paddingTop: '5px'}}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={7}>
          <CardInformation
            cardWithVersions={card}
            currentVersion={chosenVersion}
          />
          {card.versions.length > 1 && (
            <Grid item xs={12}>
              <Tabs
                TabIndicatorProps={{
                  style: {
                    top: 0,
                  }
                }}
                value={chosenVersionIndex}
                onChange={(_, newValue) =>
                  setChosenVersionIndex(newValue)
                }
                variant="scrollable"
                scrollButtons="auto"
              >
                {card.versions.map((v, index) => (
                  <Tab
                    key={v.pack_id}
                    value={index}
                    label={<Typography variant="caption">{packs.find(p => p.id === v.pack_id)?.name || 'Unknown Pack'}</Typography>}
                    className={
                      chosenVersionIndex === index ? classes.selected : classes.unselected
                    }
                  />
                ))}
              </Tabs>
            </Grid>
          )}
          <RulingList cardId={card.id} rulings={card.rulings} />
        </Grid>
        <Grid item xs={12} md={5} container spacing={0}>
          {chosenVersion && (
            <Grid item xs={12}>
              <img src={chosenVersion.image_url || ''} style={{ maxWidth: imageWidth }} />
            </Grid>
          )}
          {isDataAdmin() && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => history.push(`/card/${card.id}/edit`)}
                style={{ marginTop: 10, maxWidth: imageWidth }}
              >
                Edit this Card
              </Button>
            </Grid>
          )}
          {isDataAdmin() && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => setRenameModalOpen(true)}
                style={{ marginTop: 10, maxWidth: imageWidth }}
              >
                Rename this Card
              </Button>
            </Grid>
          )}
          {isDataAdmin() && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => setDeletionModalOpen(true)}
                style={{ marginTop: 10, maxWidth: imageWidth }}
              >
                Delete this Card
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Dialog open={deletionModalOpen} onClose={() => setDeletionModalOpen(false)}>
        <DialogTitle>Delete Card {card.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Autocomplete
                id="combo-box-cardId"
                autoHighlight
                options={cards}
                getOptionLabel={(option) => `${option.id}`}
                value={cards.find((item) => item.id === deletionReplacementCardId) || null}
                renderInput={(params) => (
                  <TextField {...params} fullWidth label="Replacement Card" variant="outlined" />
                )}
                onChange={(e, value) => {
                  setDeletionReplacementCardId(value?.id || '')
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletionModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button variant="contained" color="secondary" onClick={() => confirmDeletion()}>
            Delete Card
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={renameModalOpen} onClose={() => setRenameModalOpen(false)}>
        <DialogTitle>Rename Card {card.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="name"
                label="Name"
                value={newName}
                onChange={(e) => setNameAndGenerateId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="name_extra"
                label="Name Extra"
                value={newNameExtra}
                onChange={(e) => setNameExtraAndGenerateId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled
                InputLabelProps={{ shrink: true }}
                required
                id="id"
                label="Card ID (generated from Name + Name Extra)"
                value={newCardId}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button variant="contained" color="secondary" onClick={() => confirmRename()}>
            Rename Card
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
