# Plainly Development Rules

> ⚠️ **MANDATORY FOR ALL AI MODELS**: Read and follow these rules before making ANY changes.

---

## 📊 PROJECT STATUS

| Category | Tools Count |
|----------|-------------|
| AI Tools | 37 |
| Finance | 38 |
| Health | 27 |
| Math | 28 |
| Converter | 16 |
| Fun | 17 |
| Other | 40 |
| Real Estate | 7 |
| Sustainability | 9 |
| Tech | 13 |
| Text | 11 |
| **TOTAL** | **243** |

---

## 🎯 HIGHEST PRIORITY

```
ZERO BUGS | ZERO BROKEN FEATURES | PERFECT STYLING | MOBILE-FIRST
```

---

## 🔒 NON-NEGOTIABLE RULES

### 1. AI Model Usage - Automatic Fallback System
Always use the Groq AI fallback chain in `src/services/groqAI.js`:

| Priority | Model | Daily Limit |
|----------|-------|-------------|
| 1st | `llama-3.1-8b-instant` | 14,400/day |
| 2nd | `allam-2-7b` | 7,000/day |
| 3rd | `moonshotai/kimi-k2-instruct` | 1,000/day |
| 4th | `llama-3.3-70b-versatile` | 1,000/day |
| 5th | `meta-llama/llama-4-scout-17b-16e-instruct` | 1,000/day |
| 6th | `meta-llama/llama-4-maverick-17b-128e-instruct` | 1,000/day |

**Total Capacity: ~26,400 requests/day**

All AI functions use `askGroq()` which auto-falls back to the next model if rate limited.

### 2. Existing Code is SACRED
- **DO NOT** modify, refactor, or delete ANY existing tool without explicit user permission
- **DO NOT** touch code of previously created tools
- If change is absolutely necessary, EXPLAIN why and GET APPROVAL first
- Never rewrite files unnecessarily

### 3. Design & Styling Consistency
Keep ALL designs consistent with existing Plainly style:
- **Dark theme**: `#0a0a0a` background, `#1a1a2e` cards
- **Accent colors**: Purple `#a78bfa`, gradients `#8b5cf6`
- **Border radius**: `12px` for cards, `8px` for inputs
- **Font sizes**: 16px body, 14px labels, 12px meta
- **Spacing**: 16px, 24px, 32px consistent gaps

### 4. Mobile Optimization (MANDATORY)
Every tool MUST be mobile-perfect:
- ✅ Min 44px × 44px touch targets
- ✅ Min 16px spacing between elements
- ✅ Min 14px fonts (16px for inputs)
- ✅ No horizontal overflow
- ✅ Responsive layouts that work on all screen sizes
- ✅ 60fps animations

### 5. AI Output Formatting - Two Components

#### For CODE Output (generators, converters, schema tools):
Use `CodePreview` component from `src/components/CodePreview/`:
- **Code-only extraction**: Strips markdown explanations, copies ONLY code
- **Line numbers**: Shows line numbers for easy reference
- **Download as file**: Downloads code with proper extension (.js, .py, .sql, etc.)
- **Copy button**: Copies extracted code only (not explanations)
- **Placeholder state**: Beautiful empty state before generation

```jsx
import CodePreview from '../../../components/CodePreview/CodePreview'

// Usage:
<CodePreview 
    code={result} 
    language="javascript" 
    filename="my-code"
/>
```

#### For TEXT Output (explanations, analysis, recommendations):
Use `AIOutputFormatter` component:
- Clean markdown stripping (no `**` visible)
- Proper list formatting (bullets, numbers)
- Auto-scroll to results
- Copy button functionality
- Beautiful card-style presentation

### 6. No Duplicate Tools
Before creating ANY new tool:
1. Check `src/data/calculators.js` for existing tools
2. Check all category folders in `src/pages/calculators/`
3. If a similar tool exists, enhance it instead of creating a duplicate

### 7. Research Before Implementation
For every new tool:
1. Research what features are necessary (check competitors)
2. Identify all required input fields
3. Plan the output format
4. Design mobile-first layout
5. Only then implement

### 8. Graphics & Visual Quality
- Use proper icons from `lucide-react`
- Add subtle gradients and shadows
- Include loading states with animations
- Error states must be styled (not just text)
- Success states should feel rewarding

### 9. Category Management
- New tools must be added to `src/data/calculators.js`
- Assign correct category
- Latest tools should appear on home page
- Category pages must display all tools in that category

---

## 📋 MANDATORY CHECKLIST FOR NEW TOOLS

Before submitting any new tool, verify:

- [ ] Tool doesn't already exist
- [ ] Uses `askGroq()` for AI features (with fallback)
- [ ] Uses `CodePreview` for code output OR `AIOutputFormatter` for text output
- [ ] Matches existing design system
- [ ] Mobile responsive (tested at 375px width)
- [ ] All touch targets ≥ 44px
- [ ] Has loading and error states
- [ ] Copy functionality works (code-only for code tools)
- [ ] Added to `calculators.js` with correct category
- [ ] Route added to `App.jsx`
- [ ] Build passes without errors (`npm run build`)

---

## 🚫 FORBIDDEN ACTIONS

❌ Modifying existing tools without permission
❌ Creating duplicate tools
❌ Ignoring mobile responsiveness
❌ Hardcoding AI model names (use MODELS object)
❌ Leaving placeholder content
❌ Skipping error handling
❌ Breaking existing functionality
❌ Using different styling than the design system

---

## 🛠️ TECHNICAL STACK

- **Framework**: React + Vite
- **Styling**: CSS (no Tailwind unless explicitly requested)
- **Icons**: Lucide React
- **AI Service**: Groq API (`src/services/groqAI.js`)
- **Routing**: React Router DOM
- **Deployment**: Cloudflare Pages

---

## 📁 PROJECT STRUCTURE

```
src/
├── components/
│   ├── AIOutputFormatter.jsx     # AI text output formatting
│   ├── CodePreview/
│   │   ├── CodePreview.jsx       # Code output with line numbers, copy, download
│   │   └── CodePreview.css       # Code preview styling
│   ├── Calculator/
│   │   └── CalculatorLayout.jsx  # Standard layout for tools
│   └── Layout/
│       ├── Header.jsx
│       └── Footer.jsx
├── data/
│   └── calculators.js            # Tool registry
├── pages/
│   ├── Home.jsx
│   ├── categories/               # Category landing pages
│   └── calculators/
│       ├── ai/                   # 35 AI tools
│       ├── finance/              # 38 Finance tools
│       ├── health/               # 27 Health tools
│       ├── math/                 # 28 Math tools
│       ├── converter/            # 16 Converter tools
│       ├── fun/                  # 17 Fun tools
│       ├── other/                # 40 Other tools
│       ├── realestate/           # 7 Real Estate tools
│       ├── sustainability/       # 9 Sustainability tools
│       ├── tech/                 # 13 Tech tools
│       └── text/                 # 11 Text tools
└── services/
    └── groqAI.js                 # AI with auto-fallback
```

---

## 📝 RESPONSE FORMAT (MANDATORY)

Every code change response must include:
1. What was added/changed
2. Why existing features remain safe
3. Mobile optimization verification
4. Build verification status

---

## 🔧 BUILD & DEPLOY

```bash
# Development
npm run dev

# Build (must pass without errors)
npm run build

# Deploy (auto via Cloudflare Pages on git push)
git add . && git commit -m "message" && git push origin main
```

---

## ⚡ QUICK REFERENCE

| Action | Location |
|--------|----------|
| Add new tool | `src/pages/calculators/{category}/` |
| Register tool | `src/data/calculators.js` |
| Add route | `src/App.jsx` |
| Code output | Use `CodePreview` |
| Text output | Use `AIOutputFormatter` |
| AI calls | Use `askGroq()` from `groqAI.js` |
| Icons | Import from `lucide-react` |

---

**Last Updated**: 2026-02-01  
**Total Tools**: 243  
**AI Models in Fallback**: 6
