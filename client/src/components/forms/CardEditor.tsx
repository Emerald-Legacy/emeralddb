import { Card, Trait } from '@5rdb/api'
import { Fab, Grid, makeStyles, Switch, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import {
  sides,
  cardTypes,
  factions,
  typesInSide,
  sidesForType,
  formats,
  clans,
  roleRestrictions,
  elements as allElements,
} from '../../utils/enums'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { CardTextEditor } from '../card/CardTextEditor'
import { MultiCheckbox } from '../card/FormatCheckbox'
import { useUiStore } from '../../providers/UiStoreProvider'
import SaveIcon from '@material-ui/icons/Save'
import { useConfirm } from 'material-ui-confirm'
import { privateApi } from '../../api'
import { useHistory } from 'react-router-dom'
import { toSlugId } from '../../utils/slugIdUtils'

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: '0px',
    top: 'auto',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    left: 'auto',
    position: 'fixed',
    zIndex: 100,
  },
}))

export function CardEditor(props: { existingCard?: Card; editMode?: boolean }): JSX.Element {
  const history = useHistory()
  const existingCard = props.existingCard
  const allTraits = useUiStore().traits

  const [id, setId] = useState(existingCard?.id || '')
  const [name, setName] = useState(existingCard?.name || '')
  const [name_extra, setNameExtra] = useState(existingCard?.name_extra)
  const [faction, setFaction] = useState(existingCard?.faction || '')
  const [side, setSide] = useState(existingCard?.side || '')
  const [type, setType] = useState(existingCard?.type || '')
  const [is_unique, setIsUnique] = useState(existingCard?.is_unique || false)
  const [role_restrictions, setRoleRestictions] = useState(existingCard?.role_restrictions || [])
  const [text, setText] = useState(existingCard?.text)
  const [restricted_in, setRestrictedIn] = useState(existingCard?.restricted_in || [])
  const [banned_in, setBannedIn] = useState(existingCard?.banned_in || [])
  const [splash_banned_in, setSplashBannedIn] = useState(existingCard?.splash_banned_in || [])
  const [allowed_clans, setAllowedClans] = useState(existingCard?.allowed_clans || [])
  const [deck_limit, setDeckLimit] = useState(existingCard?.deck_limit || 3)
  const [traits, setTraits] = useState(existingCard?.traits)
  const [cost, setCost] = useState(existingCard?.cost)
  const [influence_cost, setInfluenceCost] = useState(existingCard?.influence_cost)
  const [elements, setElements] = useState(existingCard?.elements || [])
  const [strength, setStrength] = useState(existingCard?.strength)
  const [glory, setGlory] = useState(existingCard?.glory)
  const [fate, setFate] = useState(existingCard?.fate)
  const [honor, setHonor] = useState(existingCard?.honor)
  const [influence_pool, setInfluencePool] = useState(existingCard?.influence_pool)
  const [strength_bonus, setStrengthBonus] = useState(existingCard?.strength_bonus)
  const [military, setMilitary] = useState(existingCard?.military)
  const [political, setPolitical] = useState(existingCard?.political)
  const [military_bonus, setMilitaryBonus] = useState(existingCard?.military_bonus)
  const [political_bonus, setPoliticalBonus] = useState(existingCard?.political_bonus)

  const [isSplashable, setIsSplashable] = useState(influence_cost !== null)
  const [influenceRequired, setInfluenceRequired] = useState(isSplashable)
  const classes = useStyles()
  const confirm = useConfirm()

  const setIdFromNameAndExtra = (name: string | undefined, name_extra: string | undefined) => {
    const baseName = name || ''
    const extra = name_extra || ''
    const newId = baseName + (extra.length > 0 ? ' ' + extra : '')
    setId(toSlugId(newId))
  }

  const setNameAndGenerateId = (newName: string) => {
    setName(newName)
    setIdFromNameAndExtra(newName, name_extra)
  }

  const setNameExtraAndGenerateId = (newNameExtra: string) => {
    setNameExtra(newNameExtra)
    setIdFromNameAndExtra(name, newNameExtra)
  }

  const isDeckLimitInvalid = (deckLimit?: number) => {
    if (!deckLimit || deckLimit > 3 || deckLimit < 1) {
      return true
    }
    return false
  }

  const isInfluenceCostInvalid = (influenceCost?: number) => {
    if (influenceCost === undefined || influenceCost === null) {
      if (side !== 'conflict') {
        return false
      }
      if (!isSplashable) {
        return false
      }
      if (faction === 'shadowlands') {
        return false
      }
      return true
    }
    if (side !== 'conflict') {
      return true
    }
    if (faction === 'neutral' && influenceCost === 0) {
      return false
    }
    if (influenceCost < 1) {
      return true
    }
    if (!isSplashable) {
      return true
    }
    return false
  }

  const isXOrNumberGreater0 = (input: string) => {
    if (input === 'X') {
      return true
    }
    const skillNumber = Number.parseInt(input)
    if (Number.isNaN(skillNumber)) {
      return false
    }
    if (skillNumber < 0) {
      return false
    }
    return true
  }

  const isCostInvalid = (cost?: string) => {
    if (cost === undefined || cost === null) {
      // Daimyo's Gunbai
      return false
    }
    if (cost === 'X') {
      return false
    }
    return !isXOrNumberGreater0(cost)
  }

  const isValidNumberBonus = (bonus?: string) => {
    if (bonus === undefined || bonus === null) {
      return false
    }
    if (!bonus.startsWith('-') && !bonus.startsWith('+')) {
      return false
    }
    const bonusNumber = bonus.replace('-', '').replace('+', '')
    return isXOrNumberGreater0(bonusNumber)
  }

  const isAttachmentBonusInvalid = (attachmentBonus?: string) => {
    if (attachmentBonus === undefined || attachmentBonus === null) {
      return true
    }
    if (attachmentBonus === '-') {
      return false
    }
    return !isValidNumberBonus(attachmentBonus)
  }

  const isSkillInvalid = (skill?: string) => {
    if (skill === undefined || skill === null) {
      // Dash
      return false
    }
    return !isXOrNumberGreater0(skill)
  }

  const findTraits = (stringTraits?: string[]) => {
    const result: Trait[] = []
    if (stringTraits) {
      stringTraits.forEach((stringTrait) => {
        const traitItem = allTraits.find((item) => item.id === stringTrait)
        if (traitItem) {
          result.push(traitItem)
        }
      })
    }
    return result
  }

  const toggleSplashable = (checked: boolean) => {
    if (!checked) {
      setInfluenceCost(undefined)
      setAllowedClans(faction ? [faction] : [])
      setIsSplashable(false)
      setInfluenceRequired(false)
    } else {
      setAllowedClans(clans.map((clan) => clan.id))
      setIsSplashable(true)
      setInfluenceRequired(true)
    }
  }

  function compareValue(
    fieldId: string,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    originalValue: any,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    newValue: any
  ): { fieldId: string; changes: { old: string; new: string } }[] {
    if (originalValue !== newValue) {
      const changes = {
        old: originalValue?.toString() ?? '{null}',
        new: newValue?.toString() ?? '{null}',
      }
      return [
        {
          fieldId: fieldId,
          changes: changes,
        },
      ]
    }
    return []
  }

  function getChangedFields(
    originalCard: Card
  ): { fieldId: string; changes: { old: string; new: string } }[] {
    const changes: { fieldId: string; changes: { old: string; new: string } }[] = []
    changes.push(...compareValue('id', originalCard.id, id))
    changes.push(...compareValue('name', originalCard.name, name))
    changes.push(...compareValue('name_extra', originalCard.name_extra, name_extra))
    changes.push(...compareValue('faction', originalCard.faction, faction))
    changes.push(...compareValue('side', originalCard.side, side))
    changes.push(...compareValue('type', originalCard.type, type))
    changes.push(...compareValue('is_unique', originalCard.is_unique, is_unique))
    changes.push(
      ...compareValue('role_restriction', originalCard.role_restrictions, role_restrictions)
    )
    changes.push(...compareValue('text', originalCard.text, text))
    changes.push(...compareValue('restricted_in', originalCard.restricted_in, restricted_in))
    changes.push(...compareValue('banned_in', originalCard.banned_in, banned_in))
    changes.push(...compareValue('splash_banned_in', [], splash_banned_in))
    changes.push(...compareValue('allowed_clans', originalCard.allowed_clans, allowed_clans))
    changes.push(...compareValue('deck_limit', originalCard.deck_limit, deck_limit))
    changes.push(...compareValue('traits', originalCard.traits, traits))
    changes.push(...compareValue('influence_cost', originalCard.influence_cost, influence_cost))
    changes.push(...compareValue('elements', originalCard.elements, elements))
    changes.push(...compareValue('strength', originalCard.strength, strength))
    changes.push(...compareValue('glory', originalCard.glory, glory))
    changes.push(...compareValue('fate', originalCard.fate, fate))
    changes.push(...compareValue('honor', originalCard.honor, honor))
    changes.push(...compareValue('influence_pool', originalCard.influence_pool, influence_pool))
    changes.push(...compareValue('strength_bonus', originalCard.strength_bonus, strength_bonus))
    changes.push(...compareValue('military', originalCard.military, military))
    changes.push(...compareValue('political', originalCard.political, political))
    changes.push(...compareValue('military_bonus', originalCard.military_bonus, military_bonus))
    changes.push(...compareValue('political_bonus', originalCard.political_bonus, political_bonus))

    return changes
  }

  function assembleCard(): Card {
    const card: Card = {
      id: id,
      name: name,
      name_extra: name_extra,
      faction: faction,
      side: side,
      type: type,
      is_unique: is_unique,
      role_restrictions: role_restrictions,
      text: text,
      restricted_in: restricted_in,
      banned_in: banned_in,
      splash_banned_in: splash_banned_in,
      allowed_clans: allowed_clans,
      deck_limit: deck_limit,
      traits: traits,
      cost: cost,
      influence_cost: influence_cost,
      elements: elements,
      strength: strength,
      glory: glory,
      fate: fate,
      honor: honor,
      influence_pool: influence_pool,
      strength_bonus: strength_bonus,
      military: military,
      political: political,
      military_bonus: military_bonus,
      political_bonus: political_bonus,
    }
    console.log(card)
    return card
  }

  const handleSubmit = () => {
    const originalCard = props.existingCard
    if (originalCard) {
      // Update on existing card
      const changedFields = getChangedFields(originalCard)
      if (changedFields.length === 0) {
        confirm({ description: 'No changes were made.', title: '' })
      } else {
        const confirmationMessage = (
          <span>
            The following changes will be submitted:
            <br />
            {changedFields.map((changedField) => (
              <span>
                <b>{changedField.fieldId}</b>: {changedField.changes.old} {'-->'}{' '}
                {changedField.changes.new}
                <br />
              </span>
            ))}
          </span>
        )

        confirm({ description: confirmationMessage })
          .then(() => {
            const newCard = assembleCard()
            privateApi.Card.update({ cardId: newCard.id, body: newCard })
              .then(() => {
                history.push(`/card/${newCard.id}`)
              })
              .catch((error) => {
                console.log(error)
                // TODO: Show error
              })
          })
          .catch(() => {
            // Cancel confirmation dialog => do nothing
          })
      }
    } else {
      // New card
      confirm({
        title: `Create card ${name} (${id})`,
        description: 'Do you want to create this card?',
      })
        .then(() => {
          const newCard = assembleCard()
          privateApi.Card.create({ body: newCard })
            .then(() => {
              history.push(`/card/${newCard.id}`)
            })
            .catch((error) => {
              console.log(error)
              // TODO: Show error
            })
        })
        .catch(() => {
          // Cancel confirmation dialog => do nothing
        })
    }
  }

  return (
    <form>
      <Grid container spacing={3}>
        <Fab
          variant="extended"
          color="primary"
          className={classes.fab}
          onClick={() => handleSubmit()}
        >
          <SaveIcon />
          Save Changes
        </Fab>
        <Grid item xs={12}>
          <Typography variant="h6">Name and ID</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={props.editMode}
                required
                id="name"
                label="Name"
                value={name}
                onChange={(e) => setNameAndGenerateId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={props.editMode}
                id="name_extra"
                label="Name Extra"
                value={name_extra}
                onChange={(e) => setNameExtraAndGenerateId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled
                InputLabelProps={{ shrink: true }}
                required
                id="id"
                label="Card ID (generated from Name + Name Extra)"
                value={id}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">General Card Information</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    id="combo-box-faction"
                    autoHighlight
                    options={factions}
                    getOptionLabel={(option) => option.name}
                    value={factions.find((item) => item.id === faction) || null}
                    renderInput={(params) => (
                      <TextField required {...params} label="Faction" variant="outlined" />
                    )}
                    onChange={(e, value) => {
                      const newFaction = value?.id || ''
                      if (newFaction === 'neutral') {
                        setAllowedClans(clans.map((clan) => clan.id))
                      }
                      setFaction(newFaction)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    id="combo-box-type"
                    autoHighlight
                    options={cardTypes}
                    getOptionLabel={(option) => option.name}
                    value={cardTypes.find((item) => item.id === type) || null}
                    getOptionDisabled={(option) => !!side && !typesInSide(side).includes(option.id)}
                    renderInput={(params) => (
                      <TextField required {...params} label="Card Type" variant="outlined" />
                    )}
                    onChange={(e, value) => setType(value?.id || '')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    id="combo-box-side"
                    autoHighlight
                    options={sides}
                    getOptionLabel={(option) => option.name}
                    value={sides.find((item) => item.id === side) || null}
                    getOptionDisabled={(option) =>
                      !!type && !sidesForType(type).includes(option.id)
                    }
                    renderInput={(params) => (
                      <TextField required {...params} label="Deck/Side" variant="outlined" />
                    )}
                    onChange={(e, value) => {
                      const newSide = value?.id || ''
                      if (
                        newSide !== 'conflict' &&
                        faction &&
                        faction !== 'shadowlands' &&
                        faction !== 'neutral'
                      ) {
                        setAllowedClans([faction])
                      }
                      setSide(newSide)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    id="combo-box-role-restrictions"
                    autoHighlight
                    options={roleRestrictions}
                    multiple
                    getOptionLabel={(option) => option.name}
                    value={roleRestrictions.filter((item) => role_restrictions.includes(item.id))}
                    renderInput={(params) => (
                      <TextField {...params} label="Role Restiction" variant="outlined" />
                    )}
                    onChange={(e, value) => setRoleRestictions(value.map((item) => item.id))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <b>Is Unique:</b>
                    <Switch checked={is_unique} onChange={(e) => setIsUnique(e.target.checked)} />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="deck_limit"
                    label="Deck Limit"
                    defaultValue={deck_limit}
                    error={isDeckLimitInvalid(deck_limit)}
                    helperText="Must be between 1 and 3"
                    type="number"
                    fullWidth
                    onChange={(e) => setDeckLimit(Number.parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="combo-box-traits"
                    autoHighlight
                    multiple
                    options={allTraits}
                    getOptionLabel={(option) => option.name}
                    value={findTraits(traits)}
                    renderInput={(params) => (
                      <TextField {...params} label="Traits" variant="outlined" />
                    )}
                    onChange={(e, value) => setTraits(value.map((item) => item.id))}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardTextEditor
                text={text || ''}
                onChange={(text: string) => setText(text)}
                faction={faction}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MultiCheckbox
                label="Restricted In"
                items={formats}
                onChange={(formats: string[]) => setRestrictedIn(formats)}
                defaultItems={restricted_in}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MultiCheckbox
                label="Banned In"
                items={formats}
                onChange={(formats: string[]) => setBannedIn(formats)}
                defaultItems={banned_in}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MultiCheckbox
                label="Playable In"
                items={clans}
                onChange={(clans: string[]) => setAllowedClans(clans)}
                defaultItems={allowed_clans}
              />
            </Grid>
          </Grid>
        </Grid>
        {side === 'conflict' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Conflict Card Information</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <MultiCheckbox
                  label="Splash Banned In"
                  items={formats}
                  onChange={(formats: string[]) => setSplashBannedIn(formats)}
                  defaultItems={splash_banned_in}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography>
                  <b>Is Splashable:</b>
                  <Switch
                    checked={isSplashable}
                    disabled={faction === 'shadowlands' || faction === 'neutral'}
                    onChange={(e) => toggleSplashable(e.target.checked)}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required={influenceRequired}
                  disabled={faction === 'shadowlands' || !isSplashable}
                  id="influence_cost"
                  label="Influence Cost"
                  value={
                    influence_cost === undefined || influence_cost === null
                      ? undefined
                      : influence_cost
                  }
                  error={isInfluenceCostInvalid(influence_cost)}
                  helperText="Neutral card = 0, Clan card >= 1"
                  type="number"
                  fullWidth
                  onChange={(e) =>
                    setInfluenceCost(
                      !Number.isNaN(Number.parseInt(e.target.value))
                        ? Number.parseInt(e.target.value)
                        : undefined
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {type === 'event' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Event Card Information</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="cost"
                  label="Cost"
                  value={cost}
                  error={isCostInvalid(cost)}
                  helperText='Must be "X" or a number >= 0 (leaving this empty is allowed for cards like Daimyos Gunbai)'
                  fullWidth
                  onChange={(e) => setCost(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {type === 'attachment' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Attachment Card Information</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="cost"
                  label="Cost"
                  value={cost}
                  error={isCostInvalid(cost)}
                  helperText='Must be "X" or a number >= 0 (leaving this empty is allowed for cards like Daimyos Gunbai)'
                  fullWidth
                  onChange={(e) => setCost(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="military_bonus"
                  label="Military Bonus"
                  value={military_bonus}
                  error={isAttachmentBonusInvalid(military_bonus)}
                  helperText='Must be "-" or start with a - or + followed by a number or "X"'
                  fullWidth
                  onChange={(e) => setMilitaryBonus(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="political_bonus"
                  label="Political Bonus"
                  value={political_bonus}
                  error={isAttachmentBonusInvalid(political_bonus)}
                  helperText='Must be "-" or start with a - or + followed by a number or "X"'
                  fullWidth
                  onChange={(e) => setPoliticalBonus(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {type === 'character' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Character Card Information</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="cost"
                  label="Cost"
                  value={cost}
                  error={isCostInvalid(cost)}
                  helperText='Must be "X" or a number >= 0 (leaving this empty is allowed for cards like Daimyos Gunbai)'
                  fullWidth
                  onChange={(e) => setCost(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="military"
                  label="Military Skill"
                  value={military}
                  error={isSkillInvalid(military)}
                  helperText='Must be empty (for dashes), "X", or a number >= 0'
                  fullWidth
                  onChange={(e) => setMilitary(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="political"
                  label="Political Skill"
                  value={political}
                  error={isSkillInvalid(political)}
                  helperText='Must be empty (for dashes), "X", or a number >= 0'
                  fullWidth
                  onChange={(e) => setPolitical(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="glory"
                  label="Glory"
                  defaultValue={glory}
                  error={glory === undefined || glory === null || glory < 0}
                  helperText="Must be a number >= 0"
                  type="number"
                  fullWidth
                  onChange={(e) => setGlory(Number.parseInt(e.target.value))}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {type === 'province' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Province Card Information</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="strength"
                  label="Strength"
                  value={strength}
                  error={!isXOrNumberGreater0(strength || '')}
                  helperText='Must be "X" or a number >= 0'
                  fullWidth
                  onChange={(e) => setStrength(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MultiCheckbox
                  label="Elements"
                  items={allElements}
                  onChange={(elements: string[]) => setElements(elements)}
                  defaultItems={elements}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {type === 'holding' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Holding Card Information</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="strength_bonus"
                  label="Strength Bonus"
                  value={strength_bonus}
                  error={!isValidNumberBonus(strength_bonus)}
                  helperText="Must be a - or a +, followed by a number"
                  fullWidth
                  onChange={(e) => setStrengthBonus(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {type === 'stronghold' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Stronghold Card Information</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="strength_bonus"
                  label="Strength Bonus"
                  value={strength_bonus}
                  error={!isValidNumberBonus(strength_bonus)}
                  helperText="Must be a - or a +, followed by a number"
                  fullWidth
                  onChange={(e) => setStrengthBonus(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="fate"
                  label="Fate per Turn"
                  defaultValue={fate}
                  error={fate === undefined || fate === null || fate < 0}
                  helperText="Must be a number >= 0"
                  type="number"
                  fullWidth
                  onChange={(e) => setFate(Number.parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="influence_pool"
                  label="Influence Pool"
                  defaultValue={influence_pool}
                  error={
                    influence_pool === undefined || influence_pool === null || influence_pool < 0
                  }
                  helperText="Must be a number >= 0"
                  type="number"
                  fullWidth
                  onChange={(e) => setInfluencePool(Number.parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="honor"
                  label="Starting Honor"
                  defaultValue={honor}
                  error={honor === undefined || honor === null || honor < 0}
                  helperText="Must be a number >= 0"
                  type="number"
                  fullWidth
                  onChange={(e) => setHonor(Number.parseInt(e.target.value))}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {type === 'warlord' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Warlord Card Information</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="fate_and_cost"
                  label="Cost and Fate per Player per Turn"
                  defaultValue={fate}
                  error={fate === undefined || fate === null || fate < 0}
                  helperText="Must be a number >= 0"
                  type="number"
                  fullWidth
                  onChange={(e) => {
                    setFate(Number.parseInt(e.target.value))
                    setCost(e.target.value)
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="military"
                  label="Military Skill"
                  value={military}
                  error={isSkillInvalid(military)}
                  helperText='Must be empty (for dashes), "X", or a number >= 0'
                  fullWidth
                  onChange={(e) => setMilitary(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="political"
                  label="Political Skill"
                  value={political}
                  error={isSkillInvalid(political)}
                  helperText='Must be empty (for dashes), "X", or a number >= 0'
                  fullWidth
                  onChange={(e) => setPolitical(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="glory"
                  label="Glory"
                  defaultValue={glory}
                  error={glory === undefined || glory === null || glory < 0}
                  helperText="Must be a number >= 0"
                  type="number"
                  fullWidth
                  onChange={(e) => setGlory(Number.parseInt(e.target.value))}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </form>
  )
}
