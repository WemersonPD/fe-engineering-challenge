import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import pokeball from '../../assets/pokeball.svg'
import Button from '../atoms/Button'

export type ViewMode = 'grid' | 'table'

type TopBarProps = {
  onExport: () => void
}

function TopBar({ onExport }: TopBarProps) {
  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      <img src={pokeball} alt="Pokeball" width={24} height={24} />

      <Button
        variant="gray"
        className="flex items-center gap-1.5"
        onClick={onExport}
      >
        <ArrowDownTrayIcon className="w-4 h-4" />
        Export Pokédex
      </Button>
    </div>
  )
}

export default TopBar
