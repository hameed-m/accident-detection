<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-primary-500/30 transition-colors duration-300">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group focus:outline-none">
          <div class="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 p-2 rounded-xl group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
            <UIcon name="i-lucide-shield-alert" class="w-6 h-6" />
          </div>
          <span class="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
            AIoT Emergency Alerts
          </span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <UBadge color="success" variant="soft" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
            </span>
            System Online
          </UBadge>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <slot />
    </main>
  </div>
</template>