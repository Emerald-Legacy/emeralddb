import { CardWithVersions } from "@5rdb/api";
import { FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { sides, types, factions, typesInSide, sidesForType } from "../utils/enums";
import Autocomplete from '@material-ui/lab/Autocomplete';


export function CardForm(props: {existingCard?: CardWithVersions, editMode?: boolean}): JSX.Element {
  const existingCard = props.existingCard
  
  const [id, setId] = useState(existingCard?.id)
  const [name, setName] = useState(existingCard?.name)
  const [name_extra, setNameExtra] = useState(existingCard?.name_extra)
  const [faction, setFaction] = useState(existingCard?.clan) 
  const [side, setSide] = useState(existingCard?.side) 
  const [type, setType] = useState(existingCard?.type) 
  const [is_unique, setIsUnique] = useState(existingCard?.is_unique) 
  const [role_restriction, setRoleRestiction] = useState(existingCard?.role_restriction) 
  const [text, setText] = useState(existingCard?.text) 
  const [restricted_in, setRestrictedIn] = useState(existingCard?.restricted_in) 
  const [banned_in, setBannedIn] = useState(existingCard?.banned_in) 
  const [allowed_clans, setAllowedClans] = useState(existingCard?.allowed_clans) 
  const [traits, setTraits] = useState(existingCard?.traits) 
  const [cost, setCost] = useState(existingCard?.cost) 
  const [deck_limit, setDeckLimit] = useState(existingCard?.deck_limit) 
  const [influence_cost, setInfluenceCost] = useState(existingCard?.influence_cost) 
  const [elements, setElements] = useState(existingCard?.elements) 
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

  const setIdFromNameAndExtra = (name: string | undefined, name_extra: string | undefined) => {
    const baseName = name || ''
    const extra = name_extra || ''
    setId(name + (extra.length > 0 ? (' ' + extra) : ''))
  }

  const setNameAndGenerateId = (newName: string) => {
    setName(newName)
    setIdFromNameAndExtra(newName, name_extra)
  }

  const setNameExtraAndGenerateId = (newNameExtra: string) => {
    setNameExtra(newNameExtra)
    setIdFromNameAndExtra(name, newNameExtra)
  }

  return (<form>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>Name and ID</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField disabled={props.editMode} required id='name' label="Name" defaultValue={name} onChange={(e) => setNameAndGenerateId(e.target.value)}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField disabled={props.editMode} id='name_extra' label="Name Extra" defaultValue={name_extra} onChange={(e) => setNameExtraAndGenerateId(e.target.value)}/>
          </Grid>
          <Grid item xs={12}>
            <TextField disabled required id='id' label="Card ID (generated from Name + Name Extra)" defaultValue={id} fullWidth />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>General Card Information</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
                id="combo-box-demo"
                options={factions}
                getOptionLabel={(option) => option.name}
                value={factions.find(item => item.id === faction) || null}
                renderInput={(params) => <TextField required {...params} label="Faction" variant="outlined" />}
                onChange={(e, value) => setFaction(value?.id)}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
                id="combo-box-demo"
                options={types}
                getOptionLabel={(option) => option.name}
                value={types.find(item => item.id === type) || null}
                getOptionDisabled={(option) => !!side && !typesInSide(side).includes(option.id)}
                renderInput={(params) => <TextField required {...params} label="Card Type" variant="outlined" />}
                onChange={(e, value) => setType(value?.id)}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete 
                id="combo-box-demo"
                options={sides}
                getOptionLabel={(option) => option.name}
                value={sides.find(item => item.id === side) || null}
                getOptionDisabled={(option) => !!type && !sidesForType(type).includes(option.id)}
                renderInput={(params) => <TextField required {...params} label="Deck/Side" variant="outlined" />}
                onChange={(e, value) => setSide(value?.id)}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography>
              <b>Is Unique:</b>
              <Switch
                checked={is_unique}
                onChange={(e) => setIsUnique(e.target.checked)}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography>
              <b>Is Unique:</b>
              <Switch
                checked={is_unique}
                onChange={(e) => setIsUnique(e.target.checked)}
              />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </form>)
}