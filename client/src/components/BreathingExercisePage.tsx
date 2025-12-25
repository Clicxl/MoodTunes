import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { breathingAPI } from '../api/apiClient';

type Language = 'en' | 'hi' | 'kn';
type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';

interface BreathingExercisePageProps {
    language: Language;
    emotion: Emotion;
    onClose: () => void;
}

const translations = {
    en: {
        title: 'Take a Moment to Breathe',
        subtitle: 'Follow the circle\'s rhythm - breathe in as it grows, out as it shrinks',
        breatheIn: 'Breathe In',
        breatheOut: 'Breathe Out',
        timeRemaining: 'Time Remaining',
        emotionMessageSad: 'You seem quite sad',
        emotionMessageAngry: 'You seem quite angry',
        close: 'Close',
    },
    hi: {
        title: 'सांस लेने के लिए एक पल निकालें',
        subtitle: 'वृत्त की लय को अनुसरण करें - जैसे ही बढ़े अंदर की ओर श्वास लें, घटे तो बाहर की ओर',
        breatheIn: 'अंदर की ओर सांस लें',
        breatheOut: 'बाहर की ओर सांस लें',
        timeRemaining: 'शेष समय',
        emotionMessageSad: 'आप काफी उदास लग रहे हैं',
        emotionMessageAngry: 'आप काफी गुस्से में लग रहे हैं',
        close: 'बंद करें',
    },
    kn: {
        title: 'ಸ್ವಾಸ ತೆಗೆದುಕೊಳ್ಳಲು ಒಂದು ನಿಮಿಷ ತೆಗೆದುಕೊಳ್ಳಿ',
        subtitle: 'ವೃತ್ತದ ಲಯವನ್ನು ಅನುಸರಿಸಿ - ಅದು ಬೆಳೆದಂತೆ ಒಳಗೆ ಮತ್ತು ಕುಗ್ಗಿದಂತೆ ಹೊರಗೆ ಸ್ವಾಸ ತೆಗೆದುಕೊಳ್ಳಿ',
        breatheIn: 'ಒಳಗೆ ಸ್ವಾಸ ತೆಗೆದುಕೊಳ್ಳಿ',
        breatheOut: 'ಹೊರಗೆ ಸ್ವಾಸ ತೆಗೆದುಕೊಳ್ಳಿ',
        timeRemaining: 'ಉಳಿದ ಸಮಯ',
        emotionMessageSad: 'ನೀವು ಸಾಕಷ್ಟು ಸಂತಾಪದಿಂದ ಕಾಣುತ್ತಿದ್ದೀರಿ',
        emotionMessageAngry: 'ನೀವು ಕೋಪದಿಂದ ಕಾಣುತ್ತಿದ್ದೀರಿ',
        close: 'ಮುಚ್ಚಿ',
    },
};

// Emotion-based color configurations
const emotionColors = {
    sad: {
        primary: 'from-blue-400 to-indigo-500',
        secondary: 'border-blue-300/50',
        text: 'text-blue-300',
        shadow: 'rgba(96, 165, 250, 0.4)',
        light: 'bg-blue-50/5',
    },
    angry: {
        primary: 'from-orange-400 to-red-500',
        secondary: 'border-orange-300/50',
        text: 'text-orange-300',
        shadow: 'rgba(251, 146, 60, 0.4)',
        light: 'bg-orange-50/5',
    },
};

export function BreathingExercisePage({
    language,
    emotion,
    onClose,
}: BreathingExercisePageProps) {
    const [timeLeft, setTimeLeft] = useState(30);
    const [breathCount, setBreathCount] = useState(0);
    const [isBreathingIn, setIsBreathingIn] = useState(true);

    const t = translations[language];
    const colors = emotionColors[emotion as keyof typeof emotionColors] || emotionColors.sad;
    const emotionMessage =
        emotion === 'sad'
            ? t.emotionMessageSad
            : emotion === 'angry'
                ? t.emotionMessageAngry
                : t.emotionMessageSad;

    // Handle closing and logging
    const handleClose = async (completed: boolean) => {
        try {
            if (completed) {
                // User completed the full 30 seconds
                await breathingAPI.logCompletion(emotion, 30, language);
                console.log('[BREATHING] Exercise completed and logged');
            } else {
                // User closed early
                const timeElapsed = 30 - timeLeft;
                await breathingAPI.logSkipped(emotion, timeElapsed, language);
                console.log(`[BREATHING] Exercise skipped after ${timeElapsed}s`);
            }
        } catch (error) {
            console.error('[BREATHING] Failed to log exercise:', error);
        }
        onClose();
    };

    // Update breath text every second
    useEffect(() => {
        const breathInterval = setInterval(() => {
            setBreathCount(prev => {
                const newCount = prev + 1;
                const phase = newCount % 8;
                setIsBreathingIn(phase < 4);
                return newCount;
            });
        }, 1000);

        return () => clearInterval(breathInterval);
    }, []);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            handleClose(true); // Completed successfully
            return;
        }

        const timerInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timeLeft]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950`}
        >
            <div className="max-w-2xl w-full mx-auto text-center">
                {/* Solid background - completely opaque */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`} />

                {/* Close button */}
                <motion.button
                    onClick={() => handleClose(false)} // User initiated close
                    className="relative z-10 absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={t.close}
                >
                    <X className="w-6 h-6 text-white" />
                </motion.button>

                {/* Emotion message */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`relative z-10 text-3xl md:text-4xl font-bold ${colors.text} mb-6`}
                >
                    {emotionMessage}
                </motion.div>

                {/* Main title */}
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`relative z-10 text-4xl md:text-5xl font-bold ${colors.text} mb-8`}
                >
                    {t.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 text-lg md:text-xl text-white/80 mb-16 px-4"
                >
                    {t.subtitle}
                </motion.p>

                {/* Breathing circle animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 flex items-center justify-center mb-20"
                >
                    <div className="w-300px h-300px flex items-center justify-center">
                        {/* Outer pulsing ring */}
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                boxShadow: [
                                    `0 0 0 0 ${colors.shadow}`,
                                    `0 0 30px 10px ${colors.shadow}`,
                                    `0 0 0 0 ${colors.shadow}`,
                                ],
                            }}
                            transition={{
                                duration: 8,
                                ease: 'easeInOut',
                                repeat: Infinity,
                            }}
                            className={`absolute w-48 h-48 md:w-56 md:h-56 rounded-full border-4 ${colors.secondary}`}
                        />

                        {/* Inner breathing circle */}
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                            }}
                            transition={{
                                duration: 8,
                                ease: 'easeInOut',
                                repeat: Infinity,
                            }}
                            className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center bg-gradient-to-br ${colors.primary} opacity-40`}
                        >
                            {/* Breath instruction text */}
                            <motion.span
                                animate={{
                                    opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                    duration: 8,
                                    ease: 'easeInOut',
                                    repeat: Infinity,
                                }}
                                className="text-xl md:text-2xl font-bold text-white text-shadow text-center"
                            >
                                {isBreathingIn ? t.breatheIn : t.breatheOut}
                            </motion.span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Timer */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 text-3xl font-bold text-white mt-12"
                >
                    {t.timeRemaining}:{' '}
                    <motion.span
                        key={timeLeft}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className={colors.text}
                    >
                        {String(timeLeft).padStart(2, '0')}
                    </motion.span>
                    s
                </motion.div>

                {/* Progress indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative z-10 mt-8 w-full bg-white/10 rounded-full h-2 overflow-hidden"
                >
                    <motion.div
                        animate={{
                            width: `${((30 - timeLeft) / 30) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`h-full bg-gradient-to-r ${colors.primary}`}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
