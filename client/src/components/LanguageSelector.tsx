import { motion } from 'motion/react';

type Language = 'en' | 'hi' | 'kn';

interface LanguageSelectorProps {
  selected: Language;
  onChange: (lang: Language) => void;
}

export function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  const languages = [
    { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
    { code: 'hi' as Language, label: 'हिंदी', flag: '🇮🇳' },
    { code: 'kn' as Language, label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ];

  return (
    <div className="flex gap-2 bg-white/25 backdrop-blur-lg rounded-full p-1.5 shadow-lg border border-white/30">
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
            selected === lang.code
              ? 'bg-white text-slate-700 shadow-md'
              : 'text-slate-600 hover:bg-white/30'
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-base">{lang.flag}</span>
          <span className="text-sm">{lang.label}</span>
        </motion.button>
      ))}
    </div>
  );
}