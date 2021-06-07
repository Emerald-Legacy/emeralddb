import { Container, Typography } from '@material-ui/core'

export function NotPermitted(): JSX.Element {
  return (
    <Container>
      <Typography variant="h4" align="center">
        You are not permitted to see this section.
      </Typography>
    </Container>
  )
}
