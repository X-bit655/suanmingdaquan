function buildBaziPrompt(input, data) {
  const p = data.pillars;
  return "请分析以下八字排盘：\n\n"
    + "出生：" + input.birthYear + "年" + input.birthMonth + "月" + input.birthDay + "日" + input.birthHour + "时 "
    + (input.gender === "male" ? "男" : "女") + "\n\n"
    + "年柱：" + p.year.heavenlyStem + p.year.earthlyBranch + "\n"
    + "月柱：" + p.month.heavenlyStem + p.month.earthlyBranch + "\n"
    + "日柱：" + p.day.heavenlyStem + p.day.earthlyBranch + "（日主：" + data.dayMaster + "）\n"
    + "时柱：" + p.hour.heavenlyStem + p.hour.earthlyBranch + "\n\n"
    + "五行：金" + data.wuxingBalance.metal + "木" + data.wuxingBalance.wood + "水" + data.wuxingBalance.water + "火" + data.wuxingBalance.fire + "土" + data.wuxingBalance.earth + "\n\n"
    + "请提供：命局概述、喜用神、事业财运、婚姻感情、健康、大运建议。输出JSON格式。";
}
exports.buildBaziPrompt = buildBaziPrompt;
