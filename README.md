# 算命大全

> 中西合璧，AI 智能解读 — 微信小程序 v1.0

基于 **uni-app + Vue 3 + TypeScript** 构建的算命小程序，融合中国传统命理与现代西方占卜，提供 5 种算命方式及 AI 智能解读。

## 功能

| 算命方式 | 分类 | 说明 |
|---------|------|------|
| 八字命理 | 中式 | 四柱排盘、十神分析、大运走势、五行平衡 |
| 周易占卜 | 中式 | 六爻起卦、卦象解读、变爻分析、互卦/变卦 |
| 紫微斗数 | 中式 | 十二宫排盘、星曜四化、命宫身宫 |
| 星座命盘 | 西式 | 太阳/月亮/上升星座、10 行星、12 宫位 |
| 塔罗占卜 | 西式 | 单张指引 / 三张牌阵 / 凯尔特十字 (78 张完整牌组) |

## 技术栈

- **框架**: uni-app 3.x + Vue 3.4
- **语言**: TypeScript 5.x (strict 模式)
- **状态管理**: Pinia 2.x
- **样式**: Sass + 自定义设计 Token（暗色新中式国风）
- **AI 后端**: 微信云函数 + DeepSeek API
- **平台**: 微信小程序，支持 H5 调试

## 项目结构

```
算命大全/
├── src/
│   ├── components/
│   │   ├── ink/          # Ink 新中式组件库 (12 个组件)
│   │   └── layout/       # PageShell 页面根布局
│   ├── hooks/            # useFortune (算命流程), useSafeArea (安全区)
│   ├── services/         # cloudbase.ts (云函数调用), fortune.ts (重试)
│   ├── stores/           # Pinia 状态管理 (app + fortune)
│   ├── theme/
│   │   └── tokens.scss   # 设计 Token (色彩、字体、间距、阴影)
│   ├── types/            # 完整类型定义 (7 个模块)
│   ├── utils/            # 纯计算引擎 (八字/周易/紫微/星座/塔罗/干支/农历)
│   ├── __tests__/        # 单元测试 (54 个用例)
│   └── pages/            # 页面 (首页 + 5 种算命 + 历史 + 个人中心)
├── cloudbase/functions/fortune/
│   ├── prompts/          # AI Prompt 模板 (5 方法 + 系统 prompt)
│   └── utils/            # DeepSeek 客户端 + 响应解析器
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 数据流

```
用户输入 → 前端纯计算 (utils/*-calc.ts) → 微信云函数 → DeepSeek API → AI 解读 → 本地历史存储
```

AI 不可用时自动降级：显示本地计算结果（排盘/牌面/星盘），保证用户流程不中断。

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发

```bash
# 微信小程序开发
npm run dev:mp-weixin

# H5 浏览器调试
npm run dev:h5
```

> 打开微信开发者工具，导入 `dist/dev/mp-weixin`，即可预览。

### 构建

```bash
npm run build:mp-weixin
```

### 测试

```bash
npm test
```

### 类型检查

```bash
npm run type-check
```

## 设计风格

采用**暗色新中式国风**设计，以深邃墨蓝底色为基础，金色为主 CTA，朱砂红/靛蓝/翠绿为方法标识色。

核心色彩：
- 深邃底 `#0B0F17` / 纸白 `#F8F2E7`
- 金 `#D9AE5F`（主按钮、高亮边框）
- 朱砂 `#D8664B`（中式方法标识）
- 靛蓝 `#7786D9`（紫微标识）
- 翠绿 `#5FC9A3`（星座标识）

完整设计 Token 参见 [src/theme/tokens.scss](src/theme/tokens.scss)。

## 测试

4 个测试文件，54 个测试用例，覆盖：
- 5 种算命计算引擎（八字/周易/紫微/星座/塔罗）
- 天干地支基础数据与映射
- 公历农历转换
- useFortune 流程 hook（成功/失败/降级/重置）
- fortune Pinia store（历史存储/清除）
- InkButton 组件渲染

## 许可

MIT License
