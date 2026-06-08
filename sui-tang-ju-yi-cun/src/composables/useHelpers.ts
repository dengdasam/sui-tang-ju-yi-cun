// 工具函数
export function formatResources(r: { gold: number; food: number; wood: number; iron: number; population: number }) {
  return `💰${r.gold} 🌾${r.food} 🪵${r.wood} ⛏${r.iron} 👥${r.population}`
}

export function getTroopIcon(type: string): string {
  const map: Record<string, string> = {
    infantry: '⚔️', archer: '🏹', musketeer: '💥', cavalry: '🐴',
    elite_cavalry: '🦅', heavy_armor: '🛡️', divine_engineer: '🔥',
  }
  return map[type] || '❓'
}

export function getTroopName(type: string): string {
  const map: Record<string, string> = {
    infantry: '步兵', archer: '弓兵', musketeer: '火铳兵', cavalry: '骑兵',
    elite_cavalry: '燕云十八骑', heavy_armor: '玄甲军', divine_engineer: '神机营',
  }
  return map[type] || type
}

export function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    SSS: '#ff6600', SS: '#cc33cc', S: '#3388ff', A: '#33aa33',
  }
  return map[grade] || '#888'
}

export function getSeasonIcon(season: string): string {
  const map: Record<string, string> = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' }
  return map[season] || ''
}
