import React from 'react'
import { Container, Typography } from '@mui/material'

export function Loading(): JSX.Element {
  return (
    <Container>
      <Typography variant="h5" align="center">
        Loading...
      </Typography>
    </Container>
  )
}
