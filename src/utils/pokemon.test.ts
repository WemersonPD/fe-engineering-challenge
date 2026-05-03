import {
  formatHeight,
  formatPokemonId,
  formatPokemonName,
  formatWeight,
} from './pokemon'

describe('Pokemon Utils', () => {
  describe('formatPokemonName', () => {
    it('should format the pokemon name correctly', () => {
      expect(formatPokemonName('pikachu')).toBe('Pikachu')
      expect(formatPokemonName('charizard')).toBe('Charizard')
      expect(formatPokemonName('bulbasaur')).toBe('Bulbasaur')
      expect(formatPokemonName('mr-mime')).toBe('Mr mime')
    })
  })

  describe('formatPokemonId', () => {
    it('should format the pokemon id correctly', () => {
      expect(formatPokemonId(1)).toBe('#0001')
      expect(formatPokemonId(25)).toBe('#0025')
      expect(formatPokemonId(150)).toBe('#0150')
      expect(formatPokemonId(999)).toBe('#0999')
    })
  })

  describe('formatHeight', () => {
    it('should format the pokemon height correctly', () => {
      expect(formatHeight(0.4)).toBe('0.4 m')
      expect(formatHeight(1.7)).toBe('1.7 m')
      expect(formatHeight(2.0)).toBe('2 m')
    })
  })

  describe('formatWeight', () => {
    it('should format the pokemon weight correctly', () => {
      expect(formatWeight(6.0)).toBe('6 kg')
      expect(formatWeight(90.5)).toBe('90.5 kg')
      expect(formatWeight(120.0)).toBe('120 kg')
    })
  })
})
