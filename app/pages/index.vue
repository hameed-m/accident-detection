<template>
  <div>
    <div class="dashboard-header animate-slide-up">
      <h1 class="page-title">Emergency Response Agencies</h1>
      <p class="page-subtitle">Real-time overview of active response units and situations</p>
    </div>

    <div class="grid grid-cols-3 agency-grid">
      <NuxtLink
        v-for="(agency, index) in agencies"
        :key="agency.id"
        :to="`/agency/${agency.id}`"
        class="glass-panel agency-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <h2 class="agency-name">{{ agency.name }}</h2>
        </div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <span class="stat-label">Available Units</span>
            <span class="stat-value text-accent">{{ agency.vacancies }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Handled Situations</span>
            <span class="stat-value">{{ agency.handledSituationsCount }}</span>
          </div>
        </div>
        
        <div class="card-footer">
          <span>View Dashboard</span>
          <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import agenciesData from '~/data/agencies.json'

const agencies = agenciesData
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.agency-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  text-decoration: none;
  animation: slide-up 0.6s ease-out backwards;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.agency-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.stat-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  font-family: var(--font-heading);
}

.text-accent {
  color: var(--accent-success);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--glass-border);
  color: var(--accent-primary);
  font-weight: 500;
}

.chevron-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.agency-card:hover .chevron-icon {
  transform: translateX(4px);
}
</style>
