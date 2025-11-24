import { motion } from 'motion/react';
import { Music2, MessageCircle, UserPlus } from 'lucide-react';

type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';
type Language = 'en' | 'hi' | 'kn';

interface FriendsPageProps {
  language: Language;
}

interface Friend {
  id: number;
  name: string;
  mood: Emotion;
  online: boolean;
  recentSong: string;
  artist: string;
}

const translations = {
  en: {
    title: 'Friends',
    subtitle: 'Connect and share music',
    online: 'Online',
    offline: 'Offline',
    listening: 'Listening to',
    sendSong: 'Send Song',
    chat: 'Chat',
    addFriend: 'Add Friend',
  },
  hi: {
    title: 'मित्र',
    subtitle: 'कनेक्ट करें और संगीत साझा करें',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    listening: 'सुन रहे हैं',
    sendSong: 'गाना भेजें',
    chat: 'चैट',
    addFriend: 'मित्र जोड़ें',
  },
  kn: {
    title: 'ಸ್ನೇಹಿತರು',
    subtitle: 'ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ಸಂಗೀತವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
    online: 'ಆನ್‌ಲೈನ್',
    offline: 'ಆಫ್‌ಲೈನ್',
    listening: 'ಕೇಳುತ್ತಿದ್ದಾರೆ',
    sendSong: 'ಹಾಡು ಕಳುಹಿಸಿ',
    chat: 'ಚಾಟ್',
    addFriend: 'ಸ್ನೇಹಿತ ಸೇರಿಸಿ',
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

// Mock friends data
const mockFriends: Friend[] = [
  { id: 1, name: 'Alex Chen', mood: 'happy', online: true, recentSong: 'Sunshine Vibes', artist: 'Happy Beats' },
  { id: 2, name: 'Jordan Lee', mood: 'neutral', online: true, recentSong: 'Peaceful Waves', artist: 'Calm Collective' },
  { id: 3, name: 'Sam Taylor', mood: 'sad', online: false, recentSong: 'Rainy Days', artist: 'Mellow Sounds' },
  { id: 4, name: 'Riley Morgan', mood: 'happy', online: true, recentSong: 'Dancing All Night', artist: 'Groove Masters' },
  { id: 5, name: 'Casey Park', mood: 'surprised', online: true, recentSong: 'Unexpected Turn', artist: 'Pop Surprise' },
  { id: 6, name: 'Drew Wilson', mood: 'neutral', online: false, recentSong: 'Mindful Moments', artist: 'Zen Sounds' },
];

export function FriendsPage({ language }: FriendsPageProps) {
  const t = translations[language];

  return (
    <div className="pt-20 md:pt-24 pb-24 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 md:p-8 shadow-lg border border-white/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {t.title}
              </h1>
              <p className="text-slate-600">{t.subtitle}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full shadow-lg flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">{t.addFriend}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Friends grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFriends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            className="group"
          >
            <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 shadow-lg border border-white/40 hover:shadow-2xl transition-all">
              {/* Friend header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar with mood color */}
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${emotionColors[friend.mood]} flex items-center justify-center text-3xl border-2 border-white/60 shadow-lg`}
                    >
                      {emotionEmojis[friend.mood]}
                    </div>
                    
                    {/* Online status indicator */}
                    <div
                      className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                        friend.online ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-slate-800 mb-1">{friend.name}</h3>
                    <p className="text-xs text-slate-600">
                      {friend.online ? t.online : t.offline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current mood badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full mb-4">
                <span className="text-sm">{emotionEmojis[friend.mood]}</span>
                <span className="text-xs text-slate-700 capitalize">{friend.mood}</span>
              </div>

              {/* Recent song */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 mb-4">
                <p className="text-xs text-slate-600 mb-2">{t.listening}</p>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-300 to-cyan-300 flex items-center justify-center flex-shrink-0">
                    <Music2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 line-clamp-1">{friend.recentSong}</p>
                    <p className="text-xs text-slate-600 line-clamp-1">{friend.artist}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Music2 className="w-4 h-4" />
                  <span className="text-sm">{t.sendSong}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-indigo-50 transition-all border border-white/50"
                >
                  <MessageCircle className="w-5 h-5 text-indigo-500" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state for no friends */}
      {mockFriends.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-12 shadow-lg border border-white/40">
            <UserPlus className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl text-slate-700 mb-2">No friends yet</h3>
            <p className="text-slate-600 mb-6">Start connecting with others to share music!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full shadow-lg"
            >
              {t.addFriend}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
