import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { privateApi } from '../api'
import { UiStoreContext } from '../providers/UiStoreProvider'

export function CardsView() {
  const {cards} = useContext(UiStoreContext)
  return (
    <ul>
      <Button onClick={() => privateApi.Data.import()}>Import Data</Button>
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
