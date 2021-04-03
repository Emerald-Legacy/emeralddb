export const clans: { clanId: string; name: string; color: string }[] = [
  { clanId: 'crab', name: 'Crab', color: '#163078' },
  { clanId: 'crane', name: 'Crane', color: '#44c2bc' },
  { clanId: 'dragon', name: 'Dragon', color: '#1d6922' },
  { clanId: 'lion', name: 'Lion', color: '#dece23' },
  { clanId: 'phoenix', name: 'Phoenix', color: '#de9923' },
  { clanId: 'scorpion', name: 'Scorpion', color: '#ab1916' },
  { clanId: 'unicorn', name: 'Unicorn', color: '#90119e' },
]

export function getClanForId(id?: string): string | undefined {
  let value
  if (id) {
    value = clans.find((clan) => clan.clanId === id)?.name
  }
  return value || ''
}
