import { Button, Container } from "@material-ui/core";
import { privateApi, publicApi } from '../api'

export function MainPage() {
  return <Container>
    <Button onClick={() => privateApi.Data.import()}>Import Data</Button>
  </Container>
}