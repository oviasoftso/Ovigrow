import { openDB, type IDBPDatabase, type DBSchema } from 'idb'

const DB_NAME = 'ovigrow-offline'
const DB_VERSION = 1

interface OfflineDB extends DBSchema {
  chatMessages: {
    key: string
    value: {
      id: string
      role: 'user' | 'assistant'
      content: string
      timestamp: number
      model?: string
    }
    indexes: { 'by-timestamp': number }
  }
  syncQueue: {
    key: string
    value: {
      id: string
      action: 'create' | 'update' | 'delete'
      store: string
      data: unknown
      timestamp: number
      retries: number
    }
    indexes: { 'by-timestamp': number }
  }
  cache: {
    key: string
    value: {
      key: string
      data: unknown
      timestamp: number
      ttl: number
    }
  }
}

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Chat messages store
        if (!db.objectStoreNames.contains('chatMessages')) {
          const chatStore = db.createObjectStore('chatMessages', { keyPath: 'id' })
          chatStore.createIndex('by-timestamp', 'timestamp')
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' })
          syncStore.createIndex('by-timestamp', 'timestamp')
        }

        // Generic cache store
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' })
        }
      },
    })
  }
  return dbPromise
}

// Chat message operations
export async function saveChatMessage(msg: { id: string; role: 'user' | 'assistant'; content: string; model?: string }) {
  const db = await getDB()
  await db.put('chatMessages', { ...msg, timestamp: Date.now() })
}

export async function getChatMessages(): Promise<Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: number; model?: string }>> {
  const db = await getDB()
  return db.getAllFromIndex('chatMessages', 'by-timestamp')
}

export async function clearChatMessages() {
  const db = await getDB()
  await db.clear('chatMessages')
}

// Sync queue operations
export async function addToSyncQueue(action: 'create' | 'update' | 'delete', store: string, data: unknown) {
  const db = await getDB()
  const id = `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  await db.put('syncQueue', { id, action, store, data, timestamp: Date.now(), retries: 0 })
}

export async function getSyncQueue() {
  const db = await getDB()
  return db.getAll('syncQueue')
}

export async function removeSyncItem(id: string) {
  const db = await getDB()
  await db.delete('syncQueue', id)
}

export async function clearSyncQueue() {
  const db = await getDB()
  await db.clear('syncQueue')
}

// Cache operations
export async function getCached(key: string): Promise<unknown | null> {
  const db = await getDB()
  const entry = await db.get('cache', key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > entry.ttl) {
    await db.delete('cache', key)
    return null
  }
  return entry.data
}

export async function setCache(key: string, data: unknown, ttl: number) {
  const db = await getDB()
  await db.put('cache', { key, data, timestamp: Date.now(), ttl })
}

export async function clearCache() {
  const db = await getDB()
  await db.clear('cache')
}

// Online/offline detection
export function setupOnlineDetection(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  const handleOnline = () => onOnline()
  const handleOffline = () => onOffline()

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

export function isOnline(): boolean {
  return navigator.onLine
}

// Process sync queue when back online
export async function processSyncQueue() {
  const queue = await getSyncQueue()
  if (queue.length === 0) return

  // In a real app, this would sync with Supabase
  // For now, we just clear the queue since data is local
  for (const item of queue) {
    try {
      // Sync logic would go here
      await removeSyncItem(item.id)
    } catch {
      // Keep in queue for retry
      if (item.retries >= 3) {
        await removeSyncItem(item.id)
      }
    }
  }
}
