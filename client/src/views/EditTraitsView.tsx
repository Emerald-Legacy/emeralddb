import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate} from 'react-router-dom'
import { Loading } from '../components/Loading'
import { useUiStore } from '../providers/UiStoreProvider'
import React, { useState } from 'react'
import { Trait } from "@5rdb/api";
import { privateApi } from '../api'
import { useSnackbar } from 'notistack'
import { useConfirm } from "material-ui-confirm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function EditTraitsView(): JSX.Element {
  const { traits, invalidateData } = useUiStore()
  const navigate = useNavigate()
  const [editIndex, setEditIndex] = useState(-1)
  const [traitId, setTraitId] = useState('')
  const [traitName, setTraitName] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const confirm = useConfirm()
  const { enqueueSnackbar } = useSnackbar()

  if (!traits) {
    return <Loading />
  }

  function openEditModal(trait: Trait, index: number) {
    setEditIndex(index)
    setTraitId(trait.id)
    setTraitName(trait.name)
    setModalOpen(true)
  }

  function openCreateModal() {
    setEditIndex(-1)
    setTraitId('')
    setTraitName('')
    setModalOpen(true)
  }

  function saveTrait() {
    privateApi.Trait.update({
      body: {
        trait: { id: traitId, name: traitName },
      },
    })
      .then(() => {
        invalidateData()
        setModalOpen(false)
        enqueueSnackbar('Successfully posted trait!', { variant: 'success' })
      })
      .catch((error) => {
        console.log(error)
        enqueueSnackbar("The trait couldn't be posted!", { variant: 'error' })
      })
  }

  function deleteTrait(trait: Trait) {
    confirm({ description: 'Do you really want to delete this trait?' })
      .then(() => {
        privateApi.Trait.delete({
          body: {
            trait: trait,
          },
        })
          .then(() => {
            invalidateData()
            enqueueSnackbar('Successfully deleted trait!', { variant: 'success' })
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The trait couldn't be deleted!", { variant: 'error' })
          })
      })
  }

  const sortedTraits = traits.sort((a, b) => a.id.localeCompare(b.id))

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid size={12}>
        <Typography variant="h6">Traits</Typography>
        <Button variant="contained" color="secondary" onClick={() => openCreateModal()}>
          Add New Trait
        </Button>
      </Grid>
      <Table size={"small"}>
        <TableHead>
          <TableCell>
            Trait ID
          </TableCell>
          <TableCell>
            Trait Display Name
          </TableCell>
          <TableCell>
            Actions
          </TableCell>
        </TableHead>
        <TableBody>
          {sortedTraits.map((trait, index) => (
            <TableRow key={trait.id}>
              <TableCell>{trait.id}</TableCell>
              <TableCell>{trait.name}</TableCell>
              <TableCell>
                <IconButton
                  color='secondary'
                  onClick={() => openEditModal(trait, index)}
                  size="large">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteTrait(trait)} size="large">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Edit Trait</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid size={12}>
              <TextField
                value={traitId}
                multiline
                variant="outlined"
                fullWidth
                onChange={(e) => setTraitId(e.target.value)}
                label="Trait ID"
                style={{ marginTop: 5 }}
              />
              <TextField
                value={traitName}
                variant="outlined"
                fullWidth
                onChange={(e) => setTraitName(e.target.value)}
                label="Trait Display Name"
                style={{ marginTop: 5 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button variant="contained" color="secondary" onClick={() => saveTrait()}>
            Save Trait
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
