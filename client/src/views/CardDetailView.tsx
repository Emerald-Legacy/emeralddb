import React from 'react'
import { Box, Card, Grid, Paper, Typography } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { useCard } from '../hooks/useCard'
import { CardText } from '../components/card/CardText'

export function CardDetailView(): JSX.Element {
  const params = useParams<{ id: string }>()
  const [data] = useCard(params.id)

  if (data.loading) {
    return <Loading />
  }
  if (data.error) {
    return <RequestError requestError={data.error} />
  }
  if (data.data == null) {
    return <EmptyState />
  }

  const card = data.data
  const textLines = card.text?.split('\n') || []

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={7}>
        <Box border="solid 1px" padding="3px">
          <Typography variant='h5'>
            {card.name}
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              {textLines.map(line => <p><CardText text={line}/></p>)}
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        {card.versions.map((version) => (
          <img key={card.id + '_' + version.pack_id} src={version.image_url} />
        ))}
      </Grid>
    </Grid>
  )
}
