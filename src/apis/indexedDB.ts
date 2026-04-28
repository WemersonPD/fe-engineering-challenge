const DB_NAME = 'pokedex'
const DB_VERSION = 2
export const CAUGHT_STORE = 'caught'
export const POKEMON_STORE = 'pokemon'

let instance: Promise<IDBDatabase> | null = null

export function getIndexedDB(): Promise<IDBDatabase> {
  if (!instance) {
    instance = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(CAUGHT_STORE)) {
          const store = db.createObjectStore(CAUGHT_STORE, { keyPath: 'id' })
          store.createIndex('name', 'name', { unique: true })
          store.createIndex('caughtAt', 'caughtAt', { unique: false })
        }

        if (!db.objectStoreNames.contains(POKEMON_STORE)) {
          const store = db.createObjectStore(POKEMON_STORE, { keyPath: 'id' })
          store.createIndex('name', 'name', { unique: true })
          store.createIndex('types', 'types', { multiEntry: true })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        instance = null
        reject(request.error)
      }
    })
  }
  return instance
}

export function tx(
  db: IDBDatabase,
  store: string,
  mode: IDBTransactionMode,
): IDBObjectStore {
  return db.transaction(store, mode).objectStore(store)
}

export function wrap<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
