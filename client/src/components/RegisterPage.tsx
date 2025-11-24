import { useState } from 'react';
import { motion } from 'motion/react';
import { MascotCharacter } from './MascotCharacter';
import { LanguageSelector } from './LanguageSelector';
import { Music2, User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

type Language = 'en' | 'hi' | 'kn';

interface RegisterPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onBackToLogin: () => void;
}

const translations = {
  en: {
    title: 'Create Account',
    subtitle: 'Join MoodTunes today',
    namePlaceholder: 'Full Name',
    emailPlaceholder: 'Email Address',
    passwordPlaceholder: 'Password',
    confirmPasswordPlaceholder: 'Confirm Password',
    registerButton: 'Create Account',
    backToLogin: 'Back to Login',
    alreadyHaveAccount: 'Already have an account?',
    mascotMessage: "Let's get you started on your musical journey!",
  },
  hi: {
    title: 'खाता बनाएं',
    subtitle: 'आज ही MoodTunes में शामिल हों',
    namePlaceholder: 'पूरा नाम',
    emailPlaceholder: 'ईमेल पता',
    passwordPlaceholder: 'पासवर्ड',
    confirmPasswordPlaceholder: 'पासवर्ड की पुष्टि करें',
    registerButton: 'खाता बनाएं',
    backToLogin: 'लॉगिन पर वापस जाएं',
    alreadyHaveAccount: 'पहले से खाता है?',
    mascotMessage: 'आइए आपकी संगीत यात्रा शुरू करें!',
  },
  kn: {
    title: 'ಖಾತೆ ರಚಿಸಿ',
    subtitle: 'ಇಂದು MoodTunes ಗೆ ಸೇರಿ',
    namePlaceholder: 'ಪೂರ್ಣ ಹೆಸರು',
    emailPlaceholder: 'ಇಮೇಲ್ ವಿಳಾಸ',
    passwordPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್',
    confirmPasswordPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    registerButton: 'ಖಾತೆ ರಚಿಸಿ',
    backToLogin: 'ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    mascotMessage: 'ನಿಮ್ಮ ಸಂಗೀತ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸೋಣ!',
  },
};

export function RegisterPage({ language, onLanguageChange, onRegister, onBackToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && password && password === confirmPassword) {
      onRegister(name, email, password);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Ambient background elements */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * 250 + 100,
            height: Math.random() * 250 + 100,
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
          <div className="flex justify-center mb-6">
            <LanguageSelector selected={language} onChange={onLanguageChange} />
          </div>

          {/* Main register card */}
          <div className="bg-white/35 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl border border-white/40 relative overflow-hidden">
            {/* Subtle gradient overlays */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-teal-300/20 to-blue-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Back button */}
              <motion.button
                onClick={onBackToLogin}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">{t.backToLogin}</span>
              </motion.button>

              {/* Mascot */}
              <div className="flex justify-center mb-4">
                <MascotCharacter
                  emotion="happy"
                  size="lg"
                  showSpeechBubble
                  message={t.mascotMessage}
                />
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-flex items-center gap-3 mb-2"
                >
                  <Music2 className="w-6 h-6 text-teal-600" />
                  <h1 className="text-2xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    {t.title}
                  </h1>
                </motion.div>
                <p className="text-slate-600 text-sm">{t.subtitle}</p>
              </div>

              {/* Register form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full pl-12 pr-6 py-3.5 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/40 focus:border-teal-400 focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* Email input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-12 pr-6 py-3.5 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/40 focus:border-teal-400 focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                    required
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
                    className="w-full pl-12 pr-12 py-3.5 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/40 focus:border-teal-400 focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Confirm Password input */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.confirmPasswordPlaceholder}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/40 focus:border-teal-400 focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden mt-6"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t.registerButton}
                    <Music2 className="w-5 h-5" />
                  </span>
                </motion.button>
              </form>

              {/* Decorative elements */}
              <div className="flex justify-center gap-4 mt-6 text-lg opacity-40">
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
