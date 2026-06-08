import type { Building, Resources } from '../types'

// 初始资源
export const INITIAL_RESOURCES: Resources = {
  gold: 1000,
  food: 500,
  wood: 200,
  iron: 50,
  population: 30,
}

// 建筑数据 — 13种建筑 × 5级
export const BUILDING_DATA: Record<string, Omit<Building, 'id' | 'assignedHeroId' | 'level'>> = {
  juyi_hall: {
    type: 'juyi_hall', name: '聚义厅', icon: '🏛️', maxLevel: 5,
    description: '寨子的核心建筑，决定寨子等级上限',
    outputGold: 50, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 0, food: 0, wood: 0, iron: 0, population: 0 },
    tags: ['核心'],
  },
  farmhouse: {
    type: 'farmhouse', name: '农舍', icon: '🏠', maxLevel: 5,
    description: '人口住所，每级+5人口上限',
    outputGold: 0, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 50, food: 20, wood: 40, iron: 0, population: 0 },
    tags: ['民生'],
  },
  farmland: {
    type: 'farmland', name: '农田', icon: '🌾', maxLevel: 5,
    description: '产出粮食',
    outputGold: 0, outputFood: 40, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 40, food: 10, wood: 30, iron: 5, population: 0 },
    tags: ['民生', '生产'],
  },
  lumber_mill: {
    type: 'lumber_mill', name: '伐木场', icon: '🪓', maxLevel: 5,
    description: '产出木材',
    outputGold: 0, outputFood: 0, outputWood: 35, outputIron: 0,
    upgradeCost: { gold: 50, food: 15, wood: 20, iron: 10, population: 0 },
    tags: ['生产'],
  },
  mine: {
    type: 'mine', name: '矿场', icon: '⛏️', maxLevel: 5,
    description: '产出铁矿',
    outputGold: 0, outputFood: 0, outputWood: 0, outputIron: 30,
    upgradeCost: { gold: 70, food: 20, wood: 40, iron: 15, population: 0 },
    tags: ['生产'],
  },
  smithy: {
    type: 'smithy', name: '铁匠铺', icon: '⚒️', maxLevel: 5,
    description: '锻造武器防具，提升军队攻击',
    outputGold: 60, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 100, food: 30, wood: 50, iron: 30, population: 0 },
    tags: ['军事', '生产'],
  },
  barracks: {
    type: 'barracks', name: '军营', icon: '🏕️', maxLevel: 5,
    description: '训练士兵，每级+10军队上限',
    outputGold: 0, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 80, food: 40, wood: 60, iron: 20, population: 0 },
    tags: ['军事'],
  },
  stable: {
    type: 'stable', name: '马厩', icon: '🐴', maxLevel: 5,
    description: '饲养战马，提升骑兵战力',
    outputGold: 0, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 120, food: 50, wood: 80, iron: 30, population: 0 },
    tags: ['军事'],
  },
  cloth_shop: {
    type: 'cloth_shop', name: '布庄', icon: '🧵', maxLevel: 5,
    description: '织布制衣，产出钱币',
    outputGold: 80, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 60, food: 10, wood: 30, iron: 5, population: 0 },
    tags: ['民生', '生产'],
  },
  tavern: {
    type: 'tavern', name: '酒肆', icon: '🍶', maxLevel: 5,
    description: '酒馆交易，产出钱币+提升武将好感',
    outputGold: 70, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 80, food: 30, wood: 50, iron: 10, population: 0 },
    tags: ['民生'],
  },
  pawnshop: {
    type: 'pawnshop', name: '当铺', icon: '🏪', maxLevel: 5,
    description: '典当交易，产出大量钱币',
    outputGold: 100, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 150, food: 20, wood: 40, iron: 20, population: 0 },
    tags: ['民生', '生产'],
  },
  hospital: {
    type: 'hospital', name: '医馆', icon: '🏥', maxLevel: 5,
    description: '治疗伤病，减少战损',
    outputGold: 0, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 100, food: 30, wood: 50, iron: 20, population: 0 },
    tags: ['民生', '军事'],
  },
  altar: {
    type: 'altar', name: '祭坛', icon: '🔮', maxLevel: 5,
    description: '祭祀祈福，提升民心和威望',
    outputGold: 30, outputFood: 0, outputWood: 0, outputIron: 0,
    upgradeCost: { gold: 120, food: 40, wood: 60, iron: 40, population: 0 },
    tags: ['民生', '特殊'],
  },
}

// 建筑升级消耗倍率
export const BUILDING_UPGRADE_MULTIPLIER: Record<number, number> = {
  1: 1.0,
  2: 1.8,
  3: 3.0,
  4: 5.0,
  5: 8.0,
}

// 连锁加成配置
export const CHAIN_BONUSES: Record<string, { required: string[]; bonus: string; value: number }> = {
  '农田+伐木场': { required: ['farmland', 'lumber_mill'], bonus: '粮食和木材产出+10%', value: 10 },
  '铁匠铺+矿场': { required: ['smithy', 'mine'], bonus: '军队攻击+10%', value: 10 },
  '军营+马厩': { required: ['barracks', 'stable'], bonus: '骑兵训练成本-15%', value: 15 },
  '酒肆+布庄': { required: ['tavern', 'cloth_shop'], bonus: '钱币收入+15%', value: 15 },
  '医馆+祭坛': { required: ['hospital', 'altar'], bonus: '民心和人口增长+10%', value: 10 },
  '聚义厅+酒肆': { required: ['juyi_hall', 'tavern'], bonus: '武将招募费用-20%', value: 20 },
}
