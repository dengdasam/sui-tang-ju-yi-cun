<template>
  <div id="game-app">
    <TitleScreen v-if="store.phase === 'title'" />
    <GameScreen v-else />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from './stores/game'
import TitleScreen from './views/TitleScreen.vue'
import GameScreen from './views/GameScreen.vue'

const store = useGameStore()
</script>

<style scoped>
#game-app {
  height: 100vh;
  width: 100vw;
}
</style>
