import GridView from './GridView'
import TableView from './TableView'
import type { ViewProps } from './types'
import type { ViewMode } from '../../molecules/TopBar'

type PokemonListProps = ViewProps & { viewMode: ViewMode }

export default function PokemonList({ viewMode, ...viewProps }: PokemonListProps) {
  if (viewMode === 'grid') return <GridView {...viewProps} />

  return <TableView {...viewProps} />
}
