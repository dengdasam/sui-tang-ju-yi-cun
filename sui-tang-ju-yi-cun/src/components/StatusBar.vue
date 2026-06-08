<template>
  <div class="status-bar">
    <div class="status-left">
      <span class="game-title">⚔ 隋唐聚义村</span>
      <span class="date-display">
        {{ store.dateString }} {{ store.weatherName }}
      </span>
    </div>
    <div class="status-center">
      <div class="resource-bar">
        <span class="resource-item"><span class="icon">💰</span><span class="val">{{ store.resources.gold }}</span></span>
        <span class="resource-item"><span class="icon">🌾</span><span class="val">{{ store.resources.food }}</span></span>
        <span class="resource-item"><span class="icon">🪵</span><span class="val">{{ store.resources.wood }}</span></span>
        <span class="resource-item"><span class="icon">⛏</span><span class="val">{{ store.resources.iron }}</span></span>
      </div>
    </div>
    <div class="status-right">
      <span class="stat-item">👥{{ store.resources.population }}</span>
      <span class="stat-item">⭐{{ store.reputation }}</span>
      <span class="stat-item">💪{{ store.morale }}</span>
      <span class="stat-item">⚔{{ store.totalArmyCount }}</span>
      <button class="advance-btn" @click="store.advanceDay(1)">次日 ▶</button>
      <button class="advance-btn season-btn" @click="store.advanceDay(30)">过季 ⏩</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'

const store = useGameStore()
</script>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: linear-gradient(180deg, #3d2010, #2d1810);
  border-bottom: 2px solid var(--border);
  gap: 12px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.game-title {
  font-family: var(--font-calligraphy);
  font-size: 17px;
  color: var(--gold);
  text-shadow: 1px 1px 2px #000;
}

.date-display {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(0,0,0,.3);
  padding: 3px 8px;
  border-radius: 4px;
}

.status-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.stat-item {
  font-size: 12px;
  color: var(--text-primary);
  background: rgba(0,0,0,.3);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.advance-btn {
  padding: 4px 10px;
  font-size: 12px;
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: #fff;
}
.advance-btn:hover {
  background: #3498db;
}
.season-btn {
  background: var(--accent-purple);
  border-color: var(--accent-purple);
}
.season-btn:hover {
  background: #9b59b6;
}
</style>
