import { getColorForFactionId } from '../utils/factionUtils'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import PersonIcon from '@material-ui/icons/Person'
import FlashOnIcon from '@material-ui/icons/FlashOn'
import HouseIcon from '@material-ui/icons/House'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import MapIcon from '@material-ui/icons/Map'
import FlareIcon from '@material-ui/icons/Flare'
import GavelIcon from '@material-ui/icons/Gavel'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import FlagIcon from '@material-ui/icons/Flag'

const icons = [
  { type: 'attachment', icon: AttachFileIcon },
  { type: 'character', icon: PersonIcon },
  { type: 'event', icon: FlashOnIcon },
  { type: 'holding', icon: HouseIcon },
  { type: 'stronghold', icon: AccountBalanceIcon },
  { type: 'province', icon: MapIcon },
  { type: 'role', icon: FlareIcon },
  { type: 'treaty', icon: GavelIcon },
  { type: 'warlord', icon: FlagIcon },
]

export function CardTypeIcon(props: {
  type: string
  faction?: string
  defaultColor?: string
}): JSX.Element {
  const color = props.defaultColor || getColorForFactionId(props.faction || '')
  const style = color ? { color: color, fontSize: 16 } : { fontSize: 16 }
  const Icon = icons.find((icon) => icon.type === props.type)?.icon || HelpOutlineIcon

  return <Icon style={style} />
}
