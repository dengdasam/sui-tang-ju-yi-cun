import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type {
  Resources, Building, Hero, Troop, Faction, Technology,
  GameDate, Season, Weather, CombatState, MapLocation,
  StoryNode, GamePhase, SaveData, FormationType, TroopType, HeroSkill,
} from '../types'
import { BUILDING_DATA, INITIAL_RESOURCES, CHAIN_BONUSES, BUILDING_UPGRADE_MULTIPLIER } from '../data/buildings'
import { HERO_BASE_DATA, HERO_RECRUIT_COSTS, expToNextLevel } from '../data/heroes'
import { TROOP_DATA } from '../data/troops'
import { FACTION_DATA } from '../data/factions'
import { OPENING_STORY, RANDOM_EVENTS, SEASON_NARRATIVES, FESTIVAL_EVENTS, COMBAT_NARRATIVES } from '../data/story'

export const useGameStore = defineStore('game', () => {
  // ==================== 基础状态 ====================
  const phase = ref<GamePhase>('title')
  const dayCount = ref(0)
  const gameDate = reactive<GameDate>({ year: 612, season: 'spring', day: 1 })
  const weather = ref<Weather>('sunny')
  const reputation = ref(50)
  const morale = ref(60)

  // ==================== 资源 ====================
  const resources = reactive<Resources>({ ...INITIAL_RESOURCES })

  // ==================== 建筑 ====================
  const buildings = ref<Building[]>([
    createBuilding('juyi_hall', 1),
    createBuilding('farmhouse', 1),
    createBuilding('farmland', 1),
  ])

  function createBuilding(type: string, level: number): Building {
    const data = BUILDING_DATA[type]
    return {
      id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: data.type,
      name: data.name,
      icon: data.icon,
      level,
      maxLevel: data.maxLevel,
      description: data.description,
      assignedHeroId: null,
      outputGold: data.outputGold * level,
      outputFood: data.outputFood * level,
      outputWood: data.outputWood * level,
      outputIron: data.outputIron * level,
      upgradeCost: getUpgradeCost(type, level),
      tags: data.tags,
    }
  }

  function getUpgradeCost(type: string, currentLevel: number): Resources {
    const data = BUILDING_DATA[type]
    const mult = BUILDING_UPGRADE_MULTIPLIER[currentLevel + 1] || 8
    return {
      gold: Math.floor(data.upgradeCost.gold * mult),
      food: Math.floor(data.upgradeCost.food * mult),
      wood: Math.floor(data.upgradeCost.wood * mult),
      iron: Math.floor(data.upgradeCost.iron * mult),
      population: 0,
    }
  }

  // ==================== 武将 ====================
  const heroes = ref<Hero[]>(
    HERO_BASE_DATA.map(h => ({
      ...h,
      stats: { ...h.stats },
      baseGrowth: { ...h.baseGrowth },
      skills: h.skills.map(s => ({ ...s, currentCooldown: s.currentCooldown || 0 }) as HeroSkill),
      equipment: { ...h.equipment },
      assignedBuildingId: null,
      affection: 0,
      loyalty: 50,
      recruited: false,
    }))
  )

  // ==================== 兵种 & 军队 ====================
  const troops = ref<Troop[]>(JSON.parse(JSON.stringify(TROOP_DATA)))
  const playerArmy = ref<{ type: TroopType; count: number }[]>([])

  // ==================== 势力 ====================
  const factions = ref<Faction[]>(JSON.parse(JSON.stringify(FACTION_DATA)))

  // ==================== 科技 ====================
  const technologies = ref<Technology[]>([
    { id: 'agriculture', name: '农业', icon: '🌾', description: '提升粮食产量', level: 1, maxLevel: 5, cost: { gold: 200, food: 50, wood: 100, iron: 20, population: 0 }, effect: '粮食产出+10%/级', effectValue: 10 },
    { id: 'military', name: '军事', icon: '⚔️', description: '提升军队攻击', level: 1, maxLevel: 5, cost: { gold: 300, food: 100, wood: 150, iron: 50, population: 0 }, effect: '军队攻击+8%/级', effectValue: 8 },
    { id: 'defense', name: '防御', icon: '🛡️', description: '提升军队防御', level: 1, maxLevel: 5, cost: { gold: 300, food: 80, wood: 200, iron: 60, population: 0 }, effect: '军队防御+8%/级', effectValue: 8 },
    { id: 'economy', name: '经济', icon: '💰', description: '提升钱币收入', level: 1, maxLevel: 5, cost: { gold: 250, food: 50, wood: 100, iron: 30, population: 0 }, effect: '钱币收入+10%/级', effectValue: 10 },
    { id: 'firearms', name: '火器', icon: '💥', description: '解锁火铳兵科技', level: 1, maxLevel: 5, cost: { gold: 500, food: 100, wood: 200, iron: 100, population: 0 }, effect: '火铳兵攻击+15%/级', effectValue: 15 },
    { id: 'cavalry_tech', name: '骑术', icon: '🐴', description: '提升骑兵战力', level: 1, maxLevel: 5, cost: { gold: 400, food: 150, wood: 100, iron: 80, population: 0 }, effect: '骑兵速度+10%/级', effectValue: 10 },
  ])

  // ==================== 战斗 ====================
  const combat = reactive<CombatState>({
    active: false,
    enemy: null,
    playerTroops: [],
    enemyTroops: [],
    playerFormation: 'crane',
    enemyFormation: 'fish_scale',
    morale: 100,
    enemyMorale: 100,
    turn: 0,
    log: [],
    phase: 'preparation',
    winner: null,
  })

  // ==================== 故事 ====================
  const storyQueue = ref<StoryNode[]>([])
  const currentStoryNode = ref<StoryNode | null>(null)
  const dialogueHistory = ref<string[]>([])
  const storyFlags = ref<Record<string, boolean>>({ opening_done: false })
  const storyVariables = ref<Record<string, number>>({ benevolence: 50, conquest: 0 })

  // ==================== 当前面板 ====================
  type PanelType = 'village' | 'build' | 'heroes' | 'military' | 'combat' | 'map' | 'tech' | 'story'
  const currentPanel = ref<PanelType>('village')

  // ==================== 计算属性 ====================
  const seasonName = computed(() => {
    const map: Record<Season, string> = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }
    return map[gameDate.season]
  })

  const weatherName = computed(() => {
    const map: Record<Weather, string> = { sunny: '☀️晴', cloudy: '☁️阴', light_rain: '🌧️小雨', heavy_rain: '⛈️暴雨', fog: '🌫️大雾', snow: '❄️暴雪', sandstorm: '🌪️沙暴' }
    return map[weather.value]
  })

  const dateString = computed(() =>
    `大业${gameDate.year}年 · ${seasonName.value} · 第${gameDate.day}日`
  )

  const availableBuildings = computed(() =>
    Object.entries(BUILDING_DATA).filter(([type]) =>
      !buildings.value.some(b => b.type === type)
    ).map(([type, data]) => ({ type, ...data }))
  )

  const recruitedHeroes = computed(() => heroes.value.filter(h => h.recruited))
  const availableHeroes = computed(() => heroes.value.filter(h => !h.recruited))
  const unassignedHeroes = computed(() => recruitedHeroes.value.filter(h => !h.assignedBuildingId))

  const totalArmyCount = computed(() => playerArmy.value.reduce((s, t) => s + t.count, 0))
  const availableTroopTypes = computed(() => troops.value.filter(t => !t.hidden || checkUnlockCondition(t.unlockCondition)))

  function checkUnlockCondition(condition: string): boolean {
    if (!condition) return true
    const parts = condition.split('+')
    return parts.every(p => {
      const trimmed = p.trim()
      if (trimmed.includes('马厩Lv')) {
        const lv = parseInt(trimmed.match(/\d+/)![0])
        return buildings.value.some(b => b.type === 'stable' && b.level >= lv)
      }
      if (trimmed.includes('铁匠铺Lv')) {
        const lv = parseInt(trimmed.match(/\d+/)![0])
        return buildings.value.some(b => b.type === 'smithy' && b.level >= lv)
      }
      if (trimmed.includes('科技')) {
        const techMatch = trimmed.match(/['""](.+)['""].*Lv(\d+)/)
        if (techMatch) {
          const techName = techMatch[1]
          const lv = parseInt(techMatch[2])
          const techMap: Record<string, string> = { '火器': 'firearms', '骑术': 'cavalry_tech', '防具': 'defense' }
          const techId = techMap[techName]
          return technologies.value.some(t => t.id === techId && t.level >= lv)
        }
      }
      if (trimmed.includes('招募')) {
        const heroName = trimmed.replace('招募', '').trim()
        const hero = heroes.value.find(h => h.name === heroName)
        return hero?.recruited ?? false
      }
      return true
    })
  }

  const chainBonuses = computed(() => {
    const active: string[] = []
    for (const [name, config] of Object.entries(CHAIN_BONUSES)) {
      if (config.required.every(type => buildings.value.some(b => b.type === type && b.level >= 2))) {
        active.push(`${name}: ${config.bonus}`)
      }
    }
    return active
  })

  // ==================== 时间推进 ====================
  function advanceDay(days: number = 1) {
    for (let i = 0; i < days; i++) {
      gameDate.day++
      dayCount.value++
      if (gameDate.day > 30) {
        gameDate.day = 1
        const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter']
        const idx = seasons.indexOf(gameDate.season)
        if (idx === 3) {
          gameDate.season = 'spring'
          gameDate.year++
        } else {
          gameDate.season = seasons[idx + 1]
        }
        // 季节切换时结算产出
        collectResources()
        // 季节叙事
        generateSeasonNarrative()
        // 检查节日
        checkFestivals()
      }
      // 武将技能冷却
      heroes.value.forEach(h => {
        h.skills.forEach(s => {
          if (s.currentCooldown && s.currentCooldown > 0) s.currentCooldown--
        })
      })
      // 随机事件 (5% per day)
      if (Math.random() < 0.05) generateRandomEvent()
      // 天气变化 (10% per day)
      if (Math.random() < 0.1) changeWeather()
    }
  }

  function collectResources() {
    let totalGold = 0, totalFood = 0, totalWood = 0, totalIron = 0

    buildings.value.forEach(b => {
      let mult = 1.0
      // 武将分配加成
      if (b.assignedHeroId) {
        const hero = heroes.value.find(h => h.id === b.assignedHeroId)
        if (hero) mult += hero.stats.politics / 100
      }
      // 连锁加成
      chainBonuses.value.forEach(bonus => {
        if (b.tags.some(t => bonus.includes(t))) mult += 0.05
      })

      totalGold += Math.floor(b.outputGold * mult)
      totalFood += Math.floor(b.outputFood * mult)
      totalWood += Math.floor(b.outputWood * mult)
      totalIron += Math.floor(b.outputIron * mult)
    })

    // 季节修正
    const seasonMult: Record<Season, number> = { spring: 1.1, summer: 1.0, autumn: 1.2, winter: 0.8 }
    const sm = seasonMult[gameDate.season]
    totalFood = Math.floor(totalFood * sm)
    totalGold = Math.floor(totalGold * sm)

    // 科技加成
    const ecoTech = technologies.value.find(t => t.id === 'economy')
    if (ecoTech) totalGold = Math.floor(totalGold * (1 + ecoTech.level * ecoTech.effectValue / 100))
    const agriTech = technologies.value.find(t => t.id === 'agriculture')
    if (agriTech) totalFood = Math.floor(totalFood * (1 + agriTech.level * agriTech.effectValue / 100))

    resources.gold += totalGold
    resources.food += totalFood
    resources.wood += totalWood
    resources.iron += totalIron

    // 粮食消耗（人口+军队）
    const consumption = Math.floor(resources.population * 0.5 + totalArmyCount.value * 0.3)
    resources.food -= consumption
    if (resources.food < 0) {
      resources.food = 0
      morale -= 5
      addLog('⚠️ 粮食耗尽！士气下降……')
    }

    // 人口自然增长
    if (resources.food > 100 && morale > 50) {
      resources.population += Math.floor(Math.random() * 3) + 1
    }
  }

  function generateSeasonNarrative() {
    const narratives = SEASON_NARRATIVES[gameDate.season]
    if (narratives) {
      const text = narratives[Math.floor(Math.random() * narratives.length)]
      dialogueHistory.value.push(`📜 ${text}`)
    }
  }

  function checkFestivals() {
    if (gameDate.season === 'spring' && gameDate.day <= 3) {
      const events = FESTIVAL_EVENTS['spring_festival']
      if (events) storyQueue.value.push(...events)
    }
    if (gameDate.season === 'summer' && gameDate.day === 5) {
      const events = FESTIVAL_EVENTS['dragon_boat']
      if (events) storyQueue.value.push(...events)
    }
  }

  function generateRandomEvent() {
    if (storyQueue.value.length > 0) return
    const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
    storyQueue.value.push({ ...event, id: event.id + '_' + Date.now() })
  }

  function changeWeather() {
    const weathers: Weather[] = ['sunny', 'sunny', 'sunny', 'cloudy', 'cloudy', 'light_rain', 'heavy_rain', 'fog', 'snow']
    weather.value = weathers[Math.floor(Math.random() * weathers.length)]
  }

  // ==================== 建筑操作 ====================
  function buildNewBuilding(type: string): string {
    const existing = buildings.value.find(b => b.type === type)
    if (existing) return '该建筑已存在！'

    const cost = BUILDING_DATA[type]
    if (!cost) return '未知建筑类型'

    // 收取建造费（基础费用）
    const buildCost = { gold: type === 'juyi_hall' ? 300 : type === 'stable' ? 200 : type === 'pawnshop' ? 250 : type === 'altar' ? 200 : 150, food: 30, wood: 40, iron: 10, population: 0 }

    if (resources.gold < buildCost.gold) return '钱币不足！'
    if (resources.wood < buildCost.wood) return '木材不足！'

    resources.gold -= buildCost.gold
    resources.wood -= buildCost.wood

    const building = createBuilding(type, 1)
    buildings.value.push(building)
    addLog(`🏗️ 建成了【${building.name}】！`)
    return ''
  }

  function upgradeBuilding(buildingId: string): string {
    const building = buildings.value.find(b => b.id === buildingId)
    if (!building) return '建筑不存在'
    if (building.level >= building.maxLevel) return '已达最高等级！'

    const cost = getUpgradeCost(building.type, building.level)
    if (resources.gold < cost.gold) return '钱币不足！'
    if (resources.wood < cost.wood) return '木材不足！'
    if (resources.iron < cost.iron) return '铁矿不足！'

    resources.gold -= cost.gold
    resources.wood -= cost.wood
    resources.iron -= cost.iron

    building.level++
    const data = BUILDING_DATA[building.type]
    building.outputGold = data.outputGold * building.level
    building.outputFood = data.outputFood * building.level
    building.outputWood = data.outputWood * building.level
    building.outputIron = data.outputIron * building.level
    building.upgradeCost = getUpgradeCost(building.type, building.level)

    addLog(`⬆️ 【${building.name}】升级到 Lv${building.level}！`)
    
    // 升级后重算连锁
    return ''
  }

  function assignHeroToBuilding(heroId: string, buildingId: string): string {
    const hero = heroes.value.find(h => h.id === heroId)
    const building = buildings.value.find(b => b.id === buildingId)
    if (!hero || !building) return '无效操作'

    // 先解除旧的分配
    if (hero.assignedBuildingId) {
      const oldBuilding = buildings.value.find(b => b.id === hero.assignedBuildingId)
      if (oldBuilding) oldBuilding.assignedHeroId = null
    }
    if (building.assignedHeroId) {
      const oldHero = heroes.value.find(h => h.id === building.assignedHeroId)
      if (oldHero) oldHero.assignedBuildingId = null
    }

    hero.assignedBuildingId = buildingId
    building.assignedHeroId = heroId
    addLog(`👤 ${hero.name}被派往【${building.name}】工作`)
    return ''
  }

  function unassignHero(heroId: string) {
    const hero = heroes.value.find(h => h.id === heroId)
    if (!hero || !hero.assignedBuildingId) return
    const building = buildings.value.find(b => b.id === hero.assignedBuildingId)
    if (building) {
      building.assignedHeroId = null
      addLog(`👤 ${hero.name}离开了【${building.name}】`)
    }
    hero.assignedBuildingId = null
  }

  // ==================== 武将操作 ====================
  function recruitHero(heroId: string): string {
    const hero = heroes.value.find(h => h.id === heroId)
    if (!hero) return '武将不存在'
    if (hero.recruited) return '已招募'

    const cost = HERO_RECRUIT_COSTS[heroId]
    if (!cost) return '招募配置不存在'
    if (resources.gold < cost.gold) return '钱币不足！'
    if (cost.condition) {
      const cond = cost.condition
      if (cond.includes('声望') && reputation < parseInt(cond.match(/\d+/)![0])) return '声望不足！'
    }

    resources.gold -= cost.gold
    hero.recruited = true
    hero.loyalty = 50 + Math.floor(Math.random() * 20)
    hero.affection = 10
    addLog(`🌟 招募了武将【${hero.name}】！`)
    return ''
  }

  function levelUpHero(heroId: string): string {
    const hero = heroes.value.find(h => h.id === heroId)
    if (!hero) return '武将不存在'
    if (hero.exp < hero.expToNext) return '经验不足！'

    hero.level++
    hero.exp -= hero.expToNext
    hero.expToNext = expToNextLevel(hero.level)
    hero.stats.martial += hero.baseGrowth.martial
    hero.stats.intelligence += hero.baseGrowth.intelligence
    hero.stats.command += hero.baseGrowth.command
    hero.stats.politics += hero.baseGrowth.politics
    hero.stats.charisma += hero.baseGrowth.charisma

    // 每5级解锁技能升级
    if (hero.level % 5 === 0) {
      hero.skills.forEach(s => {
        if (s.level < s.maxLevel) s.level++
      })
    }

    addLog(`⬆️ ${hero.name}升到了Lv${hero.level}！`)
    return ''
  }

  function giveGift(heroId: string, giftName: string): string {
    const hero = heroes.value.find(h => h.id === heroId)
    if (!hero) return '武将不存在'
    if (resources.gold < 50) return '钱币不足（送礼消耗50💰）'

    resources.gold -= 50
    const liked = hero.giftPreferences.some(g => giftName.includes(g))
    const gain = liked ? 10 : 5
    hero.affection = Math.min(100, hero.affection + gain)
    hero.loyalty = Math.min(100, hero.loyalty + Math.floor(gain / 2))
    addLog(`🎁 送给${hero.name}一份礼物，好感度${liked ? '大幅' : ''}提升！`)
    return ''
  }

  // ==================== 军队操作 ====================
  function trainTroop(type: TroopType, count: number = 1): string {
    const troopData = troops.value.find(t => t.id === type)
    if (!troopData) return '兵种不存在'
    if (troopData.hidden && !checkUnlockCondition(troopData.unlockCondition)) return '兵种未解锁'

    const cost = {
      gold: troopData.cost.gold * count,
      food: troopData.cost.food * count,
      wood: troopData.cost.wood * count,
      iron: troopData.cost.iron * count,
    }

    if (resources.gold < cost.gold) return '钱币不足！'
    if (resources.food < cost.food) return '粮食不足！'
    if (resources.population < count) return '人口不足！'

    resources.gold -= cost.gold
    resources.food -= cost.food
    resources.wood -= cost.wood
    resources.iron -= cost.iron
    resources.population -= count

    const existing = playerArmy.value.find(t => t.type === type)
    if (existing) {
      existing.count += count
    } else {
      playerArmy.value.push({ type, count })
    }
    addLog(`⚔️ 训练了${count}名${troopData.name}`)
    return ''
  }

  // ==================== 战斗 ====================
  function startCombat(factionId: string): string {
    const faction = factions.value.find(f => f.id === factionId)
    if (!faction) return '势力不存在'
    if (faction.defeated) return '该势力已被击败'
    if (totalArmyCount.value === 0) return '没有军队可以出战！'

    combat.active = true
    combat.enemy = faction
    combat.playerTroops = playerArmy.value.map(t => ({ ...t }))
    combat.enemyTroops = faction.troops.map(t => ({ ...t }))
    combat.morale = morale
    combat.enemyMorale = 80 + Math.floor(Math.random() * 20)
    combat.turn = 0
    combat.log = []
    combat.phase = 'battle'
    combat.winner = null

    const startMsg = COMBAT_NARRATIVES.start[Math.floor(Math.random() * COMBAT_NARRATIVES.start.length)]
    combat.log.push(startMsg)
    combat.log.push(`⚔️ 敌方：${faction.name}，战力${faction.power}`)
    combat.log.push(`👥 我方兵力：${totalArmyCount.value}人 | 敌方兵力：${faction.troops.reduce((s, t) => s + t.count, 0)}人`)

    return ''
  }

  function executeCombatTurn(): string {
    if (!combat.active || combat.phase !== 'battle') return ''

    combat.turn++
    combat.log.push(`\n--- 第${combat.turn}回合 ---`)

    // 我方攻击
    const playerAttack = calculateAttack(true)
    const enemyDefense = calculateDefense(false)
    const playerDamage = Math.max(1, Math.floor(playerAttack - enemyDefense * 0.5 + Math.random() * 20))
    const enemyTotalTroops = combat.enemyTroops.reduce((s, t) => s + t.count, 0)
    const enemyKilled = Math.min(enemyTotalTroops, playerDamage)

    // 削减敌方兵力
    let remainingKill = enemyKilled
    for (let i = combat.enemyTroops.length - 1; i >= 0 && remainingKill > 0; i--) {
      const troop = combat.enemyTroops[i]
      const killed = Math.min(troop.count, remainingKill)
      troop.count -= killed
      remainingKill -= killed
    }
    combat.enemyTroops = combat.enemyTroops.filter(t => t.count > 0)

    if (combat.log.length < 20) {
      combat.log.push(`⚔️ 我军出击！歼敌${enemyKilled}人。`)
    }

    // 敌方攻击
    if (combat.enemyTroops.length > 0) {
      const enemyAttack = calculateAttack(false)
      const playerDefense = calculateDefense(true)
      const enemyDamage = Math.max(1, Math.floor(enemyAttack - playerDefense * 0.5 + Math.random() * 15))
      const playerTotalTroops = combat.playerTroops.reduce((s, t) => s + t.count, 0)
      const playerKilled = Math.min(playerTotalTroops, enemyDamage)

      let remainingPKill = playerKilled
      for (let i = combat.playerTroops.length - 1; i >= 0 && remainingPKill > 0; i--) {
        const troop = combat.playerTroops[i]
        const killed = Math.min(troop.count, remainingPKill)
        troop.count -= killed
        remainingPKill -= killed
      }
      combat.playerTroops = combat.playerTroops.filter(t => t.count > 0)

      if (combat.log.length < 20) {
        combat.log.push(`🛡️ 敌军反击！我军损失${playerKilled}人。`)
      }
    }

    // 士气变化
    if (enemyKilled > playerDamage * 1.3) {
      combat.enemyMorale = Math.max(0, combat.enemyMorale - 5)
      combat.morale = Math.min(100, combat.morale + 2)
    }

    // 检查结束
    const remainingEnemyTroops = combat.enemyTroops.reduce((s, t) => s + t.count, 0)
    const remainingPlayerTroops = combat.playerTroops.reduce((s, t) => s + t.count, 0)

    if (remainingEnemyTroops <= 0) {
      return endCombat('player')
    }
    if (remainingPlayerTroops <= 0) {
      return endCombat('enemy')
    }
    if (combat.turn >= 30) {
      // 30回合平局
      if (remainingEnemyTroops < remainingPlayerTroops) return endCombat('player')
      return endCombat('enemy')
    }

    return ''
  }

  function autoCombat(): string {
    while (combat.active && combat.phase === 'battle') {
      const result = executeCombatTurn()
      if (result) return result
    }
    return ''
  }

  function calculateAttack(isPlayer: boolean): number {
    const troops = isPlayer ? combat.playerTroops : combat.enemyTroops
    let totalAttack = 0
    const visitedTypes = new Set<TroopType>()
    
    troops.forEach(t => {
      const data = TROOP_DATA.find(d => d.id === t.type)
      if (data) {
        let attack = data.baseAttack
        // 科技加成
        if (isPlayer) {
          const milTech = technologies.value.find(tech => tech.id === 'military')
          if (milTech) attack *= (1 + milTech.level * milTech.effectValue / 100)
        }
        // 武将加成
        if (isPlayer) {
          const fighters = recruitedHeroes.value.filter(h => h.stats.martial > 60)
          if (fighters.length > 0) {
            const avgMartial = fighters.reduce((s, h) => s + h.stats.martial, 0) / fighters.length
            attack *= (1 + avgMartial / 200)
          }
        }
        totalAttack += attack * t.count
        visitedTypes.add(t.type)
      }
    })

    // 士气影响
    const morale = isPlayer ? combat.morale : combat.enemyMorale
    totalAttack *= (0.7 + morale / 200)

    return Math.floor(totalAttack)
  }

  function calculateDefense(isPlayer: boolean): number {
    const troops = isPlayer ? combat.playerTroops : combat.enemyTroops
    let totalDefense = 0
    troops.forEach(t => {
      const data = TROOP_DATA.find(d => d.id === t.type)
      if (data) {
        let def = data.baseDefense
        if (isPlayer) {
          const defTech = technologies.value.find(tech => tech.id === 'defense')
          if (defTech) def *= (1 + defTech.level * defTech.effectValue / 100)
        }
        totalDefense += def * t.count
      }
    })
    return Math.floor(totalDefense)
  }

  function endCombat(winner: 'player' | 'enemy'): string {
    combat.phase = 'result'
    combat.winner = winner

    if (winner === 'player' && combat.enemy) {
      const faction = combat.enemy
      faction.defeated = true
      resources.gold += faction.rewards.gold
      resources.food += faction.rewards.food
      resources.wood += faction.rewards.wood
      resources.iron += faction.rewards.iron
      reputation += 30

      // 经验分配
      recruitedHeroes.value.forEach(h => {
        h.exp += Math.floor(Math.random() * 50) + 20
      })

      const vicMsg = COMBAT_NARRATIVES.victory[Math.floor(Math.random() * COMBAT_NARRATIVES.victory.length)]
      combat.log.push(vicMsg)
      combat.log.push(`🎁 获得战利品：💰${faction.rewards.gold} 🌾${faction.rewards.food} 🪵${faction.rewards.wood} ⛏${faction.rewards.iron}`)
      combat.log.push(`⭐ 声望+30`)

      // 更新实际军队
      playerArmy.value = combat.playerTroops.map(t => ({ ...t }))
      return 'victory'
    } else {
      const defMsg = COMBAT_NARRATIVES.defeat[Math.floor(Math.random() * COMBAT_NARRATIVES.defeat.length)]
      combat.log.push(defMsg)
      morale = Math.max(0, morale - 20)
      // 军队损失
      playerArmy.value = combat.playerTroops.map(t => ({ ...t }))
      playerArmy.value = playerArmy.value.filter(t => t.count > 0)
      return 'defeat'
    }
  }

  function endCombatSession() {
    combat.active = false
    combat.enemy = null
    combat.playerTroops = []
    combat.enemyTroops = []
    combat.log = []
    combat.turn = 0
    combat.phase = 'preparation'
    combat.winner = null
    currentPanel.value = 'village'
  }

  // ==================== 故事系统 ====================
  function startGame() {
    phase.value = 'playing'
    storyFlags.value.opening_done = false
    storyQueue.value = [...OPENING_STORY]
    processNextStory()
  }

  function processNextStory() {
    if (storyQueue.value.length > 0) {
      currentStoryNode.value = storyQueue.value.shift()!
    } else {
      currentStoryNode.value = null
    }
  }

  function makeChoice(choiceIndex: number) {
    if (!currentStoryNode.value?.choices) return
    const choice = currentStoryNode.value.choices[choiceIndex]
    if (!choice) return

    // 应用效果
    if (choice.effects) {
      applyEffects(choice.effects)
    }

    if (choice.next && choice.next !== '') {
      // 推进到指定节点
      const nextNode = [...OPENING_STORY, ...RANDOM_EVENTS].find(n => n.id === choice.next)
      if (nextNode) {
        currentStoryNode.value = { ...nextNode, id: nextNode.id + '_' + Date.now() }
        if (nextNode.onEnter) applyEffects(nextNode.onEnter)
      } else {
        currentStoryNode.value = null
      }
    } else {
      currentStoryNode.value = null
    }
  }

  function applyEffects(effects: { type: string; value: number }[]) {
    effects.forEach(e => {
      switch (e.type) {
        case 'gold': resources.gold += e.value; break
        case 'food': resources.food += e.value; break
        case 'wood': resources.wood += e.value; break
        case 'iron': resources.iron += e.value; break
        case 'population': resources.population += e.value; break
        case 'morale': morale = Math.min(100, Math.max(0, morale + e.value)); break
        case 'reputation': reputation += e.value; break
        case 'troop_infantry': {
          const existing = playerArmy.value.find(t => t.type === 'infantry')
          if (existing) existing.count += e.value
          else playerArmy.value.push({ type: 'infantry', count: e.value })
          break
        }
        case 'hero_exp': {
          recruitedHeroes.value.forEach(h => { h.exp += e.value })
          break
        }
      }
    })
  }

  // ==================== 日志 ====================
  function addLog(msg: string) {
    dialogueHistory.value.push(msg)
    if (dialogueHistory.value.length > 100) {
      dialogueHistory.value = dialogueHistory.value.slice(-50)
    }
  }

  // ==================== 存档 ====================
  function saveGame(slot: number) {
    const data: SaveData = {
      version: '0.1.0',
      date: new Date().toISOString(),
      gameDate: { ...gameDate },
      resources: { ...resources },
      buildings: JSON.parse(JSON.stringify(buildings.value)),
      heroes: JSON.parse(JSON.stringify(heroes.value)),
      troops: JSON.parse(JSON.stringify(playerArmy.value)),
      technologies: JSON.parse(JSON.stringify(technologies.value)),
      factions: JSON.parse(JSON.stringify(factions.value)),
      reputation: reputation,
      morale: morale,
      dayCount: dayCount.value,
      storyFlags: { ...storyFlags.value },
      storyVariables: { ...storyVariables.value },
    }
    localStorage.setItem(`suitang_save_${slot}`, JSON.stringify(data))
    addLog(`💾 存档已保存到槽位${slot + 1}`)
    return true
  }

  function loadGame(slot: number): boolean {
    const raw = localStorage.getItem(`suitang_save_${slot}`)
    if (!raw) return false

    try {
      const data: SaveData = JSON.parse(raw)
      Object.assign(gameDate, data.gameDate)
      Object.assign(resources, data.resources)
      buildings.value = data.buildings
      heroes.value = data.heroes
      playerArmy.value = data.troops
      technologies.value = data.technologies
      factions.value = data.factions
      reputation = data.reputation
      morale = data.morale
      dayCount.value = data.dayCount
      storyFlags.value = data.storyFlags
      storyVariables.value = data.storyVariables
      phase.value = 'playing'
      currentStoryNode.value = null
      storyQueue.value = []
      addLog(`📂 存档已从槽位${slot + 1}读取`)
      return true
    } catch {
      return false
    }
  }

  function getSaveInfo(slot: number): { exists: boolean; date: string; year: number; gold: number } | null {
    const raw = localStorage.getItem(`suitang_save_${slot}`)
    if (!raw) return null
    try {
      const data: SaveData = JSON.parse(raw)
      return { exists: true, date: data.date, year: data.gameDate.year, gold: data.resources.gold }
    } catch {
      return null
    }
  }

  function deleteSave(slot: number) {
    localStorage.removeItem(`suitang_save_${slot}`)
  }

  // ==================== 初始化 ====================
  function init() {
    // 重置所有状态到初始值
  }

  return {
    // State
    phase, dayCount, gameDate, weather, reputation, morale,
    resources,
    buildings,
    heroes,
    troops, playerArmy,
    factions,
    technologies,
    combat,
    storyQueue, currentStoryNode, dialogueHistory, storyFlags, storyVariables,
    currentPanel,
    // Computed
    seasonName, weatherName, dateString,
    availableBuildings, recruitedHeroes, availableHeroes, unassignedHeroes,
    totalArmyCount, availableTroopTypes, chainBonuses,
    // Actions
    advanceDay, collectResources,
    buildNewBuilding, upgradeBuilding, assignHeroToBuilding, unassignHero,
    recruitHero, levelUpHero, giveGift,
    trainTroop,
    startCombat, executeCombatTurn, autoCombat, endCombatSession,
    startGame, processNextStory, makeChoice,
    addLog,
    saveGame, loadGame, getSaveInfo, deleteSave,
    checkUnlockCondition,
    init,
  }
})
