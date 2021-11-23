import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'
import { Button, ButtonGroup, makeStyles, Grid } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  buttonGroup: {
    height: 26,
    width: 26,
    marginBottom: 5,
  },
  icon: {
    width: 26,
    height: 13,
  },
}))

export function CardTextEditorButtons(props: {
  onClick: (tagOrNameIcon: string, isIcon: boolean) => void
}): JSX.Element {
  const classes = useStyles()

  const clickIcon = (iconName: string) => {
    props.onClick(iconName, true)
  }

  const clickTag = (tagName: string) => {
    props.onClick(tagName, false)
  }

  const getIconForIconName = (iconName: string): JSX.Element => {
    return <span className={`icon icon-${iconName} ${classes.icon}`}></span>
  }

  return (
    <Grid container spacing={1} justify="space-between">
      <Grid item sm={3} xs={12}>
        <ButtonGroup variant="outlined" className={classes.buttonGroup}>
          <Button onClick={() => clickTag('br')}>
            <KeyboardReturnIcon />
          </Button>
          <Button onClick={() => clickTag('b')}>
            <FormatBoldIcon />
          </Button>
          <Button onClick={() => clickTag('em')}>
            <FormatItalicIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item sm={9} xs={12}>
        <ButtonGroup variant="outlined" className={classes.buttonGroup}>
          <Button onClick={() => clickIcon('element-air')}>
            {getIconForIconName('element-air')}
          </Button>
          <Button onClick={() => clickIcon('element-earth')}>
            {getIconForIconName('element-earth')}
          </Button>
          <Button onClick={() => clickIcon('element-fire')}>
            {getIconForIconName('element-fire')}
          </Button>
          <Button onClick={() => clickIcon('element-water')}>
            {getIconForIconName('element-water')}
          </Button>
          <Button onClick={() => clickIcon('element-void')}>
            {getIconForIconName('element-void')}
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item sm={3} xs={12}>
        <ButtonGroup variant="outlined" className={classes.buttonGroup}>
          <Button onClick={() => clickIcon('conflict-military')}>
            {getIconForIconName('conflict-military')}
          </Button>
          <Button onClick={() => clickIcon('conflict-political')}>
            {getIconForIconName('conflict-political')}
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item sm={9} xs={12}>
        <ButtonGroup variant="outlined" className={classes.buttonGroup}>
          <Button onClick={() => clickIcon('clan-crab')}>{getIconForIconName('clan-crab')}</Button>
          <Button onClick={() => clickIcon('clan-crane')}>
            {getIconForIconName('clan-crane')}
          </Button>
          <Button onClick={() => clickIcon('clan-dragon')}>
            {getIconForIconName('clan-dragon')}
          </Button>
          <Button onClick={() => clickIcon('clan-lion')}>{getIconForIconName('clan-lion')}</Button>
          <Button onClick={() => clickIcon('clan-phoenix')}>
            {getIconForIconName('clan-phoenix')}
          </Button>
          <Button onClick={() => clickIcon('clan-scorpion')}>
            {getIconForIconName('clan-scorpion')}
          </Button>
          <Button onClick={() => clickIcon('clan-unicorn')}>
            {getIconForIconName('clan-unicorn')}
          </Button>
          <Button onClick={() => clickIcon('clan-shadowlands')}>
            {getIconForIconName('clan-shadowlands')}
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}
