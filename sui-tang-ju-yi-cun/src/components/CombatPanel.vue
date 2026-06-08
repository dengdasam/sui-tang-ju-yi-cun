<template>
  <div class="combat-panel">
    <div v-if="!store.combat.active" class="no-data">
      ⚔️ 暂无战斗<br>
      <span class="hint">在军事面板中选择势力出征</span>
    </div>

    <div v-else class="combat-active">
      <div class="panel-title">⚔️ 战斗 — vs {{ store.combat.enemy?.name }}</div>

      <!-- 状态 -->
      <div class="combat-status">
        <div class="morale-bar">
          <span>我军士气：{{ store.combat.morale }}</span>
          <div class="progress-bar"><div class="progress-fill gold" :style="{width:store.combat.morale+'%'}"></div></div>
        </div>
        <div class="morale-bar">
          <span>敌军士气：{{ store.combat.enemyMorale }}</span>
          <div class="progress-bar"><div class="progress-fill red" :style="{width:store.combat.enemyMorale+'%'}"></div></div>
        </div>
        <div class="troop-summary">
          <span>我军：{{ playerTotal }}人</span>
          <span>敌军：{{ enemyTotal }}人</span>
          <span>回合：{{ store.combat.turn }}</span>
        </div>
      </div>

      <!-- 战斗日志 -->
      <div class="combat-log">
        <div v-for="(log, i) in store.combat.log.slice(-15)" :key="i" class="log-line">
          {{ log }}
        </div>
      </div>

      <!-- 操作 -->
      <div v-if="store.combat.phase === 'battle'" class="combat-actions">
        <button @click="store.executeCombatTurn()" class="primary">⚔️ 进攻一回合</button>
        <button @click="store.autoCombat()" class="warning">⚡ 自动战斗</button>
      </div>

      <!-- 结果 -->
      <div v-if="store.combat.phase === 'result'" class="combat-result fade-in">
        <div class="result-text" :class="store.combat.winner === 'player' ? 'victory' : 'defeat'">
          {{ store.combat.winner === 'player' ? '🎉 大获全胜！' : '💀 战斗失败……' }}
        </div>
        <button @click="store.endCombatSession()" class="primary">返回寨子</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()

const playerTotal = computed(() => store.combat.playerTroops.reduce((s, t) => s + t.count, 0))
const enemyTotal = computed(() => store.combat.enemyTroops.reduce((s, t) => s + t.count, 0))
</script>

<style scoped>
.combat-panel { }

.combat-active { }

.combat-status {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}

.morale-bar {
  margin-bottom: 6px;
}
.morale-bar span {
  font-size: 12px;
  color: var(--text-secondary);
}

.troop-summary {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-primary);
}

.combat-log {
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.log-line {
  font-size: 12px;
  line-height: 1.8;
  color: var(--text-secondary);
  padding: 2px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

.combat-actions {
  display: flex;
  gap: 8px;
}

.combat-result {
  text-align: center;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.result-text {
  font-family: var(--font-calligraphy);
  font-size: 28px;
  margin-bottom: 16px;
}
.result-text.victory { color: var(--gold); }
.result-text.defeat { color: var(--danger); }

.no-data {
  text-align: center;
  padding: 40px;
  color: var(--text-dim);
}
.hint {
  font-size: 12px;
  margin-top: 8px;
  display: block;
}
</style>
