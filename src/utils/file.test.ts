import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exportCSV } from './file'

const mockClick = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
const mockRevokeObjectURL = vi.fn()

const mockAnchor = { click: mockClick, href: '', download: '' }

beforeEach(() => {
  vi.spyOn(document, 'createElement').mockReturnValue(
    mockAnchor as unknown as HTMLAnchorElement,
  )

  vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild)
  vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild)

  vi.stubGlobal('URL', {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('exportCSV', () => {
  it('returns failure when data is empty', () => {
    const result = exportCSV([], 'pokedex')

    expect(result).toEqual({ success: false, error: 'No data to export' })
    expect(mockClick).not.toHaveBeenCalled()
  })

  it('returns success and triggers download when data is provided', () => {
    const data = [{ id: 1, name: 'Bulbasaur', caughtAt: '2026-05-03' }]

    const result = exportCSV(data, 'pokedex')

    expect(result).toEqual({ success: true })
    expect(mockClick).toHaveBeenCalled()
  })

  it('appends and removes the anchor from the DOM', () => {
    const data = [{ id: 1, name: 'Bulbasaur', caughtAt: '2026-05-03' }]

    exportCSV(data, 'pokedex')

    expect(mockAppendChild).toHaveBeenCalled()
    expect(mockRemoveChild).toHaveBeenCalled()
  })

  it('revokes the object URL after download', () => {
    const data = [{ id: 1, name: 'Bulbasaur', caughtAt: '2026-05-03' }]

    exportCSV(data, 'pokedex')

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })

  it('uses data keys as CSV headers', () => {
    const data = [{ id: 1, name: 'Bulbasaur', caughtAt: '2026-05-03' }]
    let capturedBlob: Blob | undefined

    vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
      capturedBlob = blob as Blob
      return 'blob:mock-url'
    })

    exportCSV(data, 'pokedex')

    return capturedBlob!.text().then((csv) => {
      const [headers] = csv.split('\n')
      expect(headers).toBe('id,name,caughtAt')
    })
  })

  it('writes one row per record', () => {
    const data = [
      { id: 1, name: 'Bulbasaur', caughtAt: '2026-05-03' },
      { id: 2, name: 'Ivysaur', caughtAt: '2026-05-04' },
    ]
    let capturedBlob: Blob | undefined

    vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
      capturedBlob = blob as Blob
      return 'blob:mock-url'
    })

    exportCSV(data, 'pokedex')

    return capturedBlob!.text().then((csv) => {
      const lines = csv.split('\n')
      expect(lines).toHaveLength(3)
      expect(lines[1]).toBe('1,Bulbasaur,2026-05-03')
      expect(lines[2]).toBe('2,Ivysaur,2026-05-04')
    })
  })

  it('strips the .csv extension from the filename before adding the timestamp', () => {
    const data = [{ id: 1, name: 'Bulbasaur', caughtAt: '2026-05-03' }]

    exportCSV(data, 'pokedex.csv')
    expect(mockAnchor.download).toMatch(/^pokedex_/)
    expect(mockAnchor.download).toMatch(/\.csv$/)
    expect(mockAnchor.download).not.toMatch(/pokedex\.csv_/)

    exportCSV(data, 'pokedex')
    expect(mockAnchor.download).toMatch(/^pokedex_/)
  })
})
