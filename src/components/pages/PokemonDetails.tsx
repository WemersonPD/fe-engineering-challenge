import { useParams } from 'react-router-dom'

export default function PokemonDetails() {
  const { id } = useParams<{ id: string }>()

  return <div>Pokemon Details — ID: {id}</div>
}
