import { Button, TextField, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { privateApi } from '../api'
import React, { useState } from 'react'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useBetaEnvironment } from '../hooks/useBetaEnvironment'

export function AdminView(): JSX.Element {
  const history = useHistory()
  const [packId, setPackId] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [betaEnvironment] = useBetaEnvironment()

  if (betaEnvironment.loading) {
    return <Typography>Loading ...</Typography>
  }
  const betaUrl: string = betaEnvironment.data?.betaUrl || 'undefined'

  const importPack = () => {
    const enteredPackId = packId
    setPackId('')
    axios
      .get(`${betaUrl}api/packs/export/${enteredPackId}`)
      .then((exported) =>
        privateApi.Pack.import({
          body: {
            ...exported.data,
          },
        })
          .then(() => enqueueSnackbar('Successfully imported pack!', { variant: 'success' }))
          .catch(() => enqueueSnackbar("Couldn't import pack", { variant: 'error' }))
      )
      .catch(() => enqueueSnackbar("Couldn't import pack", { variant: 'error' }))
  }

  return (
    <>
      <Typography variant="h4" align="center">
        Admin View
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => history.push('/card/create/new')}
      >
        Create a new card
      </Button>
      <br />
      <br />
      <Button variant="contained" color="secondary" onClick={() => history.push('/admin/cycles')}>
        Manage Cycles And Packs
      </Button>
      <br />
      <br />
      <Button variant="contained" color="secondary" onClick={() => history.push('/admin/traits')}>
        Manage Traits
      </Button>
      <br />
      <br />
      <TextField
        value={packId}
        onChange={(event) => setPackId(event.target.value)}
        label={'Pack ID'}
        variant={'outlined'}
      />
      <br />
      <br />
      <Button disabled={packId === ''} variant="contained" color="secondary" onClick={importPack}>
        Import A Pack From BETA
      </Button>
      <br />
      <br />
      {/** Enable if you need local data */}
      <Button
        disabled
        variant="contained"
        color="secondary"
        onClick={() => privateApi.Data.import()}
      >
        Import Data
      </Button>
    </>
  )
}
