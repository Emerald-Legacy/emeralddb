import React from 'react'
import { EmptyState } from "../components/EmptyState";
import { Loading } from "../components/Loading";
import { RequestError } from "../components/RequestError";
import { useCards } from "../hooks/useCards";

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
            {cards.map(card => (
                <li key={card.id}>{card.name} ({card.id})</li>
            ))}
        </ul>
    )
}