<template>
  <div class="story-panel">
    <!-- 对话历史 -->
    <div class="dialogue-history" ref="historyRef">
      <div v-for="(line, i) in store.dialogueHistory" :key="i" class="history-line">
        {{ line }}
      </div>
    </div>

    <!-- 当前故事节点 -->
    <div v-if="store.currentStoryNode" class="story-node fade-in">
      <div class="story-content">
        <!-- 叙事 -->
        <div v-if="store.currentStoryNode.type === 'narration'" class="narration-box">
          <div class="narration-text">{{ store.currentStoryNode.content }}</div>
          <button @click="store.processNextStory()" class="continue-btn">
            继续 ▶
          </button>
        </div>

        <!-- 对话 -->
        <div v-else-if="store.currentStoryNode.type === 'dialogue' && store.currentStoryNode.dialogue" class="dialogue-box">
          <div v-for="(d, i) in store.currentStoryNode.dialogue" :key="i" class="dialogue-line">
            <span class="speaker">{{ d.speaker }}</span>
            <template v-if="d.emotion">（{{ d.emotion }}）</template>
            <span class="separator">：</span>
            <span class="content">{{ d.content }}</span>
          </div>
          <button @click="store.processNextStory()" class="continue-btn">
            继续 ▶
          </button>
        </div>

        <!-- 选择 -->
        <div v-else-if="store.currentStoryNode.type === 'choice'" class="choice-box">
          <div class="narration-text">{{ store.currentStoryNode.content || store.currentStoryNode.speaker }}</div>
          <div class="choices">
            <button
              v-for="(choice, i) in store.currentStoryNode.choices"
              :key="i"
              @click="store.makeChoice(i)"
              class="choice-btn"
            >
              {{ i + 1 }}. {{ choice.text }}
            </button>
          </div>
        </div>

        <!-- 事件 -->
        <div v-else class="narration-box">
          <div class="narration-text">{{ store.currentStoryNode.content }}</div>
          <div v-if="store.currentStoryNode.choices" class="choices">
            <button
              v-for="(choice, i) in store.currentStoryNode.choices"
              :key="i"
              @click="store.makeChoice(i)"
              class="choice-btn"
            >
              {{ i + 1 }}. {{ choice.text }}
            </button>
          </div>
          <button v-else @click="store.processNextStory()" class="continue-btn">
            继续 ▶
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!store.currentStoryNode && store.dialogueHistory.length === 0" class="empty-state">
      <div class="empty-icon">🏯</div>
      <div class="empty-text">屯兵寨的日常开始了……</div>
      <div class="empty-hint">使用右侧面板管理你的寨子</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const historyRef = ref<HTMLElement | null>(null)

watch(() => store.dialogueHistory.length, () => {
  nextTick(() => {
    if (historyRef.value) {
      historyRef.value.scrollTop = historyRef.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.story-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.dialogue-history {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  margin-bottom: 8px;
}

.history-line {
  padding: 3px 8px;
  font-size: 13px;
  color: var(--text-secondary);
  border-left: 2px solid transparent;
  margin-bottom: 2px;
  line-height: 1.6;
}

.history-line:hover {
  border-left-color: var(--border);
  background: rgba(255,255,255,0.02);
}

.story-node {
  background: var(--bg-panel);
  border: 1px solid var(--gold-dark);
  border-radius: 8px;
  padding: 16px;
  margin-top: auto;
}

.narration-box {
  text-align: center;
}

.narration-text {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 2;
  color: var(--text-primary);
  white-space: pre-line;
  margin-bottom: 16px;
  text-align: left;
}

.dialogue-box {
  text-align: left;
}

.dialogue-line {
  margin-bottom: 8px;
  line-height: 1.8;
}

.speaker {
  font-weight: bold;
  color: var(--gold);
  font-size: 14px;
}

.separator {
  color: var(--text-dim);
}

.content {
  color: var(--text-primary);
  font-size: 14px;
}

.choice-box {
  text-align: left;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.choice-btn {
  text-align: left;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  font-size: 14px;
  transition: all 0.2s;
}

.choice-btn:hover {
  border-color: var(--gold);
  background: rgba(240, 192, 64, 0.1);
  transform: translateX(4px);
}

.continue-btn {
  display: block;
  margin: 12px auto 0;
  padding: 8px 24px;
  font-size: 14px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-family: var(--font-calligraphy);
  font-size: 20px;
  color: var(--text-primary);
}

.empty-hint {
  font-size: 13px;
  color: var(--text-dim);
  margin-top: 8px;
}
</style>
