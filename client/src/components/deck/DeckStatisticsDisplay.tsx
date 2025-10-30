import { CardWithVersions, Pack, Trait, CardInPack } from '@5rdb/api'
import { Box, Grid, Paper, Typography, List, ListItem } from '@mui/material'
import { useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { StatisticChartCard } from './StatisticChartCard'
import { useUiStore } from '../../providers/UiStoreProvider'

interface DeckStatisticsDisplayProps {
  cards: Record<string, number>
  allCards: CardWithVersions[]
  allPacks: Pack[]
  format: string
}

function calculateRequiredPacks(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  allPacks: Pack[],
  format: string,
  validCardVersionForFormat: (cardId: string, format: string) => Omit<CardInPack, "card_id"> | undefined
): { packName: string; count: number }[] {
  const packCountMap = new Map<string, number>(); // Map<packId, count>

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId);
    if (card) {
      const validVersion = validCardVersionForFormat(card.id, format);
      if (validVersion) {
        const packId = validVersion.pack_id;
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

function calculateDynastyTraitCounts(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  allTraits: Trait[]
): { trait: string; count: number }[] {
  const traitMap = new Map<string, number>()

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.side === 'dynasty' && card.traits) {
      card.traits.forEach((trait) => {
        const currentCount = traitMap.get(trait) || 0
        traitMap.set(trait, currentCount + quantity)
      })
    }
  })

  // Convert map to array and sort by count
  const distribution = Array.from(traitMap.entries())
    .map(([traitId, count]) => ({
      trait: allTraits.find((t) => t.id === traitId)?.name || traitId,
      count,
    }))
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
): { value: string; count: number }[] {
  const powerMap = new Map<string, number>()
  let maxPower = 0

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.type === 'character') {
      const power = card[powerType] === null || card[powerType] === undefined || card[powerType] === '-' ? 0 : parseInt(card[powerType]!.toString())
      powerMap.set(power.toString(), (powerMap.get(power.toString()) || 0) + quantity)
      if (power > maxPower) {
        maxPower = power
      }
    }
  })

  const distribution: { value: string; count: number }[] = []
  for (let i = 0; i <= maxPower; i++) {
    distribution.push({ value: i.toString(), count: powerMap.get(i.toString()) || 0 })
  }

  return distribution
}

function calculateFateCostDistributionForDeck(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  deckSide: 'dynasty' | 'conflict'
): { value: string; count: number }[] {
  const costMap = new Map<string, number>()
  let maxCost = 0

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.side === deckSide && card.cost !== undefined && card.cost !== null) {
      const cost = card.cost === 'X' ? 0 : parseInt(card.cost)
      costMap.set(cost.toString(), (costMap.get(cost.toString()) || 0) + quantity)
      if (cost > maxCost) {
        maxCost = cost
      }
    }
  })

  const distribution: { value: string; count: number }[] = []
  for (let i = 0; i <= maxCost; i++) {
    distribution.push({ value: i.toString(), count: costMap.get(i.toString()) || 0 })
  }

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

function calculateConflictTraitCounts(
  cards: Record<string, number>,
  allCards: CardWithVersions[],
  allTraits: Trait[]
): { trait: string; count: number }[] {
  const traitMap = new Map<string, number>()

  Object.entries(cards).forEach(([cardId, quantity]) => {
    const card = allCards.find((c) => c.id === cardId)
    if (card && card.side === 'conflict' && card.traits) {
      card.traits.forEach((trait) => {
        const currentCount = traitMap.get(trait) || 0
        traitMap.set(trait, currentCount + quantity)
      })
    }
  })

  const distribution = Array.from(traitMap.entries())
    .map(([traitId, count]) => ({
      trait: allTraits.find((t) => t.id === traitId)?.name || traitId,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  return distribution
}

export function DeckStatisticsDisplay({ cards, allCards, allPacks, format }: DeckStatisticsDisplayProps): JSX.Element {
  const { traits, validCardVersionForFormat } = useUiStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isConflictTraitsExpanded, setIsConflictTraitsExpanded] = useState(false)

  // Calculate military power distribution
  const militaryPowerDistribution = calculatePowerDistribution(cards, allCards, 'military')
  const averageMilitaryPower = calculateAveragePower(cards, allCards, 'military')

  // Calculate political power distribution
  const politicalPowerDistribution = calculatePowerDistribution(cards, allCards, 'political')
  const averagePoliticalPower = calculateAveragePower(cards, allCards, 'political')

  // Calculate trait counts
  const dynastyTraitCounts = calculateDynastyTraitCounts(cards, allCards, traits)
  const conflictTraitCounts = calculateConflictTraitCounts(cards, allCards, traits)

  const dynastyFateCost = calculateFateCostDistributionForDeck(cards, allCards, 'dynasty');
  const conflictFateCost = calculateFateCostDistributionForDeck(cards, allCards, 'conflict');

  const averageDynastyFateCost = calculateAverageFateCostForDeck(cards, allCards, 'dynasty');
  const averageConflictFateCost = calculateAverageFateCostForDeck(cards, allCards, 'conflict');

  const requiredPacks = calculateRequiredPacks(cards, allCards, allPacks, format, validCardVersionForFormat);

  return (
    <Box p={1}>
      <Grid container spacing={2} alignItems="stretch">
        <StatisticChartCard
          title="Dynasty Fate Cost"
          averageValue={averageDynastyFateCost}
          data={dynastyFateCost}
          dataKey="value"
          color="#1b5e20"
          noDataMessage="No dynasty cards with fate cost in deck"
        />
        <StatisticChartCard
          title="Conflict Fate Cost"
          averageValue={averageConflictFateCost}
          data={conflictFateCost}
          dataKey="value"
          color="#4CAF50"
          noDataMessage="No conflict cards with fate cost in deck"
        />
        <StatisticChartCard
          title="Military Power"
          averageValue={averageMilitaryPower}
          data={militaryPowerDistribution}
          dataKey="value"
          color="#7D2900"
          noDataMessage="No characters with military power in deck"
        />
        <StatisticChartCard
          title="Political Power"
          averageValue={averagePoliticalPower}
          data={politicalPowerDistribution}
          dataKey="value"
          color="#282877"
          noDataMessage="No characters with political power in deck"
        />
        <Grid size={{ xs: 6 }} component="div">
          <Paper elevation={2} sx={{ p: 1, minHeight: '192px' }}>
            <Typography variant="h6" gutterBottom align="center">
              {isExpanded ? 'All Dynasty Traits' : 'Top 5 Dynasty Traits'}
            </Typography>
            <List dense>
              {(isExpanded ? dynastyTraitCounts : dynastyTraitCounts.slice(0, 5)).map(({ trait, count }) => (
                <ListItem key={trait} sx={{ py: 0 }}>
                  <strong>{trait}</strong>: {count}
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {dynastyTraitCounts.length > 5 && !isExpanded && (
                <Typography
                  variant="body2"
                  color="primary"
                  onClick={() => setIsExpanded(true)}
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Expand Traits
                </Typography>
              )}
              {isExpanded && (
                <Typography
                  variant="body2"
                  color="primary"
                  onClick={() => setIsExpanded(false)}
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Collapse Traits
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6 }} component="div">
          <Paper elevation={2} sx={{ p: 1, minHeight: '192px' }}>
            <Typography variant="h6" gutterBottom align="center">
              {isConflictTraitsExpanded ? 'All Conflict Traits' : 'Top 5 Conflict Traits'}
            </Typography>
            <List dense>
              {(isConflictTraitsExpanded ? conflictTraitCounts : conflictTraitCounts.slice(0, 5)).map(({ trait, count }) => (
                <ListItem key={trait} sx={{ py: 0 }}>
                  <strong>{trait}</strong>: {count}
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {conflictTraitCounts.length > 5 && !isConflictTraitsExpanded && (
                <Typography
                  variant="body2"
                  color="primary"
                  onClick={() => setIsConflictTraitsExpanded(true)}
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Expand Conflict Traits
                </Typography>
              )}
              {isConflictTraitsExpanded && (
                <Typography
                  variant="body2"
                  color="primary"
                  onClick={() => setIsConflictTraitsExpanded(false)}
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Collapse Conflict Traits
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid size={12} component="div">
          <Paper elevation={2} sx={{ p: 1, minHeight: '192px' }}>
            <Typography variant="h6" gutterBottom align="center">
              Required Packs
            </Typography>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {requiredPacks.map(({ packName }) => (
                <li key={packName}>
                  <strong>{packName}</strong>
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}