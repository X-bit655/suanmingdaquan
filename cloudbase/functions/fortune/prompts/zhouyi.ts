function buildZhouYiPrompt(input, data) {
  const h = data.originalHexagram;
  let p = "请解读以下周易卦象：\n\n所占之事：" + (input.question || "未说明") + "\n本卦：" + h.name + "\n卦辞：" + h.judgment + "\n";
  if (h.changingLines.length > 0) p += "变爻：第" + h.changingLines.join(",") + "爻\n";
  if (data.mutualHexagram) p += "互卦：" + data.mutualHexagram.name + "\n";
  if (data.changedHexagram) p += "变卦：" + data.changedHexagram.name + "\n";
  p += "\n请结合所问之事解读卦象，提供吉凶判断和行动建议。输出JSON格式。";
  return p;
}
exports.buildZhouYiPrompt = buildZhouYiPrompt;
