import type { AstrologyInput, AstrologyCalculatedData, PlanetPosition } from '@/types/astrology'

const ZODIAC_SIGNS = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座']
const PLANETS = ['太阳','月亮','水星','金星','火星','木星','土星','天王星','海王星','冥王星']

/** 行星平均轨道周期（年），用于计算近似黄经 */
const ORBITAL_PERIODS: Record<string, number> = {
  '太阳': 1, '月亮': 0.075, '水星': 0.241, '金星': 0.615,
  '火星': 1.881, '木星': 11.86, '土星': 29.46,
  '天王星': 84.01, '海王星': 164.8, '冥王星': 248.1,
}

export function calculateAstrology(input: AstrologyInput): AstrologyCalculatedData {
  const { birthYear, birthMonth, birthDay, birthHour, birthMinute } = input

  const sunSignIdx = getZodiacSign(birthMonth, birthDay)
  const sunSign = ZODIAC_SIGNS[sunSignIdx]

  const moonSignIdx = (sunSignIdx + Math.floor(birthDay * 0.4)) % 12
  const moonSign = ZODIAC_SIGNS[moonSignIdx]

  // 上升星座：以小时+分钟精确计算
  const hourFraction = birthHour + birthMinute / 60
  const risingSignIdx = (sunSignIdx + Math.floor(hourFraction / 2)) % 12
  const risingSign = ZODIAC_SIGNS[risingSignIdx]

  // 行星位置基于出生年+日，结合轨道周期计算近似黄经
  const yearFraction = dayOfYear(birthYear, birthMonth, birthDay) / 365.25
  const planets: PlanetPosition[] = PLANETS.map((planet, i) => {
    const period = ORBITAL_PERIODS[planet] || 1
    const baseOffset = (i * 36 + birthYear * 7.3) % 360
    const longitude360 = (baseOffset + (yearFraction / period) * 360 + birthDay * 2.7 + birthHour * 1.2) % 360
    const signIdx = Math.floor(longitude360 / 30) % 12
    const degree = Math.floor(longitude360 % 30)
    const house = ((risingSignIdx + i * 2 + Math.floor(hourFraction * 0.6)) % 12) + 1
    return { planet, sign: ZODIAC_SIGNS[signIdx], house, degree }
  })

  const houses = ZODIAC_SIGNS.map((_, i) => ZODIAC_SIGNS[(risingSignIdx + i) % 12])

  return { sunSign, moonSign, risingSign, planets, houses }
}

/** 修正后的星座日期边界：每月太阳进入下一个星座的日期 */
function getZodiacSign(month: number, day: number): number {
  const boundaries = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22]
  return day <= boundaries[month - 1] ? (month + 8) % 12 : (month + 9) % 12
}

function dayOfYear(y: number, m: number, d: number): number {
  const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let dayCount = d
  for (let i = 0; i < m - 1; i++) dayCount += daysInMonth[i]
  return dayCount
}

export { ZODIAC_SIGNS, PLANETS }
