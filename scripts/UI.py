import cv2
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
from PIL import Image, ImageTk

# Define a custom theme if you like (example uses preset "flatly")
THEME = "darkly"

class UI:
    def __init__(self, emotion_detector, player):
        self.root = ttk.Window(themename=THEME)
        self.root.title("🎼 Emotion Music Player")
        self.root.geometry("1150x700")
        self.root.resizable(False, False)

        self.player = player
        self.emotion_detector = emotion_detector

        # Main layout frames
        self.main_frame = ttk.Frame(self.root, padding=28)  # More padding
        self.main_frame.pack(fill=BOTH, expand=True)

        # Left: Video area
        self.left_frame = ttk.Frame(self.main_frame, padding=10)
        self.left_frame.pack(side=LEFT, fill=BOTH, expand=True)

        self.video_label = ttk.Label(
            self.left_frame, text="Loading video...", anchor=CENTER,
            style="primary.TLabel", font=("Inter", 15, "bold"), background="#f2f6fc"
        )
        self.video_label.pack(fill=BOTH, expand=True, padx=14, pady=14, ipadx=14, ipady=14)
        self.video_label.configure(style="info.TLabel")

        # Right: Controls area
        self.right_frame = ttk.Frame(self.main_frame, padding=(26, 14))
        self.right_frame.pack(side=RIGHT, fill=Y, padx=14, pady=14)

        # Emotion Display
        self.emotion_text = ttk.StringVar(value="Emotion: Neutral")
        self.emotion_label = ttk.Label(
            self.right_frame,
            textvariable=self.emotion_text,
            font=("Inter", 32, "bold"),
            bootstyle="info",
            background="#1f2a40",
            foreground="#4ee1a0",
            relief="flat"
        )
        self.emotion_label.pack(pady=(0, 28), ipadx=6, ipady=16, fill=X)

        ttk.Separator(self.right_frame, orient=HORIZONTAL).pack(fill=X, pady=10)

        # Music controls
        self.music_frame = ttk.LabelFrame(
            self.right_frame, text="Music Controls",
            bootstyle="success", padding=18,
            style="primary.TLabelframe",  # Custom color (if using custom theme)
        )
        self.music_frame.pack(fill=X, pady=18, ipadx=3, ipady=8)

        self.url_var = ttk.StringVar()
        self.url_entry = ttk.Entry(
            self.music_frame, textvariable=self.url_var,
            width=44, font=("Inter", 13), bootstyle="dark"
        )
        self.url_entry.pack(pady=(7, 17), padx=8)
        self.url_entry.insert(0, "")
        self.url_entry.configure(style="dark.TEntry")

        # Placeholder text fallback (ttkbootstrap doesn't have placeholder natively)
        if not self.url_var.get():
            self.url_entry.insert(0, "Paste music URL here (MP3/YouTube)")

        btn_frame = ttk.Frame(self.music_frame)
        btn_frame.pack(pady=(2, 13))
        self.play_btn = ttk.Button(
            btn_frame, text="▶ Play", bootstyle="success", width=12, command=self.music_play
        )
        self.play_btn.pack(side=LEFT, padx=10, ipadx=5, ipady=7)
        self.stop_btn = ttk.Button(
            btn_frame, text="⏹ Stop", bootstyle="danger", width=12, command=self.music_stop
        )
        self.stop_btn.pack(side=LEFT, padx=10, ipadx=5, ipady=7)

        ttk.Separator(self.right_frame, orient=HORIZONTAL).pack(fill=X, pady=11)

        # Footer/message
        footer_label = ttk.Label(
            self.right_frame,
            text="Made with Python ❤️ Modern UI",
            font=("Inter", 12, "italic"),
            foreground="#a2aeb8",
            anchor="center"
        )
        footer_label.pack(side="bottom", pady=16)

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
            self.video_label.configure(image=imgtk, text="")

        self.emotion_text.set(f"Emotion: {emotion}")

        self.root.after(30, self.update_video)

    def on_close(self):
        self.player.stop_playback()
        self.root.destroy()

    def run(self):
        self.root.mainloop()
