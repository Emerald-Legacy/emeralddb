/**
 * Intl.ListFormat is not part of TS type definitions for Node because the spec is not finalized.
 * At the time of this commit, the spec is a Draft 3; unlikely to see any further changes.
 * It is already incorporated and working on Node 16
 */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-namespace */
declare namespace Intl {
  class ListFormat {
    constructor(
      locales: string | string[],
      options?: Partial<
        | {
            localeMatcher: 'lookup' | 'best fit'
            style: 'long'
            type: 'conjunction' | 'disjunction' | 'unit'
          }
        | {
            localeMatcher: 'lookup' | 'best fit'
            style: 'short' | 'narrow'
            type: 'unit'
          }
      >
    )

    public format: (items: string[]) => string
  }
}
