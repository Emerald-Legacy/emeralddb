import { CardWithVersions } from '@5rdb/api'
import { Box, Grid, Paper, Typography, List, ListItem } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'

interface DeckStatisticsProps {
  cards: Record<string, number>
  allCards: CardWithVersions[]
}

export function DeckStatistics({ cards, allCards }: DeckStatisticsProps): JSX.Element {
  // Calculate fate cost distribution
  const fateCostDistribution = calculateFateCostDistribution(cards, allCards)
  const averageFateCost = calculateAverageFateCost(cards, allCards)

  // Calculate card type distribution
  const cardTypeDistribution = calculateCardTypeDistribution(cards, allCards)

  // Calculate military power distribution
  const militaryPowerDistribution = calculateMilitaryPowerDistribution(cards, allCards)
  const averageMilitaryPower = calculateAverageMilitaryPower(cards, allCards)

  // Calculate political power distribution
  const politicalPowerDistribution = calculatePoliticalPowerDistribution(cards, allCards)
  const averagePoliticalPower = calculateAveragePoliticalPower(cards, allCards)

  // Calculate trait counts
  const traitCounts = calculateTraitCounts(cards, allCards)

  return (
    <Box p={1}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Fate Cost (Avg: {averageFateCost.toFixed(2)})
            </Typography>
            {fateCostDistribution.length > 0 ? (
              <BarChart
                xAxis={[
                  {
                    scaleType: 'band',
                    data: fateCostDistribution.map((d) => d.cost),
                    hideTooltip: true,
                  },
                ]}
                series={[
                  {
                    data: fateCostDistribution.map((d) => d.count),
                    color: '#1b5e20',
                  },
                ]}
                height={200}
                slots={{ legend: () => null }}
              />
            ) : (
              <Typography align="center" color="text.secondary">
                No cards with fate cost in deck
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Card Type Distribution
            </Typography>
            {cardTypeDistribution.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: cardTypeDistribution,
                    highlightScope: { fade: 'global', highlight: 'item' },
                  },
                ]}
                height={200}
              />
            ) : (
              <Typography align="center" color="text.secondary">
                No cards in deck
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Military Power (Avg: {averageMilitaryPower.toFixed(2)})
            </Typography>
            {militaryPowerDistribution.length > 0 ? (
              <BarChart
                xAxis={[
                  {
                    scaleType: 'band',
                    data: militaryPowerDistribution.map((d) => d.power),
                    hideTooltip: true,
                  },
                ]}
                series={[
                  {
                    data: militaryPowerDistribution.map((d) => d.count),
                    color: '#1b5e20',
                  },
                ]}
                height={200}
                slots={{ legend: () => null }}
              />
            ) : (
              <Typography align="center" color="text.secondary">
                No characters with military power in deck
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Political Power (Avg: {averagePoliticalPower.toFixed(2)})
            </Typography>
            {politicalPowerDistribution.length > 0 ? (
              <BarChart
                xAxis={[
                  {
                    scaleType: 'band',
                    data: politicalPowerDistribution.map((d) => d.power),
                    hideTooltip: true,
                  },
                ]}
                series={[
                  {
                    data: politicalPowerDistribution.map((d) => d.count),
                    color: '#1b5e20',
                  },
                ]}
                height={200}
                slots={{ legend: () => null }}
              />
            ) : (
              <Typography align="center" color="text.secondary">
                No characters with political power in deck
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Top 5 Traits
            </Typography>
            <List dense>
              {traitCounts.slice(0, 5).map(({ trait, count }) => (
                <ListItem key={trait} sx={{ py: 0 }}>
                  <strong>{trait}</strong>: {count}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

function calculateTraitCounts(
  cards: Record<string, number>,
  allCards: CardWithVersions[]
): { trait: string; count: number }[] {
  const traitMap = new Map<string, number>()

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.type === 'character' && card.traits) {
      card.traits.forEach((trait) => {
        const currentCount = traitMap.get(trait) || 0
        traitMap.set(trait, currentCount + quantity)
      })
    }
  })

  // Convert map to array and sort by count
  const distribution = Array.from(traitMap.entries())
    .map(([trait, count]) => ({ trait, count }))
    .sort((a, b) => b.count - a.count)

  return distribution
}

function calculateAverageFateCost(
  cards: Record<string, number>,
  allCards: CardWithVersions[]
): number {
  let totalCost = 0
  let totalCards = 0

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.cost !== undefined && card.cost !== null && card.cost !== 'X') {
      totalCost += parseInt(card.cost) * quantity
      totalCards += quantity
    }
  })

  return totalCards > 0 ? totalCost / totalCards : 0
}

function calculateAverageMilitaryPower(
  cards: Record<string, number>,
  allCards: CardWithVersions[]
): number {
  let totalPower = 0
  let totalCards = 0

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (
      card &&
      card.type === 'character' &&
      card.military !== undefined &&
      card.military !== null &&
      card.military !== '-'
    ) {
      totalPower += parseInt(card.military) * quantity
      totalCards += quantity
    }
  })

  return totalCards > 0 ? totalPower / totalCards : 0
}

function calculateAveragePoliticalPower(
  cards: Record<string, number>,
  allCards: CardWithVersions[]
): number {
  let totalPower = 0
  let totalCards = 0

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (
      card &&
      card.type === 'character' &&
      card.political !== undefined &&
      card.political !== null &&
      card.political !== '-'
    ) {
      totalPower += parseInt(card.political) * quantity
      totalCards += quantity
    }
  })

  return totalCards > 0 ? totalPower / totalCards : 0
}

function calculateFateCostDistribution(
  cards: Record<string, number>,
  allCards: CardWithVersions[]
): { cost: string; count: number }[] {
  const costMap = new Map<string, number>()

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.cost !== undefined && card.cost !== null) {
      const cost = card.cost.toString()
      const currentCount = costMap.get(cost) || 0
      costMap.set(cost, currentCount + quantity)
    }
  })

  // Convert map to array and sort by cost
  const distribution = Array.from(costMap.entries())
    .map(([cost, count]) => ({ cost, count }))
    .sort((a, b) => {
      const costA = a.cost === 'X' ? -1 : parseInt(a.cost) || 0
      const costB = b.cost === 'X' ? -1 : parseInt(b.cost) || 0
      return costA - costB
    })

  return distribution
}

function calculateCardTypeDistribution(
  cards: Record<string, number>,
  allCards: CardWithVersions[]
): { id: number; value: number; label: string }[] {
  const typeMap = new Map<string, number>()
  const relevantTypes = ['character', 'event', 'holding', 'attachment']

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && relevantTypes.includes(card.type)) {
      const currentCount = typeMap.get(card.type) || 0
      typeMap.set(card.type, currentCount + quantity)
    }
  })

  // Convert map to array with proper format for PieChart
  const distribution = Array.from(typeMap.entries()).map(([type, count], index) => ({
    id: index,
    value: count,
    label: type.charAt(0).toUpperCase() + type.slice(1) + 's',
  }))

  return distribution
}

function calculateMilitaryPowerDistribution(
  cards: Record<string, number>,
  allCards: CardWithVersions[]
): { power: string; count: number }[] {
  const powerMap = new Map<string, number>()

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.type === 'character') {
      const power = card.military === null || card.military === undefined || card.military === '-' ? '0' : card.military.toString()
      const currentCount = powerMap.get(power) || 0
      powerMap.set(power, currentCount + quantity)
    }
  })

  // Convert map to array and sort by power
  const distribution = Array.from(powerMap.entries())
    .map(([power, count]) => ({ power, count }))
    .sort((a, b) => {
      const powerA = a.power === '-' ? 0 : parseInt(a.power) || 0
      const powerB = b.power === '-' ? 0 : parseInt(b.power) || 0
      return powerA - powerB
    })

  return distribution
}

function calculatePoliticalPowerDistribution(
  cards: Record<string, number>,
  allCards: CardWithVersions[]
): { power: string; count: number }[] {
  const powerMap = new Map<string, number>()

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.type === 'character') {
      const power = card.political === null || card.political === undefined || card.political === '-' ? '0' : card.political.toString()
      const currentCount = powerMap.get(power) || 0
      powerMap.set(power, currentCount + quantity)
    }
  })

  // Convert map to array and sort by power
  const distribution = Array.from(powerMap.entries())
    .map(([power, count]) => ({ power, count }))
    .sort((a, b) => {
      const powerA = a.power === '-' ? 0 : parseInt(a.power) || 0
      const powerB = b.power === '-' ? 0 : parseInt(b.power) || 0
      return powerA - powerB
    })

  return distribution
}

