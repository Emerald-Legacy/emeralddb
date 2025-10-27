import { CardWithVersions, Pack } from '@5rdb/api'
import { DeckStatisticsDisplay } from '../deck/DeckStatisticsDisplay'
import { useUiStore } from '../../providers/UiStoreProvider'

interface DeckStatisticsProps {
  cards: Record<string, number>
  allCards: CardWithVersions[]
  format: string
}

export function DeckStatistics({ cards, allCards, format }: DeckStatisticsProps): JSX.Element {
  const { packs } = useUiStore()
  return <DeckStatisticsDisplay cards={cards} allCards={allCards} allPacks={packs} format={format} />
}



