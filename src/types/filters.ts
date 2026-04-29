export interface Filters {
  name: string
  types: string[]
  minHeight: number
  maxHeight: number
  caughtOnly: boolean
  caughtAfter: string
  caughtBefore: string
}

export type SortField = 'id' | 'name' | 'height' | 'types' | 'timestamp'
export type SortOrder = 'asc' | 'desc'

export interface Sort {
  field: SortField
  order: SortOrder
}
