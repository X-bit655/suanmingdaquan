# 塔罗牌数据完整性验证 — 设计文档

## 目标

编写测试验证 `src/utils/tarot-data.ts` 中 78 张牌的数据完整性，以及英文牌名与 Rider-Waite 标准一致。

## 验证范围

### 1. 结构完整性
- 总牌数 = 78（22 大阿尔卡纳 + 56 小阿尔卡纳）
- 每张牌必填字段非空：id, name, nameEn, arcana, keywords, meaningUpright, meaningReversed
- id 无重复，范围 0-77
- 小阿尔卡纳 suit 字段非空，大阿尔卡纳 suit 为 undefined
- keywords 数组最少 2 个元素
- meaningUpright !== meaningReversed

### 2. 大阿尔卡纳
- 22 张，arcana === 'major'
- nameEn 与 Rider-Waite 标准一一匹配（The Fool 到 The World，含 Judgement 拼写）

### 3. 小阿尔卡纳
- 56 张，4 花色各 14 张（wands, cups, swords, pentacles）
- 每个花色：Ace ~ Ten + Page, Knight, Queen, King
- nameEn 格式：`<Rank> of <Suit>`

### 4. 洗牌函数
- shuffleDeck() 返回 78 张
- 所有牌不重复
- 与原数组不是同一引用

## 技术方案

- 测试框架：vitest（uni-app 项目兼容）
- 在测试文件中内嵌 Rider-Waite 标准牌名作为参考
- 纯本地验证，不依赖网络

## 文件

| 操作 | 路径 |
|------|------|
| 新建 | `src/__tests__/tarot-data.test.ts` |

## 非目标

- 不审查中文译名是否准确（留待后续）
- 不审查 keywords 语义是否恰当
- 不修改 tarot-data.ts 的牌义内容
