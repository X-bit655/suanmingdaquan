# 塔罗牌数据完整性验证 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 编写自动化测试验证 tarot-data.ts 的 78 张牌数据完整性（字段齐全 + 英文名匹配 Rider-Waite 标准）

**Architecture:** 新增 vitest 测试框架 + 单文件测试套件，内嵌 Rider-Waite 标准牌名作为参考数据，不修改 production 代码

**Tech Stack:** vitest + TypeScript

---

### Task 1: 安装 vitest 并配置

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: 安装 vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: 添加 test script 到 package.json**

Edit `package.json`，在 `"scripts"` 中添加：

```json
"test": "vitest run"
```

- [ ] **Step 3: 创建 vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    include: ['src/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

- [ ] **Step 4: 运行 vitest 验证环境正常**

```bash
npx vitest run
```

Expected: 无测试文件，输出 "No test files found" 或类似提示（非报错）。

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest test framework"
```

---

### Task 2: 编写塔罗牌数据验证测试

**Files:**
- Create: `src/__tests__/tarot-data.test.ts`
- Read: `src/utils/tarot-data.ts`
- Read: `src/types/tarot.ts`

- [ ] **Step 1: 创建测试目录**

```bash
mkdir -p src/__tests__
```

- [ ] **Step 2: 编写测试文件**

创建 `src/__tests__/tarot-data.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { ALL_TAROT_CARDS, shuffleDeck } from '@/utils/tarot-data'
import type { TarotCard } from '@/types/tarot'

// Rider-Waite 标准大阿尔卡纳英文名（按编号排序 0-21）
const STANDARD_MAJOR: Record<number, string> = {
  0: 'The Fool',
  1: 'The Magician',
  2: 'The High Priestess',
  3: 'The Empress',
  4: 'The Emperor',
  5: 'The Hierophant',
  6: 'The Lovers',
  7: 'The Chariot',
  8: 'Strength',
  9: 'The Hermit',
  10: 'Wheel of Fortune',
  11: 'Justice',
  12: 'The Hanged Man',
  13: 'Death',
  14: 'Temperance',
  15: 'The Devil',
  16: 'The Tower',
  17: 'The Star',
  18: 'The Moon',
  19: 'The Sun',
  20: 'Judgement',
  21: 'The World',
}

// Rider-Waite 标准小阿尔卡纳排名（1-14）
const RANKS: Record<number, string> = {
  1: 'Ace', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King',
}

const SUITS: Record<string, string> = {
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  pentacles: 'Pentacles',
}

// ─── 结构完整性 ──────────────────────────────────

describe('塔罗牌数据结构完整性', () => {
  it('共 78 张牌', () => {
    expect(ALL_TAROT_CARDS).toHaveLength(78)
  })

  it('每张牌的必填字段非空', () => {
    for (const card of ALL_TAROT_CARDS) {
      expect(card.id, `id ${card.id}: id 缺失`).toBeGreaterThanOrEqual(0)
      expect(card.name, `id ${card.id}: name 缺失`).toBeTruthy()
      expect(card.nameEn, `id ${card.id}: nameEn 缺失`).toBeTruthy()
      expect(card.arcana, `id ${card.id}: arcana 缺失`).toBeTruthy()
      expect(card.keywords, `id ${card.id}: keywords 缺失`).toBeInstanceOf(Array)
      expect(card.keywords.length, `id ${card.id}: keywords 不足2个`).toBeGreaterThanOrEqual(2)
      expect(card.meaningUpright, `id ${card.id}: meaningUpright 缺失`).toBeTruthy()
      expect(card.meaningReversed, `id ${card.id}: meaningReversed 缺失`).toBeTruthy()
    }
  })

  it('id 无重复', () => {
    const ids = ALL_TAROT_CARDS.map(c => c.id)
    expect(new Set(ids).size).toBe(78)
  })

  it('id 范围 0-77', () => {
    const ids = ALL_TAROT_CARDS.map(c => c.id).sort((a, b) => a - b)
    expect(ids[0]).toBe(0)
    expect(ids[77]).toBe(77)
  })

  it('大阿尔卡纳无 suit，小阿尔卡纳有 suit', () => {
    for (const card of ALL_TAROT_CARDS) {
      if (card.arcana === 'major') {
        expect(card.suit, `id ${card.id} major 不该有 suit`).toBeUndefined()
      } else {
        expect(card.suit, `id ${card.id} minor 必须有 suit`).toBeTruthy()
        expect(['wands','cups','swords','pentacles']).toContain(card.suit)
      }
    }
  })

  it('正位与逆位释义不同', () => {
    for (const card of ALL_TAROT_CARDS) {
      expect(card.meaningUpright, `id ${card.id}: 正逆位释义相同`)
        .not.toBe(card.meaningReversed)
    }
  })
})

// ─── 大阿尔卡纳 ──────────────────────────────────

describe('大阿尔卡纳 (22张)', () => {
  const majors = ALL_TAROT_CARDS.filter(c => c.arcana === 'major')

  it('数量 = 22', () => {
    expect(majors).toHaveLength(22)
  })

  it('英文名与 Rider-Waite 标准一致', () => {
    for (const card of majors) {
      const standard = STANDARD_MAJOR[card.number]
      expect(standard, `id ${card.id} number ${card.number} 不在标准中`).toBeDefined()
      expect(card.nameEn, `id ${card.id}: 期望 "${standard}", 实际 "${card.nameEn}"`)
        .toBe(standard)
    }
  })
})

// ─── 小阿尔卡纳 ──────────────────────────────────

describe('小阿尔卡纳 (56张)', () => {
  const minors = ALL_TAROT_CARDS.filter(c => c.arcana === 'minor')

  it('数量 = 56', () => {
    expect(minors).toHaveLength(56)
  })

  it.each(['wands', 'cups', 'swords', 'pentacles'])(
    '%s 花色有 14 张牌', (suit) => {
      const suitCards = minors.filter(c => c.suit === suit)
      expect(suitCards).toHaveLength(14)
    }
  )

  it('英文名与 Rider-Waite 格式一致', () => {
    for (const card of minors) {
      const rank = RANKS[card.number]
      const suit = SUITS[card.suit!]
      const expected = `${rank} of ${suit}`
      expect(card.nameEn, `id ${card.id}: 期望 "${expected}", 实际 "${card.nameEn}"`)
        .toBe(expected)
    }
  })
})

// ─── 洗牌函数 ────────────────────────────────────

describe('shuffleDeck()', () => {
  it('返回 78 张牌', () => {
    expect(shuffleDeck()).toHaveLength(78)
  })

  it('返回的是新数组（非原数组引用）', () => {
    const deck = shuffleDeck()
    expect(deck).not.toBe(ALL_TAROT_CARDS)
  })

  it('所有牌不重复', () => {
    const deck = shuffleDeck()
    const ids = deck.map(c => c.id)
    expect(new Set(ids).size).toBe(78)
  })
})
```

- [ ] **Step 3: 运行测试**

```bash
npx vitest run
```

Expected: 所有测试通过（约 13 个测试用例）。

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/tarot-data.test.ts
git commit -m "test: add tarot card data integrity validation"
```
