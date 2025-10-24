import { CardWithVersions } from '@5rdb/api'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'

interface DeckStatisticsProps {
  cards: Record<string, number>
  allCards: CardWithVersions[]
}

export function DeckStatistics({ cards, allCards }: DeckStatisticsProps): JSX.Element {
  // Calculate fate cost distribution
  const fateCostDistribution = calculateFateCostDistribution(cards, allCards)

  // Calculate card type distribution
  const cardTypeDistribution = calculateCardTypeDistribution(cards, allCards)

  // Calculate military power distribution
  const militaryPowerDistribution = calculateMilitaryPowerDistribution(cards, allCards)

  // Calculate political power distribution
  const politicalPowerDistribution = calculatePoliticalPowerDistribution(cards, allCards)

  return (
    <Box p={1}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Fate Cost Distribution
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
              Military Power Distribution
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
              Political Power Distribution
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
      </Grid>
    </Box>
  )
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

