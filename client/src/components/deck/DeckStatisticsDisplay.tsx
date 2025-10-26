import { CardWithVersions, Pack } from '@5rdb/api'
import { Box, Grid, Paper, Typography, List, ListItem } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'

interface DeckStatisticsDisplayProps {
  cards: Record<string, number>
  allCards: CardWithVersions[]
  allPacks: Pack[]
}

function calculateRequiredPacks(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  allPacks: Pack[]
): { packName: string; count: number }[] {
  const packCountMap = new Map<string, number>(); // Map<packId, count>

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId);
    if (card) {
      if (card.versions && card.versions.length > 0) {
        const packId = card.versions[0].pack_id; // Get packId from the first version
        const currentCount = packCountMap.get(packId) || 0;
        packCountMap.set(packId, currentCount + quantity);
      }
    }
  });

  const requiredPacks: { packName: string; count: number }[] = [];
  packCountMap.forEach((count, packId) => {
    const pack = allPacks.find((p) => p.id === packId);
    if (pack) {
      requiredPacks.push({ packName: pack.name, count });
    }
  });

  requiredPacks.sort((a, b) => a.packName.localeCompare(b.packName));

  return requiredPacks;
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
    if (card && card.side === deckSide && card.cost !== undefined && card.cost !== null) {
      const cost = card.cost === 'X' ? 0 : parseInt(card.cost)
      totalCost += cost * quantity
      totalCards += quantity
    }
  })

  return totalCards > 0 ? totalCost / totalCards : 0
}

function calculatePowerDistribution(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  powerType: 'military' | 'political'
): { power: string; count: number }[] {
  const powerMap = new Map<string, number>()

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.type === 'character') {
      const power = card[powerType] === null || card[powerType] === undefined || card[powerType] === '-' ? '0' : card[powerType]!.toString()
      const currentCount = powerMap.get(power) || 0
      powerMap.set(power, currentCount + quantity)
    }
  })

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
      const cost = card.cost === 'X' ? '0' : card.cost.toString()
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

function calculateAveragePower(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  powerType: 'military' | 'political'
): number {
  let totalPower = 0
  let totalCards = 0

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (
      card &&
      card.type === 'character' &&
      card[powerType] !== undefined &&
      card[powerType] !== null &&
      card[powerType] !== '-'
    ) {
      totalPower += parseInt(card[powerType] as string) * quantity
      totalCards += quantity
    }
  })

  return totalCards > 0 ? totalPower / totalCards : 0
}

interface StatisticChartCardProps {
  title: string
  averageValue: number
  data: { value: string | number; count: number }[]
  dataKey: string
  color: string
  noDataMessage: string
}

function StatisticChartCard({
  title,
  averageValue,
  data,
  dataKey,
  color,
  noDataMessage,
}: StatisticChartCardProps): JSX.Element {
  return (
    <Grid size={{ xs: 6 }} component="div">
      <Paper elevation={2} sx={{ p: 1 }}>
        <Typography variant="h6" gutterBottom align="center">
          {title} <br /> <span style={{ fontSize: '70%' }}>(Avg: {averageValue.toFixed(2)})</span>
        </Typography>
        {data.length > 0 ? (
          <BarChart
            xAxis={[{ scaleType: 'band', data: data.map((d) => d[dataKey]) }]}
            series={[{ data: data.map((d) => d.count), valueFormatter: (value) => `${value}`, color: color }]}
            height={160}
            slots={{ legend: () => null }}
            margin={{ left: 0 }}
          />
        ) : (
          <Typography align="center" color="text.secondary">
            {noDataMessage}
          </Typography>
        )}
      </Paper>
    </Grid>
  )
}

export function DeckStatisticsDisplay({ cards, allCards, allPacks }: DeckStatisticsDisplayProps): JSX.Element {
  // Calculate military power distribution
  const militaryPowerDistribution = calculatePowerDistribution(cards, allCards, 'military')
  const averageMilitaryPower = calculateAveragePower(cards, allCards, 'military')

  // Calculate political power distribution
  const politicalPowerDistribution = calculatePowerDistribution(cards, allCards, 'political')
  const averagePoliticalPower = calculateAveragePower(cards, allCards, 'political')

  // Calculate trait counts
  const traitCounts = calculateTraitCounts(cards, allCards)

  const dynastyFateCost = calculateFateCostDistributionForDeck(cards, allCards, 'dynasty');
  const conflictFateCost = calculateFateCostDistributionForDeck(cards, allCards, 'conflict');

  const averageDynastyFateCost = calculateAverageFateCostForDeck(cards, allCards, 'dynasty');
  const averageConflictFateCost = calculateAverageFateCostForDeck(cards, allCards, 'conflict');

  const requiredPacks = calculateRequiredPacks(cards, allCards, allPacks);

  return (
    <Box p={1}>
      <Grid container spacing={2}>
        <StatisticChartCard
          title="Dynasty Fate Cost"
          averageValue={averageDynastyFateCost}
          data={dynastyFateCost}
          dataKey="cost"
          color="#1b5e20"
          noDataMessage="No dynasty cards with fate cost in deck"
        />
        <StatisticChartCard
          title="Conflict Fate Cost"
          averageValue={averageConflictFateCost}
          data={conflictFateCost}
          dataKey="cost"
          color="#4CAF50"
          noDataMessage="No conflict cards with fate cost in deck"
        />
        <StatisticChartCard
          title="Military Power"
          averageValue={averageMilitaryPower}
          data={militaryPowerDistribution}
          dataKey="power"
          color="#7D2900"
          noDataMessage="No characters with military power in deck"
        />
        <StatisticChartCard
          title="Political Power"
          averageValue={averagePoliticalPower}
          data={politicalPowerDistribution}
          dataKey="power"
          color="#282877"
          noDataMessage="No characters with political power in deck"
        />
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
        <Grid size={{ xs: 6 }} component="div">
          <Paper elevation={2} sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Required Packs
            </Typography>
            <List dense>
              {requiredPacks.map(({ packName, count }) => (
                <ListItem key={packName} sx={{ py: 0 }}>
                  <strong>{packName}</strong>: {count}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}