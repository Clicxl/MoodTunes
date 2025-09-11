from scripts.load_music import load_song_to_dict, load_all_songs
from flask import Flask, render_template, Response, jsonify, request, redirect, session
import time
import cv2
from dotenv import dotenv_values
from google import genai
import sqlite3
import bcrypt
from os import urandom

app = Flask(__name__)
app.secret_key = urandom(24)
shared_data = None  # global reference to shared_data or detector passed from main
api_key: str = str(dotenv_values(".env")["GEMINI_API_KEY"])


def set_shared_data(data):
    global shared_data
    shared_data = data


def gen_frames():
    while True:
        if shared_data is None or shared_data.get("frame") is None:
            continue
        frame = shared_data["frame"]
        ret, buffer = cv2.imencode(".jpg", frame)
        if not ret:
            continue
        frame = buffer.tobytes()
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")
        frame = shared_data.get("frame")

        # Convert frame (numpy array) from BGR(OpenCV default) to JPEG bytes
        ret, buffer = cv2.imencode(".jpg", frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        # Yield the frame in multipart format for streaming
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")


def check_user(email: str, password: str) -> bool:
    """Return True if user exists and password matches, else False."""
    conn = sqlite3.connect("DB/users.sqlite")
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    if row:
        stored_hash = row[0]
        # stored_hash may be a bytes or str type depending on how it was stored
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode("utf-8")
        return bcrypt.checkpw(password.encode("utf-8"), stored_hash)
    return False


def hash_password(password) -> bytes:
    bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(bytes, salt)
    return hash


# Set up Gemini API key
client = genai.Client(api_key=api_key)


@app.route("/video_feed")
def video_feed():
    return Response(gen_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route("/start_emotion_detection")
def start_emotion_detection():
    start_time = time.time()
    last_emotion = "neutral"

    while time.time() - start_time < 10:  # Run for 10 seconds
        if shared_data and shared_data.get("emotion"):
            last_emotion = shared_data.get("emotion")

    # Check if emotion requires breathing exercise
    if last_emotion.lower() in ["sad", "angry"]:
        return jsonify({"redirect": "/breathing"})

    return jsonify({"redirect": "/home"})


@app.route("/breathing")
def breathing():
    last_emotion = "neutral"    
    if shared_data and shared_data.get("emotion"):
            last_emotion = shared_data.get("emotion")

    return render_template("breathing.html", emotion=last_emotion)


# Route to get all songs from the DB
@app.route("/all_songs")
def all_songs():
    try:
        songs = load_all_songs("DB/emotion_songs.sqlite")
        return jsonify(songs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")

        # Add context for the music assistant
        prompt = (
            """You are MoodTunes AI, a helpful music assistant that helps users discover music based on their emotions and preferences. 
        Respond in a friendly and engaging way, focusing on music recommendations and emotional connections to songs.
        When recommending a song, respond ONLY with the song's YouTube link. NO additional text or explanation.

        User message: """
            + user_message
        )

        # Generate response using Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
        )  # Get the response text

        response_text = response.text

        return jsonify({"response": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/current_emotion")
def current_emotion():
    try:
        if shared_data is None:
            emotion = "neutral"
        else:
            emotion = shared_data.get("emotion", "neutral")
        songs = load_song_to_dict("DB/emotion_songs.sqlite", emotion)[:4]
        return jsonify([emotion, songs]), 200
    except Exception as e:
        return jsonify(["error", str(e)]), 500


@app.route("/")
@app.route("/login", methods=["GET", "POST"])
def login():
    msg = ""
    if (
        request.method == "POST"
        and "email" in request.form
        and "password" in request.form
    ):
        email = request.form["email"]
        password = request.form["password"]

        # Check if user exists in the database
        user = check_user(email, password)

        if user:
            session["email"] = email
            msg = ""
            return redirect("/home")  # Redirect to home page on successful login
        else:
            msg = "Error: Invalid credentials, please try again."
            return render_template("login.html", msg=msg)

    return render_template("login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    msg = ""
    if (
        request.method == "POST"
        and "username" in request.form
        and "email" in request.form
        and "password" in request.form
    ):
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        # Hash password before storing
        password_hash = hash_password(password)

        # Add user to the database
        conn = sqlite3.connect("DB/users.sqlite")
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                (username, email, password_hash),
            )
            conn.commit()
            return redirect("/login")
        except sqlite3.IntegrityError:
            msg = "Error: User with this email already exists."
            return render_template("register.html", msg=msg)
        finally:
            conn.close()

    return render_template("register.html", msg=msg)


@app.route("/emotion_detection")
def emotion_detection():
    current_emotion = (
        shared_data.get("emotion", "neutral") if shared_data else "neutral"
    )
    # Render template without passing song; the JS updates it dynamically
    return render_template("emotion.html", emotion=current_emotion)


@app.route("/home")
def index():
    if "email" not in session:
        return redirect("/login")

    # Get username from the database
    email = session["email"]
    conn = sqlite3.connect("DB/users.sqlite")
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    username = user[0] if user else "Guest"
    # Render template with username and emotion
    return render_template("index.html", username=username)
