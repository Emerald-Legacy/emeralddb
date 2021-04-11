import { Button, Typography } from '@material-ui/core'
import { version } from 'prettier'
import React from 'react'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { useCard } from '../hooks/useCard'
import { useAuth0 } from '@auth0/auth0-react'

export function CardDetailView() {
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
    <div>
      <Typography component="h3">
        {card.name} ({card.id})
      </Typography>
      <Typography component="h4">Versions:</Typography>
      {card.versions.map((version) => (
        <img key={card.id + '_' + version.pack_id} src={version.image_url} />
      ))}
    </div>
  )
}
