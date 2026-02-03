# Plainly Project Guidelines

> ⚠️ **MANDATORY FOR ALL AI MODELS**: Read and follow these rules before making ANY changes.

---

## 📊 PROJECT STATUS

| Category | Tools Count |
|----------|-------------|
| AI Tools | 43 |
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
| **TOTAL** | **249** |

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

### 1b. Pollinations AI - Image/Video/Text Generation
Use Pollinations AI for image, video, and advanced text generation. Service file: `src/services/pollinationsAI.js`

**API Key:** Set `VITE_POLLINATIONS_API_KEY` in environment variables
**Budget:** Unlimited | **Models:** 41 (All)

#### API Endpoints:
| Type | Endpoint | Method |
|------|----------|--------|
| Text | `https://text.pollinations.ai/{prompt}?model=MODEL&key=KEY` | GET |
| Image | `https://image.pollinations.ai/prompt/{prompt}?model=MODEL&key=KEY` | GET |
| Video | `https://gen.pollinations.ai/video/{prompt}?model=MODEL&key=KEY` | GET |

#### Image Models (12):
| Model | API ID | Notes |
|-------|--------|-------|
| Flux Schnell | `flux` | **Best quality** ⭐ |
| SDXL Turbo | `turbo` | **Fastest** ⚡ |
| GPT Image 1 Mini | `gptimage` | Creative |
| Seedream 4.0 | `seedream` | Artistic |
| FLUX.2 Klein 4B | `klein` | Fast |
| NanoBanana | `nanobanana` | Experimental |

#### Video Models (4):
| Model | API ID |
|-------|--------|
| Wan 2.6 | `wan` | **Best** ⭐ |
| Seedance Pro-Fast | `seedance-pro` |
| Seedance Lite | `seedance` |
| Veo 3.1 Fast | `veo` |

#### Text Models (21): 
Claude (`claude`, `claude-fast`, `claude-large`), GPT (`openai`, `openai-fast`, `openai-large`), Gemini (`gemini`, `gemini-fast`, `gemini-large`), DeepSeek (`deepseek`), Grok (`grok`), Perplexity (`perplexity-reasoning`), Qwen Coder (`qwen-coder`), and more.

### 1c. API Keys - Shared Across Web & Mobile
**IMPORTANT**: When adding a new API key or service, add it to BOTH platforms:

| Service | Web (.env) | Mobile (.env) |
|---------|------------|---------------|
| Groq AI | `VITE_GROQ_API_KEY` | `EXPO_PUBLIC_GROQ_API_KEY` |
| Pollinations AI | `VITE_POLLINATIONS_API_KEY` | `EXPO_PUBLIC_POLLINATIONS_API_KEY` |

- Web uses `VITE_` prefix for Vite bundler
- Mobile uses `EXPO_PUBLIC_` prefix for Expo
- **Same API key value** should be used in both platforms
- Always update both `.env` files when adding new services

### 2. Existing Code is SACRED
- **DO NOT** modify, refactor, or delete ANY existing tool without explicit user permission
- **DO NOT** touch code of previously created tools
- If change is absolutely necessary, EXPLAIN why and GET APPROVAL first
- Never rewrite files unnecessarily

### 2b. 🤖 AI ASSISTANT KNOWLEDGE - CRITICAL RULE

**⚠️ AFTER EVERY TOOL UPDATE, THE AI ASSISTANT MUST BE UPDATED!**

The AI Assistant (both web and mobile) must know about EVERY single tool so it can:
- Accurately suggest the right tool for user queries
- Provide clickable links that users can tap to go directly to tools
- Cover all 309+ tools across all categories

**Files to Update When Adding/Modifying Tools:**

| Platform | File | What to Update |
|----------|------|----------------|
| Web | `src/data/calculators.js` | Add tool entry (name, path, description, icon, category) |
| Mobile | `mobile/constants/Tools.ts` | Add tool entry to `allTools` array |
| Mobile AI | `mobile/services/groqAI.ts` | Auto-updates from `allTools` (no manual change needed) |
| Web AI | `src/components/AIAssistant/AIAssistant.jsx` | Auto-updates from `allCalculators` (no manual change needed) |

**AI Assistant Knowledge Sources:**
- Web: `src/data/calculators.js` → `allCalculators` array (automatically builds prompt)
- Mobile: `mobile/constants/Tools.ts` → `allTools` array (automatically builds `TOOL_DATABASE` and prompt)

**Checklist After Adding Any Tool:**
- [ ] Tool added to web `calculators.js` with correct path
- [ ] Tool added to mobile `Tools.ts` with matching path
- [ ] AI Assistant can now suggest the tool (test by typing related keywords)
- [ ] Tool card appears when AI recommends it (test clicking to verify navigation)

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

### 6. Creative Content Types (CRITICAL)
When using `generateCreativeContent()` from `groqAI.js`, use the CORRECT type:

| Content Type | Use For |
|--------------|---------|
| `storyStarter` | Story opening paragraphs |
| `plot` | Plot outlines |
| `poem` | Poems |
| `lyrics` | Song lyrics |
| `joke` | Jokes ONLY |
| `quote` | Quotes ONLY |
| `pickupLine` | Pickup lines |
| `rapName` | Rap stage names |
| `bandName` | Band/music group names |
| `username` | Usernames |

**⚠️ NEVER use the wrong type (e.g., don't use 'quote' for usernames)**

### 7. No Duplicate Tools
Before creating ANY new tool:
1. Check `src/data/calculators.js` for existing tools
2. Check all category folders in `src/pages/calculators/`
3. If a similar tool exists, enhance it instead of creating a duplicate

### 8. Research Before Implementation
For every new tool:
1. Research what features are necessary (check competitors)
2. Identify all required input fields
3. Plan the output format
4. Design mobile-first layout
5. Only then implement

### 9. Graphics & Visual Quality
- Use proper icons from `lucide-react`
- Add subtle gradients and shadows
- Include loading states with animations
- Error states must be styled (not just text)
- Success states should feel rewarding

### 10. Category Management
- New tools must be added to `src/data/calculators.js`
- Assign correct category
- Latest tools should appear on home page
- Category pages must display all tools in that category

### 11. ⚠️ CRITICAL: Verify Icon Imports (MANDATORY)
When adding new tools to `calculators.js`, you **MUST**:
1. **Check FIRST** if the icon is already imported at the top of the file
2. **Search for the exact icon name** in the import block (lines 1-150)
3. **If NOT found, ADD IT** to the lucide-react imports BEFORE using it
4. **Run `npm run build`** to verify no import errors

**Common icons that cause crashes if not imported:**
- `Image` - for image/photo tools
- `Laugh` - for fun/humor tools
- `Video` - for video tools
- `Camera` - for camera/photo tools

**❌ NEVER assume an icon is imported - ALWAYS VERIFY!**

### 12. SEO Optimization (Automatic via CalculatorLayout)
Every tool using `CalculatorLayout` automatically gets dynamic SEO meta tags:

| Meta Tag | Format |
|----------|--------|
| **Title** | `{title} - Free Online Calculator | Plainly Tools` |
| **Description** | `{description} Use this free {title} tool online at Plainly Tools.` |
| **Canonical URL** | `https://www.plainly.live{path}` |
| **Open Graph** | og:title, og:description, og:url |
| **Twitter Card** | twitter:title, twitter:description |

**How it works:**
- `CalculatorLayout` uses `react-helmet-async` to inject dynamic `<title>` and `<meta>` tags
- Each tool's `title` and `description` props are used
- The current path is used for canonical URL

**Requirements for new tools:**
1. ✅ Always use `CalculatorLayout` wrapper
2. ✅ Provide meaningful `title` prop (e.g., "BMI Calculator")
3. ✅ Provide descriptive `description` prop that includes keywords
4. ✅ Keep titles concise (under 60 characters)
5. ✅ Keep descriptions informative (100-160 characters ideal)

**❌ NEVER skip the CalculatorLayout wrapper - this breaks SEO!**

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
- [ ] **⚠️ Icon is imported in calculators.js** (VERIFY FIRST!)
- [ ] Added to `calculators.js` with correct category
- [ ] Route added to `App.jsx`
- [ ] Import added to `App.jsx`
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
❌ **Using an icon without verifying it's imported** (CAUSES SITE-WIDE CRASH!)
❌ **Deleting or changing code of ANY tool without explicit user permission**

---

## 🔄 AI TOOL REFRESH WARNING (MANDATORY)

Every AI-powered tool MUST include a refresh warning tip. Add this styled tip box after the result section or at the bottom of the tool:

```jsx
{/* Refresh Tip */}
<div style={{
    marginTop: '16px',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)',
    border: '1px solid #3b82f640',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#60a5fa',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px'
}}>
    <span style={{ fontSize: '16px' }}>💡</span>
    <span><strong>Tip:</strong> If the tool doesn't respond after generation, try refreshing the page and generating again.</span>
</div>
```

This must be included in ALL AI tools to help users troubleshoot common issues.

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
│       ├── ai/                   # 37 AI tools
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

**Last Updated**: 2026-02-02  
**Total Tools**: 309  
**AI Models in Fallback**: 6

---

## 📱 MOBILE APP DEVELOPMENT (Expo/React Native)

### App Location
```
mobile/                           # React Native app root
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx             # Home screen
│   │   ├── explore.tsx           # Explore/search screen
│   │   ├── favorites.tsx         # Favorites screen
│   │   ├── history.tsx           # History screen
│   │   └── settings.tsx          # Settings screen
│   ├── tool/
│   │   └── [id].tsx              # Tool detail screen
│   └── tools/                    # Native tool implementations
│       ├── tip-calculator.tsx
│       ├── bmi-calculator.tsx
│       └── ...
├── components/                   # Reusable components
│   ├── AIChat.tsx                # AI Assistant chat UI
│   └── AIFloatingButton.tsx      # Floating AI button

### ✅ Mobile Tool Implementation Split (MANDATORY)

There are **two types** of tools in the mobile app:

#### 1) ✅ Native Tools (Fully Working Inside App)
These tools are implemented natively in `mobile/app/tools/` and must preserve all website features while matching the app design.

**Calculator Tools:**
- Age Calculator
- BMI Calculator
- Calorie Calculator
- Compound Interest Calculator
- Discount Calculator
- GPA Calculator
- Loan Calculator
- Percentage Calculator
- Random Generator
- Tip Calculator
- Water Intake Calculator

**AI Tools:**
- AI Blog Post Generator
- AI Business Name Generator
- AI Code Generator
- AI Cover Letter Generator
- AI Email Generator
- AI Grammar Checker
- AI Hashtag Generator
- AI Image Generator
- AI Instagram Caption Generator
- AI Joke Generator
- AI LinkedIn Post Generator
- AI Meta Description Generator
- AI Paragraph Generator
- AI Paraphraser
- AI Poem Generator
- AI Product Description Generator
- AI Quote Generator
- AI Resume Summary Generator
- AI Sentence Expander
- AI Sentence Shortener
- AI Slogan Generator
- AI Story Starter Generator
- AI Text Summarizer
- AI Translator
- AI Tweet Generator
- AI Username Generator

#### 2) 🔗 Website-Linked Tools (WebView)
All **other tools** are rendered via the website inside the app using `mobile/app/tool/[id].tsx`.

- **Count:** Total tools minus the 37 native tools above
- **Rule:** If a tool is not in the native list, it is a website-linked tool
- **Expectation:** Must keep full website features while matching app styling where applicable
├── constants/
│   ├── Colors.ts                 # Design tokens
│   └── Tools.ts                  # Tool registry (309+ tools)
├── services/
│   └── groqAI.ts                 # AI service
└── stores/
    └── useStorageStore.ts        # Zustand store for favorites/history
```

### 📋 ADDING A NEW TOOL TO MOBILE APP

#### Step 1: Add to Tool Registry
Edit `mobile/constants/Tools.ts`:

```typescript
// Add to allTools array
{ 
  id: 'my-tool',                    // Unique kebab-case ID
  name: 'My Tool Calculator',       // Display name
  description: 'Description here.', // Short description
  icon: 'Calculator',               // Lucide icon name
  path: '/my-tool-calculator',      // URL path (matches web)
  category: 'Finance',              // MUST match ToolCategory type
  isAI: false,                      // true for AI-powered tools
},
```

**⚠️ Category MUST be one of:**
`'Finance' | 'Health' | 'Math' | 'Converter' | 'AI' | 'Fun' | 'Other' | 'Real Estate' | 'Sustainability' | 'Tech' | 'Text'`

#### Step 2: Create Native Implementation (Optional)
If the tool should work natively (not via WebView):

1. Create file: `mobile/app/tools/my-tool-calculator.tsx`
2. Add to NATIVE_TOOLS map in `mobile/app/tool/[id].tsx`:

```typescript
const NATIVE_TOOLS: { [key: string]: string } = {
  // ... existing tools
  'my-tool': '/tools/my-tool-calculator',
};
```

#### Step 3: Native Tool Template

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function MyToolCalculator() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    // Calculation logic here
    setResult('Result: ...');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Tool Calculator</Text>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {/* Input Section */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Input Label</Text>
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Enter value..."
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>

            {/* Result */}
            {result && (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{result}</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderPrimary,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  calculateButton: {
    backgroundColor: Colors.accentPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
```

### 🎨 MOBILE STYLING RULES

#### Colors (from `mobile/constants/Colors.ts`)
```typescript
// Backgrounds
Colors.bgPrimary      // '#000000' - Main background (AMOLED black)
Colors.bgSecondary    // '#0a0a0f' - Slightly elevated
Colors.bgCard         // '#12121c' - Card backgrounds
Colors.bgElevated     // '#1a1a28' - Elevated surfaces, inputs
Colors.bgCardGlass    // 'rgba(18,18,28,0.7)' - Glass effect cards

// Text
Colors.textPrimary    // '#ffffff' - Primary text, headings
Colors.textSecondary  // '#a0a0b0' - Body text, descriptions
Colors.textTertiary   // '#6a6a7a' - Muted text, counts, meta
Colors.textMuted      // '#4a4a58' - Placeholder text

// Accent (Purple theme)
Colors.accentPrimary  // '#a855f7' - Primary purple
Colors.accentGlow     // 'rgba(168,85,247,0.2)' - Glow/highlight backgrounds
Colors.accentGlowStrong // 'rgba(168,85,247,0.4)' - Stronger glow

// Semantic
Colors.success        // '#22c55e' - Success states
Colors.warning        // '#f59e0b' - Warning states
Colors.error          // '#ef4444' - Error states
Colors.info           // '#3b82f6' - Info states

// Borders
Colors.borderPrimary  // 'rgba(255,255,255,0.06)' - Subtle borders
Colors.borderSecondary // 'rgba(255,255,255,0.1)' - Slightly visible
Colors.borderAccent   // 'rgba(168,85,247,0.3)' - Accent borders
```

#### Spacing & Sizing
| Element | Size | Notes |
|---------|------|-------|
| Touch targets | Min 44×44px | **MANDATORY** for accessibility |
| Button height | 48-56px | Use 56px for primary actions |
| Button padding | 14-16px vertical | Consistent feel |
| Input height | 48-56px | Match button heights |
| Card padding | 16-20px | 20px preferred for tool cards |
| Card border radius | 16-20px | 20px for large cards, 16px for small |
| Button border radius | 12px | Consistent across app |
| Input border radius | 12px | Match buttons |
| Icon button radius | 50% (circular) | For header buttons |
| Section gap | 24-32px | Between major sections |
| Item gap | 12-16px | Between list items |
| Grid gap | 12px | Between grid items |

#### Typography
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 28px | 800 (ExtraBold) | textPrimary |
| Hero title | 52px | 800 + italic | textPrimary |
| Section title | 18px | 600 (SemiBold) | textPrimary |
| Card title | 16px | 600 | textPrimary |
| Body text | 15px | 400 (Regular) | textSecondary |
| Labels | 14px | 600 | textSecondary |
| Meta/count | 13px | 400 | textTertiary |
| Small text | 12px | 400 | textTertiary |
| Button text | 16px | 700 (Bold) | #000 or #fff |

### 🧩 COMPONENT PATTERNS

#### Primary Button (Calculate/Submit)
```typescript
primaryButton: {
  backgroundColor: Colors.accentPrimary,  // Purple
  borderRadius: 12,
  paddingVertical: 16,
  alignItems: 'center',
  justifyContent: 'center',
},
primaryButtonText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#000',  // Dark text on purple
},
```

#### Secondary Button (Cancel/Reset)
```typescript
secondaryButton: {
  backgroundColor: Colors.bgCard,
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: Colors.borderPrimary,
},
secondaryButtonText: {
  fontSize: 15,
  fontWeight: '600',
  color: Colors.textSecondary,
},
```

#### Icon Button (Header actions)
```typescript
iconButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: Colors.bgCard,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: Colors.borderPrimary,
},
```

#### Input Field
```typescript
inputContainer: {
  marginBottom: 20,
},
inputLabel: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.textSecondary,
  marginBottom: 8,
},
input: {
  backgroundColor: Colors.bgCard,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 16,
  color: '#fff',
  borderWidth: 1,
  borderColor: Colors.borderPrimary,
},
inputFocused: {
  borderColor: Colors.accentPrimary,  // Purple border when focused
},
```

#### Result Card (Success state)
```typescript
resultCard: {
  backgroundColor: Colors.bgCard,
  borderRadius: 16,
  padding: 20,
  marginTop: 24,
  borderWidth: 2,
  borderColor: Colors.accentPrimary,  // Purple accent border
},
resultTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.accentPrimary,
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: 1,
},
resultValue: {
  fontSize: 32,
  fontWeight: '800',
  color: '#fff',
  textAlign: 'center',
},
resultSubtext: {
  fontSize: 14,
  color: Colors.textSecondary,
  textAlign: 'center',
  marginTop: 8,
},
```

#### Error State
```typescript
errorCard: {
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: 12,
  padding: 16,
  borderWidth: 1,
  borderColor: Colors.error,
},
errorText: {
  fontSize: 14,
  color: Colors.error,
},
```

#### Loading State
```typescript
loadingContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 40,
},
// Use ActivityIndicator with color={Colors.accentPrimary}
```

#### Tool Card (Grid item)
```typescript
toolCard: {
  width: (screenWidth - 52) / 2,  // 2 columns with gap
  backgroundColor: Colors.bgCard,
  borderRadius: 20,
  padding: 20,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: Colors.borderPrimary,
},
toolIconContainer: {
  width: 64,
  height: 64,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 14,
  backgroundColor: 'rgba(168, 85, 247, 0.15)',  // Accent glow
},
toolName: {
  fontSize: 15,
  fontWeight: '600',
  color: Colors.textPrimary,
  textAlign: 'center',
  marginBottom: 4,
},
toolCount: {
  fontSize: 13,
  color: Colors.textTertiary,
},
```

#### Category Pill (Horizontal scroll filter)
```typescript
categoryPill: {
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 24,
  backgroundColor: '#1a1a28',
  borderWidth: 1,
  borderColor: '#2a2a3a',
  marginRight: 10,
  height: 42,
  justifyContent: 'center',
},
categoryPillActive: {
  backgroundColor: 'rgba(168, 85, 247, 0.2)',
  borderColor: '#a855f7',
},
categoryPillText: {
  fontSize: 14,
  color: '#e0e0e0',
  fontWeight: '600',
},
```

### 🎭 STATE VARIATIONS

#### Button States
| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | `accentPrimary` | none | `#000` |
| Pressed | `accentPrimaryHover` | none | `#000` |
| Disabled | `#2a2a2a` | none | `#666` |
| Loading | `accentPrimary` + spinner | none | transparent |

#### Input States
| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | `bgCard` | `borderPrimary` | `#fff` |
| Focused | `bgCard` | `accentPrimary` | `#fff` |
| Error | `bgCard` | `error` | `#fff` |
| Disabled | `bgElevated` | `borderPrimary` | `textMuted` |

### 🔤 ICON USAGE

Import icons from `lucide-react-native`:
```typescript
import { 
  Calculator,    // Default tool icon
  Sparkles,      // AI tools
  Heart,         // Health, Favorites
  DollarSign,    // Finance
  ArrowLeftRight, // Converters
  Gamepad2,      // Fun
  Home,          // Real Estate
  Leaf,          // Sustainability
  Cpu,           // Tech
  Type,          // Text
  TrendingUp,    // Analytics, Growth
  Star,          // Featured, Rating
  ArrowLeft,     // Back button
  X,             // Close button
  Share2,        // Share action
  ExternalLink,  // Open in browser
  Search,        // Search input
  Check,         // Success, Done
  AlertCircle,   // Warning, Error
} from 'lucide-react-native';
```

#### Icon Sizing Guide
| Context | Size | Example |
|---------|------|---------|
| Tab bar | 24px | Navigation icons |
| Header buttons | 24px | Back, Close, Share |
| Card icons | 20-24px | Tool cards |
| Large feature icons | 32-48px | Empty states, hero |
| Inline with text | 16-18px | List items |
| Badges/tags | 10-12px | AI badge, count |

### ✨ ANIMATION GUIDELINES

```typescript
// Standard spring animation for modals/sheets
Animated.spring(animValue, {
  toValue: 1,
  useNativeDriver: true,
  tension: 65,
  friction: 11,
}).start();

// Quick fade for loading states
Animated.timing(opacity, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true,
}).start();

// Button press feedback
<TouchableOpacity activeOpacity={0.7}>  // Standard
<TouchableOpacity activeOpacity={0.8}>  // Subtle
```

**⚠️ Always use `useNativeDriver: true` for performance**

### 📐 SAFE AREA HANDLING (MANDATORY for Notch/Punch-hole)

**Always use `useSafeAreaInsets` from `react-native-safe-area-context`:**

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { 
      paddingTop: insets.top,      // Avoids notch/camera
      paddingBottom: insets.bottom // Avoids home indicator
    }]}>
      {/* Content */}
    </View>
  );
}
```

**❌ NEVER use plain `SafeAreaView` for screens with custom headers**
**✅ ALWAYS use dynamic `paddingTop: insets.top` for proper notch handling**

### 🔄 CATEGORY ID TO NAME MAPPING

When filtering tools by category, the ID differs from the name:

| Category ID | Category Name (in tools) |
|-------------|--------------------------|
| `'finance'` | `'Finance'` |
| `'health'` | `'Health'` |
| `'math'` | `'Math'` |
| `'converter'` | `'Converter'` |
| `'ai'` | `'AI'` ⚠️ (not 'AI Tools') |
| `'fun'` | `'Fun'` |
| `'other'` | `'Other'` |
| `'real-estate'` | `'Real Estate'` |
| `'sustainability'` | `'Sustainability'` |
| `'tech'` | `'Tech'` |
| `'text'` | `'Text'` |

### 🤖 AI ASSISTANT INTEGRATION

To add a tool to AI suggestions, update `mobile/services/groqAI.ts`:

1. Add to `TOOL_DATABASE` for tool card display:
```typescript
export const TOOL_DATABASE = {
  '/my-tool-calculator': { 
    name: 'My Tool Calculator', 
    description: 'Calculate something useful', 
    path: '/my-tool-calculator' 
  },
};
```

2. Optionally add to `AI_ASSISTANT_PROMPT` popular tools list

### 🔨 BUILD & TEST COMMANDS

```bash
# Navigate to mobile folder
cd mobile

# Install dependencies
npm install

# Start development server (hot reload)
npx expo start

# Build and run on Android device
npx expo run:android

# Build APK for distribution
eas build --platform android --profile preview

# Clear cache if issues
npx expo start --clear
```

### ✅ MOBILE TOOL CHECKLIST

Before adding a new tool:

- [ ] Added to `mobile/constants/Tools.ts` with correct category
- [ ] Category name matches exactly (case-sensitive)
- [ ] ID is unique and kebab-case
- [ ] Path matches website path
- [ ] If native: created file in `mobile/app/tools/`
- [ ] If native: added to `NATIVE_TOOLS` map
- [ ] Uses `useSafeAreaInsets` for notch handling
- [ ] Touch targets ≥ 44px
- [ ] Input fields have proper keyboard types
- [ ] Has loading states for async operations
- [ ] Tested on device (not just simulator)
- [ ] Hot reload verified (JS changes work without rebuild)

### 🔨 ANDROID BUILD COMMANDS

**⚠️ IMPORTANT:** The project path contains spaces (`New Apps`), which causes Gradle issues. Always set `GRADLE_USER_HOME` before building.

#### Debug Build (for development)
```powershell
cd "c:\Users\rehan\New Apps\Plainly\mobile"
$env:GRADLE_USER_HOME = "C:\gradle_home"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
cd android
.\gradlew.bat assembleDebug
```
📍 **Output:** `android\app\build\outputs\apk\debug\app-debug.apk`

⚠️ Debug APK requires Metro bundler running (`npx expo start`) to work.

#### Release Build (standalone, recommended)
```powershell
cd "c:\Users\rehan\New Apps\Plainly\mobile"
$env:GRADLE_USER_HOME = "C:\gradle_home"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
cd android
.\gradlew.bat assembleRelease
```
📍 **Output:** `android\app\build\outputs\apk\release\app-release.apk`

✅ Release APK works standalone without any dev server.

#### Install APK on Connected Device
```powershell
# Check device is connected
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices

# Install release APK
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r ".\android\app\build\outputs\apk\release\app-release.apk"

# Launch app
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" shell am start -n com.plainly.toolhub/.MainActivity
```

#### Clean Build (if issues occur)
```powershell
cd "c:\Users\rehan\New Apps\Plainly\mobile"
$env:GRADLE_USER_HOME = "C:\gradle_home"
cd android
.\gradlew.bat clean
```

#### Regenerate Android Folder (nuclear option)
```powershell
cd "c:\Users\rehan\New Apps\Plainly\mobile"
Remove-Item -Recurse -Force .\android -ErrorAction SilentlyContinue
npx expo prebuild --platform android --clean
```

---

### ⚠️ CRITICAL: DEPLOYMENT SEPARATION (Website vs Mobile)

The Plainly project contains **two separate deployable apps** in one repository:

| Component | Location | Deployment Target | Build Command |
|-----------|----------|-------------------|---------------|
| **Website** | `src/` | Cloudflare Pages | `npm run build` (Vite) |
| **Mobile App** | `mobile/` | Local APK build | `gradlew assembleRelease` |

#### 🚨 Rules to Prevent Build Failures

**1. NEVER put hard-coded API keys in `mobile/` folder:**
```typescript
// ❌ WRONG - Will block GitHub push (secret scanning)
const API_KEY = 'gsk_xxxxxx';

// ✅ CORRECT - Use environment variable
const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
```

**2. NEVER make `mobile/` a git submodule:**
- `mobile/` must be a **regular directory** in the repo
- If `mobile` has its own `.git` folder, **DELETE IT**
- Cloudflare fails if `mobile/` is a submodule without `.gitmodules` URL

**3. The `mobile/.env` file is gitignored:**
- API keys stored in `mobile/.env` (not pushed to GitHub)
- Format: `EXPO_PUBLIC_GROQ_API_KEY=your_key_here`
- Copy from `mobile/.env.example` if missing

**4. Cloudflare ONLY builds the website:**
- Cloudflare runs `npm run build` which builds `src/` via Vite
- Cloudflare ignores `mobile/` folder (it's just code storage)
- Mobile app is built locally and installed via ADB

#### 🔧 If Cloudflare Build Fails

Common errors and fixes:

| Error | Cause | Fix |
|-------|-------|-----|
| `No url found for submodule 'mobile'` | `mobile/` was added as submodule | Delete `mobile/.git` folder, re-add as regular dir |
| `GH013: Repository rule violations` | API key in code | Replace with env variable |
| `fatal: remote origin already exists` | Corrupted `.git/config` | Reset `.git/config` with correct remote URL |

```powershell
# Fix submodule issue:
cd c:\Users\rehan\New Apps\Plainly
Remove-Item -Recurse -Force mobile\.git -ErrorAction SilentlyContinue
git rm --cached mobile
git add mobile
git commit -m "Fix: Add mobile as regular directory"
git push origin main
```

---

### 🎨 AI OUTPUT FORMATTING (MANDATORY FOR ALL AI TOOLS)

**⚠️ CRITICAL RULE:** All AI tools in the mobile app MUST format their output exactly like the website. No raw markdown symbols should ever be visible to users.

#### Problem: Raw Markdown
Without proper formatting, AI responses show ugly markdown:
```
**Subject: Meeting Tomorrow**
**Body:** Hi John, I wanted to...
```

#### Solution: Use AIOutputFormatter Component
Always use `AIOutputFormatter` component from `mobile/components/AIOutputFormatter.tsx`:

```tsx
import AIOutputFormatter from '@/components/AIOutputFormatter';

// ❌ WRONG - Shows raw markdown
<Text style={styles.resultText}>{result}</Text>

// ✅ CORRECT - Beautiful formatted output
<AIOutputFormatter text={result} />
```

#### What AIOutputFormatter Handles:
- **Subject lines:** Extracts and styles `**Subject:**` with purple accent box
- **Headers:** Renders h1-h4 with proper sizing and spacing
- **Bullets:** Shows dots with indentation
- **Numbered lists:** Shows badges with numbers
- **Bold/Italic:** Strips `**`, `__`, `*`, `_` and applies styles
- **Dividers:** Renders horizontal lines from `---`
- **Code:** Strips backticks and renders properly

#### Implementation Rule:
**Every native AI tool in `mobile/app/tools/` MUST:**
1. Import `AIOutputFormatter` from `@/components/AIOutputFormatter`
2. Use `<AIOutputFormatter text={result} />` instead of `<Text>{result}</Text>`
3. Test output matches website formatting quality

#### Implemented AI Tools Using AIOutputFormatter:
| Tool | File | Status |
|------|------|--------|
| AI Email Generator | `ai-email-generator.tsx` | ✅ |
| AI Text Summarizer | `ai-text-summarizer.tsx` | ✅ |
| AI Translator | `ai-translator.tsx` | ✅ |
| AI Paraphraser | `ai-paraphraser.tsx` | ✅ |
| AI Paragraph Generator | `ai-paragraph-generator.tsx` | ✅ |

**⚠️ All future AI tools MUST follow this pattern!**

---

## 📊 MOBILE NATIVE TOOL IMPLEMENTATION PROGRESS

**Summary:**
- ✅ **Native implementations:** 18 tools (work offline, fast performance)
- ⬜ **WebView only:** 231 tools (load website in WebView)
- 📱 **Total tools in registry:** 249 tools

**Priority:** High-use tools like calculators and converters should be native for better UX.

---

### 🟢 FINANCE TOOLS (52 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ✅ | `tip` | Tip Calculator | `tip-calculator.tsx` |
| ✅ | `compound-interest` | Compound Interest | `compound-interest-calculator.tsx` |
| ✅ | `loan` | Loan Calculator | `loan-calculator.tsx` |
| ✅ | `mortgage` | Mortgage Calculator | `mortgage-calculator.tsx` |
| ⬜ | `investment` | Investment Calculator | - |
| ⬜ | `salary` | Salary Calculator | - |
| ⬜ | `auto-loan` | Auto Loan Calculator | - |
| ⬜ | `interest` | Interest Calculator | - |
| ⬜ | `payment` | Payment Calculator | - |
| ⬜ | `retirement` | Retirement Calculator | - |
| ⬜ | `emi` | EMI Calculator | - |
| ⬜ | `sip` | SIP Calculator | - |
| ⬜ | `gst` | GST Calculator | - |
| ⬜ | `budget` | Budget Calculator | - |
| ⬜ | `roi` | ROI Calculator | - |
| ⬜ | `currency` | Currency Converter | - |
| ⬜ | `crypto` | Crypto Converter | - |
| ⬜ | `tax` | Tax Calculator | - |
| ⬜ | `amortization` | Amortization Calculator | - |
| ⬜ | `inflation` | Inflation Calculator | - |
| ⬜ | `net-worth` | Net Worth Calculator | - |
| ⬜ | `stock-profit` | Stock Profit Calculator | - |
| ⬜ | `dividend` | Dividend Calculator | - |
| ⬜ | `bond-yield` | Bond Yield Calculator | - |
| ⬜ | `debt-payoff` | Debt Payoff Calculator | - |
| ⬜ | `emergency-fund` | Emergency Fund Calculator | - |
| ⬜ | `savings-goal` | Savings Goal Calculator | - |
| ⬜ | `home-affordability` | Home Affordability Calculator | - |
| ⬜ | `rule-of-72` | Rule of 72 Calculator | - |
| ⬜ | `compound-growth` | Compound Growth Calculator | - |
| ⬜ | `fire` | FIRE Calculator | - |
| ⬜ | `coast-fire` | Coast FIRE Calculator | - |
| ⬜ | `lean-fire` | Lean FIRE Calculator | - |
| ⬜ | `fat-fire` | Fat FIRE Calculator | - |
| ⬜ | `crypto-portfolio` | Crypto Portfolio Calculator | - |
| ⬜ | `defi-yield` | DeFi Yield Calculator | - |
| ⬜ | `nft-profit` | NFT Profit Calculator | - |
| ⬜ | `staking-rewards` | Staking Rewards Calculator | - |
| ⬜ | `gas-fee` | Gas Fee Calculator | - |
| ⬜ | `dca` | Dollar Cost Averaging Calculator | - |
| ⬜ | `side-hustle` | Side Hustle Calculator | - |
| ⬜ | `freelance-rate` | Freelance Rate Calculator | - |
| ⬜ | `invoice` | Invoice Generator | - |
| ⬜ | `hourly-to-salary` | Hourly to Salary Converter | - |
| ⬜ | `take-home-pay` | Take Home Pay Calculator | - |
| ⬜ | `paycheck` | Paycheck Calculator | - |
| ⬜ | `overtime` | Overtime Calculator | - |
| ⬜ | `commission` | Commission Calculator | - |
| ⬜ | `subscription-cost` | Subscription Cost Calculator | - |
| ⬜ | `cost-per-use` | Cost Per Use Calculator | - |
| ⬜ | `rent-affordability` | Rent Affordability Calculator | - |
| ⬜ | `utility-bill-splitter` | Utility Bill Splitter | - |
| ⬜ | `wealth-tax` | Wealth Tax Calculator | - |
| ⬜ | `estate-tax` | Estate Tax Calculator | - |
| ⬜ | `gift-tax` | Gift Tax Calculator | - |

---

### 🟢 HEALTH TOOLS (26 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ✅ | `bmi` | BMI Calculator | `bmi-calculator.tsx` |
| ✅ | `calorie` | Calorie Calculator | `calorie-calculator.tsx` |
| ✅ | `water-intake` | Water Intake Calculator | `water-intake-calculator.tsx` |
| ⬜ | `bmr` | BMR Calculator | - |
| ⬜ | `body-fat` | Body Fat Calculator | - |
| ⬜ | `ideal-weight` | Ideal Weight | - |
| ⬜ | `pace` | Pace Calculator | - |
| ⬜ | `pregnancy` | Pregnancy Calculator | - |
| ⬜ | `conception` | Conception Calculator | - |
| ⬜ | `due-date` | Due Date Calculator | - |
| ⬜ | `macro` | Macro Calculator | - |
| ⬜ | `sleep` | Sleep Calculator | - |
| ⬜ | `tdee` | TDEE Calculator | - |
| ⬜ | `one-rep-max` | One Rep Max Calculator | - |
| ⬜ | `heart-rate` | Heart Rate Zone Calculator | - |
| ⬜ | `ovulation` | Ovulation Calculator | - |
| ⬜ | `period` | Period Calculator | - |
| ⬜ | `bac` | BAC Calculator | - |
| ⬜ | `weight-loss` | Weight Loss Calculator | - |
| ⬜ | `caffeine` | Caffeine Calculator | - |
| ⬜ | `calorie-burn` | Calorie Burn Calculator | - |
| ⬜ | `lean-body-mass` | Lean Body Mass Calculator | - |
| ⬜ | `sleep-cycle` | Sleep Cycle Calculator | - |
| ⬜ | `vo2-max` | VO2 Max Calculator | - |
| ⬜ | `running-calorie` | Running Calorie Calculator | - |
| ⬜ | `pregnancy-weight` | Pregnancy Weight Calculator | - |

---

### 🟢 MATH TOOLS (27 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ✅ | `percentage` | Percentage Calculator | `percentage-calculator.tsx` |
| ✅ | `random` | Random Number Generator | `random-generator.tsx` |
| ⬜ | `scientific` | Scientific Calculator | - |
| ⬜ | `fraction` | Fraction Calculator | - |
| ⬜ | `triangle` | Triangle Calculator | - |
| ⬜ | `std-dev` | Standard Deviation | - |
| ⬜ | `quadratic` | Quadratic Equation Solver | - |
| ⬜ | `prime` | Prime Number Checker | - |
| ⬜ | `lcm-gcd` | LCM & GCD Calculator | - |
| ⬜ | `binary` | Binary/Hex Converter | - |
| ⬜ | `logarithm` | Logarithm Calculator | - |
| ⬜ | `exponent` | Exponent Calculator | - |
| ⬜ | `permutation-combination` | Permutation & Combination | - |
| ⬜ | `matrix` | Matrix Calculator | - |
| ⬜ | `wave` | Wave Calculator | - |
| ⬜ | `vector` | Vector Calculator | - |
| ⬜ | `circle` | Circle Calculator | - |
| ⬜ | `factorial` | Factorial Calculator | - |
| ⬜ | `mean-median-mode` | Mean Median Mode Calculator | - |
| ⬜ | `probability` | Probability Calculator | - |
| ⬜ | `pythagorean` | Pythagorean Calculator | - |
| ⬜ | `quadratic-solver` | Quadratic Solver | - |
| ⬜ | `roman-numeral` | Roman Numeral Converter | - |
| ⬜ | `sphere` | Sphere Calculator | - |
| ⬜ | `trigonometry` | Trigonometry Calculator | - |
| ⬜ | `gcd-lcm` | GCD LCM Calculator | - |
| ⬜ | `permutation` | Permutation Calculator | - |

---

### 🟢 OTHER TOOLS (36 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ✅ | `age` | Age Calculator | `age-calculator.tsx` |
| ✅ | `gpa` | GPA Calculator | `gpa-calculator.tsx` |
| ✅ | `discount` | Discount Calculator | `discount-calculator.tsx` |
| ⬜ | `date` | Date Calculator | - |
| ⬜ | `cgpa` | CGPA Calculator | - |
| ⬜ | `time-calc` | Time Calculator | - |
| ⬜ | `hours` | Hours Calculator | - |
| ⬜ | `grade` | Grade Calculator | - |
| ⬜ | `subnet` | Subnet Calculator | - |
| ⬜ | `fuel-cost` | Fuel Cost Calculator | - |
| ⬜ | `electricity-bill` | Electricity Bill Calculator | - |
| ⬜ | `tip-split` | Tip Split Calculator | - |
| ⬜ | `world-clock` | World Clock | - |
| ⬜ | `countdown` | Countdown Timer | - |
| ⬜ | `stopwatch` | Stopwatch | - |
| ⬜ | `distance` | Distance Calculator | - |
| ⬜ | `countdown-calc` | Countdown Calculator | - |
| ⬜ | `life-stats` | Life Stats Calculator | - |
| ⬜ | `package-dimension` | Package Dimension Calculator | - |
| ⬜ | `split-time` | Split Time Calculator | - |
| ⬜ | `car-depreciation` | Car Depreciation Calculator | - |
| ⬜ | `mpg` | MPG Calculator | - |
| ⬜ | `reading-speed` | Reading Speed Calculator | - |
| ⬜ | `typing` | Typing Speed Calculator | - |
| ⬜ | `timezone` | Timezone Converter | - |
| ⬜ | `unix-timestamp` | Unix Timestamp Converter | - |
| ⬜ | `weighted-gpa` | Weighted GPA Calculator | - |
| ⬜ | `workdays` | Workdays Calculator | - |
| ⬜ | `pool-volume` | Pool Volume Calculator | - |
| ⬜ | `mulch` | Mulch Calculator | - |
| ⬜ | `rainwater-harvest` | Rainwater Harvest Calculator | - |
| ⬜ | `score-keeper` | Score Keeper | - |
| ⬜ | `bracket` | Bracket Generator | - |
| ⬜ | `magic-eight-ball` | Magic Eight Ball | - |
| ⬜ | `volume` | Volume Converter | - |
| ⬜ | `screen-time` | Screen Time Calculator | - |

---

### 🟢 CONVERTER TOOLS (16 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ✅ | `unit` | Unit Converter | `unit-converter.tsx` |
| ⬜ | `conversion` | Conversion Calculator | - |
| ⬜ | `cooking` | Cooking Converter | - |
| ⬜ | `temperature` | Temperature Converter | - |
| ⬜ | `length` | Length Converter | - |
| ⬜ | `time` | Time Converter | - |
| ⬜ | `pressure` | Pressure Converter | - |
| ⬜ | `angle` | Angle Converter | - |
| ⬜ | `recipe-scaler` | Recipe Scaler | - |
| ⬜ | `frequency` | Frequency Converter | - |
| ⬜ | `area` | Area Converter | - |
| ⬜ | `data` | Data Storage Converter | - |
| ⬜ | `energy` | Energy Converter | - |
| ⬜ | `speed` | Speed Converter | - |
| ⬜ | `weight` | Weight Converter | - |
| ⬜ | `shoe-size` | Shoe Size Converter | - |

---

### 🟢 FUN TOOLS (17 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ⬜ | `dice` | Dice Roller | - |
| ⬜ | `random-picker` | Random Picker | - |
| ⬜ | `coin` | Coin Flip | - |
| ⬜ | `love` | Love Calculator | - |
| ⬜ | `zodiac` | Zodiac Finder | - |
| ⬜ | `numerology` | Numerology Calculator | - |
| ⬜ | `magic8` | Magic 8-Ball | - |
| ⬜ | `baby-name` | Baby Name Generator | - |
| ⬜ | `pet-age` | Pet Age Calculator | - |
| ⬜ | `lottery-odds` | Lottery Odds Calculator | - |
| ⬜ | `spin-wheel` | Spin the Wheel | - |
| ⬜ | `secret-santa` | Secret Santa Generator | - |
| ⬜ | `dog-age` | Dog Age Calculator | - |
| ⬜ | `compatibility` | Compatibility Calculator | - |
| ⬜ | `reaction-time` | Reaction Time Game | - |
| ⬜ | `team-randomizer` | Team Randomizer | - |
| ⬜ | `would-you-rather` | Would You Rather | - |

---

### 🟢 TEXT TOOLS (11 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ⬜ | `word-count` | Word Counter | - |
| ⬜ | `lorem` | Lorem Ipsum Generator | - |
| ⬜ | `uuid` | UUID Generator | - |
| ⬜ | `color-picker` | Color Picker | - |
| ⬜ | `json` | JSON Formatter | - |
| ⬜ | `readability` | Readability Calculator | - |
| ⬜ | `slug` | Slug Generator | - |
| ⬜ | `text-scrambler` | Text Scrambler | - |
| ⬜ | `duplicate-remover` | Duplicate Remover | - |
| ⬜ | `text-reverser` | Text Reverser | - |
| ⬜ | `text-sorter` | Text Sorter | - |

---

### 🟢 TECH TOOLS (13 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ⬜ | `qr` | QR Code Generator | - |
| ⬜ | `hash` | Hash Generator | - |
| ⬜ | `ip-subnet` | IP Subnet Calculator | - |
| ⬜ | `json-formatter` | JSON Formatter Calculator | - |
| ⬜ | `hash-generator` | Hash Generator Calculator | - |
| ⬜ | `power` | Power Calculator | - |
| ⬜ | `base64` | Base64 Encoder | - |
| ⬜ | `color-converter` | Color Converter | - |
| ⬜ | `markdown` | Markdown Previewer | - |
| ⬜ | `number-base` | Number Base Converter | - |
| ⬜ | `password` | Password Generator | - |
| ⬜ | `regex` | Regex Tester | - |
| ⬜ | `url-encoder` | URL Encoder | - |

---

### 🟢 SUSTAINABILITY TOOLS (9 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ⬜ | `solar` | Solar Panel Calculator | - |
| ⬜ | `ev` | EV Savings Calculator | - |
| ⬜ | `carbon` | Carbon Footprint Calculator | - |
| ⬜ | `compost` | Compost Calculator | - |
| ⬜ | `solar-roi` | Solar ROI Calculator | - |
| ⬜ | `rainwater` | Rainwater Calculator | - |
| ⬜ | `plastic-footprint` | Plastic Footprint Calculator | - |
| ⬜ | `electricity-usage` | Electricity Usage Calculator | - |
| ⬜ | `tree-carbon` | Tree Carbon Calculator | - |

---

### 🟢 REAL ESTATE TOOLS (7 total)

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ⬜ | `flooring` | Flooring Calculator | - |
| ⬜ | `rental-yield` | Rental Yield Calculator | - |
| ⬜ | `paint` | Paint Calculator | - |
| ⬜ | `concrete` | Concrete Calculator | - |
| ⬜ | `fence` | Fence Calculator | - |
| ⬜ | `tile` | Tile Calculator | - |
| ⬜ | `wallpaper` | Wallpaper Calculator | - |

---

### 🟣 AI TOOLS (67 total) - 5 Native, 62 WebView

AI tools use the Groq API. Most popular AI tools now have native implementations.

| Status | Tool ID | Tool Name | Native File |
|--------|---------|-----------|-------------|
| ✅ | `ai-email` | AI Email Generator | `ai-email-generator.tsx` |
| ⬜ | `ai-cover-letter` | AI Cover Letter Generator |
| ⬜ | `ai-resume-summary` | AI Resume Summary Generator |
| ⬜ | `ai-product-description` | AI Product Description Generator |
| ⬜ | `ai-slogan` | AI Slogan Generator |
| ⬜ | `ai-tweet` | AI Tweet Generator |
| ⬜ | `ai-instagram` | AI Instagram Caption Generator |
| ⬜ | `ai-youtube-title` | AI YouTube Title Generator |
| ⬜ | `ai-blog` | AI Blog Post Generator |
| ⬜ | `ai-meta` | AI Meta Description Generator |
| ✅ | `ai-paraphraser` | AI Paraphraser | `ai-paraphraser.tsx` |
| ⬜ | `ai-linkedin` | AI LinkedIn Post Generator |
| ⬜ | `ai-grammar` | AI Grammar Checker |
| ⬜ | `ai-voice` | AI Voice Transformer |
| ⬜ | `ai-sentence-expander` | AI Sentence Expander |
| ⬜ | `ai-sentence-shortener` | AI Sentence Shortener |
| ⬜ | `ai-essay-outline` | AI Essay Outline Generator |
| ⬜ | `ai-meeting-notes` | AI Meeting Notes Generator |
| ⬜ | `ai-story-starter` | AI Story Starter Generator |
| ⬜ | `ai-plot` | AI Plot Generator |
| ⬜ | `ai-poem` | AI Poem Generator |
| ⬜ | `ai-song-lyrics` | AI Song Lyrics Generator |
| ⬜ | `ai-joke` | AI Joke Generator |
| ⬜ | `ai-quote` | AI Quote Generator |
| ⬜ | `ai-pickup-line` | AI Pickup Line Generator |
| ⬜ | `ai-band-name` | AI Band Name Generator |
| ⬜ | `ai-rap-name` | AI Rap Name Generator |
| ⬜ | `ai-username` | AI Username Generator |
| ⬜ | `ai-color-palette` | AI Color Palette Generator |
| ⬜ | `ai-meeting-agenda` | AI Meeting Agenda Generator |
| ✅ | `ai-paragraph` | AI Paragraph Generator | `ai-paragraph-generator.tsx` |
| ✅ | `ai-summarizer` | AI Text Summarizer | `ai-text-summarizer.tsx` |
| ⬜ | `ai-baby-name` | AI Baby Name Generator |
| ✅ | `ai-translator` | AI Translator | `ai-translator.tsx` |
| ⬜ | `ai-business-name` | AI Business Name Generator |
| ⬜ | `ai-hashtag` | AI Hashtag Generator |
| ⬜ | `ai-code` | AI Code Generator |
| ⬜ | `ai-debugger` | AI Code Debugger |
| ⬜ | `ai-explainer` | AI Code Explainer |
| ⬜ | `ai-code-converter` | AI Code Converter |
| ⬜ | `ai-sql` | AI SQL Generator |
| ⬜ | `ai-regex` | AI Regex Generator |
| ⬜ | `ai-git-commit` | AI Git Commit Generator |
| ⬜ | `ai-api-doc` | AI API Documentation Generator |
| ⬜ | `ai-unit-test` | AI Unit Test Generator |
| ⬜ | `ai-code-comment` | AI Code Comment Generator |
| ⬜ | `ai-code-review` | AI Code Review Assistant |
| ⬜ | `ai-variable-name` | AI Variable Name Generator |
| ⬜ | `ai-css` | AI CSS Generator |
| ⬜ | `ai-html` | AI HTML Generator |
| ⬜ | `ai-react` | AI React Component Generator |
| ⬜ | `ai-rest-api` | AI REST API Designer |
| ⬜ | `ai-database-schema` | AI Database Schema Generator |
| ⬜ | `ai-algorithm` | AI Algorithm Selector |
| ⬜ | `ai-tech-stack` | AI Tech Stack Recommender |
| ⬜ | `ai-function-name` | AI Function Name Generator |
| ⬜ | `ai-code-preview` | Code Preview & Download |
| ⬜ | `ai-code-runner` | Code Runner |
| ⬜ | `ai-seo-keyword` | AI SEO Keyword Research |
| ⬜ | `ai-ad-copy` | AI Ad Copy Generator |
| ⬜ | `ai-customer-persona` | AI Customer Persona Generator |
| ⬜ | `ai-meme` | AI Meme Generator |
| ⬜ | `ai-thumbnail` | AI Thumbnail Generator |
| ⬜ | `ai-image` | AI Image Generator |
| ⬜ | `ai-video` | AI Video Generator |
| ⬜ | `ai-face` | AI Face Generator |
| ⬜ | `ai-logo` | AI Logo Generator |
| ⬜ | `ai-cartoon-avatar` | AI Cartoon Avatar Generator |
| ⬜ | `ai-pattern` | AI Pattern Generator |
| ⬜ | `ai-album-cover` | AI Album Cover Generator |
| ⬜ | `ai-business-card` | AI Business Card Designer |
| ⬜ | `ai-instagram-story` | AI Instagram Story Template |
| ⬜ | `ai-infographic` | AI Infographic Generator |
| ⬜ | `ai-presentation` | AI Presentation Slide Generator |
| ⬜ | `ai-mockup` | AI Mockup Generator |
| ⬜ | `ai-icon` | AI Icon Generator |
| ⬜ | `ai-qr-art` | AI QR Art Generator |
| ⬜ | `ai-quiz` | AI Quiz Generator |
| ⬜ | `ai-flashcard` | AI Flashcard Generator |
| ⬜ | `ai-study-guide` | AI Study Guide Generator |
| ⬜ | `ai-lesson-plan` | AI Lesson Plan Generator |
| ⬜ | `ai-explanation` | AI Explanation Simplifier |
| ⬜ | `ai-practice-problem` | AI Practice Problem Generator |
| ⬜ | `ai-essay-grader` | AI Essay Grader |
| ⬜ | `ai-citation` | AI Citation Generator |
| ⬜ | `ai-research-question` | AI Research Question Generator |
| ⬜ | `ai-thesis` | AI Thesis Statement Generator |
| ⬜ | `ai-annotated-bib` | AI Annotated Bibliography |
| ⬜ | `ai-mind-map` | AI Mind Map Generator |
| ⬜ | `ai-mnemonic` | AI Mnemonic Device Generator |
| ⬜ | `ai-language-tutor` | AI Language Learning Tutor |
| ⬜ | `ai-analogy` | AI Analogy Generator |

---

### 📈 IMPLEMENTATION PRIORITY

**High Priority (Most Used - Implement Next):**
1. ⬜ `currency` - Currency Converter
2. ⬜ `scientific` - Scientific Calculator
3. ⬜ `bmr` - BMR Calculator
4. ⬜ `date` - Date Calculator
5. ⬜ `dice` - Dice Roller
6. ⬜ `coin` - Coin Flip
7. ⬜ `password` - Password Generator
8. ⬜ `qr` - QR Code Generator

**Medium Priority (Common Use):**
- ⬜ `temperature` - Temperature Converter
- ⬜ `length` - Length Converter
- ⬜ `weight` - Weight Converter
- ⬜ `cooking` - Cooking Converter
- ⬜ `stopwatch` - Stopwatch
- ⬜ `countdown` - Countdown Timer
- ⬜ `world-clock` - World Clock

**Low Priority (Specialized):**
- All AI tools (work well via WebView)
- Complex financial tools (better on web)
- Real estate calculators
