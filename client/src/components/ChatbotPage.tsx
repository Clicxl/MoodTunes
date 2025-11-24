import { useState } from 'react';
import { motion } from 'motion/react';
import { MascotCharacter } from './MascotCharacter';
import { Send, Mic, AlertCircle } from 'lucide-react';
import { chatAPI, getErrorMessage } from '../api/apiClient';

type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';
type Language = 'en' | 'hi' | 'kn';

interface ChatbotPageProps {
  language: Language;
  currentEmotion: Emotion;
  userName: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

const translations = {
  en: {
    title: 'Chat with MoodBot',
    subtitle: 'Your friendly music companion',
    placeholder: 'Type your message...',
    quickTopics: 'Quick Topics',
    moodHelp: 'Help with my mood',
    songRecommendation: 'Suggest a song',
    musicGenres: 'Music genres',
    feelingDown: 'Feeling down',
    celebrationMode: 'Celebration time',
    typing: 'MoodBot is typing...',
  },
  hi: {
    title: 'MoodBot से चैट करें',
    subtitle: 'आपका दोस्ताना संगीत साथी',
    placeholder: 'अपना संदेश टाइप करें...',
    quickTopics: 'त्वरित विषय',
    moodHelp: 'मूड में मदद',
    songRecommendation: 'गाना सुझाएं',
    musicGenres: 'संगीत शैलियाँ',
    feelingDown: 'उदास महसूस कर रहे हैं',
    celebrationMode: 'उत्सव का समय',
    typing: 'MoodBot टाइप कर रहा है...',
  },
  kn: {
    title: 'MoodBot ನೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ',
    subtitle: 'ನಿಮ್ಮ ಸ್ನೇಹಪರ ಸಂಗೀತ ಸಹಚರ',
    placeholder: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
    quickTopics: 'ತ್ವರಿತ ವಿಷಯಗಳು',
    moodHelp: 'ಮನಸ್ಥಿತಿ ಸಹಾಯ',
    songRecommendation: 'ಹಾಡು ಸೂಚಿಸಿ',
    musicGenres: 'ಸಂಗೀತ ಪ್ರಕಾರಗಳು',
    feelingDown: 'ಕೆಳಗೆ ಅನುಭವಿಸುತ್ತಿದ್ದೀರಾ',
    celebrationMode: 'ಆಚರಣೆ ಸಮಯ',
    typing: 'MoodBot ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...',
  },
};

const botResponses = {
  en: {
    greeting: "Hello! I'm MoodBot, your music companion. How are you feeling today?",
    moodHelp: "I can sense you're feeling {emotion}. Would you like me to suggest some music to match or shift your mood?",
    songRecommendation: "Based on your current mood, I recommend listening to uplifting tracks. Would you like specific suggestions?",
    musicGenres: "I can help you discover various genres! Are you interested in Pop, Rock, Classical, Jazz, or something else?",
    feelingDown: "I understand. Sometimes music can really help. Let me find some comforting songs for you.",
    celebrationMode: "That's wonderful! Let's celebrate with some energetic, happy music! 🎉",
  },
  hi: {
    greeting: "नमस्ते! मैं MoodBot हूं, आपका संगीत साथी। आज आप कैसा महसूस कर रहे हैं?",
    moodHelp: "मुझे लगता है कि आप {emotion} महसूस कर रहे हैं। क्या आप चाहते हैं कि मैं आपके मूड के अनुसार या बदलने के लिए संगीत सुझाऊं?",
    songRecommendation: "आपके वर्तमान मूड के आधार पर, मैं उत्साहजनक ट्रैक सुनने की सलाह देता हूं। क्या आप विशिष्ट सुझाव चाहते हैं?",
    musicGenres: "मैं आपको विभिन्न शैलियों की खोज में मदद कर सकता हूं! क्या आप पॉप, रॉक, शास्त्रीय, जैज़, या कुछ और में रुचि रखते हैं?",
    feelingDown: "मैं समझता हूं। कभी-कभी संगीत वास्तव में मदद कर सकता है। मैं आपके लिए कुछ आरामदायक गाने ढूंढता हूं।",
    celebrationMode: "यह बहुत अच्छा है! चलो कुछ ऊर्जावान, खुशी भरे संगीत के साथ मनाते हैं! 🎉",
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು MoodBot, ನಿಮ್ಮ ಸಂಗೀತ ಸಹಚರ. ಇಂದು ನೀವು ಹೇಗೆ ಅನುಭವಿಸುತ್ತಿದ್ದೀರಿ?",
    moodHelp: "ನೀವು {emotion} ಅನುಭವಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ನಾನು ಅರ್ಥ ಮಾಡಿಕೊಳ್ಳಬಹುದು. ನಿಮ್ಮ ಮನಸ್ಥಿತಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಅಥವಾ ಬದಲಾಯಿಸಲು ಸಂಗೀತವನ್ನು ಸೂಚಿಸಲು ನೀವು ಬಯಸುತ್ತೀರಾ?",
    songRecommendation: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಮನಸ್ಥಿತಿಯ ಆಧಾರದ ಮೇಲೆ, ನಾನು ಉತ್ತೇಜಕ ಹಾಡುಗಳನ್ನು ಕೇಳಲು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ. ನಿರ್ದಿಷ್ಟ ಸಲಹೆಗಳು ಬೇಕೇ?",
    musicGenres: "ನಾನು ವಿವಿಧ ಪ್ರಕಾರಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ! ನೀವು ಪಾಪ್, ರಾಕ್, ಶಾಸ್ತ್ರೀಯ, ಜಾಝ್, ಅಥವಾ ಬೇರೆ ಯಾವುದರಲ್ಲಿ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಾ?",
    feelingDown: "ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ. ಕೆಲವೊಮ್ಮೆ ಸಂಗೀತ ನಿಜವಾಗಿಯೂ ಸಹಾಯ ಮಾಡಬಹುದು. ನಿಮಗಾಗಿ ಕೆಲವು ಸಾಂತ್ವನ ಹಾಡುಗಳನ್ನು ಹುಡುಕುತ್ತೇನೆ.",
    celebrationMode: "ಅದು ಅದ್ಭುತವಾಗಿದೆ! ಕೆಲವು ಶಕ್ತಿಯುತ, ಸಂತೋಷದ ಸಂಗೀತದೊಂದಿಗೆ ಆಚರಿಸೋಣ! 🎉",
  },
};

export function ChatbotPage({ language, currentEmotion, userName }: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: botResponses[language].greeting,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const t = translations[language];
  const responses = botResponses[language];

  const quickTopics = [
    { key: 'moodHelp', label: t.moodHelp },
    { key: 'songRecommendation', label: t.songRecommendation },
    { key: 'musicGenres', label: t.musicGenres },
    { key: 'feelingDown', label: t.feelingDown },
    { key: 'celebrationMode', label: t.celebrationMode },
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Get bot response from API
    setIsTyping(true);
    try {
      const response = await chatAPI.sendMessage(text);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.response || 'Sorry, I couldn\'t process that. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: false,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorText = getErrorMessage(error);
      const botMessage: Message = {
        id: messages.length + 2,
        text: `I encountered an error: ${errorText}. Please try again later.`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes('mood') || lowerText.includes('feeling')) {
      return responses.moodHelp.replace('{emotion}', currentEmotion);
    } else if (lowerText.includes('song') || lowerText.includes('music')) {
      return responses.songRecommendation;
    } else if (lowerText.includes('genre')) {
      return responses.musicGenres;
    } else if (lowerText.includes('sad') || lowerText.includes('down')) {
      return responses.feelingDown;
    } else if (lowerText.includes('happy') || lowerText.includes('celebrate')) {
      return responses.celebrationMode;
    }

    return `I understand you said "${userText}". How can I help you with music today?`;
  };

  const handleQuickTopic = (topicKey: string) => {
    const response = responses[topicKey as keyof typeof responses];
    if (response) {
      handleSendMessage(quickTopics.find(t => t.key === topicKey)?.label || topicKey);
    }
  };

  return (
    <div className="pt-20 md:pt-24 pb-24 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 shadow-lg border border-white/40 text-center">
          <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {t.title}
          </h1>
          <p className="text-slate-600">{t.subtitle}</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px] gap-6">
        {/* Chat area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 shadow-lg border border-white/40 flex flex-col"
          style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-5 py-3 rounded-3xl ${message.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-md'
                      : 'bg-white/80 backdrop-blur-sm text-slate-700 rounded-bl-md border border-white/60'
                    }`}
                >
                  <div className={`text-sm leading-relaxed flex items-start gap-2 ${message.isError ? 'text-red-600' : ''}`}>
                    {message.isError && <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <p>{message.text}</p>
                  </div>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : message.isError ? 'text-red-500' : 'text-slate-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/80 backdrop-blur-sm text-slate-700 px-5 py-3 rounded-3xl rounded-bl-md border border-white/60">
                  <div className="flex gap-2">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick topics */}
          <div className="mb-4">
            <p className="text-xs text-slate-600 mb-2">{t.quickTopics}</p>
            <div className="flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <motion.button
                  key={topic.key}
                  onClick={() => handleQuickTopic(topic.key)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 bg-white/60 backdrop-blur-sm text-xs text-slate-700 rounded-full hover:bg-white/80 transition-all border border-white/40"
                >
                  {topic.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              placeholder={t.placeholder}
              className="flex-1 px-5 py-3 bg-white/60 backdrop-blur-sm rounded-full border-2 border-white/40 focus:border-teal-400 focus:outline-none text-slate-700 placeholder:text-slate-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/80 transition-all border border-white/40"
            >
              <Mic className="w-5 h-5 text-teal-600" />
            </motion.button>
            <motion.button
              onClick={() => handleSendMessage(inputMessage)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </motion.div>

        {/* Mascot sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="bg-white/40 backdrop-blur-xl rounded-[28px] p-6 shadow-lg border border-white/40 sticky top-24">
            <div className="flex flex-col items-center text-center">
              <MascotCharacter emotion={currentEmotion} size="xl" />
              <h3 className="text-slate-700 mt-6 mb-2">MoodBot</h3>
              <p className="text-sm text-slate-600 mb-4">
                Hi {userName}! I'm here to help you find the perfect music for your mood.
              </p>

              {/* Current mood indicator */}
              <div className="w-full bg-white/60 backdrop-blur-sm rounded-2xl p-4 mt-4">
                <p className="text-xs text-slate-600 mb-2">Your Current Mood</p>
                <p className="text-lg capitalize text-slate-700">{currentEmotion}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
