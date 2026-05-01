import { useState, useEffect } from 'react'

import Button from '../atoms/Button'
import Textarea from '../atoms/Textarea'

type NoteFormProps = {
  defaultValue?: string
  onSubmit: (note: string) => void
}

export default function NoteForm({
  defaultValue = '',
  onSubmit,
}: NoteFormProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return

    const timer = setTimeout(() => setSaved(false), 2000)

    return () => clearTimeout(timer)
  }, [saved])

  return (
    <form
      className="mt-6 flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()

        const note = new FormData(e.currentTarget).get('note') as string
        onSubmit(note)

        setSaved(true)
      }}
    >
      <Textarea
        id="pokemon-note"
        name="note"
        label="Note"
        rows={4}
        placeholder="Add a note about this Pokémon..."
        defaultValue={defaultValue}
      />

      <Button
        type="submit"
        variant="green"
        className="self-end"
        disabled={saved}
        name="save note"
      >
        {saved ? 'Saved!' : 'Save note'}
      </Button>
    </form>
  )
}
