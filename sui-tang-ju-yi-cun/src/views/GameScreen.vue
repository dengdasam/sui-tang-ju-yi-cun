<template>
  <div class="game-container">
    <!-- 顶部状态栏 -->
    <StatusBar />

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧：叙事/故事面板 -->
      <div class="left-panel" :class="{ 'expanded': store.currentStoryNode }">
        <StoryPanel />
      </div>

      <!-- 右侧：操作面板 -->
      <div class="right-panel" :class="{ 'collapsed': store.currentStoryNode && combatActive }">
        <!-- Tab 导航 -->
        <div class="tab-nav">
          <button
            v-for="tab in tabs" :key="tab.id"
            :class="{ active: store.currentPanel === tab.id }"
            @click="store.currentPanel = tab.id"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <!-- 面板内容 -->
        <div class="panel-content">
          <VillagePanel v-if="store.currentPanel === 'village'" />
          <BuildPanel v-if="store.currentPanel === 'build'" />
          <HeroPanel v-if="store.currentPanel === 'heroes'" />
          <MilitaryPanel v-if="store.currentPanel === 'military'" />
          <CombatPanel v-if="store.currentPanel === 'combat'" />
          <TechPanel v-if="store.currentPanel === 'tech'" />
          <SavePanel v-if="store.currentPanel === 'story'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import StatusBar from '../components/StatusBar.vue'
import StoryPanel from '../components/StoryPanel.vue'
import VillagePanel from '../components/VillagePanel.vue'
import BuildPanel from '../components/BuildPanel.vue'
import HeroPanel from '../components/HeroPanel.vue'
import MilitaryPanel from '../components/MilitaryPanel.vue'
import CombatPanel from '../components/CombatPanel.vue'
import TechPanel from '../components/TechPanel.vue'
import SavePanel from '../components/SaveDialog.vue'

const store = useGameStore()

const combatActive = computed(() => store.combat.active)

const tabs = [
  { id: 'village', label: '寨子', icon: '🏯' },
  { id: 'build', label: '建设', icon: '🏗️' },
  { id: 'heroes', label: '武将', icon: '👥' },
  { id: 'military', label: '军事', icon: '⚔️' },
  { id: 'tech', label: '科技', icon: '🔬' },
  { id: 'story', label: '存档', icon: '💾' },
] as const
</script>

<style scoped>
.game-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 50%;
  border-right: 2px solid var(--border);
  overflow-y: auto;
  transition: width 0.3s;
}
.left-panel.expanded {
  width: 65%;
}

.right-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s;
}
.right-panel.collapsed {
  width: 35%;
}

.tab-nav {
  display: flex;
  background: var(--bg-deep);
  border-bottom: 2px solid var(--border);
  flex-shrink: 0;
  overflow-x: auto;
}
.tab-nav button {
  flex: 1;
  padding: 8px 6px;
  font-size: 12px;
  border: none;
  background: transparent;
  color: var(--text-dim);
  border-bottom: 2px solid transparent;
  border-radius: 0;
  min-width: 70px;
}
.tab-nav button.active {
  color: var(--gold);
  border-bottom-color: var(--gold);
  background: rgba(240, 192, 64, 0.08);
}
.tab-nav button:hover {
  color: var(--gold-dark);
  background: rgba(240, 192, 64, 0.04);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
</style>
