<template>
  <div class="tech-panel">
    <div class="panel-title">🔬 科技研究</div>

    <div v-for="tech in store.technologies" :key="tech.id" class="tech-card card">
      <div class="tech-header">
        <span class="tech-icon">{{ tech.icon }}</span>
        <div class="tech-info">
          <div class="tech-name">
            {{ tech.name }}
            <span class="tech-level">Lv{{ tech.level }}/{{ tech.maxLevel }}</span>
          </div>
          <div class="tech-desc">{{ tech.description }}</div>
          <div class="tech-effect">{{ tech.effect }}</div>
        </div>
      </div>
      <div class="tech-cost" v-if="tech.level < tech.maxLevel">
        升级消耗：💰{{ tech.cost.gold }} 🌾{{ tech.cost.food }} 🪵{{ tech.cost.wood }} ⛏{{ tech.cost.iron }}
      </div>
      <div class="tech-action">
        <button
          v-if="tech.level < tech.maxLevel"
          @click="doResearch(tech.id)"
          :disabled="!canAfford(tech.cost)"
          class="warning"
        >
          研究 Lv{{ tech.level + 1 }}
        </button>
        <span v-else class="tag tag-green">已满级</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'

const store = useGameStore()

function canAfford(cost: { gold: number; food: number; wood: number; iron: number }): boolean {
  return store.resources.gold >= cost.gold &&
    store.resources.food >= cost.food &&
    store.resources.wood >= cost.wood &&
    store.resources.iron >= cost.iron
}

function doResearch(techId: string) {
  const tech = store.technologies.find(t => t.id === techId)
  if (!tech || tech.level >= tech.maxLevel) return
  if (!canAfford(tech.cost)) {
    store.addLog('❌ 资源不足！')
    return
  }
  store.resources.gold -= tech.cost.gold
  store.resources.food -= tech.cost.food
  store.resources.wood -= tech.cost.wood
  store.resources.iron -= tech.cost.iron
  tech.level++
  // 更新下一级消耗
  tech.cost = {
    gold: Math.floor(tech.cost.gold * 1.5),
    food: Math.floor(tech.cost.food * 1.5),
    wood: Math.floor(tech.cost.wood * 1.5),
    iron: Math.floor(tech.cost.iron * 1.5),
    population: 0,
  }
  store.addLog(`🔬 【${tech.name}】研究到Lv${tech.level}！`)
}
</script>

<style scoped>
.tech-panel { }

.tech-card {
  padding: 10px;
}

.tech-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.tech-icon { font-size: 22px; }

.tech-info { flex: 1; }

.tech-name {
  font-weight: bold;
  font-size: 14px;
}

.tech-level {
  font-size: 10px;
  color: var(--gold);
  background: rgba(240,192,64,0.15);
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 6px;
}

.tech-desc {
  font-size: 11px;
  color: var(--text-dim);
}

.tech-effect {
  font-size: 11px;
  color: var(--accent-blue);
  margin-top: 2px;
}

.tech-cost {
  font-size: 10px;
  color: var(--text-dim);
  margin-top: 6px;
  padding: 4px 8px;
  background: var(--bg-deep);
  border-radius: 4px;
}

.tech-action {
  margin-top: 6px;
}

.tech-action button {
  font-size: 11px;
  padding: 4px 12px;
}
</style>
