# UI.py
import cv2
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
from PIL import Image, ImageTk

class UI:
    def __init__(self, emotion_detector, player):
        self.root = ttk.Window(themename="darkly")
        self.root.title("Live Emotion Detection")
        self.root.geometry("1280x720")

        self.player = player
        self.emotion_detector = emotion_detector

        # Main layout frames (same as before)
        self.main_frame = ttk.Frame(self.root)
        self.main_frame.pack(fill=BOTH, expand=True)  

        #Left: Video  
        self.left_frame = ttk.Frame(self.main_frame)
        self.left_frame.pack(side=LEFT, fill=BOTH, expand=True, padx=10, pady=10)

        self.video_label = ttk.Label(self.left_frame)
        self.video_label.pack(fill=BOTH, expand=True)

        # Right: Controls
        self.right_frame = ttk.Frame(self.main_frame)
        self.right_frame.pack(side=RIGHT, fill=Y, padx=10, pady=10)

        # Emotion label
        self.emotion_text = ttk.StringVar(value="Emotion: Neutral")
        self.emotion_label = ttk.Label(
        self.right_frame, textvariable=self.emotion_text, font=("Helvetica", 32)
        )
        self.emotion_label.pack(pady=(0, 40), anchor="n")

        # Music controls
        self.music_frame = ttk.LabelFrame(self.right_frame, text="Music Controls")
        self.music_frame.pack(fill=X, pady=10, anchor="s")

        self.url_var = ttk.StringVar()
        self.url_entry = ttk.Entry(self.music_frame, textvariable=self.url_var, width=40)
        self.url_entry.pack(pady=5, padx=10)
        self.url_entry.insert(0, "Paste music URL here (MP3/YouTube)")

        btn_frame = ttk.Frame(self.music_frame)
        btn_frame.pack(pady=5)
        self.play_btn = ttk.Button(btn_frame, text="Play", bootstyle="success", command=self.music_play)
        self.play_btn.pack(side=LEFT, padx=5)
        self.stop_btn = ttk.Button(btn_frame, text="Stop", bootstyle="danger", command=self.music_stop)
        self.stop_btn.pack(side=LEFT, padx=5)

        self.root.protocol("WM_DELETE_WINDOW", self.on_close)
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)
        self.update_video()

    def music_play(self):
        url = self.url_var.get()
        self.player.update(url)

    def music_stop(self):
        self.player.stop_playback()

    def update_video(self):
        frame = self.emotion_detector.frame
        emotion = self.emotion_detector.current_emotion

        if frame is not None:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(rgb_frame)
            img = img.resize((640, 480))
            imgtk = ImageTk.PhotoImage(image=img)
            self.video_label.imgtk = imgtk
            self.video_label.configure(image=imgtk)

        self.emotion_text.set(f"Emotion: {emotion}")

        self.root.after(30, self.update_video)

    def on_close(self):
        self.player.stop_playback()
        self.root.destroy()

    def run(self):
        self.root.mainloop()
