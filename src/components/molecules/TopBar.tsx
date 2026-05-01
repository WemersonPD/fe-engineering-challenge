import pokeball from '../../assets/pokeball.svg'

export type ViewMode = 'grid' | 'table'

function TopBar() {
  return (
    <div className="flex items-center justify-end gap-4">
      <img src={pokeball} alt="Pokeball" width={24} height={24} />
    </div>
  )
}

export default TopBar
