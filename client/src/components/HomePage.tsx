import { useState } from 'react';
import { motion } from 'motion/react';
import { SongCard } from './SongCard';
import { Filter } from 'lucide-react';

type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';
type Language = 'en' | 'hi' | 'kn';

interface HomePageProps {
  userName: string;
  language: Language;
  currentEmotion: Emotion;
}

const translations = {
  en: {
    greeting: 'Welcome back',
    subtitle: 'Discover music for your mood',
    filters: 'Filters',
    allMoods: 'All Moods',
    happy: 'Happy',
    sad: 'Sad',
    neutral: 'Neutral',
    angry: 'Angry',
    disgusted: 'Disgusted',
    fearful: 'Fearful',
    surprised: 'Surprised',
    recommendedForYou: 'Recommended for You',
  },
  hi: {
    greeting: 'वापसी पर स्वागत है',
    subtitle: 'अपने मूड के लिए संगीत खोजें',
    filters: 'फ़िल्टर',
    allMoods: 'सभी मूड',
    happy: 'खुश',
    sad: 'उदास',
    neutral: 'तटस्थ',
    angry: 'गुस्सा',
    disgusted: 'घृणित',
    fearful: 'भयभीत',
    surprised: 'आश्चर्यचकित',
    recommendedForYou: 'आपके लिए अनुशंसित',
  },
  kn: {
    greeting: 'ಮರಳಿ ಸ್ವಾಗತ',
    subtitle: 'ನಿಮ್ಮ ಮನಸ್ಥಿತಿಗಾಗಿ ಸಂಗೀತವನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ',
    filters: 'ಫಿಲ್ಟರ್‌ಗಳು',
    allMoods: 'ಎಲ್ಲಾ ಮನಸ್ಥಿತಿಗಳು',
    happy: 'ಸಂತೋಷ',
    sad: 'ದುಃಖ',
    neutral: 'ತಟಸ್ಥ',
    angry: 'ಕೋಪ',
    disgusted: 'ಅಸಹ್ಯ',
    fearful: 'ಭಯ',
    surprised: 'ಆಶ್ಚರ್ಯ',
    recommendedForYou: 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು',
  },
};

const emotionEmojis = {
  happy: '😊',
  sad: '😢',
  neutral: '😐',
  angry: '😠',
  disgusted: '🤢',
  fearful: '😨',
  surprised: '😲',
};

const emotionColors = {
  happy: 'from-amber-400 to-yellow-400',
  sad: 'from-blue-400 to-indigo-400',
  neutral: 'from-slate-400 to-gray-400',
  angry: 'from-orange-400 to-red-400',
  disgusted: 'from-green-400 to-emerald-400',
  fearful: 'from-indigo-400 to-purple-400',
  surprised: 'from-pink-400 to-purple-400',
};

// Mock song data
const getMockSongs = (emotion?: Emotion) => {
  const allSongs = [
    { id: 1, title: 'Sunshine Vibes', artist: 'Happy Beats', emotion: 'happy' as Emotion, language: 'English' },
    { id: 2, title: 'Dancing All Night', artist: 'Groove Masters', emotion: 'happy' as Emotion, language: 'English' },
    { id: 3, title: 'Rainy Days', artist: 'Mellow Sounds', emotion: 'sad' as Emotion, language: 'English' },
    { id: 4, title: 'Melancholy Moon', artist: 'Blue Notes', emotion: 'sad' as Emotion, language: 'English' },
    { id: 5, title: 'Thunder Storm', artist: 'Rock Legends', emotion: 'angry' as Emotion, language: 'English' },
    { id: 6, title: 'Fire Within', artist: 'Metal Core', emotion: 'angry' as Emotion, language: 'English' },
    { id: 7, title: 'Peaceful Waves', artist: 'Calm Collective', emotion: 'neutral' as Emotion, language: 'English' },
    { id: 8, title: 'Mindful Moments', artist: 'Zen Sounds', emotion: 'neutral' as Emotion, language: 'English' },
    { id: 9, title: 'Unexpected Turn', artist: 'Pop Surprise', emotion: 'surprised' as Emotion, language: 'English' },
    { id: 10, title: 'WOW Factor', artist: 'Energy Burst', emotion: 'surprised' as Emotion, language: 'English' },
    { id: 11, title: 'Dark Shadows', artist: 'Gothic Choir', emotion: 'fearful' as Emotion, language: 'English' },
    { id: 12, title: 'Whisper in Dark', artist: 'Ambient Fear', emotion: 'fearful' as Emotion, language: 'English' },
  ];

  return emotion ? allSongs.filter(song => song.emotion === emotion) : allSongs;
};

export function HomePage({ userName, language, currentEmotion }: HomePageProps) {
  const [selectedMood, setSelectedMood] = useState<Emotion | 'all'>('all');
  const t = translations[language];

  const moodFilters: Array<{ key: Emotion | 'all'; label: string; emoji?: string }> = [
    { key: 'all', label: t.allMoods },
    { key: 'happy', label: t.happy, emoji: emotionEmojis.happy },
    { key: 'sad', label: t.sad, emoji: emotionEmojis.sad },
    { key: 'neutral', label: t.neutral, emoji: emotionEmojis.neutral },
    { key: 'angry', label: t.angry, emoji: emotionEmojis.angry },
    { key: 'disgusted', label: t.disgusted, emoji: emotionEmojis.disgusted },
    { key: 'fearful', label: t.fearful, emoji: emotionEmojis.fearful },
    { key: 'surprised', label: t.surprised, emoji: emotionEmojis.surprised },
  ];

  const songs = getMockSongs(selectedMood === 'all' ? undefined : selectedMood);

  return (
    <div className="pt-20 md:pt-24 pb-24 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 md:p-8 shadow-lg border border-white/40">
          <h1 className="text-2xl md:text-3xl mb-2">
            <span className="text-slate-700">{t.greeting}, </span>
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>
          <p className="text-slate-600">{t.subtitle}</p>

          {/* Current emotion indicator */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full"
          >
            <span className="text-2xl">{emotionEmojis[currentEmotion]}</span>
            <span className="text-sm text-slate-700 capitalize">{currentEmotion}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Mood filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h2 className="text-slate-700">{t.filters}</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {moodFilters.map((filter, index) => {
            const isActive = selectedMood === filter.key;
            return (
              <motion.button
                key={filter.key}
                onClick={() => setSelectedMood(filter.key)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white/40 backdrop-blur-sm text-slate-700 hover:bg-white/60 border border-white/40'
                }`}
              >
                {filter.emoji && <span className="text-lg">{filter.emoji}</span>}
                <span className="text-sm">{filter.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Songs grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl text-slate-700 mb-6">{t.recommendedForYou}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SongCard
                title={song.title}
                artist={song.artist}
                coverUrl={`https://images.unsplash.com/photo-${1514525253193 + index}?w=400&h=400&fit=crop`}
                emotion={song.emotion}
                language={song.language}
              />
            </motion.div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p>No songs found for this mood. Try a different filter!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
