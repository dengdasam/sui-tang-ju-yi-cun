// ==================== 核心类型定义 ====================

// --- 资源 ---
export interface Resources {
  gold: number       // 钱币
  food: number       // 粮食
  wood: number       // 木材
  iron: number       // 铁矿
  population: number // 人口
}

// --- 建筑 ---
export type BuildingType = 
  | 'juyi_hall' | 'farmhouse' | 'farmland' | 'lumber_mill' 
  | 'mine' | 'smithy' | 'barracks' | 'stable' | 'cloth_shop'
  | 'tavern' | 'pawnshop' | 'hospital' | 'altar'

export interface Building {
  id: string
  type: BuildingType
  name: string
  icon: string
  level: number        // 1-5
  maxLevel: number
  description: string
  assignedHeroId: string | null
  // 产出 (per season)
  outputGold: number
  outputFood: number
  outputWood: number
  outputIron: number
  // 升级消耗
  upgradeCost: Resources
  // 连锁加成标签
  tags: string[]
}

// --- 武将 ---
export type HeroGrade = 'SSS' | 'SS' | 'S' | 'A'

export interface HeroStats {
  martial: number    // 武力
  intelligence: number // 智力
  command: number     // 统率
  politics: number    // 政治
  charisma: number    // 魅力
}

export interface HeroSkill {
  id: string
  name: string
  description: string
  level: number       // 1-5
  maxLevel: number
  type: 'active' | 'passive'
  cooldown?: number
  currentCooldown?: number
}

export interface HeroEquipment {
  weapon: string | null
  armor: string | null
  mount: string | null
  treasure: string | null
}

export interface Hero {
  id: string
  name: string
  title: string
  icon: string
  grade: HeroGrade
  level: number
  exp: number
  expToNext: number
  stats: HeroStats
  baseGrowth: HeroStats    // 每级成长
  skills: HeroSkill[]
  equipment: HeroEquipment
  affection: number        // 好感度 0-100
  loyalty: number          // 忠诚度 0-100
  assignedBuildingId: string | null
  biography: string
  giftPreferences: string[]
  recruited: boolean
}

// --- 兵种 ---
export type TroopType = 'infantry' | 'archer' | 'musketeer' | 'cavalry' | 'elite_cavalry' | 'heavy_armor' | 'divine_engineer'

export interface Troop {
  id: TroopType
  name: string
  icon: string
  baseAttack: number
  baseDefense: number
  baseSpeed: number
  cost: Resources       // 训练消耗
  strongAgainst: TroopType[]
  weakAgainst: TroopType[]
  hidden: boolean
  unlockCondition: string
}

// --- 势力 ---
export interface Faction {
  id: string
  name: string
  description: string
  power: number         // 战力
  territory: string
  troops: { type: TroopType; count: number }[]
  rewards: Resources
  defeated: boolean
  specialMechanic: string
}

// --- 科技 ---
export interface Technology {
  id: string
  name: string
  icon: string
  description: string
  level: number       // 1-5
  maxLevel: number
  cost: Resources
  effect: string
  effectValue: number
}

// --- 季节与日期 ---
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type Weather = 'sunny' | 'cloudy' | 'light_rain' | 'heavy_rain' | 'fog' | 'snow' | 'sandstorm'

export interface GameDate {
  year: number          // 起始年
  season: Season
  day: number           // 1-90 (每季90日)
}

// --- 战斗 ---
export type FormationType = 'crane' | 'fish_scale' | 'arrow' | 'circle' | 'snake' | 'dragon' | 'turtle'

export interface Formation {
  id: FormationType
  name: string
  description: string
  attackBonus: number
  defenseBonus: number
  speedBonus: number
  strongAgainst: FormationType[]
  weakAgainst: FormationType[]
}

export interface CombatState {
  active: boolean
  enemy: Faction | null
  playerTroops: { type: TroopType; count: number }[]
  enemyTroops: { type: TroopType; count: number }[]
  playerFormation: FormationType
  enemyFormation: FormationType
  morale: number        // 0-100
  enemyMorale: number
  turn: number
  log: string[]
  phase: 'preparation' | 'battle' | 'result'
  winner: 'player' | 'enemy' | null
}

// --- 地图 ---
export type LocationType = 'capital' | 'minor' | 'special'

export interface MapLocation {
  id: string
  name: string
  type: LocationType
  description: string
  connectedTo: string[]
  distance: number      // 距离屯兵寨的移动天数
  explored: boolean
  events: string[]
  factionId: string | null
}

// --- 道具 ---
export type ItemType = 'consumable' | 'gift' | 'weapon' | 'armor' | 'mount' | 'treasure'

export interface Item {
  id: string
  name: string
  type: ItemType
  description: string
  icon: string
  price: number
  effect: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// --- 结局 ---
export type EndingType = 'lingyan_pavilion' | 'retire' | 'new_dynasty' | 'warlord' | 'hermit' | 'death'

// --- 游戏阶段 ---
export type GamePhase = 'title' | 'playing' | 'combat' | 'ending'

// --- 存档 ---
export interface SaveData {
  version: string
  date: string
  gameDate: GameDate
  resources: Resources
  buildings: Building[]
  heroes: Hero[]
  troops: { type: TroopType; count: number }[]
  technologies: Technology[]
  factions: Faction[]
  reputation: number
  morale: number
  dayCount: number
  storyFlags: Record<string, boolean>
  storyVariables: Record<string, number>
}

// --- 故事节点 ---
export type StoryNodeType = 'narration' | 'dialogue' | 'choice' | 'event'

export interface StoryChoice {
  text: string
  next: string
  effects?: { type: string; value: number }[]
  condition?: string
}

export interface StoryNode {
  id: string
  type: StoryNodeType
  speaker?: string
  content?: string
  dialogue?: { speaker: string; content: string; emotion?: string }[]
  choices?: StoryChoice[]
  next?: string
  onEnter?: { type: string; value: number }[]
  background?: string
}
