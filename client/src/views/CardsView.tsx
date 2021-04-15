import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UiStoreContext } from '../providers/UiStoreProvider'

export function CardsView(): JSX.Element {
  const { cards } = useContext(UiStoreContext)
  return (
    <ul>
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
