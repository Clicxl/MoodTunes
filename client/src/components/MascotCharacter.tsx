import { motion } from 'motion/react';

type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised' | 'comforting' | 'shy';

interface MascotCharacterProps {
  emotion: Emotion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  message?: string;
}

export function MascotCharacter({
  emotion,
  size = 'md',
  showSpeechBubble = false,
  message,
}: MascotCharacterProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const getMascotExpression = () => {
    switch (emotion) {
      case 'happy':
        return {
          face: '◠‿◠',
          color: 'from-teal-300 to-cyan-300',
          animation: { y: [0, -8, 0], scale: [1, 1.05, 1] },
        };
      case 'sad':
        return {
          face: '◕︵◕',
          color: 'from-blue-300 to-indigo-300',
          animation: { y: [0, 3, 0] },
        };
      case 'angry':
        return {
          face: '︵_︵',
          color: 'from-orange-300 to-red-300',
          animation: { x: [-1, 1, -1, 1, 0] },
        };
      case 'disgusted':
        return {
          face: '◔_◔',
          color: 'from-green-300 to-emerald-300',
          animation: { rotate: [0, -2, 2, 0] },
        };
      case 'fearful':
        return {
          face: '◕ ◕',
          color: 'from-indigo-300 to-purple-300',
          animation: { scale: [1, 0.95, 1], y: [0, 2, 0] },
        };
      case 'surprised':
        return {
          face: '◯‿◯',
          color: 'from-pink-300 to-purple-300',
          animation: { scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] },
        };
      case 'comforting':
        return {
          face: '◕‿◕',
          color: 'from-indigo-300 to-purple-300',
          animation: { scale: [1, 1.03, 1] },
        };
      case 'shy':
        return {
          face: '⌒‿⌒',
          color: 'from-pink-200 to-purple-200',
          animation: { rotate: [0, -3, 3, 0] },
        };
      case 'neutral':
      default:
        return {
          face: '◕‿◕',
          color: 'from-slate-300 to-blue-300',
          animation: { scale: [1, 1.02, 1] },
        };
    }
  };

  const mascot = getMascotExpression();

  return (
    <div className="relative inline-block">
      {/* Speech bubble */}
      {showSpeechBubble && message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3 shadow-xl whitespace-nowrap border border-slate-200/50 max-w-xs text-center"
        >
          <p className="text-sm text-slate-700">{message}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-r border-b border-slate-200/50" />
        </motion.div>
      )}

      {/* Mascot body */}
      <motion.div
        animate={mascot.animation}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Subtle glow effect */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${mascot.color} blur-2xl opacity-30`}
        />

        {/* Main body - minimalist geometric shape */}
        <div
          className={`${sizeClasses[size]} relative rounded-full bg-gradient-to-br ${mascot.color} flex items-center justify-center shadow-xl border-2 border-white/40`}
        >
          {/* Simple geometric face */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Eyes and expression */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl sm:text-3xl md:text-4xl text-slate-700 font-light tracking-wider"
            >
              {mascot.face}
            </motion.div>
          </div>
        </div>

        {/* Emotion-specific accent effects */}
        {emotion === 'happy' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-teal-400/60 text-base"
                style={{
                  top: ['20%', '50%', '80%'][i],
                  left: i === 1 ? '-15%' : 'auto',
                  right: i !== 1 ? '-15%' : 'auto',
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                }}
              >
                ·
              </motion.div>
            ))}
          </>
        )}

        {emotion === 'surprised' && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-400/60 text-lg"
                style={{
                  top: ['10%', '30%', '70%', '90%'][i],
                  left: i % 2 === 0 ? '-20%' : 'auto',
                  right: i % 2 === 1 ? '-20%' : 'auto',
                }}
                animate={{
                  scale: [0, 1.2, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}