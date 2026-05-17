import type { ZhouYiInput, ZhouYiCalculatedData, Hexagram, YaoLine, YaoValue, Trigram } from '@/types/zhouyi'
import { HEXAGRAMS, TRIGRAMS } from './zhouyi-data'

export function calculateZhouYi(input: ZhouYiInput): ZhouYiCalculatedData {
  let yaoValues: YaoValue[]
  if (input.method === 'coin') {
    yaoValues = []; for (let i = 0; i < 6; i++) { let sum = 0; for (let j = 0; j < 3; j++) sum += Math.random() > 0.5 ? 3 : 2; yaoValues.push(sum as YaoValue) }
  } else { yaoValues = Array.from({ length: 6 }, () => [6,7,8,9][Math.floor(Math.random() * 4)] as YaoValue) }
  const originalHexagram = buildHexagram(yaoValues)
  return { originalHexagram, mutualHexagram: buildMutualHexagram(originalHexagram), changedHexagram: originalHexagram.changingLines.length > 0 ? buildChangedHexagram(yaoValues) : null, changingLineInterpretations: originalHexagram.changingLines.map(i => { const line = originalHexagram.lines.find(l => l.position === i); return line?.lineText || '' }) }
}

function buildHexagram(yaoValues: YaoValue[]): Hexagram {
  const upperTri = triFromLines(yaoValues.slice(3, 6)); const lowerTri = triFromLines(yaoValues.slice(0, 3))
  const upperIdx = TRIGRAMS.findIndex(t => t.name === upperTri.name); const lowerIdx = TRIGRAMS.findIndex(t => t.name === lowerTri.name)
  const hexData = HEXAGRAMS.find(h => h.upper === upperIdx && h.lower === lowerIdx) || HEXAGRAMS[0]
  const lines: YaoLine[] = yaoValues.map((v, i) => ({ position: i + 1, value: v, isChanging: v === 6 || v === 9, lineText: hexData.lines[i] || '' }))
  return { id: hexData.id, name: hexData.name, upperTrigram: upperTri, lowerTrigram: lowerTri, lines, judgment: hexData.judgment, image: hexData.image, changingLines: lines.filter(l => l.isChanging).map(l => l.position) }
}
function triFromLines(lines: YaoValue[]): Trigram { return TRIGRAMS.find(t => t.lines[0]===lines[0]&&t.lines[1]===lines[1]&&t.lines[2]===lines[2]) || TRIGRAMS[7] }
function buildMutualHexagram(hex: Hexagram): Hexagram | null { try { const v = hex.lines.map(l=>l.value); return buildHexagram([v[1],v[2],v[3],v[2],v[3],v[4]]) } catch { return null } }
function buildChangedHexagram(yaoValues: YaoValue[]): Hexagram { return buildHexagram(yaoValues.map(v => v===6?7:v===9?8:v) as YaoValue[]) }
