import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sharePokemon } from './share'

const ORIGIN = 'http://localhost:3000'
const POKEMON_URL = `${ORIGIN}/pokemon/1`

beforeEach(() => {
  vi.stubGlobal('location', { origin: ORIGIN })
  vi.stubGlobal('navigator', {
    share: vi.fn(),
    clipboard: { writeText: vi.fn() },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('sharePokemon', () => {
  it('succeeds using navigator.share', async () => {
    vi.mocked(navigator.share).mockResolvedValue(undefined)

    await sharePokemon(1, 'Bulbasaur')

    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Bulbasaur',
      text: '\nI am sharing Bulbasaur with you! Check it out:',
      url: POKEMON_URL,
    })
  })

  it('falls back to clipboard and returns success', async () => {
    vi.mocked(navigator.share).mockRejectedValue(new Error('share failed'))
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined)

    const result = await sharePokemon(1, 'Bulbasaur')

    expect(result).toEqual({ success: true, message: '' })
  })

  it('returns failure with the error message', async () => {
    vi.mocked(navigator.share).mockRejectedValue(new Error('share failed'))
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
      new Error('clipboard denied'),
    )

    const result = await sharePokemon(1, 'Bulbasaur')

    expect(result).toEqual({ success: false, message: 'clipboard denied' })
  })

  it('returns a generic message when the clipboard error is not an Error instance', async () => {
    vi.mocked(navigator.share).mockRejectedValue(new Error('share failed'))
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue('unknown')

    const result = await sharePokemon(1, 'Bulbasaur')

    expect(result).toEqual({ success: false, message: 'Failed to share' })
  })
})
