import type { StoryNode } from '../types'

// 游戏开篇故事
export const OPENING_STORY: StoryNode[] = [
  {
    id: 'opening_1',
    type: 'narration',
    content: '隋大业七年，天下大乱。炀帝无道，民不聊生，群雄并起。\n\n你本是太原一名普通军校，眼见朝廷腐败，百姓流离失所，心中渐生去意。\n\n一日，你带着几名兄弟离开了军营，在太原附近的山中，找了一处易守难攻之地。\n\n"就在这里吧。"你望着山谷，"建一个寨子，聚天下英雄，做一番事业。"\n\n屯兵寨，就此建立。',
    next: 'opening_2',
  },
  {
    id: 'opening_2',
    type: 'choice',
    content: '你准备如何开始经营这座寨子？',
    choices: [
      { text: '先建农田，稳固根本', next: 'opening_farm', effects: [{ type: 'food', value: 50 }] },
      { text: '先建军营，招兵买马', next: 'opening_barracks', effects: [{ type: 'troop_infantry', value: 5 }] },
      { text: '先建聚义厅，招揽人才', next: 'opening_hall', effects: [{ type: 'gold', value: 100 }] },
    ],
  },
  {
    id: 'opening_farm',
    type: 'narration',
    content: '你深知"兵马未动，粮草先行"的道理。第一件事就是开垦农田。寨子里的兄弟们挥汗如雨，很快几亩地就整了出来。\n\n虽然只是开始，但有了粮食，心中就有了底气。',
    next: 'opening_done',
  },
  {
    id: 'opening_barracks',
    type: 'narration',
    content: '在这乱世之中，没有什么比刀剑更让人安心。你建起了简易军营，招募了附近的山民。十来号人虽然不多，但个个都是好汉。\n\n有了这些兵，寨子才算真正立了起来。',
    next: 'opening_done',
  },
  {
    id: 'opening_hall',
    type: 'narration',
    content: '"要想成事，先聚人心。"你建起了聚义厅——虽然还只是简陋的木棚，但这是一切的开始。\n\n你放出消息，招募四方豪杰。不久，就有人慕名而来……',
    next: 'opening_done',
  },
  {
    id: 'opening_done',
    type: 'narration',
    content: '寨子初具雏形。虽然一切还很简陋，但你心中充满了希望。\n\n乱世之中，要么碌碌无为，要么轰轰烈烈。你已经做出了选择。\n\n【游戏正式开始 — 经营你的屯兵寨吧！】',
  },
]

// 随机事件池
export const RANDOM_EVENTS: StoryNode[] = [
  {
    id: 'event_merchant',
    type: 'choice',
    content: '一名远方商人路过寨子，愿以高价收购你的货物。',
    choices: [
      { text: '全部卖出(+300💰)', next: '', effects: [{ type: 'gold', value: 300 }] },
      { text: '卖一半(+150💰)', next: '', effects: [{ type: 'gold', value: 150 }] },
      { text: '拒绝交易', next: '', effects: [{ type: 'reputation', value: 2 }] },
    ],
  },
  {
    id: 'event_refugee',
    type: 'choice',
    content: '一群流民逃难到寨子外，请求收留。',
    choices: [
      { text: '收留他们(+5人口，-100🌾)', next: '', effects: [{ type: 'population', value: 5 }, { type: 'food', value: -100 }] },
      { text: '给些粮食打发走(-50🌾)', next: '', effects: [{ type: 'food', value: -50 }, { type: 'reputation', value: 5 }] },
      { text: '拒绝(寨子自顾不暇)', next: '', effects: [{ type: 'reputation', value: -5 }] },
    ],
  },
  {
    id: 'event_treasure',
    type: 'choice',
    content: '矿工在矿场附近发现了一处疑似古墓的入口。',
    choices: [
      { text: '组织挖掘(-50💰)', next: '', effects: [{ type: 'gold', value: -50 }] },
      { text: '谨慎探索(-20💪)', next: '', effects: [{ type: 'reputation', value: 3 }] },
      { text: '封存起来，以后再说', next: '', effects: [] },
    ],
  },
  {
    id: 'event_sparring',
    type: 'choice',
    content: '两名武将在训练场上起了争执，非要一分高下。',
    choices: [
      { text: '让他们比试(随机武将有经验收入)', next: '', effects: [{ type: 'hero_exp', value: 30 }] },
      { text: '亲自调停(武将好感+3)', next: '', effects: [{ type: 'reputation', value: 2 }] },
      { text: '各罚站一天岗(纪律+5)', next: '', effects: [{ type: 'morale', value: 5 }] },
    ],
  },
  {
    id: 'event_flood',
    type: 'narration',
    content: '连日大雨，河水暴涨！好在寨子建在高处，没有遭受太大损失。但下游的农田被淹了一小片。\n\n(-30🌾)',
    onEnter: [{ type: 'food', value: -30 }],
  },
  {
    id: 'event_bumper',
    type: 'narration',
    content: '天公作美，风调雨顺！今季的收成特别好。\n\n(+80🌾)',
    onEnter: [{ type: 'food', value: 80 }],
  },
]

// 季节叙事文本
export const SEASON_NARRATIVES: Record<string, string[]> = {
  spring: [
    '春风拂过山岗，万物复苏。寨子周围的野花开得正艳。',
    '春雨贵如油，趁着这好时节，赶紧播种吧。',
    '春雷阵阵，惊蛰已过。是时候开始新一年的劳作了。',
  ],
  summer: [
    '烈日当空，蝉鸣不止。寨子里的树木遮出了一片阴凉。',
    '夏日的暴雨来得快去得也快，在山谷间留下一道彩虹。',
    '瓜果飘香，这是收获的前奏。',
  ],
  autumn: [
    '秋风萧瑟，层林尽染。山谷间的树叶变得金黄。',
    '收获的季节到了，寨子里的粮仓渐渐充盈起来。',
    '秋高气爽，正是练兵的好时节。',
  ],
  winter: [
    '大雪封山，寨子外的世界一片银装素裹。',
    '凛冽的寒风中，寨子里升起了袅袅炊烟。',
    '岁末将至，这一年我们走了多远？',
  ],
}

// 节日事件
export const FESTIVAL_EVENTS: Record<string, StoryNode[]> = {
  spring_festival: [
    {
      id: 'spring_festival',
      type: 'choice',
      content: '🏮 春节到了！寨子里张灯结彩，大家都在庆祝新一年的到来。\n\n你打算如何庆祝？',
      choices: [
        { text: '大办宴席(-300💰，武将全好感+5，士气+20)', next: '', effects: [{ type: 'gold', value: -300 }, { type: 'morale', value: 20 }] },
        { text: '从简庆祝(-100💰，士气+10)', next: '', effects: [{ type: 'gold', value: -100 }, { type: 'morale', value: 10 }] },
        { text: '一切照常', next: '', effects: [] },
      ],
    },
  ],
  dragon_boat: [
    {
      id: 'dragon_boat',
      type: 'choice',
      content: '🐉 端午佳节！寨子里的兄弟们提议举办一场龙舟赛（在附近小河上）。',
      choices: [
        { text: '举办比赛(-200💰，士气+15)', next: '', effects: [{ type: 'gold', value: -200 }, { type: 'morale', value: 15 }] },
        { text: '包粽子即可(-50💰)', next: '', effects: [{ type: 'gold', value: -50 }, { type: 'food', value: 20 }] },
        { text: '不搞这些繁文缛节', next: '', effects: [] },
      ],
    },
  ],
}

// 战斗描述模板
export const COMBAT_NARRATIVES = {
  start: [
    '⚔️ 战鼓隆隆！两军对垒，大战一触即发！',
    '⚔️ 号角声响彻山谷，你的大军浩浩荡荡地列阵！',
    '⚔️ 刀光剑影，铁骑铮铮。是时候在战场上证明你的实力了！',
  ],
  victory: [
    '🎉 大获全胜！敌军溃不成军，四散奔逃！',
    '🎉 胜了！这是一场酣畅淋漓的胜利！',
    '🎉 敌军溃败！我们的勇士们欢呼着打扫战场。',
  ],
  defeat: [
    '💀 败了……敌军势大，我们损失惨重。',
    '💀 此战失利，但来日方长。寨子还在，我们就还能东山再起。',
    '💀 损兵折将，鸣金收兵。下次我们一定会赢回来。',
  ],
  attack: [
    '{attacker}的{unit}发起猛烈攻击！',
    '{attacker}一声令下，{unit}如潮水般涌向敌阵！',
    '{attacker}指挥{unit}从侧翼包抄！',
  ],
  defend: [
    '{defender}的{unit}顽强防守，稳住了阵脚。',
    '{defender}的{unit}筑起坚固防线，敌人寸步难行。',
  ],
  kill: [
    '⚡ 击杀了敌方{count}名{unit}！',
    '⚡ 一轮猛攻，敌方损失{count}名{unit}。',
  ],
  skill: [
    '💫 {hero}释放了【{skill}】！',
  ],
}
