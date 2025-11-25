import { motion } from 'motion/react';
import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';

interface SongCardProps {
  title: string;
  artist: string;
  coverUrl: string;
  emotion: Emotion;
  language?: string;
  youtubeUrl?: string;
}

const emotionEmojis = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  disgusted: '🤢',
  fearful: '😨',
  surprised: '😲',
};

const emotionColors = {
  happy: 'from-amber-400/15 to-yellow-400/15',
  sad: 'from-blue-400/15 to-indigo-400/15',
  angry: 'from-orange-400/15 to-red-400/15',
  neutral: 'from-slate-400/15 to-gray-400/15',
  disgusted: 'from-green-400/15 to-emerald-400/15',
  fearful: 'from-indigo-400/15 to-purple-400/15',
  surprised: 'from-pink-400/15 to-purple-400/15',
};

export function SongCard({ title, artist, coverUrl, emotion, language, youtubeUrl }: SongCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    // Convert youtube.com/watch?v=ID to youtube.com/embed/ID
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
  };

  const embedUrl = getYoutubeEmbedUrl(youtubeUrl || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative"
    >
      {/* Card container */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-4 shadow-lg border border-white/40 overflow-hidden transition-all hover:shadow-2xl">
        {/* Gradient overlay based on emotion */}
        <div className={`absolute inset-0 bg-gradient-to-br ${emotionColors[emotion]} opacity-0 group-hover:opacity-100 transition-opacity`} />

        <div className="relative z-10">
          {/* YouTube Iframe - Full width */}
          {embedUrl ? (
            <div className="relative rounded-[20px] overflow-hidden mb-4 aspect-video bg-slate-900">
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />

              {/* Emotion badge */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                <span className="text-base">{emotionEmojis[emotion]}</span>
                <span className="text-xs text-slate-600 capitalize">{emotion}</span>
              </div>

              {/* Language tag */}
              {language && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full px-3 py-1 shadow-md">
                  <span className="text-xs text-white">{language}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-[20px] overflow-hidden mb-4 aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <span className="text-slate-500 text-sm">No video available</span>
            </div>
          )}

          {/* Song info */}
          <div className="space-y-2">
            <h3 className="text-slate-800 font-semibold line-clamp-2">{title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">{artist}</p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-3">
              <motion.button
                onClick={() => setIsLiked(!isLiked)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 rounded-full py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all font-medium ${isLiked
                    ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{isLiked ? 'Liked' : 'Like'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-indigo-50 transition-all border border-white/50"
              >
                <Share2 className="w-4 h-4 text-indigo-500" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating glow effect */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute -inset-2 bg-gradient-to-br ${emotionColors[emotion]} rounded-[32px] blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity`}
      />
    </motion.div>
  );
}