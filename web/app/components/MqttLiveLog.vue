<template>
  <div class="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-lg">
    <!-- Header Bar -->
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80">
      <div class="flex items-center gap-3">
        <div class="relative flex items-center justify-center">
          <span
            class="absolute inline-flex h-3.5 w-3.5 rounded-full opacity-60 animate-pulse-ring"
            :class="connected ? 'bg-emerald-400' : 'bg-red-400'"
          />
          <span
            class="relative inline-flex h-2.5 w-2.5 rounded-full"
            :class="connected ? 'bg-emerald-500' : 'bg-red-500'"
          />
        </div>
        <UIcon name="i-lucide-radio-tower" class="w-5 h-5 text-slate-400 dark:text-slate-500" />
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          MQTT Live Feed
        </h3>
        <UBadge
          :color="connected ? 'success' : 'error'"
          variant="subtle"
          size="xs"
        >
          {{ connected ? 'Connected' : 'Disconnected' }}
        </UBadge>
      </div>

      <div class="flex items-center gap-2">
        <UBadge color="neutral" variant="subtle" size="xs">
          {{ entries.length }} {{ entries.length === 1 ? 'message' : 'messages' }}
        </UBadge>
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="entries.length === 0"
          @click="clearLog"
        />
        <UButton
          :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="expanded = !expanded"
        />
      </div>
    </div>

    <!-- Log Body -->
    <div
      ref="logContainer"
      class="overflow-y-auto px-1 py-2 transition-all duration-300 ease-in-out scrollbar-thin"
      :class="expanded ? 'h-[520px]' : 'h-[260px]'"
    >
      <div v-if="entries.length === 0" class="flex flex-col items-center justify-center h-full select-none">
        <UIcon name="i-lucide-satellite-dish" class="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
        <p class="text-sm text-slate-400 dark:text-slate-500 font-medium">
          Waiting for MQTT messages…
        </p>
      </div>

      <TransitionGroup name="log-entry" tag="div" class="flex flex-col gap-0.5">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="flex items-center gap-2.5 px-4 py-1.5 rounded-lg text-xs font-mono transition-colors duration-150"
          :class="entry.status === 'error'
            ? 'bg-red-50/60 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/30'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'"
        >
          <!-- Timestamp -->
          <span class="text-slate-400 dark:text-slate-500 shrink-0 tabular-nums">{{ formatTime(entry.timestamp) }}</span>

          <!-- Status indicator -->
          <span
            class="shrink-0"
            :class="entry.status === 'error' ? 'text-red-500' : 'text-emerald-500'"
          >
            <UIcon
              :name="entry.status === 'error' ? 'i-lucide-circle-x' : 'i-lucide-circle-check'"
              class="w-3.5 h-3.5"
            />
          </span>

          <!-- Severity badge -->
          <UBadge
            :color="severityColor(entry.severity)"
            variant="subtle"
            size="xs"
            class="font-mono shrink-0"
          >
            SEV {{ entry.severity }}
          </UBadge>

          <!-- Topic -->
          <span
            class="text-primary-600 dark:text-primary-400 shrink-0 max-w-[160px] truncate"
            :title="entry.topic"
          >
            {{ shortenTopic(entry.topic) }}
          </span>

          <!-- Message -->
          <span class="text-slate-600 dark:text-slate-400 truncate">{{ entry.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MqttLogEntry {
  id: number
  timestamp: string
  topic: string
  severity: number
  confidence: number
  deviceId: string
  status: 'saved' | 'error'
  message: string
}

const entries = ref<MqttLogEntry[]>([])
const connected = ref(false)
const expanded = ref(false)
const logContainer = ref<HTMLElement | null>(null)

let eventSource: EventSource | null = null

function connect() {
  eventSource = new EventSource('/api/mqtt-log')

  eventSource.addEventListener('history', (e: MessageEvent) => {
    const history: MqttLogEntry[] = JSON.parse(e.data)
    entries.value = history
    connected.value = true
    scrollToBottom()
  })

  eventSource.addEventListener('message', (e: MessageEvent) => {
    const entry: MqttLogEntry = JSON.parse(e.data)
    entries.value.push(entry)
    // Keep client-side bounded
    if (entries.value.length > 200) {
      entries.value = entries.value.slice(-200)
    }
    scrollToBottom()
  })

  eventSource.addEventListener('open', () => {
    connected.value = true
  })

  eventSource.addEventListener('error', () => {
    connected.value = false
    // Auto-reconnect after 3 seconds
    setTimeout(() => {
      eventSource?.close()
      connect()
    }, 3000)
  })
}

function scrollToBottom() {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

function clearLog() {
  entries.value = []
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function shortenTopic(topic: string): string {
  const segments = topic.split('/')
  if (segments.length <= 3) return topic
  return `…/${segments.slice(-2).join('/')}`
}

function severityColor(severity: number): 'error' | 'warning' | 'success' | 'info' {
  if (severity >= 8) return 'error'
  if (severity >= 5) return 'warning'
  if (severity >= 3) return 'info'
  return 'success'
}

onMounted(() => {
  connect()
})

onUnmounted(() => {
  eventSource?.close()
})
</script>
