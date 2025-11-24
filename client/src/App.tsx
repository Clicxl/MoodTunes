import { useState } from 'react';
import { EmotionBackground } from './components/EmotionBackground';
import { Navigation } from './components/Navigation';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HomePage } from './components/HomePage';
import { EmotionDetectionPage } from './components/EmotionDetectionPage';
import { ChatbotPage } from './components/ChatbotPage';
import { FriendsPage } from './components/FriendsPage';

type Page = 'login' | 'register' | 'home' | 'emotion' | 'chatbot' | 'friends';
type Language = 'en' | 'hi' | 'kn';
type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [language, setLanguage] = useState<Language>('en');
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle login
  const handleLogin = (email: string, password: string) => {
    // Demo: Extract name from email or use default
    const name = email.split('@')[0] || 'User';
    setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  // Handle register
  const handleRegister = (name: string, email: string, password: string) => {
    setUserName(name);
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  // Handle page navigation
  const handlePageChange = (page: Page) => {
    if (!isAuthenticated && page !== 'login' && page !== 'register') {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            language={language}
            onLanguageChange={setLanguage}
            onLogin={handleLogin}
            onGoToRegister={() => setCurrentPage('register')}
          />
        );
      
      case 'register':
        return (
          <RegisterPage
            language={language}
            onLanguageChange={setLanguage}
            onRegister={handleRegister}
            onBackToLogin={() => setCurrentPage('login')}
          />
        );
      
      case 'home':
        return (
          <HomePage
            userName={userName}
            language={language}
            currentEmotion={currentEmotion}
          />
        );
      
      case 'emotion':
        return (
          <EmotionDetectionPage
            language={language}
            currentEmotion={currentEmotion}
            onEmotionChange={setCurrentEmotion}
          />
        );
      
      case 'chatbot':
        return (
          <ChatbotPage
            language={language}
            currentEmotion={currentEmotion}
            userName={userName}
          />
        );
      
      case 'friends':
        return (
          <FriendsPage
            language={language}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Dynamic background based on current emotion */}
      <EmotionBackground emotion={currentEmotion} />
      
      {/* Navigation - only show when authenticated and not on login/register */}
      {isAuthenticated && currentPage !== 'login' && currentPage !== 'register' && (
        <Navigation
          currentPage={currentPage as 'home' | 'emotion' | 'chatbot' | 'friends'}
          onPageChange={handlePageChange}
          language={language}
          onLanguageChange={setLanguage}
          currentEmotion={currentEmotion}
        />
      )}
      
      {/* Main content */}
      <main className="relative z-0">
        {renderPage()}
      </main>
    </div>
  );
}
