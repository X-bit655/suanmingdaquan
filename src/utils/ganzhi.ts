/** 十天干 */
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

/** 十二地支 */
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

/** 十二时辰对应小时 */
export const SHI_CHEN: [string, number, number][] = [
  ['子时', 23, 1], ['丑时', 1, 3], ['寅时', 3, 5], ['卯时', 5, 7],
  ['辰时', 7, 9], ['巳时', 9, 11], ['午时', 11, 13], ['未时', 13, 15],
  ['申时', 15, 17], ['酉时', 17, 19], ['戌时', 19, 21], ['亥时', 21, 23],
]

/** 地支藏干 */
export const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
  '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
  '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲'],
}

/** 纳音五行 */
export const NAYIN_TABLE: string[][] = [
  ['海中金', '炉中火', '大林木', '路旁土', '剑锋金', '山头火'],
  ['涧下水', '城头土', '白蜡金', '杨柳木', '泉中水', '屋上土'],
  ['霹雳火', '松柏木', '流年水', '砂石金', '山下火', '平地木'],
  ['壁上土', '金箔金', '覆灯火', '天河水', '大驿土', '钗钏金'],
  ['桑柘木', '柘榴木', '大海水', '石榴木', '大海水', '海中金'],
]

/** 十神名称 */
export const TEN_GODS = [
  '比肩', '劫财', '食神', '伤官', '偏财', '正财', '偏官', '正官', '偏印', '正印',
]

/** 五行 */
export const WUXING = ['金', '木', '水', '火', '土']

/** 天干五行映射 */
export const STEM_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
}

/** 天干阴阳: true=阳, false=阴 */
export const STEM_YINYANG: Record<string, boolean> = {
  '甲': true, '乙': false, '丙': true, '丁': false, '戊': true,
  '己': false, '庚': true, '辛': false, '壬': true, '癸': false,
}

/** 地支五行映射 */
export const BRANCH_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
}

/** 获取年上起月天干表 (年天干 → 正月天干索引) */
export function getMonthStemIndex(yearStemIndex: number): number {
  // 甲己之年丙作首，乙庚之年戊为头...
  const lookup = [2, 4, 6, 8, 0] // 对应 甲己(0), 乙庚(1), 丙辛(2), 丁壬(3), 戊癸(4)
  return lookup[yearStemIndex % 5]
}

/** 获取日上起时天干表 (日天干 → 子时天干索引) */
export function getHourStemIndex(dayStemIndex: number): number {
  // 甲己还加甲，乙庚丙作初...
  const lookup = [0, 2, 4, 6, 8]
  return lookup[dayStemIndex % 5]
}

/** 生肖 */
export const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

/** 节气月份对应 (阳历月 → 节气月支) */
export const SOLAR_TERM_MONTH_BRANCH = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']

/** 时辰索引 (hour 0-23 → 时辰 0-11) */
export function getShiChenIndex(hour: number): number {
  if (hour === 23 || hour === 0) return 0
  return Math.floor((hour + 1) / 2)
}

/** 获取天干索引 (0-based) */
export function getStemIndex(name: string): number {
  return HEAVENLY_STEMS.indexOf(name)
}

/** 获取地支索引 (0-based) */
export function getBranchIndex(name: string): number {
  return EARTHLY_BRANCHES.indexOf(name)
}
