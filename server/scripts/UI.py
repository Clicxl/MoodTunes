"""
MoodTunes Backend - Flask API Server
Optimized for React client communication
"""

from scripts.load_music import load_song_to_dict, load_all_songs
from flask import Flask, jsonify, request, session, Response
from flask_cors import CORS
from dotenv import dotenv_values
from google import genai
import sqlite3
import bcrypt
from numpy import zeros
from os import urandom

app = Flask(__name__)
app.secret_key = urandom(24)
CORS(app, supports_credentials=True)  # Enable CORS for client requests

shared_data = None  # Global reference to shared_data passed from main
api_key: str = str(dotenv_values(".env").get("GEMINI_API_KEY", ""))
camera_stream = None  # Global reference to camera object

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
        lang = request.args.get("lang", "en")

        # Store language in shared_data if not already set
        if shared_data and not shared_data.get("language"):
            shared_data["language"] = lang

        songs = load_song_to_dict("DB/emotion_songs.sqlite", emotion, language=lang)[:4]

        # Return emotion, songs, and current language
        return jsonify(
            {"emotion": emotion, "songs": songs, "language": lang, "status": "success"}
        ), 200
    except Exception as e:
        return jsonify(
            {"error": str(e), "emotion": "neutral", "songs": [], "language": "en"}
        ), 500


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


# ==================== Video Stream Endpoint ====================


@app.route("/video_feed", methods=["GET"])
def video_feed():
    """Stream video frames from shared_data (detectionModel process)"""

    def generate_frames():
        import cv2
        import time

        while True:
            if shared_data is None or "frame" not in shared_data:
                # Return a blank frame if no data available yet
                blank_frame = zeros((480, 640, 3), dtype="uint8")
                cv2.putText(
                    blank_frame,
                    "Waiting for camera...",
                    (100, 240),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (255, 255, 255),
                    2,
                )
                ret, buffer = cv2.imencode(".jpg", blank_frame)
                frame_bytes = buffer.tobytes()
            else:
                # Get frame from detectionModel process via shared_data
                frame = shared_data.get("frame")
                if frame is not None:
                    ret, buffer = cv2.imencode(".jpg", frame)
                    frame_bytes = buffer.tobytes()
                else:
                    # Fallback to blank frame
                    blank_frame = zeros((480, 640, 3), dtype="uint8")
                    ret, buffer = cv2.imencode(".jpg", blank_frame)
                    frame_bytes = buffer.tobytes()

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n"
                b"Content-Length: "
                + str(len(frame_bytes)).encode()
                + b"\r\n\r\n"
                + frame_bytes
                + b"\r\n"
            )

            time.sleep(0.033)  # ~30 FPS

    return Response(
        generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


# ==================== Breathing Exercise Endpoint ====================


@app.route("/breathing_exercise_complete", methods=["POST"])
def breathing_exercise_complete():
    """Log when user completes breathing exercise"""
    try:
        data = request.get_json()
        emotion = data.get("emotion", "unknown")
        duration = data.get("duration", 30)  # Default 30 seconds
        language = data.get("language", "en")

        # Log the breathing exercise completion
        import datetime

        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "event": "breathing_exercise_complete",
            "emotion": emotion,
            "duration_seconds": duration,
            "language": language,
        }

        # Store in shared_data for potential analytics
        if shared_data:
            if "breathing_stats" not in shared_data:
                shared_data["breathing_stats"] = []
            shared_data["breathing_stats"].append(log_entry)

        print(
            f"[BREATHING] User completed breathing exercise - Emotion: {emotion}, Duration: {duration}s, Language: {language}"
        )

        return jsonify(
            {
                "status": "success",
                "message": f"Breathing exercise logged for {emotion} emotion",
            }
        ), 200

    except Exception as e:
        print(f"[ERROR] Breathing exercise logging failed: {str(e)}")
        return jsonify({"status": "error", "error": str(e)}), 500


@app.route("/breathing_exercise_skipped", methods=["POST"])
def breathing_exercise_skipped():
    """Log when user skips breathing exercise"""
    try:
        data = request.get_json()
        emotion = data.get("emotion", "unknown")
        time_elapsed = data.get("time_elapsed", 0)  # How long they were in the exercise
        language = data.get("language", "en")

        import datetime

        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "event": "breathing_exercise_skipped",
            "emotion": emotion,
            "time_elapsed_seconds": time_elapsed,
            "language": language,
        }

        if shared_data:
            if "breathing_stats" not in shared_data:
                shared_data["breathing_stats"] = []
            shared_data["breathing_stats"].append(log_entry)

        print(
            f"[BREATHING] User skipped breathing exercise - Emotion: {emotion}, Elapsed: {time_elapsed}s, Language: {language}"
        )

        return jsonify(
            {
                "status": "success",
                "message": f"Breathing exercise skip logged for {emotion} emotion",
            }
        ), 200

    except Exception as e:
        print(f"[ERROR] Breathing exercise skip logging failed: {str(e)}")
        return jsonify({"status": "error", "error": str(e)}), 500


@app.route("/breathing_stats", methods=["GET"])
def breathing_stats():
    """Get breathing exercise statistics"""
    try:
        if shared_data and "breathing_stats" in shared_data:
            stats = shared_data["breathing_stats"]

            # Calculate summary
            completed = sum(
                1 for s in stats if s.get("event") == "breathing_exercise_complete"
            )
            skipped = sum(
                1 for s in stats if s.get("event") == "breathing_exercise_skipped"
            )

            return jsonify(
                {
                    "status": "success",
                    "total_exercises": len(stats),
                    "completed": completed,
                    "skipped": skipped,
                    "stats": stats,
                }
            ), 200
        else:
            return jsonify(
                {
                    "status": "success",
                    "total_exercises": 0,
                    "completed": 0,
                    "skipped": 0,
                    "stats": [],
                }
            ), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500


# ==================== Health Check ====================


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
