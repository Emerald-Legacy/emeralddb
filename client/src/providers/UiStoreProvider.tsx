import { Card, Pack, Cycle, Trait } from '@5rdb/api'
import { createContext, ReactNode, useState } from 'react'

export interface UiStore {
  cards: Card[]
  packs: Pack[]
  cycles: Cycle[]
  traits: Trait[]
  setCards: (cards: Card[]) => void
  setPacks: (packs: Pack[]) => void
  setCycles: (cycles: Cycle[]) => void
  setTraits: (traits: Trait[]) => void
}

export const UiStoreContext = createContext<UiStore>({
  cards: [],
  packs: [],
  cycles: [],
  traits: [],
  setCards: () => {
    console.log('Not initiated yet.')
  },
  setPacks: () => {
    console.log('Not initiated yet.')
  },
  setCycles: () => {
    console.log('Not initiated yet.')
  },
  setTraits: () => {
    console.log('Not initiated yet.')
  },
})

export function UiStoreProvider(props: { children: ReactNode }): JSX.Element {
  const [cards, setCards] = useState<Card[]>([])
  const [packs, setPacks] = useState<Pack[]>([])
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [traits, setTraits] = useState<Trait[]>([])

  return (
    <UiStoreContext.Provider
      value={{
        cards: cards,
        packs: packs,
        cycles: cycles,
        traits: traits,
        setCards: setCards,
        setPacks: setPacks,
        setCycles: setCycles,
        setTraits: setTraits,
      }}
    >
      {props.children}
    </UiStoreContext.Provider>
  )
}
