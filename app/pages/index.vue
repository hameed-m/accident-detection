<template>
  <div class="animate-slide-up space-y-8 sm:space-y-12">
    <!-- Dashboard Header -->
    <div class="mb-10 text-center sm:text-left flex flex-col items-center sm:items-start">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
        Emergency Response Agencies
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
        Real-time overview of active response units and situations across all specialized agencies.
      </p>
    </div>

    <!-- Agency Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      <NuxtLink
        v-for="(agency, index) in agencies"
        :key="agency.id"
        :to="`/agency/${agency.id}`"
        class="group relative focus:outline-none"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <UCard
          :ui="{
            root: 'h-full flex flex-col border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:border-primary-500/40 dark:hover:border-primary-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group-hover:-translate-y-1.5 overflow-hidden',
            header: 'pb-0 border-b-0 pt-6 px-6',
            body: 'flex-1 pt-6 px-6',
            footer: 'pt-4 pb-4 px-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30'
          }"
        >
          <template #header>
            <div class="flex items-start justify-between">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ agency.name }}
              </h2>
              <div class="p-2.5 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary-600 dark:text-primary-400 shrink-0 transform transition-transform group-hover:scale-110">
                <UIcon name="i-lucide-shield" class="w-6 h-6" />
              </div>
            </div>
          </template>

          <div class="grid grid-cols-2 gap-3 sm:gap-4 mt-2">
            <div class="bg-white dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-center">
              <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Available</span>
              <span class="text-3xl font-black text-primary-600 dark:text-primary-400">{{ agency.vacancies }}</span>
            </div>
            <div class="bg-white dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-center">
              <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Handled</span>
              <span class="text-3xl font-black text-slate-800 dark:text-slate-100">{{ agency.handledSituationsCount }}</span>
            </div>
          </div>
          
          <template #footer>
            <div class="flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <span>View Dashboard</span>
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </template>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import agenciesData from '~/data/agencies.json'

const agencies = agenciesData
</script>
