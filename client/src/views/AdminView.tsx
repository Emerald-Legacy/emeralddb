import { Button, Container, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { privateApi } from '../api'

export function AdminView(): JSX.Element {
  const history = useHistory()
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
