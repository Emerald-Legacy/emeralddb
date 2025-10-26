import { CardWithVersions } from '@5rdb/api'
import { DeckStatisticsDisplay } from '../deck/DeckStatisticsDisplay'

interface DeckStatisticsProps {
  cards: Record<string, number>
  allCards: CardWithVersions[]
}

export function DeckStatistics({ cards, allCards }: DeckStatisticsProps): JSX.Element {
  return <DeckStatisticsDisplay cards={cards} allCards={allCards} />
}



