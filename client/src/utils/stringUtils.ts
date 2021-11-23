export function capitalize(input: string): string {
  return input ? input.charAt(0).toUpperCase() + input.slice(1) : ''
}
