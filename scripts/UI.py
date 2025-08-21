from flask import Flask, render_template, Response, jsonify
from scripts.load_music import (
    load_song_to_dict,
)  # assumes this function exists and works
import cv2

app = Flask(__name__)
shared_data = None  # global reference to shared_data or detector passed from main


def set_shared_data(data):
    global shared_data
    shared_data = data


def pick_song(songs: dict, emotion: str) -> dict:
    song = songs.get(emotion.lower())
    if not song:
        return {"name": "No song found", "url": "", "line": ""}
    return {
        "name": song.get("name", ""),
        "url": song.get("url", ""),
        "line": song.get("line", ""),
    }


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


songs = load_song_to_dict("DB/emotion_songs.sqlite")


@app.route("/video_feed")
def video_feed():
    return Response(gen_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route("/current_emotion")
def current_emotion():
    if shared_data is None:
        emotion = "neutral"
    else:
        emotion = shared_data.get("emotion", "neutral")

    song = pick_song(songs, emotion)
    return jsonify(
        {
            "emotion": emotion,
            "song_name": song.get("name"),
            "song_url": song.get("url"),
            "song_line": song.get("line"),
        }
    )


@app.route("/")
def index():
    current_emotion = (
        shared_data.get("emotion", "neutral") if shared_data else "neutral"
    )
    # Render template without passing song; the JS updates it dynamically
    return render_template("index.html", emotion=current_emotion)
