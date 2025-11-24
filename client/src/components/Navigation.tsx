import { motion } from 'motion/react';
import { Home, Camera, MessageCircle, Users, Music2 } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { MascotCharacter } from './MascotCharacter';

type Page = 'home' | 'emotion' | 'chatbot' | 'friends';
type Language = 'en' | 'hi' | 'kn';
type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentEmotion: Emotion;
}

const translations = {
  en: {
    home: 'Home',
    emotion: 'Detect',
    chatbot: 'Chat',
    friends: 'Friends',
  },
  hi: {
    home: 'होम',
    emotion: 'पता लगाएं',
    chatbot: 'चैट',
    friends: 'मित्र',
  },
  kn: {
    home: 'ಮನೆ',
    emotion: 'ಪತ್ತೆ',
    chatbot: 'ಚಾಟ್',
    friends: 'ಸ್ನೇಹಿತರು',
  },
};

export function Navigation({
  currentPage,
  onPageChange,
  language,
  onLanguageChange,
  currentEmotion,
}: NavigationProps) {
  const t = translations[language];

  const navItems = [
    { id: 'home' as Page, label: t.home, icon: Home },
    { id: 'emotion' as Page, label: t.emotion, icon: Camera },
    { id: 'chatbot' as Page, label: t.chatbot, icon: MessageCircle },
    { id: 'friends' as Page, label: t.friends, icon: Users },
  ];

  return (
    <>
      {/* Top bar for desktop */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/30 backdrop-blur-xl border-b border-white/30 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and mascot */}
              <div className="flex items-center gap-4">
                <MascotCharacter emotion={currentEmotion} size="sm" />
                <div>
                  <h1 className="flex items-center gap-2 text-2xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    <Music2 className="w-6 h-6 text-teal-600" />
                    MoodTunes
                  </h1>
                  <p className="text-xs text-slate-600">Discover music for every mood</p>
                </div>
              </div>

              {/* Navigation items */}
              <div className="flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                          : 'bg-white/40 text-slate-700 hover:bg-white/60'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Language selector */}
              <LanguageSelector selected={language} onChange={onLanguageChange} />
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/40 backdrop-blur-xl border-t border-white/30 shadow-lg">
          <div className="flex items-center justify-around px-4 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md'
                      : 'text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile language selector */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <LanguageSelector selected={language} onChange={onLanguageChange} />
      </div>
    </>
  );
}