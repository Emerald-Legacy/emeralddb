import { Container, Typography } from '@material-ui/core'

export function NotLoggedIn(): JSX.Element {
  return (
    <Container>
      <Typography variant="h4" align="center">
        You need to be logged in to see this section.
      </Typography>
    </Container>
  )
}
