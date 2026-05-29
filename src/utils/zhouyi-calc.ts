import type { ZhouYiInput, ZhouYiCalculatedData, Hexagram, YaoLine, YaoValue, Trigram } from '@/types/zhouyi'
import { HEXAGRAMS, TRIGRAMS } from './zhouyi-data'

export function calculateZhouYi(input: ZhouYiInput): ZhouYiCalculatedData {
  let yaoValues: YaoValue[]

  if (input.method === 'coin') {
    yaoValues = simulateCoinToss()
  } else if (input.method === 'time') {
    yaoValues = timeBasedDivination(input.question)
  } else {
    yaoValues = Array.from({ length: 6 }, () => [6, 7, 8, 9][Math.floor(Math.random() * 4)] as YaoValue)
  }

  const originalHexagram = buildHexagram(yaoValues)
  const hasChangingLines = originalHexagram.changingLines.length > 0

  return {
    originalHexagram,
    mutualHexagram: buildMutualHexagram(originalHexagram),
    changedHexagram: hasChangingLines ? buildChangedHexagram(yaoValues) : null,
    changingLineInterpretations: originalHexagram.changingLines.map(i =>
      originalHexagram.lines.find(l => l.position === i)?.lineText || ''),
  }
}

/** 铜钱起卦法：三枚铜钱模拟 */
function simulateCoinToss(): YaoValue[] {
  const yao: YaoValue[] = []
  for (let i = 0; i < 6; i++) {
    let sum = 0
    for (let j = 0; j < 3; j++) sum += Math.random() > 0.5 ? 3 : 2
    yao.push(sum as YaoValue)
  }
  return yao
}

/** 梅花易数时间起卦法：用时间和问字起卦 */
function timeBasedDivination(question: string): YaoValue[] {
  const now = new Date()
  const yearNum = now.getFullYear()
  const monthNum = now.getMonth() + 1
  const dayNum = now.getDate()
  const qLen = question.length

  const upper = ((yearNum + monthNum + dayNum) % 8) || 8
  const lowerNum = (qLen % 8) || 8
  const dongYao = (qLen % 6) + 1

  const upperTri = TRIGRAMS[upper - 1]
  const lowerTri = TRIGRAMS[lowerNum - 1]
  const upperLines = upperTri.lines
  const lowerLines = lowerTri.lines

  const lines: YaoValue[] = [...lowerLines, ...upperLines] as YaoValue[]
  const result: YaoValue[] = lines.map((v, i) => {
    if (i + 1 === dongYao) return v === 7 ? 9 : v === 8 ? 6 : v
    return v
  }) as YaoValue[]

  return result
}

function buildHexagram(yaoValues: YaoValue[]): Hexagram {
  const upperTri = triFromLines(yaoValues.slice(3, 6))
  const lowerTri = triFromLines(yaoValues.slice(0, 3))
  const upperIdx = TRIGRAMS.findIndex(t => t.name === upperTri.name)
  const lowerIdx = TRIGRAMS.findIndex(t => t.name === lowerTri.name)
  const hexData = HEXAGRAMS.find(h => h.upper === upperIdx && h.lower === lowerIdx) || HEXAGRAMS[0]
  const lines: YaoLine[] = yaoValues.map((v, i) => ({
    position: i + 1,
    value: v,
    isChanging: v === 6 || v === 9,
    lineText: hexData.lines[i] || '',
  }))
  return {
    id: hexData.id, name: hexData.name,
    upperTrigram: upperTri, lowerTrigram: lowerTri,
    lines, judgment: hexData.judgment, image: hexData.image,
    changingLines: lines.filter(l => l.isChanging).map(l => l.position),
  }
}

function triFromLines(lines: YaoValue[]): Trigram {
  return TRIGRAMS.find(t => t.lines[0] === lines[0] && t.lines[1] === lines[1] && t.lines[2] === lines[2]) || TRIGRAMS[7]
}

function buildMutualHexagram(hex: Hexagram): Hexagram | null {
  try {
    const v = hex.lines.map(l => l.value)
    return buildHexagram([v[1], v[2], v[3], v[2], v[3], v[4]] as YaoValue[])
  } catch { return null }
}

function buildChangedHexagram(yaoValues: YaoValue[]): Hexagram {
  return buildHexagram(yaoValues.map(v => v === 6 ? 7 : v === 9 ? 8 : v) as YaoValue[])
}
