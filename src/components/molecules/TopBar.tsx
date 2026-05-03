import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'
import pokeball from '../../assets/pokeball.svg'
import Button from '../atoms/Button'

export type ViewMode = 'grid' | 'table'

type TopBarProps = {
  onExport: () => void
  onImport: (file: File) => void
}

function TopBar({ onExport, onImport }: TopBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      <img src={pokeball} alt="Pokeball" width={24} height={24} />

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="gray"
          className="flex items-center gap-1.5"
          onClick={() => fileInputRef.current?.click()}
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Import Pokédex
        </Button>
        <Button
          variant="gray"
          className="flex items-center gap-1.5"
          onClick={onExport}
        >
          <ArrowUpTrayIcon className="w-4 h-4" />
          Export Pokédex
        </Button>
      </div>
    </div>
  )
}

export default TopBar
