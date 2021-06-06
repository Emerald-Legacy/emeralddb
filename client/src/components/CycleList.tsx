import { Checkbox, FormControlLabel } from '@material-ui/core'
import { useUiStore } from '../providers/UiStoreProvider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import { useState } from 'react'
import { Cycle, Pack } from '@5rdb/api'

type CycleWithPacks = Cycle & {
  packs: Pack[]
}

export function CycleList(props: {
  withCheckbox?: boolean
  onSelection?: (checkedPackIds: string[], checkedCycleIds: string[]) => void
  onPackClick?: (packId: string) => void
  onCycleClick?: (cycleId: string) => void
  selectedPacks?: string[]
  selectedCycles?: string[]
  rootLabel: string
}): JSX.Element {
  const { cycles, packs } = useUiStore()
  const [checkedCycleIds, setCheckedCycleIds] = useState<string[]>(props.selectedCycles || [])
  const [checkedPackIds, setCheckedPackIds] = useState<string[]>(props.selectedPacks || [])
  const [allChecked, setAllChecked] = useState(false)

  if (
    !allChecked &&
    checkedCycleIds.length === cycles.length &&
    checkedPackIds.length === packs.length
  ) {
    setAllChecked(true)
  }

  function groupPacksByCycle(): CycleWithPacks[] {
    const result: CycleWithPacks[] = []
    cycles.forEach((cycle) => {
      result.push({
        ...cycle,
        packs: packs.filter((pack) => pack.cycle_id === cycle.id),
      })
    })
    result.sort((a, b) => a.position - b.position)
    return result
  }

  const cyclesWithPacks = groupPacksByCycle()

  function removeOrAddPack(packIds: string[], id: string, remove: boolean): string[] {
    const newPackIds = [...packIds]
    const index = newPackIds.indexOf(id)
    if (remove) {
      if (index > -1) {
        newPackIds.splice(index, 1)
      }
    } else {
      if (index === -1) {
        newPackIds.push(id)
      }
    }
    return newPackIds
  }

  function updateCheckedPacksAndCycles(packIds: string[], cycleIds: string[]) {
    setCheckedPackIds(packIds)
    if (props.onSelection) {
      props.onSelection(packIds, cycleIds)
    }
  }

  function checkPack(checked: boolean, pack: Pack) {
    let packIds = [...checkedPackIds]
    packIds = removeOrAddPack(packIds, pack.id, !checked)
    updateCheckedPacksAndCycles(packIds, checkedCycleIds)
  }

  function checkCycle(checked: boolean, cycle: CycleWithPacks) {
    const cycleIds = [...checkedCycleIds]
    let packIds = [...checkedPackIds]
    const index = cycleIds.indexOf(cycle.id)
    if (!checked) {
      if (index > -1) {
        cycleIds.splice(index, 1)
      }
    } else {
      if (index === -1) {
        cycleIds.push(cycle.id)
      }
    }
    cycle.packs.forEach((pack) => {
      packIds = removeOrAddPack(packIds, pack.id, !checked)
    })
    setCheckedCycleIds(cycleIds)
    updateCheckedPacksAndCycles(packIds, cycleIds)
  }

  function checkAll(checked: boolean) {
    const checkedPacks: string[] = []
    const checkedCycles: string[] = []
    if (checked) {
      cyclesWithPacks.forEach((cycle) => {
        cycle.packs.forEach((pack) => {
          checkedPacks.push(pack.id)
        })
        checkedCycles.push(cycle.id)
      })
    }
    setAllChecked(checked)
    setCheckedPackIds(checkedPacks)
    setCheckedCycleIds(checkedCycles)
    updateCheckedPacksAndCycles(checkedPacks, checkedCycles)
  }

  function createCycleLabel(cycle: CycleWithPacks): JSX.Element {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedCycleIds.some((item) => item === cycle.id)}
            onChange={(event) => checkCycle(event.currentTarget.checked, cycle)}
            onClick={(e) => e.stopPropagation()}
          />
        }
        label={<>{cycle.name}</>}
        key={cycle.id}
      />
    )
  }

  function createPackLabel(pack: Pack): JSX.Element {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedPackIds.some((item) => item === pack.id)}
            onChange={(event) => checkPack(event.currentTarget.checked, pack)}
            onClick={(e) => e.stopPropagation()}
          />
        }
        label={<>{pack.name}</>}
        key={pack.id}
      />
    )
  }

  function createRootLabel(): JSX.Element {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={allChecked}
            onChange={(event) => checkAll(event.currentTarget.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        }
        label={<>{props.rootLabel}</>}
        key="root"
      />
    )
  }

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={['root']}
      >
        <TreeItem nodeId="root" label={props.withCheckbox ? createRootLabel() : props.rootLabel}>
          {cyclesWithPacks.map((cycle) => (
            <TreeItem
              key={cycle.id}
              nodeId={cycle.id + '_cycle'}
              label={props.withCheckbox ? createCycleLabel(cycle) : cycle.name}
            >
              {cycle.packs.map((pack) => (
                <TreeItem
                  key={pack.id}
                  nodeId={pack.id + '_pack'}
                  label={props.withCheckbox ? createPackLabel(pack) : pack.name}
                />
              ))}
            </TreeItem>
          ))}
        </TreeItem>
      </TreeView>
    </div>
  )
}
