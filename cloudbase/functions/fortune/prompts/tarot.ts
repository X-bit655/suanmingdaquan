function buildTarotPrompt(input, data) {
  let p = "请解读以下塔罗占卜：\n\n牌阵：" + (data.spread === "single" ? "单张" : data.spread === "three-card" ? "三张" : "凯尔特十字") + "\n";
  p += "问题：" + (input.question || "未说明") + "\n\n";
  for (const dc of data.cards) {
    p += "【" + dc.position + "】" + dc.card.name + "（" + (dc.isReversed ? "逆位" : "正位") + "）"
      + (dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright) + "\n";
  }
  p += "\n请结合牌位与问题进行综合解读。输出JSON格式。";
  return p;
}
exports.buildTarotPrompt = buildTarotPrompt;
