<template>
  <div class="animate-slide-up space-y-10 font-sans">
    <div class="max-w-7xl mx-auto space-y-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <UButton to="/" icon="i-lucide-arrow-left" color="neutral" variant="ghost" label="Back to Dashboard"
            class="-ml-2.5 mb-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {{ agency?.name }}
          </h1>
          <p class="text-slate-600 dark:text-slate-400 mt-3 text-lg max-w-2xl">Specialized Emergency Response Agency</p>
        </div>

        <div class="flex flex-wrap gap-4">
          <UCard
            :ui="{ root: 'min-w-[200px] border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md shadow-sm' }">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Units
                  Available</p>
                <p class="text-3xl font-black text-slate-900 dark:text-white">{{ agency?.vacancies }}</p>
              </div>
            </div>
          </UCard>

          <UCard
            :ui="{ root: 'min-w-[200px] border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md shadow-sm' }">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <UIcon name="i-lucide-activity" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total
                  Handled</p>
                <p class="text-3xl font-black text-slate-900 dark:text-white">{{ agency?._count.incidents }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Active Situations -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Active Emergencies</h2>
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>

        <div v-if="activeSituations.length === 0"
          class="flex flex-col items-center justify-center py-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <UIcon name="i-lucide-shield-check"
            class="w-16 h-16 text-emerald-500 dark:text-emerald-400 mb-4 opacity-80" />
          <p class="text-xl font-bold text-slate-700 dark:text-slate-300">All clear</p>
          <p class="text-slate-500 dark:text-slate-400 mt-2">No active emergencies at the moment.</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UCard v-for="sit in activeSituations" :key="sit.id" :ui="{
            root: 'border border-red-200 dark:border-red-900/30 bg-gradient-to-br from-red-50/50 to-white/80 dark:from-red-950/20 dark:to-slate-900/80 shadow-lg shadow-red-500/5 dark:shadow-red-900/5 hover:border-red-300 dark:hover:border-red-500/30 transition-all duration-300',
            header: 'border-b border-slate-100 dark:border-slate-800/50 pb-4 pt-5 px-6',
            body: 'pt-5 px-6',
            footer: 'border-t border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 py-4 px-6'
          }">
            <template #header>
              <div class="flex justify-between items-center">
                <UBadge color="error" variant="soft" icon="i-lucide-alert-triangle" size="md"
                  class="rounded-full font-semibold">
                  Critical Alert
                </UBadge>
                <span class="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <UIcon name="i-lucide-clock" class="w-4 h-4" />
                  {{ new Date(sit.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>
            </template>

            <div class="mb-8">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-3">
                <UIcon name="i-lucide-map-pin" class="w-6 h-6 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                {{ sit.location }}
              </h3>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed pl-9">{{ sit.description }}</p>
            </div>

            <div class="grid grid-cols-3 gap-4 ml-9">
              <div
                class="bg-white/80 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center text-center">
                <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-1.5">
                  Severity</p>
                <p class="font-black text-slate-900 dark:text-white">{{ sit.severity }}</p>
              </div>
              <div
                class="bg-white/80 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center text-center">
                <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-1.5">
                  Vehicles</p>
                <p class="font-black text-slate-900 dark:text-white">{{ sit.vehiclesInvolved }}</p>
              </div>
              <div
                class="bg-white/80 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center text-center">
                <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-1.5">
                  Confidence</p>
                <p class="font-black text-slate-900 dark:text-white">{{ sit.confidence }}</p>
              </div>
            </div>

            <template #footer>
              <div class="flex flex-col sm:flex-row gap-3">
                <UButton color="error" variant="solid" icon="i-lucide-truck"
                  class="flex-1 justify-center py-2.5 text-base font-bold shadow-md shadow-red-500/20"
                  @click="handleSituation(sit.id)">
                  Dispatch Units
                </UButton>
                <UButton color="neutral" variant="soft" icon="i-lucide-x"
                  class="flex-1 justify-center py-2.5 text-base font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                  @click="ignoreSituation(sit.id)">
                  False Alarm
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </div>

      <!-- Handled Situations Section -->
      <div class="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Handled Situations Log</h2>

        <UCard
          :ui="{ root: 'border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md shadow-sm overflow-hidden', body: 'p-0 sm:p-0' }">
          <div v-if="handledSituations.length === 0" class="text-center py-16">
            <UIcon name="i-lucide-history" class="w-16 h-16 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
            <p class="text-lg font-bold text-slate-700 dark:text-slate-300">No History</p>
            <p class="text-slate-500 dark:text-slate-500 mt-2">There are no handled situations to display yet.</p>
          </div>

          <UTable v-else :data="handledSituations" :columns="logColumns" :ui="{
            th: 'text-slate-500 dark:text-slate-400 text-xs font-bold tracking-wider uppercase bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-4 px-6',
            td: 'text-sm text-slate-700 dark:text-slate-300 py-4 px-6 border-b border-slate-100 dark:border-slate-800/50',
            tr: 'hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'
          }" />
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const agencyId = route.params.id

const { data: agency } = await useFetch(`/api/agencies/${agencyId}`);
const { data: unhandledIncidents } = await useFetch('/api/incidents', {
  query: {
    status: 'UNHANDLED'
  }
});


const activeSituations = computed(() =>
  unhandledIncidents.value
)

const handledSituations = computed(() =>
  agency.value.incidents
    .filter(i => i.status === "RESOLVED")
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
)

// Severity badge color mapping
const severityBadgeColor = (severity) => {
  if (severity === 3 || severity === 2) return 'error'
  if (severity === 1) return 'warning'
  return 'success'
}

const UBadge = resolveComponent('UBadge')

const logColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => h('span', { class: 'font-mono text-slate-500 dark:text-slate-400' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => h('span', { class: 'font-semibold text-slate-900 dark:text-white' }, row.original.location)
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) =>
      h(UBadge, {
        color: severityBadgeColor(row.original.severity),
        variant: 'soft',
        size: 'sm',
        label: row.original.severity,
        class: 'rounded-full px-2.5'
      })
  },
  {
    accessorKey: 'detectedAt',
    header: 'Detected At',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-600 dark:text-slate-400' }, new Date(row.original.detectedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }))
  },
  {
    accessorKey: 'handledAt',
    header: 'Handled At',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-600 dark:text-slate-400' },
        row.original.handledAt ? new Date(row.original.handledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'
      )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: () =>
      h(UBadge, {
        color: 'success',
        variant: 'subtle',
        size: 'sm',
        label: 'Handled',
        class: 'rounded-full px-2.5'
      })
  }
]

// Mock Action Handlers
const handleSituation = (id) => {
  const index = allSituations.value.findIndex(s => s.id === id)
  allSituations.value[index] = {
    ...allSituations.value[index],
    status: 'handled',
    handledAt: new Date().toISOString(),
    notes: 'Handled from dashboard'
  }
}

const ignoreSituation = (id) => {
  const index = allSituations.value.findIndex(s => s.id === id)
  if (index !== -1) {
    allSituations.value[index] = {
      ...allSituations.value[index],
      status: 'handled',
      handledAt: new Date().toISOString(),
      notes: 'Marked as false alarm'
    }
  }
}
</script>
