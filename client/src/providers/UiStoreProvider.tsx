import { Pack, Cycle, Trait, CardWithVersions, Format, CardInPack } from "@5rdb/api";
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { publicApi } from '../api'

export interface UiStore {
  cards: CardWithVersions[]
  packs: Pack[]
  cycles: Cycle[]
  traits: Trait[]
  formats: Format[]
  relevantFormats: Format[]
  validCardVersionForFormat: (cardId: string, formatId: string) => Omit<CardInPack, 'card_id'> | undefined
  invalidateData: () => void
  isLoading: boolean
}

export const UiStoreContext = createContext<UiStore>({
  cards: [],
  packs: [],
  cycles: [],
  traits: [],
  formats: [],
  relevantFormats: [],
  validCardVersionForFormat: () => undefined,
  invalidateData: () => {},
  isLoading: false,
})

// Query keys for TanStack Query
export const UiStoreQueries = {
  CARDS: ['cards'] as const,
  PACKS: ['packs'] as const,
  CYCLES: ['cycles'] as const,
  TRAITS: ['traits'] as const,
  FORMATS: ['formats'] as const,
}

export function UiStoreProvider(props: { children: ReactNode }): JSX.Element {
  const queryClient = useQueryClient()

  // Use TanStack Query for all data fetching with automatic caching
  const { data: cards = [] } = useQuery<CardWithVersions[]>({
    queryKey: UiStoreQueries.CARDS,
    queryFn: async () => {
      const response = await publicApi.Card.findAll()
      return response.data() as CardWithVersions[]
    },
  })

  const { data: packs = [] } = useQuery<Pack[]>({
    queryKey: UiStoreQueries.PACKS,
    queryFn: async () => {
      const response = await publicApi.Pack.findAll()
      return response.data() as Pack[]
    },
  })

  const { data: cycles = [] } = useQuery<Cycle[]>({
    queryKey: UiStoreQueries.CYCLES,
    queryFn: async () => {
      const response = await publicApi.Cycle.findAll()
      return response.data() as Cycle[]
    },
  })

  const { data: traits = [] } = useQuery<Trait[]>({
    queryKey: UiStoreQueries.TRAITS,
    queryFn: async () => {
      const response = await publicApi.Trait.findAll()
      return response.data() as Trait[]
    },
  })

  const { data: formats = [], isLoading: formatsLoading } = useQuery<Format[]>({
    queryKey: UiStoreQueries.FORMATS,
    queryFn: async () => {
      const response = await publicApi.Format.findAll()
      return response.data() as Format[]
    },
  })

  // Compute relevant formats
  const relevantFormats = useMemo(
    () => formats.filter(format => format.supported),
    [formats]
  )

  // Check if any query is loading
  const isLoading = formatsLoading

  // Replace toggleReload with query invalidation
  const invalidateData = () => {
    queryClient.invalidateQueries({ queryKey: UiStoreQueries.CARDS })
    queryClient.invalidateQueries({ queryKey: UiStoreQueries.PACKS })
    queryClient.invalidateQueries({ queryKey: UiStoreQueries.CYCLES })
    queryClient.invalidateQueries({ queryKey: UiStoreQueries.TRAITS })
    queryClient.invalidateQueries({ queryKey: UiStoreQueries.FORMATS })
  }

  const validCardVersionForFormat = (cardId: string, formatId: string) => {
    const format = formats.find(f => f.id === formatId)
    const card = cards.find(c => c.id === cardId)
    if (!format || !card) {
      return undefined
    }
    return card.versions.find(v => (format.legal_packs || []).includes(v.pack_id)) || undefined
  }

  return (
    <UiStoreContext.Provider
      value={{
        cards,
        packs,
        cycles,
        traits,
        formats,
        relevantFormats,
        validCardVersionForFormat,
        invalidateData,
        isLoading,
      }}
    >
      {props.children}
    </UiStoreContext.Provider>
  )
}

export function useUiStore(): UiStore {
  const uiStore = useContext(UiStoreContext)
  if (uiStore === undefined) {
    throw new Error('Context must be used within a Provider')
  }
  return uiStore
}
