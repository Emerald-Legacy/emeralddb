import { Button, ButtonGroup, Grid, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useEffect, useState } from 'react'

export enum ValueFilterType {
  GREATER,
  EQUAL,
  LOWER,
}

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  button: {
    height: 24,
    width: 24,
    minWidth: 24,
    padding: 3,
  },
}))

export function CardValueFilter(props: {
  valueLabel: JSX.Element
  onFilterChange: (type: ValueFilterType, value: string) => void
}): JSX.Element {
  const [filterType, setFilterType] = useState<ValueFilterType>(ValueFilterType.EQUAL)
  const [filterString, setFilterString] = useState('')
  const classes = useStyles()

  useEffect(() => props.onFilterChange(filterType, filterString), [filterType, filterString])

  return (
    <Grid container alignItems="flex-end" alignContent="flex-end">
      <Grid size={{ xs: 2, md: 1 }}>
        {props.valueLabel}
      </Grid>
      <Grid size={{ xs: 4, md: 4 }}>
        <ButtonGroup size="small" className={classes.buttonGroup} variant="contained">
          <Button
            className={classes.button}
            onClick={() => setFilterType(ValueFilterType.GREATER)}
            color={filterType === ValueFilterType.GREATER ? 'secondary' : 'inherit'}
          >
            {'>'}
          </Button>
          <Button
            className={classes.button}
            onClick={() => setFilterType(ValueFilterType.EQUAL)}
            color={filterType === ValueFilterType.EQUAL ? 'secondary' : 'inherit'}
          >
            {'='}
          </Button>
          <Button
            className={classes.button}
            onClick={() => setFilterType(ValueFilterType.LOWER)}
            color={filterType === ValueFilterType.LOWER ? 'secondary' : 'inherit'}
          >
            {'<'}
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid size={{ xs: 6, md: 7 }}>
        <TextField value={filterString} onChange={(e) => setFilterString(e.target.value)} />
      </Grid>
    </Grid>
  )
}
