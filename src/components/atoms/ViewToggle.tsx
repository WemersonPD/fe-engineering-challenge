import type { ReactNode } from 'react'

interface ToggleOption<T extends string> {
  value: T
  label: string
  icon: ReactNode
}

interface ViewToggleProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: ToggleOption<T>[]
}

function ViewToggle<T extends string>({ value, onChange, options }: ViewToggleProps<T>) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          aria-label={opt.label}
          aria-pressed={value === opt.value}
          className={`p-1.5 rounded-md text-sm transition-colors ${
            value === opt.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  )
}

export default ViewToggle
