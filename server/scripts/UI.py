"""
MoodTunes Backend - Flask API Server
Optimized for React client communication
"""

from scripts.load_music import load_song_to_dict, load_all_songs
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from dotenv import dotenv_values
from google import genai
import sqlite3
import bcrypt
from os import urandom

app = Flask(__name__)
app.secret_key = urandom(24)
CORS(app, supports_credentials=True)  # Enable CORS for client requests

shared_data = None  # Global reference to shared_data passed from main
api_key: str = str(dotenv_values(".env").get("GEMINI_API_KEY", ""))

# Set up Gemini API key
if api_key:
    client = genai.Client(api_key=api_key)
else:
    client = None


def set_shared_data(data):
    """Set the shared data reference for emotion detection"""
    global shared_data
    shared_data = data

def check_user(email: str, password: str) -> bool:
    """Check if user exists and password matches"""
    conn = sqlite3.connect("DB/users.sqlite")
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    if row:
        stored_hash = row[0]
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode("utf-8")
        return bcrypt.checkpw(password.encode("utf-8"), stored_hash)
    return False


def hash_password(password) -> bytes:
    """Hash password using bcrypt"""
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt)


# ==================== Authentication Endpoints ====================

@app.route("/", methods=["POST"])
@app.route("/login", methods=["POST"])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not email or not password:
            return jsonify(
                {"success": False, "error": "Email and password required"}
            ), 400

        if check_user(email, password):
            session["email"] = email
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/signup", methods=["POST"])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not username or not email or not password:
            return jsonify({"success": False, "error": "All fields required"}), 400

        password_hash = hash_password(password)
        conn = sqlite3.connect("DB/users.sqlite")
        cursor = conn.cursor()

        try:
            cursor.execute(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                (username, email, password_hash),
            )
            conn.commit()
            return jsonify({"success": True}), 201
        except sqlite3.IntegrityError:
            return jsonify({"success": False, "error": "Email already registered"}), 409
        finally:
            conn.close()
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ==================== Songs Endpoints ====================


@app.route("/all_songs", methods=["GET"])
def all_songs():
    """Get all songs, optionally filtered by language"""
    try:
        lang = request.args.get("lang")
        songs = load_all_songs("DB/emotion_songs.sqlite", language=lang)
        return jsonify(songs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/current_emotion", methods=["GET"])
def current_emotion():
    """Get current emotion and recommended songs"""
    try:
        emotion = shared_data.get("emotion", "neutral") if shared_data else "neutral"
        lang = request.args.get("lang")

        songs = load_song_to_dict("DB/emotion_songs.sqlite", emotion, language=lang)[:4]
        return jsonify([emotion, songs]), 200
    except Exception as e:
        return jsonify(["error", str(e)]), 500


# ==================== Chat Endpoint ====================


@app.route("/chat", methods=["POST"])
def chat():
    """Chat with AI music assistant"""
    try:
        if not client:
            return jsonify({"error": "AI service not configured"}), 503

        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "Message required"}), 400

        prompt = (
            "You are MoodTunes AI, a helpful music assistant that helps users discover music based on their emotions. "
            "Respond in a friendly way. When recommending a song, respond ONLY with the YouTube link. "
            "User message: " + user_message
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
        )

        return jsonify({"response": response.text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Emotion Detection Endpoint ====================


@app.route("/start_emotion_detection", methods=["GET"])
def start_emotion_detection():
    """Start emotion detection (for future webcam integration)"""
    try:
        # Placeholder for future webcam emotion detection
        # Currently, emotion is updated by background process
        if shared_data and shared_data.get("emotion"):
            emotion = shared_data.get("emotion", "neutral")
        else:
            emotion = "neutral"

        # Return current emotion
        return jsonify({"emotion": emotion, "status": "detecting"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Language Endpoint ====================


@app.route("/set_language", methods=["POST"])
def set_language():
    """Set language preference"""
    try:
        data = request.get_json()
        language = data.get("language", "en")
        if shared_data is not None:
            shared_data["language"] = language
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Health Check ====================


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
