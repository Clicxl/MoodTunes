import { useState } from 'react';
import { motion } from 'motion/react';
import { MascotCharacter } from './MascotCharacter';
import { LanguageSelector } from './LanguageSelector';
import { Music2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

type Language = 'en' | 'hi' | 'kn';

interface LoginPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogin: (email: string, password: string) => void;
  onGoToRegister: () => void;
}

const translations = {
  en: {
    welcome: 'Welcome to MoodTunes',
    greeting: 'Hello there',
    subtitle: 'Your music companion for every emotion',
    emailPlaceholder: 'Email Address',
    passwordPlaceholder: 'Password',
    loginButton: 'Login',
    registerButton: 'Create Account',
    noAccount: "Don't have an account?",
    mascotMessage: "I'm here to help you discover music that fits your mood",
  },
  hi: {
    welcome: 'MoodTunes में आपका स्वागत है',
    greeting: 'नमस्ते',
    subtitle: 'हर भावना के लिए आपका संगीत साथी',
    emailPlaceholder: 'ईमेल पता',
    passwordPlaceholder: 'पासवर्ड',
    loginButton: 'लॉगिन',
    registerButton: 'खाता बनाएं',
    noAccount: 'खाता नहीं है?',
    mascotMessage: 'मैं आपके मूड के अनुसार संगीत खोजने में मदद करूंगा',
  },
  kn: {
    welcome: 'MoodTunes ಗೆ ಸ್ವಾಗತ',
    greeting: 'ನಮಸ್ಕಾರ',
    subtitle: 'ಪ್ರತಿ ಭಾವನೆಗೆ ನಿಮ್ಮ ಸಂಗೀತ ಸಹಚರ',
    emailPlaceholder: 'ಇಮೇಲ್ ವಿಳಾಸ',
    passwordPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್',
    loginButton: 'ಲಾಗಿನ್',
    registerButton: 'ಖಾತೆ ರಚಿಸಿ',
    noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
    mascotMessage: 'ನಿಮ್ಮ ಮನಸ್ಥಿತಿಗೆ ಸರಿಹೊಂದುವ ಸಂಗೀತವನ್ನು ಕಂಡುಹಿಡಿಯಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ',
  },
};

export function LoginPage({ language, onLanguageChange, onLogin, onGoToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Ambient background elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(135deg, ${
              ['rgba(99, 179, 237, 0.2)', 'rgba(129, 140, 248, 0.2)', 'rgba(94, 234, 212, 0.2)'][i % 3]
            }, transparent)`,
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Language selector at top */}
          <div className="flex justify-center mb-8">
            <LanguageSelector selected={language} onChange={onLanguageChange} />
          </div>

          {/* Main login card */}
          <div className="bg-white/35 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl border border-white/40 relative overflow-hidden">
            {/* Subtle gradient overlays */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-teal-300/20 to-blue-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Mascot */}
              <div className="flex justify-center mb-6">
                <MascotCharacter
                  emotion="happy"
                  size="xl"
                  showSpeechBubble
                  message={t.mascotMessage}
                />
              </div>

              {/* Welcome text */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-flex items-center gap-3 mb-3"
                >
                  <Music2 className="w-7 h-7 text-teal-600" />
                  <h1 className="text-3xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    {t.welcome}
                  </h1>
                </motion.div>
                <p className="text-xl text-slate-700 mb-2">{t.greeting}</p>
                <p className="text-slate-600">{t.subtitle}</p>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-12 pr-6 py-4 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/40 focus:border-teal-400 focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Password input */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-12 pr-12 py-4 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/40 focus:border-teal-400 focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t.loginButton}
                    <Music2 className="w-5 h-5" />
                  </span>
                </motion.button>
              </form>

              {/* Register link */}
              <div className="text-center mt-6">
                <p className="text-sm text-slate-600 mb-3">{t.noAccount}</p>
                <motion.button
                  onClick={onGoToRegister}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-white/60 backdrop-blur-sm text-teal-600 rounded-full hover:bg-white/80 transition-all border border-teal-200"
                >
                  {t.registerButton}
                </motion.button>
              </div>

              {/* Decorative elements */}
              <div className="flex justify-center gap-4 mt-6 text-xl opacity-40">
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  🎵
                </motion.span>
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>
                  🎶
                </motion.span>
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>
                  🎵
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}