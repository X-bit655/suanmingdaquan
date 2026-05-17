function buildZiWeiPrompt(input, data) {
  const mg = data.palaces[data.mingGong];
  return "请分析以下紫微斗数命盘：\n\n"
    + "出生：" + input.birthYear + "年" + input.birthMonth + "月" + input.birthDay + "日" + input.birthHour + "时 "
    + (input.gender === "male" ? "男" : "女") + "\n"
    + "命宫：" + (mg ? mg.name : "") + "\n"
    + "请分析命格特点、事业方向、财运婚姻。输出JSON格式。";
}
exports.buildZiWeiPrompt = buildZiWeiPrompt;
