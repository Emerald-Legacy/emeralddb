import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { Loading } from '../components/Loading'
import { useUiStore } from '../providers/UiStoreProvider'
import { RequestError } from '../components/RequestError'
import { useEffect, useState } from "react";
import { CardInPack } from '@5rdb/api'
import Autocomplete from '@mui/material/Autocomplete'
import { privateApi } from '../api'
import { useSnackbar } from 'notistack'
import { useConfirm } from "material-ui-confirm";

export function EditPackView(): JSX.Element {
  const { cards, packs, toggleReload } = useUiStore()
  const params = useParams<{ id: string }>()
  const [cardId, setCardId] = useState('')
  const [flavor, setFlavor] = useState('')
  const [illustrator, setIllustrator] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [position, setPosition] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [rotated, setRotated] = useState(false)
  const [cardsInPack, setCardsInPack] = useState<CardInPack[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const confirm = useConfirm()
  const { enqueueSnackbar } = useSnackbar()

  function compareCardsInPack(a: CardInPack, b: CardInPack) {
    const positionA = a.position || '0'
    const positionANumber = Number.parseInt(positionA.replace(/\D/g,''));
    const positionAExtra = positionA.replace(/[0-9]/g, '');

    const positionB = b.position || '0'
    const positionBNumber = Number.parseInt(positionB.replace(/\D/g,''));
    const positionBExtra = positionB.replace(/[0-9]/g, '');

    return positionANumber - positionBNumber || positionAExtra.localeCompare(positionBExtra) || a.card_id.localeCompare(b.card_id);
  }

  useEffect(() => {
    if (cards && packId) {
    const packCards = cards.filter((c) => c.versions.some((v) => v.pack_id === packId))
    const newCardsInPack: CardInPack[] = packCards.map((p) => {
      const cardVersionInPack = p.versions.find((v) => v.pack_id === packId)
      return {
        ...cardVersionInPack,
        card_id: p.id,
        pack_id: packId,
        rotated: cardVersionInPack?.rotated || false,
      }
    }).sort((a, b) => compareCardsInPack(a, b))
    setCardsInPack(newCardsInPack)
    }
  }, [cards])

  if (!cards || !packs) {
    return <Loading />
  }

  const packId = params.id!
  const pack = packs.find((p) => p.id === packId)

  if (!pack) {
    return <RequestError requestError="No pack for that ID!" />
  }

  function updateCards() {
    const newCard: CardInPack = {
      card_id: cardId,
      pack_id: packId,
      flavor: flavor,
      illustrator: illustrator,
      image_url: imageUrl,
      position: position,
      quantity: quantity,
      rotated: rotated,
    }
    privateApi.CardInPack.update({
      body: {
        cardInPack: newCard
      }
    }).then(() => {
      toggleReload()
      setCardsInPack([])
      enqueueSnackbar('Successfully posted pack card!', { variant: 'success' })
      setModalOpen(false)
    })
      .catch((error) => {
        console.log(error)
        enqueueSnackbar("The card couldn't be added to the pack!", { variant: 'error' })
      })
  }

  function deleteCard(cardInPack: CardInPack) {
    confirm({ description: 'Do you really want to delete this card from the pack?' })
      .then(() => {
        privateApi.CardInPack.delete({
          body: {
            cardInPack: cardInPack
          }
        }).then(() => {
          toggleReload()
          setModalOpen(false)
          setCardsInPack([])
          enqueueSnackbar('Successfully deleted card from pack!', { variant: 'success' })
        }).catch((error) => {
            console.log(error)
            enqueueSnackbar("The card couldn't be deleted from the pack!", { variant: 'error' })
        })
      })
  }

  function openEditModal(card: CardInPack, index: number) {
    setCardId(card.card_id)
    setFlavor(card.flavor || '')
    setIllustrator(card.illustrator || '')
    setImageUrl(card.image_url || '')
    setPosition(card.position || '')
    setQuantity(card.quantity || 1)
    setRotated(card.rotated || false)
    setModalOpen(true)
  }

  function openCreateModal() {
    setCardId('')
    setFlavor('')
    setIllustrator('')
    setImageUrl('')
    setPosition('')
    setQuantity(3)
    setRotated(false)
    setModalOpen(true)
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography>{pack.name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={() => openCreateModal()}>
          Add Card
        </Button>
      </Grid>
      {cardsInPack.map((card, index) => (
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Box border="1px solid lightgrey">
                <Typography>Card: {card.card_id}</Typography>
                <Typography>Flavor: {card.flavor}</Typography>
                <Typography>Illustrator: {card.illustrator}</Typography>
                <Typography>Position: {card.position}</Typography>
                <Typography>Quantity: {card.quantity}</Typography>
                <Typography>Rotated: {card.rotated ? 'Yes' : 'No'}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openEditModal(card, index)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => deleteCard(card)}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <img src={card.image_url || ''} style={{ maxWidth: 150 }} />
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Edit Pack Card</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Autocomplete
                id="combo-box-cardId"
                autoHighlight
                options={cards}
                getOptionLabel={(option) => `${option.id}`}
                value={cards.find((item) => item.id === cardId) || null}
                renderInput={(params) => (
                  <TextField required {...params} label="Card ID" variant="outlined" />
                )}
                onChange={(e, value) => {
                  setCardId(value?.id || '')
                }}
              />
              <TextField
                value={flavor}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setFlavor(e.target.value)}
                label="Flavor"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={illustrator}
                variant="outlined"
                fullWidth
                onChange={(e) => setIllustrator(e.target.value)}
                label="Illustrator"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={imageUrl}
                variant="outlined"
                fullWidth
                onChange={(e) => setImageUrl(e.target.value)}
                label="Image URL"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={position}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setPosition(e.target.value)}
                label="Position"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={quantity}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                type="number"
                label="Quantity"
                style={{ marginTop: 5 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value={rotated}
                    onChange={(value) => setRotated(value.target.checked)}
                  />
                }
                label={'Rotated Out'}
                labelPlacement="start"
              />
            </Grid>
            <Grid item xs={4}>
              <img src={imageUrl} style={{ maxWidth: 150 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button variant="contained" color="secondary" onClick={() => updateCards()}>
            Update Card
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
