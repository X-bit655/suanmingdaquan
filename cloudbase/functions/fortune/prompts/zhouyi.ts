function buildZhouYiPrompt(input, data) {
  const h = data.originalHexagram
  const parts = [
    '请以周易占卜大师身份解读以下卦象：',
    '',
    `【所问之事】${input.question || '未具体说明'}`,
    '',
    `【本卦】${h.name}（第${h.id}卦）`,
    `卦辞：${h.judgment}`,
    `象曰：${h.image}`,
  ]

  if (h.changingLines.length > 0) {
    parts.push('', `【变爻】第${h.changingLines.join('、')}爻发动`)
    h.changingLines.forEach(i => {
      const line = h.lines.find((l: any) => l.position === i)
      if (line) parts.push(`  第${i}爻：${line.lineText}`)
    })
  }

  if (data.mutualHexagram) {
    parts.push('', `【互卦】${data.mutualHexagram.name} — 过程之象`)
  }

  if (data.changedHexagram) {
    parts.push('', `【变卦】${data.changedHexagram.name} — 结果之象`)
  }

  parts.push(
    '',
    '【解读维度】',
    '1. 卦辞爻辞精解：结合所占之事逐层分析',
    '2. 本卦核心启示：当前处境的本质',
    '3. 变爻关键指向：变化的契机和方向',
    '4. 互卦过程提示：中间可能经历的阶段',
    '5. 变卦最终趋势：事情的发展结果',
    '6. 行动建议：顺势而为的具体策略',
    '',
    '请输出JSON格式，将卦象智慧与求测者的实际问题紧密结合。',
  )

  return parts.join('\n')
}
exports.buildZhouYiPrompt = buildZhouYiPrompt;
