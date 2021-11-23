import React from 'react'
import { Container, Typography } from '@material-ui/core'

export function Loading(): JSX.Element {
  return (
    <Container>
      <Typography variant="h5" align="center">
        Loading...
      </Typography>
    </Container>
  )
}
