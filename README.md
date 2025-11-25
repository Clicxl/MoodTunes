# 🎵 MoodTunes - AI-Powered Music Discovery Based on Emotion

MoodTunes is an intelligent web application that detects your current emotional state through webcam analysis and recommends personalized music based on your mood. Built with React, Flask, and facial expression recognition technology.

## ✨ Features

### 🎭 Emotion Detection
- **Real-time facial emotion detection** using advanced FER (Facial Expression Recognition) models
- **Live webcam feed** with emotion overlays displayed directly on the website
- **7 emotion categories**: Happy, Sad, Angry, Neutral, Disgusted, Fearful, Surprised
- **Emotion history tracking** to see your mood patterns
- **Stable emotion detection** with 1.5-second stability threshold to prevent false detections

### 🎶 Smart Music Recommendations
- **Mood-based song recommendations** tailored to your current emotion
- **Multi-language support** for music descriptions and metadata (English, Hindi, Kannada)
- **YouTube integration** - Watch full music videos directly embedded in the app
- **Dynamic song loading** from SQLite database with emotion associations
- **Real-time language switching** - Update recommendations without page refresh

### 💬 AI Chatbot Assistant
- **Music recommendation chatbot** powered by Google Gemini AI
- **Multilingual support** - Chat in English, Hindi, or Kannada
- **Context-aware responses** based on your current emotional state
- **Natural conversation flow** for music discovery assistance

### 🌍 Multilingual Interface
- **3 languages supported**: English, Hindi, Kannada
- **Instant language switching** without page refresh
- **Backend syncing** - Language preference automatically updates backend
- **Consistent translations** across all UI elements

### 🎨 User Experience
- **Beautiful glassmorphism UI** with Tailwind CSS
- **Smooth animations** using Framer Motion
- **Responsive design** - Works perfectly on desktop and mobile
- **Emotion-based color themes** - UI colors change based on detected emotion
- **Loading states and error handling** for seamless interactions

## 🏗️ Architecture

### Frontend Stack
- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide Icons** - UI icons
- **Vite** - Build tool (fast dev server)

### Backend Stack
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin request handling
- **OpenCV (cv2)** - Video frame processing
- **FER (Facial Expression Recognition)** - Emotion detection model
- **SQLite3** - Database for songs and users
- **Bcrypt** - Password hashing
- **Google Genai** - AI chatbot integration

### Key Technologies
- **Motion JPEG (MJPEG)** streaming for real-time video
- **RESTful API** with JSON communication
- **Session management** with Flask sessions
- **Multiprocessing** for concurrent emotion detection

## 📁 Project Structure

```
MoodTunes/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.tsx              # Main music discovery page
│   │   │   ├── EmotionDetectionPage.tsx  # Webcam & emotion detection
│   │   │   ├── ChatbotPage.tsx           # AI assistant chat
│   │   │   ├── LoginPage.tsx             # User authentication
│   │   │   ├── RegisterPage.tsx          # User registration
│   │   │   ├── Navigation.tsx            # Top & bottom navigation
│   │   │   ├── SongCard.tsx              # YouTube player card
│   │   │   ├── EmotionBackground.tsx     # Dynamic background
│   │   │   └── ...
│   │   ├── api/
│   │   │   └── apiClient.ts              # Typed API client
│   │   ├── App.tsx                       # Main app component
│   │   └── main.tsx                      # Entry point
│   └── package.json
│
├── server/                          # Flask backend
│   ├── scripts/
│   │   ├── UI.py                         # Flask API server
│   │   ├── detectionModel.py             # Emotion detection process
│   │   ├── load_music.py                 # Database music loader
│   │   ├── push-to-db.py                 # Database initialization
│   │   └── ...
│   └── main.py                           # App entry point
│
├── DB/                              # Database files
│   ├── users.sqlite                      # User credentials
│   ├── emotion_songs.sqlite              # Song library with emotions
│   └── ...
│
├── scripts/                         # Data and utilities
│   ├── data.json                         # Sample music data
│   ├── static/                           # CSS/assets
│   └── templates/                        # HTML templates (legacy)
│
├── pyproject.toml                   # Python dependencies
├── main.py                          # Main entry point
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Webcam (for emotion detection)
- Google Gemini API key (for chatbot)

### Backend Setup

1. **Install Python dependencies**
```bash
cd /home/hrishikesh/work/MoodTunes
pip install -r pyproject.toml
# Or manually install:
pip install flask flask-cors opencv-python fer python-dotenv google-genai
```

2. **Set up environment variables**
```bash
# Create .env file in root directory
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

3. **Initialize database**
```bash
python server/scripts/push-to-db.py  # Creates users.sqlite
python server/scripts/load_music.py   # Populates emotion_songs.sqlite
```

4. **Start the backend server**
```bash
python main.py
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Install Node dependencies**
```bash
cd client
npm install
```

2. **Start the development server**
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

3. **Build for production**
```bash
npm run build
# Generates optimized build in dist/
```

## 📱 Usage

### 1. **Authentication**
   - Register with email and password
   - Login to access all features
   - Credentials stored securely with bcrypt hashing

### 2. **Home Page**
   - Browse all available songs
   - Filter by emotion (Happy, Sad, Angry, etc.)
   - Filter by language
   - Click play button to watch YouTube video

### 3. **Emotion Detection**
   - Navigate to "Detect" tab
   - Click "Start Camera" button
   - Allow camera access
   - See real-time webcam with emotion overlay
   - Backend automatically recommends songs for detected emotion
   - Emotion updates every 2 seconds
   - Watch recommended songs as YouTube videos

### 4. **Chat with AI**
   - Go to "Chat" tab
   - Ask questions about music recommendations
   - AI responds based on your current mood
   - Change language anytime from top navigation

### 5. **Language Switching**
   - Click language selector (top right on desktop, top right on mobile)
   - Choose English, Hindi, or Kannada
   - All content updates instantly without refresh
   - Backend syncs language preference

## 🔌 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration

### Songs
- `GET /all_songs?lang=en` - Get all songs (optionally filtered by language)
- `GET /current_emotion?lang=en` - Get current emotion and recommended songs

### Emotion Detection
- `GET /start_emotion_detection` - Get current emotion status
- `GET /video_feed` - Stream MJPEG video with emotion detection overlays

### Language
- `POST /set_language` - Set language preference

### Chat
- `POST /chat` - Send message to AI chatbot

### Health
- `GET /health` - Check server status

## 🎯 Supported Emotions

| Emotion | Emoji | Color |
|---------|-------|-------|
| Happy | 😊 | Amber/Yellow |
| Sad | 😢 | Blue/Indigo |
| Angry | 😠 | Orange/Red |
| Neutral | 😐 | Slate/Gray |
| Disgusted | 🤢 | Green/Emerald |
| Fearful | 😨 | Indigo/Purple |
| Surprised | 😲 | Pink/Purple |

## 🌐 Supported Languages

| Language | Code | Supported Features |
|----------|------|-------------------|
| English | `en` | Full support |
| Hindi | `hi` | UI + Music metadata |
| Kannada | `kn` | UI + Music metadata |

## 🔐 Security Features

- **Password hashing** with bcrypt (10 salt rounds)
- **Session management** with secure session keys
- **CORS protection** with credentials support
- **Input validation** on all API endpoints
- **Error handling** with sanitized error messages
- **Environment variables** for sensitive data

## 📊 Database Schema

### users.sqlite
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
)
```

### emotion_songs.sqlite
```sql
CREATE TABLE songs (
    id INTEGER PRIMARY KEY,
    name TEXT,
    emotion TEXT,
    url TEXT,
    desc TEXT,
    language TEXT
)
```

## 🎬 Real-time Features

- **MJPEG Video Streaming** - Live webcam feed at ~30 FPS
- **Emotion Detection** - Updates every 1.5 seconds (stability threshold)
- **Song Polling** - Refetches recommendations every 2 seconds
- **Automatic Language Sync** - Backend updates on language change
- **Real-time UI Updates** - No page refresh needed

## 🐛 Troubleshooting

### Camera not detected
- Check if webcam is enabled in browser settings
- Ensure camera is not in use by another application
- Grant camera permissions when prompted

### Songs not loading
- Verify `emotion_songs.sqlite` exists in `DB/` folder
- Run `python server/scripts/load_music.py` to populate database
- Check backend server is running on `http://localhost:5000`

### Language not changing
- Clear browser cache and cookies
- Verify backend `/set_language` endpoint was called (check network tab)
- Restart backend if language change persists

### Emotion not detecting
- Ensure good lighting conditions
- Face should be clearly visible to webcam
- Try moving closer to camera
- Check FER model is properly installed: `pip install fer`

### Chat not responding
- Verify `GEMINI_API_KEY` is set in `.env`
- Check internet connection
- Ensure Google Gemini API is enabled

## 📈 Performance Optimization

- **Frontend**: Lazy loading, code splitting with Vite
- **Backend**: Emotion detection in separate process
- **Video**: MJPEG streaming at optimal frame rate
- **Database**: SQLite with indexed queries
- **Memory**: Proper cleanup of intervals and listeners

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Hrishikesh** - Full-stack developer

## 🙏 Acknowledgments

- **FER Library** - Facial Expression Recognition model
- **Google Gemini** - AI chatbot integration
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling framework
- **Flask** - Web framework

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review API endpoints documentation

## 🔄 Development

### Running in Development Mode

**Terminal 1 - Backend**
```bash
python main.py
```

**Terminal 2 - Frontend**
```bash
cd client
npm run dev
```

### Building for Production

**Backend**
```bash
# Already production-ready, just run main.py
python main.py
```

**Frontend**
```bash
cd client
npm run build
npm run preview  # Preview production build locally
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [FER Documentation](https://github.com/justinshenk/fer)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

---

**Made with ❤️ for music lovers and AI enthusiasts**
