import { capitalize } from '../../utils/stringUtils'

export function ElementSymbol(props: { element: string; withoutName?: boolean }): JSX.Element {
  return (
    <span>
      <span className={`icon icon-element-${props.element}`} />
      {!props.withoutName && <span> {capitalize(props.element)}</span>}{' '}
    </span>
  )
}
