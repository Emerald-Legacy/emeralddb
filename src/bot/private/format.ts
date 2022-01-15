const list = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' })

export function listAlternatives(alternatives: string[]): string {
  return list.format(alternatives)
}
