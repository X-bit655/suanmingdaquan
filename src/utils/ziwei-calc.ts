import type { ZiWeiInput, ZiWeiCalculatedData, PalaceData, SiHua, Star } from '@/types/ziwei'
import { PALACE_NAMES, PALACE_BRANCHES, MAJOR_STARS, getWuxingJu, ZIWEI_TABLE, BRIGHTNESS_LEVELS } from './ziwei-data'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, getStemIndex } from './ganzhi'

export function calculateZiWei(input: ZiWeiInput): ZiWeiCalculatedData {
  const shiChen = Math.floor((input.birthHour + 1) / 2) % 12
  const yearStem = HEAVENLY_STEMS[(input.birthYear - 4) % 10]; const yearBranch = EARTHLY_BRANCHES[(input.birthYear - 4) % 12]
  const wuxingJu = getWuxingJu(yearStem, yearBranch); const ziweiTable = ZIWEI_TABLE[wuxingJu] || []
  const ziweiPos = ziweiTable[input.birthDay - 1] || 2
  const mingGong = (input.birthMonth - 1 + shiChen) % 12; const shenGong = (input.birthMonth - 1 + shiChen + 11) % 12
  const palaces: PalaceData[] = []
  for (let i = 0; i < 12; i++) {
    const palaceGzIdx = (mingGong + i) % 12; const palaceStem = HEAVENLY_STEMS[(getStemIndex(yearStem) * 2 + i) % 10]
    const majorStars: Star[] = []; const ziweiOffsets = [0, -1, -3, -4, -5, -8]
    for (let j = 0; j < 6; j++) { if (((ziweiPos + ziweiOffsets[j]) % 12 + 12) % 12 === i) majorStars.push({ name: MAJOR_STARS[j], brightness: BRIGHTNESS_LEVELS[Math.min(Math.abs(ziweiOffsets[j]), 3)] }) }
    palaces.push({ name: PALACE_NAMES[i] as any, earthlyBranch: PALACE_BRANCHES[palaceGzIdx], heavenlyStem: palaceStem, majorStars, minorStars: [] })
  }
  return { mingGong, shenGong, palaces, siHua: { huaLu: PALACE_NAMES[mingGong%12] as any, huaQuan: PALACE_NAMES[(mingGong+3)%12] as any, huaKe: PALACE_NAMES[(mingGong+6)%12] as any, huaJi: PALACE_NAMES[(mingGong+9)%12] as any } }
}
