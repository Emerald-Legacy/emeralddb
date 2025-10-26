import { CardWithVersions, Pack } from '@5rdb/api'
import { DeckStatisticsDisplay } from '../deck/DeckStatisticsDisplay'
import { useUiStore } from '../../providers/UiStoreProvider'

interface DeckStatisticsProps {
  cards: Record<string, number>
  allCards: CardWithVersions[]
}

export function DeckStatistics({ cards, allCards }: DeckStatisticsProps): JSX.Element {
  const { packs } = useUiStore()
  return <DeckStatisticsDisplay cards={cards} allCards={allCards} allPacks={packs} />
}



