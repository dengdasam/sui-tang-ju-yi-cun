<template>
  <div class="title-screen">
    <div class="title-bg"></div>
    <div class="title-content">
      <div class="subtitle-text">隋大业七年 · 群雄逐鹿</div>
      <h1 class="title-text">⚔ 隋唐聚义村 ⚔</h1>
      <div class="desc-text">屯兵山寨 · 招揽英豪 · 逐鹿天下</div>

      <div class="menu-buttons">
        <button class="start-btn" @click="startNewGame">
          🏯 开始新游戏
        </button>
        <button @click="showLoad = !showLoad" v-if="!showLoad">
          📂 继续游戏
        </button>
      </div>

      <div v-if="showLoad" class="load-panel fade-in">
        <div class="panel-title">选择存档</div>
        <div v-for="slot in 3" :key="slot" class="save-slot">
          <div v-if="getSlotInfo(slot - 1) as any; let info = getSlotInfo(slot - 1)">
            <div class="slot-info" v-if="info">
              <span>存档{{ slot }}: 大业{{ (info as any).year }}年 · 💰{{ (info as any).gold }}</span>
              <span class="slot-date">{{ (info as any).date?.slice(0, 10) }}</span>
            </div>
            <div class="slot-info" v-else>
              <span class="empty-slot">空</span>
            </div>
          </div>
          <div class="slot-actions">
            <button v-if="getSlotInfo(slot - 1)" class="success" @click="loadSlot(slot - 1)">读取</button>
            <button v-if="getSlotInfo(slot - 1)" class="danger" @click="deleteSlot(slot - 1)">删除</button>
          </div>
        </div>
      </div>

      <div class="credits">
        <p>基于开罗游戏《合战忍者村》玩法框架</p>
        <p>文字界面 · 模拟经营 · 战争策略</p>
        <p>v0.1.0 | 2026</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const showLoad = ref(false)

function startNewGame() {
  store.startGame()
}

function loadSlot(slot: number) {
  if (store.loadGame(slot)) {
    showLoad.value = false
  }
}

function deleteSlot(slot: number) {
  store.deleteSave(slot)
}

function getSlotInfo(slot: number) {
  return store.getSaveInfo(slot)
}
</script>

<style scoped>
.title-screen {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.title-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #3d2010 0%, #1a0a00 60%, #0a0500 100%);
}
.title-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.title-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px;
}

.subtitle-text {
  font-family: var(--font-calligraphy);
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  letter-spacing: 4px;
}

.title-text {
  font-family: var(--font-calligraphy);
  font-size: 56px;
  color: var(--gold);
  text-shadow: 0 0 30px rgba(240, 192, 64, 0.3), 2px 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 12px;
  letter-spacing: 8px;
}

.desc-text {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  letter-spacing: 8px;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-bottom: 30px;
}

.start-btn {
  font-family: var(--font-calligraphy);
  font-size: 22px !important;
  padding: 14px 48px !important;
  background: linear-gradient(135deg, #8b0000, #c0392b) !important;
  border: 2px solid #e74c3c !important;
  color: #fff !important;
  border-radius: 8px !important;
  letter-spacing: 4px;
  animation: pulse 2s ease-in-out infinite;
}

.start-btn:hover {
  background: linear-gradient(135deg, #a01010, #e74c3c) !important;
  transform: scale(1.05);
}

.load-panel {
  margin-top: 20px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.save-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 8px;
}

.slot-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slot-date {
  font-size: 11px;
  color: var(--text-dim);
}

.empty-slot {
  color: var(--text-dim);
  font-style: italic;
}

.slot-actions {
  display: flex;
  gap: 6px;
}

.credits {
  margin-top: 40px;
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.8;
}
</style>
