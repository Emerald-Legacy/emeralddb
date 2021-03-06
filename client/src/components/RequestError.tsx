import React from 'react'
import { Container } from '@material-ui/core'

export function RequestError(props: { requestError: string }): JSX.Element {
  return (
    <Container>
      <h5>Error: {props.requestError}</h5>
    </Container>
  )
}
