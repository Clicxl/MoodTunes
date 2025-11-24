/**
 * MoodTunes API Client
 * Centralized typed API communication with Flask backend
 */

const API_BASE = 'http://localhost:5000'; // Change to match your backend URL

// ==================== Types ====================

export type Language = 'en' | 'hi' | 'kn';
export type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'disgusted' | 'fearful' | 'surprised';

export interface Song {
    emotion: Emotion;
    title: string;
    url: string;
    desc: string;
    language: Language;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export interface EmotionResponse {
    emotion: Emotion;
    songs: Array<{
        name: string;
        url: string;
        desc: string;
        language: Language;
    }>;
}

export interface ChatResponse {
    response: string;
    error?: string;
}

// ==================== Helper Functions ====================

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
}

// ==================== Authentication ====================

export const authAPI = {
    /**
     * Register a new user
     */
    async register(username: string, email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
            credentials: 'include',
        });
        return handleResponse(response);
    },

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
            }),
            credentials: 'include',
        });
        return handleResponse(response);
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        // Typically would call a /logout endpoint if it exists
        localStorage.removeItem('moodtunes_auth');
    },
};

// ==================== Songs ====================

export const songsAPI = {
    /**
     * Get all songs, optionally filtered by language
     */
    async getAllSongs(language?: Language): Promise<Song[]> {
        const params = new URLSearchParams();
        if (language) {
            // Convert 'kn' to 'ka' for backend compatibility
            const backendLang = language === 'kn' ? 'ka' : language;
            params.append('lang', backendLang);
        }
        const response = await fetch(`${API_BASE}/all_songs?${params}`, {
            credentials: 'include',
        });
        return handleResponse(response);
    },

    /**
     * Get songs for a specific emotion, optionally filtered by language
     */
    async getSongsByEmotion(emotion: Emotion, language?: Language): Promise<Song[]> {
        const params = new URLSearchParams();
        if (language) {
            // Convert 'kn' to 'ka' for backend compatibility
            const backendLang = language === 'kn' ? 'ka' : language;
            params.append('lang', backendLang);
        }
        const response = await fetch(
            `${API_BASE}/current_emotion?emotion=${emotion}&${params}`,
            { credentials: 'include' }
        );
        const data = await handleResponse<[Emotion, Song[]]>(response);
        return data[1] || [];
    },
};

// ==================== Emotion Detection ====================

export const emotionAPI = {
    /**
     * Get current emotion and recommended songs
     */
    async getCurrentEmotion(language?: Language): Promise<EmotionResponse> {
        const params = new URLSearchParams();
        if (language) {
            // Convert 'kn' to 'ka' for backend compatibility
            const backendLang = language === 'kn' ? 'ka' : language;
            params.append('lang', backendLang);
        }
        const response = await fetch(`${API_BASE}/current_emotion?${params}`, {
            credentials: 'include',
        });
        const data = await handleResponse<[Emotion, Array<{ name: string; url: string; desc: string; language: Language }>]>(response);
        return {
            emotion: data[0],
            songs: data[1],
        };
    },

    /**
     * Start emotion detection (runs for 10 seconds, then redirects)
     */
    async startDetection(): Promise<{ redirect: string }> {
        const response = await fetch(`${API_BASE}/start_emotion_detection`, {
            credentials: 'include',
        });
        return handleResponse(response);
    },

    /**
     * Set language preference for emotion detection
     */
    async setLanguage(language: Language): Promise<{ status: string }> {
        const response = await fetch(`${API_BASE}/set_language`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language }),
            credentials: 'include',
        });
        return handleResponse(response);
    },
};

// ==================== Chatbot ====================

export const chatAPI = {
    /**
     * Send a message to the AI chatbot
     */
    async sendMessage(message: string): Promise<ChatResponse> {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
            credentials: 'include',
        });
        return handleResponse(response);
    },
};

// ==================== Error Handling Utility ====================

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
}
