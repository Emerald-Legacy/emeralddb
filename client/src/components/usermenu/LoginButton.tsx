import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@material-ui/core'

export function LoginButton(props: { onLogin: () => void }): JSX.Element {
  const { loginWithPopup } = useAuth0()

  return (
    <Button variant="contained" onClick={() => loginWithPopup().then(props.onLogin)}>
      Log In
    </Button>
  )
}
