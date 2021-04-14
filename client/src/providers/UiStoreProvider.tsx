import { Card, Pack, Cycle } from "@5rdb/api";
import { createContext, useState } from "react";

export interface UiStore {
  cards: Card[]
  packs: Pack[]
  cycles: Cycle[]
  setCards: (cards: Card[]) => void
  setPacks: (packs: Pack[]) => void
  setCycles: (cycles: Cycle[]) => void
}

export const UiStoreContext = createContext<UiStore>({cards: [], packs: [], cycles: [], setCards: () => {}, setPacks: () => {}, setCycles: () => {}})

export const UiStoreProvider = (props: {children: any}) => {
  const [cards, setCards] = useState<Card[]>([])
  const [packs, setPacks] = useState<Pack[]>([])
  const [cycles, setCycles] = useState<Cycle[]>([])

  return <UiStoreContext.Provider value={{cards: cards, packs: packs, cycles: cycles, setCards: setCards, setPacks: setPacks, setCycles: setCycles}}>
    {props.children}
  </UiStoreContext.Provider>
}