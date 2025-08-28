from flask import Flask, render_template, Response, jsonify, request
from scripts.load_music import (
    load_song_to_dict,
)  # assumes this function exists and works
import cv2
from openai import OpenAI
from dotenv import dotenv_values

app = Flask(__name__)
shared_data = None  # global reference to shared_data or detector passed from main
api_key: str = str(dotenv_values(".env")["OPENAI_API_KEY"])


def set_shared_data(data):
    global shared_data
    shared_data = data


def gen_frames():
    while True:
        if shared_data is None or shared_data.get("frame") is None:
            continue
        frame = shared_data.get("frame")

        # Convert frame (numpy array) from BGR(OpenCV default) to JPEG bytes
        ret, buffer = cv2.imencode(".jpg", frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        # Yield the frame in multipart format for streaming
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")


# Set OpenAI API key (use environment variable for safety in production)
client = OpenAI(api_key=api_key)


@app.route("/video_feed")
def video_feed():
    return Response(gen_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message},
            ],
        )
        ai_message = response.choices[0].message.content
        return jsonify({"reply": ai_message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/current_emotion")
def current_emotion():
    if shared_data is None:
        emotion = "neutral"
    else:
        emotion = shared_data.get("emotion", "neutral")

    songs: [str, dict, ...] = load_song_to_dict("DB/emotion_songs.sqlite", emotion)[:4]

    return jsonify(songs)


@app.route("/")
def index():
    current_emotion = (
        shared_data.get("emotion", "neutral") if shared_data else "neutral"
    )
    # Render template without passing song; the JS updates it dynamically
    return render_template("index.html", emotion=current_emotion)
