import React from 'react'
import { styled } from '@mui/material/styles';
import clsx from 'clsx'
import TableCell from '@mui/material/TableCell'
import { AutoSizer, Column, Table, TableCellRenderer, TableHeaderProps } from 'react-virtualized'
import { CardQuantitySelector } from './CardQuantitySelector'
import { CardLink } from '../card/CardLink'
import { InfluenceElement } from '../card/InfluenceElement'

const PREFIX = 'VirtualizedCardTable';

const classes = {
  flexContainer: `${PREFIX}-flexContainer`,
  table: `${PREFIX}-table`,
  tableRow: `${PREFIX}-tableRow`,
  tableRowHover: `${PREFIX}-tableRowHover`,
  tableCell: `${PREFIX}-tableCell`,
  noClick: `${PREFIX}-noClick`
};

const StyledAutoSizer = styled(AutoSizer)(({
  theme
}) => ({
  [`& .${classes.flexContainer}`]: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },

  [`& .${classes.table}`]: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },

  [`& .${classes.tableRow}`]: {
    cursor: 'pointer',
  },

  [`& .${classes.tableRowHover}`]: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },

  [`& .${classes.tableCell}`]: {
    flex: 1,
    padding: 0,
    paddingLeft: 8,
  },

  [`& .${classes.noClick}`]: {
    cursor: 'initial',
  }
}));

declare module '@mui/material/styles/withStyles' {
  // Augment the BaseCSSProperties so that we can control jss-rtl
  interface BaseCSSProperties {
    /*
     * Used to control if the rule-set should be affected by rtl transformation
     */
    flip?: boolean
  }
}

export interface ColumnData {
  columnType:
    | 'quantityForId'
    | 'nameFactionType'
    | 'traits'
    | 'influenceAndFaction'
    | 'cost'
    | 'mil'
    | 'pol'
    | 'glory'
    | 'strength'
  label: string
  width: number
}

interface Row {
  index: number
}

interface MuiVirtualizedTableProps {
  columns: ColumnData[]
  headerHeight?: number
  onRowClick?: () => void
  rowCount: number
  rowGetter: (row: Row) => TableCardData
  rowHeight?: number
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 40,
    rowHeight: 40,
  }

  getRowClassName = ({ index }: Row) => {
    const {  onRowClick } = this.props

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    })
  }

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
    const { columns,  rowHeight, onRowClick } = this.props
    const columnType = columns[columnIndex].columnType
    const width = columns[columnIndex].width
    let renderComponent = <div />
    if (columnType === 'quantityForId') {
      const quantityData = cellData as {
        quantity: number
        cardId: string
        deckLimit: number
        onQuantityChange: (newQuantity: number) => void
      }
      renderComponent = (
        <CardQuantitySelector
          deckLimit={quantityData.deckLimit}
          quantity={quantityData.quantity}
          onQuantityChange={quantityData.onQuantityChange}
        />
      )
    }
    if (columnType === 'nameFactionType') {
      const nameData = cellData as {
        name: string
        faction: string
        type: string
        cardId: string
        format: string
      }
      renderComponent = (
        <span>
          <CardLink cardId={nameData.cardId} format={nameData.format} />
        </span>
      )
    }
    if (columnType === 'traits') {
      const traitsData = cellData as {
        traits: string
      }
      renderComponent = (
        <span style={{ fontSize: 12 }}>
          <i>{traitsData.traits}</i>
        </span>
      )
    }
    if (columnType === 'influenceAndFaction') {
      const influenceData = cellData as {
        influence: number
        faction: string
      }
      renderComponent = (
        <InfluenceElement faction={influenceData.faction} influence={influenceData.influence} />
      )
    }
    if (columnType === 'cost') {
      const costData = cellData as {
        cost: string
      }
      renderComponent = <span>{costData.cost}</span>
    }
    if (columnType === 'mil') {
      const milData = cellData as {
        mil: string
      }
      renderComponent = <span>{milData.mil}</span>
    }
    if (columnType === 'pol') {
      const polData = cellData as {
        pol: string
      }
      renderComponent = <span>{polData.pol}</span>
    }
    if (columnType === 'glory') {
      const gloryData = cellData as {
        glory: string
      }
      renderComponent = <span>{gloryData.glory}</span>
    }
    if (columnType === 'strength') {
      const strengthData = cellData as {
        strength: string
      }
      renderComponent = <span>{strengthData.strength}</span>
    }

    return (
      <TableCell
        component="div"
        width={width}
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
      >
        {renderComponent}
      </TableCell>
    )
  }

  headerRenderer = ({ label, columnIndex }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, } = this.props
    const width = columns[columnIndex].width

    return (
      <TableCell
        component="div"
        className={clsx(classes.flexContainer, classes.tableCell, classes.noClick)}
        variant="head"
        width={width}
        style={{ height: headerHeight }}
      >
        <span>{label}</span>
      </TableCell>
    )
  }

  render() {
    const {  columns, rowHeight, headerHeight, ...tableProps } = this.props
    return (
      <StyledAutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight!}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight!}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ columnType, ...other }, index) => {
              return (
                <Column
                  key={columnType}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={columnType}
                  {...other}
                />
              )
            })}
          </Table>
        )}
      </StyledAutoSizer>
    );
  }
}

export const VirtualizedCardTable = (MuiVirtualizedTable)

export interface TableCardData {
  quantityForId: {
    quantity: number
    deckLimit: number
    onQuantityChange: (newQuantity: number) => void
  }
  nameFactionType: {
    name: string
    faction: string
    type: string
    cardId: string
    format: string
  }
  traits?: {
    traits: string
  }
  influenceAndFaction: {
    influence: number
    faction: string
  }
  cost: {
    cost: string
  }
  mil?: {
    mil: string
  }
  pol?: {
    pol: string
  }
  glory?: {
    glory: string
  }
  strength?: {
    strength: string
  }
}
