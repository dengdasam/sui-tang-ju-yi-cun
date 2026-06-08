<template>
  <div class="village-panel">
    <div class="panel-title">🏯 屯兵寨概况</div>

    <!-- 基本信息 -->
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">人口</span>
        <span class="info-value">👥 {{ store.resources.population }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">民心</span>
        <span class="info-value">{{ store.morale }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">声望</span>
        <span class="info-value">⭐ {{ store.reputation }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">军队</span>
        <span class="info-value">⚔ {{ store.totalArmyCount }}</span>
      </div>
    </div>

    <!-- 建筑列表 -->
    <div class="section-title">📋 建筑列表 ({{ store.buildings.length }}/13)</div>
    <div v-for="building in store.buildings" :key="building.id" class="building-card card">
      <div class="building-header">
        <span class="building-icon">{{ building.icon }}</span>
        <div class="building-info">
          <div class="building-name">
            {{ building.name }}
            <span class="building-level">Lv{{ building.level }}</span>
          </div>
          <div class="building-output">
            <span v-if="building.outputGold > 0">💰{{ building.outputGold }}/季</span>
            <span v-if="building.outputFood > 0">🌾{{ building.outputFood }}/季</span>
            <span v-if="building.outputWood > 0">🪵{{ building.outputWood }}/季</span>
            <span v-if="building.outputIron > 0">⛏{{ building.outputIron }}/季</span>
            <span v-if="!building.outputGold && !building.outputFood && !building.outputWood && !building.outputIron" style="color:var(--text-dim)">无直接产出</span>
          </div>
        </div>
        <div class="building-actions">
          <button
            v-if="building.level < building.maxLevel"
            @click="doUpgrade(building.id)"
            class="success"
            title="升级"
          >⬆</button>
          <button
            @click="showAssign = showAssign === building.id ? '' : building.id"
            title="分配武将"
          >👤</button>
        </div>
      </div>

      <!-- 武将分配 -->
      <div v-if="building.assignedHeroId" class="assigned-hero">
        👤 已分配：
        <span class="hero-name">{{ getHeroName(building.assignedHeroId) }}</span>
        <button @click="store.unassignHero(building.assignedHeroId!)" class="unassign-btn">✕</button>
      </div>

      <!-- 分配面板 -->
      <div v-if="showAssign === building.id" class="assign-panel fade-in">
        <div class="assign-title">选择武将分配到{{ building.name }}</div>
        <div v-for="hero in store.unassignedHeroes" :key="hero.id" class="assign-option" @click="doAssign(hero.id, building.id)">
          {{ hero.icon }} {{ hero.name }} <span class="grade" :style="{color: getGradeColor(hero.grade)}">[{{ hero.grade }}]</span>
          <span class="stat">政{{ hero.stats.politics }}</span>
        </div>
        <div v-if="store.unassignedHeroes.length === 0" class="no-data">没有空闲武将</div>
      </div>
    </div>

    <!-- 连锁加成 -->
    <div v-if="store.chainBonuses.length > 0" class="chain-section">
      <div class="section-title">🔗 连锁加成</div>
      <div v-for="bonus in store.chainBonuses" :key="bonus" class="chain-item">
        ✅ {{ bonus }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import { getGradeColor } from '../composables/useHelpers'

const store = useGameStore()
const showAssign = ref('')

function getHeroName(heroId: string): string {
  return store.heroes.find(h => h.id === heroId)?.name || '未知'
}

function doUpgrade(buildingId: string) {
  const err = store.upgradeBuilding(buildingId)
  if (err) store.addLog('❌ ' + err)
}

function doAssign(heroId: string, buildingId: string) {
  const err = store.assignHeroToBuilding(heroId, buildingId)
  if (err) store.addLog('❌ ' + err)
  else showAssign.value = ''
}
</script>

<style scoped>
.village-panel { }

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 12px;
}

.info-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 12px;
  color: var(--text-dim);
}

.info-value {
  font-size: 13px;
  font-weight: bold;
  color: var(--gold);
}

.section-title {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border);
}

.building-card {
  padding: 8px;
}

.building-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.building-icon {
  font-size: 24px;
}

.building-info {
  flex: 1;
  min-width: 0;
}

.building-name {
  font-weight: bold;
  font-size: 13px;
}

.building-level {
  font-size: 10px;
  color: var(--gold);
  background: rgba(240,192,64,0.15);
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 6px;
}

.building-output {
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  gap: 8px;
}

.building-actions {
  display: flex;
  gap: 4px;
}
.building-actions button {
  padding: 3px 8px;
  font-size: 12px;
}

.assigned-hero {
  margin-top: 6px;
  padding: 4px 8px;
  background: rgba(39, 174, 96, 0.1);
  border-radius: 4px;
  font-size: 12px;
}

.hero-name {
  color: var(--accent-green);
  font-weight: bold;
}

.unassign-btn {
  padding: 1px 5px !important;
  font-size: 10px !important;
  margin-left: 6px;
}

.assign-panel {
  margin-top: 8px;
  padding: 8px;
  background: var(--bg-deep);
  border-radius: 4px;
  border: 1px solid var(--border);
}

.assign-title {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 6px;
}

.assign-option {
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  transition: all 0.15s;
}
.assign-option:hover {
  background: rgba(240,192,64,0.1);
  color: var(--gold);
}

.grade {
  font-size: 10px;
  font-weight: bold;
}

.stat {
  font-size: 10px;
  color: var(--text-dim);
  margin-left: auto;
}

.chain-section {
  margin-top: 12px;
  padding: 8px;
  background: rgba(240, 192, 64, 0.05);
  border: 1px solid rgba(240, 192, 64, 0.2);
  border-radius: 6px;
}

.chain-item {
  font-size: 12px;
  color: var(--gold);
  padding: 2px 0;
}

.no-data {
  font-size: 12px;
  color: var(--text-dim);
  text-align: center;
  padding: 10px;
}
</style>
