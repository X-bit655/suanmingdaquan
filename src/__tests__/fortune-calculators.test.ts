import { describe, expect, it, vi, afterEach } from 'vitest'
import { calculateBazi } from '@/utils/bazi-calc'
import { calculateZhouYi } from '@/utils/zhouyi-calc'
import { calculateZiWei } from '@/utils/ziwei-calc'
import { ALL_TAROT_CARDS } from '@/utils/tarot-data'
import { CalendarType, Gender } from '@/types/fortune'

describe('fortune calculators', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calculates a complete bazi chart shape', () => {
    const result = calculateBazi({
      birthYear: 1990,
      birthMonth: 1,
      birthDay: 1,
      birthHour: 12,
      gender: Gender.Male,
      calendarType: CalendarType.Solar,
    })

    expect(Object.keys(result.pillars)).toEqual(['year', 'month', 'day', 'hour'])
    expect(result.dayMaster).toBe(result.pillars.day.heavenlyStem)
    expect(result.tenGods).toHaveLength(4)
    expect(result.fortuneCycles.cycles).toHaveLength(8)
    expect(Object.values(result.wuxingBalance).reduce((sum, value) => sum + value, 0)).toBe(8)
  })

  it('calculates zhouyi changed hexagram when all lines are changing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)

    const result = calculateZhouYi({
      question: '测试问题',
      method: 'random',
    })

    expect(result.originalHexagram.lines).toHaveLength(6)
    expect(result.originalHexagram.changingLines).toEqual([1, 2, 3, 4, 5, 6])
    expect(result.changedHexagram).not.toBeNull()
    expect(result.changingLineInterpretations).toHaveLength(6)
  })

  it('calculates a ziwei chart with 12 palaces', () => {
    const result = calculateZiWei({
      birthYear: 1990,
      birthMonth: 1,
      birthDay: 1,
      birthHour: 12,
      gender: Gender.Male,
      calendarType: CalendarType.Solar,
    })

    expect(result.palaces).toHaveLength(12)
    expect(result.mingGong).toBeGreaterThanOrEqual(0)
    expect(result.mingGong).toBeLessThan(12)
    expect(result.shenGong).toBeGreaterThanOrEqual(0)
    expect(result.shenGong).toBeLessThan(12)
    expect(Object.keys(result.siHua)).toEqual(['huaLu', 'huaQuan', 'huaKe', 'huaJi'])
  })
})

describe('tarot card data', () => {
  it('contains a complete 78-card deck', () => {
    const ids = new Set(ALL_TAROT_CARDS.map(card => card.id))
    const majorCards = ALL_TAROT_CARDS.filter(card => card.arcana === 'major')
    const minorCards = ALL_TAROT_CARDS.filter(card => card.arcana === 'minor')

    expect(ALL_TAROT_CARDS).toHaveLength(78)
    expect(ids.size).toBe(78)
    expect(majorCards).toHaveLength(22)
    expect(minorCards).toHaveLength(56)
  })

  it('keeps minor arcana suits balanced', () => {
    const suitCounts = ALL_TAROT_CARDS
      .filter(card => card.arcana === 'minor')
      .reduce<Record<string, number>>((counts, card) => {
        counts[card.suit || 'missing'] = (counts[card.suit || 'missing'] || 0) + 1
        return counts
      }, {})

    expect(suitCounts).toEqual({
      wands: 14,
      cups: 14,
      swords: 14,
      pentacles: 14,
    })
  })
})
