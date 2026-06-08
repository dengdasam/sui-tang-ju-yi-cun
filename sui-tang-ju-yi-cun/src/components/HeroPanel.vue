<template>
  <div class="hero-panel">
    <div class="panel-title">👥 武将管理</div>

    <!-- 已招募武将 -->
    <div class="section-title">✅ 已招募 ({{ store.recruitedHeroes.length }}/14)</div>
    <div v-if="store.recruitedHeroes.length === 0" class="no-data">还没有招募武将</div>
    <div v-for="hero in store.recruitedHeroes" :key="hero.id" class="hero-card card">
      <div class="hero-header">
        <span class="hero-icon">{{ hero.icon }}</span>
        <div class="hero-main">
          <div class="hero-name">
            {{ hero.name }}
            <span class="grade" :style="{color: getGradeColor(hero.grade)}">[{{ hero.grade }}]</span>
          </div>
          <div class="hero-title">{{ hero.title }}</div>
          <div class="hero-stats">
            <span class="stat">武{{ Math.floor(hero.stats.martial) }}</span>
            <span class="stat">智{{ Math.floor(hero.stats.intelligence) }}</span>
            <span class="stat">统{{ Math.floor(hero.stats.command) }}</span>
            <span class="stat">政{{ Math.floor(hero.stats.politics) }}</span>
            <span class="stat">魅{{ Math.floor(hero.stats.charisma) }}</span>
          </div>
        </div>
        <div class="hero-level">
          Lv{{ hero.level }}
          <div class="exp-bar">
            <div class="exp-fill" :style="{width: (hero.exp / hero.expToNext * 100) + '%'}"></div>
          </div>
          <span class="exp-text">{{ hero.exp }}/{{ hero.expToNext }}</span>
        </div>
      </div>

      <!-- 技能 -->
      <div class="hero-skills">
        <div v-for="skill in hero.skills" :key="skill.id" class="skill-tag">
          {{ skill.type === 'active' ? '⚡' : '📌' }} {{ skill.name }} Lv{{ skill.level }}
        </div>
      </div>

      <!-- 分配状态 -->
      <div class="hero-status">
        <span v-if="hero.assignedBuildingId">
          🏗️ 在【{{ getBuildingName(hero.assignedBuildingId) }}】工作
          <button @click="store.unassignHero(hero.id)" class="unassign-btn">调离</button>
        </span>
        <span v-else class="idle">💤 空闲中</span>
      </div>

      <!-- 好感/忠诚 -->
      <div class="hero-rel">
        <span>❤️好感 {{ hero.affection }}</span>
        <span>🛡️忠诚 {{ hero.loyalty }}</span>
        <button @click="doGift(hero.id, '美酒')" :disabled="store.resources.gold < 50">🎁送礼</button>
        <button v-if="hero.exp >= hero.expToNext" class="success" @click="doLevelUp(hero.id)">⬆升级</button>
      </div>
    </div>

    <!-- 可招募武将 -->
    <div class="section-title" style="margin-top:16px">🔍 可招募 ({{ store.availableHeroes.length }})</div>
    <div v-for="hero in store.availableHeroes" :key="hero.id" class="hero-card card dimmed">
      <div class="hero-header">
        <span class="hero-icon">{{ hero.icon }}</span>
        <div class="hero-main">
          <div class="hero-name">
            {{ hero.name }}
            <span class="grade" :style="{color: getGradeColor(hero.grade)}">[{{ hero.grade }}]</span>
          </div>
          <div class="hero-title">{{ hero.title }}</div>
          <div class="hero-desc">{{ hero.biography.slice(0, 40) }}...</div>
        </div>
        <div class="recruit-cost">
          <div>💰{{ getRecruitCost(hero.id) }}</div>
          <button class="primary" @click="doRecruit(hero.id)">招募</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
import { HERO_RECRUIT_COSTS } from '../data/heroes'
import { getGradeColor } from '../composables/useHelpers'

const store = useGameStore()

function getBuildingName(buildingId: string): string {
  return store.buildings.find(b => b.id === buildingId)?.name || '未知'
}

function getRecruitCost(heroId: string): number {
  return HERO_RECRUIT_COSTS[heroId]?.gold || 300
}

function doRecruit(heroId: string) {
  const err = store.recruitHero(heroId)
  if (err) store.addLog('❌ ' + err)
}

function doLevelUp(heroId: string) {
  const err = store.levelUpHero(heroId)
  if (err) store.addLog('❌ ' + err)
}

function doGift(heroId: string, gift: string) {
  const err = store.giveGift(heroId, gift)
  if (err) store.addLog('❌ ' + err)
}
</script>

<style scoped>
.hero-card {
  padding: 10px;
  transition: all 0.2s;
}
.hero-card.dimmed {
  opacity: 0.7;
}
.hero-card.dimmed:hover {
  opacity: 1;
}

.hero-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.hero-icon { font-size: 28px; }

.hero-main { flex: 1; min-width: 0; }

.hero-name {
  font-weight: bold;
  font-size: 14px;
}

.grade {
  font-size: 10px;
  font-weight: bold;
  margin-left: 4px;
}

.hero-title {
  font-size: 11px;
  color: var(--text-dim);
}

.hero-desc {
  font-size: 10px;
  color: var(--text-dim);
  margin-top: 2px;
}

.hero-stats {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.stat {
  font-size: 10px;
  color: var(--text-secondary);
  background: rgba(255,255,255,0.05);
  padding: 1px 5px;
  border-radius: 3px;
}

.hero-level {
  text-align: center;
  min-width: 50px;
}

.exp-bar {
  height: 4px;
  background: var(--bg-deep);
  border-radius: 2px;
  margin-top: 2px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: var(--gold);
  border-radius: 2px;
  transition: width 0.3s;
}

.exp-text {
  font-size: 9px;
  color: var(--text-dim);
}

.hero-skills {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.skill-tag {
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(240, 192, 64, 0.1);
  border: 1px solid rgba(240, 192, 64, 0.2);
  border-radius: 3px;
  color: var(--gold);
}

.hero-status {
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}

.idle {
  color: var(--text-dim);
  font-style: italic;
}

.unassign-btn {
  padding: 1px 5px !important;
  font-size: 10px !important;
  margin-left: 4px;
}

.hero-rel {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}

.hero-rel button {
  padding: 2px 8px;
  font-size: 10px;
}

.recruit-cost {
  text-align: center;
  min-width: 60px;
  font-size: 12px;
  font-weight: bold;
  color: var(--gold);
}

.recruit-cost button {
  margin-top: 4px;
  padding: 3px 10px;
  font-size: 11px;
}

.no-data {
  font-size: 12px;
  color: var(--text-dim);
  text-align: center;
  padding: 16px;
}
</style>
