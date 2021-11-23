import { factions } from '../../utils/enums'

export function CardFactionIcon(props: { faction?: string }): JSX.Element {
  if (!factions.some((faction) => faction.id === props.faction)) {
    return <span />
  }
  return <span className={`icon icon-clan-${props.faction}`} />
}
