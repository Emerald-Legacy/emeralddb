import { useState } from 'react';
import { Card } from '@5rdb/api/index';
import { Button, ButtonGroup, makeStyles, Paper, TextField } from '@material-ui/core';
import { factions } from '../utils/enums';

const useStyles = makeStyles((theme) => ({
  filter: {
    padding: theme.spacing(1)
  }
}))

export interface Filter {
  factions: string[]
}

export function applyFilters(cards: Card[], filter: Filter): Card[] {
  if (filter.factions.length === 0) {
    return cards
  }

  return cards.filter(c => filter.factions.includes(c.faction));
}

export function CardFilter(props: {onFilterChanged: (filter: Filter) => void}): JSX.Element {
  const classes = useStyles()
  const [filteredFactions, setFilteredFactions] = useState<string[]>([]);

  function toggleFactionFilter(id: string) {
    let newItems = [...filteredFactions];
    if (newItems.includes(id)) {
      const index = newItems.indexOf(id);
      newItems.splice(index, 1)
    } else {
      newItems.push(id);
    }
    setFilteredFactions(newItems);
    props.onFilterChanged({
      factions: newItems
    })
  }

  return (
    <Paper className={classes.filter}>
      <TextField fullWidth variant="outlined" size="small" placeholder="Seach for card name, ability text..." />
      <ButtonGroup>
        { factions.map(f => <Button disableTouchRipple key={f.id} onClick={() => toggleFactionFilter(f.id)} style={{backgroundColor: filteredFactions.includes(f.id) ? f.color : ''}}>
          <span className={`icon icon-clan-${f.id}`} style={{color: filteredFactions.includes(f.id) ? 'white' : f.color}}/>
        </Button>) }
      </ButtonGroup>
    </Paper>
  )
}
