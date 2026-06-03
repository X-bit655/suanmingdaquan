# 算命大全 (Fortune Telling Encyclopedia)

中西多种算命方式微信小程序，AI 智能解读。v1.0。

## 技术栈

- **框架**: uni-app 3.x (Vue 3.4 + TypeScript 5.3)
- **构建**: Vite 8.x + `@dcloudio/vite-plugin-uni`
- **状态管理**: Pinia 2.x
- **样式**: Sass, 暗色新中式国风 (Ink 组件库)
- **CSS 变量**: `src/theme/tokens.scss` (色彩、字体、间距、圆角、阴影)
- **AI 后端**: 微信云函数 + DeepSeek API (`deepseek-chat` 模型)
- **目标平台**: 微信小程序 (`mp-weixin`)，支持 H5 调试

## 项目结构

```
suanmingdaquan/
├── src/
│   ├── components/ink/       # Ink 新中式组件库 (12个)
│   ├── components/layout/    # PageShell 页面根布局
│   ├── hooks/                # useFortune, useSafeArea
│   ├── services/             # cloudbase.ts (云函数调用), fortune.ts (重试+错误处理)
│   ├── stores/               # app.ts, fortune.ts (Pinia)
│   ├── theme/tokens.scss     # 设计 Token (CSS 变量)
│   ├── types/                # 类型定义 (7个模块 + index.ts 统一导出)
│   ├── utils/                # 纯计算引擎 (无副作用)
│   ├── __tests__/            # 单元测试 (4个测试文件, 54个用例)
│   ├── pages/fortune/        # 5个算命页面
│   ├── pages/history/        # 测算历史 (最近50条, 本地存储)
│   ├── pages/index/          # 首页 (方法选择 + 主推卡片)
│   ├── pages/profile/        # 个人中心 + 免责声明
│   ├── manifest.json         # uni-app 配置 (mp-weixin)
│   └── pages.json            # 页面路由 + 3-tabBar
├── cloudbase/functions/fortune/  # 云函数
│   ├── prompts/              # 6个 prompt 模板 (5方法 + 系统 prompt)
│   └── utils/                # DeepSeek 客户端 (HTTPS, 自动重试) + 响应解析器
├── docs/superpowers/         # 设计文档 (specs + plans)
├── vite.config.ts            # uni-app Vite 配置
├── vitest.config.ts          # Vitest 测试配置
├── tsconfig.json             # TypeScript 配置
└── package.json
```

## 5种算命方式

| 方法 | Method枚举 | 页面 | 计算引擎 | AI Prompt |
|------|-----------|------|---------|-----------|
| 八字命理 | `bazi` | [bazi.vue](src/pages/fortune/bazi.vue) | `bazi-calc.ts` + `ganzhi.ts` + `calendar.ts` | `cloudbase/.../prompts/bazi.js` |
| 周易占卜 | `zhouyi` | [zhouyi.vue](src/pages/fortune/zhouyi.vue) | `zhouyi-calc.ts` + `zhouyi-data.ts` | `cloudbase/.../prompts/zhouyi.js` |
| 紫微斗数 | `ziwei` | [ziwei.vue](src/pages/fortune/ziwei.vue) | `ziwei-calc.ts` + `ziwei-data.ts` | `cloudbase/.../prompts/ziwei.js` |
| 星座命盘 | `astrology` | [astrology.vue](src/pages/fortune/astrology.vue) | `astrology-calc.ts` | `cloudbase/.../prompts/astrology.js` |
| 塔罗占卜 | `tarot` | [tarot.vue](src/pages/fortune/tarot.vue) | `tarot-data.ts` | `cloudbase/.../prompts/tarot.js` |

## 数据流架构

```
用户输入 (Vue 表单)
  → 前端纯计算 (utils/*-calc.ts)  → CalculatedData
  → wx.cloud.callFunction('fortune') → 云函数 index.js
  → DeepSeek API (deepseek-client.js, HTTPS + 自动重试) → AI 解读
  → response-parser.js → JSON → AIInterpretation
  → useFortune hook → Pinia store → 本地历史存储 (uni.storage, 50条上限)
```

AI 调用失败时降级：显示本地计算结果（八字排盘/塔罗牌面/星盘等），不中断用户流程。

## 组件 API 约定

Ink 组件遵循以下模式：
- `InkButton`: `block`, `loading`, `type` (primary/secondary/ghost), `size` (sm/md)
- `InkCard`: `elevated`, `gold`, `padding`
- `InkTag`: `selected`, `variant` (gold/jade/default)
- `InkLoading`: `text` prop 显示加载文案
- `InkError`: `message`, `showRetry` 控制重试按钮
- `InkSeal`: `char` prop 显示单个汉字印章
- `InkPageHeader`: `title`, `subtitle`, `showBack` + `@back` 事件
- `InkDivider`: 水墨风格分割线
- `InkInput`: `v-model` 双向绑定, `placeholder`, `multiline`
- `InkEmpty`: `text` 空状态占位
- `InkPicker`: 选择器 (用于日期/选项)
- `InkScroll`: 滚动容器
- `PageShell`: 页面根布局，含暗色渐变背景 + safe-area 适配（避免与微信原生 `page-container` 冲突）

## 类型系统

- `src/types/fortune.ts` — 共享类型: `FortuneMethod`, `CalendarType`, `Gender`, `FortuneFlowState`, `FortuneResult`, `FortuneHistoryItem`, `AIInterpretation`
- `src/types/api.ts` — `CloudFunctionRequest`, `CloudFunctionResponse`
- `src/types/bazi.ts` — `BaziInput`, `BaziCalculatedData`, `Pillar`, `TenGodRelation`, `FortuneCycle`, `WuxingBalance`
- `src/types/zhouyi.ts` — `ZhouYiInput`, `ZhouYiCalculatedData`, `Hexagram`, `Trigram`, `YaoLine`
- `src/types/ziwei.ts` — `ZiWeiInput`, `ZiWeiCalculatedData`, `PalaceData`, `Star`, `SiHua`
- `src/types/astrology.ts` — `AstrologyInput`, `AstrologyCalculatedData`, `PlanetPosition`
- `src/types/tarot.ts` — `TarotInput`, `TarotCalculatedData`, `TarotCard`, `DrawnCard`, `TarotSpreadType`

## 云函数架构

```
cloudbase/functions/fortune/
├── index.js              # 入口: method 路由分发
├── config.json           # 云函数配置
├── prompts/
│   ├── system.js         # 系统 prompt (角色设定 + JSON 格式 + 评分标准)
│   ├── bazi.js           # 八字 prompt (6个解读维度)
│   ├── zhouyi.js         # 周易 prompt
│   ├── ziwei.js          # 紫微 prompt
│   ├── astrology.js      # 星座 prompt
│   └── tarot.js          # 塔罗 prompt (牌阵联动分析)
└── utils/
    ├── deepseek-client.js   # HTTPS 原生调用 DeepSeek, 自动重试 (最多3次)
    └── response-parser.js   # JSON 解析 + score 限幅 [1,100]
```

特点：
- 输出格式统一为 JSON (`response_format: { type: 'json_object' }`)
- 429 限流自动退避重试 (2s → 4s → 6s)
- 20s 超时 + 网络错误自动重试
- 解析容错: JSON 解析失败时返回原始文本作为 analysis

## 开发命令

```bash
npm run dev:mp-weixin    # 微信小程序开发模式 (需微信开发者工具)
npm run build:mp-weixin  # 微信小程序生产构建
npm run dev:h5           # H5 开发模式 (浏览器调试)
npm run build:h5         # H5 生产构建
npm run type-check       # vue-tsc 类型检查
npm run test             # Vitest 单元测试
```

## 测试

4个测试文件，54个测试用例：

| 文件 | 覆盖内容 | 用例数 |
|------|---------|--------|
| `fortune-calculators.test.ts` | 八字/周易/紫微/星座/塔罗/干支/日历计算器 | ~28 |
| `useFortune.test.ts` | useFortune hook (成功/失败/重置/错误码) | 5 |
| `InkButton.test.ts` | InkButton 组件渲染 | ~5 |
| `stores/fortune.test.ts` | Pinia fortune store 状态管理 | ~8 |

> 运行 `npm test` 查看完整结果。

## 当前状态 (v1.0)

- ✅ 全部 5 种算命方式的前端页面、类型、计算引擎
- ✅ Ink 组件库 (12个组件) + PageShell 布局
- ✅ Pinia 状态管理 (app + fortune store)
- ✅ 云函数框架 + DeepSeek AI 集成 (原生 HTTPS, 自动重试)
- ✅ 6个 AI prompt 模板 (5方法 + 系统 prompt, 结构化 JSON 输出)
- ✅ 历史记录 (本地存储 uni.storage, 最近50条)
- ✅ 首页 (方法选择 + 主推卡片) + 个人中心 + 免责声明
- ✅ 塔罗牌数据 — 78张完整验证 (22大 + 56小, 4花色各14张)
- ✅ 单元测试 — 54个用例 (4个测试文件)
- ✅ 星座计算引擎 — 太阳/月亮/上升星座 + 10行星 + 12宫位
- ✅ 紫微斗数引擎 — 14主星 + 4辅星 + 12宫 + 四化算法
- ✅ 周易引擎 — 六爻起卦 + 梅花易数时间起卦 + 互卦/变卦
- ✅ 公历转农历 (1900-2100) + 年干支/生肖
- ✅ H5 开发模式支持 (浏览器调试)
- ✅ TypeScript strict 模式 + 完整类型系统
- ⬜ 微信开发者工具 E2E 真机测试
- ⬜ 云函数生产环境部署验证
- ⬜ useFortune.test.ts 测试 mock 修复 (wx.cloud vs uniCloud)

## 编码约定

- **不可变数据**: View 层使用 ref/reactive，计算层纯函数不修改输入
- **命名**: PascalCase 组件, camelCase 函数/变量, UPPER_SNAKE_CASE 常量
- **类型安全**: 所有 API 边界有完整类型, 禁止 `any`
- **文件大小**: 组件 <400 行, 工具函数 <200 行
- **样式**: 使用 `var(--ink-*)` CSS 变量, 不用硬编码颜色
- **无 console.log**: 避免遗留调试代码（错误日志使用 console.error 是允许的）
- **脚本**: `<script setup lang="ts">` 语法糖统一
- **CSS**: `<style lang="scss" scoped>` 避免样式泄漏
