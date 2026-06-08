<template>
  <div class="save-panel">
    <div class="panel-title">💾 存档/读档</div>

    <div class="save-actions-top">
      <button @click="doSave(0)">💾 快速存档</button>
    </div>

    <div class="section-title">存档槽位</div>
    <div v-for="slot in 3" :key="slot" class="save-card card">
      <div class="save-info">
        <div class="save-slot-title">存档 {{ slot }}</div>
        <div v-if="getInfo(slot - 1) as any; let info = getInfo(slot - 1)">
          <div class="save-detail" v-if="info">
            大业{{ (info as any).year }}年 · 💰{{ (info as any).gold }}
          </div>
          <div class="save-detail empty" v-else>空</div>
        </div>
      </div>
      <div class="save-actions">
        <button class="success" @click="doSave(slot - 1)">保存</button>
        <button @click="doLoad(slot - 1)" :disabled="!getInfo(slot - 1)">读取</button>
        <button class="danger" @click="doDelete(slot - 1)" :disabled="!getInfo(slot - 1)">删除</button>
      </div>
    </div>

    <div class="section-title" style="margin-top:16px">💡 提示</div>
    <div class="tip-text">
      游戏自动在每季结束时结算资源产出。<br>
      建议在重要战斗前存档。
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'

const store = useGameStore()

function getInfo(slot: number) {
  return store.getSaveInfo(slot)
}

function doSave(slot: number) {
  store.saveGame(slot)
}

function doLoad(slot: number) {
  if (store.loadGame(slot)) {
    store.currentPanel = 'village'
  }
}

function doDelete(slot: number) {
  store.deleteSave(slot)
}
</script>

<style scoped>
.save-panel { }

.save-actions-top {
  margin-bottom: 12px;
}
.save-actions-top button {
  width: 100%;
}

.save-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.save-slot-title {
  font-weight: bold;
  font-size: 14px;
}

.save-detail {
  font-size: 12px;
  color: var(--text-secondary);
}
.save-detail.empty {
  color: var(--text-dim);
  font-style: italic;
}

.save-actions {
  display: flex;
  gap: 4px;
}
.save-actions button {
  padding: 4px 10px;
  font-size: 11px;
}

.tip-text {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.8;
}
</style>
