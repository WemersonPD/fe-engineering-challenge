import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tx, wrap } from './indexedDB'

describe('indexedDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getIndexedDB', () => {
    let mockStore: { createIndex: ReturnType<typeof vi.fn> }
    let mockDb: {
      objectStoreNames: { contains: ReturnType<typeof vi.fn> }
      createObjectStore: ReturnType<typeof vi.fn>
    }
    let mockRequest: {
      result: unknown
      error: unknown
      onsuccess: (() => void) | null
      onerror: (() => void) | null
      onupgradeneeded: ((event: unknown) => void) | null
    }

    beforeEach(() => {
      vi.resetModules()

      mockStore = { createIndex: vi.fn() }
      mockDb = {
        objectStoreNames: { contains: vi.fn().mockReturnValue(false) },
        createObjectStore: vi.fn().mockReturnValue(mockStore),
      }
      mockRequest = {
        result: mockDb,
        error: null,
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
      }

      vi.stubGlobal('indexedDB', {
        open: vi.fn().mockReturnValue(mockRequest),
      })
    })

    it('resolves with the IDBDatabase on success', async () => {
      const { getIndexedDB } = await import('./indexedDB')

      const promise = getIndexedDB()
      mockRequest.onsuccess?.()

      await expect(promise).resolves.toBe(mockDb)
    })

    it('returns the same promise instance on subsequent calls', async () => {
      const { getIndexedDB } = await import('./indexedDB')

      const promise1 = getIndexedDB()
      const promise2 = getIndexedDB()

      expect(promise1).toBe(promise2)

      mockRequest.onsuccess?.()
      await promise1
    })

    it('rejects with the request error on failure', async () => {
      const { getIndexedDB } = await import('./indexedDB')

      const error = new DOMException('Failed to open')
      mockRequest.error = error

      const promise = getIndexedDB()
      mockRequest.onerror?.()

      await expect(promise).rejects.toBe(error)
    })

    it('resets instance to null on error so the next call retries', async () => {
      const { getIndexedDB } = await import('./indexedDB')

      mockRequest.error = new DOMException('Failed to open')

      const promise1 = getIndexedDB()
      mockRequest.onerror?.()
      await promise1.catch(() => {})

      const promise2 = getIndexedDB()
      expect(promise2).not.toBe(promise1)
    })

    describe('onupgradeneeded', () => {
      it('creates both stores when neither exists', async () => {
        mockDb.objectStoreNames.contains.mockReturnValue(false)

        const { getIndexedDB } = await import('./indexedDB')

        const promise = getIndexedDB()
        mockRequest.onupgradeneeded?.({ target: mockRequest })
        mockRequest.onsuccess?.()
        await promise

        expect(mockDb.createObjectStore).toHaveBeenCalledWith('caught', {
          keyPath: 'id',
        })
        expect(mockDb.createObjectStore).toHaveBeenCalledWith('pokemon', {
          keyPath: 'id',
        })
      })

      it('does not recreate stores that already exist', async () => {
        mockDb.objectStoreNames.contains.mockReturnValue(true)

        const { getIndexedDB } = await import('./indexedDB')

        const promise = getIndexedDB()
        mockRequest.onupgradeneeded?.({ target: mockRequest })
        mockRequest.onsuccess?.()
        await promise

        expect(mockDb.createObjectStore).not.toHaveBeenCalled()
      })

      it('creates correct indices for the caught store', async () => {
        const caughtStoreMock = { createIndex: vi.fn() }
        mockDb.objectStoreNames.contains.mockImplementation(
          (name: string) => name !== 'caught',
        )
        mockDb.createObjectStore.mockImplementation((name: string) =>
          name === 'caught' ? caughtStoreMock : mockStore,
        )

        const { getIndexedDB } = await import('./indexedDB')

        const promise = getIndexedDB()
        mockRequest.onupgradeneeded?.({ target: mockRequest })
        mockRequest.onsuccess?.()
        await promise

        expect(caughtStoreMock.createIndex).toHaveBeenCalledWith(
          'name',
          'name',
          { unique: true },
        )
        expect(caughtStoreMock.createIndex).toHaveBeenCalledWith(
          'caughtAt',
          'caughtAt',
          { unique: false },
        )
      })

      it('creates correct indices for the pokemon store', async () => {
        const pokemonStoreMock = { createIndex: vi.fn() }
        mockDb.objectStoreNames.contains.mockImplementation(
          (name: string) => name !== 'pokemon',
        )
        mockDb.createObjectStore.mockImplementation((name: string) =>
          name === 'pokemon' ? pokemonStoreMock : mockStore,
        )

        const { getIndexedDB } = await import('./indexedDB')

        const promise = getIndexedDB()
        mockRequest.onupgradeneeded?.({ target: mockRequest })
        mockRequest.onsuccess?.()
        await promise

        expect(pokemonStoreMock.createIndex).toHaveBeenCalledWith(
          'name',
          'name',
          { unique: true },
        )
        expect(pokemonStoreMock.createIndex).toHaveBeenCalledWith(
          'types',
          'types',
          { multiEntry: true },
        )
      })
    })
  })

  describe('wrap', () => {
    it('resolves with request.result on success', async () => {
      const mockResult = { id: 1 }
      const mockRequest = { result: mockResult } as unknown as IDBRequest

      const promise = wrap(mockRequest)
      mockRequest.onsuccess!(new Event('success'))

      await expect(promise).resolves.toBe(mockResult)
    })

    it('rejects with request.error on error', async () => {
      const mockError = new DOMException('DB error')
      const mockRequest = { error: mockError } as unknown as IDBRequest

      const promise = wrap(mockRequest)
      mockRequest.onerror!(new Event('error'))

      await expect(promise).rejects.toBe(mockError)
    })
  })

  describe('tx', () => {
    it('returns the object store from a transaction', () => {
      const mockStore = {} as IDBObjectStore
      const mockTransaction = {
        objectStore: vi.fn().mockReturnValueOnce(mockStore),
      } as unknown as IDBTransaction
      const mockDB = {
        transaction: vi.fn().mockReturnValueOnce(mockTransaction),
      } as unknown as IDBDatabase

      const result = tx(mockDB, 'pokemon', 'readonly')

      expect(mockDB.transaction).toHaveBeenCalledWith('pokemon', 'readonly')
      expect(mockTransaction.objectStore).toHaveBeenCalledWith('pokemon')
      expect(result).toBe(mockStore)
    })
  })
})
