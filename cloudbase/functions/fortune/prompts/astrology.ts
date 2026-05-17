function buildAstrologyPrompt(input, data) {
  return "请分析以下星座命盘：\n\n"
    + "出生：" + input.birthYear + "年" + input.birthMonth + "月" + input.birthDay + "日 "
    + input.birthHour + ":" + input.birthMinute + " " + input.city + "\n\n"
    + "太阳：" + data.sunSign + " 月亮：" + data.moonSign + " 上升：" + data.risingSign + "\n\n"
    + "请分析性格特质、情感模式、事业倾向、近期运势。输出JSON格式。";
}
exports.buildAstrologyPrompt = buildAstrologyPrompt;
