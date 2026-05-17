import type { AstrologyInput, AstrologyCalculatedData, PlanetPosition } from '@/types/astrology'
const ZODIAC_SIGNS = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座']
const PLANETS = ['太阳','月亮','水星','金星','火星','木星','土星','天王星','海王星','冥王星']
export function calculateAstrology(input: AstrologyInput): AstrologyCalculatedData {
  const { birthMonth, birthDay, birthHour } = input
  const sunSignIdx = getZodiacSign(birthMonth, birthDay); const sunSign = ZODIAC_SIGNS[sunSignIdx]
  const moonSignIdx = (sunSignIdx + Math.floor(birthDay * 0.4)) % 12; const moonSign = ZODIAC_SIGNS[moonSignIdx]
  const risingSignIdx = (sunSignIdx + Math.floor(birthHour / 2)) % 12; const risingSign = ZODIAC_SIGNS[risingSignIdx]
  const planets: PlanetPosition[] = PLANETS.map((planet, i) => ({ planet, sign: ZODIAC_SIGNS[(sunSignIdx + i * 3 + Math.floor(birthDay * 0.1)) % 12], house: ((risingSignIdx + i * 2) % 12) + 1, degree: Math.floor(Math.random() * 30) }))
  const houses = ZODIAC_SIGNS.map((_, i) => ZODIAC_SIGNS[(risingSignIdx + i) % 12])
  return { sunSign, moonSign, risingSign, planets, houses }
}
function getZodiacSign(month: number, day: number): number {
  const boundaries = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22]
  return day <= boundaries[month - 1] ? (month - 2 + 12) % 12 : month - 1
}
export { ZODIAC_SIGNS, PLANETS }
