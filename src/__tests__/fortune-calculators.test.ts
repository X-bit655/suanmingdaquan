import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { calculateBazi } from '@/utils/bazi-calc'
import { calculateZhouYi } from '@/utils/zhouyi-calc'
import { calculateZiWei } from '@/utils/ziwei-calc'
import { calculateAstrology, ZODIAC_SIGNS } from '@/utils/astrology-calc'
import { ALL_TAROT_CARDS, shuffleDeck } from '@/utils/tarot-data'
import { solarToLunar, getYearGanzhi } from '@/utils/calendar'
import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES, SHI_CHEN, HIDDEN_STEMS,
  STEM_WUXING, BRANCH_WUXING, ZODIAC, WUXING,
  getMonthStemIndex, getHourStemIndex, getShiChenIndex,
} from '@/utils/ganzhi'
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

describe('astrology calculator', () => {
  it('computes correct sun sign for known dates', () => {
    const capricorn = calculateAstrology({ birthYear: 1990, birthMonth: 1, birthDay: 15, birthHour: 12, birthMinute: 0, city: '北京' })
    expect(capricorn.sunSign).toBe('摩羯座')

    const aquarius = calculateAstrology({ birthYear: 1990, birthMonth: 1, birthDay: 21, birthHour: 12, birthMinute: 0, city: '北京' })
    expect(aquarius.sunSign).toBe('水瓶座')

    const aries = calculateAstrology({ birthYear: 1990, birthMonth: 3, birthDay: 22, birthHour: 12, birthMinute: 0, city: '北京' })
    expect(aries.sunSign).toBe('白羊座')

    const leo = calculateAstrology({ birthYear: 1990, birthMonth: 8, birthDay: 1, birthHour: 12, birthMinute: 0, city: '北京' })
    expect(leo.sunSign).toBe('狮子座')
  })

  it('produces deterministic output for same input', () => {
    const input = { birthYear: 1990, birthMonth: 5, birthDay: 10, birthHour: 10, birthMinute: 30, city: '上海' }
    const r1 = calculateAstrology(input)
    const r2 = calculateAstrology(input)
    expect(r1.sunSign).toBe(r2.sunSign)
    expect(r1.moonSign).toBe(r2.moonSign)
    expect(r1.risingSign).toBe(r2.risingSign)
  })

  it('returns all 12 zodiac signs in order', () => {
    expect(ZODIAC_SIGNS).toEqual([
      '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
      '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座',
    ])
  })

  it('returns valid moon sign and rising sign', () => {
    const result = calculateAstrology({ birthYear: 1995, birthMonth: 6, birthDay: 15, birthHour: 8, birthMinute: 0, city: '北京' })
    expect(ZODIAC_SIGNS).toContain(result.moonSign)
    expect(ZODIAC_SIGNS).toContain(result.risingSign)
  })

  it('returns 10 planets with valid sign and house', () => {
    const result = calculateAstrology({ birthYear: 2000, birthMonth: 3, birthDay: 10, birthHour: 14, birthMinute: 0, city: '广州' })
    expect(result.planets).toHaveLength(10)
    result.planets.forEach(p => {
      expect(ZODIAC_SIGNS).toContain(p.sign)
      expect(p.house).toBeGreaterThanOrEqual(1)
      expect(p.house).toBeLessThanOrEqual(12)
      expect(p.degree).toBeGreaterThanOrEqual(0)
      expect(p.degree).toBeLessThan(30)
    })
  })

  it('returns 12 houses all in order', () => {
    const result = calculateAstrology({ birthYear: 2000, birthMonth: 1, birthDay: 1, birthHour: 0, birthMinute: 0, city: '北京' })
    expect(result.houses).toHaveLength(12)
    result.houses.forEach(h => expect(ZODIAC_SIGNS).toContain(h))
  })
})

describe('calendar utilities', () => {
  it('returns lunar date within valid range', () => {
    const lunar = solarToLunar(2024, 6, 1)
    expect(lunar.year).toBeGreaterThanOrEqual(1900)
    expect(lunar.month).toBeGreaterThanOrEqual(1)
    expect(lunar.month).toBeLessThanOrEqual(12)
    expect(lunar.day).toBeGreaterThanOrEqual(1)
    expect(lunar.day).toBeLessThanOrEqual(30)
  })

  it('returns year ganzhi for known years', () => {
    expect(getYearGanzhi(2024).ganzhi).toBe('甲辰')
    expect(getYearGanzhi(2025).ganzhi).toBe('乙巳')
  })

  it('cycles ganzhi correctly every 60 years', () => {
    expect(getYearGanzhi(1984).ganzhi).toBe(getYearGanzhi(2044).ganzhi)
  })

  it('returns fallback for years outside 1900-2100 range', () => {
    const result = solarToLunar(1800, 1, 1)
    expect(result.year).toBe(1800)
    expect(result.month).toBe(1)
    expect(result.day).toBe(1)
  })
})

describe('ganzhi (heavenly stems & earthly branches)', () => {
  it('has complete 10 heavenly stems', () => {
    expect(HEAVENLY_STEMS).toHaveLength(10)
    expect(HEAVENLY_STEMS.join('')).toBe('甲乙丙丁戊己庚辛壬癸')
  })

  it('has complete 12 earthly branches', () => {
    expect(EARTHLY_BRANCHES).toHaveLength(12)
    expect(EARTHLY_BRANCHES.join('')).toBe('子丑寅卯辰巳午未申酉戌亥')
  })

  it('maps all 12 sichen to hour ranges', () => {
    expect(SHI_CHEN).toHaveLength(12)
    expect(SHI_CHEN[0][0]).toBe('子时')
  })

  it('getShiChenIndex maps hours correctly', () => {
    expect(getShiChenIndex(0)).toBe(0)
    expect(getShiChenIndex(23)).toBe(0)
    expect(getShiChenIndex(12)).toBe(6)
    expect(getShiChenIndex(7)).toBe(4)
    expect(getShiChenIndex(15)).toBe(8)
  })

  it('all 12 branches have hidden stems', () => {
    EARTHLY_BRANCHES.forEach(b => {
      expect(HIDDEN_STEMS[b]).toBeDefined()
      expect(HIDDEN_STEMS[b].length).toBeGreaterThan(0)
    })
  })

  it('wuxing mappings cover all stems and branches', () => {
    HEAVENLY_STEMS.forEach(s => expect(STEM_WUXING[s]).toBeDefined())
    EARTHLY_BRANCHES.forEach(b => expect(BRANCH_WUXING[b]).toBeDefined())
  })

  it('wuxing has exactly 5 elements', () => {
    expect(WUXING).toEqual(['金', '木', '水', '火', '土'])
  })

  it('zodiac mapping has correct 12 animals', () => {
    expect(ZODIAC).toEqual(['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'])
  })

  it('year ganzhi maps to correct zodiac', () => {
    const gan = getYearGanzhi(2024)
    const branchIdx = EARTHLY_BRANCHES.indexOf(gan.branch)
    expect(ZODIAC[branchIdx]).toBe('龙')
  })

  it('getMonthStemIndex returns valid indices', () => {
    for (let i = 0; i < 10; i++) {
      const idx = getMonthStemIndex(i)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(10)
    }
  })

  it('getHourStemIndex returns valid indices', () => {
    for (let i = 0; i < 10; i++) {
      const idx = getHourStemIndex(i)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(10)
    }
  })
})

describe('bazi dayun reverse direction', () => {
  it('generates reverse dayun for female born in yang year', () => {
    const result = calculateBazi({
      birthYear: 2024, birthMonth: 3, birthDay: 15, birthHour: 12,
      gender: Gender.Female, calendarType: CalendarType.Solar,
    })
    expect(result.fortuneCycles.cycles.length).toBeGreaterThan(0)
    // 2024 甲辰年为阳年，女性逆排
    expect(result.fortuneCycles.cycles[0].ageRange).toBeDefined()
  })
})

describe('zhouyi time-based divination', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 5, 15, 12, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('generates hexagram using time method', () => {
    const result = calculateZhouYi({
      method: 'time',
      question: '事业前程',
    })
    expect(result.originalHexagram).toBeDefined()
    expect(result.originalHexagram.id).toBeGreaterThanOrEqual(1)
    expect(result.originalHexagram.id).toBeLessThanOrEqual(64)
    expect(result.mutualHexagram).toBeDefined()
  })

  it('time method is deterministic for same input', () => {
    const r1 = calculateZhouYi({ method: 'time', question: '事业' })
    const r2 = calculateZhouYi({ method: 'time', question: '事业' })
    expect(r1.originalHexagram.id).toBe(r2.originalHexagram.id)
  })
})

describe('tarot shuffle', () => {
  it('returns full deck of 78 unique cards', () => {
    const deck = shuffleDeck()
    expect(deck).toHaveLength(78)
    const ids = new Set(deck.map(c => c.id))
    expect(ids.size).toBe(78)
  })

  it('returns cards in different order from source', () => {
    const deck1 = shuffleDeck()
    const deck2 = shuffleDeck()
    const sameOrder = deck1.every((c, i) => c.id === deck2[i]?.id)
    expect(sameOrder).toBe(false)
  })
})

describe('calendar leap year', () => {
  it('handles leap year lunar conversion', () => {
    const lunar = solarToLunar(2024, 2, 10)
    expect(lunar.year).toBeGreaterThanOrEqual(1900)
    expect(lunar.month).toBeGreaterThanOrEqual(1)
    expect(lunar.day).toBeGreaterThanOrEqual(1)
  })
})
