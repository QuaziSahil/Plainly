# 📱 Plainly Mobile App - Master Plan

> **A Professional Calculator & AI Tools Mobile App**
> 
> Transforming 249+ web tools into a seamless, native mobile experience

---

## 📊 Executive Summary

| Aspect | Details |
|--------|---------|
| **App Name** | Plainly - The Tool Hub |
| **Tagline** | "Make the complex, plainly simple." |
| **Platform** | iOS & Android (React Native + Expo) |
| **Target Audience** | Students, Professionals, Developers, Finance enthusiasts |
| **Tool Count** | 249+ tools across 11 categories |
| **Monetization** | Freemium + Minimal Ads |

---

## 🎯 Core Vision

Transform Plainly from a web-first calculator suite into a **premium mobile app** that users reach for daily. The app should feel like a native iOS/Android experience while maintaining the elegant dark aesthetic and powerful functionality.

### Design Philosophy
```
MINIMAL • ELEGANT • FAST • ACCESSIBLE • DELIGHTFUL
```

---

## 🏗️ Technology Stack

### Recommended Stack (React Native + Expo)

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | React Native + Expo SDK 52+ | Reuse 80% of React code from web, single codebase for iOS/Android |
| **Navigation** | React Navigation 7.x | Industry standard, bottom tabs + stack navigation |
| **State Management** | Zustand + React Query | Lightweight, performant |
| **AI Integration** | Groq API + Pollinations AI | Already integrated in web |
| **Storage** | AsyncStorage + MMKV | Fast local storage for favorites/history |
| **Animations** | Reanimated 3 + Moti | 60fps native animations |
| **UI Components** | Custom Design System (matching web) | Brand consistency |
| **Icons** | Lucide React Native | Same icons as web |

### Why React Native?
1. **Code Reuse**: All calculation logic, AI prompts, and business logic from web can be reused
2. **Single Codebase**: One team maintains iOS + Android
3. **Expo**: Simplified builds, OTA updates, easy deployment
4. **Performance**: Near-native performance with proper optimization
5. **Hot Reload**: Fast development cycle

---

## 📐 App Architecture

```
plainly-mobile/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home
│   │   ├── explore.tsx           # All Tools
│   │   ├── favorites.tsx         # Favorites
│   │   └── profile.tsx           # Settings/Profile
│   ├── tool/
│   │   └── [category]/
│   │       └── [id].tsx          # Dynamic tool screen
│   └── _layout.tsx               # Root layout
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── AIOutput.tsx
│   ├── layout/
│   │   ├── ToolLayout.tsx        # Standard tool wrapper
│   │   ├── Header.tsx
│   │   └── TabBar.tsx
│   └── tools/                    # Tool-specific components
├── services/
│   ├── groqAI.ts                 # AI service (from web)
│   ├── pollinationsAI.ts         # Image generation
│   └── calculations.ts           # Shared calculation logic
├── stores/
│   ├── useStorage.ts             # Favorites, history
│   ├── useSettings.ts            # App settings
│   └── useTheme.ts               # Theme management
├── constants/
│   ├── tools.ts                  # Tool registry (from web)
│   ├── colors.ts                 # Design tokens
│   └── typography.ts             # Font scales
└── utils/
    ├── formatters.ts             # Number/date formatting
    └── validators.ts             # Input validation
```

---

## 🧭 Navigation Structure

### Bottom Tab Bar (5 Tabs)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [CONTENT AREA]                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  🏠       🔍       ⭐       ⏰       ⚙️                  │
│ Home    Explore  Favorites History  Settings           │
└─────────────────────────────────────────────────────────┘
```

### Navigation Flow

```
Home
├── Search Bar (global search)
├── Quick Access (recent + favorites)
├── Category Cards → Category Page → Tool Detail
├── Trending Tools → Tool Detail
└── AI Tools Section → Tool Detail

Explore
├── Search + Filter
├── Category Filter Chips
├── Tool List (virtualized)
└── Sort Options (A-Z, Popular, Recent)

Favorites
├── Empty State (if no favorites)
├── Favorited Tools Grid
└── Quick Actions (remove, share)

History
├── Recent Calculations
├── Stored Results
├── Clear History Option
└── Re-open with previous inputs

Settings
├── Theme (Dark/Light/Sepia/Rose)
├── Default Currency
├── Unit System (Metric/Imperial)
├── Decimal Precision
├── Notifications
├── About & Legal
└── Rate App
```

---

## 🎨 Design System

### Color Palette (Matching Web)

```css
/* AMOLED Dark Theme (Default) */
--bg-primary: #000000
--bg-secondary: #0a0908
--bg-card: #0f0e0c
--bg-elevated: #1a1814

/* Text Colors - Warm Cream/Sepia */
--text-primary: #e8dcc8
--text-secondary: #b8a992
--text-tertiary: #8a7c6a
--text-muted: #5c5248

/* Accent - Purple */
--accent-primary: #a78bfa
--accent-secondary: #8b7cf5
--accent-glow: rgba(167, 139, 250, 0.15)

/* Semantic */
--success: #86efac
--warning: #fcd34d
--error: #fca5a5
--info: #93c5fd
```

### Typography Scale

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| Hero | 32px | Bold | Page titles |
| H1 | 24px | Semibold | Section headers |
| H2 | 20px | Medium | Tool names |
| Body | 16px | Regular | Main content |
| Caption | 14px | Regular | Labels, hints |
| Micro | 12px | Regular | Timestamps |

### Spacing System

```
4px  → micro spacing (icon padding)
8px  → small spacing (inline elements)
12px → base spacing (list items)
16px → medium spacing (card padding)
24px → large spacing (sections)
32px → extra large (page margins)
```

### Component Specifications

#### Cards
```
- Border radius: 16px
- Background: #0f0e0c
- Border: 1px solid #1f1c18
- Shadow: subtle drop shadow
- Padding: 16px
- Touch feedback: subtle scale (0.98)
```

#### Buttons
```
Primary Button:
- Background: linear-gradient(135deg, #a78bfa, #8b7cf5)
- Border radius: 12px
- Height: 48px (touch target)
- Text: #000000, 16px semibold

Secondary Button:
- Background: transparent
- Border: 1px solid #a78bfa
- Height: 48px
- Text: #a78bfa
```

#### Inputs
```
- Background: #12110f
- Border: 1px solid #1f1c18
- Border radius: 12px
- Height: 52px
- Padding: 16px
- Font size: 16px (prevents iOS zoom)
- Focus state: border → #a78bfa
```

#### Result Display
```
- Background: #1a1814
- Border radius: 16px
- Padding: 20px
- Result value: 32px, mono font, #a78bfa
- Label: 14px, #8a7c6a
```

---

## 📱 Screen Designs

### 1. Home Screen

```
┌─────────────────────────────────────────┐
│ ← Plainly                    ⚙️  🔔     │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔍  Search 249+ tools...         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  QUICK ACCESS                    See All │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ 📊     │ │ 💰     │ │ 🧮     │      │
│  │ BMI    │ │ Tip    │ │ Loan   │      │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
│  CATEGORIES                             │
│  ┌─────────────────────────────────┐   │
│  │ 💵 Finance          63 tools → │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 🤖 AI Tools         67 tools → │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ❤️ Health           27 tools → │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 🔢 Math             28 tools → │   │
│  └─────────────────────────────────┘   │
│                                         │
│  NEW THIS WEEK                   See All │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ 🧠     │ │ 📝     │ │ 📚     │      │
│  │ Quiz   │ │ Essay  │ │ Study  │      │
│  │ Gen    │ │ Grader │ │ Guide  │      │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🔍      ⭐      ⏰      ⚙️     │
└─────────────────────────────────────────┘
```

### 2. Tool Screen (Calculator)

```
┌─────────────────────────────────────────┐
│ ←  BMI Calculator              ⭐  ⋮   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │        Your BMI                 │   │
│  │                                 │   │
│  │         24.5                    │   │
│  │                                 │   │
│  │    Normal Weight ✓             │   │
│  │    Range: 18.5 - 24.9          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Height                                 │
│  ┌─────────────────────────────────┐   │
│  │  175  cm                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Weight                                 │
│  ┌─────────────────────────────────┐   │
│  │  75   kg                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Unit System                            │
│  ┌────────────┐ ┌────────────┐         │
│  │  Metric ✓  │ │  Imperial  │         │
│  └────────────┘ └────────────┘         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Calculate               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📋 Copy Result  │  📤 Share    │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🔍      ⭐      ⏰      ⚙️     │
└─────────────────────────────────────────┘
```

### 3. AI Tool Screen

```
┌─────────────────────────────────────────┐
│ ←  AI Code Generator           ⭐  ⋮   │
├─────────────────────────────────────────┤
│                                         │
│  Describe what you want to build        │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │  Create a React component       │   │
│  │  that displays a list of        │   │
│  │  products with images and       │   │
│  │  prices...                      │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Language                               │
│  ┌─────────────────────────────────┐   │
│  │  JavaScript    ▼                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ✨  Generate Code              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ // ProductList.jsx              │   │
│  │ import React from 'react';      │   │
│  │                                 │   │
│  │ const ProductList = ({          │   │
│  │   products                      │   │
│  │ }) => {                         │   │
│  │   return (                      │   │
│  │     <div className="grid">      │   │
│  │       {products.map(p => (      │   │
│  │ ...                             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📋 Copy  │ 💾 Save │ 📤 Share  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  💡 Tip: If tool doesn't respond,      │
│     refresh and try again.             │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🔍      ⭐      ⏰      ⚙️     │
└─────────────────────────────────────────┘
```

### 4. Explore Screen

```
┌─────────────────────────────────────────┐
│  Explore                       Filter   │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔍  Search tools...              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │All │ │ AI │ │Fin │ │Hlth│ │Math│   │
│  └────┘ └────┘ └────┘ └────┘ └────┘   │
│                                         │
│  249 TOOLS                    Sort: A-Z │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📊 Age Calculator               │   │
│  │ Calculate exact age in years... │   │
│  │ Other                        → │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🤖 AI Ad Copy Generator         │   │
│  │ Create high-converting ads...   │   │
│  │ AI                           → │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💼 AI Algorithm Selector        │   │
│  │ Find the best algorithm...      │   │
│  │ AI                           → │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ... (virtualized list)                 │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🔍      ⭐      ⏰      ⚙️     │
└─────────────────────────────────────────┘
```

### 5. Settings Screen

```
┌─────────────────────────────────────────┐
│  Settings                               │
├─────────────────────────────────────────┤
│                                         │
│  APPEARANCE                             │
│  ┌─────────────────────────────────┐   │
│  │ Theme                           │   │
│  │ Dark AMOLED                  → │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PREFERENCES                            │
│  ┌─────────────────────────────────┐   │
│  │ Default Currency                │   │
│  │ USD ($)                      → │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Unit System                     │   │
│  │ Metric                       → │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Decimal Places                  │   │
│  │ 2                            → │   │
│  └─────────────────────────────────┘   │
│                                         │
│  DATA                                   │
│  ┌─────────────────────────────────┐   │
│  │ Clear History                   │   │
│  │                              → │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Export Data                     │   │
│  │                              → │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ABOUT                                  │
│  ┌─────────────────────────────────┐   │
│  │ Rate App ⭐                     │   │
│  │ Privacy Policy                  │   │
│  │ Terms of Service                │   │
│  │ Version 1.0.0                   │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🔍      ⭐      ⏰      ⚙️     │
└─────────────────────────────────────────┘
```

---

## ⚡ Feature Specifications

### 1. Global Search (Critical UX)

```typescript
// Fuzzy search across all 249 tools
interface SearchFeature {
  behavior: {
    instant: true,              // No button needed
    fuzzy: true,                // Typo tolerance
    debounce: 200,              // ms delay
    minChars: 2,                // Start searching
  },
  ranking: {
    nameMatch: 10,              // Exact name match weight
    descriptionMatch: 5,        // Description match weight
    categoryMatch: 3,           // Category match weight
    recentUsage: 2,             // Recently used boost
    favoriteBoost: 2,           // Favorite boost
  },
  display: {
    maxResults: 10,
    showCategory: true,
    showIcon: true,
    highlightMatch: true,
  }
}
```

### 2. Favorites System

```typescript
interface FavoritesFeature {
  storage: 'AsyncStorage',
  maxFavorites: 50,
  sync: false,                  // Local only (no account needed)
  features: {
    quickToggle: true,          // Star icon on each tool
    reorder: true,              // Drag to reorder
    folders: false,             // V2 feature
    export: true,               // Export favorites list
  }
}
```

### 3. History & Results Storage

```typescript
interface HistoryFeature {
  maxItems: 100,
  retention: '30 days',
  storage: 'MMKV',              // Fast key-value storage
  stored: {
    path: string,
    name: string,
    inputs: object,             // Restore inputs
    result: string,
    resultUnit: string,
    timestamp: number,
    type: 'calculator' | 'ai' | 'converter'
  },
  features: {
    restoreInputs: true,        // Re-open with same inputs
    copyResult: true,
    shareResult: true,
    deleteItem: true,
    clearAll: true,
  }
}
```

### 4. AI Integration

```typescript
interface AIFeature {
  service: 'Groq',
  fallbackChain: [
    'llama-3.1-8b-instant',     // 14.4K/day
    'allam-2-7b',               // 7K/day
    'moonshotai/kimi-k2',       // 1K/day
    'llama-3.3-70b-versatile',  // 1K/day
  ],
  totalCapacity: '26,400 requests/day',
  features: {
    streaming: false,           // Full response
    retry: 3,                   // Auto-retry on failure
    timeout: 30000,             // 30s timeout
    offlineQueue: true,         // Queue requests when offline
  },
  ui: {
    loadingState: 'skeleton',
    errorState: 'retry button',
    successState: 'formatted output',
    copyButton: true,
    shareButton: true,
  }
}
```

### 5. Offline Support

```typescript
interface OfflineFeature {
  calculators: 'full offline',  // All calculations work offline
  aiTools: 'queue requests',    // Queue for when online
  storage: {
    favorites: 'cached',
    history: 'cached',
    settings: 'cached',
  },
  indicator: 'subtle banner',   // Show offline status
}
```

### 6. Haptic Feedback

```typescript
interface HapticFeature {
  triggers: {
    buttonPress: 'light',
    favoriteToggle: 'medium',
    resultCalculated: 'success',
    error: 'error',
    copySuccess: 'light',
    scrollEnd: 'selection',
  },
  userControl: true,            // Can disable in settings
}
```

### 7. Keyboard Handling

```typescript
interface KeyboardFeature {
  numericInput: 'numeric-pad',  // Number-only keyboard
  textInput: 'default',
  emailInput: 'email-address',
  dismissOnScroll: true,
  dismissOnOutsideTap: true,
  avoidView: true,              // Push content up
}
```

---

## 📱 Mobile-Specific Optimizations

### Touch Targets
- Minimum: 44x44px (Apple HIG)
- Recommended: 48x48px
- Spacing between: 8px minimum

### Gestures
```
Swipe left on tool card  → Quick delete from history
Swipe right on tool card → Add/remove favorite
Long press on result     → Copy to clipboard
Pull to refresh          → Refresh AI results
Pinch to zoom           → Code preview zoom
```

### Performance Targets
```
Cold start:        < 2 seconds
Tool navigation:   < 300ms
Search results:    < 100ms
Calculation:       < 50ms
AI response:       < 5 seconds (with loading state)
Frame rate:        60fps minimum
Memory usage:      < 150MB baseline
```

### Accessibility (A11Y)
```
- VoiceOver / TalkBack support
- Dynamic Type support (iOS)
- Font scaling (Android)
- High contrast mode
- Reduce motion option
- Screen reader labels on all interactive elements
```

---

## 🛠️ Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
```
□ Set up Expo project with TypeScript
□ Configure navigation (React Navigation)
□ Implement design system (colors, typography, components)
□ Create base UI components (Button, Card, Input, etc.)
□ Set up state management (Zustand)
□ Implement storage layer (AsyncStorage + MMKV)
□ Port tool registry from web
```

### Phase 2: Core Screens (Week 3-4)
```
□ Home screen with categories
□ Explore screen with search
□ Tool detail layout (calculator type)
□ Tool detail layout (AI type)
□ Favorites screen
□ History screen
□ Settings screen
```

### Phase 3: Tool Migration (Week 5-8)
```
□ Port Finance calculators (63)
□ Port Health calculators (27)
□ Port Math calculators (28)
□ Port Converter tools (16)
□ Port AI tools (67)
□ Port Fun tools (17)
□ Port Other tools (40)
□ Port remaining categories
```

### Phase 4: AI Integration (Week 9-10)
```
□ Port groqAI service
□ Port pollinationsAI service
□ Implement AI loading states
□ Implement error handling
□ Add offline queue
□ Test all AI tools
```

### Phase 5: Polish & Optimization (Week 11-12)
```
□ Haptic feedback
□ Animations (Reanimated)
□ Performance optimization
□ Memory profiling
□ Accessibility audit
□ Crash tracking (Sentry)
```

### Phase 6: Launch Prep (Week 13-14)
```
□ App Store screenshots
□ App Store description
□ Privacy policy update
□ TestFlight beta
□ Google Play beta
□ Bug fixes from beta
□ Final submission
```

---

## 💰 Monetization Strategy

### Freemium Model
```
FREE TIER:
- All calculators (full access)
- AI tools (10 requests/day limit)
- Basic history (last 20)
- Ads (bottom banner, non-intrusive)

PREMIUM ($4.99/month or $29.99/year):
- Unlimited AI requests
- No ads
- Full history (unlimited)
- Cloud sync (future)
- Priority AI model access
- Export to PDF
- Widgets (iOS/Android)
```

### Ad Placement (Free Tier)
```
- Bottom banner on tool screens (non-sticky)
- Interstitial after 10 calculations (skippable after 3s)
- NO ads on AI generation screens (disrupts UX)
- NO ads in settings or favorites
```

---

## 📊 Success Metrics

### Launch Goals (Month 1)
```
Downloads:       10,000+
DAU:             1,000+
Rating:          4.5+ stars
Crash-free:      99.5%+
```

### Growth Goals (Month 3)
```
Downloads:       50,000+
DAU:             5,000+
Premium conv:    2%
Retention D7:    40%
Retention D30:   20%
```

---

## 🔐 Security & Privacy

### Data Handling
```
- All calculations: Local only
- AI requests: Encrypted in transit (HTTPS)
- No user accounts required for basic features
- Favorites/history: Local device storage
- No tracking without consent
- GDPR/CCPA compliant
```

### API Keys
```
- Groq API key: Secured in environment variables
- Pollinations API key: Secured in environment variables
- No keys in client bundle
- Rate limiting on backend proxy (future)
```

---

## 🚀 Future Features (V2+)

```
□ User accounts & cloud sync
□ Widgets (iOS/Android home screen)
□ Apple Watch companion
□ Siri Shortcuts integration
□ Voice input for calculations
□ Share results as images
□ Collaborative folders
□ AI chat interface
□ Custom tool builder
□ Multi-language support
```

---

## 📝 Notes for Development

### Code Reuse from Web
Files that can be directly ported:
- `src/data/calculators.js` → Tool registry
- `src/services/groqAI.js` → AI service (minor adaptations)
- All calculation logic from individual tools
- Validation functions
- Formatting utilities

### Key Differences from Web
```
Navigation:    React Router → React Navigation
Styling:       CSS → StyleSheet / styled-components
Storage:       localStorage → AsyncStorage / MMKV
Icons:         lucide-react → lucide-react-native
Animations:    CSS → Reanimated
```

---

**Document Version:** 1.0  
**Last Updated:** February 2, 2026  
**Author:** GitHub Copilot (Claude Opus 4.5)

---

> "Make the complex, plainly simple." - Plainly App Vision
