function buildBaziPrompt(input, data) {
  const p = data.pillars
  const tenGodsInfo = data.tenGods ? '十神分布：' + data.tenGods.map(function (g, i) {
    return ['年', '月', '日', '时'][i] + '柱' + g
  }).join('、') : ''

  return [
    '请以资深八字命理师身份，深度分析以下八字排盘：',
    '',
    '【基本信息】',
    '出生：' + input.birthYear + '年' + input.birthMonth + '月' + input.birthDay + '日' + input.birthHour + '时 ' + (input.gender === 'male' ? '男' : '女'),
    '',
    '【四柱八字】',
    '年柱：' + p.year.heavenlyStem + p.year.earthlyBranch,
    '月柱：' + p.month.heavenlyStem + p.month.earthlyBranch,
    '日柱：' + p.day.heavenlyStem + p.day.earthlyBranch + '（日主：' + data.dayMaster + '）',
    '时柱：' + p.hour.heavenlyStem + p.hour.earthlyBranch,
    '',
    '【五行能量】',
    '金' + data.wuxingBalance.metal + ' 木' + data.wuxingBalance.wood + ' 水' + data.wuxingBalance.water + ' 火' + data.wuxingBalance.fire + ' 土' + data.wuxingBalance.earth,
    tenGodsInfo,
    '',
    '【解读维度】',
    '1. 格局分析：日主强弱、取用神、格局高低',
    '2. 性格特质：五行强弱反映的性格倾向',
    '3. 事业财运：适合的行业方向、财运走势',
    '4. 婚姻感情：配偶宫、夫妻星分析',
    '5. 健康提示：五行偏枯对应的身体关注点',
    '6. 大运走势：当前所处大运阶段及建议',
    '',
    '请输出JSON格式，analysis字段需覆盖以上所有维度。',
  ].filter(Boolean).join('\n')
}
exports.buildBaziPrompt = buildBaziPrompt
