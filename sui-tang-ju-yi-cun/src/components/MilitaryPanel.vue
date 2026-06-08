<template>
  <div class="military-panel">
    <div class="panel-title">⚔️ 军事训练</div>

    <!-- 当前军队 -->
    <div class="section-title">👥 当前军队 ({{ store.totalArmyCount }}人)</div>
    <div v-if="store.playerArmy.length === 0" class="no-data">还没有军队，请训练士兵</div>
    <div v-for="troop in store.playerArmy" :key="troop.type" class="troop-card card">
      <div class="troop-header">
        <span class="troop-icon">{{ getTroopIcon(troop.type) }}</span>
        <span class="troop-name">{{ getTroopName(troop.type) }}</span>
        <span class="troop-count">×{{ troop.count }}</span>
      </div>
    </div>

    <!-- 训练新兵 -->
    <div class="section-title" style="margin-top:16px">🔨 训练士兵</div>
    <div v-for="troop in store.availableTroopTypes" :key="troop.id" class="troop-card card">
      <div class="troop-header">
        <span class="troop-icon">{{ troop.icon }}</span>
        <div class="troop-info">
          <div class="troop-name">
            {{ troop.name }}
            <span v-if="troop.hidden" class="tag tag-purple">隐藏</span>
          </div>
          <div class="troop-stats">
            攻{{ troop.baseAttack }} 防{{ troop.baseDefense }} 速{{ troop.baseSpeed }}
          </div>
        </div>
      </div>
      <div class="troop-cost">
        训练消耗：💰{{ troop.cost.gold }} 🌾{{ troop.cost.food }} 🪵{{ troop.cost.wood }} ⛏{{ troop.cost.iron }}
      </div>
      <div class="troop-train">
        <button @click="doTrain(troop.id, 1)">+1</button>
        <button @click="doTrain(troop.id, 5)">+5</button>
        <button @click="doTrain(troop.id, 10)">+10</button>
      </div>
    </div>

    <!-- 势力列表 -->
    <div class="section-title" style="margin-top:16px">🏴 天下势力</div>
    <div v-for="faction in store.factions" :key="faction.id" class="faction-card card" :class="{ defeated: faction.defeated }">
      <div class="faction-header">
        <div class="faction-info">
          <div class="faction-name">
            {{ faction.name }}
            <span v-if="faction.defeated" class="tag tag-green">已平定</span>
            <span v-else class="tag tag-red">未征服</span>
          </div>
          <div class="faction-territory">📍 {{ faction.territory }}</div>
          <div class="faction-power">⚡ 战力：{{ faction.power }}</div>
        </div>
        <button
          v-if="!faction.defeated && store.totalArmyCount > 0"
          class="primary"
          @click="doAttack(faction.id)"
          :disabled="store.combat.active"
        >
          ⚔️ 出征
        </button>
      </div>
      <div class="faction-troops">
        <span v-for="t in faction.troops" :key="t.type" class="troop-mini">
          {{ getTroopIcon(t.type) }}×{{ t.count }}
        </span>
      </div>
      <div class="faction-reward">
        🎁 击败奖励：💰{{ faction.rewards.gold }} 🌾{{ faction.rewards.food }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
import { getTroopIcon, getTroopName } from '../composables/useHelpers'

const store = useGameStore()

function doTrain(type: any, count: number) {
  const err = store.trainTroop(type, count)
  if (err) store.addLog('❌ ' + err)
}

function doAttack(factionId: string) {
  const err = store.startCombat(factionId)
  if (err) {
    store.addLog('❌ ' + err)
  } else {
    store.currentPanel = 'combat'
  }
}
</script>

<style scoped>
.military-panel { }

.troop-card {
  padding: 8px;
}

.troop-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.troop-icon { font-size: 22px; }

.troop-info { flex: 1; }

.troop-name {
  font-weight: bold;
  font-size: 13px;
}

.troop-stats {
  font-size: 10px;
  color: var(--text-dim);
}

.troop-count {
  font-size: 18px;
  font-weight: bold;
  color: var(--gold);
}

.troop-cost {
  font-size: 10px;
  color: var(--text-dim);
  margin-top: 4px;
  padding: 4px 8px;
  background: var(--bg-deep);
  border-radius: 4px;
}

.troop-train {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.troop-train button {
  padding: 3px 10px;
  font-size: 11px;
}

.faction-card {
  padding: 10px;
}
.faction-card.defeated {
  opacity: 0.5;
}

.faction-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.faction-info { flex: 1; }

.faction-name {
  font-weight: bold;
  font-size: 14px;
}

.faction-territory {
  font-size: 11px;
  color: var(--text-dim);
}

.faction-power {
  font-size: 11px;
  color: var(--warning);
}

.faction-troops {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.troop-mini {
  font-size: 11px;
  background: rgba(255,255,255,0.05);
  padding: 2px 6px;
  border-radius: 3px;
}

.faction-reward {
  font-size: 11px;
  color: var(--accent-green);
  margin-top: 4px;
}

.no-data {
  font-size: 12px;
  color: var(--text-dim);
  text-align: center;
  padding: 16px;
}
</style>
