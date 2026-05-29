import type { ZiWeiInput, ZiWeiCalculatedData, PalaceData, SiHua, Star } from '@/types/ziwei'
import { PALACE_NAMES, PALACE_BRANCHES, MAJOR_STARS, MINOR_STARS, getWuxingJu, ZIWEI_TABLE, getTianfuPosition, BRIGHTNESS_LEVELS } from './ziwei-data'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, getStemIndex } from './ganzhi'

export function calculateZiWei(input: ZiWeiInput): ZiWeiCalculatedData {
  const shiChen = Math.floor((input.birthHour + 1) / 2) % 12
  const yearStem = HEAVENLY_STEMS[(input.birthYear - 4) % 10]
  const yearBranch = EARTHLY_BRANCHES[(input.birthYear - 4) % 12]

  const wuxingJu = getWuxingJu(yearStem, yearBranch)
  const ziweiTable = ZIWEI_TABLE[wuxingJu] || []
  const ziweiPos = ziweiTable[Math.min(input.birthDay - 1, 29)] || 2

  const mingGong = (input.birthMonth - 1 + shiChen) % 12
  const shenGong = (input.birthMonth - 1 + shiChen + 11) % 12

  const tianfuPos = getTianfuPosition(ziweiPos)

  const ziweiStars: [string, number][] = [
    ['紫微', 0], ['天机', -1], ['太阳', -3], ['武曲', -4], ['天同', -5], ['廉贞', -8],
  ]
  const tianfuStars: [string, number][] = [
    ['天府', 0], ['太阴', 1], ['贪狼', 2], ['巨门', 3],
    ['天相', 4], ['天梁', 5], ['七杀', 6], ['破军', 10],
  ]

  function brightnessForOffset(offset: number): string {
    const abs = Math.abs(offset)
    const idx = abs === 0 ? 0 : abs <= 3 ? 1 : abs <= 6 ? 2 : 4
    return BRIGHTNESS_LEVELS[idx]
  }

  const palaces: PalaceData[] = []
  for (let i = 0; i < 12; i++) {
    const palaceGzIdx = (mingGong + i) % 12
    const palaceStem = HEAVENLY_STEMS[(getStemIndex(yearStem) * 2 + i) % 10]
    const majorStars: Star[] = []

    for (const [name, offset] of ziweiStars) {
      const pos = ((ziweiPos + offset) % 12 + 12) % 12
      if (pos === i) {
        majorStars.push({ name, brightness: brightnessForOffset(offset) as any })
      }
    }
    for (const [name, offset] of tianfuStars) {
      const pos = ((tianfuPos + offset) % 12 + 12) % 12
      if (pos === i) {
        majorStars.push({ name, brightness: brightnessForOffset(offset) as any })
      }
    }

    const minorStars: Star[] = []
    const wenChangPos = (10 - getStemIndex(yearStem)) % 12
    const wenQuPos = (getStemIndex(yearStem) + 4) % 12
    const zuoFuPos = (input.birthMonth + 1) % 12
    const youBiPos = (input.birthMonth + 9) % 12
    if (wenChangPos === i) minorStars.push({ name: '文昌', brightness: '得' })
    if (wenQuPos === i) minorStars.push({ name: '文曲', brightness: '得' })
    if (zuoFuPos === i) minorStars.push({ name: '左辅', brightness: '旺' })
    if (youBiPos === i) minorStars.push({ name: '右弼', brightness: '旺' })

    palaces.push({
      name: PALACE_NAMES[i] as any,
      earthlyBranch: PALACE_BRANCHES[palaceGzIdx],
      heavenlyStem: palaceStem,
      majorStars,
      minorStars,
    })
  }

  const siHuaStars = getSiHuaByStem(yearStem)
  const siHua: SiHua = resolveSiHua(palaces, siHuaStars)

  return { mingGong, shenGong, palaces, siHua }
}

function getSiHuaByStem(stem: string): Record<string, string> {
  const table: Record<string, [string, string, string, string]> = {
    '甲': ['廉贞', '破军', '武曲', '太阳'],
    '乙': ['天机', '天梁', '紫微', '太阴'],
    '丙': ['天同', '天机', '文昌', '廉贞'],
    '丁': ['太阴', '天同', '天机', '巨门'],
    '戊': ['贪狼', '太阴', '右弼', '天机'],
    '己': ['武曲', '贪狼', '天梁', '文曲'],
    '庚': ['太阳', '武曲', '太阴', '天同'],
    '辛': ['巨门', '太阳', '文曲', '文昌'],
    '壬': ['天梁', '紫微', '左辅', '武曲'],
    '癸': ['破军', '巨门', '太阴', '贪狼'],
  }
  const [lu, quan, ke, ji] = table[stem] || ['天同', '天机', '文昌', '廉贞']
  return { huaLu: lu, huaQuan: quan, huaKe: ke, huaJi: ji }
}

function resolveSiHua(palaces: PalaceData[], stars: Record<string, string>): SiHua {
  for (const p of palaces) {
    const allStars = [...p.majorStars.map(s => s.name), ...p.minorStars.map(s => s.name)]
    for (const key of ['huaLu', 'huaQuan', 'huaKe', 'huaJi'] as const) {
      if (allStars.includes(stars[key])) (stars as any)[key] = p.name
    }
  }
  return stars as unknown as SiHua
}
