# 算命大全 (Fortune Telling Encyclopedia)

中西多种算命方式小程序，AI 智能解读。

## 技术栈

- **框架**: uni-app 3.x (Vue 3.4 + TypeScript 5.3)
- **构建**: Vite 5.x + `@dcloudio/vite-plugin-uni`
- **状态管理**: Pinia 2.x
- **样式**: Sass, 新中式水墨风格 (Ink 组件库)
- **CSS 变量**: `src/theme/tokens.scss` (色彩、字体、间距、圆角)
- **AI 后端**: 微信云函数 + DeepSeek API
- **目标平台**: 微信小程序 (`mp-weixin`)

## 项目结构

```
算命大全/
├── src/
│   ├── components/ink/     # Ink 新中式组件库 (11个)
│   ├── components/layout/  # PageContainer 通用布局
│   ├── hooks/              # useFortune, useSafeArea
│   ├── services/           # cloudbase.ts, fortune.ts
│   ├── stores/             # app.ts, fortune.ts (Pinia)
│   ├── theme/tokens.scss   # 设计 token
│   ├── types/              # 完整类型定义 (6个模块)
│   └── utils/              # 纯计算引擎 (无副作用)
├── pages/fortune/          # 5个算命页面
├── pages/history/          # 测算历史
├── pages/index/            # 首页 (方法选择)
├── pages/profile/          # 个人中心
├── cloudbase/functions/fortune/  # 云函数
│   ├── prompts/            # 5种AI prompt模板 + 系统prompt
│   └── utils/              # DeepSeek客户端 + 响应解析
├── manifest.json           # uni-app配置 (mp-weixin)
├── pages.json              # 页面路由 + tabBar
└── package.json
```

## 5种算命方式

| 方法 | Method枚举 | 页面 | 计算引擎 | AI Prompt |
|------|-----------|------|---------|-----------|
| 八字命理 | `bazi` | pages/fortune/bazi.vue | `bazi-calc.ts` + `ganzhi.ts` | `bazi.ts` |
| 周易占卜 | `zhouyi` | pages/fortune/zhouyi.vue | `zhouyi-calc.ts` + `zhouyi-data.ts` | `zhouyi.ts` |
| 紫微斗数 | `ziwei` | pages/fortune/ziwei.vue | `ziwei-calc.ts` + `ziwei-data.ts` | `ziwei.ts` |
| 星座命盘 | `astrology` | pages/fortune/astrology.vue | `astrology-calc.ts` | `astrology.ts` |
| 塔罗占卜 | `tarot` | pages/fortune/tarot.vue | `tarot-data.ts` | `tarot.ts` |

## 数据流架构

```
用户输入 (Vue表单)
  → 前端纯计算 (utils/*-calc.ts)  → CalculatedData
  → uniCloud.callFunction('fortune') → 云函数
  → DeepSeek API (deepseek-client.ts) → AI解读
  → response-parser.ts → JSON → CloudFunctionResponse
  → useFortune hook → Pinia store → history storage
```

## 组件 API 约定

Ink 组件遵循以下模式：
- `InkButton`: block, loading, type (primary/secondary/gold)
- `InkCard`: elevated
- `InkTag`: selected, variant (gold)
- `InkLoading`: text prop 显示加载文案
- `InkError`: message, showRetry 控制重试按钮
- `InkSeal`: char prop 显示单个汉字印章
- `InkPageHeader`: title, subtitle, showBack
- `InkDivider`: 水墨风格分割线
- `InkInput`: v-model 双向绑定
- `InkEmpty`: 空状态占位
- `InkPicker`: 选择器
- `InkScroll`: 滚动容器

## 类型系统

- `src/types/fortune.ts` — 共享类型: FortuneMethod, CalendarType, Gender, FortuneFlowState, FortuneResult, FortuneHistoryItem
- `src/types/api.ts` — CloudFunctionRequest/Response
- 各方法类型文件 — `<Method>Input`, `<Method>CalculatedData`

## 开发命令

```bash
npm run dev:mp-weixin   # 开发模式 (需微信开发者工具)
npm run build:mp-weixin  # 生产构建
npm run type-check       # vue-tsc 类型检查
```

## 当前状态

- ✅ 全部 5 种算命方式的前端页面、类型、计算引擎已完成
- ✅ Ink 组件库 (11个组件) 已完成
- ✅ Pinia 状态管理 (app + fortune store) 已完成
- ✅ 云函数框架 + DeepSeek AI 集成已完成
- ✅ 5种 AI prompt 模板已完成
- ✅ 历史记录 (本地存储, 最近50条) 已完成
- ✅ 首页/个人中心/免责声明已完成
- ⬜ 塔罗牌数据 (`tarot-data.ts`) — 78张牌数据待验证完整性
- ⬜ 微信开发者工具 E2E 测试
- ⬜ 云函数部署验证
- ⬜ AI prompt 效果调优

## 编码约定

- **不可变数据**: View 层使用 ref/reactive, 计算层纯函数不修改输入
- **命名**: PascalCase 组件, camelCase 函数/变量, UPPER_SNAKE_CASE 常量
- **类型安全**: 所有 API 边界有完整类型, 禁止 `any`
- **文件大小**: 组件 <400 行, 工具函数 <200 行
- **样式**: 使用 `var(--ink-*)` CSS 变量, 不用硬编码颜色
- **无 console.log**: 避免遗留调试代码
