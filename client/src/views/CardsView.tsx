import { Link } from 'react-router-dom'
import React from 'react'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { useCards } from '../hooks/useCards'
import { Button } from '@material-ui/core'
import { api } from '../api'

export function CardsView() {
  const [data] = useCards()

  if (data.loading) {
    return <Loading />
  }
  if (data.error) {
    return <RequestError requestError={data.error} />
  }
  if (data.data == null) {
    return <EmptyState />
  }

  const cards = data.data
  console.log(cards)
  return (
    <ul>
      <Button onClick={() => api.Data.import()}>Import Data</Button>
      {cards.map((card) => (
        <li key={card.id}>
          <Link to={`/card/${card.id}`}>
            {card.name} ({card.id})
          </Link>
        </li>
      ))}
    </ul>
  )
}
