import { motion } from 'motion/react';

type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';

interface EmotionBackgroundProps {
  emotion: Emotion;
}

export function EmotionBackground({ emotion }: EmotionBackgroundProps) {
  const getBackgroundStyle = () => {
    switch (emotion) {
      case 'happy':
        return {
          background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE8CC 30%, #FFF4E0 70%, #FFFAF0 100%)',
          particles: '☀️✨💫⭐',
          overlay: 'rgba(255, 230, 150, 0.1)',
        };
      case 'sad':
        return {
          background: 'linear-gradient(135deg, #E8F1F5 0%, #D4E4ED 50%, #E0EBF0 100%)',
          particles: '💧🌧️💙💦',
          overlay: 'rgba(180, 200, 220, 0.15)',
        };
      case 'angry':
        return {
          background: 'linear-gradient(135deg, #FFE8E8 0%, #FFD4D4 50%, #FFEAEA 100%)',
          particles: '💨⚡🔶🔥',
          overlay: 'rgba(255, 150, 150, 0.1)',
        };
      case 'disgusted':
        return {
          background: 'linear-gradient(135deg, #E8F5E9 0%, #E0EED4 50%, #EEF5EA 100%)',
          particles: '🌿💚🍃',
          overlay: 'rgba(150, 200, 150, 0.1)',
        };
      case 'fearful':
        return {
          background: 'linear-gradient(135deg, #E0E7F5 0%, #D4DFF0 50%, #E5E9F5 100%)',
          particles: '🌑💜⚡👻',
          overlay: 'rgba(130, 140, 180, 0.15)',
        };
      case 'surprised':
        return {
          background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 50%, #FFF5FA 100%)',
          particles: '💥✨⭐🎉',
          overlay: 'rgba(255, 180, 220, 0.1)',
        };
      case 'neutral':
        return {
          background: 'linear-gradient(135deg, #E8F5F0 0%, #E0EEF5 50%, #EEF2F5 100%)',
          particles: '☁️🌿🍃',
          overlay: 'rgba(160, 200, 200, 0.1)',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #F5F5F7 0%, #E8EEF2 50%, #F0F4F8 100%)',
          particles: '✨🌟',
          overlay: 'rgba(200, 210, 220, 0.1)',
        };
    }
  };

  const style = getBackgroundStyle();
  const particleArray = style.particles.split('');

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden transition-all duration-1000"
      style={{ background: style.background }}
    >
      {/* Atmospheric overlay */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: style.overlay }}
      />

      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl md:text-3xl opacity-20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -50,
          }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 15 + 12,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        >
          {particleArray[i % particleArray.length]}
        </motion.div>
      ))}

      {/* Floating ambient shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: Math.random() * 150 + 80,
            height: Math.random() * 150 + 80,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Pulse effect for fearful emotion */}
      {emotion === 'fearful' && (
        <motion.div
          className="absolute inset-0 bg-indigo-900/5"
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Pop effect for surprised emotion */}
      {emotion === 'surprised' && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`pop-${i}`}
              className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-pink-300/30 to-purple-300/30"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />
    </div>
  );
}