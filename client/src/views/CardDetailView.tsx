import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { useCard } from '../hooks/useCard'

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
  console.log(card)
  return (
    <Grid container>
      <Grid item xs={12} sm={7}>
        <Typography variant='h5'>
          {card.name}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={5}>
        {card.versions.map((version) => (
          <img key={card.id + '_' + version.pack_id} src={version.image_url} />
        ))}
      </Grid>
    </Grid>
  )
}
