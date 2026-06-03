function buildAstrologyPrompt(input, data) {
  const planetInfo = data.planets.map(function (p) {
    return '  ' + p.planet + '：' + p.sign + ' 第' + p.house + '宫 ' + p.degree + '°'
  }).join('\n')

  const houseInfo = data.houses.map(function (h, i) {
    return '  第' + (i + 1) + '宫：' + h
  }).join('\n')

  return [
    '请以占星师身份深度分析以下出生星盘：',
    '',
    '【基本信息】',
    '出生：' + input.birthYear + '年' + input.birthMonth + '月' + input.birthDay + '日 ' + input.birthHour + ':' + String(input.birthMinute).padStart(2, '0'),
    '地点：' + input.city,
    '',
    '【三大星座】',
    '太阳星座：' + data.sunSign + '（核心自我）',
    '月亮星座：' + data.moonSign + '（情感需求）',
    '上升星座：' + data.risingSign + '（外在面具）',
    '',
    '【行星落座落宫】',
    planetInfo,
    '',
    '【十二宫位】',
    houseInfo,
    '',
    '【解读维度】',
    '1. 性格分析：日座+月座+上升的三重奏',
    '2. 情感模式：金星与月亮的落座落宫及相位',
    '3. 事业倾向：中天守护星、土星与第十宫',
    '4. 人际关系：水星沟通风格、第七宫伙伴关系',
    '5. 当下运势：结合当前行星过境的简要提示',
    '',
    '请输出JSON格式，结合行星、宫位、星座三元进行系统分析。',
  ].join('\n')
}
exports.buildAstrologyPrompt = buildAstrologyPrompt
