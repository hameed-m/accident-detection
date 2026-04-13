<template>
  <div class="animate-slide-up">
    <!-- Breadcrumb and Agency Header -->
    <div class="agency-header">
      <NuxtLink to="/" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to Dashboard
      </NuxtLink>
      
      <div v-if="agency" class="header-content">
        <div class="title-wrap">
          <h1 class="page-title">{{ agency.name }}</h1>
        </div>
        <div class="header-stats glass-panel">
          <div class="h-stat">
            <span class="label">Units Available</span>
            <span class="val text-success">{{ agency.vacancies }}</span>
          </div>
          <div class="h-stat">
            <span class="label">Total Handled</span>
            <span class="val">{{ agency.handledSituationsCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Situations Section -->
    <section class="mb-5">
      <div class="section-title-wrap">
        <h2 class="section-title">Active Emergency Situations</h2>
        <span class="pulse-indicator"></span>
      </div>
      
      <div v-if="activeSituations.length === 0" class="empty-state glass-panel">
        <p>No active situations at the moment. All clear.</p>
      </div>
      
      <div v-else class="grid grid-cols-2">
        <div 
          v-for="sit in activeSituations" 
          :key="sit.id" 
          class="glass-panel situation-card active-card"
        >
          <div class="sit-header">
            <span class="badge badge-active">Critical Alert</span>
            <span class="time">{{ new Date(sit.detectedAt).toLocaleTimeString() }}</span>
          </div>
          
          <h3 class="location">{{ sit.location }}</h3>
          <p class="description">{{ sit.description }}</p>
          
          <div class="sit-details">
            <div class="detail-item">
              <span class="d-label">Severity</span>
              <span class="d-val">{{ sit.severity }}</span>
            </div>
            <div class="detail-item">
              <span class="d-label">Vehicles Involved</span>
              <span class="d-val">{{ sit.vehiclesInvolved }}</span>
            </div>
            <div class="detail-item">
              <span class="d-label">AI Confidence</span>
              <span class="d-val">{{ sit.confidence }}</span>
            </div>
          </div>
          
          <div class="action-bar">
            <button class="btn btn-primary" @click="handleSituation(sit.id)">Dispatch Units</button>
            <button class="btn btn-outline" @click="ignoreSituation(sit.id)">False Alarm</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Logs List (Handled Situations) -->
    <section>
      <h2 class="section-title">Handled Situations Log</h2>
      
      <div v-if="handledSituations.length === 0" class="empty-state glass-panel">
        <p>No logged activities found.</p>
      </div>
      
      <div v-else class="logs-container glass-panel">
        <table class="logs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Detected At</th>
              <th>Handled At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in handledSituations" :key="log.id">
              <td class="id-col">#{{ log.id }}</td>
              <td class="loc-col">{{ log.location }}</td>
              <td><span :class="['severity-dot', log.severity.toLowerCase()]"></span>{{ log.severity }}</td>
              <td class="text-muted">{{ new Date(log.detectedAt).toLocaleString() }}</td>
              <td class="text-muted">{{ log.handledAt ? new Date(log.handledAt).toLocaleString() : 'N/A' }}</td>
              <td><span class="badge badge-handled">Handled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'nuxt/app'
import agenciesData from '~/data/agencies.json'
import situationsData from '~/data/situations.json'

const route = useRoute()
const agencyId = route.params.id

// Data
const agency = computed(() => agenciesData.find(a => a.id === agencyId))

// In a real app, these would come from an API and be updated locally
const allSituations = ref(situationsData)

const agencySituations = computed(() => 
  allSituations.value.filter(s => s.agencyId === agencyId)
)

const activeSituations = computed(() => 
  agencySituations.value.filter(s => s.status === 'active')
)

const handledSituations = computed(() => 
  agencySituations.value.filter(s => s.status === 'handled').sort((a,b) => new Date(b.detectedAt) - new Date(a.detectedAt))
)

// Mock Action Handlers
const handleSituation = (id) => {
  const index = allSituations.value.findIndex(s => s.id === id);
  if(index !== -1) {
    allSituations.value[index] = {
      ...allSituations.value[index],
      status: 'handled',
      handledAt: new Date().toISOString(),
      notes: "Handled from dashboard"
    }
  }
}

const ignoreSituation = (id) => {
  const index = allSituations.value.findIndex(s => s.id === id);
  if(index !== -1) {
    allSituations.value[index] = {
      ...allSituations.value[index],
      status: 'handled',
      handledAt: new Date().toISOString(),
      notes: "Marked as false alarm"
    }
  }
}
</script>

<style scoped>
.mb-5 { margin-bottom: 3rem; }

.agency-header {
  margin-bottom: 3rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--text-primary);
}

.back-link svg {
  width: 16px;
  height: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title {
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(to right, #fff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-stats {
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
}

.h-stat {
  display: flex;
  flex-direction: column;
}

.h-stat .label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.h-stat .val {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
}

.text-success { color: var(--accent-success); }

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  margin: 0;
}

.pulse-indicator {
  width: 12px;
  height: 12px;
  background: var(--status-active);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--status-active);
  animation: pulse-danger 2s infinite;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 1.1rem;
}

/* Active Situations Card */
.active-card {
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.active-card:hover { border-color: rgba(239, 68, 68, 0.5); }

.situation-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.location {
  font-size: 1.25rem;
  margin: 0;
}

.description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.sit-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.d-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.d-val {
  font-weight: 600;
  font-size: 1rem;
}

.action-bar {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  font-family: var(--font-body);
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}
.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

/* Logs Table */
.logs-container {
  overflow-x: auto;
  padding: 1rem;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.logs-table th {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.85rem;
  text-transform: uppercase;
  padding: 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.logs-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.02);
  font-size: 0.95rem;
}

.logs-table tr:last-child td { border-bottom: none; }
.logs-table tbody tr:hover { background: rgba(255,255,255,0.02); }

.id-col { font-family: monospace; color: var(--text-muted); }
.loc-col { font-weight: 500; }

.severity-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}
.severity-dot.high, .severity-dot.critical { background: var(--status-active); }
.severity-dot.medium { background: var(--status-warning); }
.severity-dot.low { background: var(--status-handled); }
</style>
