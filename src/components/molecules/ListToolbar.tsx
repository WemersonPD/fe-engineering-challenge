import { useState } from 'react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'
import Button from '../atoms/Button'

interface ListToolbarProps {
  trigger: ReactNode
  children: (close: () => void) => ReactNode
}

export default function ListToolbar({ trigger, children }: ListToolbarProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <div className="lg:hidden mb-4 shrink-0 flex gap-2">
      {trigger}

      <div className="relative">
        <Button
          variant="gray"
          aria-label="More options"
          onClick={() => setOpen((v) => !v)}
          className="p-0 flex items-center justify-center"
        >
          <EllipsisVerticalIcon className="w-5 h-5" />
        </Button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={close}
              aria-hidden="true"
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-20">
              {children(close)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
