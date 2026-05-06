<template>
  <div class="space-y-8 sm:space-y-12">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2.5 bg-primary-50 dark:bg-primary-500/10 rounded-xl">
            <UIcon name="i-lucide-cctv" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Camera Nodes
          </h1>
        </div>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Monitor all deployed camera sensors across the Eastern Province network.
        </p>
      </div>

      <!-- Summary Badges -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span class="text-sm font-bold text-emerald-700 dark:text-emerald-400">{{ activeCount }} Active</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
          <span class="inline-flex h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span class="text-sm font-bold text-slate-600 dark:text-slate-400">{{ inactiveCount }} Offline</span>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <UTabs
      v-model="activeFilter"
      :content="false"
      :items="filterTabs"
      variant="pill"
      :ui="{
        list: 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl',
      }"
    />

    <!-- Camera Grid -->
    <div v-if="filteredCameras.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="camera in filteredCameras"
        :key="camera.id"
        class="group relative rounded-2xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        :class="camera.isActive
          ? 'border-slate-200 dark:border-slate-800 hover:border-primary-500/40 dark:hover:border-primary-500/40 hover:shadow-primary-500/10'
          : 'border-slate-200/60 dark:border-slate-800/60 opacity-75 hover:opacity-100'"
      >
        <!-- Card Header: Status + ID -->
        <div class="flex items-center justify-between px-6 pt-5 pb-3">
          <div class="flex items-center gap-2.5">
            <div
              class="p-2 rounded-lg"
              :class="camera.isActive
                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'"
            >
              <UIcon name="i-lucide-video" class="w-5 h-5" />
            </div>
            <div>
              <span class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Camera</span>
              <span class="text-lg font-black text-slate-900 dark:text-white tabular-nums">#{{ camera.id }}</span>
            </div>
          </div>

          <UBadge
            :color="camera.isActive ? 'success' : 'neutral'"
            :variant="camera.isActive ? 'subtle' : 'soft'"
            size="sm"
            class="flex items-center gap-1.5"
          >
            <span v-if="camera.isActive" class="relative flex h-1.5 w-1.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span v-else class="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400" />
            {{ camera.isActive ? 'Active' : 'Offline' }}
          </UBadge>
        </div>

        <!-- Card Body: Details -->
        <div class="px-6 pb-5 space-y-4">
          <!-- Location -->
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div>
              <span class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Location</span>
              <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ camera.locationTag }}</span>
            </div>
          </div>

          <!-- Coordinates -->
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-navigation" class="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div>
              <span class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Coordinates</span>
              <span class="text-sm font-mono text-slate-700 dark:text-slate-300">
                {{ camera.latitude.toFixed(4) }}, {{ camera.longitude.toFixed(4) }}
              </span>
            </div>
          </div>

          <!-- MQTT Topic -->
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-radio-tower" class="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div class="min-w-0">
              <span class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">MQTT Topic</span>
              <span class="block text-sm font-mono text-primary-600 dark:text-primary-400 truncate" :title="camera.topic">
                {{ camera.topic }}
              </span>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-700/40">
              <span class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Incidents</span>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-amber-500" />
                <span class="text-xl font-black text-slate-800 dark:text-white tabular-nums">{{ camera.incidentCount }}</span>
              </div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-700/40">
              <span class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Since</span>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ formatDate(camera.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Updated {{ formatRelative(camera.updatedAt) }}
          </span>
          <div class="flex items-center gap-1.5">
            <a
              :href="`https://www.google.com/maps?q=${camera.latitude},${camera.longitude}`"
              target="_blank"
              rel="noopener noreferrer"
              class="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
              title="Open in Google Maps"
            >
              <UIcon name="i-lucide-external-link" class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 mb-4">
        <UIcon name="i-lucide-video-off" class="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No cameras found</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        {{ activeFilter === 'active' ? 'No active cameras at the moment.' : activeFilter === 'offline' ? 'No offline cameras — all systems are running!' : 'No camera nodes have been deployed yet.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CameraNode {
  id: number
  locationTag: string
  latitude: number
  longitude: number
  isActive: boolean
  topic: string
  incidentCount: number
  createdAt: string
  updatedAt: string
}

const { data: cameras } = await useFetch<CameraNode[]>('/api/cameras')

const filterTabs = [
  { label: 'All Cameras', value: 'all', icon: 'i-lucide-layout-grid' },
  { label: 'Active', value: 'active', icon: 'i-lucide-wifi' },
  { label: 'Offline', value: 'offline', icon: 'i-lucide-wifi-off' }
]

const activeFilter = ref('all')

const filteredCameras = computed(() => {
  if (!cameras.value) return []
  if (activeFilter.value === 'active') return cameras.value.filter(c => c.isActive)
  if (activeFilter.value === 'offline') return cameras.value.filter(c => !c.isActive)
  return cameras.value
})

const activeCount = computed(() => cameras.value?.filter(c => c.isActive).length ?? 0)
const inactiveCount = computed(() => cameras.value?.filter(c => !c.isActive).length ?? 0)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

useHead({
  title: 'Camera Nodes — AIoT Dashboard'
})
</script>
