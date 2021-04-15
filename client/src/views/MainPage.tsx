import { Button, Container } from '@material-ui/core'
import { privateApi } from '../api'

export function MainPage(): JSX.Element {
  return (
    <Container>
      <Button onClick={() => privateApi.Data.import()}>Import Data</Button>
    </Container>
  )
}
