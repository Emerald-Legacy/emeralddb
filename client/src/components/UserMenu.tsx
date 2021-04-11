import { useAuth0 } from '@auth0/auth0-react'
import { Button, IconButton, Menu, MenuItem, Typography } from '@material-ui/core'
import { useState } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function UserMenu(): JSX.Element {
  const { isAuthenticated, isLoading} = useAuth0()
  const { loginWithPopup } = useAuth0();
  const { logout } = useAuth0();
  const [open, setOpen] = useState(false)
  const [user] = useCurrentUser()

  const handleMenu = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (isLoading || user.loading) {
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
      <Typography onClick={handleMenu}>{user.data?.name}</Typography>
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
