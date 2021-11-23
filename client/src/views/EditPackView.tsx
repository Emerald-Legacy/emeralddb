import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom'
import { Loading } from '../components/Loading'
import { useUiStore } from '../providers/UiStoreProvider'
import { RequestError } from '../components/RequestError'
import { useState } from 'react'
import { CardInPack } from '@5rdb/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { privateApi } from '../api'
import { useSnackbar } from 'notistack'

export function EditPackView(): JSX.Element {
  const { cards, packs } = useUiStore()
  const history = useHistory()
  const params = useParams<{ id: string }>()
  const [editIndex, setEditIndex] = useState(-1)
  const [cardId, setCardId] = useState('')
  const [flavor, setFlavor] = useState('')
  const [illustrator, setIllustrator] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [position, setPosition] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [cardsInPack, setCardsInPack] = useState<CardInPack[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  if (!cards || !packs) {
    return <Loading />
  }

  const packId = params.id
  const pack = packs.find((p) => p.id === packId)

  if (!pack) {
    return <RequestError requestError="No pack for that ID!" />
  }

  const packCards = cards.filter((c) => c.versions.some((v) => v.pack_id === packId))
  if (cardsInPack.length === 0 && packCards.length > 0) {
    const newCardsInPack: CardInPack[] = packCards.map((p) => {
      return { ...p.versions.find((v) => v.pack_id === packId), card_id: p.id, pack_id: packId }
    })
    setCardsInPack(newCardsInPack)
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
    }
    if (editIndex === -1) {
      setCardsInPack([...cardsInPack, newCard])
    } else {
      const newArray = [...cardsInPack]
      newArray[editIndex] = newCard
      setCardsInPack(newArray)
    }
    setModalOpen(false)
  }

  function openEditModal(card: CardInPack, index: number) {
    setEditIndex(index)
    setCardId(card.card_id)
    setFlavor(card.flavor || '')
    setIllustrator(card.illustrator || '')
    setImageUrl(card.image_url || '')
    setPosition(card.position || '')
    setQuantity(card.quantity || 1)
    setModalOpen(true)
  }

  function openCreateModal() {
    setEditIndex(-1)
    setCardId('')
    setFlavor('')
    setIllustrator('')
    setImageUrl('')
    setPosition('')
    setQuantity(3)
    setModalOpen(true)
  }

  function savePackCards() {
    privateApi.CardInPack.update({
      body: {
        cardsInPacks: cardsInPack,
      },
    })
      .then(() => {
        enqueueSnackbar('Successfully posted pack cards!', { variant: 'success' })
        history.push('/admin/cycles')
      })
      .catch((error) => {
        console.log(error)
        enqueueSnackbar("The cards couldn't be posted!", { variant: 'error' })
      })
  }

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={12}>
        <Typography>{pack.name}</Typography>
        <Button variant="contained" color="secondary" onClick={() => savePackCards()}>
          Save Changes
        </Button>
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
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openEditModal(card, index)}
                >
                  Edit
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
  )
}
