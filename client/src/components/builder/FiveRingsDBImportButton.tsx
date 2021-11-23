import { DecklistViewModel } from '@5rdb/api'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

const fiveRingsDbPermalinkPrefix = 'https://fiveringsdb.com/strains/'
const fiveRingsDbApiPrefix = 'https://api.fiveringsdb.com/strains/'

interface FiveRingsDBResponse {
  rrg_version: string
  success: boolean
  record: {
    created_at: string
    head: {
      cards: Record<string, number>
      description: string
      format: string
      id: string
      name: string
      primary_clan: string
      problem: number
      published: false
      secondary_clan: string
      version: string
    }
    id: string
  }
}

export function FiveRingsDBImportButton(props: {
  onImport: (decklist: DecklistViewModel) => void
}): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false)
  const [permalink, setPermalink] = useState('')
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const isSmOrSmaller = useMediaQuery('(max-width:400px)')

  function importFiveRingsDBDeck() {
    setLoading(true)
    if (!permalink.startsWith(fiveRingsDbPermalinkPrefix)) {
      enqueueSnackbar(`Invalid Permalink, must start with "${fiveRingsDbPermalinkPrefix}"!`, {
        variant: 'error',
      })
      setLoading(false)
    } else {
      const apiUrl = permalink
        .replace(fiveRingsDbPermalinkPrefix, fiveRingsDbApiPrefix)
        .replace('/view', '')
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          const importedDeck = (data as FiveRingsDBResponse).record.head
          props.onImport({
            id: '',
            format: importedDeck.format,
            name: importedDeck.name,
            primary_clan: importedDeck.primary_clan,
            secondary_clan: importedDeck.secondary_clan,
            version_number: '0.1',
            description: importedDeck.description,
            cards: importedDeck.cards,
          })
          setModalOpen(false)
          setLoading(false)
        })
    }
  }

  return (
    <>
      <Button variant="contained" color="secondary" fullWidth onClick={() => setModalOpen(true)}>
        Import from FiveRingsDB
      </Button>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Import from FiveRingsDB</DialogTitle>
        <DialogContent>
          <TextField
            value={permalink}
            variant="outlined"
            fullWidth
            onChange={(e) => setPermalink(e.target.value)}
            label="Permalink"
            style={{ minWidth: isSmOrSmaller ? 250 : 400 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={loading}
            onClick={() => importFiveRingsDBDeck()}
          >
            Import Deck
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
