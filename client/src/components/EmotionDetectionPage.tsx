import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SongCard } from './SongCard';
import { Camera, CameraOff, Sliders, AlertCircle } from 'lucide-react';
import { emotionAPI, getErrorMessage } from '../api/apiClient';

type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';
type Language = 'en' | 'hi' | 'kn';

interface EmotionDetectionPageProps {
  language: Language;
  currentEmotion: Emotion;
  onEmotionChange: (emotion: Emotion) => void;
  onNavigateToBreathing?: () => void;
}

const translations = {
  en: {
    title: 'Emotion Detection',
    subtitle: 'Let me detect your current mood',
    startCamera: 'Start Camera',
    stopCamera: 'Stop Camera',
    detecting: 'Detecting emotion...',
    moodPreference: 'Mood Preference',
    calm: 'Calm',
    energetic: 'Energetic',
    emotionHistory: 'Emotion History',
    recommendations: 'Songs for your mood',
    noCamera: 'Camera access required',
  },
  hi: {
    title: 'भावना पहचान',
    subtitle: 'मैं आपके वर्तमान मूड का पता लगाता हूं',
    startCamera: 'कैमरा शुरू करें',
    stopCamera: 'कैमरा बंद करें',
    detecting: 'भावना का पता लगाया जा रहा है...',
    moodPreference: 'मूड वरीयता',
    calm: 'शांत',
    energetic: 'ऊर्जावान',
    emotionHistory: 'भावना इतिहास',
    recommendations: 'आपके मूड के लिए गाने',
    noCamera: 'कैमरे की पहुंच आवश्यक है',
  },
  kn: {
    title: 'ಭಾವನೆ ಪತ್ತೆ',
    subtitle: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಮನಸ್ಥಿತಿಯನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತೇನೆ',
    startCamera: 'ಕ್ಯಾಮರಾ ಪ್ರಾರಂಭಿಸಿ',
    stopCamera: 'ಕ್ಯಾಮರಾ ನಿಲ್ಲಿಸಿ',
    detecting: 'ಭಾವನೆಯನ್ನು ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    moodPreference: 'ಮನಸ್ಥಿತಿ ಆದ್ಯತೆ',
    calm: 'ಶಾಂತ',
    energetic: 'ಶಕ್ತಿಯುತ',
    emotionHistory: 'ಭಾವನೆ ಇತಿಹಾಸ',
    recommendations: 'ನಿಮ್ಮ ಮನಸ್ಥಿತಿಗೆ ಹಾಡುಗಳು',
    noCamera: 'ಕ್ಯಾಮರಾ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ',
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

const emotionBorderColors = {
  happy: 'border-amber-400',
  sad: 'border-blue-400',
  neutral: 'border-slate-400',
  angry: 'border-orange-400',
  disgusted: 'border-green-400',
  fearful: 'border-indigo-400',
  surprised: 'border-pink-400',
};

const emotionGlowColors = {
  happy: 'shadow-amber-400/50',
  sad: 'shadow-blue-400/50',
  neutral: 'shadow-slate-400/50',
  angry: 'shadow-orange-400/50',
  disgusted: 'shadow-green-400/50',
  fearful: 'shadow-indigo-400/50',
  surprised: 'shadow-pink-400/50',
};

// Mock song data for each emotion
const mockSongsByEmotion: Record<Emotion, Array<{ id: number; title: string; artist: string; }>> = {
  happy: [
    { id: 1, title: 'Sunshine Vibes', artist: 'Happy Beats' },
    { id: 2, title: 'Dancing All Night', artist: 'Groove Masters' },
    { id: 3, title: 'Feel Good Summer', artist: 'Positive Energy' },
  ],
  sad: [
    { id: 4, title: 'Rainy Days', artist: 'Mellow Sounds' },
    { id: 5, title: 'Melancholy Moon', artist: 'Blue Notes' },
    { id: 6, title: 'Tears in Rain', artist: 'Emotional Waves' },
  ],
  angry: [
    { id: 7, title: 'Thunder Storm', artist: 'Rock Legends' },
    { id: 8, title: 'Fire Within', artist: 'Metal Core' },
    { id: 9, title: 'Breaking Chains', artist: 'Power Band' },
  ],
  neutral: [
    { id: 10, title: 'Peaceful Waves', artist: 'Calm Collective' },
    { id: 11, title: 'Mindful Moments', artist: 'Zen Sounds' },
    { id: 12, title: 'Quiet Reflection', artist: 'Ambient Peace' },
  ],
  disgusted: [
    { id: 13, title: 'Walk Away', artist: 'Clean Slate' },
    { id: 14, title: 'Fresh Start', artist: 'New Beginning' },
    { id: 15, title: 'Clear Mind', artist: 'Pure Thoughts' },
  ],
  fearful: [
    { id: 16, title: 'Dark Shadows', artist: 'Gothic Choir' },
    { id: 17, title: 'Whisper in Dark', artist: 'Ambient Fear' },
    { id: 18, title: 'Comfort in Darkness', artist: 'Brave Souls' },
  ],
  surprised: [
    { id: 19, title: 'Unexpected Turn', artist: 'Pop Surprise' },
    { id: 20, title: 'WOW Factor', artist: 'Energy Burst' },
    { id: 21, title: 'Amazing Discovery', artist: 'Wonder Beats' },
  ],
};

export function EmotionDetectionPage({ language, currentEmotion, onEmotionChange, onNavigateToBreathing }: EmotionDetectionPageProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [moodSlider, setMoodSlider] = useState(50);
  const [emotionHistory, setEmotionHistory] = useState<Emotion[]>(['neutral', 'happy', 'neutral']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedSongs, setRecommendedSongs] = useState<Array<{ name: string; url: string; desc: string; language: string; emotion: Emotion }>>([]);
  const videoRef = useRef<HTMLImageElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = translations[language];

  // Poll for current emotion from backend
  const pollEmotion = async () => {
    try {
      const response = await emotionAPI.getCurrentEmotion(language);
      if (response && response.emotion) {
        // Normalize emotion to lowercase for comparison
        const normalizedEmotion = response.emotion.toLowerCase() as Emotion;
        if (normalizedEmotion !== currentEmotion) {
          onEmotionChange(normalizedEmotion);
          setEmotionHistory(prev => [normalizedEmotion, ...prev].slice(0, 5));

          // Show breathing exercise for sad or angry emotions
          if (normalizedEmotion === 'sad' || normalizedEmotion === 'angry') {
            console.log(`[EMOTION REDIRECT] Detected ${normalizedEmotion} emotion - navigating to breathing page`);
            if (onNavigateToBreathing) {
              onNavigateToBreathing();
            }
          }
        }
        // Update recommended songs from backend
        if (response.songs && response.songs.length > 0) {
          const normalizedEmotion = response.emotion.toLowerCase() as Emotion;
          setRecommendedSongs(response.songs.map((song: any) => ({
            name: song.name,
            url: song.url,
            desc: song.desc,
            language: song.language,
            emotion: normalizedEmotion
          })));
        }
      }
    } catch (err) {
      console.log('Emotion polling:', getErrorMessage(err));
    }
  };

  const handleToggleCamera = async () => {
    if (cameraActive) {
      // Stop camera
      setCameraActive(false);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setError('');
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    } else {
      // Start camera
      try {
        setIsLoading(true);
        setError('');
        setCameraActive(true);

        // Set video feed source
        if (videoRef.current) {
          videoRef.current.src = 'http://localhost:5000/video_feed';
        }

        // Start polling for emotion updates
        pollIntervalRef.current = setInterval(pollEmotion, 2000);

        setIsLoading(false);
      } catch (err) {
        setError(getErrorMessage(err));
        setCameraActive(false);
        setIsLoading(false);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Refetch songs when language changes
  useEffect(() => {
    if (cameraActive) {
      // If camera is active, trigger an immediate emotion poll with new language
      pollEmotion();
    }
  }, [language]);

  return (
    <div className="pt-20 md:pt-24 pb-24 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 md:p-8 shadow-lg border border-white/40 text-center">
          <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {t.title}
          </h1>
          <p className="text-slate-600">{t.subtitle}</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {/* Webcam view */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 shadow-lg border border-white/40">
            {/* Camera preview */}
            <div
              className={`relative aspect-video rounded-3xl overflow-hidden mb-6 border-4 ${emotionBorderColors[currentEmotion]} shadow-2xl ${emotionGlowColors[currentEmotion]} transition-all duration-500 bg-slate-900`}
            >
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 z-50">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {cameraActive ? (
                <div className="w-full h-full relative">
                  {/* Video stream */}
                  <img
                    ref={videoRef}
                    src="http://localhost:5000/video_feed"
                    alt="Webcam feed"
                    className="w-full h-full object-cover"
                    onError={() => setError('Failed to connect to camera feed')}
                  />

                  {/* Current emotion badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-xl">
                    <span className="text-2xl">{emotionEmojis[currentEmotion]}</span>
                    <span className="text-sm text-slate-700 capitalize">{currentEmotion}</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-slate-400 text-center">
                    <CameraOff className="w-16 h-16 mx-auto mb-4" />
                    <p>{t.noCamera}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera toggle button */}
            <motion.button
              onClick={handleToggleCamera}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-3xl shadow-lg transition-all flex items-center justify-center gap-3 ${cameraActive
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                }`}
            >
              {cameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              {cameraActive ? t.stopCamera : t.startCamera}
            </motion.button>
          </div>
        </motion.div>

        {/* Controls & History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Mood preference slider */}
          <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 shadow-lg border border-white/40">
            <div className="flex items-center gap-3 mb-4">
              <Sliders className="w-5 h-5 text-teal-600" />
              <h3 className="text-slate-700">{t.moodPreference}</h3>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={moodSlider}
                onChange={(e) => setMoodSlider(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t.calm}</span>
                <span>{t.energetic}</span>
              </div>
            </div>
          </div>

          {/* Emotion history */}
          <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 shadow-lg border border-white/40">
            <h3 className="text-slate-700 mb-4">{t.emotionHistory}</h3>
            <div className="flex flex-wrap gap-3">
              {emotionHistory.map((emotion, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-md"
                >
                  <span className="text-xl">{emotionEmojis[emotion]}</span>
                  <span className="text-sm text-slate-700 capitalize">{emotion}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Song recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl text-slate-700 mb-6">{t.recommendations}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedSongs && recommendedSongs.length > 0 && recommendedSongs.map((song, index) => (
            <motion.div
              key={`${song.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <SongCard
                title={song.name}
                artist={song.desc}
                coverUrl={`https://images.unsplash.com/photo-${1514525253193 + index}?w=400&h=400&fit=crop`}
                emotion={currentEmotion}
                language={song.language}
                youtubeUrl={song.url}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
