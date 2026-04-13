<template>
  <div>
    <header class="glass-header">
      <NuxtLink to="/" class="glass-header-brand">
        AIoT Emergency Alert Dashboard
      </NuxtLink>
      <div style="display: flex; gap: 1rem; align-items: center;">
        <div class="badge badge-active" style="animation: none; border-color: rgba(255,255,255,0.2); color: white; background: rgba(0,0,0,0.5);">
          System Online
        </div>
      </div>
    </header>

    <main class="container">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'AIoT Dashboard',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
