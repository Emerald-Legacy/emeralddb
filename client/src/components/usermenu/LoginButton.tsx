import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@material-ui/core'

export function LoginButton(props: {
  onLogin: () => void
  audience: string
  scope: string
}): JSX.Element {
  const { loginWithPopup } = useAuth0()

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() =>
        loginWithPopup({
          authorizationParams: {
            audience: props.audience,
            scope: props.scope,
          },
        }).then(props.onLogin)
      }
    >
      Log In
    </Button>
  )
}
