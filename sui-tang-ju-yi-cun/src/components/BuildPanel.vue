<template>
  <div class="build-panel">
    <div class="panel-title">🏗️ 建设建筑</div>

    <!-- 可建造列表 -->
    <div class="section-title">🔨 可建造 ({{ store.availableBuildings.length }})</div>
    <div v-if="store.availableBuildings.length === 0" class="no-data">所有建筑已建造</div>
    <div v-for="bld in store.availableBuildings" :key="bld.type" class="build-card card">
      <div class="build-header">
        <span class="build-icon">{{ bld.icon }}</span>
        <div class="build-info">
          <div class="build-name">{{ bld.name }}</div>
          <div class="build-desc">{{ bld.description }}</div>
          <div class="build-tags">
            <span v-for="tag in bld.tags" :key="tag" class="tag tag-blue">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="build-cost">
        <span>💰{{ getBuildCost(bld.type) }}</span>
        <span>🪵40</span>
      </div>
      <button class="success" @click="doBuild(bld.type)">建造</button>
    </div>

    <!-- 已有建筑升级 -->
    <div class="section-title" style="margin-top:16px">⬆️ 可升级</div>
    <div v-for="building in upgradableBuildings" :key="building.id" class="build-card card">
      <div class="build-header">
        <span class="build-icon">{{ building.icon }}</span>
        <div class="build-info">
          <div class="build-name">
            {{ building.name }}
            <span class="building-level">Lv{{ building.level }} → Lv{{ building.level + 1 }}</span>
          </div>
          <div class="build-output">
            <span v-if="building.outputGold">💰{{ building.outputGold }} → 💰{{ getNextOutput(building, 'gold') }}/季</span>
            <span v-if="building.outputFood">🌾{{ building.outputFood }} → 🌾{{ getNextOutput(building, 'food') }}/季</span>
          </div>
        </div>
      </div>
      <div class="build-cost">
        <span>💰{{ building.upgradeCost.gold }}</span>
        <span>🪵{{ building.upgradeCost.wood }}</span>
        <span v-if="building.upgradeCost.iron > 0">⛏{{ building.upgradeCost.iron }}</span>
      </div>
      <button class="warning" @click="doUpgrade(building.id)">升级</button>
    </div>
    <div v-if="upgradableBuildings.length === 0" class="no-data">暂无可升级建筑</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { BUILDING_DATA } from '../data/buildings'

const store = useGameStore()

const upgradableBuildings = computed(() =>
  store.buildings.filter(b => b.level < b.maxLevel)
)

function getBuildCost(type: string): number {
  const costs: Record<string, number> = {
    juyi_hall: 300, stable: 200, pawnshop: 250, altar: 200,
    barracks: 150, smithy: 180, hospital: 150,
    farmland: 100, lumber_mill: 120, mine: 130,
    farmhouse: 80, cloth_shop: 100, tavern: 120,
  }
  return costs[type] || 150
}

function getNextOutput(building: any, type: string): number {
  const data = BUILDING_DATA[building.type]
  if (!data) return 0
  const nextLevel = building.level + 1
  if (type === 'gold') return data.outputGold * nextLevel
  if (type === 'food') return data.outputFood * nextLevel
  return 0
}

function doBuild(type: string) {
  const err = store.buildNewBuilding(type)
  if (err) store.addLog('❌ ' + err)
}

function doUpgrade(buildingId: string) {
  const err = store.upgradeBuilding(buildingId)
  if (err) store.addLog('❌ ' + err)
}
</script>

<style scoped>
.build-panel { }

.build-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
}

.build-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.build-icon { font-size: 24px; }

.build-info { flex: 1; min-width: 0; }

.build-name {
  font-weight: bold;
  font-size: 13px;
}

.build-desc {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 2px;
}

.build-tags {
  margin-top: 4px;
}

.build-output {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.build-cost {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: var(--text-secondary);
  padding: 4px 8px;
  background: var(--bg-deep);
  border-radius: 4px;
}

.building-level {
  font-size: 10px;
  color: var(--warning);
  background: rgba(243, 156, 18, 0.15);
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 6px;
}

.no-data {
  font-size: 12px;
  color: var(--text-dim);
  text-align: center;
  padding: 16px;
}
</style>
