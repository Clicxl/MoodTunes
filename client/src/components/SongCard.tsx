import { motion } from 'motion/react';
import { Play, Heart, Share2, X } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

const emotionBorder = {
  happy: 'border-amber-300/30',
  sad: 'border-blue-300/30',
  angry: 'border-orange-300/30',
  neutral: 'border-slate-300/30',
  disgusted: 'border-green-300/30',
  fearful: 'border-indigo-300/30',
  surprised: 'border-pink-300/30',
};

export function SongCard({ title, artist, coverUrl, emotion, language, youtubeUrl }: SongCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    // Convert youtube.com/watch?v=ID to youtube.com/embed/ID
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1` : '';
  };

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
          {/* Album cover */}
          <div className="relative rounded-[20px] overflow-hidden mb-4 aspect-square">
            <ImageWithFallback
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />

            {/* Play button overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.button
                onClick={() => youtubeUrl && setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl"
              >
                <Play className="w-7 h-7 text-teal-600 fill-teal-600 ml-1" />
              </motion.button>
            </motion.div>

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

          {/* Song info */}
          <div className="space-y-2">
            <h3 className="text-slate-800 line-clamp-1">{title}</h3>
            <p className="text-sm text-slate-600 line-clamp-1">{artist}</p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <motion.button
                onClick={() => youtubeUrl && setIsOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span className="text-sm">Play</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-all border border-white/50"
              >
                <Heart className="w-4 h-4 text-red-400" />
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

      {/* YouTube Modal */}
      {isOpen && youtubeUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-white font-semibold line-clamp-1">{title}</h2>
                <p className="text-white/80 text-sm line-clamp-1">{artist}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-4 p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* YouTube Iframe */}
            <div className="aspect-video bg-slate-900">
              <iframe
                width="100%"
                height="100%"
                src={getYoutubeEmbedUrl(youtubeUrl)}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}