import { Pack } from '@5rdb/api'
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
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { privateApi } from '../api'
import { Loading } from '../components/Loading'
import { useUiStore } from '../providers/UiStoreProvider'
import { toSlugId } from '../utils/slugIdUtils'
import CachedIcon from '@mui/icons-material/Cached'

const useStyles = makeStyles((theme) => ({
  editButton: {
    backgroundColor: theme.palette.warning.light,
    marginRight: theme.spacing(1),
    marginLeft: 'auto',
  },
  createButton: {
    marginRight: theme.spacing(1),
    marginLeft: 'auto',
    marginTop: theme.spacing(2),
  },
  deleteButton: {
    backgroundColor: theme.palette.error.light,
  },
  input: {
    marginBottom: theme.spacing(1),
  },
}))

export function ManageCyclesView(): JSX.Element {
  const classes = useStyles()
  const navigate = useNavigate()
  const { packs, cycles } = useUiStore()
  const [packModalOpen, setPackModalOpen] = useState(false)
  const [cycleModalOpen, setCycleModalOpen] = useState(false)

  const [packId, setPackId] = useState('')
  const [packName, setPackName] = useState('')
  const [packSize, setPackSize] = useState(0)
  const [packPosition, setPackPosition] = useState(0)
  const [editedCycleId, setEditedCycleId] = useState('')

  const [newCycleId, setNewCycleId] = useState('')
  const [cycleName, setCycleName] = useState('')
  const [cycleSize, setCycleSize] = useState(0)
  const [cyclePosition, setCyclePosition] = useState(0)

  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  if (!packs || !cycles) {
    return <Loading />
  }

  const setPackIdAndName = (name: string) => {
    setPackId(toSlugId(name))
    setPackName(name)
  }

  const setCycleIdAndName = (name: string) => {
    setNewCycleId(toSlugId(name))
    setCycleName(name)
  }

  function packsForCycle(cycleId: string): Pack[] {
    return packs.filter((p) => p.cycle_id === cycleId)
  }

  function openPackModal(cycleId: string) {
    setPackId('')
    setPackName('')
    setPackSize(0)
    setPackPosition(0)
    setEditedCycleId(cycleId)
    setPackModalOpen(true)
  }

  function openCycleModal() {
    setNewCycleId('')
    setCycleName('')
    setCycleSize(0)
    setCyclePosition(0)
    setCycleModalOpen(true)
  }

  function createPack() {
    confirm({ description: 'Do you really want to create this pack?' })
      .then(() => {
        privateApi.Pack.create({
          body: {
            cycle_id: editedCycleId,
            name: packName,
            id: packId,
            size: packSize,
            position: packPosition,
          },
        })
          .then(() => {
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The pack couldn't be created!", { variant: 'error' })
          })
      })
      .catch(() => {
        // Cancel confirmation dialog => do nothing
      })
  }

  function createCycle() {
    confirm({ description: 'Do you really want to create this cycle?' })
      .then(() => {
        privateApi.Cycle.create({
          body: {
            id: newCycleId,
            name: cycleName,
            size: cycleSize,
            position: cyclePosition,
            publisher: 'emerald-legacy'
          },
        })
          .then(() => {
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The cycle couldn't be created!", { variant: 'error' })
          })
      })
      .catch(() => {
        // Cancel confirmation dialog => do nothing
      })
  }

  function rotateCycle(cycleId: string) {
    confirm({ description: 'Do you really want to rotate out this cycle?' })
      .then(() => {
        privateApi.Cycle.rotate({
          cycleId,
        })
          .then(() => {
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The cycle couldn't be rotated!", { variant: 'error' })
          })
      })
      .catch(() => {
        // Cancel confirmation dialog => do nothing
      })
  }
  function rotatePack(packId: string) {
    confirm({ description: 'Do you really want to rotate out this pack?' })
      .then(() => {
        privateApi.Pack.rotate({
          packId,
        })
          .then(() => {
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The pack couldn't be rotated!", { variant: 'error' })
          })
      })
      .catch(() => {
        // Cancel confirmation dialog => do nothing
      })
  }

  return (
    <>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12}>
          <Typography variant="h6">Cycles</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" fullWidth onClick={() => openCycleModal()}>
            Add Cycle
          </Button>
        </Grid>
        {cycles.map((cycle) => (
          <Grid item xs={12}>
            <Typography>
              {cycle.rotated && <CachedIcon style={{ color: 'red', fontSize: 16 }} />}
              {cycle.name}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => rotateCycle(cycle.id)}>
              Rotate Cycle
            </Button>
            {packsForCycle(cycle.id).map((pack) => (
              <Grid container spacing={1}>
                <Grid item xs={1} />
                <Grid item xs={5}>
                  <Typography>
                    {pack.rotated && <CachedIcon style={{ color: 'red', fontSize: 16 }} />}{' '}
                    {pack.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/admin/pack/${pack.id}`)}
                  >
                    Edit Pack Cards
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => rotatePack(pack.id)}>
                    Rotate Pack
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Grid container>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openPackModal(cycle.id)}
                >
                  Add Pack
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Dialog open={packModalOpen} onClose={() => setPackModalOpen(false)}>
        <DialogTitle>Create New Pack</DialogTitle>
        <DialogContent>
          <TextField
            value={packName}
            variant="outlined"
            fullWidth
            onChange={(e) => setPackIdAndName(e.target.value)}
            label="Pack Name"
            className={classes.input}
          />
          <Box padding={2} border="1px solid lightgray" className={classes.input}>
            <Typography>ID: {packId}</Typography>
          </Box>
          <TextField
            value={packSize}
            multiline
            variant="outlined"
            fullWidth
            onChange={(e) => setPackSize(Number.parseInt(e.target.value) || 0)}
            type="number"
            label="Pack Size"
            className={classes.input}
          />
          <TextField
            value={packPosition}
            multiline
            variant="outlined"
            fullWidth
            onChange={(e) => setPackPosition(Number.parseInt(e.target.value) || 0)}
            type="number"
            label="Pack Position"
            className={classes.input}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPackModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button variant="contained" color="secondary" onClick={() => createPack()}>
            Create Pack
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={cycleModalOpen} onClose={() => setCycleModalOpen(false)}>
        <DialogTitle>Create New Cycle</DialogTitle>
        <DialogContent>
          <TextField
            value={cycleName}
            variant="outlined"
            fullWidth
            onChange={(e) => setCycleIdAndName(e.target.value)}
            label="Cycle Name"
            className={classes.input}
          />
          <Box padding={2} border="1px solid lightgray" className={classes.input}>
            <Typography>ID: {newCycleId}</Typography>
          </Box>
          <TextField
            value={cycleSize}
            multiline
            variant="outlined"
            fullWidth
            onChange={(e) => setCycleSize(Number.parseInt(e.target.value) || 0)}
            type="number"
            label="Cycle Size"
            className={classes.input}
          />
          <TextField
            value={cyclePosition}
            multiline
            variant="outlined"
            fullWidth
            onChange={(e) => setCyclePosition(Number.parseInt(e.target.value) || 0)}
            type="number"
            label="Cycle Position"
            className={classes.input}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCycleModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button variant="contained" color="secondary" onClick={() => createCycle()}>
            Create Cycle
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
