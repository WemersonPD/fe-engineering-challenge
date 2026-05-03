import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tx, wrap } from './indexedDB'

describe('indexedDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
