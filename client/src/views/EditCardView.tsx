import { useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { useCard } from '../hooks/useCard'
import { CardForm } from './CardForm'

export function EditCardView(): JSX.Element {
  const params = useParams<{ id: string }>()
  const [data] = useCard(params.id)

  if (data.loading) {
    return <Loading />
  }
  if (data.error) {
    return <RequestError requestError={data.error} />
  }
  if (data.data == null) {
    return <EmptyState />
  }

  const card = data.data

  return <CardForm existingCard={card} editMode />
}
