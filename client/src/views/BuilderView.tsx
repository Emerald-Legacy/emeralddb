import { DeckWithVersions } from '@5rdb/api'
import { Container, Grid, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { publicApi } from '../api'
import { DeckTabs } from '../components/deck/DeckTabs'
import { useCurrentUser } from '../providers/UserProvider'

export function BuilderView(): JSX.Element {
  const { currentUser } = useCurrentUser()
  const [decks, setDecks] = useState<DeckWithVersions[]>([])

  useEffect(() => {
    publicApi.Deck.findForUser({ body: { userId: currentUser?.id } }).then((response) =>
      setDecks(response.data())
    )
  }, [currentUser])

  function updateDecks() {
    publicApi.Deck.findForUser({ body: { userId: currentUser?.id } }).then((response) =>
      setDecks(response.data())
    )
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4">Decks</Typography>
          <br />
        </Grid>
        <Grid item xs={12}>
          <DeckTabs decks={decks} onDeckUpdated={updateDecks} />
        </Grid>
      </Grid>
    </>
  )
}
