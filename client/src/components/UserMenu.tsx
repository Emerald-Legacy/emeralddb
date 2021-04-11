import { useAuth0 } from '@auth0/auth0-react'
import { Avatar, Button, IconButton, Menu, MenuItem, Typography } from '@material-ui/core'
import { useState } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function UserMenu(): JSX.Element {
  const { user, isAuthenticated, isLoading} = useAuth0()
  const { loginWithPopup } = useAuth0();
  const { logout } = useAuth0();
  const [open, setOpen] = useState(false)
  const [currentUser] = useCurrentUser()

  const handleMenu = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (isLoading || currentUser.loading) {
    return <Typography>Loading ...</Typography>
  }

  if (!isAuthenticated) {
    return (
      <div>
        <Button color="secondary" variant="contained" onClick={() => loginWithPopup()}>
          Log In
        </Button>

      </div>
    )
  }
  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {currentUser.data && <Typography>{currentUser.data?.name}</Typography>}
        {user && <Avatar src={user.picture} alt={currentUser.data?.name} />}
      </IconButton>
      
      <Menu
        id="menu-appbar"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <Typography
            onClick={() => logout({ returnTo: window.location.origin + '/cards' })}
          >
            Log Out
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}
