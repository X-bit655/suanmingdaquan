function buildZiWeiPrompt(input, data) {
  const mg = data.palaces[data.mingGong]
  const mgStars = mg ? [...mg.majorStars.map((s: any) => s.name), ...mg.minorStars.map((s: any) => s.name)].join('、') : ''

  const palaceList = data.palaces.map((p: any) => {
    const stars = [...p.majorStars.map((s: any) => s.name + '(' + s.brightness + ')'),
      ...p.minorStars.filter((s: any) => s.name).map((s: any) => s.name + '(' + s.brightness + ')')]
    return `  ${p.name}（${p.heavenlyStem}${p.earthlyBranch}）：${stars.length > 0 ? stars.join('、') : '无主星'}`
  }).join('\n')

  return [
    '请以紫微斗数命理师身份，深度分析以下命盘：',
    '',
    '【基本信息】',
    `出生：${input.birthYear}年${input.birthMonth}月${input.birthDay}日${input.birthHour}时 ${input.gender === 'male' ? '男' : '女'}`,
    `命宫：${mg ? mg.name : ''}（主星：${mgStars}）`,
    '',
    '【十二宫星曜分布】',
    palaceList,
    '',
    `【四化】`,
    `化禄在${data.siHua.huaLu} 化权在${data.siHua.huaQuan} 化科在${data.siHua.huaKe} 化忌在${data.siHua.huaJi}`,
    '',
    '【解读维度】',
    '1. 命宫主星格局：命格层次和核心性格',
    '2. 三方四正：财帛、官禄、迁移宫的联动分析',
    '3. 四化飞星：化禄之源、化忌之所在',
    '4. 六亲宫位：夫妻、子女、兄弟、父母',
    '5. 大限走势：当前及近三年的运势波动',
    '6. 特殊格局：如君臣庆会、禄马交驰等',
    '',
    '请输出JSON格式，基于星曜组合和四化关系进行有据可依的分析。',
  ].join('\n')
}
exports.buildZiWeiPrompt = buildZiWeiPrompt;
