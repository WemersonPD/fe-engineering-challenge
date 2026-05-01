import { Routes, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import PokemonDetails from './components/pages/PokemonDetails'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:id" element={<PokemonDetails />} />
    </Routes>
  )
}
