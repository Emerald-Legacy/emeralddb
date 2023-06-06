import { DecklistViewModel } from '@5rdb/api'
import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core'
import { useState } from 'react'
import { useUiStore } from '../../providers/UiStoreProvider'
import { clans, relevantFormats } from '../../utils/enums'
import { CardLink } from '../card/CardLink'
import { BushiBuilderImportButton } from './BushiBuilderImportButton'
import { EmeraldDBImportButton } from './EmeraldDBImportButton'
import { CardFactionIcon } from '../card/CardFactionIcon'

export function DeckBuilderWizard(props: {
  onComplete: (
    format: string,
    primaryClan: string,
    strongholdAndRole: Record<string, number>
  ) => void
  onImport: (decklist: DecklistViewModel) => void
}): JSX.Element {
  const { cards } = useUiStore()

  const [step, setStep] = useState(-1)
  const [format, setFormat] = useState('')
  const [primaryClan, setPrimaryClan] = useState('')
  const [stronghold, setStronghold] = useState('')
  const [role, setRole] = useState('')

  const strongholds = cards.filter((c) => c.faction === primaryClan && c.type === 'stronghold')
  const roles = cards.filter((c) => c.type === 'role' && !c.text?.includes('Draft format only.'))

  const host = window.location.host
  const isProduction = !host.includes('localhost') && !host.includes('beta-')

  const formats = relevantFormats

  const isButtonDisabled = () => {
    if (
      (step === 0 && format === '') ||
      (step === 1 && primaryClan === '') ||
      (step === 2 && stronghold === '') ||
      (step === 3 && role === '')
    ) {
      return true
    }
    return false
  }
  const lastStep = format !== 'skirmish' ? 3 : 1

  const completeWizard = () => {
    const strongholdAndRole: Record<string, number> = {}
    if (stronghold !== '') {
      strongholdAndRole[stronghold] = 1
    }
    if (role !== '') {
      strongholdAndRole[role] = 1
    }
    props.onComplete(format, primaryClan, strongholdAndRole)
  }

  return (
    <Grid container spacing={2} justify="center" alignItems="center" direction="column">
      <Grid item xs={12} md={4} hidden={step > -1}>
        <Typography variant="h4" align="center">
          Create New Deck
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="secondary" onClick={() => setStep(0)}>
              Start From Scratch
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center"> --- OR --- </Typography>
          </Grid>
          {!isProduction && (
            <Grid item xs={12}>
              <EmeraldDBImportButton
                onImport={(decklist: DecklistViewModel) => props.onImport(decklist)}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <BushiBuilderImportButton
              onImport={(decklist: DecklistViewModel) => props.onImport(decklist)}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} hidden={step < 0}>
        <Typography variant="h4" align="center">
          Create New Deck
        </Typography>
        {step === 0 && (
          <div>
            <Typography variant="h6" align="center">
              Choose Format
            </Typography>
            <RadioGroup
              value={format}
              onChange={(e) => setFormat((e.target as HTMLInputElement).value)}
            >
              {formats.map((format) => (
                <FormControlLabel
                  style={{ margin: '0 0 0 -11' }}
                  key={format.id}
                  value={format.id}
                  control={<Radio />}
                  label={format.name}
                  onClick={() => setFormat(format.id)}
                />
              ))}
            </RadioGroup>
          </div>
        )}
        {step === 1 && (
          <div>
            <Typography variant="h6" align="center">
              Choose Clan
            </Typography>
            <RadioGroup
              value={primaryClan}
              onChange={(e) => setPrimaryClan((e.target as HTMLInputElement).value)}
            >
              {clans.map((clan) => (
                <FormControlLabel
                  style={{ margin: '0 0 0 -11' }}
                  key={clan.id}
                  value={clan.id}
                  control={<Radio />}
                  label={
                    <span style={{ fontSize: 18 }}>
                      <CardFactionIcon faction={clan.id} colored /> {clan.name}
                    </span>
                  }
                  onClick={() => setPrimaryClan(clan.id)}
                />
              ))}
            </RadioGroup>
          </div>
        )}
        {step === 2 && (
          <div>
            <Typography variant="h6" align="center">
              Choose Stronghold
            </Typography>
            <RadioGroup
              value={stronghold}
              onChange={(e) => setStronghold((e.target as HTMLInputElement).value)}
            >
              {strongholds.map((thisStronghold) => (
                <FormControlLabel
                  style={{ margin: '0 0 0 -11' }}
                  key={thisStronghold.id}
                  value={thisStronghold.id}
                  control={<Radio />}
                  label={
                    <CardLink cardId={thisStronghold.id} format={format} notClickable sameTab />
                  }
                  onClick={() => setStronghold(thisStronghold.id)}
                />
              ))}
            </RadioGroup>
          </div>
        )}
        {step === 3 && (
          <div>
            <Typography variant="h6" align="center">
              Choose Role
            </Typography>
            <Grid container spacing={2} style={{ minWidth: 520 }}>
              <Grid item xs={12} sm={6}>
                <RadioGroup
                  value={role}
                  onChange={(e) => setRole((e.target as HTMLInputElement).value)}
                >
                  {roles.slice(0, 10).map((thisRole) => (
                    <FormControlLabel
                      style={{ margin: '0 0 0 -11' }}
                      key={thisRole.id}
                      value={thisRole.id}
                      control={<Radio />}
                      label={<CardLink cardId={thisRole.id} format={format} notClickable sameTab />}
                      onClick={() => setRole(thisRole.id)}
                    />
                  ))}
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <RadioGroup
                  value={role}
                  onChange={(e) => setRole((e.target as HTMLInputElement).value)}
                >
                  {roles.slice(10).map((thisRole) => (
                    <FormControlLabel
                      style={{ margin: '0 0 0 -11' }}
                      key={thisRole.id}
                      value={thisRole.id}
                      control={<Radio />}
                      label={<CardLink cardId={thisRole.id} format={format} notClickable sameTab />}
                      onClick={() => setRole(thisRole.id)}
                    />
                  ))}
                </RadioGroup>
              </Grid>
            </Grid>
          </div>
        )}
      </Grid>
      <Grid item xs={12} md={6} hidden={step < 0}>
        <Stepper>
          <Step completed={format !== ''}>
            <StepLabel>Format</StepLabel>
          </Step>
          <Step completed={primaryClan !== ''}>
            <StepLabel>Clan</StepLabel>
          </Step>
          {lastStep > 1 && (
            <Step completed={stronghold !== ''}>
              <StepLabel>Stronghold</StepLabel>
            </Step>
          )}
          {lastStep > 1 && (
            <Step completed={role !== ''}>
              <StepLabel>Role</StepLabel>
            </Step>
          )}
        </Stepper>
      </Grid>
      <Grid item xs={12} md={6} hidden={step < 0}>
        <Grid container spacing={2} direction="row" alignContent="stretch">
          <Grid item xs={6}>
            {step >= 0 && (
              <Button variant="contained" onClick={() => setStep(step - 1)} fullWidth>
                Back
              </Button>
            )}
          </Grid>
          <Grid item xs={6}>
            {step < lastStep && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => setStep(step + 1)}
                disabled={isButtonDisabled()}
              >
                Next
              </Button>
            )}
            {step === lastStep && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => completeWizard()}
                disabled={isButtonDisabled()}
              >
                Finish
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
