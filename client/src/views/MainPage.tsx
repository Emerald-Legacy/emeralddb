import { Button, Container } from "@material-ui/core";
import { api } from '../api'

export function MainPage() {
  return <Container>
    <Button onClick={() => api.Data.import()}>Import Data</Button>
  </Container>
}