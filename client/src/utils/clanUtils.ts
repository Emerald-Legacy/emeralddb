export const factions: { id: string; name: string; color: string }[] = [
  { id: 'crab', name: 'Crab', color: '#163078' },
  { id: 'crane', name: 'Crane', color: '#44c2bc' },
  { id: 'dragon', name: 'Dragon', color: '#1d6922' },
  { id: 'lion', name: 'Lion', color: '#dece23' },
  { id: 'phoenix', name: 'Phoenix', color: '#de9923' },
  { id: 'scorpion', name: 'Scorpion', color: '#ab1916' },
  { id: 'unicorn', name: 'Unicorn', color: '#90119e' },
]

export function getColorForFactionId(id: string): string | undefined {
  return factions.find((faction) => faction.id === id)?.color
}
