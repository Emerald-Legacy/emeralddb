import {
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel,
  Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import { Loading } from '../components/Loading'
import { useUiStore } from '../providers/UiStoreProvider'
import React, { useState } from 'react'
import { Format } from "@5rdb/api";
import { privateApi } from '../api'
import { useSnackbar } from 'notistack'
import EditIcon from "@material-ui/icons/Edit";
import { CycleList } from "../components/CycleList";

export function EditFormatsView(): JSX.Element {
  const { formats, toggleReload } = useUiStore()
  const [formatId, setFormatId] = useState('')
  const [formatName, setFormatName] = useState('')
  const [legalPacks, setLegalPacks] = useState<string[]>([])
  const [isSupported, setIsSupported] = useState(false)
  const [position, setPosition] = useState(0)
  const [maintainer, setMaintainer] = useState('')
  const [description, setDescription] = useState('')
  const [infoLink, setInfoLink] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [packModalOpen, setPackModalOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  if (!formats) {
    return <Loading />
  }

  function openEditModal(format: Format) {
    setFormatId(format.id)
    setFormatName(format.name)
    setLegalPacks(format.legal_packs || [])
    setIsSupported(format.supported)
    setPosition(format.position)
    setMaintainer(format.maintainer || '')
    setDescription(format.description || '')
    setInfoLink(format.info_link || '')
    setModalOpen(true)
  }

  function openCreateModal() {
    setFormatId('')
    setFormatName('')
    setLegalPacks([])
    setIsSupported(false)
    setPosition(0)
    setMaintainer('')
    setDescription('')
    setInfoLink('')
    setModalOpen(true)
  }

  function saveFormat() {
    privateApi.Format.update({
      body: {
        format: {
          id: formatId,
          name: formatName,
          legal_packs: legalPacks,
          supported: isSupported,
          position: position,
          maintainer: maintainer || null,
          description: description || null,
          info_link: infoLink || null,
        },
      },
    })
      .then(() => {
        toggleReload()
        setFormatId('')
        setFormatName('')
        setLegalPacks([])
        setIsSupported(false)
        setPosition(0)
        setMaintainer('')
        setDescription('')
        setInfoLink('')
        setModalOpen(false)
        enqueueSnackbar('Successfully posted format!', { variant: 'success' })
      })
      .catch((error) => {
        console.log(error)
        enqueueSnackbar("The format couldn't be posted!", { variant: 'error' })
      })
  }

  function compareFormats(a: Format, b: Format): number {
    return a.position - b.position || a.id.localeCompare(b.id)
  }

  const sortedFormats = formats.sort(compareFormats)

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={12}>
        <Typography variant="h6">Formats</Typography>
        <Button variant="contained" color="secondary" onClick={() => openCreateModal()}>
          Add New Format
        </Button>
      </Grid>
      <Table size={"small"}>
        <TableHead>
          <TableCell>
            Position
          </TableCell>
          <TableCell>
            Format ID
          </TableCell>
          <TableCell>
            Format Display Name
          </TableCell>
          <TableCell>
            Supported in Deckbuilding
          </TableCell>
          <TableCell>
            Maintainer
          </TableCell>
          <TableCell>
            Description
          </TableCell>
          <TableCell>
            Info Link
          </TableCell>
          <TableCell>
            Number of Legal Packs
          </TableCell>
          <TableCell>
            Actions
          </TableCell>
        </TableHead>
        <TableBody>
          {sortedFormats.map((format) => (
            <TableRow key={format.id}>
              <TableCell>{format.position}</TableCell>
              <TableCell>{format.id}</TableCell>
              <TableCell>{format.name}</TableCell>
              <TableCell>{format.supported ? 'Yes' : 'No'}</TableCell>
              <TableCell>{format.maintainer || 'N/A'}</TableCell>
              <TableCell>{format.description || 'N/A'}</TableCell>
              <TableCell>
                {format.info_link ?
                  <a href={format.info_link}>{format.info_link}</a> :
                  'N/A'
                }
              </TableCell>
              <TableCell>{format.legal_packs?.length || 0}</TableCell>
              <TableCell>
                <IconButton color='secondary' onClick={() => openEditModal(format)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Edit Format</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                value={position}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setPosition(Number.parseInt(e.target.value))}
                label="Position"
                type="number"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={formatId}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setFormatId(e.target.value)}
                label="Format ID"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={formatName}
                variant="outlined"
                fullWidth
                onChange={(e) => setFormatName(e.target.value)}
                label="Format Display Name"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={maintainer}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setMaintainer(e.target.value)}
                label="Maintainer"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={description}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setDescription(e.target.value)}
                label="Description"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={infoLink}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setInfoLink(e.target.value)}
                label="Link for further information"
                style={{ marginTop: 5 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSupported}
                    onChange={(value) => setIsSupported(value.target.checked)}
                  />
                }
                label={'Supported in Deckbuilding'}
                labelPlacement="start"
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => setPackModalOpen(true)}
              >
                Legal Packs
                {legalPacks.length > 0 && ` (Selected: ${legalPacks.length})`}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button variant="contained" color="secondary" onClick={() => saveFormat()}>
            Save Format
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={packModalOpen}
        onClose={() => setPackModalOpen(false)}
      >
        <DialogTitle id="form-dialog-title">Filter Packs</DialogTitle>
        <DialogContent>
          <div style={{ minWidth: '60%' }}>
            <CycleList
              withCheckbox
              rootLabel="All Packs"
              onSelection={(selectedPacks, _) => {
                setLegalPacks(selectedPacks)
              }}
              selectedPacks={legalPacks}
              selectedCycles={[]}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPackModalOpen(false)} variant="contained" fullWidth>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
