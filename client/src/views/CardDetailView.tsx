import React, { useState } from 'react'
import { Button, Grid } from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { useCard } from '../hooks/useCard'
import { CardInformation } from '../components/card/CardInformation'
import { CardInPack } from '@5rdb/api'
import { useCurrentUser } from '../providers/UserProvider'
import { RulingList } from '../components/RulingList'

export function CardDetailView(): JSX.Element {
  const params = useParams<{ id: string }>()
  const [data] = useCard(params.id)
  const [chosenVersion, setChosenVersion] = useState<Omit<CardInPack, 'card_id'>>()
  const { isDataAdmin } = useCurrentUser()
  const history = useHistory()

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

  if (!chosenVersion && card.versions.length > 0) {
    setChosenVersion(card.versions[0])
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={7}>
        {isDataAdmin() && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.push(`/card/${card.id}/edit`)}
          >
            Edit this Card
          </Button>
        )}
        <CardInformation cardWithVersions={card} currentVersionPackId={chosenVersion?.pack_id} />
        <RulingList rulings={card.rulings} />
      </Grid>
      <Grid item xs={12} md={5}>
        {chosenVersion && (
          <img src={chosenVersion.image_url} width={card.type === 'treaty' ? '450px' : '300px'} />
        )}
      </Grid>
    </Grid>
  )
}
