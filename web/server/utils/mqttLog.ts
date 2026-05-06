export interface MqttLogEntry {
  id: number
  timestamp: string
  topic: string
  severity: number
  confidence: number
  deviceId: string
  status: 'saved' | 'error'
  message: string
}

type MqttLogListener = (entry: MqttLogEntry) => void

const MAX_LOG_ENTRIES = 200
let _counter = 0
const _entries: MqttLogEntry[] = []
const _listeners = new Set<MqttLogListener>()

export function pushMqttLog(entry: Omit<MqttLogEntry, 'id' | 'timestamp'>) {
  const full: MqttLogEntry = {
    ...entry,
    id: ++_counter,
    timestamp: new Date().toISOString()
  }

  _entries.push(full)

  // Keep buffer bounded
  if (_entries.length > MAX_LOG_ENTRIES) {
    _entries.splice(0, _entries.length - MAX_LOG_ENTRIES)
  }

  // Notify all SSE listeners
  for (const listener of _listeners) {
    listener(full)
  }
}

export function getMqttLogHistory(): MqttLogEntry[] {
  return [..._entries]
}

export function subscribeMqttLog(listener: MqttLogListener): () => void {
  _listeners.add(listener)
  return () => _listeners.delete(listener)
}
