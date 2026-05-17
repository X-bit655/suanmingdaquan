import type { BaziInput, BaziCalculatedData, Pillar, PillarType, TenGodRelation, FortuneCycle, CycleStep, WuxingBalance } from '@/types/bazi'
import { Gender } from '@/types/fortune'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, HIDDEN_STEMS, STEM_WUXING, BRANCH_WUXING, STEM_YINYANG, TEN_GODS, getMonthStemIndex, getHourStemIndex, getShiChenIndex, getStemIndex, getBranchIndex } from './ganzhi'

export function calculateBazi(input: BaziInput): BaziCalculatedData {
  const yearPillar = calcYearPillar(input.birthYear)
  const monthPillar = calcMonthPillar(input.birthYear, input.birthMonth)
  const dayPillar = calcDayPillar(input.birthYear, input.birthMonth, input.birthDay)
  const shiChen = getShiChenIndex(input.birthHour)
  const hourPillar = calcHourPillar(dayPillar.heavenlyStem, shiChen)
  const pillars: Record<PillarType, Pillar> = { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar }
  const dayMaster = dayPillar.heavenlyStem
  const tenGods = calcTenGods(dayMaster, pillars)
  const fortuneCycles = calcFortuneCycle(input.gender, yearPillar, monthPillar)
  const currentYearPillar = calcYearPillar(new Date().getFullYear())
  const wuxingBalance = calcWuxingBalance(pillars)
  return { pillars, dayMaster, tenGods, fortuneCycles, currentYearPillar, wuxingBalance }
}

function calcYearPillar(year: number): Pillar {
  const si = (year - 4) % 10; const bi = (year - 4) % 12
  const stem = HEAVENLY_STEMS[si]; const branch = EARTHLY_BRANCHES[bi]
  return { heavenlyStem: stem, earthlyBranch: branch, hiddenStems: HIDDEN_STEMS[branch] || [], nayin: '' }
}

function calcMonthPillar(year: number, month: number): Pillar {
  const yearStemIdx = (year - 4) % 10; const monthStemBase = getMonthStemIndex(yearStemIdx)
  const branchIdx = (month + 1) % 12; const stemIdx = (monthStemBase + month - 1) % 10
  const stem = HEAVENLY_STEMS[stemIdx]; const branch = EARTHLY_BRANCHES[branchIdx]
  return { heavenlyStem: stem, earthlyBranch: branch, hiddenStems: HIDDEN_STEMS[branch] || [], nayin: '' }
}

function calcDayPillar(year: number, month: number, day: number): Pillar {
  let m = month; let y = year
  if (m <= 2) { m += 12; y-- }
  const C = Math.floor(y / 100); const Y = y % 100
  const base = Math.floor(C / 4) - 2 * C + Math.floor(Y + Y / 4) + Math.floor(13 * (m + 1) / 5) + day - 1
  const idx = ((base % 60) + 60) % 60; const si = idx % 10; const bi = idx % 12
  return { heavenlyStem: HEAVENLY_STEMS[si], earthlyBranch: EARTHLY_BRANCHES[bi], hiddenStems: HIDDEN_STEMS[EARTHLY_BRANCHES[bi]] || [], nayin: '' }
}

function calcHourPillar(dayStem: string, shiChenIdx: number): Pillar {
  const dayStemIdx = getStemIndex(dayStem); const hourStemBase = getHourStemIndex(dayStemIdx)
  const si = (hourStemBase + shiChenIdx) % 10; const branch = EARTHLY_BRANCHES[shiChenIdx]
  return { heavenlyStem: HEAVENLY_STEMS[si], earthlyBranch: branch, hiddenStems: HIDDEN_STEMS[branch] || [], nayin: '' }
}

function calcTenGods(dayMaster: string, pillars: Record<PillarType, Pillar>): TenGodRelation[] {
  const dmIdx = getStemIndex(dayMaster); const result: TenGodRelation[] = []
  for (const [ptype, pillar] of Object.entries(pillars) as [PillarType, Pillar][]) {
    const si = getStemIndex(pillar.heavenlyStem); const diff = ((si - dmIdx) % 10 + 10) % 10
    result.push({ godName: TEN_GODS[diff], pillar: ptype })
  }
  return result
}

function calcFortuneCycle(gender: Gender, yearPillar: Pillar, monthPillar: Pillar): FortuneCycle {
  const yinYang = STEM_YINYANG[yearPillar.heavenlyStem]
  const direction = ((gender === Gender.Male && yinYang) || (gender === Gender.Female && !yinYang)) ? 'forward' : 'reverse'
  const monthBranchIdx = getBranchIndex(monthPillar.earthlyBranch); let startAge = 3
  const cycles: CycleStep[] = []; let cb = monthBranchIdx; let cs = getStemIndex(monthPillar.heavenlyStem)
  for (let i = 0; i < 8; i++) {
    if (direction === 'forward') { cs = (cs + 1) % 10; cb = (cb + 1) % 12 }
    else { cs = (cs - 1 + 10) % 10; cb = (cb - 1 + 12) % 12 }
    const ageStart = startAge + i * 10
    cycles.push({ ageRange: `${ageStart}-${ageStart + 9}岁`, heavenlyStem: HEAVENLY_STEMS[cs], earthlyBranch: EARTHLY_BRANCHES[cb] })
  }
  return { startAge, direction, cycles }
}

function calcWuxingBalance(pillars: Record<PillarType, Pillar>): WuxingBalance {
  const balance: WuxingBalance = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 }
  const wk: Record<string, keyof WuxingBalance> = { '金':'metal', '木':'wood', '水':'water', '火':'fire', '土':'earth' }
  for (const p of Object.values(pillars)) {
    if (wk[STEM_WUXING[p.heavenlyStem] || '']) balance[wk[STEM_WUXING[p.heavenlyStem] || '']]++
    if (wk[BRANCH_WUXING[p.earthlyBranch] || '']) balance[wk[BRANCH_WUXING[p.earthlyBranch] || '']]++
  }
  return balance
}
