function buildTarotPrompt(input, data) {
  const spreadName = data.spread === 'single' ? '单张牌' : data.spread === 'three-card' ? '三张牌阵' : '凯尔特十字'

  const parts = [
    '请以资深塔罗解读师身份解读以下塔罗占卜：',
    '',
    `【牌阵】${spreadName}`,
    `【问题】${input.question || '未具体说明'}`,
    '',
    '【抽牌结果】',
  ]

  for (const dc of data.cards) {
    const position = dc.isReversed ? '（逆位）' : '（正位）'
    const meaning = dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright
    parts.push(`${dc.position}：${dc.card.name}${dc.card.nameEn ? ' (' + dc.card.nameEn + ')' : ''} ${position}`)
    parts.push(`  牌义：${meaning}`)
    parts.push(`  关键词：${dc.card.keywords.join('、')}`)
  }

  parts.push(
    '',
    '【解读维度】',
    '1. 单牌精解：每张牌在当前位置的含义',
    '2. 牌阵联动：牌与牌之间的呼应、矛盾与递进',
    '3. 问题回应：直接回答求测者的问题',
    '4. 潜在盲点：牌面揭示的当事人可能忽视的方面',
    '5. 行动指南：基于牌阵智慧的具体建议',
    '',
    '请输出JSON格式，将塔罗象征与实际问题深度结合。',
  )

  return parts.join('\n')
}
exports.buildTarotPrompt = buildTarotPrompt;
