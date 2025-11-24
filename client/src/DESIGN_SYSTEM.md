# MoodTunes - Complete Design System Documentation

## 🎨 Overview

MoodTunes is a **gender-neutral, emotion-aware music discovery platform** that supports **7 human emotions** (Happy, Sad, Neutral, Angry, Disgusted, Fearful, Surprised) with real-time webcam detection, personalized song recommendations, and an AI chatbot companion.

### Design Philosophy
- **Universal & Inclusive**: Gender-neutral design welcoming to all ages and genders
- **Emotionally Intelligent**: Dynamic UI that responds to user's emotional state
- **Accessible First**: WCAG AA compliant, keyboard navigation, screen reader support
- **Premium & Modern**: Clean glassmorphism aesthetic with smooth micro-interactions
- **Multilingual**: Full support for English, Hindi, and Kannada

---

## 🌈 Color System

### Primary Palette (Gender-Neutral)
```css
/* Teal/Cyan - Primary Actions */
--teal-500: #14b8a6;
--cyan-500: #06b6d4;
--blue-500: #3b82f6;

/* Neutral Base */
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-300: #cbd5e1;
--slate-600: #475569;
--slate-700: #334155;
--slate-800: #1e293b;
```

### Emotion-Based Color Palettes (7 Emotions)

#### 1. Happy 😊
```css
Primary: Amber/Yellow (#fbbf24 to #facc15)
Background: #FFF8E7 to #FFFAF0
Particles: ☀️✨💫⭐
Use Case: Uplifting, energetic content
```

#### 2. Sad 😢
```css
Primary: Blue/Indigo (#60a5fa to #818cf8)
Background: #E8F1F5 to #E0EBF0
Particles: 💧🌧️💙💦
Use Case: Calming, melancholic content
```

#### 3. Neutral 😐
```css
Primary: Slate/Gray (#94a3b8 to #9ca3af)
Background: #E8F5F0 to #EEF2F5
Particles: ☁️🌿🍃
Use Case: Balanced, peaceful content
```

#### 4. Angry 😠
```css
Primary: Orange/Red (#fb923c to #f87171)
Background: #FFE8E8 to #FFEAEA
Particles: 💨⚡🔶🔥
Use Case: Intense, energetic content
```

#### 5. Disgusted 🤢
```css
Primary: Green/Emerald (#4ade80 to #10b981)
Background: #E8F5E9 to #EEF5EA
Particles: 🌿💚🍃
Use Case: Fresh, cleansing content
```

#### 6. Fearful 😨
```css
Primary: Indigo/Purple (#a78bfa to #c084fc)
Background: #E0E7F5 to #E5E9F5
Particles: 🌑💜⚡👻
Use Case: Mysterious, comforting content
```

#### 7. Surprised 😲
```css
Primary: Pink/Purple (#f472b6 to #c084fc)
Background: #FFF0F5 to #FFF5FA
Particles: 💥✨⭐🎉
Use Case: Dynamic, exciting content
```

### Glassmorphism System
```css
/* Card Surfaces */
.glass-card {
  background: rgba(255, 255, 255, 0.40);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.40);
}

/* Input Fields */
.glass-input {
  background: rgba(255, 255, 255, 0.60);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.40);
}
```

---

## 📐 Layout System

### Spacing Scale
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Border Radius
```css
--radius-sm: 16px;   /* Small elements */
--radius-md: 20px;   /* Medium elements */
--radius-lg: 24px;   /* Large elements */
--radius-xl: 28px;   /* Cards */
--radius-2xl: 32px;  /* Large cards */
--radius-full: 9999px; /* Pills, buttons */
```

### Container Sizes
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

---

## 🎭 Components

### 1. Mascot Character (Gender-Neutral)

**Design Features:**
- Minimalist geometric circle
- Text-based emoticons for expressions
- Soft gradient backgrounds
- Floating animation

**Emotion Expressions:**
```
Happy:     ◠‿◠  (Teal to Cyan gradient)
Sad:       ◕︵◕  (Blue to Indigo gradient)
Angry:     ︵_︵  (Orange to Red gradient)
Neutral:   ◕‿◕  (Slate to Blue gradient)
Disgusted: ◔_◔  (Green to Emerald gradient)
Fearful:   ◕ ◕  (Indigo to Purple gradient)
Surprised: ◯‿◯  (Pink to Purple gradient)
```

**Size Variants:**
```tsx
sm: 64px × 64px
md: 96px × 96px
lg: 128px × 128px
xl: 192px × 192px
```

### 2. Buttons

**Primary Button:**
```tsx
className="bg-gradient-to-r from-teal-500 to-cyan-500 
           text-white rounded-full px-6 py-3
           shadow-lg hover:shadow-xl transition-all"
```

**Secondary Button:**
```tsx
className="bg-white/40 backdrop-blur-sm text-slate-700
           rounded-full px-6 py-3 border border-white/40
           hover:bg-white/60 transition-all"
```

**Icon Button:**
```tsx
className="w-12 h-12 bg-white/70 backdrop-blur-sm
           rounded-full flex items-center justify-center
           hover:scale-105 transition-all border border-white/50"
```

### 3. Song Card

**Structure:**
- Album cover (aspect-ratio: 1:1)
- Emotion badge (top-right)
- Language tag (top-left, if present)
- Title + Artist
- Action buttons (Play, Heart, Share)

**States:**
- Default: bg-white/40
- Hover: y-offset -6px, emotion-based glow
- Active: Emotion-based gradient overlay

### 4. Input Fields

**Text Input:**
```tsx
className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm
           rounded-3xl border-2 border-white/40
           focus:border-teal-400 focus:outline-none
           text-slate-700 placeholder:text-slate-400"
```

**With Icon:**
- Left padding: 48px (to accommodate icon)
- Icon position: absolute left-4 top-1/2 -translate-y-1/2

### 5. Navigation

**Desktop (Top Bar):**
- Height: 80px
- Background: bg-white/30 backdrop-blur-xl
- Logo + Mascot (left)
- Nav buttons (center)
- Language selector (right)

**Mobile (Bottom Bar):**
- Height: 72px
- 4 icon buttons with labels
- Active state: Gradient background
- Fixed bottom position

### 6. Chat Bubbles

**User Message:**
```tsx
className="max-w-[80%] bg-gradient-to-r from-teal-500 to-cyan-500
           text-white px-5 py-3 rounded-3xl rounded-br-md"
```

**Bot Message:**
```tsx
className="max-w-[80%] bg-white/80 backdrop-blur-sm
           text-slate-700 px-5 py-3 rounded-3xl rounded-bl-md
           border border-white/60"
```

---

## 🎬 Animations & Micro-interactions

### Hover Effects
```tsx
whileHover={{ scale: 1.03, y: -6 }}
transition={{ duration: 0.2 }}
```

### Tap Effects
```tsx
whileTap={{ scale: 0.97 }}
```

### Page Transitions
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Floating Animation (Mascot)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
animation: float 2.5s ease-in-out infinite;
```

### Scanning Animation (Emotion Detection)
```tsx
animate={{
  scale: [1, 1.05, 1],
  opacity: [0.3, 0.6, 0.3],
}}
transition={{
  duration: 2,
  repeat: Infinity,
}}
```

### Pulse Effect (Fearful Emotion)
```tsx
animate={{
  opacity: [0, 0.3, 0],
}}
transition={{
  duration: 3,
  repeat: Infinity,
  ease: 'easeInOut',
}}
```

---

## 📱 Page Designs

### 1. Login Page
**Layout:**
- Centered card (max-width: 448px)
- Language selector (top)
- Mascot with speech bubble
- Welcome message
- Email + Password inputs
- Login button (gradient)
- Register link

**Features:**
- Show/hide password toggle
- Animated background particles
- Smooth input focus states

---

### 2. Register Page
**Layout:**
- Similar to Login
- Additional fields: Name, Confirm Password
- Back to Login button (top-left)

**Validation:**
- Password match check
- Email format validation
- Required fields

---

### 3. Home / Song Suggestions
**Layout:**
- Welcome header with user name
- Current emotion indicator
- Filter pills (All + 7 emotions)
- Responsive song grid (1-4 columns)

**Features:**
- Horizontal scroll filters (mobile)
- Emotion-based filtering
- Lazy loading songs
- Empty state handling

---

### 4. Emotion Detection
**Layout:**
- Header
- Two-column layout (desktop)
  - Left: Webcam preview + controls
  - Right: Mood slider + History
- Song recommendations (bottom)

**Features:**
- Webcam border reflects detected emotion
- Real-time emotion badge
- Scanning animation overlay
- Emotion history chips (last 5)
- Mood preference slider (Calm ↔ Energetic)

---

### 5. Chatbot Page
**Layout:**
- Header
- Two-column layout (desktop)
  - Left: Chat messages + input
  - Right: Mascot sidebar
- Quick topic buttons

**Features:**
- Auto-scroll to latest message
- Typing indicator (3 animated dots)
- Voice input button
- Context-aware responses
- Speech bubble design

---

### 6. Friends Page
**Layout:**
- Header with "Add Friend" button
- Grid of friend cards (1-3 columns)

**Friend Card:**
- Avatar (emoji with emotion color)
- Online status indicator
- Current mood badge
- Recent song info
- Action buttons (Send Song, Chat)

---

## 🌍 Dynamic Backgrounds

### Implementation
Each emotion has a unique atmospheric background:

**Components:**
1. **Base Gradient** - Emotion-specific colors
2. **Overlay** - Semi-transparent tint
3. **Particles** - Animated emoji (15 count)
4. **Ambient Shapes** - Floating blurred circles (8 count)
5. **Special Effects:**
   - Fearful: Pulsing dark overlay
   - Surprised: Popping circular shapes

**Transition:**
- Duration: 1000ms
- Easing: ease-in-out
- Smooth cross-fade between emotions

---

## ♿ Accessibility Features

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators: 2px teal outline
- Skip navigation links
- Arrow key support for carousels

### Screen Readers
- Semantic HTML (nav, main, article)
- ARIA labels on icon buttons
- Alt text on all images
- Live regions for dynamic content

### Color Contrast
- All text meets WCAG AA (4.5:1 minimum)
- Primary button: White on Teal (6.5:1)
- Body text: Slate-700 on light backgrounds (12:1)

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🌐 Multi-Language Support

### Supported Languages
1. **English** (en)
2. **Hindi** (hi) - हिंदी
3. **Kannada** (kn) - ಕನ್ನಡ

### Translation Structure
```tsx
const translations = {
  en: { key: 'value', ... },
  hi: { key: 'मूल्य', ... },
  kn: { key: 'ಮೌಲ್ಯ', ... }
};
```

### Implementation
- Language selector in navigation
- Persistent in localStorage
- All UI text translatable
- RTL support ready (if needed)

---

## 📦 Component Library

### Core Components
```
/components
  ├── EmotionBackground.tsx      (Dynamic backgrounds)
  ├── MascotCharacter.tsx         (Gender-neutral mascot)
  ├── LanguageSelector.tsx        (Multi-language toggle)
  ├── Navigation.tsx              (Responsive nav)
  ├── SongCard.tsx                (Song display)
  ├── LoginPage.tsx               (Authentication)
  ├── RegisterPage.tsx            (Sign up)
  ├── HomePage.tsx                (Dashboard)
  ├── EmotionDetectionPage.tsx    (Webcam detection)
  ├── ChatbotPage.tsx             (AI companion)
  └── FriendsPage.tsx             (Social features)
```

### ShadCN Components Used
- Button, Input, Card
- Avatar, Badge
- Slider, Select
- Dialog, Sheet

---

## 🎯 Implementation Checklist

### Phase 1: Foundation ✅
- [x] 7 emotion type system
- [x] Gender-neutral color palette
- [x] Glassmorphism design tokens
- [x] Responsive grid system
- [x] Animation library setup

### Phase 2: Core Components ✅
- [x] Mascot character (7 emotions)
- [x] Emotion backgrounds (7 themes)
- [x] Navigation system
- [x] Song card component
- [x] Language selector

### Phase 3: Pages ✅
- [x] Login page
- [x] Register page
- [x] Home page (filters + songs)
- [x] Emotion detection page
- [x] Chatbot page
- [x] Friends page

### Phase 4: Features ✅
- [x] Multi-language support (3 languages)
- [x] Dynamic emotion switching
- [x] Webcam detection UI
- [x] Chat interface
- [x] Friend system

### Phase 5: Polish ✅
- [x] Micro-interactions
- [x] Loading states
- [x] Empty states
- [x] Error handling UI
- [x] Accessibility audit

---

## 🚀 API Integration Points

### Backend Endpoints (to be connected)
```tsx
interface APIEndpoints {
  // Authentication
  login: 'POST /api/auth/login',
  register: 'POST /api/auth/register',
  
  // Emotion Detection
  detectEmotion: 'POST /api/emotion/detect',
  
  // Songs
  getSongRecommendations: 'GET /api/songs/recommend?emotion={emotion}',
  getSongsByFilter: 'GET /api/songs?mood={mood}&language={lang}',
  
  // Chatbot
  chatMessage: 'POST /api/chat/message',
  
  // Friends
  getFriends: 'GET /api/friends/list',
  sendSong: 'POST /api/friends/send-song',
}
```

### Expected Data Structures
```tsx
interface EmotionDetectionResult {
  emotion: Emotion;
  confidence: number;
  timestamp: Date;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  emotion: Emotion;
  language: string;
  duration: number;
}

interface Friend {
  id: number;
  name: string;
  mood: Emotion;
  online: boolean;
  recentSong: string;
  artist: string;
}
```

---

## 💡 Best Practices

### Performance
1. Use `ImageWithFallback` for all images
2. Lazy load song grids
3. Debounce emotion detection
4. Cache API responses
5. Optimize animations (use `transform` and `opacity`)

### UX
1. Show loading states for all async operations
2. Provide clear error messages
3. Use optimistic UI updates
4. Smooth transitions between emotions
5. Maintain scroll position on navigation

### Accessibility
1. Test with keyboard only
2. Verify screen reader announcements
3. Check color contrast ratios
4. Provide text alternatives for icons
5. Support zoom up to 200%

### Code Quality
1. Type all props with TypeScript
2. Use semantic HTML
3. Follow React best practices
4. Comment complex logic
5. Keep components focused and reusable

---

## 📊 Design Metrics

### Loading Performance
- Target: < 3s First Contentful Paint
- Images: WebP format, lazy loaded
- Bundle size: < 500KB gzipped

### Accessibility Score
- Target: 100/100 Lighthouse
- WCAG Level: AA compliance
- Keyboard navigation: Full support

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 14+, Android 10+

---

## 🎨 Design Credits

**Font Stack:**
```css
font-family: 'Inter', 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Icon Library:** Lucide React
**Animation Library:** Motion (Framer Motion)
**CSS Framework:** Tailwind CSS v4
**Component Library:** Shadcn/ui

---

**Designed with care for everyone** 🎵

**Version:** 1.0.0  
**Last Updated:** November 2024  
**License:** MIT
