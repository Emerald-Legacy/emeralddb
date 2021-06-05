import { User } from '@5rdb/api'
import { useAuth0 } from '@auth0/auth0-react'
import {
  Button,
  IconButton,
  makeStyles,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { privateApi } from '../../api'
import { setToken } from '../../utils/auth'
import { Queries } from '../HeaderBar'
import { LoginButton } from './LoginButton'
import { LogoutButton } from './LogoutButton'
import EditIcon from '@material-ui/icons/Edit'
import { useCurrentUser } from '../../providers/UserProvider'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}))

export function UserMenu(props: { audience: string; scope: string }): JSX.Element {
  const classes = useStyles()

  const [modalStyle] = useState(getModalStyle)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalUsername, setModalUsername] = useState<string>()

  const { getAccessTokenSilently } = useAuth0()
  const { currentUser, setCurrentUser } = useCurrentUser()

  const queryClient = useQueryClient()
  const fetchToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: props.audience,
        scope: props.scope,
      })
      setToken(accessToken)
      queryClient.invalidateQueries(Queries.USER)
    } catch (e) {
      console.log(e)
    }
  }

  if (currentUser !== undefined) {
    const updateUser = () => {
      privateApi.User.update({ body: { id: currentUser.id, name: modalUsername } }).then(
        (response) => {
          setCurrentUser((response.data as unknown) as User)
          setModalOpen(false)
        }
      )
    }
    return (
      <div>
        <Typography>
          {currentUser.name}
          <IconButton color="inherit" onClick={() => setModalOpen(true)}>
            <EditIcon />
          </IconButton>{' '}
          <LogoutButton onLogout={() => setCurrentUser(undefined)} />
        </Typography>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Paper style={modalStyle} className={classes.paper}>
            <form onSubmit={updateUser}>
              <TextField
                defaultValue={currentUser.name}
                value={modalUsername}
                onChange={(e) => setModalUsername(e.target.value)}
                label="New Username"
                required
              />
              <Button type="submit" variant="contained" color="primary" className={classes.button}>
                Change Username
              </Button>
            </form>
          </Paper>
        </Modal>
      </div>
    )
  }

  return (
    <div>
      <LoginButton onLogin={fetchToken} />
    </div>
  )
}
