import { Box, Grid, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { useDecklist } from '../hooks/useDecklist'
import { Decklist } from '../components/deck/Decklist'
import { getColorForFactionId } from '../utils/factionUtils'
import { DecklistComments } from '../components/deck/DecklistComments'
import { DeckStatisticsDisplay } from '../components/deck/DeckStatisticsDisplay'
import { useUiStore } from '../providers/UiStoreProvider'
import { Pack } from '@5rdb/api'

export function DeckDetailView(): JSX.Element {
  const params = useParams<{ id: string }>()
  const [data] = useDecklist(params.id!)
  const { cards, packs } = useUiStore()

  if (data.loading) {
    return <Loading />
  }
  if (data.error) {
    return <RequestError requestError={data.error} />
  }
  if (data.data == null) {
    return <EmptyState />
  }

  const decklist = data.data
  document.title = `${decklist.name} (v${decklist.version_number})`
  return (
    <Grid container spacing={5} justifyContent="center">
      <Grid size={{ xs: 12, md: 7 }}>
        <Decklist decklist={decklist} />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography component="h6" align="right">
              Created by: <b>{decklist.username}</b>
            </Typography>
            <Typography>
              <b>Description:</b>
            </Typography>
            <Box
              border="1px solid"
              borderRadius="4px"
              p={2}
              borderColor={getColorForFactionId(decklist.primary_clan || '')}
            >
              {decklist.description ? (
                <Typography>
                  {decklist.description.split('\n').map((line, key) => (
                    <span key={key}>{line}<br /></span>
                  ))}
                </Typography>
              ) : (
                <Typography>No description provided</Typography>
              )}
            </Box>
          </Grid>
          <Grid hidden={!decklist.published_date} size={12}>
            <DecklistComments decklistId={decklist.id} />
          </Grid>
          <Grid size={12}>
            <DeckStatisticsDisplay cards={decklist.cards} allCards={cards} allPacks={packs} format={decklist.format} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
