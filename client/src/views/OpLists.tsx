import { useUiStore } from '../providers/UiStoreProvider'
import { useState } from 'react'
import { Grid, TextField, Typography } from '@material-ui/core'
import { Loading } from '../components/Loading'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { clans } from '../utils/enums'
import { OrganizedPlayList } from '../components/OrganizedPlayList'
import { CardWithVersions } from '@5rdb/api'
import { useHistory, useParams } from 'react-router-dom'

const formats = [
  {
    id: 'emerald',
    name: 'Emerald Legacy - Emerald Edict',
    link: 'https://emeraldlegacy.org/rules/',
  },
  {
    id: 'standard',
    name: 'Fantasy Flight Games - Imperial Law',
    link: 'https://images-cdn.fantasyflightgames.com/filer_public/61/f1/61f18d82-b566-47a7-bc65-3fe068e3194b/l5c01-online_imperiallaw_final.pdf',
  },
]

function isSplashBanned(card: CardWithVersions, format: string, filterClan: string): boolean {
  if (!card.splash_banned_in?.includes(format)) {
    return false
  }
  return card.faction !== filterClan
}

export function OpLists(): JSX.Element {
  const params = useParams<{ format: string }>()
  const { cards } = useUiStore()
  const [format, setFormat] = useState(params.format || '')
  const [filterClan, setFilterClan] = useState('')
  const history = useHistory()

  if (!cards) {
    return <Loading />
  }
  if (params.format && params.format !== format) {
    setFormat(params.format)
  }
  const formatName = formats.find((f) => f.id === format)?.name || ''
  const formatLink = formats.find((f) => f.id === format)?.link || ''

  const allCards =
    !filterClan || !format
      ? cards
      : cards.filter(
          (c) => c.allowed_clans?.includes(filterClan) && !isSplashBanned(c, format, filterClan)
        )

  const restrictedCards = format ? allCards.filter((c) => c.restricted_in?.includes(format)) : []
  const bannedCards = format ? allCards.filter((c) => c.banned_in?.includes(format)) : []
  const splashBannedCards = format
    ? allCards.filter((c) => c.splash_banned_in?.includes(format))
    : []
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4">Organized Play: Restricted and Banned Lists</Typography>
          <Typography>
            Below you can find the current Restricted and Banned Lists for the Legend of the Five
            Rings LCG.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography style={{ marginBottom: 5 }}>
            Please select the set of rules you are interested in:
          </Typography>
          <Autocomplete
            id="combo-box-format"
            autoHighlight
            options={formats}
            getOptionLabel={(option) => option.name}
            value={formats.find((item) => item.id === format) || null}
            renderInput={(params) => <TextField {...params} label="Format" variant="outlined" />}
            onChange={(e, value) => {
              const newPathParam = value?.id || ''
              setFormat(newPathParam)
              history.push(`/rules/organized-play/${newPathParam}`)
            }}
          />
        </Grid>
        <Grid item xs={6} hidden={!format}>
          <Typography style={{ marginBottom: 5 }}>
            Only show cards playable by this clan:
          </Typography>
          <Autocomplete
            id="combo-box-clan"
            autoHighlight
            options={clans}
            getOptionLabel={(option) => option.name}
            value={clans.find((item) => item.id === filterClan) || null}
            renderInput={(params) => <TextField {...params} label="Clan" variant="outlined" />}
            onChange={(e, value) => setFilterClan(value?.id || '')}
          />
        </Grid>
        <Grid item xs={12} hidden={!format}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant={'h5'}>{formatName}</Typography>
              {formatLink && (
                <Typography component={'a'} href={formatLink} target={'_blank'}>
                  Link to the PDF version
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6} lg={4} hidden={bannedCards.length === 0}>
              <OrganizedPlayList
                cards={bannedCards}
                format={format}
                title="Banned List"
                description="You may not include any banned cards in your deck."
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} hidden={restrictedCards.length === 0}>
              <OrganizedPlayList
                cards={restrictedCards}
                format={format}
                title="Restricted List"
                description="You may only include one restricted card in your deck."
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} hidden={splashBannedCards.length === 0}>
              <OrganizedPlayList
                cards={splashBannedCards}
                format={format}
                title="Splash Banned List"
                description="These cards have their influence removed and can not be splashed."
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
