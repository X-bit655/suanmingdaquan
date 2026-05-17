# 算命大全

> 中西合璧，AI 智能解读 — 微信小程序

基于 **uni-app + Vue 3 + TypeScript** 构建的算命小程序，融合中国传统文化与现代西方占卜，提供多种算命方式及 AI 智能解读。

## 功能

| 算命方式 | 分类 | 说明 |
|---------|------|------|
| 八字 | 中式 | 生辰八字排盘、十神、大运、五行平衡 |
| 周易 | 中式 | 六爻起卦、卦象解读、变爻分析 |
| 紫微 | 中式 | 紫微斗数十二宫、四化、星曜亮度 |
| 星盘 | 西式 | 星座、行星落宫、上升星座 |
| 塔罗 | 西式 | 单张/三张/凯尔特十字牌阵 |

## 技术栈

- **框架**: uni-app 3.x + Vue 3.4
- **语言**: TypeScript 5.x
- **状态管理**: Pinia 2.x
- **样式**: Sass + 自定义设计 Token（新中式国风）
- **平台**: 微信小程序

## 项目结构

```
算命大全/
├── src/
│   ├── types/          # TypeScript 类型定义
│   │   ├── fortune.ts  # 通用类型（枚举、基础接口）
│   │   ├── bazi.ts     # 八字相关类型
│   │   ├── zhouyi.ts   # 周易相关类型
│   │   ├── ziwei.ts    # 紫微斗数相关类型
│   │   ├── astrology.ts # 星盘相关类型
│   │   ├── tarot.ts    # 塔罗相关类型
│   │   └── api.ts      # 云函数请求/响应类型
│   ├── utils/
│   │   └── ganzhi.ts   # 天干地支计算工具
│   ├── theme/
│   │   └── tokens.scss # 设计 Token
│   ├── App.vue         # 应用入口
│   ├── main.ts         # 主入口
│   └── uni.scss        # uni-app 变量覆盖
├── pages.json          # 页面配置
├── manifest.json       # 应用配置
├── tsconfig.json       # TypeScript 配置
└── package.json        # 依赖管理
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发

```bash
# 微信小程序开发
npm run dev:mp-weixin
```

> 打开微信开发者工具，导入项目根目录，即可预览。

### 构建

```bash
npm run build:mp-weixin
```

### 类型检查

```bash
npm run type-check
```

## 设计风格

采用**新中式国风**设计，以宣纸/墨色体系为基础，朱砂红为主 CTA，金色为高级点缀。

核心色彩：
- 宣纸底 `#F6F1E6` / 纸白 `#FFFAF0`
- 墨色 `#201C18`
- 朱砂 `#B64232`
- 金 `#C8A65A`

详细设计 Token 参见 [src/theme/tokens.scss](src/theme/tokens.scss)。

## 许可

MIT License
