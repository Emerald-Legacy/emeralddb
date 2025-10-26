import { CardWithVersions } from '@5rdb/api'
import { Box, Grid, Paper, Typography, List, ListItem } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'

interface DeckStatisticsDisplayProps {
  cards: Record<string, number>
  allCards: CardWithVersions[]
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

function calculateAverageFateCostForDeck(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  deckSide: 'dynasty' | 'conflict'
): number {
  let totalCost = 0
  let totalCards = 0

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.side === deckSide && card.cost !== undefined && card.cost !== null && card.cost !== 'X') {
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

function calculateFateCostDistributionForDeck(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  deckSide: 'dynasty' | 'conflict'
): { cost: string; count: number }[] {
  const costMap = new Map<string, number>()

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.side === deckSide && card.cost !== undefined && card.cost !== null) {
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

export function DeckStatisticsDisplay({ cards, allCards }: DeckStatisticsDisplayProps): JSX.Element {
  // Calculate military power distribution
  const militaryPowerDistribution = calculateMilitaryPowerDistribution(cards, allCards)
  const averageMilitaryPower = calculateAverageMilitaryPower(cards, allCards)

  // Calculate political power distribution
  const politicalPowerDistribution = calculatePoliticalPowerDistribution(cards, allCards)
  const averagePoliticalPower = calculateAveragePoliticalPower(cards, allCards)

  // Calculate trait counts
  const traitCounts = calculateTraitCounts(cards, allCards)

  const dynastyFateCost = calculateFateCostDistributionForDeck(cards, allCards, 'dynasty');
  const conflictFateCost = calculateFateCostDistributionForDeck(cards, allCards, 'conflict');

  const averageDynastyFateCost = calculateAverageFateCostForDeck(cards, allCards, 'dynasty');
  const averageConflictFateCost = calculateAverageFateCostForDeck(cards, allCards, 'conflict');

  return (
    <Box p={1}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }} component="div">
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Dynasty Fate Cost <br /> <span style={{ fontSize: '70%' }}>(Avg: {averageDynastyFateCost.toFixed(2)})</span>
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: dynastyFateCost.map((d) => d.cost) }]}
              series={[{ data: dynastyFateCost.map((d) => d.count), valueFormatter: (value) => `${value}`, color: '#1b5e20' }]}
              height={160}
              slots={{ legend: () => null }}
              margin={{ left: 0 }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 6 }} component="div">
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Conflict Fate Cost <br /> <span style={{ fontSize: '70%' }}>(Avg: {averageConflictFateCost.toFixed(2)})</span>
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: conflictFateCost.map((d) => d.cost) }]}
              series={[{ data: conflictFateCost.map((d) => d.count), valueFormatter: (value) => `${value}`, color: '#4CAF50' }]} // Changed color
              height={160}
              slots={{ legend: () => null }}
              margin={{ left: 0 }}
            />
          </Paper>
        </Grid>


        <Grid size={{ xs: 6 }} component="div">
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Military Power <br /> <span style={{ fontSize: '70%' }}>(Avg: {averageMilitaryPower.toFixed(2)})</span>
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
                    color: '#7D2900',
                  },
                ]}
                height={160}
                slots={{ legend: () => null }}
                margin={{ left: 0 }}
              />
            ) : (
              <Typography align="center" color="text.secondary">
                No characters with military power in deck
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 6 }} component="div">
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Political Power <br /> <span style={{ fontSize: '70%' }}>(Avg: {averagePoliticalPower.toFixed(2)})</span>
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
                    color: '#282877',
                  },
                ]}
                height={160}
                slots={{ legend: () => null }}
                margin={{ left: 0 }}
              />
            ) : (
              <Typography align="center" color="text.secondary">
                No characters with political power in deck
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 6 }} component="div">
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