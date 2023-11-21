import { Pack, Cycle, Trait, CardWithVersions, Format, CardInPack } from "@5rdb/api";
import { createContext, ReactNode, useEffect, useState, useContext } from 'react'
import { publicApi } from '../api'

export interface UiStore {
  cards: CardWithVersions[]
  packs: Pack[]
  cycles: Cycle[]
  traits: Trait[]
  formats: Format[]
  relevantFormats: Format[]
  validCardVersionForFormat: (cardId: string, formatId: string) => Omit<CardInPack, 'card_id'> | undefined
  toggleReload: () => void
}

export const UiStoreContext = createContext<UiStore>({
  cards: [],
  packs: [],
  cycles: [],
  traits: [],
  formats: [],
  relevantFormats: [],
  validCardVersionForFormat: () => undefined,
  toggleReload: () => {},
})

export function UiStoreProvider(props: { children: ReactNode }): JSX.Element {
  const [cards, setCards] = useState<CardWithVersions[]>([])
  const [packs, setPacks] = useState<Pack[]>([])
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [traits, setTraits] = useState<Trait[]>([])
  const [formats, setFormats] = useState<Format[]>([])
  const [relevantFormats, setRelevantFormats] = useState<Format[]>([])
  const [reload, setReload] = useState(false)

  const toggleReload = () => setReload(!reload)

  useEffect(() => {
    publicApi.Pack.findAll().then((packs) => setPacks(packs.data()))
    publicApi.Card.findAll().then((cards) => setCards(cards.data()))
    publicApi.Cycle.findAll().then((cycles) => setCycles(cycles.data()))
    publicApi.Trait.findAll().then((traits) => setTraits(traits.data()))
    publicApi.Format.findAll().then((response) => {
      const formats = response.data() as Format[];
      setFormats(formats)
      setRelevantFormats(formats.filter(format => format.supported))
    })
  }, [reload])

  const validVersionForFormat = (cardId: string, formatId: string) => {
    console.log(cardId, formatId)
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
        cards: cards,
        packs: packs,
        cycles: cycles,
        traits: traits,
        formats: formats,
        relevantFormats: relevantFormats,
        validCardVersionForFormat: validVersionForFormat,
        toggleReload: toggleReload,
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
